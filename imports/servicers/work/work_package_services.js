
// Ultrawide Collections
import { WorkPackages }             from '../../collections/work/work_packages.js';
import { WorkPackageComponents }    from '../../collections/work/work_package_components.js';

// Ultrawide Services
import { WorkPackageStatus }        from '../../constants/constants.js';

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
                    workPackageName: 'New Work Package',         // Identifier of this work package
                    workPackageStatus: WorkPackageStatus.WP_NEW,

                }
            );

            if(workPackageId){

                // Now populate the work package components
                if (populateWp) {
                    WorkPackageModules.populateWorkPackageComponents(workPackageId, designVersionId, designUpdateId, wpType);
                }
            }

            return workPackageId;
        }
    };

    importWorkPackage(designVersionId, designUpdateId, workPackage){

        if(Meteor.isServer) {
            const workPackageId = WorkPackages.insert(
                {
                    designVersionId: designVersionId,
                    designUpdateId: designUpdateId,
                    workPackageType: workPackage.workPackageType,
                    workPackageName: workPackage.workPackageName,
                    workPackageRawText: workPackage.workPackageRawText,
                    workPackageStatus: workPackage.workPackageStatus
                }
            );

            return workPackageId;
        }
    }



    // Called when data is restored
    importComponent(workPackageId, designComponentId, wpComponent){

        if(Meteor.isServer) {
            const wpComponentId = WorkPackageComponents.insert(
                {
                    // Identity
                    workPackageId: workPackageId,
                    workPackageType: wpComponent.workPackageType,
                    componentId: designComponentId,
                    componentReferenceId: wpComponent.componentReferenceId,
                    componentParentReferenceId: wpComponent.componentParentReferenceId,
                    componentFeatureReferenceId: wpComponent.componentFeatureReferenceId,
                    componentType: wpComponent.componentType,
                    componentLevel: wpComponent.componentLevel,
                    componentIndex: wpComponent.componentIndex,

                    // Status
                    componentParent: wpComponent.componentParent,
                    componentActive: wpComponent.componentActive
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

                // OK so delete the WP itself
                WorkPackages.remove({_id: workPackageId});
            }
        }
    };

}

export default new WorkPackageServices();
