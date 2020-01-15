'use strict';

const express = require( 'express' );
const app = express();
const routes = require( './routes' );
const cors = require( 'cors' );

app.use( cors() ); // THIS IS ONLY FOR TESTING ON LOCALHOST !!!
app.use( express.json() );
app.use( express.urlencoded( { extended: true } ) );

app.use( '/', routes );

app.listen( 3000 );
console.log( 'info', 'api running on port 3000' );

module.exports = app;