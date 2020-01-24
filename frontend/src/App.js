import React from 'react';
import {
    Container,
    Row,
    ButtonGroup,
    Button,
    InputGroup,
    FormControl,
    Table,
    Modal,
    Tabs,
    Tab,
    Dropdown
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateRangePicker } from 'react-date-range';
import { uuidv4, secondsToTime, addDays, copy, getFormattedDateAndTime } from './helpers';
import './styles.css';

class App extends React.Component {

    constructor( props ) {
        super( props );

        const overviewStartDate = new Date();
        overviewStartDate.setHours( 0, 0, 0, 0 );

        const overviewEndDate = addDays( 6 )( new Date() );
        overviewEndDate.setHours( 23, 59, 59, 0 );

        this.state = {
            newProjectName: '',
            projects: [],
            lastActiveProjectIndex: null,
            isTracking: false,
            showModal: false,
            modalProject: {},
            modalProjectName: '',
            timeWorkedToday: null,
            timeWorkedThisWeek: null,
            timeWorkedThisMonth: null,
            overviewProject: null,
            overviewStartDate,
            overviewEndDate,
        };
    }

    componentDidMount() {
        // start timer
        this.timer = setInterval( () => this.tick(), 1000 );

        // sync with the storage
        this.fetchData();
    }

    componentWillUnmount() {
        // stop timer
        clearInterval( this.timer );
    }

    tick() {
        const { isTracking, lastActiveProjectIndex, projects } = this.state;

        if ( isTracking && lastActiveProjectIndex !== null && lastActiveProjectIndex !== undefined ) {
            const project = projects[ lastActiveProjectIndex ];
            const newProject = {
                ...project,
                lastSessionWorkTime: ++project.lastSessionWorkTime,
                totalTimeWorked: ++project.totalTimeWorked
            };
            this.setState( {
                projects: projects.map( p => p === project ? newProject : { ...p } )
            }, this.onDataChange )
        }
    }

    fetchData = () => {
        const projects = JSON.parse( localStorage.getItem( 'projects' ) || '[]' );
        const lastActiveProjectIndex = JSON.parse( localStorage.getItem( 'lastActiveProjectIndex' ) || 'null' );

        // convert date strings to date objects
        for ( let p of projects ) {
            const { sessions } = p;
            for ( let s of sessions ) {
                s.startTime = new Date( s.startTime );
                s.endTime = new Date( s.endTime );
            }
        }

        this.setState( { projects, lastActiveProjectIndex } );
    };

    onDataChange = () => {
        // persists to localStorage
        localStorage.setItem( 'projects', JSON.stringify( this.state.projects ) );
        localStorage.setItem( 'lastActiveProjectIndex', this.state.lastActiveProjectIndex );
    };

    syncDataWithTheServer = async () => {
        try {
            const { projects, lastActiveProjectIndex } = this.state;
            const project = projects[ lastActiveProjectIndex ];
            // we will be sending last session
            const session = project.sessions[ project.sessions.length - 1 ];
            const query = `mutation SetSession($id: String!, $name: String!, $startTime: String!, $endTime: String!) {
              setSession(id: $id, name: $name, startTime: $startTime, endTime: $endTime)
            }`;
            const res = await fetch( 'http://localhost:3000/graphql', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify( {
                    query,
                    variables: {
                        ...session,
                        id: project.ID,
                        name: project.name
                    }
                } ),
            } );
            const data = await res.json();
            console.log( data );
        } catch ( e ) {
            console.log( e )
        }
    };

    buildProjectItem = () => {
        return {
            ID: uuidv4(),
            name: this.state.newProjectName,
            isActive: false,
            lastSessionWorkTime: 0, // in seconds
            totalTimeWorked: 0, // in seconds
            sessions: []
        }
    };

    onNewProjectNameChange = event => this.setState( { newProjectName: event.target.value } );

    onAddNewProject = event => {
        if ( event ) event.preventDefault();

        const newProject = this.buildProjectItem();

        this.setState( ( { projects } ) => ({
            newProjectName: '',
            projects: [ ...copy( projects ), newProject ]
        }), this.onDataChange )
    };

    onProject = project => {
        // this project is already active
        if ( this.isActiveProject( project ) ) return;

        const projects = this.state.projects.map(
            p => (
                p.ID === project.ID ?
                    { ...p, isActive: true, lastSessionWorkTime: 0 } :
                    { ...p, isActive: false }
            )
        );

        this.setState( {
            lastActiveProjectIndex: this.state.projects.indexOf( project ),
            isTracking: false,
            projects
        }, this.onDataChange )
    };

    isActiveProject = project => this.state.lastActiveProjectIndex === this.state.projects.indexOf( project );

    onStartStop = () => {
        if ( this.state.lastActiveProjectIndex === null || this.state.lastActiveProjectIndex === undefined ) {
            // nothing to track, no active project
            alert( 'Please choose a project you want to track time!' );
            return;
        }

        if ( this.state.isTracking ) {
            // stop tracking
            this.stop()
        } else {
            // start tracking
            this.start()
        }
    };

    start = () => {
        const { projects, lastActiveProjectIndex } = this.state;
        const project = projects[ lastActiveProjectIndex ];
        const sessions = project.sessions.map( s => ({ ...s }) );
        sessions.push( {
            startTime: new Date(),
            endTime: new Date()
        } );
        const newProject = {
            ...project,
            sessions
        };
        this.setState( {
            isTracking: true,
            projects: projects.map( p => (p === project ? newProject : { ...p }) )
        }, this.onDataChange )
    };

    stop = () => {
        const { projects, lastActiveProjectIndex } = this.state;
        const project = projects[ lastActiveProjectIndex ];
        const sessions = project.sessions.map( s => ({ ...s }) );
        sessions[ sessions.length - 1 ] = {
            startTime: sessions[ sessions.length - 1 ].startTime,
            endTime: new Date()
        };
        const newProject = {
            ...project,
            sessions
        };
        this.setState( {
            isTracking: false,
            projects: projects.map( p => (p === project ? newProject : { ...p }) )
        }, () => {
            this.onDataChange();
            // we sync data with the server every time the user stops session
            // TODO: this is not the best approach, save session every some minutes when time tracking is running
            this.syncDataWithTheServer();
        } )
    };

    onEdit = project => {
        this.setState( { showModal: true, modalProject: { ...project }, modalProjectName: project.name } )
    };

    onDelete = project => {
        let { lastActiveProjectIndex, projects } = this.state;

        if ( this.isActiveProject( project ) ) {
            // project we want to delete is active, stop it and disable first
            stop();
            lastActiveProjectIndex = null;
        } else if ( lastActiveProjectIndex !== null &&
            lastActiveProjectIndex !== undefined &&
            lastActiveProjectIndex > projects.indexOf( project ) ) {
            // we need to adjust lastActiveProjectIndex
            lastActiveProjectIndex--;
        }

        // now we can remove it from state and storage
        const updatedProjects = this.state.projects
            .filter( p => p !== project )
            .map( p => ({ ...p }) );

        this.setState( { projects: updatedProjects, lastActiveProjectIndex }, this.onDataChange );
    };

    onModalHide = () => {
        this.setState( { showModal: false, modalProject: {}, modalProjectName: '' } );
    };

    onModalConfirm = () => {
        const { modalProject, modalProjectName, projects } = this.state;

        this.setState( {
            showModal: false,
            modalProject: {},
            modalProjectName: '',
            projects: projects.map( p => (p.ID === modalProject.ID ? { ...p, name: modalProjectName } : { ...p }) )
        }, this.onDataChange );
    };

    onModalProjectNameChange = event => this.setState( { modalProjectName: event.target.value } );

    handleInputKeyPress = target => {
        if ( target.charCode === 13 ) {
            this.onAddNewProject();
        }
    };

    onTabChange = () => {

    };

    onDropdownSelect = project => {
        this.setState( { overviewProject: { ...project } } )
    };

    onDateRangeChange = ( { selection } ) => {
        this.setState( {
            overviewStartDate: selection.startDate,
            overviewEndDate: selection.endDate
        } )
    };

    render() {
        const {
            projects,
            isTracking,
            lastActiveProjectIndex,
            newProjectName,
            showModal,
            modalProjectName,
            overviewProject,
            overviewStartDate,
            overviewEndDate
        } = this.state;
        const { name, lastSessionWorkTime, totalTimeWorked } = projects[ lastActiveProjectIndex ] || {};

        // TODO: the next is just for fast prototyping, I will use "reselect" for that in the future
        let filteredSessions = [], totalTimeWorkedWithinRange = 0;
        if ( overviewProject ) {
            for ( let s of overviewProject.sessions ) {
                if ( s.startTime >= overviewStartDate && s.endTime <= overviewEndDate ) {
                    filteredSessions.push( { ...s } );
                    const diff = (s.endTime - s.startTime) / 1000;
                    totalTimeWorkedWithinRange += diff;
                }
            }
        }
        totalTimeWorkedWithinRange = Math.abs( totalTimeWorkedWithinRange );

        return (
            <Tabs defaultActiveKey="timetracker" onSelect={this.onTabChange}>
                <Tab eventKey="timetracker" title="Timetracker">
                    <>
                        <Container>
                            <Row className="row-margin">
                                <h4>Current session</h4>
                            </Row>
                            <Row className="row-margin">
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <Button variant={isTracking ? "danger" : "success"} onClick={this.onStartStop}>
                                            <FontAwesomeIcon icon={isTracking ? 'stop' : 'play'}/>
                                        </Button>
                                    </InputGroup.Prepend>
                                    <FormControl placeholder={name}
                                                 readOnly
                                    />
                                    <FormControl className="time"
                                                 placeholder={secondsToTime( lastSessionWorkTime )}
                                                 readOnly
                                    />
                                </InputGroup>
                            </Row>
                            <Row style={{ marginTop: 50 }}>
                                <h4>Projects</h4>
                            </Row>
                            <Row className="row-margin">
                                <InputGroup>
                                    <FormControl
                                        placeholder="New project name"
                                        value={newProjectName}
                                        onChange={this.onNewProjectNameChange}
                                        onKeyPress={this.handleInputKeyPress}
                                    />
                                    <InputGroup.Append>
                                        <Button variant="outline-secondary" onClick={this.onAddNewProject}>Add</Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Row>
                        </Container>
                        <Container>
                            <Row className="row-margin">
                                <Table striped bordered hover>
                                    <thead>
                                    <tr>
                                        <th>Active</th>
                                        <th>Project name</th>
                                        <th>Total time worked</th>
                                        <th style={{ width: 106 }}></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        projects.map( p =>
                                            <tr key={p.ID}>
                                                <td onClick={() => this.onProject( p )}>
                                                    <FontAwesomeIcon icon={p.isActive ? "dot-circle" : "circle"}/>
                                                </td>
                                                <td onClick={() => this.onProject( p )}>{p.name}</td>
                                                <td onClick={() => this.onProject( p )}>{secondsToTime( p.totalTimeWorked )}</td>
                                                <td>
                                                    <ButtonGroup>
                                                        <Button variant="outline-secondary"
                                                                onClick={() => this.onEdit( p )}>
                                                            <FontAwesomeIcon icon="pen"/>
                                                        </Button>
                                                        <Button variant="outline-secondary"
                                                                onClick={() => this.onDelete( p )}>
                                                            <FontAwesomeIcon icon="trash"/>
                                                        </Button>
                                                    </ButtonGroup>
                                                </td>
                                            </tr>
                                        )
                                    }
                                    </tbody>
                                </Table>
                            </Row>
                        </Container>
                        <Modal show={showModal} onHide={this.onModalHide}>
                            <Modal.Header closeButton>
                                <Modal.Title>Give your project a sexy name!</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <InputGroup>
                                    <FormControl placeholder={name}
                                                 value={modalProjectName}
                                                 onChange={this.onModalProjectNameChange}
                                    />
                                </InputGroup>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.onModalHide}>
                                    Cancel
                                </Button>
                                <Button variant="success" onClick={this.onModalConfirm}>
                                    I like it!
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </>
                </Tab>
                <Tab eventKey="overview" title="Overview">
                    <>
                        <Container>
                            <Row className="row-margin">
                                <Dropdown>
                                    <Dropdown.Toggle variant="outline-secondary">Select project</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {
                                            projects.map( p =>
                                                <Dropdown.Item key={"ddkey" + p.ID}
                                                               id={"dd" + p.ID}
                                                               onClick={() => this.onDropdownSelect( p )}>
                                                    {p.name}
                                                </Dropdown.Item> )
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                                <p style={{ marginLeft: 40 }}>{overviewProject && overviewProject.name}</p>
                            </Row>
                            <DateRangePicker
                                ranges={[ {
                                    startDate: overviewStartDate,
                                    endDate: overviewEndDate,
                                    key: 'selection',
                                } ]}
                                onChange={this.onDateRangeChange}
                            />
                            {
                                <p>Time worked withing selected time
                                    range: {secondsToTime( totalTimeWorkedWithinRange )}</p>
                            }
                            {
                                filteredSessions
                                    .map( ( s, index ) => <p key={"ov" + s.startTime.toString()}>
                                        {`Session ${index + 1}:  ${getFormattedDateAndTime( s.startTime )} - ${getFormattedDateAndTime( s.endTime )}`}
                                    </p> )
                            }
                        </Container>
                    </>
                </Tab>

            </Tabs>
        );
    }
}

export default App;
