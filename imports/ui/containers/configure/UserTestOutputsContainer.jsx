
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import UserTestLocationConfiguration        from '../../components/configure/UserTestLocationConfiguration.jsx';
import ItemList                             from '../../components/item/ItemList.jsx';

// Ultrawide Services
import {log} from "../../../common/utils";
import {ItemListType, LogLevel} from "../../../constants/constants";

import { ClientDataServices }  from '../../../apiClient/apiClientDataServices.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// User Test Outputs Local Config.
//
// ---------------------------------------------------------------------------------------------------------------------

export class UserTestOutputConfiguration extends Component {
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

    render(){

        const {userLocations} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER User Test Outputs');

        const headerText = 'My Local Test Output Configuration';

        return (
            <Grid>
                <Row>
                    <Col md={8} className="close-col">
                        <ItemList
                            headerText={headerText}
                            bodyDataFunction={() => this.renderTestLocationsList(userLocations)}
                            hasFooterAction={false}
                            footerAction={'NONE'}
                            footerActionFunction={null}
                            listType={ItemListType.ULTRAWIDE_ITEM}
                        />
                    </Col>
                </Row>
            </Grid>
        );
    }
}

UserTestOutputConfiguration.propTypes = {
    userLocations:       PropTypes.array.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        view:           state.currentAppView
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default UserTestOutputsContainer = createContainer(({params}) => {

    return {userLocations: ClientDataServices.getUserTestOutputLocationData(params.userContext)};

}, connect(mapStateToProps)(UserTestOutputConfiguration));