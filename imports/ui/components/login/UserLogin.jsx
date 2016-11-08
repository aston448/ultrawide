// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components


// Ultrawide Services
import {RoleType, LocationType, ViewType} from '../../../constants/constants.js'
import ClientLoginServices from '../../../apiClient/apiClientLogin.js'

// Bootstrap
import {Well, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// User Login Component - Login Screen
//
// ---------------------------------------------------------------------------------------------------------------------

class UserLogin extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userName: '',
            password: ''
        };
    }

    updateUserName(e){
        this.setState({userName: e.target.value});
    }

    updatePassword(e){
        this.setState({password: e.target.value});
    }

    onLogin(){
        ClientLoginServices.userLogin(this.state.userName, this.state.password);
    }

    // Temp dev timesaver
    onLoginUser1(){
        ClientLoginServices.userLogin('user1', 'user1');
    }

    render() {
        const {} = this.props;

        return(
            <Well>
                <form>
                    <FormGroup controlId="loginUserName">
                        <ControlLabel>User Name:</ControlLabel>
                        <FormControl ref="userName" type="text" placeholder="Enter User Name" onChange={(e) => this.updateUserName(e)}/>
                    </FormGroup>
                    <FormGroup controlId="loginPassword">
                        <ControlLabel>Password:</ControlLabel>
                        <FormControl ref="password" type="password"  onChange={(e) => this.updatePassword(e)}/>
                    </FormGroup>
                    <Button onClick={() => this.onLogin()}>
                        Submit
                    </Button>
                    <Button onClick={() => this.onLoginUser1()}>
                        Login user1
                    </Button>
                </form>
            </Well>
        )
    }
}

UserLogin.propTypes = {

};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {

    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
UserLogin = connect(mapStateToProps)(UserLogin);

export default UserLogin;