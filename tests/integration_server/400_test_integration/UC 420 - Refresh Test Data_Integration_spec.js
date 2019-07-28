import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { DesignComponentActions }       from '../../../test_framework/test_wrappers/design_component_actions.js';
import { TestExpectationActions }       from '../../../test_framework/test_wrappers/test_expectation_actions.js';
import { TestExpectationVerifications } from '../../../test_framework/test_wrappers/test_expectation_verifications.js'
import {MashTestStatus, TestLocationFileType, TestRunner} from "../../../imports/constants/constants";
import {DefaultLocationText} from "../../../imports/constants/default_names";
import {OutputLocationsActions} from "../../../test_framework/test_wrappers/output_locations_actions";
import {TestIntegrationActions} from "../../../test_framework/test_wrappers/test_integration_actions";
import {ViewOptionsActions} from "../../../test_framework/test_wrappers/view_options_actions";
import {TestResultVerifications} from "../../../test_framework/test_wrappers/test_result_verifications";

describe('UC 420 - Refresh Test Data', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 420 - Refresh Test Data');

        // NOTE: Much faster to only set the data up once - but be aware that it is persisting for all tests.
        // Test results files overwrite each other for each test

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();

        // Set up a location
        OutputLocationsActions.designerAddsNewLocation();

        const newDetails = {
            locationName:       'Location1',
            locationIsShared:   true,
            locationPath:       'test_test/'
        };

        OutputLocationsActions.designerSavesLocation(DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_NAME, newDetails);


        // Add an Acceptance test file
        OutputLocationsActions.developerAddsFileToLocation('Location1');

        const newAccFile = {
            fileAlias:      'AcceptanceOutput',
            fileType:       TestLocationFileType.ACCEPTANCE,
            testRunner:     TestRunner.CHIMP_MOCHA,
            fileName:       'test_acceptance_test.json',
            allFilesOfType: 'NONE'
        };

        OutputLocationsActions.designerSavesLocationFile('Location1', DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS, newAccFile);


        // Add an integration test file
        OutputLocationsActions.developerAddsFileToLocation('Location1');

        const newIntFile = {
            fileAlias:      'IntegrationOutput',
            fileType:       TestLocationFileType.INTEGRATION,
            testRunner:     TestRunner.CHIMP_MOCHA,
            fileName:       'test_integration_test.json',
            allFilesOfType: 'NONE'
        };

        OutputLocationsActions.designerSavesLocationFile('Location1', DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS, newIntFile);


        // And a unit test file
        OutputLocationsActions.developerAddsFileToLocation('Location1');

        const newUnitFile = {
            fileAlias:      'UnitOutput',
            fileType:       TestLocationFileType.UNIT,
            testRunner:     TestRunner.METEOR_MOCHA,
            fileName:       'test_unit_test.json',
            allFilesOfType: 'NONE'
        };

        OutputLocationsActions.designerSavesLocationFile('Location1', DefaultLocationText.NEW_TEST_OUTPUT_LOCATION_FILE_ALIAS, newUnitFile);

        // Designer sets up location config
        OutputLocationsActions.designerEditsTestLocationConfig();
        OutputLocationsActions.designerSelectsAccTestsInConfigForLocation('Location1');
        OutputLocationsActions.designerSelectsIntTestsInConfigForLocation('Location1');
        OutputLocationsActions.designerSelectsUnitTestsInConfigForLocation('Location1');


    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });

    // Unit Results ----------------------------------------------------------------------------------------------------

    const unitResults = {
        scenarios: [
            {
                scenarioName: 'Scenario1',
                scenarioGroup: 'JSX Test',
                unitResults: [
                    {
                        resultName: '',
                        resultOutcome: MashTestStatus.MASH_PASS
                    }
                ]
            },
            {
                scenarioName: 'Scenario2',
                scenarioGroup: 'JSX Test',
                unitResults: [
                    {
                        resultName: '',
                        resultOutcome: MashTestStatus.MASH_FAIL
                    }
                ]
            },
            {
                scenarioName: 'Scenario3',
                scenarioGroup: 'JSX Test',
                unitResults: [
                    {
                        resultName: '',
                        resultOutcome: MashTestStatus.MASH_PENDING
                    },
                ]
            },
        ]
    };

    const unitResultsComboPass = {
        scenarios: [
            {
                scenarioName: 'Scenario1 Permutation1',
                scenarioGroup: 'JSX Test',
                unitResults: [
                    {
                        resultName: 'Test of PermutationValue1',
                        resultOutcome: MashTestStatus.MASH_PASS
                    }
                ]
            },
            {
                scenarioName: 'Scenario1 Permutation1',
                scenarioGroup: 'JSX Test',
                unitResults: [
                    {
                        resultName: 'Test of PermutationValue2',
                        resultOutcome: MashTestStatus.MASH_PASS
                    }
                ]
            }
        ]
    };

    const unitResultsComboFail = {
        scenarios: [
            {
                scenarioName: 'Scenario1 Permutation1',
                scenarioGroup: 'JSX Test',
                unitResults: [
                    {
                        resultName: 'Test of PermutationValue1',
                        resultOutcome: MashTestStatus.MASH_FAIL
                    }
                ]
            },
            {
                scenarioName: 'Scenario1 Permutation1',
                scenarioGroup: 'JSX Test',
                unitResults: [
                    {
                        resultName: 'Test of PermutationValue2',
                        resultOutcome: MashTestStatus.MASH_PASS
                    }
                ]
            }
        ]
    };

    const unitResultsComboIncomplete = {
        scenarios: [
            {
                scenarioName: 'Scenario1 Permutation1',
                scenarioGroup: 'JSX Test',
                unitResults: [
                    {
                        resultName: 'Test of PermutationValue1',
                        resultOutcome: MashTestStatus.MASH_PASS
                    }
                ]
            },
            {
                scenarioName: 'Scenario1 Permutation1',
                scenarioGroup: 'JSX Test',
                unitResults: [
                    {
                        resultName: 'Some other test',
                        resultOutcome: MashTestStatus.MASH_PASS
                    }
                ]
            }
        ]
    };

    const unitResultsComboPending = {
        scenarios: [
            {
                scenarioName: 'Scenario1 Permutation1',
                scenarioGroup: 'JSX Test',
                unitResults: [
                    {
                        resultName: 'Test of PermutationValue1',
                        resultOutcome: MashTestStatus.MASH_PENDING
                    }
                ]
            },
            {
                scenarioName: 'Scenario1 Permutation1',
                scenarioGroup: 'JSX Test',
                unitResults: [
                    {
                        resultName: 'Test of PermutationValue2',
                        resultOutcome: MashTestStatus.MASH_PENDING
                    }
                ]
            }
        ]
    };

    const unitResultsComboMissing = {
        scenarios: [
            {
                scenarioName: 'Scenario1 Permutation1',
                scenarioGroup: 'JSX Test',
                unitResults: [
                    {
                        resultName: 'Some other test',
                        resultOutcome: MashTestStatus.MASH_PASS
                    }
                ]
            },
            {
                scenarioName: 'Scenario1 Permutation1',
                scenarioGroup: 'JSX Test',
                unitResults: [
                    {
                        resultName: 'Some other test',
                        resultOutcome: MashTestStatus.MASH_PASS
                    }
                ]
            }
        ]
    };

    // Integration / Acc Results ---------------------------------------------------------------------------------------

    const intAccResults = [
        {
            scenarioName: 'Scenario1',
            testName: '',
            result: MashTestStatus.MASH_PASS
        },
        {
            scenarioName: 'Scenario2',
            testName: '',
            result: MashTestStatus.MASH_FAIL
        },
        {
            scenarioName: 'Scenario3',
            testName: '',
            result: MashTestStatus.MASH_PENDING
        }
    ];

    const intAccResultsComboPass = [
        {
            scenarioName: 'Scenario1 Permutation1',
            testName: 'Test of PermutationValue1',
            result: MashTestStatus.MASH_PASS
        },
        {
            scenarioName: 'Scenario1 Permutation1',
            testName: 'Test of PermutationValue2',
            result: MashTestStatus.MASH_PASS
        }
    ];

    const intAccResultsComboFail = [
        {
            scenarioName: 'Scenario1 Permutation1',
            testName: 'Test of PermutationValue1',
            result: MashTestStatus.MASH_FAIL
        },
        {
            scenarioName: 'Scenario1 Permutation1',
            testName: 'Test of PermutationValue2',
            result: MashTestStatus.MASH_PASS
        }
    ];

    const intAccResultsComboIncomplete = [
        {
            scenarioName: 'Scenario1 Permutation1',
            testName: 'Test of PermutationValue1',
            result: MashTestStatus.MASH_PASS
        },
        {
            scenarioName: 'Scenario1 Permutation1',
            testName: 'Some other test',
            result: MashTestStatus.MASH_PASS
        }
    ];

    const intAccResultsComboPending = [
        {
            scenarioName: 'Scenario1 Permutation1',
            testName: 'Test of PermutationValue1',
            result: MashTestStatus.MASH_PENDING
        },
        {
            scenarioName: 'Scenario1 Permutation1',
            testName: 'Test of PermutationValue2',
            result: MashTestStatus.MASH_PENDING
        }
    ];

    const intAccResultsComboMissing = [
        {
            scenarioName: 'Scenario1 Permutation1',
            testName: 'Some other test',
            result: MashTestStatus.MASH_PASS
        },
        {
            scenarioName: 'Scenario1 Permutation1',
            testName: 'Some other test',
            result: MashTestStatus.MASH_FAIL
        }
    ];



    describe('Actions', function(){


        describe('A Scenario without Design Permutations is updated with a Pass test outcome where that Scenario is matched in passing test results', function(){

            it('Test Type - Unit', function(){
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsUnitExpectation('Scenario1');

                // Test Results are in...
                TestFixtures.writeUnitTestResults_MeteorMocha('Location1', unitResults);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerUnitTestExpectationResultForScenarioIs('Scenario1', MashTestStatus.MASH_PASS);
            });


            it('Test Type - Integration', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsIntegrationExpectation('Scenario1');

                // Test Results are in...
                TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intAccResults);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerIntegrationTestExpectationResultForScenarioIs('Scenario1', MashTestStatus.MASH_PASS);

            });


            it('Test Type - Acceptance', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsAcceptanceExpectation('Scenario1');

                // Test Results are in...
                TestFixtures.writeAcceptanceTestResults_ChimpMocha('Location1', intAccResults);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerAcceptanceTestExpectationResultForScenarioIs('Scenario1', MashTestStatus.MASH_PASS);

            });

        });

        describe('A Scenario without Design Permutations is updated with a Fail test outcome where that Scenario is matched in failing test results', function(){

            it('Test Type - Unit', function(){
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Conditions', 'Scenario2');
                TestExpectationActions.designerSelectsUnitExpectation('Scenario2');

                // Test Results are in...
                TestFixtures.writeUnitTestResults_MeteorMocha('Location1', unitResults);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerUnitTestExpectationResultForScenarioIs('Scenario2', MashTestStatus.MASH_FAIL);
            });


            it('Test Type - Integration', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Conditions', 'Scenario2');
                TestExpectationActions.designerSelectsIntegrationExpectation('Scenario2');

                // Test Results are in...
                TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intAccResults);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerIntegrationTestExpectationResultForScenarioIs('Scenario2', MashTestStatus.MASH_FAIL);
            });


            it('Test Type - Acceptance', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Conditions', 'Scenario2');
                TestExpectationActions.designerSelectsAcceptanceExpectation('Scenario2');

                // Test Results are in...
                TestFixtures.writeAcceptanceTestResults_ChimpMocha('Location1', intAccResults);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerAcceptanceTestExpectationResultForScenarioIs('Scenario2', MashTestStatus.MASH_FAIL);
            });

        });

        describe('A Scenario without Design Permutations is updated with a Missing test outcome where that Scenario is matched in pending test results', function(){

            it('Test Type - Unit', function(){
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature2', 'Actions', 'Scenario3');
                TestExpectationActions.designerSelectsUnitExpectation('Scenario3');

                // Test Results are in...
                TestFixtures.writeUnitTestResults_MeteorMocha('Location1', unitResults);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerUnitTestExpectationResultForScenarioIs('Scenario3', MashTestStatus.MASH_NO_TESTS);
            });


            it('Test Type - Integration', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature2', 'Actions', 'Scenario3');
                TestExpectationActions.designerSelectsIntegrationExpectation('Scenario3');

                // Test Results are in...
                TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intAccResults);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerIntegrationTestExpectationResultForScenarioIs('Scenario3', MashTestStatus.MASH_NO_TESTS);
            });


            it('Test Type - Acceptance', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature2', 'Actions', 'Scenario3');
                TestExpectationActions.designerSelectsAcceptanceExpectation('Scenario3');

                // Test Results are in...
                TestFixtures.writeAcceptanceTestResults_ChimpMocha('Location1', intAccResults);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerAcceptanceTestExpectationResultForScenarioIs('Scenario3', MashTestStatus.MASH_NO_TESTS);
            });

        });

        describe('A Scenario without Design Permutations is updated with a Missing test outcome where that Scenario is not matched in any test results', function(){

            it('Test Type - Unit', function(){
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                // No results for Scenario7
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario7');
                TestExpectationActions.designerSelectsUnitExpectation('Scenario7');

                // Test Results are in...
                TestFixtures.writeUnitTestResults_MeteorMocha('Location1', unitResults);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerUnitTestExpectationResultForScenarioIs('Scenario7', MashTestStatus.MASH_NO_TESTS);
            });


            it('Test Type - Integration', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                // No results for Scenario7
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario7');
                TestExpectationActions.designerSelectsIntegrationExpectation('Scenario7');

                // Test Results are in...
                TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intAccResults);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerIntegrationTestExpectationResultForScenarioIs('Scenario7', MashTestStatus.MASH_NO_TESTS);
            });


            it('Test Type - Acceptance', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                // No results for Scenario7
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario7');
                TestExpectationActions.designerSelectsAcceptanceExpectation('Scenario7');

                // Test Results are in...
                TestFixtures.writeAcceptanceTestResults_ChimpMocha('Location1', intAccResults);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerAcceptanceTestExpectationResultForScenarioIs('Scenario7', MashTestStatus.MASH_NO_TESTS);
            });

        });

        describe('A Design Permutation Test Expectation is updated with a Pass test outcome where that Scenario is matched in passing test results and has a passing test that contains the Permutation Value', function(){

            it('Test Type - Unit', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsUnitExpectation('Scenario1');
                TestExpectationActions.designerSelectsUnitPermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');

                // Test Results are in...
                TestFixtures.writeUnitTestResults_MeteorMocha('Location1', unitResultsComboPass);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerUnitTestExpectationResultForScenarioPermutationIs('Scenario1', 'Permutation1', 'PermutationValue1', MashTestStatus.MASH_PASS);

            });


            it('Test Type - Integration', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsIntegrationExpectation('Scenario1');
                TestExpectationActions.designerSelectsIntegrationPermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');

                // Test Results are in...
                TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intAccResultsComboPass);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerIntegrationTestExpectationResultForScenarioPermutationIs('Scenario1', 'Permutation1', 'PermutationValue1', MashTestStatus.MASH_PASS);
            });


            it('Test Type - Acceptance', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsAcceptanceExpectation('Scenario1');
                TestExpectationActions.designerSelectsAcceptancePermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');

                // Test Results are in...
                TestFixtures.writeAcceptanceTestResults_ChimpMocha('Location1', intAccResultsComboPass);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerAcceptanceTestExpectationResultForScenarioPermutationIs('Scenario1', 'Permutation1', 'PermutationValue1', MashTestStatus.MASH_PASS);
            });

        });

        describe('A Design Permutation Test Expectation is updated with a Fail test outcome where that Scenario is matched in passing test results and has a failing test that contains the Permutation Value', function(){

            it('Test Type - Unit', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsUnitExpectation('Scenario1');
                TestExpectationActions.designerSelectsUnitPermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');

                // Test Results are in...
                TestFixtures.writeUnitTestResults_MeteorMocha('Location1', unitResultsComboFail);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerUnitTestExpectationResultForScenarioPermutationIs('Scenario1', 'Permutation1', 'PermutationValue1', MashTestStatus.MASH_FAIL);
            });


            it('Test Type - Integration', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsIntegrationExpectation('Scenario1');
                TestExpectationActions.designerSelectsIntegrationPermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');

                // Test Results are in...
                TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intAccResultsComboFail);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerIntegrationTestExpectationResultForScenarioPermutationIs('Scenario1', 'Permutation1', 'PermutationValue1', MashTestStatus.MASH_FAIL);
            });


            it('Test Type - Acceptance', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsAcceptanceExpectation('Scenario1');
                TestExpectationActions.designerSelectsAcceptancePermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');

                // Test Results are in...
                TestFixtures.writeAcceptanceTestResults_ChimpMocha('Location1', intAccResultsComboFail);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerAcceptanceTestExpectationResultForScenarioPermutationIs('Scenario1', 'Permutation1', 'PermutationValue1', MashTestStatus.MASH_FAIL);
            });

        });

        describe('A Design Permutation Test Expectation is updated with a Pending test outcome where that Scenario is matched in passing test results and has a pending test that contains the Permutation Value', function(){

            it('Test Type - Unit', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsUnitExpectation('Scenario1');
                TestExpectationActions.designerSelectsUnitPermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');

                // Test Results are in...
                TestFixtures.writeUnitTestResults_MeteorMocha('Location1', unitResultsComboPending);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerUnitTestExpectationResultForScenarioPermutationIs('Scenario1', 'Permutation1', 'PermutationValue1', MashTestStatus.MASH_PENDING);
            });


            it('Test Type - Integration', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsIntegrationExpectation('Scenario1');
                TestExpectationActions.designerSelectsIntegrationPermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');

                // Test Results are in...
                TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intAccResultsComboPending);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerIntegrationTestExpectationResultForScenarioPermutationIs('Scenario1', 'Permutation1', 'PermutationValue1', MashTestStatus.MASH_PENDING);
            });


            it('Test Type - Acceptance', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsAcceptanceExpectation('Scenario1');
                TestExpectationActions.designerSelectsAcceptancePermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');

                // Test Results are in...
                TestFixtures.writeAcceptanceTestResults_ChimpMocha('Location1', intAccResultsComboPending);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerAcceptanceTestExpectationResultForScenarioPermutationIs('Scenario1', 'Permutation1', 'PermutationValue1', MashTestStatus.MASH_PENDING);
            });

        });

        describe('A Design Permutation Test Expectation is updated with a Missing test outcome where that Scenario is matched in passing test results and has no test that contains the Permutation Value', function(){

            it('Test Type - Unit', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsUnitExpectation('Scenario1');
                TestExpectationActions.designerSelectsUnitPermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');

                // Test Results are in...
                TestFixtures.writeUnitTestResults_MeteorMocha('Location1', unitResultsComboMissing);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerUnitTestExpectationResultForScenarioPermutationIs('Scenario1', 'Permutation1', 'PermutationValue1', MashTestStatus.MASH_NO_TESTS);
            });


            it('Test Type - Integration', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsIntegrationExpectation('Scenario1');
                TestExpectationActions.designerSelectsIntegrationPermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');

                // Test Results are in...
                TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intAccResultsComboMissing);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerIntegrationTestExpectationResultForScenarioPermutationIs('Scenario1', 'Permutation1', 'PermutationValue1', MashTestStatus.MASH_NO_TESTS);
            });


            it('Test Type - Acceptance', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsAcceptanceExpectation('Scenario1');
                TestExpectationActions.designerSelectsAcceptancePermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');

                // Test Results are in...
                TestFixtures.writeAcceptanceTestResults_ChimpMocha('Location1', intAccResultsComboMissing);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerAcceptanceTestExpectationResultForScenarioPermutationIs('Scenario1', 'Permutation1', 'PermutationValue1', MashTestStatus.MASH_NO_TESTS);
            });

        });

        describe('A Scenario with Design Permutations is updated with a Fail test outcome if any Permutation Value for the Scenario has a failing test', function(){

            it('Test Type - Unit', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                // Expectation of two test values for Scenario 1
                TestExpectationActions.designerSelectsUnitExpectation('Scenario1');
                TestExpectationActions.designerSelectsUnitPermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');
                TestExpectationActions.designerSelectsUnitPermutationValue('Scenario1', 'Permutation1', 'PermutationValue2');

                // Test Results are in...
                TestFixtures.writeUnitTestResults_MeteorMocha('Location1', unitResultsComboFail);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerUnitTestExpectationResultForScenarioIs('Scenario1', MashTestStatus.MASH_FAIL);
            });


            it('Test Type - Integration', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                // Expectation of two test values for Scenario 1
                TestExpectationActions.designerSelectsIntegrationExpectation('Scenario1');
                TestExpectationActions.designerSelectsIntegrationPermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');
                TestExpectationActions.designerSelectsIntegrationPermutationValue('Scenario1', 'Permutation1', 'PermutationValue2');

                // Test Results are in...
                TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intAccResultsComboFail);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerIntegrationTestExpectationResultForScenarioIs('Scenario1', MashTestStatus.MASH_FAIL);
            });


            it('Test Type - Acceptance', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                // Expectation of two test values for Scenario 1
                TestExpectationActions.designerSelectsAcceptanceExpectation('Scenario1');
                TestExpectationActions.designerSelectsAcceptancePermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');
                TestExpectationActions.designerSelectsAcceptancePermutationValue('Scenario1', 'Permutation1', 'PermutationValue2');

                // Test Results are in...
                TestFixtures.writeAcceptanceTestResults_ChimpMocha('Location1', intAccResultsComboFail);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerAcceptanceTestExpectationResultForScenarioIs('Scenario1', MashTestStatus.MASH_FAIL);
            });

        });

        describe('A Scenario with Design Permutations is updated with a Pass test outcome if all Permutation Values for the Scenario have a passing test', function(){

            it('Test Type - Unit', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                // Expectation of two test values for Scenario 1
                TestExpectationActions.designerSelectsUnitExpectation('Scenario1');
                TestExpectationActions.designerSelectsUnitPermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');
                TestExpectationActions.designerSelectsUnitPermutationValue('Scenario1', 'Permutation1', 'PermutationValue2');

                // Test Results are in...
                TestFixtures.writeUnitTestResults_MeteorMocha('Location1', unitResultsComboPass);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerUnitTestExpectationResultForScenarioIs('Scenario1', MashTestStatus.MASH_PASS);
            });


            it('Test Type - Integration', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                // Expectation of two test values for Scenario 1
                TestExpectationActions.designerSelectsIntegrationExpectation('Scenario1');
                TestExpectationActions.designerSelectsIntegrationPermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');
                TestExpectationActions.designerSelectsIntegrationPermutationValue('Scenario1', 'Permutation1', 'PermutationValue2');

                // Test Results are in...
                TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intAccResultsComboPass);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerIntegrationTestExpectationResultForScenarioIs('Scenario1', MashTestStatus.MASH_PASS);
            });


            it('Test Type - Acceptance', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                // Expectation of two test values for Scenario 1
                TestExpectationActions.designerSelectsAcceptanceExpectation('Scenario1');
                TestExpectationActions.designerSelectsAcceptancePermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');
                TestExpectationActions.designerSelectsAcceptancePermutationValue('Scenario1', 'Permutation1', 'PermutationValue2');

                // Test Results are in...
                TestFixtures.writeAcceptanceTestResults_ChimpMocha('Location1', intAccResultsComboPass);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerAcceptanceTestExpectationResultForScenarioIs('Scenario1', MashTestStatus.MASH_PASS);
            });

        });

        describe('A Scenario with Design Permutations is updated with an Incomplete test outcome if some Permutation Values for the Scenario have a passing test and there are no failures', function(){

            it('Test Type - Unit', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                // Expectation of two test values for Scenario 1
                TestExpectationActions.designerSelectsUnitExpectation('Scenario1');
                TestExpectationActions.designerSelectsUnitPermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');
                TestExpectationActions.designerSelectsUnitPermutationValue('Scenario1', 'Permutation1', 'PermutationValue2');

                // Test Results are in...
                TestFixtures.writeUnitTestResults_MeteorMocha('Location1', unitResultsComboIncomplete);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerUnitTestExpectationResultForScenarioIs('Scenario1', MashTestStatus.MASH_INCOMPLETE);
            });


            it('Test Type - Integration', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                // Expectation of two test values for Scenario 1
                TestExpectationActions.designerSelectsIntegrationExpectation('Scenario1');
                TestExpectationActions.designerSelectsIntegrationPermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');
                TestExpectationActions.designerSelectsIntegrationPermutationValue('Scenario1', 'Permutation1', 'PermutationValue2');

                // Test Results are in...
                TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intAccResultsComboIncomplete);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerIntegrationTestExpectationResultForScenarioIs('Scenario1', MashTestStatus.MASH_INCOMPLETE);
            });


            it('Test Type - Acceptance', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                // Expectation of two test values for Scenario 1
                TestExpectationActions.designerSelectsAcceptanceExpectation('Scenario1');
                TestExpectationActions.designerSelectsAcceptancePermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');
                TestExpectationActions.designerSelectsAcceptancePermutationValue('Scenario1', 'Permutation1', 'PermutationValue2');

                // Test Results are in...
                TestFixtures.writeAcceptanceTestResults_ChimpMocha('Location1', intAccResultsComboIncomplete);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerAcceptanceTestExpectationResultForScenarioIs('Scenario1', MashTestStatus.MASH_INCOMPLETE);
            });

        });

        describe('A Scenario with Design Permutations is updated with a Missing test outcome no test is found for any Permutation Value for the Scenario', function(){

            it('Test Type - Unit', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                // Expectation of two test values for Scenario 1
                TestExpectationActions.designerSelectsUnitExpectation('Scenario1');
                TestExpectationActions.designerSelectsUnitPermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');
                TestExpectationActions.designerSelectsUnitPermutationValue('Scenario1', 'Permutation1', 'PermutationValue2');

                // Test Results are in...
                TestFixtures.writeUnitTestResults_MeteorMocha('Location1', unitResultsComboMissing);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerUnitTestExpectationResultForScenarioIs('Scenario1', MashTestStatus.MASH_NO_TESTS);
            });


            it('Test Type - Integration', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                // Expectation of two test values for Scenario 1
                TestExpectationActions.designerSelectsIntegrationExpectation('Scenario1');
                TestExpectationActions.designerSelectsIntegrationPermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');
                TestExpectationActions.designerSelectsIntegrationPermutationValue('Scenario1', 'Permutation1', 'PermutationValue2');

                // Test Results are in...
                TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intAccResultsComboMissing);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerIntegrationTestExpectationResultForScenarioIs('Scenario1', MashTestStatus.MASH_NO_TESTS);
            });


            it('Test Type - Acceptance', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                // Expectation of two test values for Scenario 1
                TestExpectationActions.designerSelectsAcceptanceExpectation('Scenario1');
                TestExpectationActions.designerSelectsAcceptancePermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');
                TestExpectationActions.designerSelectsAcceptancePermutationValue('Scenario1', 'Permutation1', 'PermutationValue2');

                // Test Results are in...
                TestFixtures.writeAcceptanceTestResults_ChimpMocha('Location1', intAccResultsComboMissing);

                // Call Refresh Test Data
                // Go to DV and display the Test Summary
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();

                // Check Test Results
                TestResultVerifications.designerAcceptanceTestExpectationResultForScenarioIs('Scenario1', MashTestStatus.MASH_NO_TESTS);
            });

        });
    });

    describe('Consequences', function(){

        it.skip('When test data is updated by a Developer any modifications to Scenarios made by that Developer are included in the update', function(){
            // Replace this with test code
            // Remove skip once implemented
        });

        it.skip('Modifications to the Design made by other users are included when test data is refreshed', function(){
            // Replace this with test code
            // Remove skip once implemented
        });

    });
});
