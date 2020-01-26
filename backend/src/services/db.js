const { Pool } = require( 'pg' );

const pool = new Pool( {
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'pass',
    port: 5432,
} );

pool.on('error', (err, client) => {
    console.log(err);
    process.exit(-1)
});

module.exports = async ( query, values ) => {
    try {
        const res = await pool.query( query, values );
        return res.rows;
    } catch (err) {
        throw err
    }
};