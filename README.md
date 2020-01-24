# This is Full stack app made for Pento tech challenge

### to run locally:

npm i -g parcel

- frontend
cd frontend && npm i && npm start
open your browser and navigate to http://localhost:1234

- backend
cd backend && npm i && npm start
open your browser and navigate to http://localhost:3000/graphql

In the frontend you can add a new project to the list, by entering it to the input under "Projects" and clicking "Add". Then click it in the list to make it active and start tracking time. In the list total time spent on the projects are indicated for every project. Current project section displays nt current session time. It's reset every time new project is getting active. The data is being saved to local storage constantly on any change, so that if you close your browser it will be restored on the next app startup. 

The overview tab allows to see one's progress per project for chosen date range. Overview currently lists sessions for date range, but can be easily adjusted to show a chart. 

Currently the client sends session data to the backend once the user stops the session. The backend replies with success but store data in a variable, so when the server stops it obviously gets erased. 

The backend uses GraphQL API. To track stored sessions:

1. http://localhost:3000/graphql in the browser 
2. execute: {getSessions{name, startTime, endTime}}

### to check the timetracker out remotely

https://terreb.github.io/tech-challenge-time/frontend/dist/index.html

(currently only frontend is deployed remotely)
