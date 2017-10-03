
import {WorkPackages}                   from '../../collections/work/work_packages.js';
import {WorkPackageComponents}          from '../../collections/work/work_package_components.js';

import { WorkPackageStatus, WorkPackageType, ComponentType, WorkPackageScopeType, UpdateScopeType, MashTestStatus, DesignUpdateStatus, DesignUpdateMergeAction, UpdateMergeStatus, LogLevel }      from '../../constants/constants.js';
import { DefaultItemNames } from "../../constants/default_names";

class WorkPackageData {

    // INSERT ==========================================================================================================

    insertNewWorkPackage(designVersionId, designUpdateId, wpType){

        return WorkPackages.insert(
            {
                designVersionId: designVersionId,            // The design version this is work for
                designUpdateId: designUpdateId,             // Defaults if not Update WP
                workPackageType: wpType,                     // Either Base Version Implementation or Design Update Implementation
                workPackageName: DefaultItemNames.NEW_WORK_PACKAGE_NAME,         // Identifier of this work package
                workPackageStatus: WorkPackageStatus.WP_NEW,

            }
        );
    }

    importWorkPackage(designVersionId, designUpdateId, adoptingUserId, workPackage){

        if(Meteor.isServer) {
            return WorkPackages.insert(
                {
                    designVersionId: designVersionId,
                    designUpdateId: designUpdateId,
                    workPackageType: workPackage.workPackageType,
                    workPackageName: workPackage.workPackageName,
                    workPackageRawText: workPackage.workPackageRawText,
                    workPackageStatus: workPackage.workPackageStatus,
                    adoptingUserId: adoptingUserId
                }
            );
        }
    }

    // SELECT ==========================================================================================================

    getWorkPackageById(workPackageId){

        return WorkPackages.findOne({_id: workPackageId});
    }

    getActiveWorkPackagesForDesignUpdate(designVersionId, designUpdateId){

        return WorkPackages.find({
            designVersionId:    designVersionId,
            designUpdateId:     designUpdateId,
            workPackageStatus:  {$ne: WorkPackageStatus.WP_COMPLETE},
            workPackageType:    WorkPackageType.WP_UPDATE
        }).fetch();
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

export default new WorkPackageData();