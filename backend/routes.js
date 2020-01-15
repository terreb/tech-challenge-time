'use strict';

const router = require( 'express' ).Router();
const logger = require( './src/middleware/logger' );
const sessions = require( './src/routes/sessions' );

router.use( logger.logRequest );

router.use( '/sanity', ( req, res ) => res.json( { status: 'ok' } ) );
router.use( '/sessions', sessions );

module.exports = router;