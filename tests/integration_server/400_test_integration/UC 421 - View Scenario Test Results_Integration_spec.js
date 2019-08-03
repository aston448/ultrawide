import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { DesignComponentActions }       from '../../../test_framework/test_wrappers/design_component_actions.js';
import { TestExpectationActions }       from '../../../test_framework/test_wrappers/test_expectation_actions.js';
import {OutputLocationsActions}         from "../../../test_framework/test_wrappers/output_locations_actions";
import {TestIntegrationActions}         from "../../../test_framework/test_wrappers/test_integration_actions";
import {TestResultVerifications}        from "../../../test_framework/test_wrappers/test_result_verifications";

import {MashTestStatus, RoleType, TestLocationFileType, TestRunner} from "../../../imports/constants/constants";
import {DefaultLocationText} from "../../../imports/constants/default_names";


// Common code


describe('UC 421 - View Scenario Test Results', function(){

    before(function(){

        TestFixtures.logTestSuite('UC 421 - View Scenario Test Results');

        // NOTE: Much faster to only set the data up once - but be aware that it is persisting for all tests.
        // Test results files overwrite each other for each test

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();

        // Make sure the DV is published
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');

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

        // All users are getting their tests from same location...

        // Designer sets up location config
        OutputLocationsActions.designerEditsTestLocationConfig();
        OutputLocationsActions.designerSelectsAccTestsInConfigForLocation('Location1');
        OutputLocationsActions.designerSelectsIntTestsInConfigForLocation('Location1');
        OutputLocationsActions.designerSelectsUnitTestsInConfigForLocation('Location1');

        // Developer sets up location config
        OutputLocationsActions.developerEditsTestLocationConfig();
        OutputLocationsActions.developerSelectsAccTestsInConfigForLocation('Location1');
        OutputLocationsActions.developerSelectsIntTestsInConfigForLocation('Location1');
        OutputLocationsActions.developerSelectsUnitTestsInConfigForLocation('Location1');

        // Manager sets up location config
        OutputLocationsActions.managerEditsTestLocationConfig();
        OutputLocationsActions.managerSelectsAccTestsInConfigForLocation('Location1');
        OutputLocationsActions.managerSelectsIntTestsInConfigForLocation('Location1');
        OutputLocationsActions.managerSelectsUnitTestsInConfigForLocation('Location1');

    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });


    // Common functions
    function specifyAndTestScenario1Expectations(unitResults, intResults, accResults, userRole=RoleType.DESIGNER){

        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');

        // Unit test for scenario1
        DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
        TestExpectationActions.designerSelectsUnitExpectation('Scenario1');

        // Int test for Scenario1
        DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
        TestExpectationActions.designerSelectsIntegrationExpectation('Scenario1');

        // Acc test for Scenario1
        DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
        TestExpectationActions.designerSelectsAcceptanceExpectation('Scenario1');

        // Test Results are in...
        TestFixtures.writeUnitTestResults_MeteorMocha('Location1', unitResults);
        TestFixtures.writeIntegrationTestResults_ChimpMocha('Location1', intResults);
        TestFixtures.writeAcceptanceTestResults_ChimpMocha('Location1', accResults);

        // Call Refresh Test Data
        // Go to DV and refresh the Test Results
        switch(userRole){
            case RoleType.DESIGNER:
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.designerRefreshesTestResultsForBaseDesignVersion();
                break;
            case RoleType.DEVELOPER:
                DesignActions.developerWorksOnDesign('Design1');
                DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.developerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.developerRefreshesTestResultsForBaseDesignVersion();
                break;
            case RoleType.MANAGER:
                DesignActions.managerWorksOnDesign('Design1');
                DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.managerViewsDesignVersion('DesignVersion1');
                TestIntegrationActions.managerRefreshesTestResultsForBaseDesignVersion();
                break;
        }

    }

    describe('Interface Data', function(){


        describe('A Scenario Test Expectation result shown contains a Test Type, a Test Name and the Test Result', function(){

            it.skip('Test Type - Unit', function(){
                // Replace this with test code
                // Remove skip once implemented
            });


            it.skip('Test Type - Integration', function(){
                // Replace this with test code
                // Remove skip once implemented
            });


            it.skip('Test Type - Acceptance', function(){
                // Replace this with test code
                // Remove skip once implemented
            });

        });

        describe('A Scenario Design Permutation Test Expectation result contains a Test Type, Permutation Value, Test Name and the Test Result', function(){

            it.skip('Test Type - Unit', function(){
                // Replace this with test code
                // Remove skip once implemented
            });


            it.skip('Test Type - Integration', function(){
                // Replace this with test code
                // Remove skip once implemented
            });


            it.skip('Test Type - Acceptance', function(){
                // Replace this with test code
                // Remove skip once implemented
            });

        });

        describe('The Test Name contains test module and test name information where this is available in the test', function(){

            it.skip('Test Type - Unit', function(){
                // Replace this with test code
                // Remove skip once implemented
            });


            it.skip('Test Type - Integration', function(){
                // Replace this with test code
                // Remove skip once implemented
            });


            it.skip('Test Type - Acceptance', function(){
                // Replace this with test code
                // Remove skip once implemented
            });

        });

        describe('A Scenario overall test result is shown as Incomplete if any expected tests are missing for that Scenario', function(){

            it('Test Type - Unit Missing', function(){

                // Unit has missing - Acc and Int are OK

                const unitResults = {
                    scenarios: [
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

                // Run test
                specifyAndTestScenario1Expectations(unitResults, intAccResults, intAccResults);

                // Check Test Results
                TestResultVerifications.designerScenarioOverallTestResultIs('Scenario1', MashTestStatus.MASH_INCOMPLETE);
            });


            it('Test Type - Integration Missing', function(){

                // Int has missing - Acc and Unit are OK

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

                const intResults = [
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

                const accResults = [
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

                // Run test
                specifyAndTestScenario1Expectations(unitResults, intResults, accResults);

                // Check Test Results
                TestResultVerifications.designerScenarioOverallTestResultIs('Scenario1', MashTestStatus.MASH_INCOMPLETE);
            });


            it('Test Type - Acceptance Missing', function(){

                // Acc has missing - Int and Unit are OK

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

                const intResults = [
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

                const accResults = [
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

                // Run test
                specifyAndTestScenario1Expectations(unitResults, intResults, accResults);

                // Check Test Results
                TestResultVerifications.designerScenarioOverallTestResultIs('Scenario1', MashTestStatus.MASH_INCOMPLETE);
            });

        });

        it('A Scenario overall test result is shown as Incomplete if all expected tests are missing for that Scenario', function(){

            const unitResults = {
                scenarios: [
                    {
                        scenarioName: 'Scenario2',
                        scenarioGroup: 'JSX Test',
                        unitResults: [
                            {
                                resultName: '',
                                resultOutcome: MashTestStatus.MASH_FAIL
                            }
                        ]
                    }
                ]
            };

            const intResults = [
                {
                    scenarioName: 'Scenario2',
                    testName: '',
                    result: MashTestStatus.MASH_FAIL
                }
            ];

            const accResults = [
                {
                    scenarioName: 'Scenario2',
                    testName: '',
                    result: MashTestStatus.MASH_FAIL
                }
            ];

            // Run test
            specifyAndTestScenario1Expectations(unitResults, intResults, accResults);

            // Check Test Results
            TestResultVerifications.designerScenarioOverallTestResultIs('Scenario1', MashTestStatus.MASH_INCOMPLETE);


        });


        describe('A Scenario overall test result is shown as Incomplete if any expected tests are pending for that Scenario', function(){

            it('Test Type - Unit Pending', function(){

                const unitResults = {
                    scenarios: [
                        {
                            scenarioName: 'Scenario1',
                            scenarioGroup: 'JSX Test',
                            unitResults: [
                                {
                                    resultName: '',
                                    resultOutcome: MashTestStatus.MASH_PENDING
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
                        }
                    ]
                };

                const intResults = [
                    {
                        scenarioName: 'Scenario1',
                        testName: '',
                        result: MashTestStatus.MASH_PASS
                    },
                    {
                        scenarioName: 'Scenario2',
                        testName: '',
                        result: MashTestStatus.MASH_FAIL
                    }
                ];

                const accResults = [
                    {
                        scenarioName: 'Scenario1',
                        testName: '',
                        result: MashTestStatus.MASH_PASS
                    },
                    {
                        scenarioName: 'Scenario2',
                        testName: '',
                        result: MashTestStatus.MASH_FAIL
                    }
                ];

                // Run test
                specifyAndTestScenario1Expectations(unitResults, intResults, accResults);

                // Check Test Results
                TestResultVerifications.designerScenarioOverallTestResultIs('Scenario1', MashTestStatus.MASH_INCOMPLETE);

            });

            it('Test Type - Acceptance Pending', function(){

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
                        }
                    ]
                };

                const intResults = [
                    {
                        scenarioName: 'Scenario1',
                        testName: '',
                        result: MashTestStatus.MASH_PASS
                    },
                    {
                        scenarioName: 'Scenario2',
                        testName: '',
                        result: MashTestStatus.MASH_FAIL
                    }
                ];

                const accResults = [
                    {
                        scenarioName: 'Scenario1',
                        testName: '',
                        result: MashTestStatus.MASH_PENDING
                    },
                    {
                        scenarioName: 'Scenario2',
                        testName: '',
                        result: MashTestStatus.MASH_FAIL
                    }
                ];

                // Run test
                specifyAndTestScenario1Expectations(unitResults, intResults, accResults);

                // Check Test Results
                TestResultVerifications.designerScenarioOverallTestResultIs('Scenario1', MashTestStatus.MASH_INCOMPLETE);

            });


            it('Test Type - Integration Pending', function(){

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
                        }
                    ]
                };

                const intResults = [
                    {
                        scenarioName: 'Scenario1',
                        testName: '',
                        result: MashTestStatus.MASH_PENDING
                    },
                    {
                        scenarioName: 'Scenario2',
                        testName: '',
                        result: MashTestStatus.MASH_FAIL
                    }
                ];

                const accResults = [
                    {
                        scenarioName: 'Scenario1',
                        testName: '',
                        result: MashTestStatus.MASH_PASS
                    },
                    {
                        scenarioName: 'Scenario2',
                        testName: '',
                        result: MashTestStatus.MASH_FAIL
                    }
                ];

                // Run test
                specifyAndTestScenario1Expectations(unitResults, intResults, accResults);

                // Check Test Results
                TestResultVerifications.designerScenarioOverallTestResultIs('Scenario1', MashTestStatus.MASH_INCOMPLETE);

            });

        });

        it('A Scenario overall test result is shown as Pass if all expected tests for that Scenario are passing', function(){

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
                    }
                ]
            };

            const intResults = [
                {
                    scenarioName: 'Scenario1',
                    testName: '',
                    result: MashTestStatus.MASH_PASS
                },
                {
                    scenarioName: 'Scenario2',
                    testName: '',
                    result: MashTestStatus.MASH_FAIL
                }
            ];

            const accResults = [
                {
                    scenarioName: 'Scenario1',
                    testName: '',
                    result: MashTestStatus.MASH_PASS
                },
                {
                    scenarioName: 'Scenario2',
                    testName: '',
                    result: MashTestStatus.MASH_FAIL
                }
            ];

            // Run test
            specifyAndTestScenario1Expectations(unitResults, intResults, accResults);

            // Check Test Results
            TestResultVerifications.designerScenarioOverallTestResultIs('Scenario1', MashTestStatus.MASH_PASS);
        });


        describe('A Scenario overall test result is shown as Fail if any tests for that Scenario are failing', function(){

            it('Test Type - Unit Failing', function(){

                const unitResults = {
                    scenarios: [
                        {
                            scenarioName: 'Scenario1',
                            scenarioGroup: 'JSX Test',
                            unitResults: [
                                {
                                    resultName: '',
                                    resultOutcome: MashTestStatus.MASH_FAIL
                                }
                            ]
                        },
                        {
                            scenarioName: 'Scenario2',
                            scenarioGroup: 'JSX Test',
                            unitResults: [
                                {
                                    resultName: '',
                                    resultOutcome: MashTestStatus.MASH_PASS
                                }
                            ]
                        }
                    ]
                };

                const intResults = [
                    {
                        scenarioName: 'Scenario1',
                        testName: '',
                        result: MashTestStatus.MASH_PASS
                    },
                    {
                        scenarioName: 'Scenario2',
                        testName: '',
                        result: MashTestStatus.MASH_PASS
                    }
                ];

                const accResults = [
                    {
                        scenarioName: 'Scenario1',
                        testName: '',
                        result: MashTestStatus.MASH_PASS
                    },
                    {
                        scenarioName: 'Scenario2',
                        testName: '',
                        result: MashTestStatus.MASH_PASS
                    }
                ];

                // Run test
                specifyAndTestScenario1Expectations(unitResults, intResults, accResults);

                // Check Test Results
                TestResultVerifications.designerScenarioOverallTestResultIs('Scenario1', MashTestStatus.MASH_FAIL);

            });


            it('Test Type - Integration Failing', function(){

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
                                    resultOutcome: MashTestStatus.MASH_PASS
                                }
                            ]
                        }
                    ]
                };

                const intResults = [
                    {
                        scenarioName: 'Scenario1',
                        testName: '',
                        result: MashTestStatus.MASH_FAIL
                    },
                    {
                        scenarioName: 'Scenario2',
                        testName: '',
                        result: MashTestStatus.MASH_PASS
                    }
                ];

                const accResults = [
                    {
                        scenarioName: 'Scenario1',
                        testName: '',
                        result: MashTestStatus.MASH_PASS
                    },
                    {
                        scenarioName: 'Scenario2',
                        testName: '',
                        result: MashTestStatus.MASH_PASS
                    }
                ];

                // Run test
                specifyAndTestScenario1Expectations(unitResults, intResults, accResults);

                // Check Test Results
                TestResultVerifications.designerScenarioOverallTestResultIs('Scenario1', MashTestStatus.MASH_FAIL);

            });


            it('Test Type - Acceptance', function(){

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
                                    resultOutcome: MashTestStatus.MASH_PASS
                                }
                            ]
                        }
                    ]
                };

                const intResults = [
                    {
                        scenarioName: 'Scenario1',
                        testName: '',
                        result: MashTestStatus.MASH_PASS
                    },
                    {
                        scenarioName: 'Scenario2',
                        testName: '',
                        result: MashTestStatus.MASH_PASS
                    }
                ];

                const accResults = [
                    {
                        scenarioName: 'Scenario1',
                        testName: '',
                        result: MashTestStatus.MASH_FAIL
                    },
                    {
                        scenarioName: 'Scenario2',
                        testName: '',
                        result: MashTestStatus.MASH_PASS
                    }
                ];

                // Run test
                specifyAndTestScenario1Expectations(unitResults, intResults, accResults);

                // Check Test Results
                TestResultVerifications.designerScenarioOverallTestResultIs('Scenario1', MashTestStatus.MASH_FAIL);
            });

        });
    });

    describe('Actions', function(){

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
                            resultOutcome: MashTestStatus.MASH_PASS
                        }
                    ]
                }
            ]
        };

        const intResults = [
            {
                scenarioName: 'Scenario1',
                testName: '',
                result: MashTestStatus.MASH_FAIL
            },
            {
                scenarioName: 'Scenario2',
                testName: '',
                result: MashTestStatus.MASH_PASS
            }
        ];

        const accResults = [
            {
                scenarioName: 'Scenario1',
                testName: '',
                result: MashTestStatus.MASH_PENDING
            },
            {
                scenarioName: 'Scenario2',
                testName: '',
                result: MashTestStatus.MASH_PASS
            }
        ];

        it('A Designer may view test results for a Feature', function(){
            // Test that GUI data is as expected for a Feature Scenario for a Designer

            // Run test
            specifyAndTestScenario1Expectations(unitResults, intResults, accResults, RoleType.DESIGNER);

            // Check GUI Data for Designer
            TestResultVerifications.designerTestExpectationResultDataIs('Scenario1', MashTestStatus.MASH_PASS, MashTestStatus.MASH_FAIL, MashTestStatus.MASH_PENDING);
        });

        it('A Manager may view test results for a Feature', function(){
            // Test that GUI data is as expected for a Feature Scenario for a Manager

            // Run test
            specifyAndTestScenario1Expectations(unitResults, intResults, accResults, RoleType.MANAGER);

            // Check GUI Data for Manager
            TestResultVerifications.managerTestExpectationResultDataIs('Scenario1', MashTestStatus.MASH_PASS, MashTestStatus.MASH_FAIL, MashTestStatus.MASH_PENDING);
        });

        it('A Developer may view test results for a Feature', function(){
            // Test that GUI data is as expected for a Feature Scenario for a Developer

            // Run test
            specifyAndTestScenario1Expectations(unitResults, intResults, accResults, RoleType.DEVELOPER);

            // Check GUI Data for Developer
            TestResultVerifications.developerTestExpectationResultDataIs('Scenario1', MashTestStatus.MASH_PASS, MashTestStatus.MASH_FAIL, MashTestStatus.MASH_PENDING);
        });
    });

    describe('Conditions', function(){

        it.skip('In a Work Package, only test results for Scenarios in scope for that Work Package are shown', function(){
            // Replace this with test code
            // Remove skip once implemented
        });

    });
});
