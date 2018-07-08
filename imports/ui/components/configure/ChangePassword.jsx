
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Services
import { ClientUserManagementServices }             from '../../../apiClient/apiClientUserManagement.js';

import {LogLevel, DisplayContext} from '../../../constants/constants.js';
import {UI} from "../../../constants/ui_context_ids";
import {log, getContextID} from "../../../common/utils";

// Bootstrap
import {Well, ControlLabel, FormControl, Button, FormGroup}     from 'react-bootstrap';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Password Change Dialog
//
// ---------------------------------------------------------------------------------------------------------------------

export class ChangePassword extends Component {

    constructor(props) {
        super(props);

        this.state = {
            oldPassword: '',
            newPassword1: '',
            newPassword2: '',
        };

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

    onUpdateUserPassword(e, displayContext){

        // Call this to prevent Submit reloading the page
        e.preventDefault();

        switch(displayContext){
            case DisplayContext.CONFIG_ADMIN_PASSWORD:
                ClientUserManagementServices.changeAdminPassword(this.state.oldPassword, this.state.newPassword1, this.state.newPassword2);
                break;
            case DisplayContext.CONFIG_USER_PASSWORD:
                ClientUserManagementServices.changeUserPassword(this.state.oldPassword, this.state.newPassword1, this.state.newPassword2);

        }

    }

    render() {

        const {displayContext} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Change Password for {}', displayContext);

        // Items -------------------------------------------------------------------------------------------------------

        const changeUserPassword =
            <Well id={getContextID(UI.CONFIG_PASSWORD)} className="settings-well">
                <form onSubmit={(e) => this.onUpdateUserPassword(e, displayContext)}>
                    <div className="design-item-header">Change My Password</div>
                    <div className="design-item-note">You'll need to remember it so be careful!</div>
                    <FormGroup controlId="configOldPassword">
                        <ControlLabel>Current Password:</ControlLabel>
                        <FormControl id={getContextID(UI.INPUT_PASSWORD_OLD, '')} ref="configOldPassword" type="password" onChange={(e) => this.updateOldPassword(e)}/>
                    </FormGroup>
                    <FormGroup controlId="configNewPassword1">
                        <ControlLabel>New Password:</ControlLabel>
                        <FormControl id={getContextID(UI.INPUT_PASSWORD_NEW1, '')} ref="configNewPassword1" type="password" onChange={(e) => this.updateNewPassword1(e)}/>
                    </FormGroup>
                    <FormGroup controlId="configNewPassword2">
                        <ControlLabel>Repeat New Password:</ControlLabel>
                        <FormControl id={getContextID(UI.INPUT_PASSWORD_NEW2, '')} ref="configNewPassword2" type="password" onChange={(e) => this.updateNewPassword2(e)}/>
                    </FormGroup>
                    <Button id={getContextID(UI.BUTTON_CHANGE_PASSWORD, '')} type="submit">
                        Change My Password
                    </Button>
                </form>
            </Well>;

        // Layout ------------------------------------------------------------------------------------------------------

        return(
            <div>
                {changeUserPassword}
            </div>
        );

    }
}

ChangePassword.propTypes = {
    displayContext:    PropTypes.string.isRequired
};


