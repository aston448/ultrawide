
import {
    addLocation,
    saveLocation,
    removeLocation,
    addLocationFile,
    saveLocationFile,
    removeLocationFile,
    saveUserConfiguration,
    updateUserConfiguration,
    uploadTestResultsFile
} from '../apiValidatedMethods/test_output_location_methods.js'

// =====================================================================================================================
// Server API for Test Output Locations
//
// Calls Meteor Validated Methods and returns asynchronous results to callback
// =====================================================================================================================
class ServerTestOutputLocationApi {

    addLocation(userRole, userId,  callback){

        addLocation.call(
            {
                userRole:   userRole,
                userId:     userId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    saveLocation(userRole, location, callback){

        saveLocation.call(
            {
                userRole: userRole,
                location: location
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    removeLocation(userRole, locationId, callback){

        removeLocation.call(
            {
                userRole:   userRole,
                locationId: locationId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    addLocationFile(userRole, locationId, callback){

        addLocationFile.call(
            {
                userRole: userRole,
                locationId: locationId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    saveLocationFile(userRole, locationFile, callback){

        saveLocationFile.call(
            {
                userRole:       userRole,
                locationFile:   locationFile
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    removeLocationFile(userRole, locationFileId, callback){

        removeLocationFile.call(
            {
                userRole:       userRole,
                locationFileId: locationFileId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    saveUserConfiguration(userConfiguration, callback){

        saveUserConfiguration.call(
            {
                userConfiguration:  userConfiguration
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    updateUserConfiguration(userId, callback){

        updateUserConfiguration.call(
            {
                userId:     userId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    uploadTestResultsFile(blob, name, path, encoding, callback){

        uploadTestResultsFile.call(
            {
                blob: blob,
                name: name,
                path: path,
                encoding: encoding
            },
            (err, result) => {
                callback(err, result);
            }

        )
    }



}

export default new ServerTestOutputLocationApi();
