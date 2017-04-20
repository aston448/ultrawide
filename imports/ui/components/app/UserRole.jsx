// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components
import RoleActionsContainer     from '../../containers/app/RoleActionsContainer.jsx';

// Ultrawide Services
import {RoleType} from '../../../constants/constants.js';

// Bootstrap
import {Well} from 'react-bootstrap';
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

    render() {
        const {userRole, userContext, view} = this.props;

        let wellStyle = '';
        let roleName = '';
        let roleText = '';

        switch(userRole){
            case RoleType.DESIGNER:
                wellStyle = 'well-designer';
                roleName = 'DESIGNER';
                break;
            case RoleType.DEVELOPER:
                wellStyle = 'well-developer';
                roleName = 'DEVELOPER';
                break;
            case RoleType.MANAGER:
                wellStyle = 'well-manager';
                roleName = 'MANAGER';
               break;
        }

        return(
            <Well className={wellStyle}>
                <Grid>
                    <Row>
                        <Col md={12}>
                            <div className="role-name">{roleName}</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <RoleActionsContainer params={{
                                roleType: userRole
                            }}/>
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