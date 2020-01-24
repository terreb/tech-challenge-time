'use strict';

const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type Session {
    id: String,
    name: String,
    startTime: String,
    endTime: String
  },
  type Mutation {
    setSession(id: String!, name: String!, startTime: String!, endTime: String!): Boolean
  }
  type Query {
    hello: String,
    getSession(id: String!): Session,
    getSessions: [Session],
  }
`);

module.exports = schema;