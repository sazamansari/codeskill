require("dotenv").config();
const mongoose = require("mongoose");
const ProblemMetadata = require("./models/ProblemMetadata");

const categories = ["Arrays", "Strings", "Dynamic Programming", "Trees", "Graphs", "Math", "Linked Lists", "Sorting", "Greedy", "Backtracking"];
const difficulties = ["Easy", "Medium", "Hard"];

const adjectives = ["Maximum", "Minimum", "Longest", "Shortest", "Valid", "Merge", "Reverse", "Sort", "Find", "Count", "Check", "Construct", "Search in", "Remove", "Add", "Design", "Implement"];
const nouns = ["Subarray", "Substring", "Path", "Sequence", "Tree", "Graph", "List", "Matrix", "String", "Number", "Array", "Palindrome", "Anagram", "BST", "Binary Tree", "Intervals", "Elements"];
const modifiers = ["Sum", "Product", "Difference", "Pairs", "Duplicates", "Frequency", "Length", "Depth", "Order", "Arrangement", "Permutations", "Combinations"];

function generateRandomTitle(index) {
  // Generate some realistic sounding Leetcode-like titles
  const hardcoded = [
    "Two Sum", "Add Two Numbers", "Longest Substring Without Repeating Characters", 
    "Median of Two Sorted Arrays", "Longest Palindromic Substring", "Zigzag Conversion", 
    "Reverse Integer", "String to Integer (atoi)", "Palindrome Number", "Regular Expression Matching",
    "Container With Most Water", "Integer to Roman", "Roman to Integer", "Longest Common Prefix",
    "3Sum", "3Sum Closest", "Letter Combinations of a Phone Number", "4Sum", "Remove Nth Node From End of List",
    "Valid Parentheses", "Merge Two Sorted Lists", "Generate Parentheses", "Merge k Sorted Lists",
    "Swap Nodes in Pairs", "Reverse Nodes in k-Group", "Remove Duplicates from Sorted Array"
  ];
  
  if (index < hardcoded.length) {
    return hardcoded[index];
  }

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
  if (Math.random() > 0.5) {
    const mod = modifiers[Math.floor(Math.random() * modifiers.length)];
    return `${adj} ${mod} of ${noun}`;
  }
  
  return `${adj} ${noun}`;
}

function generateSlug(title, id) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") + "-" + id;
}

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Optional: clear existing
    // await ProblemMetadata.deleteMany({});
    
    const problems = [];
    
    for (let i = 0; i < 300; i++) {
      const title = generateRandomTitle(i);
      const diff = difficulties[Math.floor(Math.random() * difficulties.length)];
      
      // Select 1 to 3 random categories
      const numCategories = Math.floor(Math.random() * 3) + 1;
      const catSet = new Set();
      while(catSet.size < numCategories) {
        catSet.add(categories[Math.floor(Math.random() * categories.length)]);
      }
      
      const totalSubmissions = Math.floor(Math.random() * 100000);
      const acceptedSubmissions = Math.floor(totalSubmissions * (Math.random() * 0.6 + 0.2)); // 20% to 80% acceptance
      const acceptanceRate = totalSubmissions > 0 ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(1) : 0;

      problems.push({
        title,
        slug: generateSlug(title, i),
        difficulty: diff,
        categories: Array.from(catSet),
        tags: Array.from(catSet),
        visibility: "Published",
        stats: {
          totalSubmissions,
          acceptedSubmissions,
          acceptanceRate
        }
      });
    }

    console.log(`Inserting ${problems.length} problems...`);
    await ProblemMetadata.insertMany(problems);
    console.log("Successfully seeded 300 DSA problems.");
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seed();
