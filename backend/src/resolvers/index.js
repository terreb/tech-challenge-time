'use strict';

const { getSessions, addSession, deleteProject, renameProject } = require( './sessions' );

module.exports = {
    sanity: () => 'No worries, I\'m ok!',
    getSessions: getSessions,
    addSession: addSession,
    deleteSession: deleteProject,
    renameProject: renameProject
};