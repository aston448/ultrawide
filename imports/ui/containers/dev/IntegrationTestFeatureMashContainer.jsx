// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';


// Ultrawide Collections


// Ultrawide GUI Components
import IntegrationTestFeatureMashItem               from '../../components/dev/IntegrationTestFeatureMashItem.jsx';
import IntegrationTestFeatureAspectMashContainer    from '../../containers/dev/IntegrationTestFeatureAspectMashContainer.jsx';
import IntegrationTestScenarioMashContainer         from '../../containers/dev/IntegrationTestScenarioMashContainer.jsx';

// Ultrawide Services
import {RoleType, DisplayContext, MashStatus, ComponentType, LogLevel}    from '../../../constants/constants.js';
import {log} from '../../../common/utils.js';

import ClientContainerServices      from '../../../apiClient/apiClientContainerServices.js';
import UserContextServices          from '../../../apiClient/apiClientUserContext.js';
import ClientMashDataServices       from '../../../apiClient/apiClientMashData.js';



// Bootstrap
import {Panel} from 'react-bootstrap';
import {InputGroup} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design / Dev Integration Test Mash Container - Contains picture of the currently selected design Feature / Feature
// Aspect / Scenario as related to Dev Integration Testing
// Renders list of Features if an Application or DesignSection is currently selected
//
// ---------------------------------------------------------------------------------------------------------------------

class IntegrationTestFeatureMashList extends Component {
    constructor(props) {
        super(props);

    }

    shouldComponentUpdate(nextProps, nextState){
        return true;
    }


    renderFeatures(mashData){

        //console.log("Rendering mash list of length " + mashData.length);

        return mashData.map((mashItem) => {
            if(mashItem) {
                return (
                    <IntegrationTestFeatureMashItem
                        key={mashItem._id}
                        mashItem={mashItem}
                    />
                );
            }
        });
    }

    // // Renders stuff in the current context that is in Dev but not in the Design
    // renderUnknownDesignItemMash(mashData){
    //
    //     let unknownMashData = [];
    //
    //     mashData.forEach((mashItem) => {
    //
    //         if(mashItem.mashStatus === MashStatus.MASH_NOT_DESIGNED){
    //             unknownMashData.push(mashItem);
    //         }
    //     });
    //
    //     console.log("Rendering unknown mash list of length " + unknownMashData.length);
    //
    //     return unknownMashData.map((mashItem) => {
    //         if(mashItem) {
    //             return (
    //                 <DesignDevMashItem
    //                     key={mashItem._id}
    //                     mashItem={mashItem}
    //                 />
    //             );
    //         }
    //     });
    // }

    // Render any Unit Test results relevant to Scenarios in this Feature
    renderFeatureUnitTestsMash(unitTestMashData){

    }

    render() {

        const {designMashItemData, userContext} = this.props;

        //console.log("Rendering integration mash container with user context component type " + userContext.designComponentType);

        let panelHeader = '';
        let secondPanelHeader = '';

        let itemHeader = '';
        let secondPanel = <div></div>;


        const nameData = UserContextServices.getContextNameData(userContext);

        switch(userContext.designComponentType){
            case ComponentType.APPLICATION:
                panelHeader = 'Tests for ' + nameData.application;
                break;
            case ComponentType.DESIGN_SECTION:
                panelHeader = 'Tests in ' + nameData.designSection;
                break;
            case ComponentType.FEATURE:
                panelHeader = 'Tests for ' + nameData.feature;
                break;
            case ComponentType.FEATURE_ASPECT:
                panelHeader = nameData.featureAspect + ' tests for ' + nameData.feature;
                itemHeader = 'Scenario';
                break;
            case ComponentType.SCENARIO:
                panelHeader = 'Test for ' + nameData.scenario;
                break;
        }


        let mainPanel = 'No data for this item - try refreshing test data';

        if(designMashItemData.length > 0) {
            switch(userContext.designComponentType){
                case ComponentType.APPLICATION:
                case ComponentType.DESIGN_SECTION:
                    mainPanel =
                        <Panel className="panel-text panel-text-body" header={panelHeader}>
                            {this.renderFeatures(designMashItemData)}
                        </Panel>;
                    break;
                case ComponentType.FEATURE:
                    // Render Aspects or Scenarios (if any)
                    if(ClientMashDataServices.featureHasAspects(userContext, userContext.designComponentId)){
                        mainPanel =
                            <Panel className="panel-text panel-text-body" header={panelHeader}>
                               <IntegrationTestFeatureAspectMashContainer params={{
                                   userContext:     userContext,
                                   featureMash:     null
                                }}/>
                            </Panel>

                    } else {
                        // Just render the scenarios
                        mainPanel =
                            <Panel className="panel-text panel-text-body" header={panelHeader}>
                                <IntegrationTestScenarioMashContainer params={{
                                    userContext:    userContext,
                                    parentMash:     null
                                }}/>
                            </Panel>;
                    }
                    break;
                case ComponentType.FEATURE_ASPECT:
                    mainPanel =
                        <Panel className="panel-text panel-text-body" header={panelHeader}>
                            <IntegrationTestScenarioMashContainer params={{
                                userContext:    userContext,
                                parentMash:     null
                            }}/>
                        </Panel>;
                    break;
                case ComponentType.SCENARIO:
                    // Render the step editor
                    mainPanel =
                        <Panel className="panel-text panel-text-body" header={panelHeader}>
                            <IntegrationTestScenarioMashContainer params={{
                                userContext:    userContext,
                                parentMash:     null
                            }}/>
                        </Panel>;
            }
        }

        return(
            <div>
                {mainPanel}
            </div>
        );

    }
}

IntegrationTestFeatureMashList.propTypes = {
    designMashItemData: PropTypes.array
};


// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext:        state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
IntegrationTestFeatureMashList = connect(mapStateToProps)(IntegrationTestFeatureMashList);


export default IntegrationTestFeatureMashContainer = createContainer(({params}) => {


    let designMashItemData = ClientContainerServices.getDesignIntegrationTestMashData(params.userContext, null);

    log((msg) => console.log(msg), LogLevel.DEBUG, "Integration design mash data returned {} features", designMashItemData.length);

    return{
        designMashItemData
    }


}, IntegrationTestFeatureMashList);