
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import ItemList                         from '../../components/item/ItemList.jsx';
import UserDetails                      from '../../components/admin/UserDetails.jsx';
import ChangePassword                   from '../../components/configure/ChangePassword.jsx';

// Ultrawide Services
import {log, getContextID} from "../../../common/utils";
import {ItemListType, LogLevel, DisplayContext} from "../../../constants/constants";
import {UI} from "../../../constants/ui_context_ids";

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

export class UserManagementScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
                listType={ItemListType.ULTRAWIDE_ITEM}
            />;

        // User Management screen also has a panel to change the Admin password
        return (
            <Grid>
                <Row>
                    <Col md={6} className="col">
                        {users}
                    </Col>
                    <Col id={UI.CONFIG_ADMIN_PASSWORD} md={6} className="col">
                        <ChangePassword
                            displayContext={DisplayContext.CONFIG_ADMIN_PASSWORD}
                        />
                    </Col>
                </Row>
            </Grid>
        );
    };
}

UserManagementScreen.propTypes = {
    userData:       PropTypes.array.isRequired
};


export default UserManagementContainer = createContainer(({params}) => {

    const userData =  ClientDataServices.getUltrawideUsers();

    return {userData: userData};

}, UserManagementScreen);