import TestFixtures                     from '../../../test_framework/test_wrappers/test_fixtures.js';
import OutputLocationsActions           from '../../../test_framework/test_wrappers/output_locations_actions.js';
import OutputLocationsVerifications     from '../../../test_framework/test_wrappers/output_locations_verifications.js';
import {DefaultLocationText} from '../../../imports/constants/default_names.js';
import {TestOutputLocationValidationErrors}   from '../../../imports/constants/validation_errors.js';
import {TestLocationType, TestLocationAccessType} from '../../../imports/constants/constants.js';

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
    it('Any user can add a new Test Output Location to the list of test locations', function(){

        // Setup
        expect(OutputLocationsVerifications.locationDoesNotExistCalled(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME));

        // Execute
        OutputLocationsActions.developerAddsNewLocation();

        // Verify
        expect(OutputLocationsVerifications.locationExistsCalled(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME));
    });



    // Consequences
    it('A new Test Output Location added is private by default', function(){

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
            locationPath:       'NONE',
            locationFullPath:   'NONE'
        };

        expect(OutputLocationsVerifications.location_DetailsAre(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, expectedLocation));

    });

});
