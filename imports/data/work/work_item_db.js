import {WorkItems} from "../../collections/work/work_items";
import {WorkPackages} from '../../collections/work/work_packages.js';

import {WorkItemStatus, WorkItemType, WorkPackageType} from "../../constants/constants";
import {DefaultItemNames} from "../../constants/default_names";

class WorkItemDataClass{

    // INSERT ==========================================================================================================

    insertNewIncrement(designVersionId){

        const newIncrementId = WorkItems.insert(
            {
                designVersionId:            designVersionId,
                wiReferenceId:              'NONE',
                wiParentReferenceId:        'NONE',
                wiType:                     WorkItemType.INCREMENT,
                wiName:                     DefaultItemNames.NEW_INCREMENT_NAME,
                wiStatus:                   WorkItemStatus.WI_NEW,
                wiLevel:                    1,
                wiIndex:                    10000,
                wiLink:                     'NONE'
            }
        );

        // Set the unchanging reference to the original ID
        WorkItems.update(
            {_id: newIncrementId},
            {
                $set:{wiReferenceId: newIncrementId}
            }
        );

        return newIncrementId;
    }

    insertNewIteration(designVersionId, iterationParentRef){

        const newIterationId = WorkItems.insert(
            {
                designVersionId:            designVersionId,
                wiReferenceId:              'NONE',
                wiParentReferenceId:        iterationParentRef,
                wiType:                     WorkItemType.ITERATION,
                wiName:                     DefaultItemNames.NEW_ITERATION_NAME,
                wiStatus:                   WorkItemStatus.WI_NEW,
                wiLevel:                    1,
                wiIndex:                    10000,
                wiLink:                     'NONE'
            }
        );

        // Set the unchanging reference to the original ID
        WorkItems.update(
            {_id: newIterationId},
            {
                $set:{wiReferenceId: newIterationId}
            }
        );

        return newIterationId;
    }

    addIterationWp(designVersionId, iterationRefId, workPackage){

        const newWorkItemId = WorkItems.insert(
            {
                designVersionId:            designVersionId,
                wiReferenceId:              'NONE',
                wiParentReferenceId:        iterationRefId,
                wiDuId:                     'NONE',
                wiWpId:                     workPackage._id,
                wiType:                     WorkItemType.BASE_WORK_PACKAGE,
                wiName:                     workPackage.workPackageName,
                wiStatus:                   WorkItemStatus.WI_IN_PROGRESS,
                wiLevel:                    2,
                wiIndex:                    10000,
                wiLink:                     'NONE'
            }
        );

        // Set the unchanging reference to the original ID
        WorkItems.update(
            {_id: newWorkItemId},
            {
                $set:{wiReferenceId: newWorkItemId}
            }
        );

        return newWorkItemId;
    }

    addIterationDu(designVersionId, iterationRefId, designUpdate){

        const newWorkItemId = WorkItems.insert(
            {
                designVersionId:            designVersionId,
                wiReferenceId:              'NONE',
                wiParentReferenceId:        iterationRefId,
                wiDuId:                     designUpdate._id,
                wiWpId:                     'NONE',
                wiType:                     WorkItemType.DESIGN_UPDATE,
                wiName:                     designUpdate.updateName,
                wiStatus:                   WorkItemStatus.WI_IN_PROGRESS,
                wiLevel:                    2,
                wiIndex:                    10000,
                wiLink:                     'NONE'
            }
        );

        // Set the unchanging reference to the original ID
        WorkItems.update(
            {_id: newWorkItemId},
            {
                $set:{wiReferenceId: newWorkItemId}
            }
        );

        return newWorkItemId;
    }

    addIterationDuWp(designVersionId, duWiRefId, designUpdate, workPackage){

        const newWorkItemId = WorkItems.insert(
            {
                designVersionId:            designVersionId,
                wiReferenceId:              'NONE',
                wiParentReferenceId:        duWiRefId,
                wiDuId:                     designUpdate._id,
                wiWpId:                     workPackage._id,
                wiType:                     WorkItemType.UPDATE_WORK_PACKAGE,
                wiName:                     workPackage.workPackageName,
                wiStatus:                   WorkItemStatus.WI_IN_PROGRESS,
                wiLevel:                    3,
                wiIndex:                    10000,
                wiLink:                     'NONE'
            }
        );

        // Set the unchanging reference to the original ID
        WorkItems.update(
            {_id: newWorkItemId},
            {
                $set:{wiReferenceId: newWorkItemId}
            }
        );

        return newWorkItemId;
    }


    importWorkItem(designVersionId, designUpdateId, workPackageId, wiData){

        return WorkItems.insert(
            {
                designVersionId:            designVersionId,
                wiReferenceId:              wiData.wiReferenceId,
                wiParentReferenceId:        wiData.wiParentReferenceId,
                wiDuId:                     designUpdateId,
                wiWpId:                     workPackageId,
                wiType:                     wiData.wiType,
                wiName:                     wiData.wiName,
                wiStatus:                   wiData.wiStatus,
                wiLevel:                    wiData.wiLevel,
                wiIndex:                    wiData.wiIndex,
                wiLink:                     wiData.wiLink
            }
        );
    }


    bulkInsert(batchData){
        WorkItems.batchInsert(batchData);
    }

    // SELECT ==========================================================================================================

    getWorkItemById(workItemId){

        return WorkItems.findOne(
            {_id: workItemId}
        );
    }

    getDesignVersionWorkItems(designVersionId){

        return WorkItems.find(
            {
                designVersionId:    designVersionId
            }
        ).fetch();
    }

    getDesignVersionIncrements(designVersionId){

        return WorkItems.find(
            {
                designVersionId:    designVersionId,
                wiType:             WorkItemType.INCREMENT
            }
        ).fetch();
    }

    getDesignVersionIncrementsByIndex(designVersionId){

        return WorkItems.find(
            {
                designVersionId:    designVersionId,
                wiType:             WorkItemType.INCREMENT
            },
            {sort: {wiIndex: 1}}
        ).fetch();
    }

    getDesignVersionIncrementIterations(designVersionId, incrementRefId){

        return WorkItems.find(
            {
                designVersionId:        designVersionId,
                wiParentReferenceId:    incrementRefId,
                wiType:                 WorkItemType.ITERATION
            }
        ).fetch();
    }

    getDesignVersionIncrementIterationsByIndex(designVersionId, incrementRefId){

        return WorkItems.find(
            {
                designVersionId:        designVersionId,
                wiParentReferenceId:    incrementRefId,
                wiType:                 WorkItemType.ITERATION
            },
            {sort: {wiIndex: 1}}
        ).fetch();
    }

    getDesignVersionIterationWpsByIndex(designVersionId, iterationRefId){

        return WorkPackages.find(
            {
                designVersionId:        designVersionId,
                parentWorkItemRefId:    iterationRefId,
                workPackageType:        WorkPackageType.WP_BASE
            },
            {sort: {workPackageIndex: 1}}
        ).fetch();
    }

    getDesignVersionIterationDu(designVersionId, iterationRefId, designUpdateId){

        return WorkItems.findOne(
            {
                designVersionId:        designVersionId,
                wiParentReferenceId:    iterationRefId,
                wiType:                 WorkItemType.DESIGN_UPDATE,
                wiDuId:                 designUpdateId
            }
        );
    }

    getDesignVersionIterationDusByIndex(designVersionId, iterationRefId){

        return WorkItems.find(
            {
                designVersionId:        designVersionId,
                wiParentReferenceId:    iterationRefId,
                wiType:                 WorkItemType.DESIGN_UPDATE
            },
            {sort: {wiIndex: 1}}
        ).fetch();
    }

    getDesignVersionDuWpsByIndex(designVersionId, duRefId){

        return WorkPackages.find(
            {
                designVersionId:        designVersionId,
                parentWorkItemRefId:    duRefId,
                workPackageType:        WorkPackageType.WP_UPDATE
            },
            {sort: {workPackageIndex: 1}}
        ).fetch();
    }

    getOtherWorkItemsOfType(designVersionId, workItemId, workItemType){

        return WorkItems.find(
            {
                _id:                    {$ne: workItemId},
                designVersionId:        designVersionId,
                wiType:                 workItemType
            }
        ).fetch();
    }

    getPeerWorkItems(workItem){

        return WorkItems.find(
            {
                wiParentReferenceId:    workItem.wiParentReferenceId,
                wiType:                 workItem.wiType
            },
            {sort: {wiIndex: 1}}
        ).fetch();
    }

    getOtherPeerWorkItems(workItem){

        return WorkItems.find(
            {
                _id:                    {$ne: workItem._id},
                wiParentReferenceId:    workItem.wiParentReferenceId,
                wiType:                 workItem.wiType
            },
            {sort: {wiIndex: -1}}
        ).fetch();
    }

    getWorkItemParent(workItem){

        return WorkItems.findOne(
            {
                designVersionId:    workItem.designVersionId,
                wiReferenceId:      workItem.wiParentReferenceId
            }
        );
    }

    getWorkPackageParentDu(wp){

        return WorkItems.findOne(
            {
                designVersionId:    wp.designVersionId,
                wiReferenceId:      wp.parentWorkItemRefId,
                wiType:             WorkItemType.DESIGN_UPDATE
            }
        );
    }

    getWorkItemChildCount(workItem){

        // For Increments we want the Iterations
        if(workItem.wiType === WorkItemType.INCREMENT){
            return WorkItems.find(
                {
                    designVersionId:        workItem.designVersionId,
                    wiParentReferenceId:    workItem.wiReferenceId,
                    wiType:                 WorkItemType.ITERATION
                }
            ).fetch().length
        }

        // For Iterations we want Base WPs
        if(workItem.wiType === WorkItemType.ITERATION){
            return WorkPackages.find(
                {
                    designVersionId:        workItem.designVersionId,
                    parentWorkItemRefId:    workItem.wiReferenceId,
                    wiType:                 WorkItemType.BASE_WORK_PACKAGE
                }
            ).fetch().length
        }

        // For Updates we want Update WPs
        if(workItem.wiType === WorkItemType.DESIGN_UPDATE){
            return WorkPackages.find(
                {
                    designVersionId:        workItem.designVersionId,
                    parentWorkItemRefId:    workItem.wiReferenceId,
                    workPackageType:        WorkPackageType.WP_UPDATE
                }
            ).fetch().length
        }

    }
    // UPDATE ==========================================================================================================

    updateWorkItemDetails(wiId, wiName, wiLink){

        return WorkItems.update(
            {_id: wiId},
            {
                $set:{
                    wiName: wiName,
                    wiLink: wiLink
                }
            }
        );
    }

    updateWorkItemStatus(wiId, wiStatus){

        return WorkItems.update(
            {_id: wiId},
            {
                $set:{wiStatus: wiStatus}
            }
        );
    }

    updateWorkItemPosition(wiId, wiParentRef, wiLevel, wiIndex){

        return WorkItems.update(
            {_id: wiId},
            {
                $set:{
                    wiParentReferenceId: wiParentRef,
                    wiLevel: wiLevel,
                    wiIndex: wiIndex
                }
            }
        );
    }

    updateWorkItemIndex(wiId, newIndex){

        return WorkItems.update(
            {_id: wiId},
            {
                $set:{
                    wiIndex: newIndex
                }
            }
        );
    }

    updateWiLink(wiId, wiLink){

        return WorkItems.update(
            {_id: wiId},
            {
                $set:{wiLink: wiLink}
            }
        );
    }

    // DELETE ==========================================================================================================

    removeWorkItem(wiId){

        return WorkItems.remove({_id: wiId});
    }

}

export const WorkItemData = new WorkItemDataClass();