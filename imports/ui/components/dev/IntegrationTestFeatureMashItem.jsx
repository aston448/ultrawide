// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import IntegrationTestFeatureAspectMashContainer    from '../../containers/dev/IntegrationTestFeatureAspectMashContainer.jsx';
import IntegrationTestScenarioMashContainer         from '../../containers/dev/IntegrationTestScenarioMashContainer.jsx'

// Ultrawide Services
import {ViewType, DisplayContext, ComponentType, ViewMode, ScenarioStepStatus, ScenarioStepType, StepContext, MashStatus, MashTestStatus} from '../../../constants/constants.js';
import TextLookups from '../../../common/lookups.js';
import ClientFeatureFileServices from  '../../../apiClient/apiClientFeatureFiles.js';
import ClientMashDataServices from  '../../../apiClient/apiClientMashData.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';
import {InputGroup, Label} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// React DnD - Component is draggable


// Draft JS


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Integration Test Mash Feature Component - One Feature containing its Aspects or Scenarios
//
// ---------------------------------------------------------------------------------------------------------------------

class IntegrationTestFeatureMashItem extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };

    }

    hasFeatureAspects(userContext, featureId){
        return ClientMashDataServices.featureHasAspects(userContext, featureId)
    }


    render(){
        const { mashItem, userContext } = this.props;

        let container = '';
        if(this.hasFeatureAspects(userContext, mashItem.designComponentId)){
            container =
                <IntegrationTestFeatureAspectMashContainer params={{
                    featureMash: mashItem,
                    displayContext: DisplayContext.INT_TEST_FEATURE
                }}/>;
        } else {
            container =
                <IntegrationTestScenarioMashContainer params={{
                    parentMash: mashItem,
                    displayContext: DisplayContext.INT_TEST_FEATURE
                }}/>;
        }

        return(
            <div>
                <InputGroup>
                    <div className={"mash-feature"}>
                        {mashItem.designComponentName}
                    </div>
                </InputGroup>
                {container}
            </div>
        )
    }

}

IntegrationTestFeatureMashItem.propTypes = {
    mashItem: PropTypes.object.isRequired,

};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
IntegrationTestFeatureMashItem = connect(mapStateToProps)(IntegrationTestFeatureMashItem);

export default IntegrationTestFeatureMashItem;