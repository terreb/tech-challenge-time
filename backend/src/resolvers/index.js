'use strict';

const { getSessions, setSession } = require( './sessions' );

module.exports = {
    sanity: () => 'No worries, I\'m ok!',
    getSessions: () => getSessions(),
    setSession: session => setSession( session )
};