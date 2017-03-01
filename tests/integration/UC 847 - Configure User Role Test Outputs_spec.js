
import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
import OutputLocationsActions           from '../../test_framework/test_wrappers/output_locations_actions.js';
import OutputLocationsVerifications     from '../../test_framework/test_wrappers/output_locations_verifications.js';
import {DefaultLocationText} from '../../imports/constants/default_names.js';
import {TestOutputLocationFileValidationErrors}   from '../../imports/constants/validation_errors.js';
import {TestLocationType, TestLocationAccessType} from '../../imports/constants/constants.js';

describe('UC 847 - Configure User Role Test Outputs', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 847 - Configure User Role Test Outputs');
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
    it('One or more test options may be selected for a Test Output Location Configuration', function(){

        const defaultConfig = {
            locationType:   TestLocationType.NONE,
            isUnitLocation: false,
            isIntLocation:  false,
            isAccLocation:  false
        };

        const newConfig = {
            locationType:   TestLocationType.NONE,
            isUnitLocation: true,
            isIntLocation:  true,
            isAccLocation:  false
        };

        // Setup - confirm Developer has default config for the private location
        OutputLocationsActions.developerEditsTestLocationConfig();
        expect(OutputLocationsVerifications.developerTestConfigurationIs(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, defaultConfig));

        // Execute - select all then unselect Acc
        OutputLocationsActions.developerSelectsUnitTestsInConfigForLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME);
        OutputLocationsActions.developerSelectsIntTestsInConfigForLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME);
        OutputLocationsActions.developerSelectsAccTestsInConfigForLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME);

        OutputLocationsActions.developerClearsAccTestsInConfigForLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME);

        // Verify
        expect(OutputLocationsVerifications.developerTestConfigurationIs(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, newConfig));
    });


    // Conditions
    it('The Test Output Location Configuration list does not show private Test Output Locations to Designers and Managers');

    it('The Test Output Location Configuration list does not show private Test Output Locations to Developers if they were not created by that Developer');


    // Consequences
    it('When a Test Output Location Configuration Unit test option is selected for a user Ultrawide will read all Unit test files at that location for the user');

    it('When a Test Output Location Configuration Integration test option is selected for a user Ultrawide will read all Integration test files at that location for the user');

    it('When a Test Output Location Configuration Acceptance test option is selected for a user Ultrawide will read all Acceptance test files at that location for the user');

});
