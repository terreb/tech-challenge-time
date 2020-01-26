'use strict';

const { buildSchema } = require( 'graphql' );

const schema = buildSchema( `
  input SessionInput {
    startTime: String!,
    endTime: String!
  }
  type Session {
    startTime: String!,
    endTime: String!
  },
  type Mutation {
    addSession(id: String!, name: String, session: SessionInput!): Boolean,
    deleteProject(id: String): Boolean,
    renameProject(id: String, name: String): Boolean
  }
  type Sessions {
    id: String,
    name: String,
    sessions: [Session]
  }
  type Query {
    sanity: String,
    getSessions(id: String): [Sessions]
  }
` );

module.exports = schema;