
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import UserLogin                from '../../components/login/UserLogin.jsx';

// Ultrawide Services

// Bootstrap

// REDUX services
import {connect} from 'react-redux';
import {log} from "../../../common/utils";
import {LogLevel} from "../../../constants/constants";


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Login Container.  Login if logged out or switch roles if logged in
//
// ---------------------------------------------------------------------------------------------------------------------

// Login Screen
class LoginScreen extends Component {
    constructor(props) {
        super(props);

    }

    shouldComponentUpdate(nextProps, nextState){

        // This container should never need to update
        return false;
    }

    render() {

        const {} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Login');

        // Show Login
        return(
            <UserLogin/>
        );

    }
}

LoginScreen.propTypes = {

};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        view:           state.currentAppView
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
LoginScreen = connect(mapStateToProps)(LoginScreen);



export default AppLoginContainer = createContainer(({params}) => {

    return{}


}, LoginScreen);