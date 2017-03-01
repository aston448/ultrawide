
import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
import OutputLocationsActions           from '../../test_framework/test_wrappers/output_locations_actions.js';
import OutputLocationsVerifications     from '../../test_framework/test_wrappers/output_locations_verifications.js';
import {DefaultLocationText} from '../../imports/constants/default_names.js';
import {TestOutputLocationValidationErrors}   from '../../imports/constants/validation_errors.js';
import {TestLocationType, TestLocationAccessType} from '../../imports/constants/constants.js';

describe('UC 845 - Remove Test Output Location', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 845 - Remove Test Output Location');
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
    it('A Developer can remove a Test Output Location', function(){

        // Setup - confirm exists
        expect(OutputLocationsVerifications.locationExistsCalled(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME));

        // Execute
        OutputLocationsActions.developerRemovesLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME);

        // Verify
        expect(OutputLocationsVerifications.locationDoesNotExistCalled(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME));
    });


    // Conditions
    it('Only a Developer can remove a Test Output Location', function(){

        // Setup - confirm exists
        expect(OutputLocationsVerifications.locationExistsCalled(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME));

        // Execute - Designer
        const expectation = {success: false, message: TestOutputLocationValidationErrors.LOCATION_INVALID_ROLE_REMOVE};
        OutputLocationsActions.designerRemovesLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, expectation);

        // Verify - still there
        expect(OutputLocationsVerifications.locationExistsCalled(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME));

        // Execute - Manager - same expectation
        OutputLocationsActions.managerRemovesLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, expectation);

        // Verify - still there
        expect(OutputLocationsVerifications.locationExistsCalled(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME));
    });


    // Consequences
    it('When a Test Output Location is removed any Test Output File definitions for it are also removed', function(){

        // Setup - add a location file
        OutputLocationsActions.developerAddsFileToLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME);
        expect(OutputLocationsVerifications.locationFileExistsForLocation_Called(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS));

        // Execute - remove location
        OutputLocationsActions.developerRemovesLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME);

        // Verify - file gone too - can't check at location as location gone...
        expect(OutputLocationsVerifications.locationFileDoesNotExistCalled(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS));

    });

    it('When a Test Output Location is removed the location is removed from Test Output Location Configuration for all users', function(){

        // Setup - share the location so users can see it...
        OutputLocationsActions.developerSetsLocationAsShared(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME);
        // Get users to check their data
        OutputLocationsActions.developerEditsTestLocationConfig();
        OutputLocationsActions.designerEditsTestLocationConfig();
        OutputLocationsActions.managerEditsTestLocationConfig();
        OutputLocationsActions.anotherDeveloperEditsTestLocationConfig();
        // Check
        expect(OutputLocationsVerifications.designerHasTestConfigLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME));
        expect(OutputLocationsVerifications.developerHasTestConfigLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME));
        expect(OutputLocationsVerifications.managerHasTestConfigLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME));
        // A second developer has it too...
        expect(OutputLocationsVerifications.anotherDeveloperHasTestConfigLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME));

        // Execute
        OutputLocationsActions.developerRemovesLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME);
        // Get users to check their data
        OutputLocationsActions.developerEditsTestLocationConfig();
        OutputLocationsActions.designerEditsTestLocationConfig();
        OutputLocationsActions.managerEditsTestLocationConfig();
        OutputLocationsActions.anotherDeveloperEditsTestLocationConfig();

        // Verify - gone for all
        expect(OutputLocationsVerifications.designerDoesNotHaveTestConfigLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME));
        expect(OutputLocationsVerifications.designerDoesNotHaveTestConfigLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME));
        expect(OutputLocationsVerifications.designerDoesNotHaveTestConfigLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME));
        expect(OutputLocationsVerifications.anotherDeveloperDoesNotHaveTestConfigLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME));
    });

});
