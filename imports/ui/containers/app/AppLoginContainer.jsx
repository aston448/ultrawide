
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import UserLogin                from '../../components/login/UserLogin.jsx';

// Ultrawide Services
import {ViewType}               from '../../../constants/constants.js'

// Bootstrap

// REDUX services
import {connect} from 'react-redux';


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

    render() {

        const {} = this.props;

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

    console.log("AppLoginContainer");

    return{}


}, LoginScreen);