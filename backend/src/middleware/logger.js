'use strict';

exports.logRequest = ( req, res, next ) => {
    console.log( '/-------- incoming http request -------/' );
    console.log( `route: ${req.url}` );
    console.log( 'body:' )
    console.log( req.body );
    console.log( '/-------- incoming request end --------/' );
    next();
};