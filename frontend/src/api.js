const sendRequest = async ( query, variables ) => {
    try {
        const res = await fetch( 'http://localhost:3000/graphql', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify( {
                query,
                variables,
            } ),
        } );
        const data = await res.json();
        console.log( data );
        return true
    } catch ( e ) {
        console.log( e );
        return false
    }
};

export const addSession = variables => {
    const query = `mutation AddSession($id: String!, $name: String, $session: SessionInput!) {
      addSession(id: $id, name: $name, session: $session)
    }`;
    return sendRequest( query, variables );
};

export const deleteProject = variables => {
    const query = `mutation DeleteProject($id: String) {
      deleteProject(id: $id)
    }`;
    return sendRequest( query, variables );
};

export const renameProject = variables => {
    const query = `mutation RenameProject($id: String!, $name: String!) {
      renameProject(id: $id, name: $name)
    }`;
    return sendRequest( query, variables );
};

// export const getSessions = variables => {
//     const query = `mutation SetSession($id: String!, $name: String!, $startTime: String!, $endTime: String!) {
//       setSession(id: $id, name: $name, startTime: $startTime, endTime: $endTime)
//     }`;
//     return sendRequest( query, variables );
// };