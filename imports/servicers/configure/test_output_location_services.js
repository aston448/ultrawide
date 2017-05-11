import fs from 'fs';

// Ultrawide Collections
import { AppGlobalData }            from '../../collections/app/app_global_data.js';
import { TestOutputLocations }      from '../../collections/configure/test_output_locations.js'
import { TestOutputLocationFiles }  from '../../collections/configure/test_output_location_files.js'
import { UserTestTypeLocations }    from '../../collections/configure/user_test_type_locations.js';


// Ultrawide Services
import { log, getDateTimeString} from '../../common/utils.js';
import { TestLocationType, TestLocationFileStatus, LogLevel} from '../../constants/constants.js';
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
                    // locationServerName:     location.locationServerName,
                    // serverLogin:            location.serverLogin,
                    // serverPassword:         location.serverPassword,
                    locationPath:           location.locationPath,
                    locationFullPath:       location.locationFullPath
                }
            );

            return locationId;
        }

    }

    // Save details from the location edit form
    saveLocation(location) {

        if (Meteor.isServer) {


            // See if the existing location directory exists
            const currentLocation = TestOutputLocations.findOne({
                _id: location._id
            });

            if(currentLocation){

                if(fs.existsSync(currentLocation.locationFullPath)){

                    // Update existing DIR if path is changing - it should not be possible to rename to another existing path
                    if(currentLocation.locationPath !== location.locationPath){

                        // Need to rename the actual DIR
                        if(location.locationFullPath !== 'NONE') {

                            log((msg) => console.log(msg), LogLevel.DEBUG, "Renaming DIR from {} to {}", currentLocation.locationFullPath, location.locationFullPath);

                            fs.renameSync(currentLocation.locationFullPath, location.locationFullPath)
                        }
                    }
                } else {

                    if(location.locationFullPath !== 'NONE') {

                        // Check that not created for a different location either
                        if(!fs.existsSync(location.locationFullPath)) {

                            log((msg) => console.log(msg), LogLevel.DEBUG, "Creating DIR {}", location.locationFullPath);

                            // Need to create the actual DIR
                            fs.mkdirSync(location.locationFullPath);

                        }
                    }
                }
            }


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
                        // locationServerName:     location.locationServerName,
                        // serverLogin:            location.serverLogin,
                        // serverPassword:         location.serverPassword,
                        locationPath:           location.locationPath,
                        locationFullPath:       location.locationFullPath
                    }
                }
            );
        }
    };

    // Remove a location
    removeLocation(locationId) {

        if (Meteor.isServer) {

            const location = TestOutputLocations.findOne({
                _id: locationId
            });

            const result = TestOutputLocations.remove({_id: locationId});

            if(result > 0){
                // Remove all the files related to this location
                TestOutputLocationFiles.remove({locationId: locationId});

                // And any user config related to it as well
                UserTestTypeLocations.remove({locationId: locationId});
            }

            // And remove the associated DIR on the server
            if(fs.existsSync(location.locationFullPath)){
                fs.rmdirSync(location.locationFullPath);
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
    };

    uploadTestResultsFile(blob, name, locationName, encoding){

        if(Meteor.isServer){

            const location = TestOutputLocations.findOne({
                locationName:   locationName
            });

            if(!location){
                throw new Meteor.Error('TEST_UPLOAD_FAIL', 'Invalid location name: ' + locationName);
            }

            if(location.locationFullPath === 'NONE' || location.locationPath === 'NONE'){
                throw new Meteor.Error('TEST_UPLOAD_FAIL', 'Invalid location path: ' + location.locationFullPath);
            }

            fs.writeFileSync(location.locationFullPath + name, blob, encoding);

            this.updateResultsFileStatuses(location);
        }
    };

    updateResultsFileStatuses(location){

        // Set all location files as not uploaded
        TestOutputLocationFiles.update(
            {locationId: location._id},
            {
                $set: {
                    fileStatus:     TestLocationFileStatus.FILE_NOT_UPLOADED,
                    lastUpdated:    ''
                }
            },
            {multi: true}
        );

        // Get a list of files at the location
        const files = fs.readdirSync(location.locationFullPath);

        // And set any matching location files as uploaded
        files.forEach((file) => {

            // Get the file details for the last modified date
            const stats = fs.statSync(location.locationFullPath + file);
            const modifiedDate = new Date(stats.mtime);
            const dateString = getDateTimeString(modifiedDate);

            TestOutputLocationFiles.update(
                {
                    locationId: location._id,
                    fileName:   file
                },
                {
                    $set: {
                        fileStatus:     TestLocationFileStatus.FILE_UPLOADED,
                        lastUpdated:    dateString
                    }
                }
            );
        });

    }
}

export default new TestOutputLocationServices();