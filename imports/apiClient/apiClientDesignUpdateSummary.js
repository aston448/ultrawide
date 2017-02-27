// == IMPORTS ==========================================================================================================

// Meteor / React Services
import { Meteor } from 'meteor/meteor';

// Ultrawide Collections
import { UserRoles }                from '../collections/users/user_roles.js';
import { UserCurrentEditContext }   from '../collections/context/user_current_edit_context.js';
import { Designs }                  from '../collections/design/designs.js';
import { DesignVersions }           from '../collections/design/design_versions.js';
import { DesignUpdates }            from '../collections/design_update/design_updates.js';
import { DesignUpdateSummaries }    from '../collections/design_update/design_update_summaries.js';
import { DesignComponents }         from '../collections/design/design_components.js';
import { DesignUpdateComponents }   from '../collections/design_update/design_update_components.js';

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

        // Refresh data if required
        DesignUpdateSummaryServices.refreshDesignUpdateSummary(designUpdateId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');

            }
        });
    };

    getDesignUpdateSummaryData(designUpdateId){

        // Nothing if no Design Update is set
        if(designUpdateId === 'NONE'){
            return {
                functionalAdditions: [],
                functionalRemovals: [],
                functionalChanges: [],
                designUpdateName: 'NONE'
            };
        }

        const designUpdate = DesignUpdates.findOne({_id: designUpdateId});
        let designUpdateName = 'NONE';

        if(designUpdate){
            designUpdateName = designUpdate.updateName;
        }

        let functionalAdditions = DesignUpdateSummaries.find({
            designUpdateId: designUpdateId,
            summaryType:    {$in:[DesignUpdateSummaryType.SUMMARY_ADD, DesignUpdateSummaryType.SUMMARY_ADD_TO]}
        }).fetch();

        let functionalRemovals = DesignUpdateSummaries.find({
            designUpdateId: designUpdateId,
            summaryType:    {$in:[DesignUpdateSummaryType.SUMMARY_REMOVE, DesignUpdateSummaryType.SUMMARY_REMOVE_FROM]}
        }).fetch();

        let functionalChanges = DesignUpdateSummaries.find({
            designUpdateId: designUpdateId,
            summaryType:    {$in:[DesignUpdateSummaryType.SUMMARY_CHANGE, DesignUpdateSummaryType.SUMMARY_CHANGE_IN]}
        }).fetch();

        return {
            functionalAdditions: functionalAdditions,
            functionalRemovals: functionalRemovals,
            functionalChanges: functionalChanges,
            designUpdateName: designUpdateName
        };
    }

}

export default new ClientDesignUpdateSummary();