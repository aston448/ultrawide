// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import ClientLoginServices  from '../../../apiClient/apiClientLogin.js'

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

    onLogin(){
        ClientLoginServices.userLogin(this.state.userName, this.state.password);
    }

    // Temp dev timesaver
    onLoginUser(userName, password){
        ClientLoginServices.userLogin(userName, password);
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
                    <Button onClick={() => this.onLoginUser('gloria', 'gloria')}>
                        Login Gloria
                    </Button>
                    <Button onClick={() => this.onLoginUser('hugh', 'hugh')}>
                        Login Hugh
                    </Button>
                    <Button onClick={() => this.onLoginUser('miles', 'miles')}>
                        Login Miles
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
export default connect(mapStateToProps)(UserLogin);
