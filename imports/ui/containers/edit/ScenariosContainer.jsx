// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import DesignComponent                      from '../../components/edit/DesignComponent.jsx';

// Ultrawide Services
import {log, replaceAll} from "../../../common/utils";
import { LogLevel, DisplayContext, ComponentType, UpdateScopeType } from '../../../constants/constants.js';

import ClientDataServices                   from '../../../apiClient/apiClientDataServices.js';
import ClientWorkPackageComponentServices   from '../../../apiClient/apiClientWorkPackageComponent.js';
import ClientDesignVersionServices          from '../../../apiClient/apiClientDesignVersion.js'
import ClientDesignComponentServices        from "../../../apiClient/apiClientDesignComponent";

// Bootstrap

// REDUX services
import {connect} from 'react-redux';



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
            case DisplayContext.DEV_DESIGN:
                // For WP scoping or Development get the update item if WP is based on an update
                if(designUpdateId !== 'NONE'){
                    return ClientDesignVersionServices.getDesignUpdateItemForUpdate(scenario, designUpdateId);
                } else {
                    return scenario
                }
            default:
                return scenario;
        }
    };

    getParentName(currentItem){

        if(currentItem && currentItem.componentParentReferenceIdNew !== 'NONE') {
            const parent = ClientDesignComponentServices.getCurrentItemParent(currentItem);
            if(parent){
                return parent.componentNameNew;
            } else {
                return 'NONE';
            }
        } else {
            return 'NONE';
        }

    }

    shouldComponentUpdate(){
        return true;
    }

    getWpItem(scenario, workPackageId){
        return ClientWorkPackageComponentServices.getWorkPackageComponent(scenario.componentReferenceId, workPackageId);
    }

    // A list of Scenarios in a Feature or Feature Aspect
    renderScenarios() {
        const {components, displayContext, view, mode, userContext, viewOptions, testSummary} = this.props;

        if(components) {

            return components.map((scenario) => {

                let testSummaryData = null;

                const uiItemId = replaceAll(scenario.componentNameNew, ' ', '_');
                const uiParentId = replaceAll(this.getParentName(scenario), ' ', '_');

                if(testSummary) {
                    testSummaryData = ClientDataServices.getTestSummaryData(scenario);
                }

                let updateItem = this.getDesignUpdateItem(scenario, displayContext, userContext.designUpdateId);
                let wpItem = this.getWpItem(scenario, userContext.workPackageId);

                let updateItemScope = UpdateScopeType.SCOPE_OUT_SCOPE;

                if(updateItem && updateItem.scopeType){
                    updateItemScope = updateItem.scopeType;
                }

                // A scenario does not need to be a Target as can't drop anything on it...
                return (
                    <DesignComponent
                        key={scenario._id}
                        currentItem={scenario}
                        updateItem={updateItem}
                        updateItemScope={updateItemScope}
                        wpItem={wpItem}
                        uiItemId={uiItemId}
                        uiParentId={uiParentId}
                        isDragDropHovering={false}
                        displayContext={displayContext}
                        testSummary={testSummary}
                        testSummaryData={testSummaryData}
                    />
                );
                // return (
                //     <DesignComponentTarget
                //         key={scenario._id}
                //         currentItem={scenario}
                //         updateItem={this.getDesignUpdateItem(scenario, displayContext, userContext.designUpdateId)}
                //         wpItem={this.getWpItem(scenario, userContext.workPackageId)}
                //         displayContext={displayContext}
                //         view={view}
                //         mode={mode}
                //         testSummary={testSummary}
                //         testSummaryData={testSummaryData}
                //     />
                // );
            });
        } else {
            //console.log("NULL COMPONENTS FOR SCENARIOS!")
        }
    }

    render() {

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Scenarios');

        return (
            <div>
                {this.renderScenarios()}
            </div>
        );
    }
}

ScenariosList.propTypes = {
    components: PropTypes.array.isRequired,
    displayContext: PropTypes.string.isRequired,
    testSummary: PropTypes.bool.isRequired
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

    const components =  ClientDataServices.getComponentDataForParentComponent(
        ComponentType.SCENARIO,
        params.view,
        params.designVersionId,
        params.updateId,
        params.workPackageId,
        params.parentRefId,
        params.displayContext,
    );

    return{
        components: components,
        displayContext: params.displayContext,
        testSummary: params.testSummary
    }


}, ScenariosList);