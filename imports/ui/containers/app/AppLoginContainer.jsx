import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { UserRoles } from '../../../collections/users/user_roles.js';


import { RoleType, ViewType } from '../../../constants/constants.js';
import ClientLoginServices from '../../../apiClient/apiClientLogin.js'

// REDUX services
import {connect} from 'react-redux';

import {Button} from 'react-bootstrap';


// Login Screen
class LoginScreen extends Component {
    constructor(props) {
        super(props);

    }

    onLogin(role){
        // TODO - add proper login validation.

        // TODO: Remove this when proper user login implemented
        // TEMP: User 1 is designer, User 2 is developer ---------------------------------------------------------------
        ClientLoginServices.createMeteorUser(role);
        // TEMP --------------------------------------------------------------------------------------------------------

    };



    render() {
        // TODO - add proper login.
        return (
            <div className="login-screen">
                <Button onClick={ () => this.onLogin(RoleType.DESIGNER)}>Login Designer</Button>
                <Button onClick={ () => this.onLogin(RoleType.DEVELOPER)}>Login Developer</Button>
                <Button onClick={ () => this.onLogin(RoleType.MANAGER)}>Login Manager</Button>
            </div>
        );
    }
}

LoginScreen.propTypes = {
    users: PropTypes.array.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext,
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
LoginScreen = connect(mapStateToProps)(LoginScreen);



export default AppLoginContainer = createContainer(({params}) => {

    // TODO move to clientContainerServices
    const currentUsers = UserRoles.find({});

    console.log("Users found: " + currentUsers.count());

    return {
        users: currentUsers.fetch(),
    };


}, LoginScreen);