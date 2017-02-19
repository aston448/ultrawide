
import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
import OutputLocationsActions           from '../../test_framework/test_wrappers/output_locations_actions.js';
import OutputLocationsVerifications     from '../../test_framework/test_wrappers/output_locations_verifications.js';
import {DefaultLocationText} from '../../imports/constants/default_names.js';
import {TestOutputLocationFileValidationErrors}   from '../../imports/constants/validation_errors.js';
import {TestLocationType, TestLocationAccessType} from '../../imports/constants/constants.js';

describe('UC 846 - Remove Test Output Location File', function(){

    before(function(){

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
    it('A Developer can remove a Test Output File', function(){

        // Setup - add a file to the location
        OutputLocationsActions.developerAddsFileToLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME);
        expect(OutputLocationsVerifications.locationFileExistsForLocation_Called(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS));

        // Execute
        OutputLocationsActions.developerRemovesLocationFile(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS);

        // Verify - gone
        expect(OutputLocationsVerifications.locationFileDoesNotExistForLocation_Called(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS));
    });


    // Conditions
    it('Only a Developer can remove a Test Output File', function(){

        // Setup - add a file to the location
        OutputLocationsActions.developerAddsFileToLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME);
        expect(OutputLocationsVerifications.locationFileExistsForLocation_Called(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS));

        // Execute - Designer
        const expectation = {success: false, message: TestOutputLocationFileValidationErrors.LOCATION_FILE_INVALID_ROLE_REMOVE};
        OutputLocationsActions.designerRemovesLocationFile(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS, expectation);

        // Verify - still there
        expect(OutputLocationsVerifications.locationFileExistsForLocation_Called(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS));


        // Execute - Designer - same expectation
        OutputLocationsActions.managerRemovesLocationFile(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS, expectation);

        // Verify - still there
        expect(OutputLocationsVerifications.locationFileExistsForLocation_Called(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS));
    });

});
