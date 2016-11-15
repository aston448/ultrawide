// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components

// Ultrawide Services

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';
import {InputGroup} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Integration Test Mash Scenario Component - One Scenario showing test results
//
// ---------------------------------------------------------------------------------------------------------------------

class IntegrationTestScenarioMashItem extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };

    }

    render(){
        const { mashItem, userContext } = this.props;

        return(
            <div>
                <InputGroup>
                    <span className={"mash-scenario"}>
                        {mashItem.designComponentName}
                    </span>
                    <span className={"mash-scenario-result"}>
                        {mashItem.mashTestStatus}
                    </span>
                </InputGroup>
            </div>
        )
    }

}

IntegrationTestScenarioMashItem.propTypes = {
    mashItem: PropTypes.object.isRequired,
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
IntegrationTestScenarioMashItem = connect(mapStateToProps)(IntegrationTestScenarioMashItem);

export default IntegrationTestScenarioMashItem;