
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components


// Ultrawide Services
import {DesignComponentMessages, UserManagementMessages} from "../../../constants/message_texts";
import {LogLevel, MessageType} from "../../../constants/constants";
import {log} from "../../../common/utils";

import ClientUserManagementServices from '../../../apiClient/apiClientUserManagement.js';

// Bootstrap
import {Checkbox, Button} from 'react-bootstrap';
import {Form, FormGroup, FormControl, Grid, Row, Col, ControlLabel} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';
import {updateUserMessage} from '../../../redux/actions'
import store from "../../../redux/store";


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// User Details Component - Graphically represents one Ultrawide User
//
// ---------------------------------------------------------------------------------------------------------------------

export class UserDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editing:                false,
            userNameValue:          this.props.user.userName,
            displayNameValue:       this.props.user.displayName,
            isDesignerValue:        this.props.user.isDesigner,
            isDeveloperValue:       this.props.user.isDeveloper,
            isManagerValue:         this.props.user.isManager,
            isGuestViewerValue:     this.props.user.isGuestViewer,
            isActiveValue:          this.props.user.isActive
        };

    }

    onSave(userContext){
        event.preventDefault();

        // Validate that it is the admin user doing this edit
        const actionUserId = userContext.userId;

        const user = {
            _id:            this.props.user._id,
            userId:         this.props.user.userId,
            userName:       this.state.userNameValue,
            displayName:    this.state.displayNameValue,
            isDesigner:     this.state.isDesignerValue,
            isDeveloper:    this.state.isDeveloperValue,
            isManager:      this.state.isManagerValue,
            isGuestViewer:  this.state.isGuestViewerValue,
            isActive:       this.props.user.isActive,
            isAdmin:        false
        };

        ClientUserManagementServices.saveUser(actionUserId, user);

        this.setState({editing: false});
    }

    onResetPassword(userContext, user){

        // Validate that it is the admin user doing this edit
        const actionUserId = userContext.userId;

        ClientUserManagementServices.resetUserPassword(actionUserId, user);

        this.setState({editing: false});
    }

    onToggleActive(user, userContext){

        const actionUserId = userContext.userId;

        if(user.isActive){
            // Set inactive
            ClientUserManagementServices.deactivateUser(actionUserId, user.userId);
        } else {
            // Set active
            ClientUserManagementServices.activateUser(actionUserId, user.userId);
        }
    }

    setCurrentUser(user){
        ClientUserManagementServices.setCurrentUser(user.userId);
    }

    onEdit(){
        this.setState({editing: true});
    }

    onCancel(){
        this.setState({editing: false});
    }

    onUserNameChange(e){
        this.setState({userNameValue: e.target.value})
    }

    onDisplayNameChange(e){
        this.setState({displayNameValue: e.target.value})
    }

    onIsDesignerChange(e){
        if(this.state.isGuestViewerValue && e.target.checked){
            // Can't assign Designer if Guest Viewer
            store.dispatch(updateUserMessage({
                messageType: MessageType.ERROR,
                messageText: UserManagementMessages.MSG_INVALID_ROLE_FOR_GUEST
            }));
        } else {
            this.setState({isDesignerValue: e.target.checked})
        }
    }

    onIsDeveloperChange(e){
        if(this.state.isGuestViewerValue && e.target.checked){
            // Can't assign Designer if Guest Viewer
            store.dispatch(updateUserMessage({
                messageType: MessageType.ERROR,
                messageText: UserManagementMessages.MSG_INVALID_ROLE_FOR_GUEST
            }));
        } else {
            this.setState({isDeveloperValue: e.target.checked})
        }
    }

    onIsManagerChange(e){
        if(this.state.isGuestViewerValue && e.target.checked){
            // Can't assign Designer if Guest Viewer
            store.dispatch(updateUserMessage({
                messageType: MessageType.ERROR,
                messageText: UserManagementMessages.MSG_INVALID_ROLE_FOR_GUEST
            }));
        } else {
            this.setState({isManagerValue: e.target.checked})
        }
    }

    onIsGuestViewerChange(e){
        this.setState({isGuestViewerValue: e.target.checked});

        // If setting as Guest Viewer all other roles are revoked
        if(e.target.checked){
            this.setState({isDesignerValue: false});
            this.setState({isDeveloperValue: false});
            this.setState({isManagerValue: false});
        }
    }

    onIsActiveChange(e){
        this.setState({isActiveValue: e.target.checked})
    }


    render() {
        try {
            const {user, currentUserId, userContext} = this.props;

            log((msg) => console.log(msg), LogLevel.PERF, 'Render User Details');

            const selectedClass = (user.userId === currentUserId ? ' user-selected' : ' user-not-selected');
            const activeClass = (user.isActive ? ' user-active' : ' user-inactive');
            const activateButtonText = (user.isActive ? 'De-Activate' : 'Activate');

            const viewInstance = (
                <div onClick={() => this.setCurrentUser(user)}>
                    <Grid>
                        <Row className={activeClass}>
                            <Col id="user-display-name-view" sm={2}>
                                {user.displayName}
                            </Col>
                            <Col id="user-username-view" sm={2}>
                                {user.userName}
                            </Col>
                            <Col id="user-designer-view" sm={2}>
                                <Checkbox readOnly={true} checked={this.state.isDesignerValue}>
                                    Designer
                                </Checkbox>
                            </Col>
                            <Col id="user-developer-view" sm={2}>
                                <Checkbox readOnly={true} checked={this.state.isDeveloperValue}>
                                    Developer
                                </Checkbox>
                            </Col>
                            <Col id="user-manager-view" sm={2}>
                                <Checkbox readOnly={true} checked={this.state.isManagerValue}>
                                    Manager
                                </Checkbox>
                            </Col>
                            <Col id="user-guest-view" sm={2}>
                                <Checkbox readOnly={true} checked={this.state.isGuestViewerValue}>
                                    Guest Viewer
                                </Checkbox>
                            </Col>
                        </Row>
                    </Grid>
                    <div className="user-buttons">
                        <Button id="butEdit" bsSize="xs" onClick={() => this.onEdit(user)}>Edit</Button>
                        <Button id="butRemove" bsSize="xs"
                                onClick={() => this.onToggleActive(user, userContext)}>{activateButtonText}</Button>
                    </div>
                </div>
            );

            const formInstance = (
                <Form horizontal>
                    <FormGroup id="user-username-edit" controlId="formUserName">
                        <Col componentClass={ControlLabel} sm={3}>
                            User Name (Login)
                        </Col>
                        <Col sm={9}>
                            <FormControl type="text" placeholder={user.userName} value={this.state.userNameValue}
                                         onChange={(e) => this.onUserNameChange(e)}/>
                        </Col>
                    </FormGroup>

                    <FormGroup id="user-display-name-edit" controlId="formDisplayName">
                        <Col componentClass={ControlLabel} sm={3}>
                            Display Name
                        </Col>
                        <Col sm={9}>
                            <FormControl type="text" placeholder={user.displayName} value={this.state.displayNameValue}
                                         onChange={(e) => this.onDisplayNameChange(e)}/>
                        </Col>
                    </FormGroup>

                    <FormGroup id="user-designer-edit" controlId="formIsDesigner">
                        <Col componentClass={ControlLabel} sm={3}>
                            User is Designer
                        </Col>
                        <Col sm={9}>
                            <Checkbox checked={this.state.isDesignerValue}
                                      onChange={(e) => this.onIsDesignerChange(e)}>
                            </Checkbox>
                        </Col>
                    </FormGroup>

                    <FormGroup id="user-developer-edit" controlId="formIsDeveloper">
                        <Col componentClass={ControlLabel} sm={3}>
                            User is Developer
                        </Col>
                        <Col sm={9}>
                            <Checkbox checked={this.state.isDeveloperValue}
                                      onChange={(e) => this.onIsDeveloperChange(e)}>
                            </Checkbox>
                        </Col>
                    </FormGroup>

                    <FormGroup id="user-manager-edit" controlId="formIsManager">
                        <Col componentClass={ControlLabel} sm={3}>
                            User is Manager
                        </Col>
                        <Col sm={9}>
                            <Checkbox checked={this.state.isManagerValue}
                                      onChange={(e) => this.onIsManagerChange(e)}>
                            </Checkbox>
                        </Col>
                    </FormGroup>

                    <FormGroup id="user-guest-edit" controlId="formIsGuestUser">
                        <Col componentClass={ControlLabel} sm={3}>
                            User is Guest Viewer Only
                        </Col>
                        <Col sm={9}>
                            <Checkbox checked={this.state.isGuestViewerValue}
                                      onChange={(e) => this.onIsGuestViewerChange(e)}>
                            </Checkbox>
                        </Col>
                    </FormGroup>

                    <Button id="butSave" bsSize="xs" onClick={() => this.onSave(userContext)}>
                        Save
                    </Button>
                    <Button id="butCancel" bsSize="xs" onClick={() => this.onCancel()}>
                        Cancel
                    </Button>
                    <Button id="butReset" bsSize="xs" onClick={() => this.onResetPassword(userContext, user)}>
                        Reset Password
                    </Button>

                </Form>


            );

            if (this.state.editing) {
                return (
                    <div className="user-edit">
                        {formInstance}
                    </div>
                )
            } else {
                return (
                    <div className={'user-view' + selectedClass}>
                        {viewInstance}
                    </div>
                )
            }
        } catch (error) {
            alert('Unexpected error: ' + error + '.  Contact support if persists!');
        }
    }
}

UserDetails.propTypes = {
    user: PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        currentUserId:  state.currentUserId,
        userContext:    state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(UserDetails);

