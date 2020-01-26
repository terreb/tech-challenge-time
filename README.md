# This is Full stack app made for Pento tech challenge

The project features React on the frontend, Node.js + GraphQL on the backend and PostgreSQL for the database which is running in Docker container.

## Running locally

#### Frontend:
```bash
$ cd frontend && npm i -g parcel && npm i && npm start
```
navigate to http://localhost:1234 in your browser

#### DB:
```bash
$ cd db && docker-compose up -d
```

For convenience GraphiQL is enabled to watch all stored sessions on the backend:

- open http://localhost:3000/graphql in the browser 
- execute to get all stored sessions:
```
{
  getSessions(id: "") {
    id
    name
    sessions {
      startTime
      endTime
    }
  }
}
```

#### Backend:
```bash
$ cd backend && npm i && npm start
```
navigate to http://localhost:3000/graphql in your browser
 
##  Running remotely

https://terreb.github.io/tech-challenge-time/frontend/dist/index.html

(currently only frontend is deployed remotely)

## Caveats

This is not a full featured Timetracker and there are a lot to be improved. Currently only one user data is stored on both frontend and backend. There is no authentication. The overview has wide range of options to pick required time range, but the sessions are displayed in plain text, no graphical charts are implemented yet. The data is store on the local storage and duplicated to the backend. The data is communicated only when the session is stopped, thus there can be unsynced data in between.
