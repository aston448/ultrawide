// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import {log} from "../../../common/utils";
import {LogLevel} from "../../../constants/constants";

import ClientLoginServices  from '../../../apiClient/apiClientLogin.js'

// Bootstrap
import {Well, FormGroup, FormControl, ControlLabel, Button, Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';


// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// User Login Component - Login Screen
//
// ---------------------------------------------------------------------------------------------------------------------

export class UserLogin extends Component {

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

    onLogin(e){

        // Cal this to prevent Submit reloading the page
        e.preventDefault();

        ClientLoginServices.userLogin(this.state.userName, this.state.password);
    }

    render() {
        const {} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render User Login');

        return(
            <Grid>
                <Row>
                    <Col md={4}>
                    </Col>
                    <Col md={4}>
                        <Well className="login-well">
                            <form onSubmit={(e) => this.onLogin(e)}>
                                <FormGroup controlId="loginUserName">
                                    <ControlLabel>User Name:</ControlLabel>
                                    <FormControl id="loginUserName" ref="userName" type="text" placeholder="Enter User Name" onChange={(e) => this.updateUserName(e)}/>
                                </FormGroup>
                                <FormGroup controlId="loginPassword">
                                    <ControlLabel>Password:</ControlLabel>
                                    <FormControl id="loginPassword" ref="password" type="password"  onChange={(e) => this.updatePassword(e)}/>
                                </FormGroup>
                                <Button id="loginSubmit" type="submit">
                                    Submit
                                </Button>
                            </form>
                        </Well>
                    </Col>
                    <Col md={4}>
                    </Col>
                </Row>
            </Grid>
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
export default connect(mapStateToProps)(UserLogin);
