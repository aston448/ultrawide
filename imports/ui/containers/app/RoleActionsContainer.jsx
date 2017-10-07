
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import RoleAction                from '../../components/app/RoleAction.jsx';

// Ultrawide Services
import ClientDataServices from '../../../apiClient/apiClientDataServices.js';

// Bootstrap

// REDUX services
import {connect} from 'react-redux';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Role Actions Container.  A list of Actions available to a User Role
//
// ---------------------------------------------------------------------------------------------------------------------

// Login Screen
class RoleActionsList extends Component {
    constructor(props) {
        super(props);

    }

    renderActionsList(roleActions, roleType){

        if(roleActions.length > 0) {
            return roleActions.map((roleAction) => {
                return (
                    <RoleAction
                        key={roleAction}
                        roleAction={roleAction}
                        roleType={roleType}
                    />
                );
            });
        } else {
            return(
                <div className="design-item-note">No Actions for this Role!</div>
            )
        }
    };

    render(){

        const {roleActions, roleType} = this.props;

        return (
            <div>
                {this.renderActionsList(roleActions, roleType)}
            </div>
        );

    }

}

RoleActionsList.propTypes = {
    roleActions:  PropTypes.array.isRequired,
    roleType:     PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        view:           state.currentAppView
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
RoleActionsList = connect(mapStateToProps)(RoleActionsList);


export default RoleActionsContainer = createContainer(({params}) => {

    return {
        roleActions: ClientDataServices.getRoleActions(params.roleType),
        roleType: params.roleType
    }

}, RoleActionsList);