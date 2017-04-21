import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
import DesignActions                from '../../test_framework/test_wrappers/design_actions.js';
import DesignVersionActions         from '../../test_framework/test_wrappers/design_version_actions.js';
import WorkPackageActions           from '../../test_framework/test_wrappers/work_package_actions.js';
import WpComponentActions           from '../../test_framework/test_wrappers/work_package_component_actions.js';
import OutputLocationsActions       from '../../test_framework/test_wrappers/output_locations_actions.js';
import TestResultActions            from '../../test_framework/test_wrappers/test_integration_actions.js';
import TestResultVerifications      from '../../test_framework/test_wrappers/test_result_verifications.js';
import ViewOptionsActions           from '../../test_framework/test_wrappers/view_options_actions.js';
import ViewOptionsVerifications     from '../../test_framework/test_wrappers/view_options_verifications.js';
import TestIntegrationActions       from '../../test_framework/test_wrappers/test_integration_actions.js';

import {DefaultLocationText} from '../../imports/constants/default_names.js';
import {TestOutputLocationValidationErrors}   from '../../imports/constants/validation_errors.js';
import {TestLocationType, TestLocationAccessType, TestLocationFileType, TestRunner, MashTestStatus, ViewOptionType} from '../../imports/constants/constants.js';

describe('UC 310 - Refresh Test Data', function(){

    // Test results outside ULTRAWIDE

    const oldIntResults = [
        {
            featureName: 'Feature1',
            scenarioName: 'Scenario1',
            result: MashTestStatus.MASH_NOT_LINKED
        },
        {
            featureName: 'Feature1',
            scenarioName: 'Scenario2',
            result: MashTestStatus.MASH_NOT_LINKED
        },
        {
            featureName: 'Feature2',
            scenarioName: 'Scenario3',
            result: MashTestStatus.MASH_NOT_LINKED
        },
        {
            featureName: 'Feature2',
            scenarioName: 'Scenario4',
            result: MashTestStatus.MASH_NOT_LINKED
        }
    ];

    const newIntResults = [
        {
            featureName: 'Feature1',
            scenarioName: 'Scenario1',
            result: MashTestStatus.MASH_PASS
        },
        {
            featureName: 'Feature1',
            scenarioName: 'Scenario2',
            result: MashTestStatus.MASH_FAIL
        },
        {
            featureName: 'Feature2',
            scenarioName: 'Scenario3',
            result: MashTestStatus.MASH_PASS
        },
        {
            featureName: 'Feature2',
            scenarioName: 'Scenario4',
            result: MashTestStatus.MASH_FAIL
        }
    ];

    const oldUnitResults = {
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
            }
        ]
    };

    const newUnitResults = {
        scenarios: [
            {
                scenarioName: 'Scenario1',
                scenarioGroup: 'JSX Test',
                unitResults: [
                    {
                        resultName: 'Unit Test 11',
                        resultOutcome: MashTestStatus.MASH_FAIL
                    },
                    {
                        resultName: 'Unit Test 12',
                        resultOutcome: MashTestStatus.MASH_PASS
                    },
                ]
            }
        ]
    };

    before(function(){
        TestFixtures.logTestSuite('UC 310 - Refresh Test Data');

        TestFixtures.clearTestResultsFiles('Location1');
    });

    after(function(){

    });

    beforeEach(function(){

        TestFixtures.clearAllData();
        TestFixtures.addDesignWithDefaultData();

        // Create a Work Package with Feature1 and Feature2 in it
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');

        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerAddsBaseDesignWorkPackageCalled('WorkPackage1');
        WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage1');
        WpComponentActions.managerAddsFeatureToScopeForCurrentWp('Section1', 'Feature1');
        WpComponentActions.managerAddsFeatureToScopeForCurrentWp('Section2', 'Feature2');
        // But make sure Scenario7 in Feature1 is not in scope
        WpComponentActions.managerRemovesScenarioFromScopeForCurrentWp('Actions', 'Scenario7');
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

        const newIntFile = {
            fileAlias:      'IntegrationOutput',
            fileType:       TestLocationFileType.INTEGRATION,
            testRunner:     TestRunner.CHIMP_MOCHA,
            fileName:       'test_integration_test.json',
            allFilesOfType: 'NONE'
        };

        OutputLocationsActions.developerSavesLocationFile('Location1', DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS, newIntFile);

        // And a unit test file
        OutputLocationsActions.developerAddsFileToLocation('Location1');

        const newUnitFile = {
            fileAlias:      'UnitOutput',
            fileType:       TestLocationFileType.UNIT,
            testRunner:     TestRunner.METEOR_MOCHA,
            fileName:       'test_unit_test.json',
            allFilesOfType: 'NONE'
        };

        OutputLocationsActions.developerSavesLocationFile('Location1', DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS, newUnitFile);

        // Developer sets up location config
        OutputLocationsActions.developerEditsTestLocationConfig();
        OutputLocationsActions.developerSelectsIntTestsInConfigForLocation('Location1');
        OutputLocationsActions.developerSelectsUnitTestsInConfigForLocation('Location1');

        // Make sure WP is adopted for Developer
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();

        // Ensure default view options before each test
        TestFixtures.resetUserViewOptions();

    });

    afterEach(function(){

    });


    // Actions
    it('Test data from a new test run can be updated for the acceptance test view for a Work Package');

    it('Test data from a new test run can be updated for the integration test view for a Work Package', function(){

        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', oldIntResults);

        // Go to WP and look at results
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        expect(ViewOptionsVerifications.developerViewOption_IsHidden(ViewOptionType.DEV_INT_TESTS));
        ViewOptionsActions.developerTogglesIntTestsPane();
        expect(ViewOptionsVerifications.developerViewOption_IsVisible(ViewOptionType.DEV_INT_TESTS));
        TestIntegrationActions.developerRefreshesTestData();
        TestIntegrationActions.developerRefreshesTestResults();

        // Current Results
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario1', MashTestStatus.MASH_NOT_LINKED));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario2', MashTestStatus.MASH_NOT_LINKED));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario3', MashTestStatus.MASH_NOT_LINKED));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario4', MashTestStatus.MASH_NOT_LINKED));

        // New Test Run after Scenario4 test added and Scenario3 run...
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', newIntResults);

        // Execute - refresh data
        TestResultActions.developerRefreshesTestResults();

        // Verify - new results
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario1', MashTestStatus.MASH_PASS));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario2', MashTestStatus.MASH_FAIL));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario3', MashTestStatus.MASH_PASS));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario4', MashTestStatus.MASH_FAIL));
    });

    it('Test data from a new test run can be updated for the Developer integration test view for a Design Version', function(){

        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', oldIntResults);

        // Go to Version View and look at test results
        DesignVersionActions.developerViewsDesignVersion('DesignVersion1');

        expect(ViewOptionsVerifications.developerViewOption_IsHidden(ViewOptionType.DEV_INT_TESTS));
        ViewOptionsActions.developerTogglesIntTestsPane();
        expect(ViewOptionsVerifications.developerViewOption_IsVisible(ViewOptionType.DEV_INT_TESTS));
        TestIntegrationActions.developerRefreshesTestData();
        TestIntegrationActions.developerRefreshesTestResults();

        // Current Results
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario1', MashTestStatus.MASH_NOT_LINKED));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario2', MashTestStatus.MASH_NOT_LINKED));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario3', MashTestStatus.MASH_NOT_LINKED));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario4', MashTestStatus.MASH_NOT_LINKED));

        // New Test Run after Scenario4 test added and Scenario3 run...
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', newIntResults);

        // Execute - refresh data
        TestResultActions.developerRefreshesTestResults();

        // Verify - new results
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario1', MashTestStatus.MASH_PASS));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario2', MashTestStatus.MASH_FAIL));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario3', MashTestStatus.MASH_PASS));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario4', MashTestStatus.MASH_FAIL));
    });


    it('Test data from a new test run can be updated for the unit test view for a Work Package', function(){

        TestFixtures.writeUnitTestResults_MeteorMocha('Location1', oldUnitResults);

        // Go to WP and look at results
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        expect(ViewOptionsVerifications.developerViewOption_IsHidden(ViewOptionType.DEV_UNIT_TESTS));
        ViewOptionsActions.developerTogglesUnitTestsPane();
        expect(ViewOptionsVerifications.developerViewOption_IsVisible(ViewOptionType.DEV_UNIT_TESTS));
        TestIntegrationActions.developerRefreshesTestData();
        TestIntegrationActions.developerRefreshesTestResults();

        expect(TestResultVerifications.developerUnitTestsWindowContainsUnitTest('Scenario1', 'Unit Test 11'));
        expect(TestResultVerifications.developerUnitTestsWindowContainsUnitTest('Scenario1', 'Unit Test 12'));
        expect(TestResultVerifications.developerUnitTestResultForScenario_UnitTest_Is('Scenario1', 'Unit Test 11', MashTestStatus.MASH_PASS));
        expect(TestResultVerifications.developerUnitTestResultForScenario_UnitTest_Is('Scenario1', 'Unit Test 12', MashTestStatus.MASH_PASS));
        expect(TestResultVerifications.developerUnitTestResultForScenario_Is('Scenario1', MashTestStatus.MASH_PASS));

        // New test run
        TestFixtures.writeUnitTestResults_MeteorMocha('Location1', newUnitResults);

        TestIntegrationActions.developerRefreshesTestData();

        // Result is now a fail
        expect(TestResultVerifications.developerUnitTestsWindowContainsUnitTest('Scenario1', 'Unit Test 11'));
        expect(TestResultVerifications.developerUnitTestsWindowContainsUnitTest('Scenario1', 'Unit Test 12'));
        expect(TestResultVerifications.developerUnitTestResultForScenario_UnitTest_Is('Scenario1', 'Unit Test 11', MashTestStatus.MASH_FAIL));
        expect(TestResultVerifications.developerUnitTestResultForScenario_UnitTest_Is('Scenario1', 'Unit Test 12', MashTestStatus.MASH_PASS));
        expect(TestResultVerifications.developerUnitTestResultForScenario_Is('Scenario1', MashTestStatus.MASH_FAIL));

    });

    //it('Test data from a new test run can be updated for a Test Summary');


    // Conditions
    it('Acceptance test data is not updated if the acceptance test view is not visible and the test summary is not visible');

    it('Integration test data is not updated if the integration test view is not visible and the test summary is not visible', function(){

        // Setup
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', oldIntResults);

        // Go to WP and look at results
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        expect(ViewOptionsVerifications.developerViewOption_IsHidden(ViewOptionType.DEV_INT_TESTS));
        ViewOptionsActions.developerTogglesIntTestsPane();
        TestIntegrationActions.developerRefreshesTestData();

        // Current Results
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario1', MashTestStatus.MASH_NOT_LINKED));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario2', MashTestStatus.MASH_NOT_LINKED));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario3', MashTestStatus.MASH_NOT_LINKED));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario4', MashTestStatus.MASH_NOT_LINKED));

        // New Test Run after Scenario4 test added and Scenario3 run...
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', newIntResults);

        // Not changed in Ultrawide yet...
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario1', MashTestStatus.MASH_NOT_LINKED));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario2', MashTestStatus.MASH_NOT_LINKED));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario3', MashTestStatus.MASH_NOT_LINKED));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario4', MashTestStatus.MASH_NOT_LINKED));

        // Execute - refresh data but with Int Tests NOT showing
        ViewOptionsActions.developerTogglesIntTestsPane();
        expect(ViewOptionsVerifications.developerViewOption_IsHidden(ViewOptionType.DEV_INT_TESTS));
        TestResultActions.developerRefreshesTestResults();

        // Verify - data is not updated
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario1', MashTestStatus.MASH_NOT_LINKED));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario2', MashTestStatus.MASH_NOT_LINKED));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario3', MashTestStatus.MASH_NOT_LINKED));
        expect(TestResultVerifications.developerIntegrationTestResultForScenario_Is('Scenario4', MashTestStatus.MASH_NOT_LINKED));
    });

    //it('Unit test data is not updated if the unit test view is not visible and the test summary is not visible');

    //it('Modifications to the Design made by other users are not included when test data is refreshed');


    // Consequences
    //it('When test data is updated by a Developer any modifications to Scenarios made by that Developer are included in the update');

});

