'use strict';

const express = require( 'express' );
const app = express();
const cors = require( 'cors' );
const graphqlHTTP = require( 'express-graphql' );
const schema = require( './src/schemas/schema' );
const root = require( './src/resolvers' );

app.use( cors() ); // THIS IS ONLY FOR TESTING ON LOCALHOST !!!
app.use( express.json() );
app.use( express.urlencoded( { extended: true } ) );
app.use( '/graphql', graphqlHTTP( {
    schema: schema,
    rootValue: root,
    graphiql: true,
} ) );

app.listen( 3000 );
console.log( 'info', 'api running on port 3000' );

module.exports = app;