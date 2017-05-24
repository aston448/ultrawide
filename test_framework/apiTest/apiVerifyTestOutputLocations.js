import fs from 'fs';

import { Meteor } from 'meteor/meteor';

import { TestOutputLocations }      from '../../imports/collections/configure/test_output_locations.js'
import { TestOutputLocationFiles }  from '../../imports/collections/configure/test_output_location_files.js'
import { UserTestTypeLocations }    from '../../imports/collections/configure/user_test_type_locations.js';

import TestDataHelpers              from '../test_modules/test_data_helpers.js'



Meteor.methods({

    // LOCATIONS -------------------------------------------------------------------------------------------------------

    'verifyTestOutputLocations.locationExistsCalled'(locationName){

        const location = TestOutputLocations.findOne({locationName: locationName});

        if(!location){
            throw new Meteor.Error("FAIL", "No Test Output Location exists called " + locationName);
        }
    },

    'verifyTestOutputLocations.locationDoesNotExistCalled'(locationName){

        const location = TestOutputLocations.findOne({locationName: locationName});

        if(location){
            throw new Meteor.Error("FAIL", "A Test Output Location exists called " + locationName);
        }
    },

    'verifyTestOutputLocations.locationDetailsAre'(locationName, locationDetails){

        const location = TestOutputLocations.findOne({locationName: locationName});

        if(!location){
            throw new Meteor.Error("FAIL", "No Test Output Location exists called " + locationName);
        } else {

            // Already know name is OK...
            if(location.locationIsShared === locationDetails.locationIsShared){
                if(location.locationPath === locationDetails.locationPath){
                    return true;
                } else {
                    throw new Meteor.Error("FAIL", "Expecting location server password " + locationDetails.locationPath + " but got " + location.locationPath + " for location " + locationName);
                }
            } else {
                throw new Meteor.Error("FAIL", "Expecting location is shared " + locationDetails.locationIsShared + " but got " + location.locationIsShared + " for location " + locationName);
            }
        }
    },

    'verifyTestOutputLocations.locationDirectoryExists'(directoryName){

        const basePath = TestDataHelpers.getTestOutputDir();
        const dir = basePath + directoryName;

        if(fs.existsSync(dir)){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Directory " + dir +  " does not exist");
        }
    },

    'verifyTestOutputLocations.locationDirectoryDoesNotExist'(directoryName){

        const basePath = TestDataHelpers.getTestOutputDir();
        const dir = basePath + directoryName;

        if(fs.existsSync(dir)){
            throw new Meteor.Error("FAIL", "Directory " + dir +  " was found!");
        } else {
            return true;
        }
    },

    // LOCATION FILES --------------------------------------------------------------------------------------------------

    'verifyTestOutputLocations.locationHasFile'(locationName, fileAlias){

        const location = TestDataHelpers.getTestOutputLocation(locationName);

        const locationFile = TestOutputLocationFiles.findOne({
            locationId: location._id,
            fileAlias: fileAlias
        });

        if(locationFile){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "No Test Output Location File exists called " + fileAlias + " for Location " + locationName);
        }
    },

    'verifyTestOutputLocations.locationDoesNotHaveFile'(locationName, fileAlias){

        const location = TestDataHelpers.getTestOutputLocation(locationName);

        const locationFile = TestOutputLocationFiles.findOne({
            locationId: location._id,
            fileAlias: fileAlias
        });

        if(locationFile){
            throw new Meteor.Error("FAIL", "Test Output Location File EXISTS called " + fileAlias + " for Location " + locationName);
        } else {
            return true;
        }
    },

    'verifyTestOutputLocations.fileDoesNotExistWithAlias'(fileAlias){
        // Used to confirm no file when location removed.  Must not have other locations with same alias in this test

        const locationFile = TestOutputLocationFiles.findOne({
            fileAlias: fileAlias
        });

        if(locationFile){
            throw new Meteor.Error("FAIL", "Test Output Location File EXISTS called " + fileAlias);
        } else {
            return true;
        }

    },

    'verifyTestOutputLocations.locationFileDetailsAre'(locationName, fileAlias, fileDetails){

        const location = TestDataHelpers.getTestOutputLocation(locationName);

        const locationFile = TestOutputLocationFiles.findOne({
            locationId: location._id,
            fileAlias: fileAlias
        });

        if(locationFile){

            // We already know the alias is as expected...
            if(locationFile.fileType === fileDetails.fileType){
                if(locationFile.testRunner === fileDetails.testRunner){
                    if(locationFile.fileName === fileDetails.fileName){
                        if(locationFile.allFilesOfType === fileDetails.allFilesOfType){
                            return true;
                        } else {
                            throw new Meteor.Error("FAIL", "Expecting file wildcard " + fileDetails.allFilesOfType + " but got " + locationFile.allFilesOfType + " for file " + fileAlias);
                        }
                    } else {
                        throw new Meteor.Error("FAIL", "Expecting file name " + fileDetails.fileName + " but got " + locationFile.fileName + " for file " + fileAlias);
                    }
                } else {
                    throw new Meteor.Error("FAIL", "Expecting test runner " + fileDetails.testRunner + " but got " + locationFile.testRunner + " for file " + fileAlias);
                }
            } else {
                throw new Meteor.Error("FAIL", "Expecting file type " + fileDetails.fileType + " but got " + locationFile.fileType + " for file " + fileAlias);
            }

        } else {
            throw new Meteor.Error("FAIL", "No Test Output Location File exists called " + fileAlias + " for Location " + locationName);
        }
    },

    // USER CONFIG -----------------------------------------------------------------------------------------------------

    'verifyTestOutputLocations.userConfigIncludesLocation'(locationName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const locationConfig = UserTestTypeLocations.findOne({
            userId:         userContext.userId,
            locationName:   locationName
        });

        if(locationConfig){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Test Config for Location " + locationName + " does not exist for user " + userName);
        }
    },

    'verifyTestOutputLocations.userConfigDoesNotIncludeLocation'(locationName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const locationConfig = UserTestTypeLocations.findOne({
            userId:         userContext.userId,
            locationName:   locationName
        });

        if(locationConfig){
            throw new Meteor.Error("FAIL", "Test Config for Location " + locationName + " EXISTS for user " + userName);
        } else {
            return true;
        }
    },

    'verifyTestOutputLocations.userConfigDetailsAre'(locationName, userName, configDetails){

        const userContext = TestDataHelpers.getUserContext(userName);

        const userTestTypeLocation = UserTestTypeLocations.findOne({
            userId: userContext.userId,
            locationName: locationName
        });

        if(!userTestTypeLocation){
            throw new Meteor.Error("FAIL", "Test Config for Location " + locationName + " does not exist for user " + userName);
        } else {
            // OK we know the name was OK...
            if(userTestTypeLocation.locationType === configDetails.locationType){
                if(userTestTypeLocation.isUnitLocation === configDetails.isUnitLocation){
                    if(userTestTypeLocation.isIntLocation === configDetails.isIntLocation){
                        if(userTestTypeLocation.isAccLocation === configDetails.isAccLocation){
                            return true;
                        } else {
                            throw new Meteor.Error("FAIL", "Expecting config " + locationName + " to have Acc flag " + configDetails.isAccLocation + " but got " + userTestTypeLocation.isAccLocation + "  for user " + userName);
                        }
                    } else {
                        throw new Meteor.Error("FAIL", "Expecting config " + locationName + " to have Int flag " + configDetails.isIntLocation + " but got " + userTestTypeLocation.isIntLocation + "  for user " + userName);
                    }
                } else {
                    throw new Meteor.Error("FAIL", "Expecting config " + locationName + " to have Unit flag " + configDetails.isUnitLocation + " but got " + userTestTypeLocation.isUnitLocation + "  for user " + userName);
                }
            } else {
                throw new Meteor.Error("FAIL", "Expecting config " + locationName + " to have location type " + configDetails.locationType + " but got " + userTestTypeLocation.locationType + "  for user " + userName);
            }
        }

    }

});
