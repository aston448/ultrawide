
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import UserRole                from '../../components/app/UserRole.jsx';

// Ultrawide Services
import ClientContainerServices from '../../../apiClient/apiClientDataServices.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Login Container.  Login if logged out or switch roles if logged in
//
// ---------------------------------------------------------------------------------------------------------------------

// Login Screen
class RolesScreen extends Component {
    constructor(props) {
        super(props);

    }

    renderRolesList(userRoles){

        if(userRoles.length > 0) {
            return userRoles.map((role) => {
                return (
                    <UserRole
                        key={role}
                        userRole={role}
                    />
                );
            });
        } else {
            return(
                <div className="design-item-note">No User Roles</div>
            )
        }
    };

    render(){

        const {userRoles} = this.props;

        return (
            <Grid>
                <Row>
                    <Col md={6} className="col">
                        <div>
                            {this.renderRolesList(userRoles)}
                        </div>
                    </Col>
                </Row>
            </Grid>
        );

    }

}

RolesScreen.propTypes = {
    userRoles:  PropTypes.array.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        view:           state.currentAppView
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
RolesScreen = connect(mapStateToProps)(RolesScreen);


export default AppRolesContainer = createContainer(({params}) => {

    return {
        userRoles: ClientContainerServices.getUserRoles(params.userId)
    }

}, RolesScreen);