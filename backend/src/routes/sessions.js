'use strict';

const router = require( 'express' ).Router();
// const { query } = require( '../services/db' );

const saveSession = async ( req, res ) => {
    try {
        const { name, startTime, endTime } = req.body;
        // await query( `INSERT IGNORE INTO sessions (name, startTime, endTime) VALUES (${name}, ${startTime}, ${endTime})` );
        return res.status( 200 ).json( { success: true } )
    }
    catch(e) {
        console.log(e)
        return res.status( 500 ).json( { success: false } )
    }
};

router.post( '/savesession', saveSession );

module.exports = router;