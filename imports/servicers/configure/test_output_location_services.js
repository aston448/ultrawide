
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
            TestOutputLocations.insert(
                {
                    locationName:           DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME,
                    locationType:           TestLocationType.SHARED
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
                    userRole:               userConfiguration.userRole,
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
            if(!userLocation && (location.locationType === TestLocationType.SHARED || location.locationUserId === userId)){

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