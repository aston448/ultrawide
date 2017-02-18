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

            if(location.locationName === locationDetails.locationName){
                if(location.locationType === locationDetails.locationType){
                    if(location.locationAccessType === locationDetails.locationAccessType){
                        if(location.locationIsShared === locationDetails.locationIsShared){
                            if(location.locationServerName === locationDetails.locationServerName){
                                if(location.serverLogin === locationDetails.serverLogin){
                                    if(location.serverPassword === locationDetails.serverPassword){
                                        if(location.locationPath === locationDetails.locationPath){
                                            return true;
                                        } else {
                                            throw new Meteor.Error("FAIL", "Expecting location server password " + locationDetails.locationPath + " but got " + location.locationPath);
                                        }
                                    } else {
                                        throw new Meteor.Error("FAIL", "Expecting location server password " + locationDetails.serverPassword + " but got " + location.serverPassword);
                                    }
                                } else {
                                    throw new Meteor.Error("FAIL", "Expecting location server login " + locationDetails.serverLogin + " but got " + location.serverLogin);
                                }
                            } else {
                                throw new Meteor.Error("FAIL", "Expecting location server name " + locationDetails.locationServerName + " but got " + location.locationServerName);
                            }
                        } else {
                            throw new Meteor.Error("FAIL", "Expecting location is shared " + locationDetails.locationIsShared + " but got " + location.locationIsShared);
                        }
                    } else {
                        throw new Meteor.Error("FAIL", "Expecting location access type " + locationDetails.locationAccessType + " but got " + location.locationAccessType);
                    }
                } else {
                    throw new Meteor.Error("FAIL", "Expecting location type " + locationDetails.locationType + " but got " + location.locationType);
                }
            } else {
                throw new Meteor.Error("FAIL", "Expecting location name " + locationDetails.locationName + " but got " + location.locationName);
            }
        }
    },

    // LOCATION FILES --------------------------------------------------------------------------------------------------


    // USER CONFIG -----------------------------------------------------------------------------------------------------

    'verifyTestOutputLocations.userConfigIncludesLocation'(locationName, userName, userRole){

        const userContext = TestDataHelpers.getUserContext(userName);

        const locationConfig = UserTestTypeLocations.findOne({
            userId:         userContext.userId,
            userRole:       userRole,
            locationName:   locationName
        });

        if(locationConfig){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Test Config for Location " + locationName + " does not exist for user " + userName + " with role " + userRole);
        }
    },

    'verifyTestOutputLocations.userConfigDoesNotIncludeLocation'(locationName, userName, userRole){

        const userContext = TestDataHelpers.getUserContext(userName);

        const locationConfig = UserTestTypeLocations.findOne({
            userId:         userContext.userId,
            userRole:       userRole,
            locationName:   locationName
        });

        if(locationConfig){
            throw new Meteor.Error("FAIL", "Test Config for Location " + locationName + " EXISTS for user " + userName + " with role " + userRole);
        } else {
            return true;
        }
    },

    'verifyTestOutputLocations.userConfigDetailsAre'(locationName, userName, userRole, configDetails){

        const userContext = TestDataHelpers.getUserContext(userName);

        const userTestTypeLocation = UserTestTypeLocations.findOne({
            userId: userContext.userId,
            userRole: userRole,
            locationName: locationName
        });

        if(!userTestTypeLocation){
            throw new Meteor.Error("FAIL", "Test Config for Location " + locationName + " does not exist for user " + userName + " with role " + userRole);
        } else {
            // OK we know the ame was OK...
            if(userTestTypeLocation.locationType === configDetails.locationType){
                if(userTestTypeLocation.isUnitLocation === configDetails.isUnitLocation){
                    if(userTestTypeLocation.isIntLocation === configDetails.isIntLocation){
                        if(userTestTypeLocation.isAccLocation === configDetails.isAccLocation){
                            return true;
                        } else {
                            throw new Meteor.Error("FAIL", "Expecting config " + locationName + " to have Acc flag " + configDetails.isAccLocation + " but got " + userTestTypeLocation.isAccLocation + "  for user " + userName + " with role " + userRole);
                        }
                    } else {
                        throw new Meteor.Error("FAIL", "Expecting config " + locationName + " to have Int flag " + configDetails.isIntLocation + " but got " + userTestTypeLocation.isIntLocation + "  for user " + userName + " with role " + userRole);
                    }
                } else {
                    throw new Meteor.Error("FAIL", "Expecting config " + locationName + " to have Unit flag " + configDetails.isUnitLocation + " but got " + userTestTypeLocation.isUnitLocation + "  for user " + userName + " with role " + userRole);
                }
            } else {
                throw new Meteor.Error("FAIL", "Expecting config " + locationName + " to have location type " + configDetails.locationType + " but got " + userTestTypeLocation.locationType + "  for user " + userName + " with role " + userRole);
            }
        }

    }

});
