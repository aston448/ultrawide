// == IMPORTS ==========================================================================================================

// Meteor / React Services
import { Meteor } from 'meteor/meteor';

// Ultrawide Collections
import { DesignUpdates }            from '../collections/design_update/design_updates.js';
import { DesignUpdateSummary }      from '../collections/design_update/design_update_summary.js';

// Ultrawide GUI Components

// Ultrawide Services
import { ComponentType, DesignUpdateSummaryItem, DesignUpdateSummaryType} from '../constants/constants.js';

import DesignUpdateSummaryServices from '../apiServer/apiDesignUpdateSummary.js';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Client Design Update Summary - Gets the data required to summarise a Design Update
//
// ---------------------------------------------------------------------------------------------------------------------

class ClientDesignUpdateSummary{


    getDesignUpdateSummary(designUpdateId){

        //DesignUpdates.update({_id: designUpdateId}, {$set: {summaryDataStale: true}});

        DesignUpdateSummaryServices.refreshDesignUpdateSummary(designUpdateId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 1: ' + err.reason + '.  Contact support if persists!');

            }
        });
    };

    getDesignUpdateSummaryHeaders(designUpdateId){

        // Nothing if no Design Update is set
        if(designUpdateId === 'NONE'){

            return {
                addHeaders:     [],
                removeHeaders:  [],
                changeHeaders:  [],
                moveHeaders:    [],
                queryHeaders:   []
            };
        }

        const addHeaders = DesignUpdateSummary.find({
            designUpdateId: designUpdateId,
            summaryType:    DesignUpdateSummaryType.SUMMARY_ADD_TO
        }, {sort: {itemType: 1, itemHeaderName: 1, itemIndex: 1}}).fetch();

        const removeHeaders = DesignUpdateSummary.find({
            designUpdateId: designUpdateId,
            summaryType:    DesignUpdateSummaryType.SUMMARY_REMOVE_FROM
        }, {sort: {itemType: 1, itemHeaderName: 1, itemIndex: 1}}).fetch();

        const changeHeaders = DesignUpdateSummary.find({
            designUpdateId: designUpdateId,
            summaryType:    DesignUpdateSummaryType.SUMMARY_CHANGE_IN
        }, {sort: {itemType: 1, itemHeaderName: 1, itemIndex: 1}}).fetch();

        const moveHeaders = DesignUpdateSummary.find({
            designUpdateId: designUpdateId,
            summaryType:    DesignUpdateSummaryType.SUMMARY_MOVE_FROM
        }, {sort: {itemType: 1, itemHeaderName: 1, itemIndex: 1}}).fetch();

        const queryHeaders = DesignUpdateSummary.find({
            designUpdateId: designUpdateId,
            summaryType:    DesignUpdateSummaryType.SUMMARY_QUERY_IN
        }, {sort: {itemType: 1, itemHeaderName: 1, itemIndex: 1}}).fetch();

        return {
            addHeaders:     addHeaders,
            removeHeaders:  removeHeaders,
            changeHeaders:  changeHeaders,
            moveHeaders:    moveHeaders,
            queryHeaders:   queryHeaders
        };
    }

    getDesignUpdateSummaryHeaderActions(headerId){

        return DesignUpdateSummary.find({
            itemHeaderId: headerId
        }, {sort: {itemIndex: 1}}).fetch();
    }

}

export default new ClientDesignUpdateSummary();