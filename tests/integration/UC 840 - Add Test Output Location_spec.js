import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
import OutputLocationsActions           from '../../test_framework/test_wrappers/output_locations_actions.js';
import OutputLocationsVerifications     from '../../test_framework/test_wrappers/output_locations_verifications.js';
import {DefaultLocationText} from '../../imports/constants/default_names.js';
import {TestOutputLocationValidationErrors}   from '../../imports/constants/validation_errors.js';
import {TestLocationType, TestLocationAccessType} from '../../imports/constants/constants.js';

describe('UC 840 - Add Test Output Location', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 840 - Add Test Output Location');
    });

    after(function(){

    });

    beforeEach(function(){

        // Don't need any design data for these tests
        TestFixtures.clearAllData();
    });

    afterEach(function(){

    });


    // Actions
    it('A Developer can add a new Test Output Location to the list of test locations', function(){

        // Setup
        expect(OutputLocationsVerifications.locationDoesNotExistCalled(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME));

        // Execute
        OutputLocationsActions.developerAddsNewLocation();

        // Verify
        expect(OutputLocationsVerifications.locationExistsCalled(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME));
    });


    // Conditions
    it('Only a Developer can add a new Test Output Location', function(){

        // Setup
        expect(OutputLocationsVerifications.locationDoesNotExistCalled(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME));

        // Execute - Designer
        let expectation = {success: false, message: TestOutputLocationValidationErrors.LOCATION_INVALID_ROLE_ADD};
        OutputLocationsActions.designerAddsNewLocation(expectation);

        // Verify
        expect(OutputLocationsVerifications.locationDoesNotExistCalled(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME));

        // Execute - Manager
        // Same expectation
        OutputLocationsActions.designerAddsNewLocation(expectation);

        // Verify
        expect(OutputLocationsVerifications.locationDoesNotExistCalled(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME));
    });

    // Consequences
    it('A new Test Output Location added by a developer is private by default', function(){

        // Setup
        expect(OutputLocationsVerifications.locationDoesNotExistCalled(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME));

        // Execute
        OutputLocationsActions.developerAddsNewLocation();

        // Verify
        expect(OutputLocationsVerifications.locationExistsCalled(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME));

        const expectedLocation = {
            locationName:       DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME,
            locationType:       TestLocationType.NONE,
            locationAccessType: TestLocationAccessType.NONE,
            locationIsShared:   false,
            locationServerName: 'NONE',
            serverLogin:        'NONE',
            serverPassword:     'NONE',
            locationPath:       'NONE'
        };

        expect(OutputLocationsVerifications.location_DetailsAre(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, expectedLocation));

    });

});
