
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections
import { UserRoles }            from '../../../collections/users/user_roles.js';

// Ultrawide GUI Components
import UserLogin                from '../../components/login/UserLogin.jsx';
import UserConfiguration        from '../../components/configure/UserConfiguration.jsx';


// Ultrawide Services
import {ViewType}               from '../../../constants/constants.js'
import ClientContainerServices  from '../../../apiClient/apiClientContainerServices.js';

// Bootstrap


// REDUX services
import {connect} from 'react-redux';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Configure Container.  Change user roles and set file paths
//
// ---------------------------------------------------------------------------------------------------------------------

class ConfigureScreen extends Component {
    constructor(props) {
        super(props);

    }

    render() {

        const {userLocations} = this.props;

        // Show Configuration Screen
        return (
            <UserConfiguration
                userLocations={userLocations}
            />
        )


    }
}

ConfigureScreen.propTypes = {
    userLocations:       PropTypes.array.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        view:           state.currentAppView
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
ConfigureScreen = connect(mapStateToProps)(ConfigureScreen);



export default AppConfigureContainer = createContainer(({params}) => {

    return {userLocations: ClientContainerServices.getUserTestOutputLocationData(params.userContext)};

}, ConfigureScreen);