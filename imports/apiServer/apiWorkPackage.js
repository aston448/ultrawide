
import {
    addWorkPackage,
    updateWorkPackageName,
    updateWorkPackageLink,
    publishWorkPackage,
    withdrawWorkPackage,
    adoptWorkPackage,
    releaseWorkPackage,
    removeWorkPackage,
    updateWorkPackageTestCompleteness,
    closeWorkPackage,
    reopenWorkPackage
} from '../apiValidatedMethods/work_package_methods.js'

// =====================================================================================================================
// Server API for Work Package Items
//
// Calls Meteor Validated Methods and returns asynchronous results to callback
// =====================================================================================================================
class ServerWorkPackageApiClass {

    addWorkPackage(userRole, designVersionId, designUpdateId, workPackageType, callback){
        addWorkPackage.call(
            {
                userRole: userRole,
                designVersionId: designVersionId,
                designUpdateId: designUpdateId,
                workPackageType: workPackageType
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    updateWorkPackageName(userRole, workPackageId, newName, callback){
        updateWorkPackageName.call(
            {
                userRole: userRole,
                workPackageId: workPackageId,
                newName: newName
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    updateWorkPackageLink(workPackageId, newLink, callback){
        updateWorkPackageLink.call(
            {
                workPackageId: workPackageId,
                newLink: newLink
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    publishWorkPackage(userRole, workPackageId, callback){
        publishWorkPackage.call(
            {
                userRole: userRole,
                workPackageId: workPackageId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    withdrawWorkPackage(userRole, workPackageId, callback){
        withdrawWorkPackage.call(
            {
                userRole: userRole,
                workPackageId: workPackageId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    adoptWorkPackage(userRole, workPackageId, userId, callback){
        adoptWorkPackage.call(
            {
                userRole: userRole,
                workPackageId: workPackageId,
                userId: userId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    releaseWorkPackage(userRole, workPackageId, userId, callback){
        releaseWorkPackage.call(
            {
                userRole: userRole,
                workPackageId: workPackageId,
                userId: userId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    removeWorkPackage(userRole, workPackageId, callback){
        removeWorkPackage.call(
            {
                userRole: userRole,
                workPackageId: workPackageId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    updateWorkPackageTestCompleteness(userContext, workPackageId, callback){
        updateWorkPackageTestCompleteness.call(
            {
                userContext: userContext,
                workPackageId: workPackageId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    closeWorkPackage(userRole, workPackageId, callback){
        closeWorkPackage.call(
            {
                userRole: userRole,
                workPackageId: workPackageId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    reopenWorkPackage(userRole, workPackageId, callback){
        reopenWorkPackage.call(
            {
                userRole: userRole,
                workPackageId: workPackageId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };
}

export const ServerWorkPackageApi = new ServerWorkPackageApiClass();
