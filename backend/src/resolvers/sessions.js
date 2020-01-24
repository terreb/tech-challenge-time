'use strict';

const data = []; // for now store data in a variable

const getSessions = () => {
    return Promise.resolve( data );
};
exports.getSessions = getSessions;

const setSession = ( { id, name, startTime, endTime } ) => {
    data.push( { id, name, startTime, endTime } );
    return Promise.resolve(true);
};
exports.setSession = setSession;

