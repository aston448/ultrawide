import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { WorkPackageActions }           from '../../../test_framework/test_wrappers/work_package_actions.js';
import { WpComponentActions }           from '../../../test_framework/test_wrappers/work_package_component_actions.js';
import { OutputLocationsActions }       from '../../../test_framework/test_wrappers/output_locations_actions.js';
import { TestIntegrationActions }       from '../../../test_framework/test_wrappers/test_integration_actions.js';
import { ViewOptionsActions }           from '../../../test_framework/test_wrappers/view_options_actions.js';
import { TestSummaryVerifications }     from '../../../test_framework/test_wrappers/test_summary_verifications.js';
import { DesignUpdateActions }          from '../../../test_framework/test_wrappers/design_update_actions.js';
import { UpdateComponentActions }       from '../../../test_framework/test_wrappers/design_update_component_actions.js';

import {DefaultLocationText} from '../../../imports/constants/default_names.js';
import {DefaultItemNames} from '../../../imports/constants/default_names.js';
import {TestLocationFileType, TestRunner, MashTestStatus} from '../../../imports/constants/constants.js';

describe('UC 401 - View Test Progress Summary', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 401 - View Test Progress Summary');

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

        // Set up a location
        OutputLocationsActions.developerAddsNewLocation();

        const newDetails = {
            locationName:       'Location1',
            locationIsShared:   true,
            locationPath:       'test_test/'
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

        // Designer sets up location config
        OutputLocationsActions.designerEditsTestLocationConfig();
        OutputLocationsActions.designerSelectsIntTestsInConfigForLocation('Location1');
        OutputLocationsActions.designerSelectsUnitTestsInConfigForLocation('Location1');

        // Developer sets up location config
        OutputLocationsActions.developerEditsTestLocationConfig();
        OutputLocationsActions.developerSelectsIntTestsInConfigForLocation('Location1');
        OutputLocationsActions.developerSelectsUnitTestsInConfigForLocation('Location1');

        // Ensure default view options before each test
        TestFixtures.resetUserViewOptions();

    });

    afterEach(function(){

    });

    const intResults = [
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
            result: MashTestStatus.MASH_NOT_LINKED
        }
    ];

    const unitResults = {
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
                        resultOutcome: MashTestStatus.MASH_PASS
                    },
                    {
                        resultName: 'Unit Test 23',
                        resultOutcome: MashTestStatus.MASH_PASS
                    },
                ]
            },
            {
                scenarioName: 'Scenario3',
                scenarioGroup: 'JSX Test',
                unitResults: [
                    {
                        resultName: 'Unit Test 21',
                        resultOutcome: MashTestStatus.MASH_PASS
                    },
                    {
                        resultName: 'Unit Test 22',
                        resultOutcome: MashTestStatus.MASH_PASS
                    },
                ]
            },
        ]
    };

    // Interface
    it('A Feature test summary indicates the number of passing tests for Scenarios in the Feature', function(){

        // Test Results are in...
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intResults);
        TestFixtures.writeUnitTestResults_MeteorMocha('Location1', unitResults);

        // Go to DV and display the Test Summary
        DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
        ViewOptionsActions.designerTogglesDesignVersionTestSummary();
        TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

        // Feature1: Expect Passes = 1 int tests + 4 unit tests
        expect(TestSummaryVerifications.designerTestSummaryFeaturePassCountIs('Section1', 'Feature1', 5));
        // Feature2: Expect Passes = 1 int tests + 2 unit tests
        expect(TestSummaryVerifications.designerTestSummaryFeaturePassCountIs('Section2', 'Feature2', 3));
    });

    it('A Feature test summary indicates the number of failing tests for Scenarios in the Feature', function(){

        // Test Results are in...
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intResults);
        TestFixtures.writeUnitTestResults_MeteorMocha('Location1', unitResults);

        // Go to DV and display the Test Summary
        DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
        ViewOptionsActions.designerTogglesDesignVersionTestSummary();
        TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

        // Feature1: Expect Fails = 1 int tests + 1 unit tests
        expect(TestSummaryVerifications.designerTestSummaryFeatureFailCountIs('Section1', 'Feature1', 2));
        // Feature2: Expect Fails = 0 int tests + 0 unit tests
        expect(TestSummaryVerifications.designerTestSummaryFeatureFailCountIs('Section2', 'Feature2', 0));
    });

    it('A Feature test summary indicates the number Scenarios in the Feature that have no tests', function(){

        // Test Results are in...
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intResults);
        TestFixtures.writeUnitTestResults_MeteorMocha('Location1', unitResults);

        // Go to DV and display the Test Summary
        DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
        ViewOptionsActions.designerTogglesDesignVersionTestSummary();
        TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

        // This includes anything with no test result above or not even included in the test run: Scenario7 and ExtraScenario
        expect(TestSummaryVerifications.designerTestSummaryFeatureNoTestCountIs('Section1', 'Feature1', 2));

        // Just Scenario4 not tested
        expect(TestSummaryVerifications.designerTestSummaryFeatureNoTestCountIs('Section2', 'Feature2', 1));
    });

    it('A Scenario test summary indicates the result or absence of an Acceptance test for that Scenario');

    it('A Scenario test summary indicates the result or absence of an Integration test for that Scenario', function(){

        // Test Results are in...
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intResults);
        TestFixtures.writeUnitTestResults_MeteorMocha('Location1', unitResults);

        // Go to DV and display the Test Summary
        DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
        ViewOptionsActions.designerTogglesDesignVersionTestSummary();
        TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

        expect(TestSummaryVerifications.designerTestSummaryScenarioIntTestStatusIs('Actions', 'Scenario1', MashTestStatus.MASH_PASS));
        expect(TestSummaryVerifications.designerTestSummaryScenarioIntTestStatusIs('Conditions', 'Scenario2', MashTestStatus.MASH_FAIL));
        expect(TestSummaryVerifications.designerTestSummaryScenarioIntTestStatusIs('Actions', 'Scenario7', MashTestStatus.MASH_NOT_LINKED));
        expect(TestSummaryVerifications.designerTestSummaryScenarioIntTestStatusIs('Actions', 'ExtraScenario', MashTestStatus.MASH_NOT_LINKED));
        expect(TestSummaryVerifications.designerTestSummaryScenarioIntTestStatusIs('Actions', 'Scenario3', MashTestStatus.MASH_PASS));
        expect(TestSummaryVerifications.designerTestSummaryScenarioIntTestStatusIs('Conditions', 'Scenario4', MashTestStatus.MASH_NOT_LINKED));
    });

    it('A Scenario test summary indicates the number of passing Module tests associated with that Scenario', function(){

        // Test Results are in...
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intResults);
        TestFixtures.writeUnitTestResults_MeteorMocha('Location1', unitResults);

        // Go to DV and display the Test Summary
        DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
        ViewOptionsActions.designerTogglesDesignVersionTestSummary();
        TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

        expect(TestSummaryVerifications.designerTestSummaryScenarioUnitTestPassCountIs('Actions', 'Scenario1', 1));
        expect(TestSummaryVerifications.designerTestSummaryScenarioUnitTestPassCountIs('Conditions', 'Scenario2', 3));
        expect(TestSummaryVerifications.designerTestSummaryScenarioUnitTestPassCountIs('Actions', 'Scenario7', 0));
        expect(TestSummaryVerifications.designerTestSummaryScenarioUnitTestPassCountIs('Actions', 'ExtraScenario', 0));
        expect(TestSummaryVerifications.designerTestSummaryScenarioUnitTestPassCountIs('Actions', 'Scenario3', 2));
        expect(TestSummaryVerifications.designerTestSummaryScenarioUnitTestPassCountIs('Conditions', 'Scenario4', 0));
    });

    it('A Scenario test summary indicates the number of failing Module tests associated with that Scenario', function(){

        // Test Results are in...
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intResults);
        TestFixtures.writeUnitTestResults_MeteorMocha('Location1', unitResults);

        // Go to DV and display the Test Summary
        DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
        ViewOptionsActions.designerTogglesDesignVersionTestSummary();
        TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

        expect(TestSummaryVerifications.designerTestSummaryScenarioUnitTestFailCountIs('Actions', 'Scenario1', 1));
        expect(TestSummaryVerifications.designerTestSummaryScenarioUnitTestFailCountIs('Conditions', 'Scenario2', 0));
        expect(TestSummaryVerifications.designerTestSummaryScenarioUnitTestFailCountIs('Actions', 'Scenario7', 0));
        expect(TestSummaryVerifications.designerTestSummaryScenarioUnitTestFailCountIs('Actions', 'ExtraScenario', 0));
        expect(TestSummaryVerifications.designerTestSummaryScenarioUnitTestFailCountIs('Actions', 'Scenario3', 0));
        expect(TestSummaryVerifications.designerTestSummaryScenarioUnitTestFailCountIs('Conditions', 'Scenario4', 0));
    });


    // Actions
    it('Test summary data may be displayed for a Design Version');

    it('Test summary data may be displayed for a Design Update');

    it('Test summary data may be displayed for a Work Package when it is viewed');

    it('Test summary data may be displayed for a Work Package when it is under development');


    // Conditions
    it('Test summary data is not available for a Work Package that is being scoped');

    it('When a test summary is shown for a Design Update the Feature totals include only Scenarios in the Design Update', function(){

        // Create new Design Version + an update and add Scenario2 to update
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerSelectsDesignVersion(DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        DesignVersionActions.designerUpdatesDesignVersionNameTo('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Conditions', 'Scenario2');
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');

        DesignUpdateActions.designerViewsUpdate('DesignUpdate1');
        ViewOptionsActions.designerTogglesDesignUpdateTestSummary();
        TestIntegrationActions.designerRefreshesTestResultsForDesignUpdateView();

        // Feature1 totals should only include Scenario2 results
        expect(TestSummaryVerifications.designerTestSummaryFeaturePassCountIs('Section1', 'Feature1', 3));
        expect(TestSummaryVerifications.designerTestSummaryFeatureFailCountIs('Section1', 'Feature1', 1));
        expect(TestSummaryVerifications.designerTestSummaryFeatureNoTestCountIs('Section1', 'Feature1', 0));
    });

    it('When a test summary is shown for a Work Package the Feature totals include only Scenarios in the Work Package', function(){

        // Add a WP to cover Feature1 Scenario1 only
        DesignActions.managerSelectsDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerAddsBaseDesignWorkPackageCalled('WorkPackage1');
        WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage1');
        WpComponentActions.managerAddsScenarioToScopeForCurrentWp('Actions', 'Scenario1');
        WorkPackageActions.managerPublishesSelectedWorkPackage();

        // Developer develops WP1
        DesignActions.developerSelectsDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Display the Test Summary
        ViewOptionsActions.developerTogglesWorkPackageTestSummary();
        TestIntegrationActions.developerRefreshesTestResults();

        // Feature 1 should reflect Scenario1 results only
        expect(TestSummaryVerifications.developerTestSummaryFeaturePassCountIs('Section1', 'Feature1', 2));
        expect(TestSummaryVerifications.developerTestSummaryFeatureFailCountIs('Section1', 'Feature1', 1));
        //expect(TestSummaryVerifications.developerTestSummaryFeatureNoTestCountIs('Section1', 'Feature1', 0));
    });

});
