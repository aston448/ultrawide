
import WorkPackageServices from '../servicers/work/work_package_services.js';

Meteor.methods({

    // Work Package Management -----------------------------------------------------------------------------------------

    // Add a new WP to a design version or design update
    'workPackage.addNewWorkPackage'(designVersionId, designUpdateId, wpType){

        //console.log("Adding new work package of type " + wpType);
        WorkPackageServices.addNewWorkPackage(designVersionId, designUpdateId, wpType, true); // Always populate components
    },

    // Remove a WP - having previously validated that it is OK to do so
    'workPackage.removeWorkPackage'(workPackageId){

        //console.log("Removing work package " + workPackageId);
        WorkPackageServices.removeWorkPackage(workPackageId);
    },

    // Publish a new WP as Draft
    'workPackage.publishWorkPackage'(workPackageId){

        //console.log("Publishing work package " + workPackageId);
        WorkPackageServices.publishWorkPackage(workPackageId);
    },

    // Save the name for a Work Package
    'workPackage.updateWorkPackageName'(workPackageId, newName){

        //console.log("Updating work package name to " + newName);
        WorkPackageServices.updateWorkPackageName(workPackageId, newName);
    },

    // Toggle a component in or out of scope
    'workPackage.toggleScope'(wpComponent, newScope){

        //console.log("Toggling scope to " + newScope);
        WorkPackageServices.toggleScope(wpComponent, newScope);
    },


});