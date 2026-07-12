const Problem = require('../models/Problem');
const ProblemVersion = require('../models/ProblemVersion');
const ProblemStatement = require('../models/ProblemStatement');
const ProblemEnvironment = require('../models/ProblemEnvironment');
const ProblemTemplate = require('../models/ProblemTemplate');
const ProblemSolution = require('../models/ProblemSolution');
const ProblemTestCase = require('../models/ProblemTestCase');
const ProblemEditorial = require('../models/ProblemEditorial');

const resolvers = {
  Query: {
    problem: async (_, { slug }) => {
      return await Problem.findOne({ slug });
    },
    problems: async (_, { cursor, limit = 20 }) => {
      const query = {};
      if (cursor) {
        query._id = { $lt: cursor };
      }
      const problems = await Problem.find(query).sort({ _id: -1 }).limit(limit + 1);
      const hasNextPage = problems.length > limit;
      if (hasNextPage) problems.pop();
      const nextCursor = hasNextPage ? problems[problems.length - 1]._id : null;
      return {
        edges: problems,
        pageInfo: { hasNextPage, nextCursor }
      };
    }
  },
  Problem: {
    versions: async (parent) => {
      return await ProblemVersion.find({ problemId: parent._id });
    }
  },
  ProblemVersion: {
    statement: async (parent) => {
      if (!parent.statementId) return null;
      return await ProblemStatement.findById(parent.statementId);
    },
    environment: async (parent) => {
      if (!parent.environmentId) return null;
      return await ProblemEnvironment.findById(parent.environmentId);
    },
    template: async (parent) => {
      if (!parent.templateId) return null;
      return await ProblemTemplate.findById(parent.templateId);
    },
    solution: async (parent) => {
      if (!parent.solutionId) return null;
      return await ProblemSolution.findById(parent.solutionId);
    },
    testCase: async (parent) => {
      if (!parent.testCaseId) return null;
      return await ProblemTestCase.findById(parent.testCaseId);
    },
    editorial: async (parent) => {
      if (!parent.editorialId) return null;
      return await ProblemEditorial.findById(parent.editorialId);
    }
  }
};

module.exports = resolvers;
