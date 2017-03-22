
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections
import { UserRoles }            from '../../../collections/users/user_roles.js';

// Ultrawide GUI Components
import UserTestLocationConfiguration        from '../../components/configure/UserTestLocationConfiguration.jsx';
import ItemContainer                        from '../../components/common/ItemContainer.jsx';

// Ultrawide Services
import {ViewType}               from '../../../constants/constants.js'
import ClientContainerServices  from '../../../apiClient/apiClientContainerServices.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// User Local Settings Container.
//
// ---------------------------------------------------------------------------------------------------------------------

export class LocalSettingsScreen extends Component {
    constructor(props) {
        super(props);

    }
    renderTestLocationsList(userLocations){

        if(userLocations.length > 0) {
            return userLocations.map((userLocation) => {
                return (
                    <UserTestLocationConfiguration
                        key={userLocation._id}
                        userLocation={userLocation}
                    />
                );
            });
        } else {
            return(
                <div className="design-item-note">No Test Output Locations Available</div>
            )
        }
    };

    renderOtherFunctions(){
        return (
            <div className="design-item-note">
                Other user settings to go here
            </div>
        )
    }

    render(){

        const {userLocations, userRole} = this.props;

        const headerText = 'Test Output Configuration for ' + userRole;

        return (
            <Grid>
                <Row>
                    <Col md={6} className="close-col">
                        <ItemContainer
                            headerText={headerText}
                            bodyDataFunction={() => this.renderTestLocationsList(userLocations)}
                            hasFooterAction={false}
                            footerAction={'NONE'}
                            footerActionFunction={null}
                        />
                    </Col>
                    <Col md={6} className="close-col">
                        <ItemContainer
                            headerText={'Other configuration settings'}
                            bodyDataFunction={() => this.renderOtherFunctions()}
                            hasFooterAction={false}
                            footerAction={'NONE'}
                            footerActionFunction={null}
                        />
                    </Col>
                </Row>
            </Grid>
        );
    }
}

LocalSettingsScreen.propTypes = {
    userLocations:       PropTypes.array.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        view:           state.currentAppView,
        userRole:       state.currentUserRole
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default LocalSettingsContainer = createContainer(({params}) => {

    return {userLocations: ClientContainerServices.getUserTestOutputLocationData(params.userContext)};

}, connect(mapStateToProps)(LocalSettingsScreen));