
// Ultrawide Collections
import { WorkPackages }             from '../../collections/work/work_packages.js';
import { WorkPackageComponents }    from '../../collections/work/work_package_components.js';
import { DesignVersionComponents }  from '../../collections/design/design_version_components.js';
import { DesignUpdateComponents }   from '../../collections/design_update/design_update_components.js';

// Ultrawide Services
import { WorkPackageStatus }        from '../../constants/constants.js';
import { DefaultItemNames }         from '../../constants/default_names.js';

import  WorkPackageModules          from '../../service_modules/work/work_package_service_modules.js';

//======================================================================================================================
//
// Server Code for Work Package Items.
//
// Methods called directly by Server API
//
//======================================================================================================================
class WorkPackageServices{

    // Add a new Work Package
    addNewWorkPackage(designVersionId, designUpdateId, wpType, populateWp){

        if(Meteor.isServer) {
            const workPackageId = WorkPackages.insert(
                {
                    designVersionId: designVersionId,            // The design version this is work for
                    designUpdateId: designUpdateId,             // Defaults if not Update WP
                    workPackageType: wpType,                     // Either Base Version Implementation or Design Update Implementation
                    workPackageName: DefaultItemNames.NEW_WORK_PACKAGE_NAME,         // Identifier of this work package
                    workPackageStatus: WorkPackageStatus.WP_NEW,

                }
            );

            return workPackageId;
        }
    };

    importWorkPackage(designVersionId, designUpdateId, adoptingUserId, workPackage){

        if(Meteor.isServer) {
            const workPackageId = WorkPackages.insert(
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

            return workPackageId;
        }
    }



    // Called when data is restored
    importComponent(designVersionId, workPackageId, designComponentId, wpComponent){

        if(Meteor.isServer) {
            const wpComponentId = WorkPackageComponents.insert(
                {
                    // Identity
                    designVersionId: designVersionId,
                    workPackageId: workPackageId,
                    workPackageType: wpComponent.workPackageType,
                    componentId: designComponentId,
                    componentReferenceId: wpComponent.componentReferenceId,
                    componentParentReferenceId: wpComponent.componentParentReferenceId,
                    componentFeatureReferenceId: wpComponent.componentFeatureReferenceId,
                    componentType: wpComponent.componentType,
                    componentIndex: wpComponent.componentIndex,

                    // Status
                    scopeType: wpComponent.scopeType
                }
            );

            return wpComponentId;
        }
    }

    publishWorkPackage(workPackageId){

        if(Meteor.isServer) {
            WorkPackages.update(
                {_id: workPackageId},
                {
                    $set: {
                        workPackageStatus: WorkPackageStatus.WP_AVAILABLE
                    }
                }
            );
        }
    };

    withdrawWorkPackage(workPackageId){

        if(Meteor.isServer) {
            WorkPackages.update(
                {_id: workPackageId},
                {
                    $set: {
                        workPackageStatus: WorkPackageStatus.WP_NEW
                    }
                }
            );
        }
    };

    adoptWorkPackage(workPackageId, userId){

        if(Meteor.isServer) {
            WorkPackages.update(
                {_id: workPackageId},
                {
                    $set: {
                        workPackageStatus: WorkPackageStatus.WP_ADOPTED,
                        adoptingUserId: userId
                    }
                }
            );
        }
    }

    releaseWorkPackage(workPackageId){

        if(Meteor.isServer) {
            WorkPackages.update(
                {_id: workPackageId},
                {
                    $set: {
                        workPackageStatus: WorkPackageStatus.WP_AVAILABLE,
                        adoptingUserId: 'NONE'
                    }
                }
            );
        }
    }

    completeWorkPackage(workPackageId){

        if(Meteor.isServer) {
            WorkPackages.update(
                {_id: workPackageId},
                {
                    $set: {
                        workPackageStatus: WorkPackageStatus.WP_COMPLETE
                    }
                }
            );
        }
    };

    updateWorkPackageName(workPackageId, newName){

        if(Meteor.isServer) {
            WorkPackages.update(
                {_id: workPackageId},
                {
                    $set: {
                        workPackageName: newName
                    }
                }
            );
        }
    };


    removeWorkPackage(workPackageId){

        if(Meteor.isServer) {
            // Delete all components in the work package
            let removedComponents = WorkPackageComponents.remove(
                {workPackageId: workPackageId}
            );

            if(removedComponents >= 0){

                // Clear any design components associated with this WP
                DesignVersionComponents.update(
                    {
                        workPackageId: workPackageId
                    },
                    {
                        $set: {workPackageId: 'NONE'}
                    },
                    {multi: true}
                );

                DesignUpdateComponents.update(
                    {
                        workPackageId: workPackageId
                    },
                    {
                        $set: {workPackageId: 'NONE'}
                    },
                    {multi: true}
                );

                // OK so delete the WP itself
                WorkPackages.remove({_id: workPackageId});
            }
        }
    };

}

export default new WorkPackageServices();
