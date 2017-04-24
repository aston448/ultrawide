// == IMPORTS ==========================================================================================================

// Meteor / React Services
import { Meteor } from 'meteor/meteor';

// Ultrawide Collections
import { DesignUpdates }            from '../collections/design_update/design_updates.js';
import { UserDesignUpdateSummary }      from '../collections/summary/user_design_update_summary.js';
import { WorkPackageComponents }    from '../collections/work/work_package_components.js';

// Ultrawide GUI Components

// Ultrawide Services
import { DesignUpdateSummaryCategory, WorkPackageScopeType, DesignUpdateSummaryType} from '../constants/constants.js';

import DesignUpdateSummaryServices from '../apiServer/apiDesignUpdateSummary.js';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Client Design Update Summary - Gets the data required to summarise a Design Update
//
// ---------------------------------------------------------------------------------------------------------------------

class ClientDesignUpdateSummary{


    getDesignUpdateSummary(userContext){

        //DesignUpdates.update({_id: designUpdateId}, {$set: {summaryDataStale: true}});

        DesignUpdateSummaryServices.refreshDesignUpdateSummary(userContext, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 1: ' + err.reason + '.  Contact support if persists!');

            }
        });
    };

    getDesignUpdateSummaryHeaders(userContext){

        // Nothing if no Design Update is set
        if(designUpdateId === 'NONE'){

            return {
                addOrgHeaders:  [],
                addFncHeaders:  [],
                removeHeaders:  [],
                changeHeaders:  [],
                moveHeaders:    [],
                queryHeaders:   []
            };
        }

        const addOrgHeaders = UserDesignUpdateSummary.find({
            userId:             userContext.userId,
            designUpdateId:     userContext.designUpdateId,
            summaryCategory:    DesignUpdateSummaryCategory.SUMMARY_UPDATE_ORGANISATIONAL,
            summaryType:        DesignUpdateSummaryType.SUMMARY_ADD_TO
        }, {sort: {itemType: 1, itemHeaderName: 1, itemIndex: 1}}).fetch();

        const addFncHeaders = UserDesignUpdateSummary.find({
            userId:             userContext.userId,
            designUpdateId:     userContext.designUpdateId,
            summaryCategory:    DesignUpdateSummaryCategory.SUMMARY_UPDATE_FUNCTIONAL,
            summaryType:        DesignUpdateSummaryType.SUMMARY_ADD_TO
        }, {sort: {itemType: 1, itemHeaderName: 1, itemIndex: 1}}).fetch();

        const removeHeaders = UserDesignUpdateSummary.find({
            userId:             userContext.userId,
            designUpdateId:     userContext.designUpdateId,
            summaryType:        DesignUpdateSummaryType.SUMMARY_REMOVE_FROM
        }, {sort: {itemType: 1, itemHeaderName: 1, itemIndex: 1}}).fetch();

        const changeHeaders = UserDesignUpdateSummary.find({
            userId:             userContext.userId,
            designUpdateId:     userContext.designUpdateId,
            summaryType:        DesignUpdateSummaryType.SUMMARY_CHANGE_IN
        }, {sort: {itemType: 1, itemHeaderName: 1, itemIndex: 1}}).fetch();

        const moveHeaders = [];

        const queryHeaders = UserDesignUpdateSummary.find({
            userId:             userContext.userId,
            designUpdateId:     userContext.designUpdateId,
            summaryType:        DesignUpdateSummaryType.SUMMARY_QUERY_IN
        }, {sort: {itemType: 1, itemHeaderName: 1, itemIndex: 1}}).fetch();

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
        const addOrgHeaders = UserDesignUpdateSummary.find({
            userId:             userContext.userId,
            designUpdateId:     userContext.designUpdateId,
            summaryCategory:    DesignUpdateSummaryCategory.SUMMARY_UPDATE_ORGANISATIONAL,
            summaryType:        DesignUpdateSummaryType.SUMMARY_ADD_TO
        }, {sort: {itemType: 1, itemHeaderName: 1, itemIndex: 1}}).fetch();

        let wpAddOrgHeaders = [];

        addOrgHeaders.forEach((updateAddHeader) => {

            const wpItem = WorkPackageComponents.findOne({
                workPackageId: userContext.workPackageId,
                componentReferenceId: updateAddHeader.itemComponentReferenceId
            });

            // See if there is anything to go under this header
            const children = this.getDesignUpdateSummaryHeaderActionsForWp(updateAddHeader._id, userContext.workPackageId);

            //console.log("header " + updateAddHeader.itemName + " has " + children.length + " children and wpItem is " + wpItem);

            if((wpItem !== null) && (children.length > 0)){
                //console.log(" adding header " + updateAddHeader.itemName);
                wpAddOrgHeaders.push(updateAddHeader);
            }
        });

        // Functional Additions
        const addFncHeaders = UserDesignUpdateSummary.find({
            userId:             userContext.userId,
            designUpdateId:     userContext.designUpdateId,
            summaryCategory:    DesignUpdateSummaryCategory.SUMMARY_UPDATE_FUNCTIONAL,
            summaryType:        DesignUpdateSummaryType.SUMMARY_ADD_TO
        }, {sort: {itemType: 1, itemHeaderName: 1, itemIndex: 1}}).fetch();

        let wpAddFncHeaders = [];

        addFncHeaders.forEach((updateAddHeader) => {

            const wpItem = WorkPackageComponents.findOne({
                workPackageId: userContext.workPackageId,
                componentReferenceId: updateAddHeader.itemComponentReferenceId
            });

            // See if there is anything to go under this header
            const children = this.getDesignUpdateSummaryHeaderActionsForWp(updateAddHeader._id, userContext.workPackageId);

            //console.log("header " + updateAddHeader.itemName + " has " + children.length + " children and wpItem is " + wpItem);

            if((wpItem !== null) && (children.length > 0)){
                //console.log(" adding header " + updateAddHeader.itemName);
                wpAddFncHeaders.push(updateAddHeader);
            }
        });

        // Removals
        const removeHeaders = UserDesignUpdateSummary.find({
            userId:             userContext.userId,
            designUpdateId:     userContext.designUpdateId,
            summaryType:        DesignUpdateSummaryType.SUMMARY_REMOVE_FROM
        }, {sort: {itemType: 1, itemHeaderName: 1, itemIndex: 1}}).fetch();

        let wpRemoveHeaders = [];

        removeHeaders.forEach((updateRemoveHeader) => {

            const wpItem = WorkPackageComponents.findOne({
                workPackageId: userContext.workPackageId,
                componentReferenceId: updateRemoveHeader.itemComponentReferenceId
            });

            // See if there is anything to go under this header
            const hasChildren = this.getDesignUpdateSummaryHeaderActionsForWp(updateRemoveHeader._id, userContext.workPackageId).length > 0;

            if(wpItem && hasChildren){
                wpRemoveHeaders.push(updateRemoveHeader);
            }
        });

        // Changes
        const changeHeaders = UserDesignUpdateSummary.find({
            userId:             userContext.userId,
            designUpdateId:     userContext.designUpdateId,
            summaryType:        DesignUpdateSummaryType.SUMMARY_CHANGE_IN
        }, {sort: {itemType: 1, itemHeaderName: 1, itemIndex: 1}}).fetch();

        let wpChangeHeaders = [];

        changeHeaders.forEach((updateChangeHeader) => {

            const wpItem = WorkPackageComponents.findOne({
                workPackageId: userContext.workPackageId,
                componentReferenceId: updateChangeHeader.itemComponentReferenceId
            });

            // See if there is anything to go under this header
            const hasChildren = this.getDesignUpdateSummaryHeaderActionsForWp(updateChangeHeader._id, userContext.workPackageId).length > 0;

            if(wpItem && hasChildren){
                wpChangeHeaders.push(updateChangeHeader);
            }
        });

        // Queries
        const queryHeaders = UserDesignUpdateSummary.find({
            userId:             userContext.userId,
            designUpdateId:     userContext.designUpdateId,
            summaryType:        DesignUpdateSummaryType.SUMMARY_QUERY_IN
        }, {sort: {itemType: 1, itemHeaderName: 1, itemIndex: 1}}).fetch();

        let wpQueryHeaders = [];

        queryHeaders.forEach((updateQueryHeader) => {

            const wpItem = WorkPackageComponents.findOne({
                workPackageId: userContext.workPackageId,
                componentReferenceId: updateQueryHeader.itemComponentReferenceId
            });

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

        return UserDesignUpdateSummary.find({
            itemHeaderId:       headerId
        }, {sort: {itemIndex: 1}}).fetch();
    }

    getDesignUpdateSummaryHeaderActionsForWp(headerId, workPackageId){
        //console.log("Getting items for header with headerId " + headerId + " and wpId: " + workPackageId);

        const headerItems = UserDesignUpdateSummary.find({
            itemHeaderId: headerId
        }, {sort: {itemIndex: 1}}).fetch();

        // Only include if active in WP scope or has active children
        let wpHeaderItems = [];

        headerItems.forEach((headerItem) => {

            //console.log("Header item " + headerItem.itemName + " with ref " + headerItem.itemComponentReferenceId);

            let wpItem = WorkPackageComponents.find({
                workPackageId: workPackageId,
                componentReferenceId: headerItem.itemComponentReferenceId,
                scopeType: WorkPackageScopeType.SCOPE_ACTIVE
            }).fetch();

            let wpChildItem = WorkPackageComponents.find({
                workPackageId: workPackageId,
                componentParentReferenceId: headerItem.itemComponentReferenceId,
                scopeType: WorkPackageScopeType.SCOPE_ACTIVE
            }).fetch();

            let wpFeatureChildItem = WorkPackageComponents.find({
                workPackageId: workPackageId,
                componentFeatureReferenceId: headerItem.itemComponentReferenceId,
                scopeType: WorkPackageScopeType.SCOPE_ACTIVE
            }).fetch();



            if(wpItem.length > 0 || wpChildItem.length > 0 || wpFeatureChildItem.length > 0){
                //console.log("Adding...")
                wpHeaderItems.push(headerItem);
            }
        });

        return wpHeaderItems;
    }

}

export default new ClientDesignUpdateSummary();