import fs from 'fs';

import { UserAccTestResults } from '../../collections/test_results/user_acc_test_results.js'

import { ComponentType, TestType, MashTestStatus, LogLevel }   from '../../constants/constants.js';
import {log}        from '../../common/utils.js';

// Plugin class to read test results from a chimp cucumber json output file
class ChimpMochaTestServices{

    getJsonTestResults(resultsFile, userId, testType){

        if(Meteor.isServer) {

            // Read ----------------------------------------------------------------------------------------------------
            let resultsText = '';

            try {
                resultsText = fs.readFileSync(resultsFile);
            } catch (e) {
                log((msg) => console.log(msg), LogLevel.ERROR, "Failed to open cucumber tests file: {}", e);
                return [];
            }

            // Clean ---------------------------------------------------------------------------------------------------

            // Not required for this plugin


            // Parse ---------------------------------------------------------------------------------------------------
            let resultsJson = [];

            if(resultsText.length > 0) {
                try {
                    resultsJson = JSON.parse(resultsText);
                } catch (e) {
                    log((msg) => console.log(msg), LogLevel.ERROR, "Failed to parse cucumber tests file: {}", e);
                    return [];
                }
            } else {
                log((msg) => console.log(msg), LogLevel.WARNING, "No acceptance test data found", e);
                return [];
            }


            // Store Standard Data -------------------------------------------------------------------------------------

            //log((msg) => console.log(msg), LogLevel.DEBUG, "Results: Passes {}, Fails {}, Pending {}", resultsJson.passes.length, resultsJson.failures.length, resultsJson.pending.length,);

            switch(testType){
                case TestType.ACCEPTANCE:

                    // Clear existing results for user
                    UserAccTestResults.remove({userId: userId});

                    resultsJson.forEach((result) => {
                        if (result.keyword === 'Feature') {
                            const featureName = result.name;
                            let featureTestStatus = MashTestStatus.MASH_PASS;

                            result.elements.forEach((element) => {
                                if (element.keyword === 'Scenario') {
                                    const scenarioName = element.name;
                                    let scenarioTestStatus = MashTestStatus.MASH_PASS;
                                    let scenarioError = '';

                                    element.steps.forEach((step) => {
                                        if (step.result.status != 'passed') {
                                            scenarioTestStatus = MashTestStatus.MASH_FAIL;
                                            featureTestStatus = MashTestStatus.MASH_FAIL;
                                            scenarioError = step.result.error_message;
                                        }

                                        // Insert the Scenario Step Result
                                        UserAccTestResults.insert(
                                            {
                                                userId:             userId,
                                                componentType:      ComponentType.SCENARIO_STEP,
                                                featureName:        featureName,
                                                scenarioName:       scenarioName,
                                                stepName:           step.keyword + ' ' + step.name,
                                                testResult:         step.result.status,
                                                testError:          scenarioError,
                                                testErrorReason:    '',
                                                testDuration:       step.result.duration,
                                                stackTrace:         ''
                                            }
                                        );

                                    });

                                    // And also the Scenario Result
                                    UserAccTestResults.insert(
                                        {
                                            userId:             userId,
                                            componentType:      ComponentType.SCENARIO,
                                            featureName:        featureName,
                                            scenarioName:       scenarioName,
                                            stepName:           'NONE',
                                            testResult:         scenarioTestStatus,
                                            testError:          'See steps for failures',
                                            testErrorReason:    '',
                                            testDuration:       0,
                                            stackTrace:         ''
                                        }
                                    );

                                }
                            });

                            // And that the Feature is there
                            UserAccTestResults.insert(
                                {
                                    userId:             userId,
                                    componentType:      ComponentType.FEATURE,
                                    featureName:        featureName,
                                    scenarioName:       'NONE',
                                    stepName:           'NONE',
                                    testResult:         featureTestStatus,
                                    testError:          '',
                                    testErrorReason:    '',
                                    testDuration:       0,
                                    stackTrace:         ''
                                }
                            );
                        }
                    });
                    break;

                default:
            }

        }

    };


}

export default new ChimpMochaTestServices();