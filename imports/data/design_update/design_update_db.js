
import {DesignUpdates}                  from '../../collections/design_update/design_updates.js';
import {DesignUpdateComponents}         from '../../collections/design_update/design_update_components.js';
import {WorkPackages}                   from '../../collections/work/work_packages.js';

import { DesignUpdateStatus, DesignUpdateMergeAction, ComponentType, UpdateScopeType, WorkPackageStatus, WorkPackageType }  from '../../constants/constants.js';
import { DefaultItemNames} from "../../constants/default_names";

class DesignUpdateDataClass{

    // INSERT ==========================================================================================================

    addNewDesignUpdate(designVersionId){

        return DesignUpdates.insert(
            {
                designVersionId:    designVersionId,                                // The design version this is a change to
                updateName:         DefaultItemNames.NEW_DESIGN_UPDATE_NAME,        // Identifier of this update
                updateReference:    DefaultItemNames.NEW_DESIGN_UPDATE_REF,     // Update version number if required
                updateStatus:       DesignUpdateStatus.UPDATE_NEW
            }
        );
    }

    importDesignUpdate(designVersionId, designUpdate){

        if(Meteor.isServer) {

            let designUpdateId = DesignUpdates.insert(
                {
                    designVersionId:    designVersionId,
                    updateName:         designUpdate.updateName,
                    updateReference:    designUpdate.updateReference,
                    updateRawText:      designUpdate.updateRawText,
                    updateStatus:       designUpdate.updateStatus,
                    updateMergeAction:  designUpdate.updateMergeAction,
                    summaryDataStale:   true,                               // Ensure that all summaries get recreated after an import as various IDs will be broken
                    updateWpStatus:     designUpdate.updateWpStatus,
                    updateTestStatus:   designUpdate.updateTestStatus
                }
            );

            return designUpdateId;
        }
    }

    // SELECT ==========================================================================================================

    // DU --------------------------------------------------------------------------------------------------------------

    getDesignUpdateById(designUpdateId){

        return DesignUpdates.findOne({_id: designUpdateId});
    }

    getPublishedUpdatesForMergeAction(designVersionId, updateMergeAction){

        return DesignUpdates.find({
            designVersionId:    designVersionId,
            updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
            updateMergeAction:  updateMergeAction
        }).fetch();
    }
    // DU Components ---------------------------------------------------------------------------------------------------

    getAllComponents(designUpdateId){

        return DesignUpdateComponents.find({designUpdateId: designUpdateId}).fetch();
    }

    getComponentInOtherUpdates(component){

        return DesignUpdateComponents.find({
            componentReferenceId:   component.componentReferenceId,
            designVersionId:        component.designVersionId,
            designUpdateId:         {$ne: component.designUpdateId},
        }).fetch();
    }

    getAllComponentsIdAndScope(designUpdateId){

        return DesignUpdateComponents.find(
            {
                designUpdateId: designUpdateId,
            },
            {fields: {_id: 1, scopeType: 1}}
        ).fetch();
    }

    getInScopeComponents(designUpdateId){

        return DesignUpdateComponents.find({
            designUpdateId: designUpdateId,
            scopeType: UpdateScopeType.SCOPE_IN_SCOPE
        });
    }

    getInScopeScenarios(designUpdateId){

        return DesignUpdateComponents.find({
            designUpdateId: designUpdateId,
            componentType: ComponentType.SCENARIO,
            isRemoved: false,
            scopeType: UpdateScopeType.SCOPE_IN_SCOPE
        }).fetch();
    }

    getNonPeerScopeScenarios(designUpdateId){

        return DesignUpdateComponents.find({
            designUpdateId: designUpdateId,
            componentType: ComponentType.SCENARIO,
            scopeType: {$ne: UpdateScopeType.SCOPE_PEER_SCOPE}
        }).fetch();
    }


    getUnchangedInScopeScenarios(designUpdateId){

        return DesignUpdateComponents.find({
            designUpdateId: designUpdateId,
            componentType:  ComponentType.SCENARIO,
            isNew:          false,
            isRemoved:      false,
            isRemovedElsewhere: false,
            isMoved:        false,
            isChanged:      false,
            isNarrativeChanged: false,
            isTextChanged:  false,
            scopeType:      UpdateScopeType.SCOPE_IN_SCOPE
        }).fetch();
    }

    getChangedComponents(designUpdateId){

        return DesignUpdateComponents.find({
            designUpdateId: designUpdateId,
            isNew:          false,
            $or:[{isChanged: true}, {isTextChanged: true}, {isNarrativeChanged: true}]
        }).fetch();
    }

    getMovedComponents(designUpdateId){

        return DesignUpdateComponents.find({
            designUpdateId: designUpdateId,
            isMoved: true
        }).fetch();
    }

    getRemovedComponents(designUpdateId){

        return DesignUpdateComponents.find({
            designUpdateId: designUpdateId,
            isRemoved: true
        }).fetch();
    }

    getNewComponents(designUpdateId){

        return DesignUpdateComponents.find({
            designUpdateId: designUpdateId,
            isNew: true
        }).fetch();
    }

    getUpdateComponentsOfType(designUpdateId, componentType){

        return DesignUpdateComponents.find(
            {
                designUpdateId: designUpdateId,
                componentType: componentType
            },
            {sort: {componentIndexNew: 1}}
        ).fetch();
    }

    getScopedApplicationAndSectionIds(designVersionId, designUpdateId){

        return DesignUpdateComponents.find(
            {
                designVersionId: designVersionId,
                designUpdateId: designUpdateId,
                componentType: {$in: [ComponentType.APPLICATION, ComponentType.DESIGN_SECTION]},
                scopeType: {$in: [UpdateScopeType.SCOPE_IN_SCOPE, UpdateScopeType.SCOPE_PARENT_SCOPE]}
            },
            {fields: {_id: 1}}
        );
    }

    getScopedApplicationAndSectionIdsAndRefs(designVersionId, designUpdateId){

        return DesignUpdateComponents.find(
            {
                designVersionId: designVersionId,
                designUpdateId: designUpdateId,
                componentType: {$in: [ComponentType.APPLICATION, ComponentType.DESIGN_SECTION]},
                scopeType: {$in: [UpdateScopeType.SCOPE_IN_SCOPE, UpdateScopeType.SCOPE_PARENT_SCOPE]}
            },
            {fields: {_id: 1, componentReferenceId: 1}}
        ).fetch();
    }

    getScenariosNotInWorkPackages(designUpdateId){

        return DesignUpdateComponents.find(
            {
                designUpdateId: designUpdateId,
                componentType:  ComponentType.SCENARIO,
                scopeType:      UpdateScopeType.SCOPE_IN_SCOPE,
                workPackageId:  'NONE'
            }
        ).fetch();
    }
    // DU Work Packages ------------------------------------------------------------------------------------------------
    getAllWorkPackages(designUpdateId){

        return WorkPackages.find(
            {
                designUpdateId: designUpdateId
            },
            {
                $sort: {workPackageName: 1}
            }
        ).fetch();
    }

    getPublishedWorkPackages(designUpdateId){

        return WorkPackages.find(
            {
                designUpdateId: designUpdateId,
                workPackageStatus: {$ne: WorkPackageStatus.WP_NEW}
            },
            {
                $sort: {workPackageName: 1}
            }
        ).fetch();
    }

    getUpdateWorkPackagesAtStatus(designVersionId, designUpdateId, status){

        return WorkPackages.find(
            {
                designVersionId: designVersionId,
                designUpdateId: designUpdateId,
                workPackageType: WorkPackageType.WP_UPDATE,
                workPackageStatus: status
            },
            {sort: {workPackageName: 1}}
        ).fetch();
    }

    getWorkPackageCount(designUpdateId){

        return WorkPackages.find({
            designUpdateId: designUpdateId
        }).count();
    }

    // UPDATE ==========================================================================================================

    setUpdateName(designUpdateId, newName){

        return DesignUpdates.update(
            {_id: designUpdateId},
            {
                $set: {
                    updateName: newName
                }
            }
        );
    }

    setUpdateReference(designUpdateId, newRef){

        return DesignUpdates.update(
            {_id: designUpdateId},
            {
                $set: {
                    updateReference: newRef
                }
            }
        );
    }

    setUpdateMergeAction(designUpdateId, newAction){

        return DesignUpdates.update(
            {_id: designUpdateId},
            {
                $set:{
                    updateMergeAction: newAction
                }
            }
        );
    }

    updateDuStatus(designUpdateId, status, mergeAction){

        return DesignUpdates.update(
            {_id: designUpdateId},
            {
                $set: {
                    updateStatus:       status,
                    updateMergeAction:  mergeAction
                }
            }
        );
    }

    updateProgressStatus(designUpdateId, duWpStatus, duTestStatus){

        return DesignUpdates.update(
            {
                _id: designUpdateId
            },
            {
                $set: {
                    updateWpStatus: duWpStatus,
                    updateTestStatus: duTestStatus
                }
            }
        );
    }

    updateWpTestStatus(designUpdateId, wpTestStatus){

        return DesignUpdates.update(
            {
                _id: designUpdateId
            },
            {
                $set: {
                    updateWpTestStatus: wpTestStatus
                }
            }
        );
    }

    setSummaryDataStale(designUpdateId, isStale){

        return DesignUpdates.update({_id: designUpdateId}, {$set:{summaryDataStale: isStale}});
    }

    bulkMoveRollForwardUpdatesToNewDesignVersion(currentDesignVersionId, newDesignVersionId){

        return DesignUpdates.update(
            {designVersionId: currentDesignVersionId, updateMergeAction: DesignUpdateMergeAction.MERGE_ROLL},
            {
                $set:{
                    designVersionId: newDesignVersionId,
                    updateMergeAction: DesignUpdateMergeAction.MERGE_INCLUDE
                }
            },
            {multi: true}
        );
    }

    bulkSetDesignUpdatesAsIgnore(currentDesignVersionId){

        return DesignUpdates.update(
            {
                designVersionId: currentDesignVersionId,
                updateMergeAction: DesignUpdateMergeAction.MERGE_IGNORE
            },
            {
                $set:{
                    updateStatus: DesignUpdateStatus.UPDATE_IGNORED
                }
            },
            {multi: true}
        );
    }

    bulkCompleteMergedUpdates(previousDesignVersionId){

        return DesignUpdates.update(
            {
                designVersionId: previousDesignVersionId,
                updateMergeAction: DesignUpdateMergeAction.MERGE_INCLUDE
            },
            {
                $set:{
                    updateStatus: DesignUpdateStatus.UPDATE_MERGED
                }
            },
            {multi: true}
        );
    }

    bulkSetUpdatesStale(designVersionId){

        return DesignUpdates.update(
            {designVersionId: designVersionId},
            {
                $set: {summaryDataStale: true}
            },
            {multi: true}

        );
    }

    // REMOVE ==========================================================================================================

    removeUpdate(designUpdateId){

        return DesignUpdates.remove({_id: designUpdateId});
    }
}

export const DesignUpdateData = new DesignUpdateDataClass();