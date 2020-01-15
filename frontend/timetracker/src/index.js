import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlay, faStop, faPen, faTrash, faCircle, faDotCircle } from '@fortawesome/free-solid-svg-icons';

// add all necessary icons here
library.add( faPlay, faStop, faPen, faTrash, faCircle, faDotCircle );

ReactDOM.render(<App />, document.getElementById('root'));
