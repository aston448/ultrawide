// == IMPORTS ==========================================================================================================

// Meteor / React Services
import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

// =====================================================================================================================

import {
    updateDesignVersionName,
    updateDesignVersionNumber,
    publishDesignVersion,
    withdrawDesignVersion,
    createNextDesignVersion,
    updateWorkProgress
} from '../apiValidatedMethods/design_version_methods.js'

// =====================================================================================================================
// Server API for Design Version Items
//
// Calls Meteor Validated Methods and returns asynchronous results to callback
// =====================================================================================================================
class ServerDesignVersionApiClass {

    updateDesignVersionName(userRole, designVersionId, newName, callback){

        updateDesignVersionName.call(
            {
                userRole: userRole,
                designVersionId: designVersionId,
                newName: newName
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    updateDesignVersionNumber(userRole, designVersionId, newNumber, callback){

        updateDesignVersionNumber.call(
            {
                userRole: userRole,
                designVersionId: designVersionId,
                newNumber: newNumber
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    publishDesignVersion(userRole, designVersionId, callback){

        publishDesignVersion.call(
            {
                userRole: userRole,
                designVersionId: designVersionId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    withdrawDesignVersion(userRole, designVersionId, callback){

        withdrawDesignVersion.call(
            {
                userRole: userRole,
                designVersionId: designVersionId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    createNextDesignVersion(userRole, designVersionId, callback){

        createNextDesignVersion.call(
            {
                userRole: userRole,
                designVersionId: designVersionId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    updateWorkProgress(userContext, callback){

        updateWorkProgress.call(
            {
                userContext: userContext
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

}

export const ServerDesignVersionApi = new ServerDesignVersionApiClass();
