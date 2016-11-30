// == IMPORTS ==========================================================================================================

// Meteor / React Services
import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

// Ultrawide Services
import  DesignVersionServices from '../servicers/design/design_version_services.js';
// =====================================================================================================================

import { updateDesignVersionName, updateDesignVersionNumber, publishDesignVersion, unpublishDesignVersion } from '../apiValidatedMethods/design_version_methods.js'

// =====================================================================================================================
// Server API for Design Version Items
//
// Calls Meteor Validated Methods and returns asynchronous results to callback
// =====================================================================================================================
class ServerDesignVersionApi {

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

    unpublishDesignVersion(userRole, designVersionId, callback){

        unpublishDesignVersion.call(
            {
                userRole: userRole,
                designVersionId: designVersionId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

}

export default new ServerDesignVersionApi();






Meteor.methods({


    'designVersion.mergeUpdatesToNewDraftVersion'(designVersionId){
        //console.log("Merging design version updates to new version for "  + designVersionId);

        DesignVersionServices.mergeUpdatesToNewDraftVersion(designVersionId);

    }

});