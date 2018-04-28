
import { DesignVersions }               from '../../collections/design/design_versions.js';
import { DesignVersionComponents }      from '../../collections/design/design_version_components.js';
import { DesignUpdates }                from '../../collections/design_update/design_updates.js';
import { DesignUpdateComponents }       from '../../collections/design_update/design_update_components.js';
import { WorkPackages }                 from '../../collections/work/work_packages.js';
import { WorkPackageComponents }        from '../../collections/work/work_package_components';
import { DomainDictionary }             from '../../collections/design/domain_dictionary.js';
import { UserDesignVersionMashScenarios } from "../../collections/mash/user_dv_mash_scenarios";
import { UserDesignUpdateSummary }      from "../../collections/summary/user_design_update_summary";
import { UserDevDesignSummary }         from "../../collections/summary/user_dev_design_summary";
import { UserDevTestSummary }           from "../../collections/summary/user_dev_test_summary";
import { UserWorkProgressSummary }      from "../../collections/summary/user_work_progress_summary";

import { ComponentType, UpdateMergeStatus, WorkPackageStatus, WorkPackageTestStatus, DesignUpdateStatus, DuWorkPackageTestStatus, DesignUpdateMergeAction, WorkPackageType } from '../../constants/constants.js';

class DesignVersionDataClass {

    // INSERT ==========================================================================================================

    insertNewDesignVersion(designId, designVersionName, designVersionNumber, designVersionStatus, baseDesignVersionId = 'NONE', designVersionIndex = 0){

        return DesignVersions.insert(
            {
                designId: designId,
                designVersionName: designVersionName,
                designVersionNumber: designVersionNumber,
                designVersionStatus: designVersionStatus,
                baseDesignVersionId: baseDesignVersionId,
                designVersionIndex: designVersionIndex
            }
        );
    }

    importDesignVersion(designId, designVersion){

        if(Meteor.isServer) {
            return DesignVersions.insert(
                {
                    designId: designId,
                    designVersionName: designVersion.designVersionName,
                    designVersionNumber: designVersion.designVersionNumber,
                    designVersionRawText: designVersion.designVersionRawText,
                    designVersionStatus: designVersion.designVersionStatus,
                    baseDesignVersionId: designVersion.baseDesignVersionId,
                    designVersionIndex: designVersion.designVersionIndex
                }
            );
        }
    }

    // SELECT ==========================================================================================================

    // The DV ----------------------------------------------------------------------------------------------------------
    getDesignVersionById(designVersionId){
        return DesignVersions.findOne({_id: designVersionId});
    }

    // DV Components ---------------------------------------------------------------------------------------------------
    getAllComponents(designVersionId){

        return DesignVersionComponents.find({designVersionId: designVersionId}).fetch();
    }

    getOtherComponentsOfType(designComponentRef, designVersionId, componentType){

        return DesignVersionComponents.find({
            componentReferenceId:   {$ne: designComponentRef},
            designVersionId:        designVersionId,
            componentType:          componentType
        }).fetch();
    }

    getOtherComponentsOfTypeInDvForDu(updateComponent){

        return DesignVersionComponents.find({
            componentReferenceId:   {$ne: updateComponent.componentReferenceId},
            designVersionId:        updateComponent.designVersionId,
            componentType:          updateComponent.componentType
        }).fetch();
    }

    getNonRemovedFeatures(designId, designVersionId){

        return DesignVersionComponents.find(
            {
                designId: designId,
                designVersionId: designVersionId,
                componentType: ComponentType.FEATURE,
                updateMergeStatus: {$ne: UpdateMergeStatus.COMPONENT_REMOVED}
            },
            {sort: {componentNameNew: 1}}
        ).fetch();
    }

    getNonRemovedFeatureCount(designId, designVersionId){

        return DesignVersionComponents.find(
            {
                designId: designId,
                designVersionId: designVersionId,
                componentType: ComponentType.FEATURE,
                updateMergeStatus: {$ne: UpdateMergeStatus.COMPONENT_REMOVED}
            }
        ).count();
    }

    getAllUpdateComponents(designVersionId){

        return DesignUpdateComponents.find({designVersionId: designVersionId}).fetch();
    }

    getComponentCount(designVersionId){

        return DesignVersionComponents.find({designVersionId: designVersionId}).count();
    }

    checkForComponents(){

        return DesignVersionComponents.find({}).count() > 0;
    }

    getNonRemovedScenarioCount(designVersionId){

        return DesignVersionComponents.find({
            designVersionId:    designVersionId,
            componentType:      ComponentType.SCENARIO,
            updateMergeStatus:  {$ne: UpdateMergeStatus.COMPONENT_REMOVED}
        }).count();
    }

    getAllApplications(designVersionId){

        return DesignVersionComponents.find(
            {
                designVersionId: designVersionId,
                componentType: ComponentType.APPLICATION
            },
            {sort: {componentIndexNew: 1}}
        ).fetch();
    }

    getExistingApplications(designVersionId, ){

        return DesignVersionComponents.find(
            {
                designVersionId: designVersionId,
                componentType: ComponentType.APPLICATION,
                updateMergeStatus: {$ne: UpdateMergeStatus.COMPONENT_ADDED}
            },
            {sort: {componentIndexNew: 1}}
        ).fetch();
    }

    getWorkingApplications(designVersionId){

        return DesignVersionComponents.find(
            {
                designVersionId: designVersionId,
                componentType: ComponentType.APPLICATION,
                updateMergeStatus: {$ne: UpdateMergeStatus.COMPONENT_REMOVED}
            },
            {sort: {componentIndexNew: 1}}
        ).fetch();
    }

    getApplicationAndSectionIds(designVersionId){

        return DesignVersionComponents.find(
            {
                designVersionId:    designVersionId,
                componentType:      {$in: [ComponentType.APPLICATION, ComponentType.DESIGN_SECTION]}
            },
            {fields: {_id: 1}}
        );
    }

    getApplicationAndSectionIdsAndRefs(designVersionId){

        return DesignVersionComponents.find(
            {
                designVersionId:    designVersionId,
                componentType:      {$in: [ComponentType.APPLICATION, ComponentType.DESIGN_SECTION]}
            },
            {fields: {_id: 1, componentReferenceId: 1}}
        ).fetch();
    }


    // DV Updates ------------------------------------------------------------------------------------------------------

    getAllUpdates(designVersionId){

        return DesignUpdates.find({designVersionId: designVersionId}).fetch();
    }

    getUpdatesAtStatus(designVersionId, status){

        return DesignUpdates.find(
            {
                designVersionId: designVersionId,
                updateStatus: status
            },
            {sort: {updateReference: 1, updateName: 1}}
        ).fetch();
    }

    getIncompleteUpdatesAtStatus(designVersionId, status){

        return DesignUpdates.find(
            {
                designVersionId: designVersionId,
                updateStatus: status,
                updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
            },
            {sort: {updateReference: 1, updateName: 1}}
        ).fetch();
    }

    getWpTestCompleteUpdates(designVersionId){

        return DesignUpdates.find(
            {
                designVersionId: designVersionId,
                updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_COMPLETE
            },
            {sort: {updateReference: 1, updateName: 1}}
        ).fetch();
    }

    getOtherUpdates(designUpdateId, designVersionId){

        return DesignUpdates.find({
            _id: {$ne: designUpdateId},
            designVersionId: designVersionId
        }).fetch();
    }

    getMergeIncludeUpdatesCount(designVersionId){

        return DesignUpdates.find({
            designVersionId: designVersionId,
            updateMergeAction: DesignUpdateMergeAction.MERGE_INCLUDE
        }).count();
    }

    // DV Updates Components -------------------------------------------------------------------------------------------

    getUnchangedUpdateComponents(designUpdateId){

        return DesignUpdateComponents.find(
            {
                designUpdateId: designUpdateId,
                isNew: false,
                isChanged: false,
                isNarrativeChanged: false,
                isTextChanged: false,
                isRemoved: false,
                isMoved: false,
                isRemovedElsewhere: false  // Or not anything that is removed in another update
            }
        );
    }

    getChangedUpdateComponentsByRef(designVersionId, componentReferenceId){

        return DesignUpdateComponents.find({
            designVersionId:        designVersionId,
            componentReferenceId:   componentReferenceId,
            isNew:                  false,
            $or:[{isChanged: true}, {isTextChanged: true}, {isNarrativeChanged: true}],
        }).fetch();
    }

    getOtherExistingUpdateComponentsOfTypeInDv(updateComponent){

        return DesignUpdateComponents.find({
            componentReferenceId:   {$ne: updateComponent.componentReferenceId},
            designVersionId:        updateComponent.designVersionId,
            componentType:          updateComponent.componentType
        }).fetch();
    }

    getComponentInOtherDvUpdates(designComponent, designUpdateId){

        return DesignUpdateComponents.find({
            componentReferenceId:   designComponent.componentReferenceId,
            designVersionId:        designComponent.designVersionId,
            designUpdateId:         {$ne: designUpdateId},
        }).fetch();
    }

    // DV Work Packages ------------------------------------------------------------------------------------------------

    getAllWorkPackages(designVersionId){

        return WorkPackages.find({designVersionId: designVersionId}).fetch();
    }

    getBaseWorkPackagesAtStatus(designVersionId, status){

        return WorkPackages.find(
            {
                designVersionId: designVersionId,
                workPackageType: WorkPackageType.WP_BASE,
                workPackageStatus: status
            },
            {sort: {workPackageName: 1}}
        ).fetch();
    }

    getIncompleteBaseWorkPackagesAtStatus(designVersionId, status){

        return WorkPackages.find(
            {
                designVersionId: designVersionId,
                workPackageType: WorkPackageType.WP_BASE,
                workPackageStatus: status,
                workPackageTestStatus: WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE
            },
            {sort: {workPackageName: 1}}
        ).fetch();
    }

    getTestCompletedBaseWorkPackages(designVersionId){

        return WorkPackages.find(
            {
                designVersionId: designVersionId,
                workPackageType: WorkPackageType.WP_BASE,
                workPackageTestStatus: WorkPackageTestStatus.WP_TESTS_COMPLETE
            },
            {sort: {workPackageName: 1}}
        ).fetch();
    }

    getAdoptingUserTestCompletedBaseWorkPackages(designVersionId, userId){

        return WorkPackages.find(
            {
                designVersionId: designVersionId,
                workPackageType: WorkPackageType.WP_BASE,
                workPackageStatus: WorkPackageStatus.WP_ADOPTED,
                workPackageTestStatus: WorkPackageTestStatus.WP_TESTS_COMPLETE,
                adoptingUserId: userId
            },
            {sort: {workPackageName: 1}}
        ).fetch();
    }

    getBaseUserAdoptedWorkPackages(designVersionId, userId){

        return WorkPackages.find(
            {
                designVersionId: designVersionId,
                workPackageType: WorkPackageType.WP_BASE,
                workPackageStatus: WorkPackageStatus.WP_ADOPTED,
                workPackageTestStatus: WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                adoptingUserId: userId
            },
            {sort: {workPackageName: 1}}
        ).fetch();
    }

    getUpdateWorkPackagesAtStatus(designVersionId, status){

        return WorkPackages.find(
            {
                designVersionId: designVersionId,
                workPackageType: WorkPackageType.WP_UPDATE,
                workPackageStatus: status
            },
            {sort: {workPackageName: 1}}
        ).fetch();
    }

    getIncompleteUpdateWorkPackagesAtStatus(designVersionId, status){

        return WorkPackages.find(
            {
                designVersionId: designVersionId,
                workPackageType: WorkPackageType.WP_UPDATE,
                workPackageStatus: status,
                workPackageTestStatus: WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE
            },
            {sort: {workPackageName: 1}}
        ).fetch();
    }

    getTestCompletedUpdateWorkPackages(designVersionId){

        return WorkPackages.find(
            {
                designVersionId: designVersionId,
                workPackageType: WorkPackageType.WP_UPDATE,
                workPackageTestStatus: WorkPackageTestStatus.WP_TESTS_COMPLETE
            },
            {sort: {workPackageName: 1}}
        ).fetch();
    }

    getAdoptingUserTestCompletedUpdateWorkPackages(designVersionId, userId){

        return WorkPackages.find(
            {
                designVersionId: designVersionId,
                workPackageType: WorkPackageType.WP_UPDATE,
                workPackageStatus: WorkPackageStatus.WP_ADOPTED,
                workPackageTestStatus: WorkPackageTestStatus.WP_TESTS_COMPLETE,
                adoptingUserId: userId
            },
            {sort: {workPackageName: 1}}
        ).fetch();
    }

    getUpdateUserAdoptedWorkPackages(designVersionId, userId){

        return WorkPackages.find(
            {
                designVersionId: designVersionId,
                workPackageType: WorkPackageType.WP_UPDATE,
                workPackageStatus: WorkPackageStatus.WP_ADOPTED,
                workPackageTestStatus: WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                adoptingUserId: userId
            },
            {sort: {workPackageName: 1}}
        ).fetch();
    }

    getPublishedWorkPackages(designVersionId){

        return WorkPackages.find(
            {
                designVersionId:    designVersionId,
                workPackageStatus:  {$ne: WorkPackageStatus.WP_NEW}
            },
            {
                $sort: {workPackageName: 1}
            }
        ).fetch();
    }

    getBaseWorkPackages(designVersionId){

        return WorkPackages.find({
            designVersionId:    designVersionId,
            designUpdateId:     'NONE',
            workPackageType:    WorkPackageType.WP_BASE
        }).fetch();
    }

    // DV Updates ------------------------------------------------------------------------------------------------------
    getMergeIncludeUpdates(designVersionId){

        return DesignUpdates.find(
            {
                designVersionId:            designVersionId,
                updateStatus:               {$in: [DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT, DesignUpdateStatus.UPDATE_MERGED]},
                updateMergeAction:          DesignUpdateMergeAction.MERGE_INCLUDE
            },
            {
                $sort: {updateReference: 1, updateName: 1}
            }
        ).fetch();
    }

    getRollForwardUpdates(designVersionId){

        return DesignUpdates.find(
            {
                designVersionId: designVersionId,
                updateMergeAction: DesignUpdateMergeAction.MERGE_ROLL
            },
            {
                $sort: {updateReference: 1, updateName: 1}
            }
        ).fetch();
    }

    // DV Dictionary ---------------------------------------------------------------------------------------------------
    getDomainDictionaryEntries(designVersionId){

        return DomainDictionary.find({
            designVersionId: designVersionId
        }).fetch();
    }

    getOtherDomainDictionaryEntries(termId, designId, designVersionId){

        return DomainDictionary.find({
            _id:                {$ne: termId},
            designId:           designId,
            designVersionId:    designVersionId,
        }).fetch();
    }

    // UPDATE ==========================================================================================================

    updateDesignVersionName(designVersionId, newName){

        return DesignVersions.update(
            {_id: designVersionId},
            {
                $set: {
                    designVersionName: newName
                }
            }
        );
    }

    updateDesignVersionNumber(designVersionId, newNumber){

        return DesignVersions.update(
            {_id: designVersionId},
            {
                $set: {
                    designVersionNumber: newNumber
                }
            }
        );
    }

    setDesignVersionStatus(designVersionId, newStatus){

        return DesignVersions.update(
            {_id: designVersionId},

            {
                $set: {
                    designVersionStatus: newStatus
                }
            }
        );
    }

    // REMOVE ==========================================================================================================

    removeDesignVersionData(designVersionId){

        // Remove the restorable data
        DesignUpdates.remove({designVersionId: designVersionId});
        WorkPackages.remove({designVersionId: designVersionId});
        DesignVersionComponents.remove({designVersionId: designVersionId});
        DesignUpdateComponents.remove({designVersionId: designVersionId});
        WorkPackageComponents.remove({designVersionId: designVersionId});
        DomainDictionary.remove({designVersionId: designVersionId});

        // Remove ephemeral data
        UserDesignVersionMashScenarios.remove({designVersionId: designVersionId});
        UserDesignUpdateSummary.remove({designVersionId: designVersionId});
        UserDevDesignSummary.remove({designVersionId: designVersionId});
        UserDevTestSummary.remove({designVersionId: designVersionId});
        UserWorkProgressSummary.remove({designVersionId: designVersionId});
    }
}

export const DesignVersionData = new DesignVersionDataClass();