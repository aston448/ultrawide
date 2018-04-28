// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import DesignComponentTarget                from '../../components/edit/DesignComponentTarget.jsx';
import DesignComponent                      from '../../components/edit/DesignComponent.jsx';

// Ultrawide Services
import {log, replaceAll} from "../../../common/utils";
import { LogLevel, DisplayContext, ComponentType, UpdateScopeType, ViewMode } from '../../../constants/constants.js';

import ClientDataServices                   from '../../../apiClient/apiClientDataServices.js';
import { ClientWorkPackageComponentServices }   from '../../../apiClient/apiClientWorkPackageComponent.js';
import ClientDesignVersionServices          from '../../../apiClient/apiClientDesignVersion.js'
import { ClientDesignComponentServices }        from "../../../apiClient/apiClientDesignComponent";
// Bootstrap

// REDUX services
import {connect} from 'react-redux';
import ComponentUiModules from "../../../ui_modules/design_component";



// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Feature Data Container - selects data for all Features in a Design Section
//
// ---------------------------------------------------------------------------------------------------------------------


// Features List for a Design Aspect
class FeaturesList extends Component {
    constructor(props) {
        super(props);
    };

    shouldComponentUpdate(nextProps, nextState){

        let shouldUpdate = false;

        // Update if new list of Features or change in test data

        shouldUpdate = ComponentUiModules.shouldComponentListUpdate('Feature', nextProps, this.props);

        if(!shouldUpdate) {
            if (
                nextProps.testDataFlag !== this.props.testDataFlag ||
                nextProps.testSummary !== this.props.testSummary ||
                    nextProps.viewOptionsFlag !== this.props.viewOptionsFlag
            ) {
                shouldUpdate = true;
            }

            log((msg) => console.log(msg), LogLevel.PERF, 'Features List Should Update: {} because of test data', shouldUpdate);
        }

        return shouldUpdate;
    }

    getDesignUpdateItem(feature, displayContext, designUpdateId){
        switch(displayContext){
            case  DisplayContext.WORKING_VIEW:
                return ClientDesignVersionServices.getDesignUpdateItemForUpdatableVersion(feature);
            case DisplayContext.UPDATE_SCOPE:
                // See if this item is in scope - i.e. in the DU
                return ClientDesignVersionServices.getDesignUpdateItemForUpdate(feature, designUpdateId);
            case DisplayContext.WP_SCOPE:
            case DisplayContext.DEV_DESIGN:
                // For WP scoping or Development get the update item if WP is based on an update
                if(designUpdateId !== 'NONE'){
                    return ClientDesignVersionServices.getDesignUpdateItemForUpdate(feature, designUpdateId);
                } else {
                    return feature
                }
            default:
                return feature;
        }
    };

    getWpItem(feature, workPackageId){
        return ClientWorkPackageComponentServices.getWorkPackageComponent(feature.componentReferenceId, workPackageId);
    }

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

    // A list of Features in a Design Section
    renderFeatures() {
        const {components, displayContext, view, mode, userContext, viewOptions, testSummary} = this.props;


        if(components) {

            let updateItem = {};
            let wpItem = {};

            // In a view or scope scenario we don't need a Target
            if(mode === ViewMode.MODE_VIEW || displayContext === DisplayContext.WP_SCOPE || displayContext === DisplayContext.UPDATE_SCOPE) {

                return components.map((feature) => {

                    let testSummaryData = null;

                    if (testSummary) {
                        testSummaryData = ClientDataServices.getTestSummaryFeatureData(feature);
                    }

                    updateItem = this.getDesignUpdateItem(feature, displayContext, userContext.designUpdateId);
                    wpItem = this.getWpItem(feature, userContext.workPackageId);

                    let updateItemScope = UpdateScopeType.SCOPE_OUT_SCOPE;
                    if(updateItem && updateItem.scopeType){
                        updateItemScope = updateItem.scopeType;
                    }

                    const uiItemId = replaceAll(feature.componentNameNew, ' ', '_');
                    const uiParentId = replaceAll(this.getParentName(feature), ' ', '_');

                    return (
                        <DesignComponent
                            key={feature._id}
                            currentItem={feature}
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

                return components.map((feature) => {

                    let testSummaryData = null;

                    if (testSummary) {
                        testSummaryData = ClientDataServices.getTestSummaryFeatureData(feature);
                    }

                    updateItem = this.getDesignUpdateItem(feature, displayContext, userContext.designUpdateId);
                    wpItem = this.getWpItem(feature, userContext.workPackageId);

                    return (
                        <DesignComponentTarget
                            key={feature._id}
                            currentItem={feature}
                            updateItem={updateItem}
                            wpItem={wpItem}
                            displayContext={displayContext}
                            view={view}
                            mode={mode}
                            testSummary={testSummary}
                            testSummaryData={testSummaryData}
                        />
                    );
                });
            }
        } else {
            //console.log("NULL COMPONENTS FOR FEATURES!")
        }
    }

    render() {

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Features');

        return (
            <div>
                {this.renderFeatures()}
            </div>
        );
    }
}

FeaturesList.propTypes = {
    components: PropTypes.array.isRequired,
    displayContext: PropTypes.string.isRequired,
    testSummary: PropTypes.bool.isRequired,
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        view:           state.currentAppView,
        mode:           state.currentViewMode,
        userContext:    state.currentUserItemContext,
        viewOptions:    state.currentUserViewOptions,
        testDataFlag:   state.testDataFlag,
        updateScopeFlag: state.currentUpdateScopeFlag,
        viewOptionsFlag:    state.currentViewOptionsDataValue
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
FeaturesList = connect(mapStateToProps)(FeaturesList);

export default FeaturesContainer = createContainer(({params}) => {

    const components = ClientDataServices.getComponentDataForParentComponent(
        ComponentType.FEATURE,
        params.view,
        params.designVersionId,
        params.updateId,
        params.workPackageId,
        params.parentRefId,
        params.displayContext
    );

    return{
        components: components,
        displayContext: params.displayContext,
        testSummary: params.testSummary
    }

}, FeaturesList);