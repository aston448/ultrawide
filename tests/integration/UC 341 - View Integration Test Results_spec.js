
import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
import DesignActions                from '../../test_framework/test_wrappers/design_actions.js';
import DesignVersionActions         from '../../test_framework/test_wrappers/design_version_actions.js';
import DesignUpdateActions          from '../../test_framework/test_wrappers/design_update_actions.js';
import DesignComponentActions       from '../../test_framework/test_wrappers/design_component_actions.js';
import UpdateComponentActions       from '../../test_framework/test_wrappers/design_update_component_actions.js';
import DesignVerifications          from '../../test_framework/test_wrappers/design_verifications.js';
import DesignUpdateVerifications    from '../../test_framework/test_wrappers/design_update_verifications.js';
import DesignVersionVerifications   from '../../test_framework/test_wrappers/design_version_verifications.js';
import DesignComponentVerifications from '../../test_framework/test_wrappers/design_component_verifications.js';
import UserContextVerifications     from '../../test_framework/test_wrappers/user_context_verifications.js';
import WorkPackageActions           from '../../test_framework/test_wrappers/work_package_actions.js';
import WorkPackageVerifications     from '../../test_framework/test_wrappers/work_package_verifications.js';
import WpComponentActions           from '../../test_framework/test_wrappers/work_package_component_actions.js';
import WpComponentVerifications     from '../../test_framework/test_wrappers/work_package_component_verifications.js';
import OutputLocationsActions       from '../../test_framework/test_wrappers/output_locations_actions.js';
import OutputLocationsVerifications from '../../test_framework/test_wrappers/output_locations_verifications.js';
import TestResultActions            from '../../test_framework/test_wrappers/test_result_actions.js';
import TestResultVerifications      from '../../test_framework/test_wrappers/test_result_verifications.js';

import {DefaultLocationText} from '../../imports/constants/default_names.js';
import {TestOutputLocationValidationErrors}   from '../../imports/constants/validation_errors.js';
import {TestLocationType, TestLocationAccessType, TestLocationFileType, TestRunner, MashTestStatus} from '../../imports/constants/constants.js';

describe('UC 341 - View Integration Test Results', function(){

    before(function(){

        TestFixtures.clearAllData();
        TestFixtures.addDesignWithDefaultData();

        // Create a Work Package with Feature1 and Feature2 in it
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');

        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerAddsBaseDesignWorkPackageCalled('WorkPackage1');
        WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage1');
        WpComponentActions.managerAddsFeatureToScopeForCurrentBaseWp('Section1', 'Feature1');
        WpComponentActions.managerAddsFeatureToScopeForCurrentBaseWp('Section2', 'Feature2');
        WorkPackageActions.managerPublishesSelectedWorkPackage();


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

        // Developer sets up location config
        OutputLocationsActions.developerEditsTestLocationConfig();
        OutputLocationsActions.developerSelectsIntTestsInConfigForLocation('Location1');



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

    it('A Scenario not included in an integration test file results is shown as Not Tested', function(){

        // Setup
        // Developer goes to WP
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerDevelopsSelectedBaseWorkPackageWithIntegrationTests();

        // Execute - Run Tests
        const results = {
            scenario1Result: MashTestStatus.MASH_PASS,
            scenario2Result: MashTestStatus.MASH_FAIL,
            scenario3Result: MashTestStatus.MASH_PENDING,
            scenario4Result: MashTestStatus.MASH_NOT_LINKED,
        };

        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', results);

        // Have a look at WP with INT results on
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerDevelopsSelectedBaseWorkPackageWithIntegrationTests();

        // Verify
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario1', MashTestStatus.MASH_PASS));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario2', MashTestStatus.MASH_FAIL));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario3', MashTestStatus.MASH_PENDING));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario4', MashTestStatus.MASH_NOT_LINKED));
    });

    it('A Scenario included in pending integration test file results is shown as Pending', function(){

        // Setup
        // Developer goes to WP
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerDevelopsSelectedBaseWorkPackageWithIntegrationTests();

        // Execute - Run Tests
        const results = {
            scenario1Result: MashTestStatus.MASH_PASS,
            scenario2Result: MashTestStatus.MASH_FAIL,
            scenario3Result: MashTestStatus.MASH_PENDING,
            scenario4Result: MashTestStatus.MASH_NOT_LINKED,
        };

        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', results);

        // Have a look at WP with INT results on
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerDevelopsSelectedBaseWorkPackageWithIntegrationTests();

        // Verify
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario3', MashTestStatus.MASH_PENDING));

    });

    it('A Scenario included in failure integration test file results is shown as Fail', function(){

        // Setup
        // Developer goes to WP
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerDevelopsSelectedBaseWorkPackageWithIntegrationTests();

        // Execute - Run Tests
        const results = {
            scenario1Result: MashTestStatus.MASH_PASS,
            scenario2Result: MashTestStatus.MASH_FAIL,
            scenario3Result: MashTestStatus.MASH_PENDING,
            scenario4Result: MashTestStatus.MASH_NOT_LINKED,
        };

        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', results);

        // Have a look at WP with INT results on
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerDevelopsSelectedBaseWorkPackageWithIntegrationTests();

        // Verify
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario2', MashTestStatus.MASH_FAIL));

    });

    it('A Scenario included in pass integration test file results is shown as Pass', function(){

        // Setup
        // Developer goes to WP
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerDevelopsSelectedBaseWorkPackageWithIntegrationTests();

        // Execute - Run Tests
        const results = {
            scenario1Result: MashTestStatus.MASH_PASS,
            scenario2Result: MashTestStatus.MASH_FAIL,
            scenario3Result: MashTestStatus.MASH_PENDING,
            scenario4Result: MashTestStatus.MASH_NOT_LINKED,
        };

        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', results);

        // Have a look at WP with INT results on
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerDevelopsSelectedBaseWorkPackageWithIntegrationTests();

        // Verify
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario1', MashTestStatus.MASH_PASS));
    });

});
