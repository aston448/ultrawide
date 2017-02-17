
import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
import OutputLocationsActions           from '../../test_framework/test_wrappers/output_locations_actions.js';
import OutputLocationsVerifications     from '../../test_framework/test_wrappers/output_locations_verifications.js';
import {DefaultLocationText} from '../../imports/constants/default_names.js';
import {TestOutputLocationValidationErrors}   from '../../imports/constants/validation_errors.js';
import {TestLocationType, TestLocationAccessType} from '../../imports/constants/constants.js';

describe('UC 841 - Share or Hide Test Output Location', function(){

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
    it('A Developer can update a private Test Output Location to be shared', function(){

        // Setup - current location is private
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

        // Execute
        OutputLocationsActions.developerSetsLocationAsShared(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME);

        // Verify
        const newExpectedLocation = {
            locationName:       DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME,
            locationType:       TestLocationType.NONE,
            locationAccessType: TestLocationAccessType.NONE,
            locationIsShared:   true,
            locationServerName: 'NONE',
            serverLogin:        'NONE',
            serverPassword:     'NONE',
            locationPath:       'NONE'
        };

        expect(OutputLocationsVerifications.location_DetailsAre(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, newExpectedLocation));


    });

    it('A Developer can update a shared Test Output Location to be private', function(){

        // Setup - share it first
        OutputLocationsActions.developerSetsLocationAsShared(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME);

        // Execute
        OutputLocationsActions.developerSetsLocationAsPrivate(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME);

        // Verify
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




    // Conditions
    it('Only a Developer can update a Test Output Location as private or shared');


    // Consequences
    it('When a Test Output Location is marked as private it is no longer available to other Ultrawide users');

    it('When a Test Output Location is marked as shared it becomes available to other Ultrawide users');

});
