
import { addWorkPackage, updateWorkPackageName, publishWorkPackage, removeWorkPackage } from '../apiValidatedMethods/work_package_methods.js'

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
}

export default new ServerWorkPackageApi();
