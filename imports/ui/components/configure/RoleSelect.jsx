// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components


// Ultrawide Services
import {RoleType, LocationType, ViewType} from '../../../constants/constants.js'
import ClientUserContextServices from '../../../apiClient/apiClientUserContext.js'

// Bootstrap
import {Well, Button} from 'react-bootstrap';

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
class RoleSelect extends Component {

    constructor(props) {
        super(props);
    }

    onRoleSelect(roleType, userContext, active){
        if(active) {
            ClientUserContextServices.setViewFromUserContext(roleType, userContext)
        }
    }

    render() {
        const {type, active, userRole, userContext} = this.props;

        let wellStyle = '';
        let roleButtonStyle = active ? 'role-button-active' : 'role-button-disabled';
        let roleButtonText = '';
        let roleText = '';

        switch(type){
            case RoleType.DESIGNER:
                wellStyle = 'well-designer';
                roleButtonText = active ? 'Switch to Designer View' : 'No Access to Designer View';
                roleText = 'Create and update Designs. View development progress against Design';
                break;
            case RoleType.DEVELOPER:
                wellStyle = 'well-developer';
                roleButtonText = active ? 'Switch to Developer View' : 'No Access to Developer View';
                roleText = 'View Designs and Design Updates. Adopt and Implement Work Packages. Manage and Edit Feature Tests. View Feature and Unit Test Results';
                break;
            case RoleType.MANAGER:
                wellStyle = 'well-manager';
                roleButtonText = active ? 'Switch to Manager View' : 'No Access to Manager View';
                roleText = 'View Designs and Design Updates. View development progress against Design. Create and Edit Work Packages.  View Work Package Progress';
                break;
        }

        return(
            <Well className={wellStyle}>
                <Button className={roleButtonStyle} bsSize="large" block onClick={() => this.onRoleSelect(type, userContext, active)}>{roleButtonText}</Button>
                {roleText}
            </Well>
        )

    }
}

RoleSelect.propTypes = {
    type:   PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:       state.currentUserRole,
        userContext:    state.currentUserItemContext,
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
RoleSelect = connect(mapStateToProps)(RoleSelect);

export default RoleSelect;