
import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
import OutputLocationsActions           from '../../test_framework/test_wrappers/output_locations_actions.js';
import OutputLocationsVerifications     from '../../test_framework/test_wrappers/output_locations_verifications.js';
import {DefaultLocationText} from '../../imports/constants/default_names.js';
import {TestOutputLocationValidationErrors}   from '../../imports/constants/validation_errors.js';
import {TestLocationType, TestLocationAccessType, TestLocationFileType, TestRunner, MashTestStatus} from '../../imports/constants/constants.js';

describe('UC 341 - View Integration Test Results', function(){

    before(function(){

        TestFixtures.clearAllData();
        TestFixtures.addDesignWithDefaultData();

        // Set up a location
        OutputLocationsActions.developerAddsNewLocation();

        const newDetails = {
            locationName:       'Location1',
            locationType:       TestLocationType.LOCAL,
            locationAccessType: TestLocationAccessType.FILE,
            locationIsShared:   true,
            locationServerName: 'NONE',
            serverLogin:        'NONE',
            serverPassword:     'NONE',
            locationPath:       '/Users/aston/WebstormProjects/shared/test_test/'
        };

        OutputLocationsActions.developerSavesLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, newDetails);

        // And an integration test file
        OutputLocationsActions.developerAddsFileToLocation('Location1');

        const newFile = {
            fileAlias:      'IntegrationOutput',
            fileType:       TestLocationFileType.INTEGRATION,
            testRunner:     TestRunner.CHIMP_MOCHA,
            fileName:       'test_integration_test.json',
            allFilesOfType: 'NONE'
        };

        OutputLocationsActions.developerSavesLocationFile('Location1', DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS, newFile);

        const results = {
            scenario1Result: MashTestStatus.MASH_PASS,
            scenario2Result: MashTestStatus.MASH_FAIL,
            scenario3Result: MashTestStatus.MASH_PENDING,
            scenario4Result: MashTestStatus.MASH_PENDING,
        };

        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', results)

    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });


    // Interface
    it('A list of Scenarios and their integration test status is shown for an Application selected in a Work Package');

    it('A list of Scenarios and their integration test status is shown for a Design Section selected in a Work Package');

    it('A list of Scenarios and their integration test status is shown for a Feature selected in a Work Package');

    it('A list of Scenarios and their integration test status is shown for a Feature Aspect selected in a Work Package');

    it('Scenarios are grouped by Design Section, Feature and Feature Aspect when listed');

    it('The integration test result is shown for a failing test Scenario');

    it('The integration test execution time is shown for a passing Scenario');


    // Actions
    it('The integration test results panel may be displayed for a Work Package that is being developed by a Developer');

    it('The integration test results panel may be hidden for a Work Package that is being developed by a Developer');


    // Conditions
    it('Integration test results do not include Design Sections, Features or Scenarios outside the Work Package');

    it('A Feature Aspect is not shown in the test results if it contains no Scenarios');

    it('A Scenario not included in an integration test file results is shown as Not Tested');

    it('A Scenario included in pending integration test file results is shown as Pending');

    it('A Scenario included in failure integration test file results is shown as Fail');

    it('A Scenario included in pass integration test file results is shown as Pass');

});
