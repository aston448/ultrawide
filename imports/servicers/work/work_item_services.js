
// Ultrawide Services
import { WorkPackageType, LogLevel } from '../../constants/constants.js';
import { log } from '../../common/utils.js'

// Data Access
import { WorkItemData }                 from '../../data/work/work_item_db.js';
import { WorkPackageData }              from '../../data/work/work_package_db.js';
import { DesignUpdateData}              from "../../data/design_update/design_update_db";


//======================================================================================================================
//
// Server Code for WorkItems.
//
// Methods called directly by Server API
//
//======================================================================================================================
class WorkItemServicesClass {

    // Add a new Increment
    addNewIncrement(designVersionId){

        if(Meteor.isServer) {

            return WorkItemData.insertNewIncrement(designVersionId);
        }
    };

    // Add a new Iteration
    addNewIteration(designVersionId, iterationParentRef){

        if(Meteor.isServer) {

            return WorkItemData.insertNewIteration(designVersionId, iterationParentRef);
        }
    };

    removeWorkItem(iterationId){

        if(Meteor.isServer) {

            return WorkItemData.removeWorkItem(iterationId);
        }
    }

    saveWorkItemDetails(workItem, newName, newLink){

        if(Meteor.isServer) {

            return WorkItemData.updateWorkItemDetails(workItem._id, newName, newLink);
        }
    }

    reorderWorkItem(movingWorkItem, targetWorkItem){

        if(Meteor.isServer){

            let movingItemName = '';
            let oldIndex = 0;
            let indexBelow = 0;
            let peerItems = [];

            // Is this a WP?
            const wp = (movingWorkItem.workPackageType === WorkPackageType.WP_BASE || movingWorkItem.workPackageType === WorkPackageType.WP_UPDATE);

            if(wp){
                movingItemName = movingWorkItem.workPackageName;
                oldIndex = movingWorkItem.workPackageIndex;
                indexBelow = targetWorkItem.workPackageIndex;

                // Get the other items in the same list (in reverse order)
                peerItems = WorkPackageData.getOtherPeerWorkPackages(movingWorkItem);

            } else {
                movingItemName = movingWorkItem.wiName;
                oldIndex = movingWorkItem.wiIndex;
                indexBelow = targetWorkItem.wiIndex;

                // Get the other items in the same list (in reverse order)
                peerItems = WorkItemData.getOtherPeerWorkItems(movingWorkItem);
            }


            log((msg) => console.log(msg), LogLevel.TRACE, "Index below = {}", indexBelow);

            let indexAbove = 0;                                 // The default if nothing exists above
            const listMaxArrayIndex = peerItems.length - 1;
            log((msg) => console.log(msg), LogLevel.TRACE, "List max = {}", listMaxArrayIndex);

            // Go through the list of peers (ordered from bottom to top)
            let i = 0;
            while (i <= listMaxArrayIndex) {

                if(wp){

                    if (peerItems[i].workPackageIndex === indexBelow) {
                        // OK, this is the target component so the next one in the list (if there is one) is the one that will be above the new position
                        if (i < listMaxArrayIndex) {
                            indexAbove = peerItems[i + 1].workPackageIndex;
                        }
                        break;
                    }
                    i++;

                } else {

                    if (peerItems[i].wiIndex === indexBelow) {
                        // OK, this is the target component so the next one in the list (if there is one) is the one that will be above the new position
                        if (i < listMaxArrayIndex) {
                            indexAbove = peerItems[i + 1].wiIndex;
                        }
                        break;
                    }
                    i++;
                }

            }

            log((msg) => console.log(msg), LogLevel.TRACE, "Index above = {}", indexAbove);

            // The new index is half way between the above an below index - sort of Dewey Decimal system to avoid having to reindex everything every time
            const indexDiff = indexBelow - indexAbove;
            const newIndex = (indexBelow + indexAbove) / 2;

            log((msg) => console.log(msg), LogLevel.TRACE, "Setting new index for {} to {} was {}", movingItemName, newIndex, oldIndex);

            if(wp){
                WorkPackageData.setWorkPackageIndex(movingWorkItem._id, newIndex);
            } else {
                WorkItemData.updateWorkItemIndex(movingWorkItem._id, newIndex);
            }


            // Over time the indexing differences may get too small to work any more so periodically reset the indexes for this list.
            if (indexDiff < 0.001) {
                log((msg) => console.log(msg), LogLevel.TRACE, "Index reset!");

                // Get the components in current order
                let resetItems = [];

                if(wp){
                    resetItems = WorkPackageData.getPeerWorkPackages(movingWorkItem);
                } else {
                    resetItems = WorkItemData.getPeerWorkItems(movingWorkItem);
                }


                let resetIndex = 100;

                // Reset them to 100, 200, 300 etc...
                resetItems.forEach((item) => {
                    if(wp){
                        WorkPackageData.setWorkPackageIndex(item._id, resetIndex);
                    } else {
                        WorkItemData.updateWorkItemIndex(item._id, resetIndex);
                    }


                    resetIndex = resetIndex + 100;
                });
            }

        }
    }

    moveWorkItem(movingWorkItem, targetParentItem){

        if(Meteor.isServer){

            // If the target item is null then we are unassigning a WP
            if(targetParentItem) {

                // Assign a new parent ID for the item.  It cannot change level.  Place at bottom of list
                switch(movingWorkItem.workPackageType){

                    case WorkPackageType.WP_BASE:

                        // Its a real WP being moved - direct into an iteration
                        WorkPackageData.setWorkItemParent(movingWorkItem._id, targetParentItem.wiReferenceId);

                        break;

                    case WorkPackageType.WP_UPDATE:

                        // Needs to go inside a DU for an Iteration (creating that DU if needed)

                        // See if DU item exists for Iteration
                        const iterationDu = WorkItemData.getDesignVersionIterationDu(movingWorkItem.designVersionId, targetParentItem.wiReferenceId, movingWorkItem.designUpdateId);

                        if(iterationDu){

                            // Set WP as belonging to the DU Work Item
                            WorkPackageData.setWorkItemParent(movingWorkItem._id, iterationDu.wiReferenceId);

                        } else {

                            // Add a new DU work item for this iteration - doesn't matter if its in other iterations as well
                            const designUpdate = DesignUpdateData.getDesignUpdateById(movingWorkItem.designUpdateId);

                            const newDuItemId = WorkItemData.addIterationDu(movingWorkItem.designVersionId, targetParentItem.wiReferenceId, designUpdate);

                            const duWorkItem = WorkItemData.getWorkItemById(newDuItemId);

                            // Set WP as belonging to the DU Work Item
                            WorkPackageData.setWorkItemParent(movingWorkItem._id, duWorkItem.wiReferenceId);
                        }

                        break;

                    default:

                        // Other Work Item
                        WorkItemData.updateWorkItemPosition(movingWorkItem._id, targetParentItem.wiReferenceId, movingWorkItem.wiLevel, 20000)
                }

            } else {

                let parentDuItem = null;

                // Get parent before move for Update WPs
                if(movingWorkItem.workPackageType === WorkPackageType.WP_UPDATE){

                    console.log('Getting parent item for %o', movingWorkItem);

                    parentDuItem = WorkItemData.getWorkPackageParentDu(movingWorkItem);

                    console.log('Got %o', parentDuItem);
                }

                // Unassign
                WorkPackageData.setWorkItemParent(movingWorkItem._id, 'NONE');

                // And see if the DU is still needed
                if(parentDuItem && movingWorkItem.workPackageType === WorkPackageType.WP_UPDATE){
                    this.checkUpdateWorkItemValidity(parentDuItem);
                }




            }
        }
    }

    checkUpdateWorkItemValidity(updateWorkItem){

        // A WP has been deleted or moved.  It belonged to the Update WI that is referenced.
        // If no more WPs are contained by this Update WI then it should be removed.

        // Note that an Update WI is a cosmetic placeholder - NOT the actual Design Update itself.

        const updateWpCount = WorkItemData.getWorkItemChildCount(updateWorkItem);

        console.log('Checking WI Validity for %o and found count %i', updateWorkItem, updateWpCount);

        if(updateWpCount === 0){

            // Remove the update WI
            WorkItemData.removeWorkItem(updateWorkItem._id)

        }

    }
}

export const WorkItemServices = new WorkItemServicesClass();
