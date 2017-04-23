
import {
    addDesignUpdate,
    updateDesignUpdateName,
    updateDesignUpdateRef,
    publishDesignUpdate,
    withdrawDesignUpdate,
    removeDesignUpdate,
    updateMergeAction,
    updateDesignUpdateStatuses
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

    updateDesignUpdateRef(userRole, designUpdateId, newRef, callback){

        updateDesignUpdateRef.call(
            {
                userRole:       userRole,
                designUpdateId: designUpdateId,
                newRef:     newRef
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

    withdrawDesignUpdate(userRole, designUpdateId, callback){

        withdrawDesignUpdate.call(
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

    updateMergeAction(userRole, designUpdateId, newAction, callback){

        updateMergeAction.call(
            {
                userRole:       userRole,
                designUpdateId: designUpdateId,
                newAction:      newAction
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    updateDesignUpdateStatuses(userContext, callback){

        updateDesignUpdateStatuses.call(
            {
                userContext:       userContext
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };


}

export default new ServerDesignUpdateApi();

