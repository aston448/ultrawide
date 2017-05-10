
// == IMPORTS ==========================================================================================================

import TestOutputLocationServices           from '../../imports/servicers/configure/test_output_location_services.js';
import UserManagementServices               from '../../imports/servicers/users/user_management_services.js';

// =====================================================================================================================

// This converts Meteor errors to JSON error responses
JsonRoutes.ErrorMiddleware.use(RestMiddleware.handleErrorAsJson);


// ++ Method Options +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// These implicitly define the external interface

SimpleRest.setMethodOptions('upload-file-v1', {

    url: "api/v1/upload-file",

    getArgsFromRequest: (request) => {

        const header = request.headers;     // Must contain file name and authentication key
        const file = request.body;          // Contains file binary

        return [file, header.name, header.key];
    }
});

// ++ API Methods ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// These call internal server methods

Meteor.methods({

    'upload-file-v1': (locationFile, name, key) => {

        try{
            UserManagementServices.verifyApiKey(key);
            TestOutputLocationServices.uploadTestResultsFile(locationFile, name, '', 'binary');
        } catch (e) {
            throw new Meteor.Error('API_UPLOAD_FILE_ERR', e.reason)
        }
    }
});

