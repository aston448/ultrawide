
import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
import OutputLocationsActions           from '../../test_framework/test_wrappers/output_locations_actions.js';
import OutputLocationsVerifications     from '../../test_framework/test_wrappers/output_locations_verifications.js';
import {DefaultLocationText} from '../../imports/constants/default_names.js';
import {TestOutputLocationValidationErrors}   from '../../imports/constants/validation_errors.js';
import {TestLocationType, TestLocationAccessType} from '../../imports/constants/constants.js';

describe('UC 842 - Edit Test Output Location', function(){

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
    it('A Developer can update and save the properties of a Test Output Location', function(){

        // Setup
        const oldDetails = {
            locationName:       DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME,
            locationType:       TestLocationType.NONE,
            locationAccessType: TestLocationAccessType.NONE,
            locationIsShared:   false,
            locationServerName: 'NONE',
            serverLogin:        'NONE',
            serverPassword:     'NONE',
            locationPath:       'NONE'
        };

        const newDetails = {
            locationName:       'Location1',
            locationType:       TestLocationType.REMOTE,
            locationAccessType: TestLocationAccessType.RLOGIN,
            locationIsShared:   true,
            locationServerName: 'Server1',
            serverLogin:        'login1',
            serverPassword:     'password1',
            locationPath:       '/test/integration/output_files/'
        };

        expect(OutputLocationsVerifications.location_DetailsAre(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, oldDetails));

        // Execute
        OutputLocationsActions.developerSavesLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, newDetails);

        // Verify
        expect(OutputLocationsVerifications.location_DetailsAre('Location1', newDetails));
    });


    // Conditions
    it('Only a Developer can update a Test Output Location', function(){

        // Setup
        const oldDetails = {
            locationName:       DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME,
            locationType:       TestLocationType.NONE,
            locationAccessType: TestLocationAccessType.NONE,
            locationIsShared:   false,
            locationServerName: 'NONE',
            serverLogin:        'NONE',
            serverPassword:     'NONE',
            locationPath:       'NONE'
        };

        const newDetails = {
            locationName:       'Location1',
            locationType:       TestLocationType.REMOTE,
            locationAccessType: TestLocationAccessType.RLOGIN,
            locationIsShared:   true,
            locationServerName: 'Server1',
            serverLogin:        'login1',
            serverPassword:     'password1',
            locationPath:       '/test/integration/output_files/'
        };

        const expectation = {success: false, message: TestOutputLocationValidationErrors.LOCATION_INVALID_ROLE_SAVE};

        // Execute - Designer
        OutputLocationsActions.designerSavesLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, newDetails, expectation);

        // Verify unchanged
        expect(OutputLocationsVerifications.location_DetailsAre(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, oldDetails));

        // Execute - Manager
        OutputLocationsActions.managerSavesLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, newDetails, expectation);

        // Verify unchanged
        expect(OutputLocationsVerifications.location_DetailsAre(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, oldDetails));

    });


    // Consequences
    it('When a Test Output Location is updated the changes are visible in the Test Output Location Configurations available to other users');

});
