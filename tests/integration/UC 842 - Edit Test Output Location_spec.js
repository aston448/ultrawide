
import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
import OutputLocationsActions           from '../../test_framework/test_wrappers/output_locations_actions.js';
import OutputLocationsVerifications     from '../../test_framework/test_wrappers/output_locations_verifications.js';
import {DefaultLocationText} from '../../imports/constants/default_names.js';
import {TestOutputLocationValidationErrors}   from '../../imports/constants/validation_errors.js';
import {TestLocationType, TestLocationAccessType} from '../../imports/constants/constants.js';

describe('UC 842 - Edit Test Output Location', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 842 - Edit Test Output Location');
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

    it('A Test Output Location may not be given the same name as an existing Test Output Location', function(){

        const defaultDetails = {
            locationName:       DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME,
            locationType:       TestLocationType.NONE,
            locationAccessType: TestLocationAccessType.NONE,
            locationIsShared:   false,
            locationServerName: 'NONE',
            serverLogin:        'NONE',
            serverPassword:     'NONE',
            locationPath:       'NONE'
        };

        // Setup - update the new Location
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

        OutputLocationsActions.developerSavesLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, newDetails);

        // Add another location
        OutputLocationsActions.developerAddsNewLocation();

        // Execute - try to update it with same name - Location1
        const expectation = {success:false, message: TestOutputLocationValidationErrors.LOCATION_INVALID_NAME_DUPLICATE};
        OutputLocationsActions.developerSavesLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, newDetails, expectation);

        // Verify - still default
        expect(OutputLocationsVerifications.location_DetailsAre(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, defaultDetails));
    });

    it('A remote Test Output Location must have an access type set', function(){

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
            locationAccessType: TestLocationAccessType.NONE,
            locationIsShared:   true,
            locationServerName: 'Server1',
            serverLogin:        'login1',
            serverPassword:     'password1',
            locationPath:       '/test/integration/output_files/'
        };

        expect(OutputLocationsVerifications.location_DetailsAre(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, oldDetails));

        // Execute
        const expectation = {success: false, message: TestOutputLocationValidationErrors.LOCATION_ACCESS_TYPE_NOT_SET};
        OutputLocationsActions.developerSavesLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, newDetails, expectation);

        // Verify
        expect(OutputLocationsVerifications.location_DetailsAre(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, oldDetails));

    });

    // Consequences
    it('When a Test Output Location is updated the changes are visible in the Test Output Location Configurations available to other users', function(){

        // Setup - developer changes location to shared and changes details
        const newDetails1 = {
            locationName:       'Location1',
            locationType:       TestLocationType.REMOTE,
            locationAccessType: TestLocationAccessType.RLOGIN,
            locationIsShared:   true,
            locationServerName: 'Server1',
            serverLogin:        'login1',
            serverPassword:     'password1',
            locationPath:       '/test/integration/output_files/'
        };

        OutputLocationsActions.developerSavesLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, newDetails1);

        // Get users to check out their data
        OutputLocationsActions.developerEditsTestLocationConfig();
        OutputLocationsActions.designerEditsTestLocationConfig();
        OutputLocationsActions.managerEditsTestLocationConfig();
        OutputLocationsActions.anotherDeveloperEditsTestLocationConfig();

        const expectedConfig1 = {
            locationType:  TestLocationType.REMOTE,
            isUnitLocation: false,
            isIntLocation: false,
            isAccLocation: false
        };

        expect(OutputLocationsVerifications.designerTestConfigurationIs('Location1', expectedConfig1));
        expect(OutputLocationsVerifications.developerTestConfigurationIs('Location1', expectedConfig1));
        expect(OutputLocationsVerifications.anotherDeveloperTestConfigurationIs('Location1', expectedConfig1));
        expect(OutputLocationsVerifications.managerTestConfigurationIs('Location1', expectedConfig1));

        // Execute
        const newDetails2 = {
            locationName:       'Location2',
            locationType:       TestLocationType.LOCAL,
            locationAccessType: TestLocationAccessType.FILE,
            locationIsShared:   true,
            locationServerName: 'NONE',
            serverLogin:        'NONE',
            serverPassword:     'NONE',
            locationPath:       '/test/integration/output_files/'
        };

        OutputLocationsActions.developerSavesLocation('Location1', newDetails2);
        // Get users to check out their data
        OutputLocationsActions.developerEditsTestLocationConfig();
        OutputLocationsActions.designerEditsTestLocationConfig();
        OutputLocationsActions.managerEditsTestLocationConfig();
        OutputLocationsActions.anotherDeveloperEditsTestLocationConfig();

        // Verify
        const expectedConfig2 = {
            locationType:  TestLocationType.LOCAL,
            isUnitLocation: false,
            isIntLocation: false,
            isAccLocation: false
        };

        // Now Location2, LOCAL
        expect(OutputLocationsVerifications.designerDoesNotHaveTestConfigLocation('Location1'));
        expect(OutputLocationsVerifications.designerDoesNotHaveTestConfigLocation('Location1'));
        expect(OutputLocationsVerifications.designerDoesNotHaveTestConfigLocation('Location1'));
        expect(OutputLocationsVerifications.designerDoesNotHaveTestConfigLocation('Location1'));

        expect(OutputLocationsVerifications.designerTestConfigurationIs('Location2', expectedConfig2));
        expect(OutputLocationsVerifications.developerTestConfigurationIs('Location2', expectedConfig2));
        expect(OutputLocationsVerifications.anotherDeveloperTestConfigurationIs('Location2', expectedConfig2));
        expect(OutputLocationsVerifications.managerTestConfigurationIs('Location2', expectedConfig2));
    });

});
