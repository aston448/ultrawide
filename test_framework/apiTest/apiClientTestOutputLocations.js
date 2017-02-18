import { Meteor } from 'meteor/meteor';

import ClientTestOutputLocationServices from '../../imports/apiClient/apiClientTestOutputLocations';

import TestDataHelpers                  from '../test_modules/test_data_helpers.js'

import {RoleType} from '../../imports/constants/constants.js';

Meteor.methods({

    // LOCATIONS -------------------------------------------------------------------------------------------------------

    'testOutputLocations.addNewLocation'(role, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const outcome = ClientTestOutputLocationServices.addLocation(role);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Add Output Location');
    },

    'testOutputLocations.removeLocation'(role, locationName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const location = TestDataHelpers.getTestOutputLocation(locationName);

        const outcome = ClientTestOutputLocationServices.removeLocation(role, location._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Remove Output Location');
    },

    'testOutputLocations.saveLocation'(role, locationName, newLocation, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        let location = TestDataHelpers.getTestOutputLocation(locationName);

        location.locationName = newLocation.locationName;
        location.locationType = newLocation.locationType;
        location.locationAccessType = newLocation.locationAccessType;
        location.locationIsShared = newLocation.locationIsShared;
        location.locationServerName = newLocation.locationServerName;
        location.serverLogin = newLocation.serverLogin;
        location.serverPassword = newLocation.serverPassword;
        location.locationPath = newLocation.locationPath;

        const outcome = ClientTestOutputLocationServices.saveLocation(role, location);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Save Output Location');
    },

    'testOutPutLocations.setLocationShared'(role, locationName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        let location = TestDataHelpers.getTestOutputLocation(locationName);
        location.locationIsShared = true;

        const outcome = ClientTestOutputLocationServices.saveLocation(role, location);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Set Location Shared');
    },

    'testOutPutLocations.setLocationPrivate'(role, locationName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        let location = TestDataHelpers.getTestOutputLocation(locationName);
        location.locationIsShared = false;

        const outcome = ClientTestOutputLocationServices.saveLocation(role, location);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Set Location Private');
    },

    // LOCATION FILES --------------------------------------------------------------------------------------------------

    'testOutputLocations.addNewLocationFile'(role, locationName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const location = TestDataHelpers.getTestOutputLocation(locationName);

        const outcome = ClientTestOutputLocationServices.addLocationFile(role, location._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Add Output Location File');
    },

    'testOutputLocations.removeLocationFile'(role, locationName, fileAlias, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const locationFile = TestDataHelpers.getTestOutputLocationFile(locationName, fileAlias);

        const outcome = ClientTestOutputLocationServices.removeLocationFile(role, locationFile._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Remove Output Location File');
    },

    'testOutputLocations.saveLocationFile'(role, locationName, fileAlias, newFile, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        let file = TestDataHelpers.getTestOutputLocationFile(locationName, fileAlias);

        file.fileAlias = newFile.fileAlias;
        file.fileType = newFile.fileType;
        file.testRunner = newFile.testRunner;
        file.fileName = newFile.fileName;
        file.allFilesOfType = newFile.allFilesOfType;

        const outcome = ClientTestOutputLocationServices.saveLocationFile(role, file);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Save Output Location File');
    },

    // USER CONFIG -----------------------------------------------------------------------------------------------------

    'testOutputLocations.editUserTestLocationConfig'(userName, role, expectation) {

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);

        // This is what is called when user goes to config screen to refresh their data
        const outcome = ClientTestOutputLocationServices.updateUserConfiguration(userContext.userId, role);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Save Output Location File');
    }
});
