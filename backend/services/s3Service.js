const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');

// Setup S3 Client
// In production, IAM roles on EC2 will provide credentials if keys aren't set
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  ...(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  })
});

const S3_BUCKET_NAME = process.env.S3_TEST_CASES_BUCKET || 'codeskill-test-cases';

/**
 * Generates a pre-signed URL for uploading a large test case file directly from the client/backend to S3.
 * @param {string} problemSlug - The slug of the problem
 * @param {string} fileType - The mime type of the file
 * @returns {Promise<{uploadUrl: string, fileKey: string}>}
 */
const generateUploadUrl = async (problemSlug, fileType = 'application/json') => {
  const fileId = crypto.randomUUID();
  const fileKey = `testcases/${problemSlug}/${fileId}.json`;
  
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: fileKey,
    ContentType: fileType,
  });

  // URL expires in 15 minutes
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
  
  return { uploadUrl, fileKey };
};

/**
 * Generates a pre-signed URL for downloading a test case file from S3.
 * @param {string} fileKey - The S3 object key
 * @returns {Promise<string>}
 */
const generateDownloadUrl = async (fileKey) => {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: fileKey,
  });

  // URL expires in 60 minutes
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

module.exports = {
  s3Client,
  generateUploadUrl,
  generateDownloadUrl,
  S3_BUCKET_NAME
};
