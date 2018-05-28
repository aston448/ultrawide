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

import { EditorContainerUiModules }             from "../../../ui_modules/editor_container";

import { ClientDataServices }                   from '../../../apiClient/apiClientDataServices.js';
import { ClientWorkPackageComponentServices }   from '../../../apiClient/apiClientWorkPackageComponent.js';
import { ClientDesignVersionServices }          from '../../../apiClient/apiClientDesignVersion.js'
import { ClientDesignComponentServices }        from "../../../apiClient/apiClientDesignComponent";
import { ComponentUiModules }                   from "../../../ui_modules/design_component";

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

    shouldComponentUpdate(nextProps){

        let shouldUpdate = ComponentUiModules.shouldComponentListUpdate('Scenario', nextProps, this.props);

        if(!shouldUpdate) {
            if (
                nextProps.testDataFlag !== this.props.testDataFlag ||
                nextProps.testSummary !== this.props.testSummary
            ) {
                shouldUpdate = true;
            }

            log((msg) => console.log(msg), LogLevel.PERF, 'Scenarios List Should Update: {} because of test data', shouldUpdate);
        }

        return shouldUpdate;

    }

    getDesignUpdateItem(scenario, displayContext, designUpdateId){

        return EditorContainerUiModules.getDesignUpdateItem(scenario, displayContext, designUpdateId);
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