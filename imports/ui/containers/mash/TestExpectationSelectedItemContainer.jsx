// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import TestExpectationDesignItem        from '../../components/mash/TestExpectationDesignItem.jsx';
import DetailsViewHeader                from '../../components/common/DetailsViewHeader.jsx';
import DetailsViewFooter                from '../../components/common/DetailsViewFooter.jsx';

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
import {EditorTab, MashTestStatus} from "../../../constants/constants";
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

    getEditorClass(){
        return ClientUserSettingsServices.getWindowSizeClassForDesignEditor();
    }

    render() {

        const {designItems, itemType, displayContext, isTopParent, userContext, view} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Mash Selected Item');

        // Get correct window height
        const editorClass = this.getEditorClass();

        if(isTopParent) {

            const nameData = ClientUserContextServices.getContextNameData(userContext, displayContext);

            let titleText = '';

            switch(displayContext){
                case DisplayContext.TEST_EXPECTATIONS:
                    titleText = 'Test Expectations for ';
                    break;
                case DisplayContext.TEST_RESULTS:
                    titleText = 'Test Results for ';
                    break;
            }

            switch(itemType){
                case ComponentType.SCENARIO:
                    titleText += ' Scenario';
                    break;
                case ComponentType.FEATURE_ASPECT:
                    titleText += nameData.featureAspect + ' scenarios in ' + nameData.feature;
                    break;
                case ComponentType.FEATURE:
                    titleText += nameData.feature;
                    break;
            }

            let mainPanel = <div></div>;

            if (userContext.designComponentId !== 'NONE' && designItems.length > 0) {

                // Render more design or the expectations
                mainPanel =
                    <div className="design-editor-container">
                        <DetailsViewHeader
                            detailsType={DetailsViewType.VIEW_TEST_EXPECTATIONS}
                            isClosable={true}
                            titleText={titleText}
                        />
                        <div className={editorClass}>
                            {this.renderDesignItems(designItems, displayContext)}
                        </div>
                        <DetailsViewFooter
                            detailsType={DetailsViewType.VIEW_TEST_EXPECTATIONS}
                            actionsVisible={true}
                        />
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
                        </div>;

                }
            }


            return (
                <div>
                    {mainPanel}
                </div>
            )

        } else {
            // Next level down
            return (
                <div>
                    {this.renderDesignItems(designItems, displayContext)}
                </div>
            )
        }

    }
}

TestExpectationSelectedItemList.propTypes = {
    designItems:        PropTypes.array.isRequired,
    itemType:           PropTypes.string,
    displayContext:     PropTypes.string.isRequired,
    isTopParent:        PropTypes.bool.isRequired
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

    const itemType = params.userContext.designComponentType;

    let isTopParent = true;

    if (params.designItemId !== 'NONE') {
        designItemId = params.designItemId;
        isTopParent = false;
    }

    let designItems = [];

    //console.log("Selected item type is " + itemType);

    switch (itemType) {

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

            // Anything else we get the actual design items, not the scenario
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


    //console.log("Found " + designItems.length + " items of type " + params.childComponentType + " for item type " + itemType);

    return {
        designItems: designItems,
        itemType: itemType,
        displayContext: params.displayContext,
        isTopParent: isTopParent,
    }
}, TestExpectationSelectedItemList);