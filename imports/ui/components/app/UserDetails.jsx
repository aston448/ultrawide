
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components


// Ultrawide Services
import ClientUserManagementServices from '../../../apiClient/apiClientUserManagement.js';

// Bootstrap
import {Checkbox, Button} from 'react-bootstrap';
import {Form, FormGroup, FormControl, Grid, Row, Col, ControlLabel} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

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
            passwordValue:          this.props.user.password,
            displayNameValue:       this.props.user.displayName,
            isDesignerValue:        this.props.user.isDesigner,
            isDeveloperValue:       this.props.user.isDeveloper,
            isManagerValue:         this.props.user.isManager,
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
            password:       this.state.passwordValue,
            displayName:    this.state.displayNameValue,
            isDesigner:     this.state.isDesignerValue,
            isDeveloper:    this.state.isDeveloperValue,
            isManager:      this.state.isManagerValue,
            isActive:       this.props.user.isActive,
            isAdmin:        false
        };

        ClientUserManagementServices.saveUser(actionUserId, user);

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

    onPasswordChange(e){
        this.setState({passwordValue: e.target.value})
    }

    onDisplayNameChange(e){
        this.setState({displayNameValue: e.target.value})
    }

    onIsDesignerChange(e){
        this.setState({isDesignerValue: e.target.checked})
    }

    onIsDeveloperChange(e){
        this.setState({isDeveloperValue: e.target.checked})
    }

    onIsManagerChange(e){
        this.setState({isManagerValue: e.target.checked})
    }

    onIsActiveChange(e){
        this.setState({isActiveValue: e.target.checked})
    }


    render() {
        try {
            const {user, currentUserId, userContext} = this.props;

            const selectedClass = (user.userId === currentUserId ? ' user-selected' : ' user-not-selected');
            const activeClass = (user.isActive ? ' user-active' : ' user-inactive');
            const activateButtonText = (user.isActive ? 'De-Activate' : 'Activate');

            const viewInstance = (
                <div onClick={() => this.setCurrentUser(user)}>
                    <Grid>
                        <Row className={activeClass}>
                            <Col sm={3}>
                                {user.displayName}
                            </Col>
                            <Col sm={2}>
                                {user.userName}
                            </Col>
                            <Col sm={2}>
                                <Checkbox readOnly checked={this.state.isDesignerValue}>
                                    Designer
                                </Checkbox>
                            </Col>
                            <Col sm={2}>
                                <Checkbox readOnly checked={this.state.isDeveloperValue}>
                                    Developer
                                </Checkbox>
                            </Col>
                            <Col sm={2}>
                                <Checkbox readOnly checked={this.state.isManagerValue}>
                                    Manager
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
                    <FormGroup controlId="formUserName">
                        <Col componentClass={ControlLabel} sm={2}>
                            User Name (Login)
                        </Col>
                        <Col sm={10}>
                            <FormControl type="text" placeholder={user.userName} value={this.state.userNameValue}
                                         onChange={(e) => this.onUserNameChange(e)}/>
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="formPassword">
                        <Col componentClass={ControlLabel} sm={2}>
                            Password (Login)
                        </Col>
                        <Col sm={10}>
                            <FormControl type="text" placeholder={user.password} value={this.state.passwordValue}
                                         onChange={(e) => this.onPasswordChange(e)}/>
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="formDisplayName">
                        <Col componentClass={ControlLabel} sm={2}>
                            Display Name
                        </Col>
                        <Col sm={10}>
                            <FormControl type="text" placeholder={user.displayName} value={this.state.displayNameValue}
                                         onChange={(e) => this.onDisplayNameChange(e)}/>
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="formIsDesigner">
                        <Col componentClass={ControlLabel} sm={2}>
                            User is Designer
                        </Col>
                        <Col sm={10}>
                            <Checkbox checked={this.state.isDesignerValue}
                                      onChange={(e) => this.onIsDesignerChange(e)}>
                            </Checkbox>
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="formIsDeveloper">
                        <Col componentClass={ControlLabel} sm={2}>
                            User is Developer
                        </Col>
                        <Col sm={10}>
                            <Checkbox checked={this.state.isDeveloperValue}
                                      onChange={(e) => this.onIsDeveloperChange(e)}>
                            </Checkbox>
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="formIsManager">
                        <Col componentClass={ControlLabel} sm={2}>
                            User is Manager
                        </Col>
                        <Col sm={10}>
                            <Checkbox checked={this.state.isManagerValue}
                                      onChange={(e) => this.onIsManagerChange(e)}>
                            </Checkbox>
                        </Col>
                    </FormGroup>

                    <Button bsSize="xs" onClick={() => this.onSave(userContext)}>
                        Save
                    </Button>
                    <Button bsSize="xs" onClick={() => this.onCancel()}>
                        Cancel
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

