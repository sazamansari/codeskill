require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Models
const ProblemMetadata = require("./models/ProblemMetadata");
const ProblemStatement = require("./models/ProblemStatement");
const ProblemConfig = require("./models/ProblemConfig");
const ProblemTestCase = require("./models/ProblemTestCase");

const { generateStarterCode, generateReferenceSolutions, getSupportedLanguages } = require("./seed-data/templates/language-templates");
const allQuestions = require("./seed-data/questions/index");

async function seedDSA() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Optional: Only clear if you want a fresh start, otherwise we just append.
    // Uncomment these if you want to wipe the collections first:
    console.log("Clearing existing problems...");
    await ProblemMetadata.deleteMany({});
    await ProblemStatement.deleteMany({});
    await ProblemConfig.deleteMany({});
    await ProblemTestCase.deleteMany({});

    console.log(`Starting to seed ${allQuestions.length} DSA questions...`);
    let count = 0;

    for (const q of allQuestions) {
      try {
        // 1. Generate Starter and Reference Codes
        const starterCode = generateStarterCode(q.functionSignature);
        const referenceSolution = generateReferenceSolutions(q.functionSignature);
        const supportedLanguages = getSupportedLanguages();

        // 2. Insert ProblemMetadata
        const metadata = new ProblemMetadata({
          title: q.title,
          slug: q.slug,
          difficulty: q.difficulty,
          categories: q.categories,
          tags: q.tags,
          visibility: "Published",
          stats: {
            totalSubmissions: Math.floor(Math.random() * 5000),
            acceptedSubmissions: Math.floor(Math.random() * 3000),
            acceptanceRate: Math.floor(Math.random() * 40) + 40,
          },
          // SEO
          metaTitle: `${q.title} - CodeSkill DSA`,
          metaDescription: `Solve the ${q.title} problem on CodeSkill. Master ${q.topic} with this ${q.difficulty.toLowerCase()} level algorithmic challenge.`,
          keywords: [q.topic.toLowerCase(), "coding", "interview", "dsa", ...q.tags]
        });

        const savedMetadata = await metadata.save();
        const metadataId = savedMetadata._id;

        // 3. Format Editorial into Description if available
        let finalDescription = q.statement.description;
        if (q.editorial) {
          finalDescription += `\n\n## Hints\n`;
          if (q.hints && q.hints.length > 0) {
            q.hints.forEach((hint, idx) => {
              finalDescription += `${idx + 1}. ${hint}\n`;
            });
          }

          finalDescription += `\n## Editorial\n`;
          finalDescription += `### Intuition\n${q.editorial.intuition}\n\n`;
          finalDescription += `### Approach\n**Brute Force:** ${q.editorial.bruteForce}\n\n`;
          finalDescription += `**Optimal:** ${q.editorial.optimalApproach}\n\n`;
          finalDescription += `**Time Complexity:** ${q.editorial.timeComplexity}\n`;
          finalDescription += `**Space Complexity:** ${q.editorial.spaceComplexity}\n`;
        }

        // 4. Insert ProblemStatement
        const statement = new ProblemStatement({
          metadataId: metadataId,
          description: finalDescription,
          inputFormat: q.statement.inputFormat,
          outputFormat: q.statement.outputFormat,
          constraints: q.statement.constraints,
          samples: q.samples || []
        });
        const savedStatement = await statement.save();

        // 5. Insert ProblemConfig
        const config = new ProblemConfig({
          metadataId: metadataId,
          supportedLanguages: supportedLanguages,
          timeLimit: q.executionConfig?.timeLimit || 2000,
          memoryLimit: q.executionConfig?.memoryLimit || 256,
          starterCode: starterCode,
          referenceSolution: referenceSolution
        });
        const savedConfig = await config.save();

        // 6. Insert ProblemTestCase
        const allCases = [];
        if (q.samples) {
          q.samples.forEach(s => {
            allCases.push({
              input: s.input,
              output: s.output,
              isHidden: false,
              explanation: s.explanation,
              weight: 1
            });
          });
        }
        if (q.hiddenTestCases) {
          q.hiddenTestCases.forEach(h => {
            allCases.push({
              input: h.input,
              output: h.output,
              isHidden: true,
              weight: 2
            });
          });
        }

        const testCases = new ProblemTestCase({
          metadataId: metadataId,
          cases: allCases
        });
        const savedTestCases = await testCases.save();

        // 7. Link back to Metadata
        savedMetadata.statement = savedStatement._id;
        savedMetadata.config = savedConfig._id;
        savedMetadata.testCases = savedTestCases._id;
        await savedMetadata.save();

        count++;
        if (count % 25 === 0) {
          console.log(`Successfully seeded ${count}/${allQuestions.length} questions...`);
        }
      } catch (err) {
        if (err.code === 11000) {
          console.log(`Skipped duplicate question: ${q.title}`);
        } else {
          console.error(`Error processing question ${q.title}:`, err);
        }
      }
    }

    console.log(`\nSeed completed! Successfully seeded ${count} questions.`);
    process.exit(0);

  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
}

seedDSA();
