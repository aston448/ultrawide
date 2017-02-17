import { Meteor } from 'meteor/meteor';

import { TestOutputLocations }      from '../../imports/collections/configure/test_output_locations.js'
import { TestOutputLocationFiles }  from '../../imports/collections/configure/test_output_location_files.js'
import { UserTestTypeLocations }    from '../../imports/collections/configure/user_test_type_locations.js';

Meteor.methods({

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
                        if(location.isShared === locationDetails.isShared){
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
                            throw new Meteor.Error("FAIL", "Expecting location is shared " + locationDetails.isShared + " but got " + location.isShared);
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

});
