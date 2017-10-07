// == IMPORTS ==========================================================================================================


// Ultrawide Services
import { DesignUpdateSummaryCategory, DesignUpdateSummaryType, ViewType, LogLevel} from '../constants/constants.js';
import { log }        from '../common/utils.js';

import DesignUpdateSummaryServices from '../apiServer/apiDesignUpdateSummary.js';

// Data Access
import WorkPackageComponentData         from '../data/work/work_package_component_db.js';
import UserDesignUpdateSummaryData      from '../data/summary/user_design_update_summary_db.js';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Client Design Update Summary - Gets the data required to summarise a Design Update
//
// ---------------------------------------------------------------------------------------------------------------------

class ClientDesignUpdateSummary{

    getDesignUpdateSummary(updateChanged){

        const userContext = store.getState().currentUserItemContext;
        const view = store.getState().currentAppView;
        const viewOptions = store.getState().currentUserViewOptions;

        log((msg) => console.log(msg), LogLevel.DEBUG, "Client: Refreshing DU Summary for view {}", view);
        log((msg) => console.log(msg), LogLevel.DEBUG, "Options: updateSummaryVisible {}", viewOptions.updateSummaryVisible);

        // Only worth refreshing the data if the Update is visible
        if( viewOptions && (
            (view === ViewType.SELECT && userContext.designUpdateId !== 'NONE') ||
            (view === ViewType.DESIGN_UPDATE_EDIT && viewOptions.updateSummaryVisible) ||
            (view === ViewType.DESIGN_UPDATE_VIEW && viewOptions.updateSummaryVisible)
            )
        ) {

            log((msg) => console.log(msg), LogLevel.DEBUG, "Client: Refreshing DU Summary...");
            DesignUpdateSummaryServices.refreshDesignUpdateSummary(userContext, updateChanged, (err, result) => {

                if (err) {
                    // Unexpected error as all expected errors already handled - show alert.
                    // Can't update screen here because of error
                    alert('Unexpected error 1: ' + err.reason + '.  Contact support if persists!');

                }
            });
        }
    };

    getDesignUpdateSummaryHeaders(userContext){

        // Nothing if no Design Update is set
        if(userContext.designUpdateId === 'NONE'){

            return {
                addOrgHeaders:  [],
                addFncHeaders:  [],
                removeHeaders:  [],
                changeHeaders:  [],
                moveHeaders:    [],
                queryHeaders:   []
            };
        }

        const addOrgHeaders = UserDesignUpdateSummaryData.getHeadersOfCategoryType(
            userContext.userId,
            userContext.designUpdateId,
            DesignUpdateSummaryCategory.SUMMARY_UPDATE_ORGANISATIONAL,
            DesignUpdateSummaryType.SUMMARY_ADD_TO
        );

        const addFncHeaders = UserDesignUpdateSummaryData.getHeadersOfCategoryType(
            userContext.userId,
            userContext.designUpdateId,
            DesignUpdateSummaryCategory.SUMMARY_UPDATE_FUNCTIONAL,
            DesignUpdateSummaryType.SUMMARY_ADD_TO
        );

        const removeHeaders = UserDesignUpdateSummaryData.getHeadersOfType(
            userContext.userId,
            userContext.designUpdateId,
            DesignUpdateSummaryType.SUMMARY_REMOVE_FROM
        );

        const changeHeaders = UserDesignUpdateSummaryData.getHeadersOfType(
            userContext.userId,
            userContext.designUpdateId,
            DesignUpdateSummaryType.SUMMARY_CHANGE_IN
        );

        const moveHeaders = [];

        const queryHeaders = UserDesignUpdateSummaryData.getHeadersOfType(
            userContext.userId,
            userContext.designUpdateId,
            DesignUpdateSummaryType.SUMMARY_QUERY_IN
        );

        return {
            addOrgHeaders:  addOrgHeaders,
            addFncHeaders:  addFncHeaders,
            removeHeaders:  removeHeaders,
            changeHeaders:  changeHeaders,
            moveHeaders:    moveHeaders,
            queryHeaders:   queryHeaders
        };
    }

    getDesignUpdateSummaryHeadersForWp(userContext){

        // Nothing if no Design Update / WP is set
        if(userContext.designUpdateId === 'NONE' || userContext.workPackageId === 'NONE'){

            return {
                addOrgHeaders:  [],
                addFncHeaders:  [],
                removeHeaders:  [],
                changeHeaders:  [],
                moveHeaders:    [],
                queryHeaders:   []
            };
        }

        // Add in any headers if their design item features in the WP

        // Organisational Additions
        const addOrgHeaders = UserDesignUpdateSummaryData.getHeadersOfCategoryType(
            userContext.userId,
            userContext.designUpdateId,
            DesignUpdateSummaryCategory.SUMMARY_UPDATE_ORGANISATIONAL,
            DesignUpdateSummaryType.SUMMARY_ADD_TO
        );

        let wpAddOrgHeaders = [];

        addOrgHeaders.forEach((updateAddHeader) => {

            const wpItem = WorkPackageComponentData.getWpComponentByComponentRef(userContext.workPackageId, updateAddHeader.itemComponentReferenceId);

            // See if there is anything to go under this header
            const children = this.getDesignUpdateSummaryHeaderActionsForWp(updateAddHeader._id, userContext.workPackageId);

            //console.log("header " + updateAddHeader.itemName + " has " + children.length + " children and wpItem is " + wpItem);

            if((wpItem !== null) && (children.length > 0)){
                //console.log(" adding header " + updateAddHeader.itemName);
                wpAddOrgHeaders.push(updateAddHeader);
            }
        });

        // Functional Additions
        const addFncHeaders = UserDesignUpdateSummaryData.getHeadersOfCategoryType(
            userContext.userId,
            userContext.designUpdateId,
            DesignUpdateSummaryCategory.SUMMARY_UPDATE_FUNCTIONAL,
            DesignUpdateSummaryType.SUMMARY_ADD_TO
        );

        let wpAddFncHeaders = [];

        addFncHeaders.forEach((updateAddHeader) => {

            const wpItem = WorkPackageComponentData.getWpComponentByComponentRef(userContext.workPackageId, updateAddHeader.itemComponentReferenceId);

            // See if there is anything to go under this header
            const children = this.getDesignUpdateSummaryHeaderActionsForWp(updateAddHeader._id, userContext.workPackageId);

            //console.log("header " + updateAddHeader.itemName + " has " + children.length + " children and wpItem is " + wpItem);

            if((wpItem !== null) && (children.length > 0)){
                //console.log(" adding header " + updateAddHeader.itemName);
                wpAddFncHeaders.push(updateAddHeader);
            }
        });

        // Removals
        const removeHeaders = UserDesignUpdateSummaryData.getHeadersOfType(
            userContext.userId,
            userContext.designUpdateId,
            DesignUpdateSummaryType.SUMMARY_REMOVE_FROM
        );

        let wpRemoveHeaders = [];

        removeHeaders.forEach((updateRemoveHeader) => {

            const wpItem = WorkPackageComponentData.getWpComponentByComponentRef(userContext.workPackageId, updateRemoveHeader.itemComponentReferenceId);

            // See if there is anything to go under this header
            const hasChildren = this.getDesignUpdateSummaryHeaderActionsForWp(updateRemoveHeader._id, userContext.workPackageId).length > 0;

            if(wpItem && hasChildren){
                wpRemoveHeaders.push(updateRemoveHeader);
            }
        });

        // Changes
        const changeHeaders = UserDesignUpdateSummaryData.getHeadersOfType(
            userContext.userId,
            userContext.designUpdateId,
            DesignUpdateSummaryType.SUMMARY_CHANGE_IN
        );

        let wpChangeHeaders = [];

        changeHeaders.forEach((updateChangeHeader) => {

            const wpItem = WorkPackageComponentData.getWpComponentByComponentRef(userContext.workPackageId, updateChangeHeader.itemComponentReferenceId);

            // See if there is anything to go under this header
            const hasChildren = this.getDesignUpdateSummaryHeaderActionsForWp(updateChangeHeader._id, userContext.workPackageId).length > 0;

            if(wpItem && hasChildren){
                wpChangeHeaders.push(updateChangeHeader);
            }
        });

        // Queries
        const queryHeaders = UserDesignUpdateSummaryData.getHeadersOfType(
            userContext.userId,
            userContext.designUpdateId,
            DesignUpdateSummaryType.SUMMARY_QUERY_IN
        );

        let wpQueryHeaders = [];

        queryHeaders.forEach((updateQueryHeader) => {

            const wpItem = WorkPackageComponentData.getWpComponentByComponentRef(userContext.workPackageId, updateQueryHeader.itemComponentReferenceId);

            // See if there is anything to go under this header
            const hasChildren = this.getDesignUpdateSummaryHeaderActionsForWp(updateQueryHeader._id, userContext.workPackageId).length > 0;

            if(wpItem && hasChildren){
                wpQueryHeaders.push(updateQueryHeader);
            }
        });


        return {
            addOrgHeaders:  wpAddOrgHeaders,
            addFncHeaders:  wpAddFncHeaders,
            removeHeaders:  wpRemoveHeaders,
            changeHeaders:  wpChangeHeaders,
            moveHeaders:    [],
            queryHeaders:   wpQueryHeaders
        };
    }

    getDesignUpdateSummaryHeaderActions(headerId){

        return UserDesignUpdateSummaryData.getHeaderActions(headerId);
    }

    getDesignUpdateSummaryHeaderActionsForWp(headerId, workPackageId){
        //console.log("Getting items for header with headerId " + headerId + " and wpId: " + workPackageId);

        const headerItems = UserDesignUpdateSummaryData.getHeaderActions(headerId);

        // Only include if active in WP scope or has active children
        let wpHeaderItems = [];

        headerItems.forEach((headerItem) => {

            //console.log("Header item " + headerItem.itemName + " with ref " + headerItem.itemComponentReferenceId);

            let wpItems = WorkPackageComponentData.getActiveWpComponentsByComponentRef(workPackageId, headerItem.itemComponentReferenceId);

            let wpChildItems = WorkPackageComponentData.getActiveChildWpComponents(workPackageId, headerItem.itemComponentReferenceId);

            let wpFeatureChildItems = WorkPackageComponentData.getActiveFeatureWpComponents(workPackageId, headerItem.itemComponentReferenceId);

            if(wpItems.length > 0 || wpChildItems.length > 0 || wpFeatureChildItems.length > 0){
                //console.log("Adding...")
                wpHeaderItems.push(headerItem);
            }
        });

        return wpHeaderItems;
    }

}

export default new ClientDesignUpdateSummary();