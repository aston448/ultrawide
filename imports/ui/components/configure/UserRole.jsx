// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components


// Ultrawide Services
import {RoleType, LocationType, ViewType} from '../../../constants/constants.js';
import ClientUserContextServices from '../../../apiClient/apiClientUserContext.js';
import ClientAppHeaderServices   from '../../../apiClient/apiClientAppHeader.js';

// Bootstrap
import {Well, Button, FormControl} from 'react-bootstrap';
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Role Select Component - A button to switch to another role
//
// ---------------------------------------------------------------------------------------------------------------------


// App Body component - represents all the design content
class UserRole extends Component {

    constructor(props) {
        super(props);
    }

    onRoleSelect(roleType, userContext, view){

        ClientUserContextServices.setUserRole(roleType);
        ClientUserContextServices.loadMainData(userContext, roleType, view);
    }

    onGoToDesigns(roleType){

        ClientUserContextServices.setUserRole(roleType);
        ClientAppHeaderServices.setViewDesigns();
    }

    onGoToConfig(roleType){

        ClientUserContextServices.setUserRole(roleType);
        ClientAppHeaderServices.setViewConfigure();
    }

    render() {
        const {userRole, userContext, view} = this.props;

        let wellStyle = '';
        let roleName = '';
        let roleText = '';

        switch(userRole){
            case RoleType.DESIGNER:
                wellStyle = 'well-designer';
                roleName = 'DESIGNER';
                roleText = ' - Manage Designs\n - Manage Design Updates\n - Edit Designs and Design Updates\n - View development progress against Design';
                break;
            case RoleType.DEVELOPER:
                wellStyle = 'well-developer';
                roleName = 'DEVELOPER';
                roleText = ' - View Designs and Design Updates\n - Adopt and Implement Work Packages\n - Manage Test Integration\n - View Integration and Unit Test Results';
                break;
            case RoleType.MANAGER:
                wellStyle = 'well-manager';
                roleName = 'MANAGER';
                roleText = ' - View Designs and Design Updates\n - View development progress against Design\n - Create and Edit Work Packages\n - View Work Package Progress';
                break;
        }

        return(
            <Well className={wellStyle}>
                <Grid>
                    <Row>
                        <Col md={12}>
                            <div className="ultrawide-logo">{roleName}</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <div className="role-text">{roleText}</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={2}>
                            <Button bsSize="small" onClick={() => this.onRoleSelect(userRole, userContext, view)}>Go to last item</Button>
                        </Col>
                        <Col md={2}>
                            <Button bsSize="small" onClick={() => this.onGoToDesigns(userRole)}>Go to Designs</Button>
                        </Col>
                        <Col md={2}>
                            <Button bsSize="small" onClick={() => this.onGoToConfig(userRole)}>Go to Configuration</Button>
                        </Col>
                    </Row>
                </Grid>
            </Well>
        )

    }
}

UserRole.propTypes = {
    userRole:   PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext,
        view: state.currentAppView
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
UserRole = connect(mapStateToProps)(UserRole);

export default UserRole;