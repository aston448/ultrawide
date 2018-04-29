
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import ItemList                         from '../../components/select/ItemList.jsx';
import UserDetails                      from '../../components/admin/UserDetails.jsx';

// Ultrawide Services
import {log} from "../../../common/utils";
import {LogLevel} from "../../../constants/constants";

import { ClientDataServices }               from '../../../apiClient/apiClientDataServices.js';
import { ClientUserManagementServices }     from '../../../apiClient/apiClientUserManagement.js';

import {AddActionIds}                   from "../../../constants/ui_context_ids.js";

// Bootstrap
import {Well, FormGroup, ControlLabel, FormControl, Button}          from 'react-bootstrap';
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';




// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// User Management Container.  Add / Remove / Edit Users
//
// ---------------------------------------------------------------------------------------------------------------------

class UserManagementScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            oldPassword: '',
            newPassword1: '',
            newPassword2: ''
        };

    };

    addNewUser() {

        const actionUserId = Meteor.userId();

        ClientUserManagementServices.addUser(actionUserId);
    };

    renderUserList(users){
        return users.map((user) => {
            return (
                <UserDetails
                    key={user._id}
                    user={user}
                />
            );
        });
    };

    noUsers(){
        return (
            <div className="design-item-note">No users currently defined</div>
        );
    }

    updateOldPassword(e){
        this.setState({oldPassword: e.target.value});
    }

    updateNewPassword1(e){
        this.setState({newPassword1: e.target.value});
    }

    updateNewPassword2(e){
        this.setState({newPassword2: e.target.value});
    }

    onUpdateAdminPassword(e){

        // Call this to prevent Submit reloading the page
        e.preventDefault();

        ClientUserManagementServices.changeAdminPassword(this.state.oldPassword, this.state.newPassword1, this.state.newPassword2);
    }

    render() {

        const {userData} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER User Management');

        let bodyDataFunction = null;

        const hasFooterAction = true;
        const footerActionFunction = () => this.addNewUser();

        if(userData && userData.length > 0) {
            bodyDataFunction = () => this.renderUserList(userData)
        } else {
            bodyDataFunction = () => this.noUsers()
        }


        const users =
            <ItemList
                headerText={'Ultrawide Users'}
                bodyDataFunction={bodyDataFunction}
                hasFooterAction={hasFooterAction}
                footerAction={'Add User'}
                footerActionUiContext={AddActionIds.UI_CONTEXT_ADD_USER}
                footerActionFunction={footerActionFunction}
            />;

        const changeAdminPassword =
            <Well className="admin-password-well">
                <form onSubmit={(e) => this.onUpdateAdminPassword(e)}>
                    <div className="design-item-header">Change Admin Password</div>
                    <div className="design-item-note">You'll need to remember it so be careful!</div>
                    <FormGroup controlId="oldPassword">
                        <ControlLabel>Current Password:</ControlLabel>
                        <FormControl ref="oldPassword" type="password"  onChange={(e) => this.updateOldPassword(e)}/>
                    </FormGroup>
                    <FormGroup controlId="newPassword1">
                        <ControlLabel>New Password:</ControlLabel>
                        <FormControl ref="newPassword1" type="password"  onChange={(e) => this.updateNewPassword1(e)}/>
                    </FormGroup>
                    <FormGroup controlId="newPassword2">
                        <ControlLabel>Repeat New Password:</ControlLabel>
                        <FormControl ref="newPassword2" type="password"  onChange={(e) => this.updateNewPassword2(e)}/>
                    </FormGroup>
                    <Button type="submit">
                        Change Admin Password
                    </Button>
                </form>
            </Well>;

        return (
            <Grid>
                <Row>
                    <Col md={6} className="col">
                        {users}
                    </Col>
                    <Col md={6} className="col">
                        {changeAdminPassword}
                    </Col>
                </Row>
            </Grid>
        );
    };
}

UserManagementScreen.propTypes = {
    userData:       PropTypes.array.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {

    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
UserManagementScreen = connect(mapStateToProps)(UserManagementScreen);



export default UserManagementContainer = createContainer(({params}) => {

    const userData =  ClientDataServices.getUltrawideUsers();

    return {userData: userData};

}, UserManagementScreen);