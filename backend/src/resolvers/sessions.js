'use strict';

const dbQuery = require( '../services/db' );
// const data = {}; // for now store data in a variable

const getSessions = async ( { id } ) => {
    try {
        // if ( id ) {
        //     if ( data[ id ] ) {
        //         const { name, sessions } = data[ id ];
        //         // send flatten data
        //         return [ { id, name, sessions } ]
        //     } else {
        //         throw new Error();
        //     }
        //
        // } else {
        //     // send flatten data
        //     return Object.entries( data ).map( ( [ key, value ] ) => ({ id: key, ...value }) )
        // }
        let query = `
            SELECT p.id, p.name,
            coalesce(
                (
                    SELECT json_agg(json_build_object('startTime', s.startTime, 'endTime', s.endTime))
                    FROM sessions s WHERE p.id = s.projectId
                ), 
                '[]'
            ) AS sessions
            FROM projects p
        `;
        if ( id ) query += ' WHERE p.id = $1';
        query += ';';
        const args = id ? [ query, [ id ] ] : [ query ];
        const res = await dbQuery( ...args );
        console.log(JSON.stringify(res));
        return res;
    } catch ( e ) {
        console.log( e );
        return []
    }
};

const addSession = async ( { id, name, session: { startTime, endTime } } ) => {
    try {
        // add session to existing project, as well as create project if new
        // if ( !data[ id ] ) data[ id ] = { name, sessions: [] };
        // data[ id ].sessions.push( { startTime, endTime } );
        await dbQuery( 'INSERT INTO projects(id, name) VALUES($1, $2);', [ id, name ] );
        await dbQuery( 'INSERT INTO sessions(projectId, startTime, endTime) VALUES($1, $2, $3);', [ id, startTime, endTime ] );
        return true;
    } catch ( e ) {
        console.log( e );
        return false;
    }
};

const deleteProject = async ( { id } ) => {
    try {
        // console.log(data[ id ]);
        // data[ id ] ? delete data[ id ] : new Error();
        await dbQuery( 'DELETE FROM sessions WHERE projectId = $1', [ id ] );
        await dbQuery( 'DELETE FROM projects WHERE id = $1;', [ id ] );
        return true;
    } catch ( e ) {
        console.log( e );
        return false;
    }
};

const renameProject = async ( { id, name } ) => {
    try {
        // data[ id ].name = name;
        await dbQuery( 'UPDATE projects SET name = $2 WHERE id = $1;', [ id ] );
        return true;
    } catch ( e ) {
        console.log( e );
        return false;
    }
};


module.exports = {
    getSessions,
    addSession,
    deleteProject,
    renameProject
};

