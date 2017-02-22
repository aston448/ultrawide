
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
import TestResultActions            from '../../test_framework/test_wrappers/test_integration_actions.js';
import TestResultVerifications      from '../../test_framework/test_wrappers/test_result_verifications.js';
import ViewOptionsActions           from '../../test_framework/test_wrappers/view_options_actions.js';
import ViewOptionsVerifications     from '../../test_framework/test_wrappers/view_options_verifications.js';

import {DefaultLocationText} from '../../imports/constants/default_names.js';
import {TestOutputLocationValidationErrors}   from '../../imports/constants/validation_errors.js';
import {ComponentType, TestLocationType, TestLocationAccessType, TestLocationFileType, TestRunner, MashTestStatus, ViewOptionType} from '../../imports/constants/constants.js';

describe('UC 312 - View Unit Test Results', function(){

    // Test results outside ULTRAWIDE
    const results = {
        scenarios: [
            {
                scenarioName: 'Scenario1',
                scenarioGroup: 'JSX Test',
                unitResults: [
                    {
                        resultName: 'Unit Test 11',
                        resultOutcome: MashTestStatus.MASH_PASS
                    },
                    {
                        resultName: 'Unit Test 12',
                        resultOutcome: MashTestStatus.MASH_PASS
                    },
                ]
            },
            {
                scenarioName: 'Scenario2',
                scenarioGroup: 'JSX Test',
                unitResults: [
                    {
                        resultName: 'Unit Test 21',
                        resultOutcome: MashTestStatus.MASH_PASS
                    },
                    {
                        resultName: 'Unit Test 22',
                        resultOutcome: MashTestStatus.MASH_FAIL
                    },
                ]
            },
            {
                scenarioName: 'Scenario3',
                scenarioGroup: 'JSX Test',
                unitResults: [
                    {
                        resultName: 'Unit Test 31',
                        resultOutcome: MashTestStatus.MASH_FAIL
                    },
                    {
                        resultName: 'Unit Test 32',
                        resultOutcome: MashTestStatus.MASH_PENDING
                    },
                ]
            },
            {
                scenarioName: 'Scenario4',
                scenarioGroup: 'JSX Test',
                unitResults: [
                    {
                        resultName: 'Unit Test 41',
                        resultOutcome: MashTestStatus.MASH_NOT_LINKED
                    },
                    {
                        resultName: 'Unit Test 42',
                        resultOutcome: MashTestStatus.MASH_NOT_LINKED
                    },
                ]
            }
        ]
    };

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
        // But make sure Scenario444 in Feature1 is not in scope
        WpComponentActions.managerRemovesScenarioFromScopeForCurrentBaseWp('Actions', 'Scenario444');
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
            fileAlias:      'UnitOutput',
            fileType:       TestLocationFileType.UNIT,
            testRunner:     TestRunner.METEOR_MOCHA,
            fileName:       'test_unit_test.json',
            allFilesOfType: 'NONE'
        };

        OutputLocationsActions.developerSavesLocationFile('Location1', DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS, newFile);

        // Developer sets up location config
        OutputLocationsActions.developerEditsTestLocationConfig();
        OutputLocationsActions.developerSelectsUnitTestsInConfigForLocation('Location1');


    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });


    // Interface
    it('A list of Features, Feature Aspects, Scenarios and the unit tests for each Scenario is shown for an Application selected in a Work Package');

    it('A list of Features, Feature Aspects, Scenarios and the unit tests for each Scenario is shown for a Design Section selected in a Work Package');

    it('A list of Feature Aspects, Scenarios and the unit tests for each Scenario is shown for a Feature selected in a Work Package');

    it('A list of Scenarios and the unit tests for each Scenario is shown for a Feature Aspect selected in a Work Package');

    it('A list of unit tests for the Scenario is shown for a Scenario selected in a Work Package');

    it('A Scenario has a unit test status that reflects the status of the unit tests for that Scenario');

    it('Each unit test displays the test status for that unit test');

    it('A failed unit test displays the failure reason');

    it('A passing unit test displays the execution time');


    // Actions
    it('The unit test results panel may be displayed for a Work Package that is being developed by a Developer');

    it('The unit test results panel may be hidden for a Work Package that is being developed by a Developer');


    // Conditions
    it('Unit test results include all Features and Scenarios in the Work Package scope');

    it('Unit test results do not include Features or Scenarios outside the Work Package');

    it('A Feature Aspect is not shown in the unit test results if it contains no Scenarios');

    it('A Scenario with no unit results is shown as Not Tested', function(){

        // Setup
        // Developer goes to WP
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerDevelopsSelectedBaseWorkPackage();

        // Tests are run
        TestFixtures.writeUnitTestResults_MeteorMocha('Location1', results);

        // Open the Unit Tests window - this should load the expected data
        expect(ViewOptionsVerifications.developerViewOption_IsHidden(ViewOptionType.DEV_UNIT_TESTS));
        ViewOptionsActions.developerTogglesUnitTestsInNewWorkPackageDevelopmentView();

        // Verify - scenario 4 is not tested as no tests
        expect(ViewOptionsVerifications.developerViewOption_IsVisible(ViewOptionType.DEV_UNIT_TESTS));
        expect(TestResultVerifications.developerUnitTestResultForScenario_Is('Scenario4', MashTestStatus.MASH_NOT_LINKED));


    });

    it('A Scenario with any failing unit test results is shown as Fail', function(){

        // Setup
        // Developer goes to WP
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerDevelopsSelectedBaseWorkPackage();

        // Tests are run
        TestFixtures.writeUnitTestResults_MeteorMocha('Location1', results);

        // Open the Unit Tests window - this should load the expected data
        expect(ViewOptionsVerifications.developerViewOption_IsHidden(ViewOptionType.DEV_UNIT_TESTS));
        ViewOptionsActions.developerTogglesUnitTestsInNewWorkPackageDevelopmentView();

        // Verify - scenario 2 and 3 both failed as have 1 failure
        expect(ViewOptionsVerifications.developerViewOption_IsVisible(ViewOptionType.DEV_UNIT_TESTS));
        expect(TestResultVerifications.developerUnitTestResultForScenario_Is('Scenario2', MashTestStatus.MASH_FAIL));
        expect(TestResultVerifications.developerUnitTestResultForScenario_Is('Scenario3', MashTestStatus.MASH_FAIL));

    });

    it('A Scenario with all passing unit test results is shown as Pass', function(){

        // Setup
        // Developer goes to WP
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerDevelopsSelectedBaseWorkPackage();

        // Tests are run
        TestFixtures.writeUnitTestResults_MeteorMocha('Location1', results);

        // Open the Unit Tests window - this should load the expected data
        expect(ViewOptionsVerifications.developerViewOption_IsHidden(ViewOptionType.DEV_UNIT_TESTS));
        ViewOptionsActions.developerTogglesUnitTestsInNewWorkPackageDevelopmentView();

        // Verify - scenario 1 passed as all tests passed
        expect(ViewOptionsVerifications.developerViewOption_IsVisible(ViewOptionType.DEV_UNIT_TESTS));
        expect(TestResultVerifications.developerUnitTestResultForScenario_Is('Scenario1', MashTestStatus.MASH_PASS));
    });

});
