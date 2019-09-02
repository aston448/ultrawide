
import { TestFixtures }                     from '../../../test_framework/test_wrappers/test_fixtures.js';
import { OutputLocationsActions }           from '../../../test_framework/test_wrappers/output_locations_actions.js';
import { OutputLocationsVerifications }     from '../../../test_framework/test_wrappers/output_locations_verifications.js';

import {DefaultLocationText} from '../../../imports/constants/default_names.js';

describe('UC 866 - Remove Test Output Location File', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 866 - Remove Test Output Location File');
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
    it('Any user can remove a Test Output File', function(){

        // DEVELOPER
        // Setup - add a file to the location
        OutputLocationsActions.developerAddsFileToLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME);
        expect(OutputLocationsVerifications.locationFileExistsForLocation_Called(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS));

        // Execute
        OutputLocationsActions.developerRemovesLocationFile(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS);

        // Verify - gone
        expect(OutputLocationsVerifications.locationFileDoesNotExistForLocation_Called(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS));


        // DESIGNER
        // Setup - add a file to the location
        OutputLocationsActions.developerAddsFileToLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME);
        expect(OutputLocationsVerifications.locationFileExistsForLocation_Called(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS));

        // Execute
        OutputLocationsActions.designerRemovesLocationFile(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS);

        // Verify - gone
        expect(OutputLocationsVerifications.locationFileDoesNotExistForLocation_Called(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS));


        // MANAGER
        // Setup - add a file to the location
        OutputLocationsActions.developerAddsFileToLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME);
        expect(OutputLocationsVerifications.locationFileExistsForLocation_Called(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS));

        // Execute
        OutputLocationsActions.managerRemovesLocationFile(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS);

        // Verify - gone
        expect(OutputLocationsVerifications.locationFileDoesNotExistForLocation_Called(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS));
    });


});