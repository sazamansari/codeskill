require("dotenv").config();
const mongoose = require("mongoose");

const ProblemMetadata = require("./models/ProblemMetadata");
const ProblemStatement = require("./models/ProblemStatement");
const ProblemConfig = require("./models/ProblemConfig");
const ProblemTestCase = require("./models/ProblemTestCase");

async function validateSeed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB\n");

    const totalMetadata = await ProblemMetadata.countDocuments();
    const totalStatements = await ProblemStatement.countDocuments();
    const totalConfigs = await ProblemConfig.countDocuments();
    const totalTestCases = await ProblemTestCase.countDocuments();

    console.log("--- Collection Counts ---");
    console.log(`ProblemMetadata:  ${totalMetadata}`);
    console.log(`ProblemStatement: ${totalStatements}`);
    console.log(`ProblemConfig:    ${totalConfigs}`);
    console.log(`ProblemTestCase:  ${totalTestCases}`);

    if (totalMetadata >= 300) {
      console.log("\n✅ SUCCESS: 300 or more questions found in the database.");
    } else {
      console.log(`\n❌ ERROR: Expected at least 300 questions, but found ${totalMetadata}.`);
    }
    
    // Check missing relations
    const missingStatement = await ProblemMetadata.countDocuments({ statement: { $exists: false } });
    const missingConfig = await ProblemMetadata.countDocuments({ config: { $exists: false } });
    const missingTestCases = await ProblemMetadata.countDocuments({ testCases: { $exists: false } });
    
    console.log("\n--- Relational Integrity ---");
    console.log(`Metadata missing Statement:  ${missingStatement}`);
    console.log(`Metadata missing Config:     ${missingConfig}`);
    console.log(`Metadata missing TestCases:  ${missingTestCases}`);

    if (missingStatement === 0 && missingConfig === 0 && missingTestCases === 0) {
      console.log("✅ SUCCESS: All relations are intact.");
    } else {
      console.log("❌ ERROR: Some relational references are missing.");
    }

    // Check Topics distribution
    const topics = await ProblemMetadata.aggregate([
      { $unwind: "$categories" },
      { $group: { _id: "$categories", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log("\n--- Categories Distribution ---");
    topics.forEach(t => console.log(`${t._id}: ${t.count}`));

    process.exit(0);
  } catch (error) {
    console.error("Validation failed:", error);
    process.exit(1);
  }
}

validateSeed();
