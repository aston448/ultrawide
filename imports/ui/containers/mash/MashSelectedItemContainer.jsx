// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import MashDesignItem       from '../../components/mash/MashDesignItem.jsx';
import DetailsViewHeader    from '../../components/common/DetailsViewHeader.jsx';
import DetailsViewFooter    from '../../components/common/DetailsViewFooter.jsx';

// Ultrawide Services
import {DetailsViewType, ViewType, DisplayContext, ComponentType, LogLevel}    from '../../../constants/constants.js';
import {log} from '../../../common/utils.js';
import TextLookups from '../../../common/lookups.js';

import ClientContainerServices          from '../../../apiClient/apiClientContainerServices.js';
import ClientUserContextServices        from '../../../apiClient/apiClientUserContext.js';
import ClientMashDataServices           from '../../../apiClient/apiClientMashData.js';
import ClientUserSettingsServices       from '../../../apiClient/apiClientUserSettings.js';

// Bootstrap

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

class MashSelectedItemList extends Component {
    constructor(props) {
        super(props);

    }

    onExportFeatureFile(userContext){
        ClientMashDataServices.exportFeature(userContext);
    }


    getEditorClass(){
        return ClientUserSettingsServices.getWindowSizeClassForDesignEditor();
    }

    renderDesignItems(designItems, displayContext){
        return designItems.map((designItem) => {
            if(designItem) {
                return (
                    <MashDesignItem
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

        let panelHeader = '';
        let secondPanelHeader = '';
        let detailsType = '';
        let menuVisible = false;

        let itemHeader = '';
        let panelId = '';
        let secondPanel = <div></div>;

        if(isTopParent || userContext.designComponentId === 'NONE') {

            const nameData = ClientUserContextServices.getContextNameData(userContext, displayContext);

            switch (displayContext) {
                case DisplayContext.MASH_INT_TESTS:
                    detailsType = DetailsViewType.VIEW_INT_TESTS;
                    break;
                case DisplayContext.MASH_UNIT_TESTS:
                    detailsType = DetailsViewType.VIEW_UNIT_TESTS;
                    break;
            }



            switch (itemType) {
                case ComponentType.APPLICATION:
                    // Tests not currently displayed for these unless in WP development
                    panelId = 'featureList';
                    switch(view){
                        case ViewType.DEVELOP_BASE_WP:
                        case ViewType.DEVELOP_UPDATE_WP:
                            panelHeader = TextLookups.mashTestTypes(displayContext) + ' tests for ' + nameData.application;
                            break;
                        default:
                            panelHeader = TextLookups.mashTestTypes(displayContext) + ' tests';
                    }
                    break;
                case ComponentType.DESIGN_SECTION:
                    // Tests not currently displayed for these unless in WP development
                    panelId = 'featureList';
                    switch(view){
                        case ViewType.DEVELOP_BASE_WP:
                        case ViewType.DEVELOP_UPDATE_WP:
                            panelHeader = TextLookups.mashTestTypes(displayContext) + ' tests for ' + nameData.designSection;
                            break;
                        default:
                            panelHeader = TextLookups.mashTestTypes(displayContext) + ' tests';
                    }
                    break;
                case ComponentType.FEATURE:
                    panelId = 'featureAspectList';
                    switch (displayContext) {
                        case DisplayContext.MASH_ACC_TESTS:

                            break;
                        case DisplayContext.MASH_INT_TESTS:
                            panelHeader = TextLookups.mashTestTypes(displayContext) + ' tests for ' + nameData.feature;
                            // Allow feature export to int test file
                            menuVisible = true;
                            break;
                        case DisplayContext.MASH_UNIT_TESTS:
                            panelHeader = TextLookups.mashTestTypes(displayContext) + ' tests for ' + nameData.feature;
                            break;
                    }

                    break;
                case ComponentType.FEATURE_ASPECT:
                    panelId = 'scenarioList';
                    panelHeader = nameData.featureAspect + ' ' + TextLookups.mashTestTypes(displayContext) + ' tests for ' + nameData.feature;
                    itemHeader = 'Scenario';
                    break;
                case ComponentType.SCENARIO:
                    panelId = 'scenarioTestList';
                    panelHeader = TextLookups.mashTestTypes(displayContext) + ' test for SCENARIO:';
                    break;

                default:
                    panelHeader = TextLookups.mashTestTypes(displayContext) + ' tests';
            }
        }

        let mainPanel = <div></div>;
        let noData = false;

        if(designItems.length > 0 ) {

            mainPanel =
                <div id={panelId}>
                    {this.renderDesignItems(designItems, displayContext)}
                </div>;

        } else {
            if(
                userContext.designComponentId === 'NONE' ||
                (userContext.designComponentType === ComponentType.APPLICATION && view === ViewType.DESIGN_UPDATABLE_VIEW)||
                (userContext.designComponentType === ComponentType.DESIGN_SECTION && view === ViewType.DESIGN_UPDATABLE_VIEW)
            ) {

                // No data because no item or non-display item selected
                if(view === ViewType.DESIGN_UPDATABLE_VIEW){
                    mainPanel = <div className="design-item-note">Select a Feature or Feature item to see test results</div>;
                } else {
                    mainPanel = <div className="design-item-note">Select a Design item to see test results</div>;
                }

                noData = true;
            }
        }

        // Get correct window height
        const editorClass = this.getEditorClass();

        // Show the main item box if we have a list of items for the original parent or no parent is selected
        if((isTopParent && designItems.length > 0) || userContext.designComponentId === 'NONE' || noData) {
            return (

                <div className="design-editor-container">
                    <DetailsViewHeader
                        detailsType={detailsType}
                        isClosable={true}
                        titleText={panelHeader}
                    />
                    <div className={editorClass}>
                        {mainPanel}
                        {secondPanel}
                    </div>
                    <DetailsViewFooter
                        detailsType={detailsType}
                        actionsVisible={menuVisible}
                    />
                </div>
            );
        } else {
            return (
                <div>
                    {mainPanel}
                    {secondPanel}
                </div>
            )
        }

    }
}

MashSelectedItemList.propTypes = {
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
        userViewOptions:    state.currentUserViewOptions
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
MashSelectedItemList = connect(mapStateToProps)(MashSelectedItemList);


export default MashSelectedItemContainer = createContainer(({params}) => {

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

    //console.log("Selected item type is " + itemType);

    switch(itemType){
        case ComponentType.FEATURE_ASPECT:
        case ComponentType.SCENARIO:

            // For both of these we want to get Scenario Mash data rather than more design items

            designItems = ClientContainerServices.getScenarioMashData(
                params.userContext,
                featureAspectReferenceId,
                scenarioReferenceId,
            );

            break;

        default:

            // Anything else we get the actual design items, not the scenario mash
            designItems = ClientContainerServices.getComponentDataForParentComponent(
                params.childComponentType,
                params.view,
                params.userContext.designVersionId,
                params.userContext.designUpdateId,
                params.userContext.workPackageId,
                designItemId,
                params.displayContext
            );

    }

    //console.log("Found " + designItems.length + " items of type " + params.childComponentType + " for item type " + itemType);

    return{
        designItems:    designItems,
        itemType:       itemType,
        displayContext: params.displayContext,
        isTopParent:    isTopParent
    }



}, MashSelectedItemList);