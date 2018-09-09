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
import { LogLevel, DisplayContext, ComponentType, ViewMode, UpdateScopeType } from '../../../constants/constants.js';

import { EditorContainerUiModules }             from "../../../ui_modules/editor_container";

import { ClientDataServices }                   from '../../../apiClient/apiClientDataServices.js';
import { ClientWorkPackageComponentServices }   from '../../../apiClient/apiClientWorkPackageComponent.js';
import { ClientDesignVersionServices }          from '../../../apiClient/apiClientDesignVersion.js'
import { ClientDesignComponentServices }        from "../../../apiClient/apiClientDesignComponent";
import { ComponentUiModules }                   from '../../../ui_modules/design_component.js'

// Bootstrap

// REDUX services
import {connect} from 'react-redux';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Feature Aspect Data Container - gets all feature Aspects in a Feature
//
// ---------------------------------------------------------------------------------------------------------------------

// Feature Aspects List for a Feature
class FeatureAspectsList extends Component {
    constructor(props) {
        super(props);

    };

    shouldComponentUpdate(nextProps){

        let shouldUpdate = ComponentUiModules.shouldComponentListUpdate('Feature Aspect', nextProps, this.props);

        if(!shouldUpdate) {
            if (
                nextProps.testDataFlag !== this.props.testDataFlag ||
                nextProps.testSummary !== this.props.testSummary
            ) {
                shouldUpdate = true;
            }

            log((msg) => console.log(msg), LogLevel.PERF, 'Feature Aspects List Should Update: {} because of test data', shouldUpdate);
        }

        return shouldUpdate;

    }

    getDesignUpdateItem(featureAspect, displayContext, designUpdateId){

        return EditorContainerUiModules.getDesignUpdateItem(featureAspect, displayContext, designUpdateId);
    };

    getWpItem(featureAspect, workPackageId){

        return ClientWorkPackageComponentServices.getWorkPackageComponent(featureAspect.componentReferenceId, workPackageId);
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

    // A list of Feature Aspects in a Feature
    renderFeatureAspects() {
        const {components, displayContext, view, mode, userContext, viewOptions, testSummary} = this.props;

        if (components) {

            let updateItem = {};
            let wpItem = {};

            // In a view or scope scenario we don't need a Target
            if(mode === ViewMode.MODE_VIEW || displayContext === DisplayContext.WP_SCOPE || displayContext === DisplayContext.UPDATE_SCOPE) {

                return components.map((featureAspect) => {

                    //let testSummaryData = null;

                    updateItem = this.getDesignUpdateItem(featureAspect, displayContext, userContext.designUpdateId);
                    wpItem = this.getWpItem(featureAspect, userContext.workPackageId);

                    let updateItemScope = UpdateScopeType.SCOPE_OUT_SCOPE;
                    if(updateItem && updateItem.scopeType){
                        updateItemScope = updateItem.scopeType;
                    }

                    const uiItemId = replaceAll(featureAspect.componentNameNew, ' ', '_');
                    const uiParentId = replaceAll(this.getParentName(featureAspect), ' ', '_');

                    return (
                        <DesignComponent
                            key={featureAspect._id}
                            currentItem={featureAspect}
                            updateItem={updateItem}
                            updateItemScope={updateItemScope}
                            wpItem={wpItem}
                            uiItemId={uiItemId}
                            uiParentId={uiParentId}
                            isDragDropHovering={false}
                            displayContext={displayContext}
                            testSummary={testSummary}
                            //testSummaryData={testSummaryData}
                        />
                    );
                });
            } else {

                return components.map((featureAspect) => {

                    updateItem = this.getDesignUpdateItem(featureAspect, displayContext, userContext.designUpdateId);
                    wpItem = this.getWpItem(featureAspect, userContext.workPackageId);

                    return (
                        <DesignComponentTarget
                            key={featureAspect._id}
                            currentItem={featureAspect}
                            updateItem={updateItem}
                            wpItem={wpItem}
                            displayContext={displayContext}
                            view={view}
                            mode={mode}
                            testSummary={testSummary}
                        />
                    );
                });
            }
        } else {
            //console.log("NULL COMPONENTS FOR FEATURE ASPECTS!")
        }
    }

    render() {

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Feature Aspects');

        return (
            <div>
                {this.renderFeatureAspects()}
            </div>
        );
    }
}

FeatureAspectsList.propTypes = {
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
FeatureAspectsList = connect(mapStateToProps)(FeatureAspectsList);

export default FeatureAspectsContainer = createContainer(({params}) => {

    const components =  ClientDataServices.getComponentDataForParentComponent(
        ComponentType.FEATURE_ASPECT,
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

}, FeatureAspectsList);