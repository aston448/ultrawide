
import {
    addDesignUpdate,
    updateDesignUpdateName,
    updateDesignUpdateVersion,
    publishDesignUpdate,
    removeDesignUpdate
} from '../apiValidatedMethods/design_update_methods.js'

// =====================================================================================================================
// Server API for Design Update Items
//
// Calls Meteor Validated Methods and returns asynchronous results to callback
// =====================================================================================================================
class ServerDesignUpdateApi {

    addDesignUpdate(userRole, designVersionId, callback){

        addDesignUpdate.call(
            {
                userRole:           userRole,
                designVersionId:    designVersionId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    updateDesignUpdateName(userRole, designUpdateId, newName, callback){

        updateDesignUpdateName.call(
            {
                userRole:       userRole,
                designUpdateId: designUpdateId,
                newName:        newName
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    updateDesignUpdateVersion(userRole, designUpdateId, newVersion, callback){

        updateDesignUpdateVersion.call(
            {
                userRole:       userRole,
                designUpdateId: designUpdateId,
                newVersion:     newVersion
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    publishDesignUpdate(userRole, designUpdateId, callback){

        publishDesignUpdate.call(
            {
                userRole:       userRole,
                designUpdateId: designUpdateId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    removeDesignUpdate(userRole, designUpdateId, callback){

        removeDesignUpdate.call(
            {
                userRole:       userRole,
                designUpdateId: designUpdateId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

}

export default new ServerDesignUpdateApi();

