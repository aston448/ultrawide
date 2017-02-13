
import {
    addLocation,
    saveLocationDetails,
    removeLocation
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

}

export default new ServerTestOutputLocationApi();
