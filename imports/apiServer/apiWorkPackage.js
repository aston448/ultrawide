
import {
    addWorkPackage,
    updateWorkPackageName,
    publishWorkPackage,
    withdrawWorkPackage,
    adoptWorkPackage,
    releaseWorkPackage,
    removeWorkPackage,
    updateWorkPackageTestCompleteness
} from '../apiValidatedMethods/work_package_methods.js'

// =====================================================================================================================
// Server API for Work Package Items
//
// Calls Meteor Validated Methods and returns asynchronous results to callback
// =====================================================================================================================
class ServerWorkPackageApi {

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
}

export default new ServerWorkPackageApi();
