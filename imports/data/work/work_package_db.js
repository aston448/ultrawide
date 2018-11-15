
import {WorkPackages}                   from '../../collections/work/work_packages.js';
import {WorkPackageComponents}          from '../../collections/work/work_package_components.js';

import { WorkPackageStatus, WorkPackageTestStatus, WorkPackageType, ComponentType, WorkPackageScopeType, UpdateScopeType, MashTestStatus, DesignUpdateStatus, DesignUpdateMergeAction, UpdateMergeStatus, LogLevel }      from '../../constants/constants.js';
import { DefaultItemNames } from "../../constants/default_names";
import {WorkItems} from "../../collections/work/work_items";

class WorkPackageDataClass {

    // INSERT ==========================================================================================================

    insertNewWorkPackage(designVersionId, designUpdateId, wpType){

        return WorkPackages.insert(
            {
                designVersionId: designVersionId,            // The design version this is work for
                designUpdateId: designUpdateId,             // Defaults if not Update WP
                workPackageType: wpType,                     // Either Base Version Implementation or Design Update Implementation
                workPackageName: DefaultItemNames.NEW_WORK_PACKAGE_NAME,         // Identifier of this work package
                workPackageStatus: WorkPackageStatus.WP_NEW,
                workPackageTestStatus: WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE
            }
        );
    }

    importWorkPackage(designVersionId, designUpdateId, adoptingUserId, workPackage){

        if(Meteor.isServer) {
            return WorkPackages.insert(
                {
                    designVersionId:        designVersionId,
                    designUpdateId:         designUpdateId,
                    parentWorkItemRefId:    workPackage.parentWorkItemRefId,
                    workPackageType:        workPackage.workPackageType,
                    workPackageName:        workPackage.workPackageName,
                    workPackageRawText:     workPackage.workPackageRawText,
                    workPackageStatus:      workPackage.workPackageStatus,
                    workPackageTestStatus:  workPackage.workPackageTestStatus,
                    adoptingUserId:         adoptingUserId,
                    workPackageLink:        workPackage.workPackageLink
                }
            );
        }
    }

    // SELECT ==========================================================================================================

    getWorkPackageById(workPackageId){

        return WorkPackages.findOne({_id: workPackageId});
    }

    getDesignVersionWorkPackagesInIteration(designVersionId, parentIterationRefId){

        return WorkPackages.find(
            {
                designVersionId:        designVersionId,
                parentWorkItemRefId:    parentIterationRefId,
            }
        ).fetch();
    }

    getUnassignedBaseWorkPackages(designVersionId){

        return WorkPackages.find({
            designVersionId:        designVersionId,
            designUpdateId:         'NONE',
            workPackageType:        WorkPackageType.WP_BASE,
            parentWorkItemRefId:    'NONE'
        }).fetch();
    }

    getActiveWorkPackagesForDesignUpdate(designVersionId, designUpdateId){

        return WorkPackages.find({
            designVersionId:    designVersionId,
            designUpdateId:     designUpdateId,
            workPackageType:    WorkPackageType.WP_UPDATE
        }).fetch();
    }

    getAllNewWorkPackagesForContext(userContext){

        return WorkPackages.find({
            designVersionId:    userContext.designVersionId,
            designUpdateId:     userContext.designUpdateId,
            workPackageStatus:  WorkPackageStatus.WP_NEW
        }).fetch();
    }

    getOtherWorkPackagesForContext(workPackageId, designVersionId, designUpdateId){

        return WorkPackages.find({
            _id:                {$ne: workPackageId},
            designVersionId:    designVersionId,
            designUpdateId:     designUpdateId
        }).fetch();
    }

    getOtherPeerWorkPackages(workPackage){

        return WorkPackages.find(
            {
                _id:                    {$ne: workPackage._id},
                designVersionId:        workPackage.designVersionId,
                wiParentReferenceId:    workPackage.parentWorkItemRefId,
            },
            {sort: {wiIndex: -1}}
        ).fetch();
    }

    getPeerWorkPackages(workPackage){

        return WorkPackages.find(
            {
                designVersionId:        workPackage.designVersionId,
                wiParentReferenceId:    workPackage.parentWorkItemRefId,
            },
            {sort: {wiIndex: 1}}
        ).fetch();
    }

    getActiveScenarios(workPackageId){

        return WorkPackageComponents.find({
            workPackageId: workPackageId,
            componentType: ComponentType.SCENARIO,
            scopeType: WorkPackageScopeType.SCOPE_ACTIVE
        }).fetch();
    }

    getAllWorkPackageComponents(workPackageId){

        return WorkPackageComponents.find({workPackageId: workPackageId}).fetch();
    }

    getWorkPackageComponentsOfType(workPackageId, componentType){

        return WorkPackageComponents.find(
            {
                workPackageId: workPackageId,
                componentType: componentType
            },
            {sort: {componentIndex: 1}}
        ).fetch();
    }

    getApplicationAndSectionIds(workPackageId){

        return WorkPackageComponents.find(
            {
                workPackageId: workPackageId,
                componentType: {$in: [ComponentType.APPLICATION, ComponentType.DESIGN_SECTION]},
            },
            {fields: {_id: 1}}
        );
    }

    getApplicationAndSectionIdsAndRefs(workPackageId){

        return WorkPackageComponents.find(
            {
                workPackageId: workPackageId,
                componentType: {$in: [ComponentType.APPLICATION, ComponentType.DESIGN_SECTION]},
            },
            {fields: {_id: 1, componentReferenceId: 1}}
        );
    }



    // UPDATE ==========================================================================================================

    setWorkPackageName(workPackageId, newName){

        return WorkPackages.update(
            {_id: workPackageId},
            {
                $set: {
                    workPackageName: newName
                }
            }
        );
    }

    setWorkPackageLink(workPackageId, newLink){

        return WorkPackages.update(
            {_id: workPackageId},
            {
                $set: {
                    workPackageLink: newLink
                }
            }
        );
    }

    setWorkPackageStatus(workPackageId, status){

        return WorkPackages.update(
            {_id: workPackageId},
            {
                $set: {
                    workPackageStatus: status
                }
            }
        );
    }

    setWorkPackageTestStatus(workPackageId, status){

        return WorkPackages.update(
            {_id: workPackageId},
            {
                $set: {
                    workPackageTestStatus: status
                }
            }
        );
    }

    setAdoptingUser(workPackageId, userId){

        return WorkPackages.update(
            {_id: workPackageId},
            {
                $set: {
                    adoptingUserId: userId
                }
            }
        );
    }

    setWorkItemParent(workPackageId, parentRefId){

        return WorkPackages.update(
            {_id: workPackageId},
            {
                $set: {
                    parentWorkItemRefId: parentRefId
                }
            }
        );
    }

    setWorkPackageIndex(workPackageId, newIndex){

        return WorkPackages.update(
            {_id: workPackageId},
            {
                $set: {
                    workPackageIndex: newIndex
                }
            }
        );
    }

    // REMOVE ==========================================================================================================

    removeWorkPackage(workPackageId){

        return WorkPackages.remove({_id: workPackageId});
    }

    removeAllComponents(workPackageId){

        return WorkPackageComponents.remove(
            {workPackageId: workPackageId}
        );
    }
}

export const WorkPackageData = new WorkPackageDataClass();