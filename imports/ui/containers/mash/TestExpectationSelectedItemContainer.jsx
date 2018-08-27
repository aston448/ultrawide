// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import TestExpectationDesignItem       from '../../components/mash/TestExpectationDesignItem.jsx';

// Ultrawide Services
import {DetailsViewType, ViewType, DisplayContext, ComponentType, LogLevel}    from '../../../constants/constants.js';
import {log} from '../../../common/utils.js';
import { TextLookups } from '../../../common/lookups.js';

import { ClientDataServices }               from '../../../apiClient/apiClientDataServices.js';
import { ClientUserContextServices }        from '../../../apiClient/apiClientUserContext.js';
import { ClientUserSettingsServices }       from '../../../apiClient/apiClientUserSettings.js';
import { TestResultsUiServices }            from '../../../ui_modules/test_results.js';

// Bootstrap

// REDUX services
import {connect} from 'react-redux';
import {EditorTab} from "../../../constants/constants";
import store from "../../../redux/store";

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design / Dev Integration Test Mash Container - Contains picture of the currently selected design Feature / Feature
// Aspect / Scenario as related to Dev Integration Testing
// Renders list of Features if an Application or DesignSection is currently selected
//
// ---------------------------------------------------------------------------------------------------------------------

class TestExpectationSelectedItemList extends Component {
    constructor(props) {
        super(props);

    }

    shouldComponentUpdate(nextProps, nextState){

        return true;
    }

    getEditorClass(){
        return ClientUserSettingsServices.getWindowSizeClassForDesignEditor();
    }

    renderDesignItems(designItems, displayContext){
        return designItems.map((designItem) => {
            if(designItem) {
                return (
                    <TestExpectationDesignItem
                        key={designItem._id}
                        designItem={designItem}
                        displayContext={displayContext}
                    />
                );
            }
        });
    }


    render() {

        const {designItems, itemType, displayContext, isTopParent, userContext, view} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Mash Selected Item');

        // Don't bother to render if not actually visible
        // TODO - conditional render
        if(true) {

            let panelHeader = '';
            let detailsType = '';
            let menuVisible = false;

            let itemHeader = '';
            let panelId = '';

            let mainPanel = <div></div>;
            let noData = false;

            if (designItems.length > 0) {

                // Render more design or the expectations
                mainPanel =
                    <div id={panelId}>
                        {this.renderDesignItems(designItems, displayContext)}
                    </div>

            } else {

                // Show a missing selection message if appropriate

                if (
                    userContext.designComponentId === 'NONE' ||
                    userContext.designComponentType === ComponentType.APPLICATION ||
                    userContext.designComponentType === ComponentType.DESIGN_SECTION
                ) {

                    mainPanel =
                        <div className="design-item-note">
                            Select a Feature or Feature item to see test expectations
                        </div>
                    noData = true;

                }
            }


            return (
                <div>
                    {mainPanel}
                </div>
            )

        } else {
            // Dummy render when not actualy visible
            return (
                <div>
                </div>
            )
        }

    }
}

TestExpectationSelectedItemList.propTypes = {
    designItems:    PropTypes.array.isRequired,
    itemType:       PropTypes.string.isRequired,
    displayContext: PropTypes.string.isRequired,
    isTopParent:    PropTypes.bool.isRequired
};


// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        view:               state.currentAppView,
        mode:               state.currentViewMode,
        userContext:        state.currentUserItemContext,
        userRole:           state.currentUserRole,
        testDataStale:      state.testDataStale,
        userViewOptions:    state.currentUserViewOptions,
        designTab:          state.currentUserDesignTab,
        devTab:             state.currentUserDevTab
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
TestExpectationSelectedItemList = connect(mapStateToProps)(TestExpectationSelectedItemList);


export default TestExpectationSelectedItemContainer = createContainer(({params}) => {

    // The parent design item is either the original user context or the next item down passed in
    let designItemId = params.userContext.designComponentId;

    const featureAspectReferenceId = params.userContext.featureAspectReferenceId;
    const scenarioReferenceId = params.userContext.scenarioReferenceId;
    const itemType = params.userContext.designComponentType;

    let isTopParent = true;

    if(params.designItemId !== 'NONE'){
        designItemId = params.designItemId;
        isTopParent = false;
    }

    let designItems = [];

    console.log("Selected item type is " + itemType);

    switch(itemType) {

        case ComponentType.SCENARIO:

            // Just return the Scenario
            const designItem = ClientDataServices.getComponent(designItemId, params.userContext);

            designItems.push(designItem);

            break;

        default:

            let componentRefId = 'NONE';

            if (designItemId !== 'NONE') {

                const currentDesignItem = ClientDataServices.getComponent(designItemId, params.userContext);

                if (currentDesignItem) {
                    componentRefId = currentDesignItem.componentReferenceId;
                }
            }

            // Anything else we get the actual design items, not the scenario mash
            designItems = ClientDataServices.getComponentDataForParentComponent(
                params.childComponentType,
                params.view,
                params.userContext.designVersionId,
                params.userContext.designUpdateId,
                params.userContext.workPackageId,
                componentRefId,
                params.displayContext
            );

    }

    console.log("Found " + designItems.length + " items of type " + params.childComponentType + " for item type " + itemType);

    return{
        designItems:    designItems,
        itemType:       itemType,
        displayContext: params.displayContext,
        isTopParent:    isTopParent
    }



}, TestExpectationSelectedItemList);