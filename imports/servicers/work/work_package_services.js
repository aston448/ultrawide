
// Ultrawide Services
import { WorkPackageStatus }        from '../../constants/constants.js';

// Data Access
import DesignComponentData          from '../../data/design/design_component_db.js';
import DesignUpdateComponentData    from '../../data/design_update/design_update_component_db.js';
import WorkPackageData              from '../../data/work/work_package_db.js';

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

            return WorkPackageData.insertNewWorkPackage(designVersionId, designUpdateId, wpType);
        }
    };


    publishWorkPackage(workPackageId){

        if(Meteor.isServer) {

            WorkPackageData.setWorkPackageStatus(workPackageId, WorkPackageStatus.WP_AVAILABLE);
        }
    };

    withdrawWorkPackage(workPackageId){

        if(Meteor.isServer) {

            WorkPackageData.setWorkPackageStatus(workPackageId, WorkPackageStatus.WP_NEW);
        }
    };

    adoptWorkPackage(workPackageId, userId){

        if(Meteor.isServer) {

            WorkPackageData.setWorkPackageStatus(workPackageId, WorkPackageStatus.WP_ADOPTED);
            WorkPackageData.setAdoptingUser(workPackageId, userId);
        }
    }

    releaseWorkPackage(workPackageId){

        if(Meteor.isServer) {

            WorkPackageData.setWorkPackageStatus(workPackageId, WorkPackageStatus.WP_AVAILABLE);
            WorkPackageData.setAdoptingUser(workPackageId, 'NONE');
        }
    }

    completeWorkPackage(workPackageId){

        if(Meteor.isServer) {

            WorkPackageData.setWorkPackageStatus(workPackageId, WorkPackageStatus.WP_COMPLETE);
        }
    };

    updateWorkPackageName(workPackageId, newName){

        if(Meteor.isServer) {

            WorkPackageData.setWorkPackageName(workPackageId, newName);
        }
    };


    removeWorkPackage(workPackageId){

        if(Meteor.isServer) {
            // Delete all components in the work package
            let removedComponents = WorkPackageData.removeAllComponents(workPackageId);

            if(removedComponents >= 0){

                // Clear any design components associated with this WP
                DesignComponentData.removeWorkPackageIds(workPackageId);
                DesignUpdateComponentData.removeWorkPackageIds(workPackageId);

                // OK so delete the WP itself
                WorkPackageData.removeWorkPackage(workPackageId);
            }
        }
    };

}

export default new WorkPackageServices();
