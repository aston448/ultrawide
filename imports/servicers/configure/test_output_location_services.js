import fs from 'fs';

// Ultrawide Services
import { log } from '../../common/utils.js';
import { TestLocationFileStatus, UltrawideDirectory, LogLevel} from '../../constants/constants.js';

import ImpexModules                     from '../../service_modules/administration/impex_service_modules.js';

// Data Access
import { UserTestTypeLocationData }         from '../../data/configure/user_test_type_location_db.js';
import { TestOutputLocationData }           from '../../data/configure/test_output_location_db.js';
import TestOutputLocationFileData       from '../../data/configure/test_output_location_file_db.js';

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
            TestOutputLocationData.insertNewOutputLocation(userId);
        }

    };

    // Save details from the location edit form
    saveLocation(location) {

        if (Meteor.isServer) {


            // See if the existing location directory exists
            const currentLocation = TestOutputLocationData.getOutputLocationById(location._id);

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


            TestOutputLocationData.updateOutputLocation(location._id, location);
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

            const location = TestOutputLocationData.getOutputLocationById(locationId);

            const result = TestOutputLocationData.removeOutputLocation(locationId);

            if(result > 0){
                // Remove all the files related to this location
                TestOutputLocationFileData.removeAllFilesForLocation(locationId);

                // And any user config related to it as well
                UserTestTypeLocationData.removeUserTestTypeLocations(locationId);
            }

            // And remove the associated DIR on the server
            if(fs.existsSync(location.locationFullPath)){
                this.removeOldPathDirs(location.locationPath);
            }
        }
    };

    addLocationFile(locationId){

        if (Meteor.isServer) {

            TestOutputLocationFileData.addNewLocationFile(locationId);
        }
    };

    saveLocationFile(locationFile){

        if (Meteor.isServer) {

            TestOutputLocationFileData.saveLocationFileDetails(locationFile);
        }
    };

    removeLocationFile(locationFileId){

        if (Meteor.isServer) {

            TestOutputLocationFileData.removeLocationFile(locationFileId);
        }
    }

    // Save the test output configuration for a specific user / role
    saveUserConfiguration(userConfiguration){

        if (Meteor.isServer) {

            UserTestTypeLocationData.saveUserTestTypeLocation(userConfiguration);
        }
    }

    updateUserConfiguration(userId){

        log((msg) => console.log(msg), LogLevel.TRACE, "Updating user config for user {}", userId);

        // Make sure config contains all the possible locations for this user
        // Either is is Shared or it belongs to the current user...
        const testOutputLocations = TestOutputLocationData.getAllUserLocations(userId)

        let userLocation = null;

        testOutputLocations.forEach((location) => {

            log((msg) => console.log(msg), LogLevel.TRACE, "Checking location {}", location.locationName);

            userLocation = UserTestTypeLocationData.getUserLocationById(userId, location._id);

            // If not found add it in for the current user / role
            if(!userLocation){

                log((msg) => console.log(msg), LogLevel.TRACE, "Adding user location {}", location.locationName);

                UserTestTypeLocationData.insertNewUserTestTypeLocation(location, userId);
            } else {

                // Make sure the denormalised details are updated
                UserTestTypeLocationData.updateUserTestTypeLocationName(location, userId);
            }
        });

        // And remove any locations that have been removed or changed to private
        const userTestLocations = UserTestTypeLocationData.getUserTestTypeLocations(userId);

        let testLocation = null;
        let locationsToRemove = [];


        userTestLocations.forEach((userLocation) => {

            // Find locations that are shared or owned by current user
            testLocation = TestOutputLocationData.getUserOutputLocationById(userLocation.locationId, userId);

            if(!testLocation){
                log((msg) => console.log(msg), LogLevel.TRACE, "Removing user location {}", userLocation._id);
                locationsToRemove.push(userLocation._id)
            }
        });

        locationsToRemove.forEach((userLocationId) => {
            UserTestTypeLocationData.removeUserTestTypeLocations(userLocationId);
        });
    };

    uploadTestResultsFile(blob, name, locationName) {

        if(Meteor.isServer){

            const location = TestOutputLocationData.getOutputLocationByName(locationName);

            if(!location){
                throw new Meteor.Error('TEST_UPLOAD_FAIL', 'Invalid location name: ' + locationName);
            }

            if(location.locationFullPath === 'NONE' || location.locationPath === 'NONE'){
                throw new Meteor.Error('TEST_UPLOAD_FAIL', 'Invalid location path: ' + location.locationFullPath);
            }

            let fileText = '';

            // This is a string if uploaded locally and a json object if remote from CI
            if(typeof blob === "string"){
                console.log("Writing file as string... " );
                fileText = blob;
            } else {
                console.log("Stringify blob... " );
                fileText = JSON.stringify(blob, null, 2);
            }

            console.log("Writing file: " + location.locationFullPath + name + "\n" + fileText.substring(1,100));

            fs.writeFileSync(location.locationFullPath + name, fileText, 'utf8');

            this.updateResultsFileStatuses(location);
        }
    };

    updateResultsFileStatuses(location){

        // Set all location files as not uploaded
        TestOutputLocationFileData.resetAllLocationFilesStatus(location._id);

        // Get a list of files at the location
        const files = fs.readdirSync(location.locationFullPath);

        // And set any matching location files as uploaded
        files.forEach((file) => {

            // Get the file details for the last modified date
            const stats = fs.statSync(location.locationFullPath + file);
            const modifiedDate = new Date(stats.mtime);


            TestOutputLocationFileData.setLocationFileStatus(location._id, file, TestLocationFileStatus.FILE_UPLOADED, modifiedDate);
        });

    }
}

export default new TestOutputLocationServices();