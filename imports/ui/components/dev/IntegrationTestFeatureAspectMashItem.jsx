// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import IntegrationTestScenarioMashContainer         from '../../containers/dev/IntegrationTestScenarioMashContainer.jsx'

// Ultrawide Services
import {DisplayContext} from '../../../constants/constants.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';
import {InputGroup, Label} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// React DnD - Component is draggable


// Draft JS


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Integration Test Mash Feature Aspect Component - One Feature Aspect containing its Scenarios
//
// ---------------------------------------------------------------------------------------------------------------------

class IntegrationTestFeatureAspectMashItem extends Component {

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
                    <div className={"mash-aspect"}>
                        {mashItem.designComponentName}
                    </div>
                </InputGroup>
                <IntegrationTestScenarioMashContainer params={{
                    userContext:    userContext,
                    parentMash:     mashItem,
                    displayContext: DisplayContext.INT_TEST_FEATURE_ASPECT
                }}/>
            </div>
        )
    }

}

IntegrationTestFeatureAspectMashItem.propTypes = {
    mashItem: PropTypes.object.isRequired,
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
IntegrationTestFeatureAspectMashItem = connect(mapStateToProps)(IntegrationTestFeatureAspectMashItem);

export default IntegrationTestFeatureAspectMashItem;