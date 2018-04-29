
import {
    addDesign,
    updateDesignName,
    removeDesign,
    updateDefaultAspectName,
    updateDefaultAspectIncluded
} from '../apiValidatedMethods/design_methods.js'

// =====================================================================================================================
// Server API for Design Items
//
// Calls Meteor Validated Methods and returns asynchronous results to callback
// =====================================================================================================================
class ServerDesignApiClass {

    addDesign(userRole, callback){

        addDesign.call(
            {
                userRole: userRole
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    updateDesignName(userRole, designId, newName, callback){

        updateDesignName.call(
            {
                userRole: userRole,
                designId: designId,
                newName:  newName
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    removeDesign(userRole, designId, callback){

        removeDesign.call(
            {
                userRole: userRole,
                designId: designId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    updateDefaultAspectName(userContext, userRole, defaultAspectId, newNamePlain, newNameRaw, callback){

        updateDefaultAspectName.call(
            {
                userContext: userContext,
                userRole: userRole,
                defaultAspectId: defaultAspectId,
                newNamePlain: newNamePlain,
                newNameRaw: newNameRaw
            },
            (err, result) => {
                callback(err, result);
            }
        )
    };

    updateDefaultAspectIncluded(userRole, defaultAspectId, included, callback){

        updateDefaultAspectIncluded.call(
            {
                userRole: userRole,
                defaultAspectId: defaultAspectId,
                included: included
            },
            (err, result) => {
                callback(err, result);
            }
        )
    };

}

export const ServerDesignApi = new ServerDesignApiClass();