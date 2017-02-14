
// Ultrawide Collections
import { TestOutputLocations }      from '../../collections/configure/test_output_locations.js'
import { TestOutputLocationFiles }  from '../../collections/configure/test_output_location_files.js'
import { UserTestTypeLocations }    from '../../collections/configure/user_test_type_locations.js';


// Ultrawide Services
import { TestLocationType, ComponentType} from '../../constants/constants.js';
import { DefaultLocationText } from '../../constants/default_names.js';

//======================================================================================================================
//
// Server Code for Test Output Locations.
//
// Methods called directly by Server API
//
//======================================================================================================================

class TestOutputLocationServices {

    // Add a new location with default details
    addLocation() {

        if (Meteor.isServer) {

            // Create a new default entry...
            let locationId = TestOutputLocations.insert(
                {
                    locationName:           DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME,
                    locationType:           TestLocationType.SHARED
                }
            );
        }

    };

    // Save details from the location edit form
    saveLocation(location) {

        if (Meteor.isServer) {

            TestOutputLocations.update(
                {_id: location._id},
                {
                    $set: {
                        locationName:           location.locationName,
                        locationRawText:        location.locationRawText,
                        locationType:           location.locationType,
                        locationUserId:         location.locationUserId,
                        locationServerName:     location.locationServerName,
                        serverLogin:            location.serverLogin,
                        serverPassword:         location.serverPassword,
                        locationPath:           location.locationPath
                    }
                }
            );
        }
    };

    // Remove a location
    removeLocation(locationId) {

        if (Meteor.isServer) {

            TestOutputLocations.remove(
                {_id: locationId}
            );
        }
    };

    updateUserConfiguration(userId, userRole){

        // Make sure config contains all the possible locations for this user

        const testOutputLocations = TestOutputLocations.find({}).fetch();

        let userLocation = null;

        testOutputLocations.forEach((location) => {

            userLocation = UserTestTypeLocations.findOne({
                locationId: location._id,
                userId: userId,
                userRole: userRole
            });

            // If not found and the location is either Shared or created by this user then add it in for the current user / role
            if(!userLocation && (location.locationType === TestLocationType.SHARED || location.userId === userId)){

                UserTestTypeLocations.insert({
                    locationId:             location._id,
                    locationName:           location.locationName,
                    locationType:           location.locationType,
                    userId:                 userId,
                    userRole:               userRole
                });
            } else {

                // Make sure the denormalised details are updated
                UserTestTypeLocations.update(
                    {
                        locationId: location._id,
                        userId: userId,
                        userRole: userRole
                    },
                    {
                        $set:{
                            locationName: location.locationName,
                            locationType: location.locationType
                        }
                    }
                );
            }
        });

        // And remove any old locations that have been removed
        const userTestLocations = UserTestTypeLocations.find({
            userId: userId,
            userRole: userRole
        }).fetch();

        let testLocation = null;

        userTestLocations.forEach((userLocation) => {

            testLocation = TestOutputLocations.findOne({_id: userLocation.locationId});

            if(!testLocation){
                UserTestTypeLocations.remove({
                    userId: userId,
                    userRole: userRole,
                    locationId: userLocation.locationId
                });
            }
        })
    }
}

export default new TestOutputLocationServices();