import fs from 'fs';

// Ultrawide Collections
import { AppGlobalData }            from '../../collections/app/app_global_data.js';
import { TestOutputLocations }      from '../../collections/configure/test_output_locations.js'
import { TestOutputLocationFiles }  from '../../collections/configure/test_output_location_files.js'
import { UserTestTypeLocations }    from '../../collections/configure/user_test_type_locations.js';


// Ultrawide Services
import { log, getDateTimeString} from '../../common/utils.js';
import { TestLocationType, TestLocationFileStatus, UltrawideDirectory, LogLevel} from '../../constants/constants.js';
import { DefaultLocationText } from '../../constants/default_names.js';

import ImpexModules                 from '../../service_modules/administration/impex_service_modules.js';

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
                    locationIsShared:       location.locationIsShared,
                    locationUserId:         userId,
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

                // If just the final dir in the path is changing for a dir that exists we can rename it
                if(fs.existsSync(currentLocation.locationFullPath)){

                    // Update existing DIR if path is changing - it should not be possible to rename to another existing path
                    if(currentLocation.locationPath !== location.locationPath){

                        const currentDirs = currentLocation.locationPath.split('/');
                        const newDirs = location.locationPath.split('/');
                        const currentLength = currentDirs.length;
                        const newLength = newDirs.length;

                        if(currentLength === newLength){

                            if(newLength === 1){
                                // Just one dir so update it
                                log((msg) => console.log(msg), LogLevel.DEBUG, "Renaming DIR from {} to {}", currentLocation.locationFullPath, location.locationFullPath);

                                fs.renameSync(currentLocation.locationFullPath, location.locationFullPath);
                            } else {

                                let parentsSame = true;

                                // Possible that just last has changed
                                for(let i = 0; i < newLength -2; i++){
                                    log((msg) => console.log(msg), LogLevel.DEBUG, "Comparing old DIR {} to new DIR {}", currentDirs[i], newDirs[i]);
                                    if(currentDirs[i] !== newDirs[i]){
                                        parentsSame = false;
                                    }
                                }

                                if(parentsSame){
                                    // Just last dir has changed so rename it
                                    log((msg) => console.log(msg), LogLevel.DEBUG, "Renaming DIR from {} to {}", currentLocation.locationFullPath, location.locationFullPath);

                                    fs.renameSync(currentLocation.locationFullPath, location.locationFullPath);
                                } else {

                                    // There is a change and its a new path so remove the old and create the new dir(s)
                                    this.removeOldPathDirs(currentLocation.locationPath);

                                    this.createPathDirs(location.locationPath);
                                }
                            }

                        } else {

                             // Must be creating a new dir so to be safe, remove old and create new
                            this.removeOldPathDirs(currentLocation.locationPath);

                            this.createPathDirs(location.locationPath);
                        }
                    }
                } else {

                    if(location.locationFullPath !== 'NONE') {

                        // Check that not created for a different location either
                        if(!fs.existsSync(location.locationFullPath)) {

                            log((msg) => console.log(msg), LogLevel.DEBUG, "Creating DIR(s) for {}", location.locationFullPath);

                            // Need to create the actual DIR or DIRs
                            this.createPathDirs(location.locationPath)

                        }
                    }
                }
            }


            TestOutputLocations.update(
                {_id: location._id},
                {
                    $set: {
                        locationName:           location.locationName,
                        locationIsShared:       location.locationIsShared,
                        locationUserId:         location.locationUserId,
                        locationPath:           location.locationPath,
                        locationFullPath:       location.locationFullPath
                    }
                }
            );
        }
    };

    createPathDirs(newPath){

        let newDirs = newPath.split('/');

        // Get the base path
        let basePath = ImpexModules.getDataDirectory() + UltrawideDirectory.TEST_OUTPUT_DIR;

        newDirs.forEach((dir) => {

            if(dir.length > 0) {

                let dirName = dir + '/';

                if(!fs.existsSync(basePath + dirName)) {
                    log((msg) => console.log(msg), LogLevel.DEBUG, "  Creating DIR {}", basePath + dirName);
                    fs.mkdirSync(basePath + dirName);
                }

                // Update the base path
                basePath = basePath + dirName;
            }
        });
    }

    removeOldPathDirs(oldPath){

        log((msg) => console.log(msg), LogLevel.DEBUG, "Removing DIR(s) {}", oldPath);

        let oldDirs = oldPath.split('/');
        let dirsCount = oldDirs.length;

        // Get the base path
        let basePath = ImpexModules.getDataDirectory() + UltrawideDirectory.TEST_OUTPUT_DIR;

        log((msg) => console.log(msg), LogLevel.DEBUG, "  DIRs count {}", dirsCount);

        // Go from max dir in path downwards
        for(let i = dirsCount; i > 0; i--){

            // Build the actual path
            let path = basePath;
            for(let j = 0; j < i -1; j++){
                path = path + oldDirs[j] + '/';
            }

            log((msg) => console.log(msg), LogLevel.DEBUG, "  DIR to remove {}", path);

            // And remove it
            if(path !== basePath && fs.existsSync(path)){
                // When running on Mac there could be .DS_Store files - remove them first to prevent errors
                if(fs.existsSync(path + '.DS_Store')){
                    log((msg) => console.log(msg), LogLevel.DEBUG, "  Removing .DS_Store file");
                    fs.unlinkSync(path + '.DS_Store');
                }
                log((msg) => console.log(msg), LogLevel.DEBUG, "  Removing DIR {}", path);
                fs.rmdirSync(path);
            }

        }
    }

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
                this.removeOldPathDirs(location.locationPath);
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

    importLocationFile(locationFile, locationId){

        if (Meteor.isServer) {

            const locationFileId = TestOutputLocationFiles.insert(
                {
                    locationId:             locationId,
                    fileAlias:              locationFile.fileAlias,
                    fileDescription:        locationFile.fileDescription,
                    fileType:               locationFile.fileType,
                    testRunner:             locationFile.testRunner,
                    fileName:               locationFile.fileName,
                    allFilesOfType:         locationFile.allFilesOfType,
                    fileStatus:             locationFile.fileStatus,
                    lastUpdated:            locationFile.lastUpdated
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
                        allFilesOfType:         locationFile.allFilesOfType,
                        fileStatus:             TestLocationFileStatus.FILE_NOT_UPLOADED
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

            console.log("Writing file: " + location.locationFullPath + name);

            let text = JSON.stringify(blob, null, 2);

            fs.writeFileSync(location.locationFullPath + name, text, 'utf8');

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


            TestOutputLocationFiles.update(
                {
                    locationId: location._id,
                    fileName:   file
                },
                {
                    $set: {
                        fileStatus:     TestLocationFileStatus.FILE_UPLOADED,
                        lastUpdated:    modifiedDate
                    }
                }
            );
        });

    }
}

export default new TestOutputLocationServices();