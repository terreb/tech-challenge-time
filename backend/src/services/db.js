'use strict';

// const mysql = require( 'mysql' );
//
// const poolMySQL = mysql.createPool( {
//     host: '172.17.0.1',
//     database: 'company',
//     user: 'root',
//     password: 'pass',
// } );
//
// exports.query = ( query, vars ) => {
//     console.log( '/------------- MySQL query ------------/' );
//     console.log( query );
//     return new Promise( ( res, rej ) => {
//         poolMySQL.query( query, vars, ( error, rows ) => {
//             if ( !error ) {
//                 console.log( rows );
//                 res( rows );
//             } else {
//                 console.log( 'DB. Error while performing query. See details below. \n', query, '\n', error );
//                 rej( error.message );
//             }
//             console.log( '/----------- MySQL query end ----------/' );
//         } );
//     } )
// };
