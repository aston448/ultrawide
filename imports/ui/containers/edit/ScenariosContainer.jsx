// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import DesignComponentTarget from '../../components/edit/DesignComponentTarget.jsx';

// Ultrawide Services
import { ViewType, DisplayContext, ComponentType } from '../../../constants/constants.js';
import ClientContainerServices              from '../../../apiClient/apiClientContainerServices.js';
import ClientWorkPackageComponentServices   from '../../../apiClient/apiClientWorkPackageComponent.js';
import ClientDesignVersionServices          from '../../../apiClient/apiClientDesignVersion.js'

// Bootstrap

// REDUX services
import {connect} from 'react-redux';

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Scenarios Data Container - selects data for Scenarios in a Feature or Feature Aspect
//
// ---------------------------------------------------------------------------------------------------------------------

// Scenarios List for a Feature or Feature Aspect
class ScenariosList extends Component {
    constructor(props) {
        super(props);

    };

    getDesignUpdateItem(scenario, displayContext, designUpdateId){
        switch(displayContext){
            case  DisplayContext.WORKING_VIEW:
                return ClientDesignVersionServices.getDesignUpdateItemForUpdatableVersion(scenario);
            case DisplayContext.UPDATE_SCOPE:
                // See if this item is in scope - i.e. in the DU
                return ClientDesignVersionServices.getDesignUpdateItemForUpdate(scenario, designUpdateId);
            case DisplayContext.WP_SCOPE:
                // For WP scoping get the update item if WP is based on an update
                if(designUpdateId !== 'NONE'){
                    return ClientDesignVersionServices.getDesignUpdateItemForUpdate(scenario, designUpdateId);
                } else {
                    return scenario
                }
            default:
                return scenario;
        }
    };

    getWpItem(scenario, workPackageId){
        return ClientWorkPackageComponentServices.getWorkPackageComponent(scenario._id, workPackageId);
    }

    // A list of Scenarios in a Feature or Feature Aspect
    renderScenarios() {
        const {components, displayContext, view, mode, userContext, viewOptions} = this.props;

        if(components) {

            // Get the appropriate test summary flag for the view
            let testSummary = false;

            switch(view){
                case ViewType.DESIGN_NEW_EDIT:
                case ViewType.DESIGN_PUBLISHED_VIEW:
                case ViewType.DESIGN_UPDATABLE_VIEW:
                    testSummary = viewOptions.designTestSummaryVisible;
                    break;
                case ViewType.DESIGN_UPDATE_EDIT:
                case ViewType.DESIGN_UPDATE_VIEW:
                    testSummary = viewOptions.updateTestSummaryVisible;
                    break;
                case ViewType.DEVELOP_BASE_WP:
                case ViewType.DEVELOP_UPDATE_WP:
                case ViewType.WORK_PACKAGE_BASE_VIEW:
                case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                    testSummary = viewOptions.devTestSummaryVisible;
                    break;
            }

            return components.map((scenario) => {

                let testSummaryData = null;

                if(testSummary) {
                    testSummaryData = ClientContainerServices.getTestSummaryData(scenario);
                }

                return (
                    <DesignComponentTarget
                        key={scenario._id}
                        currentItem={scenario}
                        updateItem={this.getDesignUpdateItem(scenario, displayContext, userContext.designUpdateId)}
                        wpItem={this.getWpItem(scenario, userContext.workPackageId)}
                        displayContext={displayContext}
                        view={view}
                        mode={mode}
                        testSummary={testSummary}
                        testSummaryData={testSummaryData}
                    />
                );
            });
        } else {
            //console.log("NULL COMPONENTS FOR SCENARIOS!")
        }
    }

    render() {
        return (
            <div>
                {this.renderScenarios()}
            </div>
        );
    }
}

ScenariosList.propTypes = {
    components: PropTypes.array.isRequired,
    displayContext: PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        view:           state.currentAppView,
        mode:           state.currentViewMode,
        userContext:    state.currentUserItemContext,
        viewOptions:    state.currentUserViewOptions
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
ScenariosList = connect(mapStateToProps)(ScenariosList);

export default ScenariosContainer = createContainer(({params}) => {

    let returnData =  ClientContainerServices.getComponentDataForParentComponent(
        ComponentType.SCENARIO,
        params.view,
        params.designVersionId,
        params.updateId,
        params.workPackageId,
        params.parentId,
        params.displayContext,
    );

    //console.log("Return data: " + returnData.components);

    return returnData;


}, ScenariosList);