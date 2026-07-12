const QueueManager = require('./queueManager');
const ProblemMetadata = require('../../models/ProblemMetadata');
const ProblemStatement = require('../../models/ProblemStatement');
const ProblemConfig = require('../../models/ProblemConfig');
const ProblemTestCase = require('../../models/ProblemTestCase');

/**
 * Processor for handling bulk import of problems via JSON/CSV.
 */
const bulkImportProcessor = async (job) => {
  console.log(`[BulkImportProcessor] Processing job ${job.id}`);
  
  const { problems, authorId } = job.data;
  let successCount = 0;
  let failCount = 0;
  const errors = [];

  for (const item of problems) {
    try {
      // Create Split Collections
      const metadata = await ProblemMetadata.create({
        ...item.metadata,
        author: authorId,
        status: 'Draft',
        slug: `${item.metadata.slug || item.metadata.title.toLowerCase().replace(/ /g, '-')}-${Date.now()}`
      });

      const statement = await ProblemStatement.create({
        ...item.statement,
        metadataId: metadata._id
      });

      const config = await ProblemConfig.create({
        ...item.config,
        metadataId: metadata._id
      });

      const testCases = await ProblemTestCase.create({
        ...item.testCases,
        metadataId: metadata._id
      });

      // Link collections
      metadata.statement = statement._id;
      metadata.config = config._id;
      metadata.testCases = testCases._id;
      await metadata.save();

      successCount++;
    } catch (error) {
      console.error(`[BulkImportProcessor] Failed to import problem:`, error.message);
      failCount++;
      errors.push({ title: item.metadata?.title, error: error.message });
    }
  }

  console.log(`[BulkImportProcessor] Finished Job ${job.id}. Success: ${successCount}, Failed: ${failCount}`);
  
  return { successCount, failCount, errors };
};

// Initialize Queue and Worker
const bulkImportQueue = QueueManager.initQueue('bulkImport', bulkImportProcessor, { concurrency: 1 });

module.exports = bulkImportQueue;
