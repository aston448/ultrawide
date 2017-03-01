
import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
import OutputLocationsActions           from '../../test_framework/test_wrappers/output_locations_actions.js';
import OutputLocationsVerifications     from '../../test_framework/test_wrappers/output_locations_verifications.js';
import {DefaultLocationText} from '../../imports/constants/default_names.js';
import {TestOutputLocationFileValidationErrors}   from '../../imports/constants/validation_errors.js';
import {TestLocationType, TestLocationAccessType, TestLocationFileType, TestRunner} from '../../imports/constants/constants.js';

describe('UC 844 - Edit Test Output Location File', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 844 - Edit Test Output Location File');
    });

    after(function(){

    });

    beforeEach(function(){

        // Don't need any design data for these tests
        TestFixtures.clearAllData();

        // Add a new location
        OutputLocationsActions.developerAddsNewLocation();
    });

    afterEach(function(){

    });


    // Actions
    it('A Developer can update and save the properties of a Test Output File', function(){

        const defaultFile = {
            fileAlias:      DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS,
            fileType:       TestLocationFileType.NONE,
            testRunner:     TestRunner.NONE,
            fileName:       DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_NAME,
            allFilesOfType: 'NONE'
        };

        const newFile = {
            fileAlias:      'FileAlias1',
            fileType:       TestLocationFileType.UNIT,
            testRunner:     TestRunner.METEOR_MOCHA,
            fileName:       'FileName1.mocha',
            allFilesOfType: '*.mocha'
        };

        // Setup - Add a file to the Location
        OutputLocationsActions.developerAddsFileToLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME);
        // Check default properties
        expect(OutputLocationsVerifications.locationFile_ForLocation_HasDetails(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, defaultFile));

        // Execute
        OutputLocationsActions.developerSavesLocationFile(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS, newFile);

        // Verify
        expect(OutputLocationsVerifications.locationFile_ForLocation_HasDetails('FileAlias1', DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, newFile));

    });


    // Conditions
    it('Only a Developer can update a Test Output File', function(){

        const defaultFile = {
            fileAlias:      DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS,
            fileType:       TestLocationFileType.NONE,
            testRunner:     TestRunner.NONE,
            fileName:       DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_NAME,
            allFilesOfType: 'NONE'
        };

        const newFile = {
            fileAlias:      'FileAlias1',
            fileType:       TestLocationFileType.UNIT,
            testRunner:     TestRunner.METEOR_MOCHA,
            fileName:       'FileName1.mocha',
            allFilesOfType: '*.mocha'
        };

        // Setup - Add a file to the Location
        OutputLocationsActions.developerAddsFileToLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME);
        // Check default properties
        expect(OutputLocationsVerifications.locationFile_ForLocation_HasDetails(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, defaultFile));

        // Execute - Designer
        const expectation = {success: false, message: TestOutputLocationFileValidationErrors.LOCATION_FILE_INVALID_ROLE_SAVE};
        OutputLocationsActions.designerSavesLocationFile(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS, newFile, expectation);

        // Verify not changed
        expect(OutputLocationsVerifications.locationFile_ForLocation_HasDetails(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, defaultFile));

        // Execute - Manager - same expectation
        OutputLocationsActions.managerSavesLocationFile(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS, newFile, expectation);

        // Verify not changed
        expect(OutputLocationsVerifications.locationFile_ForLocation_HasDetails(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, defaultFile));

    });

    it('A Test Output File may not be given the same name as an existing Test Output File for the Test Output Location', function(){

        const defaultFile = {
            fileAlias:      DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS,
            fileType:       TestLocationFileType.NONE,
            testRunner:     TestRunner.NONE,
            fileName:       DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_NAME,
            allFilesOfType: 'NONE'
        };

        const newFile = {
            fileAlias:      'FileAlias1',
            fileType:       TestLocationFileType.UNIT,
            testRunner:     TestRunner.METEOR_MOCHA,
            fileName:       'FileName1.mocha',
            allFilesOfType: '*.mocha'
        };

        // Setup - Add a file to the Location and update details
        OutputLocationsActions.developerAddsFileToLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME);
        OutputLocationsActions.developerSavesLocationFile(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS, newFile);
        // Add another file...
        OutputLocationsActions.developerAddsFileToLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME);

        // Execute - try to update with same details
        const expectation = {success: false, message: TestOutputLocationFileValidationErrors.LOCATION_FILE_INVALID_ALIAS_DUPLICATE};
        OutputLocationsActions.developerSavesLocationFile(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS, newFile, expectation);

        // Verify
        expect(OutputLocationsVerifications.locationFile_ForLocation_HasDetails(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, defaultFile));
    });

});
