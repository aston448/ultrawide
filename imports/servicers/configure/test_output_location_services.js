
// Ultrawide Collections
import { TestOutputLocations }      from '../../collections/configure/test_output_locations.js'
import { TestOutputLocationFiles }  from '../../collections/configure/test_output_location_files.js'
import { UserTestTypeLocations }    from '../../collections/configure/user_test_type_locations.js';


// Ultrawide Services
import { log } from '../../common/utils.js';
import { TestLocationType, ComponentType, LogLevel} from '../../constants/constants.js';
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
    addLocation(userId) {

        if (Meteor.isServer) {

            // Create a new default entry.  Mark as owned by the creating user so they can edit it.
            TestOutputLocations.insert(
                {
                    locationName:           DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME,
                    locationType:           TestLocationType.NONE,
                    locationUserId:         userId,
                }
            );
        }

    };

    importLocation(location, userId){

        if (Meteor.isServer) {

            const locationId =  TestOutputLocations.insert(
                {
                    locationName:           location.locationName,
                    locationRawText:        location.locationRawText,
                    locationType:           location.locationType,
                    locationAccessType:     location.locationAccessType,
                    locationIsShared:       location.locationIsShared,
                    locationUserId:         userId,
                    locationServerName:     location.locationServerName,
                    serverLogin:            location.serverLogin,
                    serverPassword:         location.serverPassword,
                    locationPath:           location.locationPath
                }
            );

            return locationId;
        }

    }

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
                        locationAccessType:     location.locationAccessType,
                        locationIsShared:       location.locationIsShared,
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

            const result = TestOutputLocations.remove({_id: locationId});

            if(result > 0){
                // Remove all the files related to this location
                TestOutputLocationFiles.remove({locationId: locationId});

                // And any user config related to it as well
                UserTestTypeLocations.remove({locationId: locationId});
            }
        }
    };

    addLocationFile(locationId){

        if (Meteor.isServer) {

            TestOutputLocationFiles.insert(
                {
                    locationId:             locationId,
                    fileAlias:              DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS,
                    fileName:               DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_NAME
                }
            )
        }
    };

    importLocationFile(locationfile, locationId){

        if (Meteor.isServer) {

            const locationFileId = TestOutputLocationFiles.insert(
                {
                    locationId:             locationId,
                    fileAlias:              locationfile.fileAlias,
                    fileDescription:        locationfile.fileDescription,
                    fileType:               locationfile.fileType,
                    testRunner:             locationfile.testRunner,
                    fileName:               locationfile.fileName,
                    allFilesOfType:         locationfile.allFilesOfType
                }
            );

            return locationFileId;
        }
    }

    saveLocationFile(locationFile){

        if (Meteor.isServer) {

            TestOutputLocationFiles.update(
                {_id: locationFile._id},
                {
                    $set:{
                        fileAlias:              locationFile.fileAlias,
                        fileDescription:        locationFile.fileDescription,
                        fileType:               locationFile.fileType,
                        testRunner:             locationFile.testRunner,
                        fileName:               locationFile.fileName,
                        allFilesOfType:         locationFile.allFilesOfType
                    }
                }
            )

        }
    };

    removeLocationFile(locationFileId){

        if (Meteor.isServer) {

            TestOutputLocationFiles.remove({_id: locationFileId});
        }
    }

    importUserConfiguration(userConfiguration, locationId, userId){

        if (Meteor.isServer) {

            const userTestTypeLocationId = UserTestTypeLocations.insert(
                {
                    locationId:             locationId,
                    locationName:           userConfiguration.locationName,
                    locationType:           userConfiguration.locationType,
                    userId:                 userId,
                    isUnitLocation:         userConfiguration.isUnitLocation,
                    isIntLocation:          userConfiguration.isIntLocation,
                    isAccLocation:          userConfiguration.isAccLocation
                }
            );

            return userTestTypeLocationId;
        }
    }

    // Save the test output configuration for a specific user / role
    saveUserConfiguration(userConfiguration){

        if (Meteor.isServer) {

            UserTestTypeLocations.update(
                {_id: userConfiguration._id},
                {
                    $set: {
                        isUnitLocation:         userConfiguration.isUnitLocation,
                        isIntLocation:          userConfiguration.isIntLocation,
                        isAccLocation:          userConfiguration.isAccLocation
                    }
                }
            );
        }
    }

    updateUserConfiguration(userId){

        log((msg) => console.log(msg), LogLevel.TRACE, "Updating user config for user {}", userId);

        // Make sure config contains all the possible locations for this user
        // Either is is Shared or it belongs to the current user...
        const testOutputLocations = TestOutputLocations.find({
            $or:[{locationIsShared: true}, {locationUserId: userId}]
        }).fetch();

        let userLocation = null;

        testOutputLocations.forEach((location) => {

            log((msg) => console.log(msg), LogLevel.TRACE, "Checking location {}", location.locationName);

            userLocation = UserTestTypeLocations.findOne({
                locationId: location._id,
                userId: userId
            });

            // If not found add it in for the current user / role
            if(!userLocation){

                log((msg) => console.log(msg), LogLevel.TRACE, "Adding user location {}", location.locationName);

                UserTestTypeLocations.insert({
                    locationId:             location._id,
                    locationName:           location.locationName,
                    locationType:           location.locationType,
                    userId:                 userId
                });
            } else {

                // Make sure the denormalised details are updated
                UserTestTypeLocations.update(
                    {
                        locationId: location._id,
                        userId: userId
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

        // And remove any locations that have been removed or changed to private
        const userTestLocations = UserTestTypeLocations.find({
            userId: userId
        }).fetch();

        let testLocation = null;
        let locationsToRemove = [];


        userTestLocations.forEach((userLocation) => {

            // Find locations that are shared or owned by current user
            testLocation = TestOutputLocations.findOne({
                _id:                userLocation.locationId,
                $or:[{locationIsShared: true}, {locationUserId: userId}]
            });

            if(!testLocation){
                log((msg) => console.log(msg), LogLevel.TRACE, "Removing user location {}", userLocation._id);
                locationsToRemove.push(userLocation._id)
            }
        });

        locationsToRemove.forEach((userLocationId) => {
            UserTestTypeLocations.remove({
                _id: userLocationId
            });
        });
    }
}

export default new TestOutputLocationServices();