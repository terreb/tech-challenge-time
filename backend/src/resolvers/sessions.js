'use strict';

const dbQuery = require( '../services/db' );

const getSessions = async ( { id } ) => {
    try {
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
            GROUP BY p.id, p.name
        `;
        if ( id ) query += ' WHERE p.id = $1';
        query += ';';
        const args = id ? [ query, [ id ] ] : [ query ];
        return await dbQuery( ...args );
    } catch ( e ) {
        console.log( e );
        return []
    }
};

const addSession = async ( { id, name, session: { startTime, endTime } } ) => {
    try {
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

