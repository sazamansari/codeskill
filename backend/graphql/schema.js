const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Problem {
    id: ID!
    title: String!
    slug: String!
    difficulty: String!
    tags: [String]
    author: String
    versions: [ProblemVersion]
  }

  type ProblemVersion {
    id: ID!
    versionNumber: Int!
    status: String!
    visibility: String!
    statement: ProblemStatement
    environment: ProblemEnvironment
    template: ProblemTemplate
    solution: ProblemSolution
    testCase: ProblemTestCase
    editorial: ProblemEditorial
  }

  type ProblemStatement {
    id: ID!
    description: String!
    inputFormat: String
    outputFormat: String
    constraints: String
  }

  type ProblemEnvironment {
    id: ID!
    problemType: String!
    supportedLanguages: [String]
    customDockerImage: String
  }

  type ProblemTemplate {
    id: ID!
    isMultiFile: Boolean!
  }

  type ProblemSolution {
    id: ID!
    hasCustomChecker: Boolean!
  }

  type ProblemTestCase {
    id: ID!
    s3BucketUrl: String
  }

  type ProblemEditorial {
    id: ID!
    content: String
    videoUrl: String
  }

  type Query {
    problem(slug: String!): Problem
    problems(cursor: ID, limit: Int): ProblemConnection!
  }

  type ProblemConnection {
    edges: [Problem!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    nextCursor: ID
  }
`;

module.exports = typeDefs;
