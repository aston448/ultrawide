
import {
    addLocation,
    saveLocation,
    removeLocation,
    updateUserConfiguration
} from '../apiValidatedMethods/test_output_location_methods.js'

// =====================================================================================================================
// Server API for Test Output Locations
//
// Calls Meteor Validated Methods and returns asynchronous results to callback
// =====================================================================================================================
class ServerTestOutputLocationApi {

    addLocation(userRole, callback){

        addLocation.call(
            {
                userRole: userRole
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

    updateUserConfiguration(userId, userRole, callback){

        updateUserConfiguration.call(
            {
                userId:     userId,
                userRole:   userRole
            },
            (err, result) => {
                callback(err, result);
            }
        );
    }

}

export default new ServerTestOutputLocationApi();
