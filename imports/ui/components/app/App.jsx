// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component} from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import AppDataContainer from '../../containers/app/AppDataContainer.jsx';

// Ultrawide Services
import {log} from "../../../common/utils";
import {LogLevel} from "../../../constants/constants";

// Bootstrap

// REDUX services
import { Provider } from 'react-redux';
import store from '../../../redux/store'

// React DnD
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Application Component -  The Redux Provider and Drag Drop Wrapper
//
// ---------------------------------------------------------------------------------------------------------------------


// App component - represents the whole app
class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        log((msg) => console.log(msg), LogLevel.PERF, 'Render App');

        return (
            <Provider store={store}>
                <AppDataContainer/>
            </Provider>
        );
    }
}

App.propTypes = {

};

// Add drag drop support to the application by wrapping it in the React DnD context.
App = DragDropContext(HTML5Backend)(App);

export default App;

