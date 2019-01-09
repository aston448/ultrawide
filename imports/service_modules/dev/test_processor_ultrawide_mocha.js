import fs from 'fs';

import { MashTestStatus, TestType, ComponentType, LogLevel} from '../../constants/constants.js';
import {log} from '../../common/utils.js';

// Data Access
import { UserUnitTestResultData }               from '../../data/test_results/user_unit_test_result_db.js';
import { UserIntegrationTestResultData }        from '../../data/test_results/user_integration_test_result_db.js';
import { UserAcceptanceTestResultData }         from '../../data/test_results/user_acceptance_test_result_db.js';
import {DesignComponentData}                    from "../../data/design/design_component_db";
import {DesignUpdateComponentData}              from "../../data/design_update/design_update_component_db";
import {ScenarioTestExpectationData}            from "../../data/design/scenario_test_expectations_db";
import {DesignPermutationData}                  from "../../data/design/design_permutation_db";
import {DesignPermutationValueData}             from '../../data/design/design_permutation_value_db.js';


// Plugin class to read test results from an ultrawide-mocha-reporter JSON file
class UltrawideMochaTestServicesClass{

    getJsonTestResults(resultsFile, userId, testType){

        if(Meteor.isServer) {

            log((msg) => console.log(msg), LogLevel.DEBUG, "Opening file {}.", resultsFile);

            // Read ----------------------------------------------------------------------------------------------------
            let resultsText = '';
            let cleanText = '';

            try {
                resultsText = fs.readFileSync(resultsFile);

            } catch (e) {
                log((msg) => console.log(msg), LogLevel.ERROR, "Failed to open meteor mocha tests file: {}", e);
                return [];
            }

            // Parse ---------------------------------------------------------------------------------------------------
            let resultsJson = null;

            //log((msg) => console.log(msg), LogLevel.DEBUG, "  Original File = {}", resultsText);


            try{
                resultsJson = JSON.parse(resultsText);
                //log((msg) => console.log(msg), LogLevel.DEBUG, "  First Pass = {}", resultsJson.substr(1, 1000));

                //resultsJson = JSON.parse(resultsJson);

            } catch (e) {
                log((msg) => console.log(msg), LogLevel.ERROR, "Failed to parse meteor mocha tests file: {}", e);
                return [];
            }

            // Store Standard Data -------------------------------------------------------------------------------------

            // testFullName must always contain the Scenario as all of part of it.  May also contain test Suite Group and Name as well
            // If it contains these it should be in the form 'Suite Group Name'

            //log((msg) => console.log(msg), LogLevel.DEBUG, "  JSON Passes Count = {}", resultsJson.passes.length);

            if(resultsJson) {

                let resultsBatch = [];

                // Add latest results
                if(resultsJson.passes) {
                    resultsJson.passes.forEach((test) => {

                        resultsBatch.push(
                            {
                                userId: userId,
                                testFullName: test.fullTitle,
                                testSuite: 'NONE',             // Not yet calculated
                                testGroup: 'NONE',             // Not yet calculated
                                testName: test.title,
                                testResult: MashTestStatus.MASH_PASS,
                                testError: '',
                                testErrorReason: '',
                                testDuration: test.duration,
                                testStackTrace: '',
                            }
                        );
                    });
                }

                if(resultsJson.failures) {
                    resultsJson.failures.forEach((test) => {

                        resultsBatch.push(
                            {
                                userId: userId,
                                testFullName: test.fullTitle,
                                testSuite: 'NONE',             // Not yet calculated
                                testGroup: 'NONE',             // Not yet calculated
                                testName: test.title,
                                testResult: MashTestStatus.MASH_FAIL,
                                testError: test.err.message,
                                testErrorReason: 'Expected "' + test.err.expected + '" but got "' + test.err.actual + '"',
                                testDuration: test.duration,
                                testStackTrace: test.err.stack
                            }
                        );
                    });
                }

                if(resultsJson.pending) {
                    resultsJson.pending.forEach((test) => {

                        resultsBatch.push(
                            {
                                userId: userId,
                                testFullName: test.fullTitle,
                                testName: test.title,
                                testSuite: 'NONE',             // Not yet calculated
                                testGroup: 'NONE',             // Not yet calculated
                                testResult: MashTestStatus.MASH_PENDING,
                                testError: '',
                                testErrorReason: '',
                                testDuration: 0,
                                testStackTrace: ''
                            }
                        );
                    });
                }

                log((msg) => console.log(msg), LogLevel.DEBUG, "    New batches populated.");

                if (resultsBatch.length > 0) {
                    switch(testType){
                        case TestType.ACCEPTANCE:
                            log((msg) => console.log(msg), LogLevel.DEBUG, "    Inserting {} acc results...", resultsBatch.length);
                            UserAcceptanceTestResultData.bulkInsertData(resultsBatch);
                            break;
                        case TestType.INTEGRATION:
                            log((msg) => console.log(msg), LogLevel.DEBUG, "    Inserting {} int results...", resultsBatch.length);
                            UserIntegrationTestResultData.bulkInsertData(resultsBatch);
                            break;
                        case TestType.UNIT:
                            log((msg) => console.log(msg), LogLevel.DEBUG, "    Inserting {} unit results...", resultsBatch.length);
                            UserUnitTestResultData.bulkInsertData(resultsBatch);
                            break;
                    }
                }

                log((msg) => console.log(msg), LogLevel.DEBUG, "    New data inserted.");

                log((msg) => console.log(msg), LogLevel.DEBUG, "DONE Ultrawide Mocha results");

            } else {
                log((msg) => console.log(msg), LogLevel.WARNING, "File <{}> had no data.", resultsFile);
            }
        }
    };

    generateTestTemplateFile(userContext, outputDir, testType){

        if(Meteor.isServer) {

            // Get the selected Feature - already validated that current item is a Feature
            let feature = null;
            const baseDesignTest = (userContext.designUpdateId === 'NONE');

            // Are we working from an Initial Design or a Design Update?
            if(baseDesignTest) {
                feature = DesignComponentData.getDesignComponentById(userContext.designComponentId);
            } else {
                feature = DesignUpdateComponentData.getUpdateComponentById(userContext.designComponentId);
            }

            if(!feature){
                log((msg) => console.log(msg), LogLevel.ERROR, "No Feature found");
                return;
            }

            const fileName = feature.componentNameNew + '_' + testType + '_spec.js';

            log((msg) => console.log(msg), LogLevel.DEBUG, "Writing {} test file {}", testType, fileName);


            // Safety - don't export if file exists to prevent accidental overwrite of good data
            if(fs.existsSync(outputDir + fileName)){
                log((msg) => console.log(msg), LogLevel.DEBUG, "File {} already exists, not overwriting.", fileName);
                throw new Meteor.Error("FILE_EXISTS", "Integration test exists already for this Feature.  Remove file first if you want to replace it");
            }

            let fileText = '';

            // Add the top parts
            fileText += "describe('" + feature.componentNameNew + "', function(){\n";
            fileText += "\n";
            fileText += "    before(function(){\n\n";
            fileText += "    });";
            fileText += "\n";
            fileText += "\n";
            fileText += "    after(function(){\n\n";
            fileText += "    });";
            fileText += "\n";
            fileText += "\n";
            fileText += "    beforeEach(function(){\n\n";
            fileText += "    });";
            fileText += "\n";
            fileText += "\n";
            fileText += "    afterEach(function(){\n\n";
            fileText += "    });";
            fileText += "\n";
            fileText += "\n";

            // Now loop through the Scenarios creating pending tests
            let featureAspects = [];

            if(baseDesignTest) {
                featureAspects = DesignComponentData.getFeatureAspects(userContext.designVersionId, feature.componentReferenceId);
            } else {
                featureAspects = DesignUpdateComponentData.getNonRemovedAspectsForFeature(userContext.designUpdateId, feature.componentReferenceId);
            }

            featureAspects.forEach((aspect) =>{
                let scenarios = [];

                if(baseDesignTest) {
                    scenarios = DesignComponentData.getChildComponentsOfType(userContext.designVersionId, ComponentType.SCENARIO, aspect.componentReferenceId)
                } else {
                    scenarios = DesignUpdateComponentData.getNonRemovedChildComponentsOfType(userContext.designUpdateId, ComponentType.SCENARIO, aspect.componentReferenceId);
                }

                // Add Feature aspect and scenarios if there are any test expectations
                let expectationTotal = 0;

                scenarios.forEach((scenario) => {
                    const testExpectations = ScenarioTestExpectationData.getScenarioTestExpectationsForScenarioTestType(userContext.designVersionId, scenario.componentReferenceId, testType);
                    expectationTotal += testExpectations.length;
                });

                if(scenarios.length > 0 && expectationTotal > 0) {

                    fileText += "\n    describe('" + aspect.componentNameNew + "', function(){\n\n";

                    scenarios.forEach((scenario) => {

                        // See if there are any test expectations for tests

                        const testExpectations = ScenarioTestExpectationData.getScenarioTestExpectationsForScenarioTestType(userContext.designVersionId, scenario.componentReferenceId, testType);

                        if(testExpectations.length === 1){

                            // Just one test, no permutations

                            fileText += "        it('" + scenario.componentNameNew + "', function(){\n            // Replace this with test code\n            expect.fail(null, null, 'Test not implemented yet');\n        });\n\n";

                        } else {

                            if(testExpectations.length > 1){

                                fileText += "\n        describe('" + scenario.componentNameNew + "', function(){\n";

                                // We have permutations - get a list of unique ones
                                let perms = [];
                                testExpectations.forEach((expectation) =>{

                                    if(expectation.permutationId !== 'NONE') {

                                        if (!perms.includes(expectation.permutationId)) {
                                            perms.push(expectation.permutationId);
                                        }
                                    }
                                });

                                // For each permutation value add a test
                                perms.forEach((permId) =>{

                                    const permName = DesignPermutationData.getDesignPermutationById(permId).permutationName;
                                    const expectationValues = ScenarioTestExpectationData.getPermutationValuesForScenarioTestTypePerm(userContext.designVersionId, scenario.componentReferenceId, testType, permId);

                                    expectationValues.forEach((expectationValue) => {

                                        const permValue = DesignPermutationValueData.getDesignPermutationValueById(expectationValue.permutationValueId);

                                        fileText += "\n            it('" + permName + ' - ' + permValue.permutationValueName + "', function(){\n                /// Replace this with test code\n            expect.fail(null, null, 'Test not implemented yet');\n            });\n\n";
                                    });

                                });

                                // End scenario describe
                                fileText += "        });\n"
                            }
                        }

                    });

                    // End aspect describe
                    fileText += "    });\n"
                }

            });

            // And tidy up the bottom
            fileText += "});\n";

            // And write the file
            fs.writeFileSync(outputDir + fileName, fileText);

            log((msg) => console.log(msg), LogLevel.DEBUG, "File written: {}", fileName);
        }

    }


    generateFeatureUnitTestTemplate(userContext, outputDir){

        if(Meteor.isServer) {

            // Get the selected Feature - already validated that current item is a Feature
            let feature = null;
            const baseDesignTest = (userContext.designUpdateId === 'NONE');

            // Are we working from an Initial Design or a Design Update?
            if(baseDesignTest) {
                feature = DesignComponentData.getDesignComponentById(userContext.designComponentId);
            } else {
                feature = DesignUpdateComponentData.getUpdateComponentById(userContext.designComponentId);
            }

            if(!feature){
                log((msg) => console.log(msg), LogLevel.ERROR, "No Feature found");
                return;
            }

            const fileName = feature.componentNameNew + '_unit_tests.js';

            log((msg) => console.log(msg), LogLevel.DEBUG, "Writing unit test file {}", fileName);


            // Safety - don't export if file exists to prevent accidental overwrite of good data
            if(fs.existsSync(outputDir + fileName)){
                log((msg) => console.log(msg), LogLevel.DEBUG, "File {} already exists, not overwriting.", fileName);
                throw new Meteor.Error("FILE_EXISTS", "Integration test exists already for this Feature.  Remove file first if you want to replace it");
            }

            let fileText = '';

            // Feature placeholder - probably to be discarded
            fileText += "describe('" + feature.componentNameNew + "', function(){\n";
            fileText += "\n";
            fileText += "\n";

            // Now loop through the Scenarios creating pending tests
            let featureAspects = [];

            if(baseDesignTest) {
                featureAspects = DesignComponentData.getFeatureAspects(userContext.designVersionId, feature.componentReferenceId);
            } else {
                featureAspects = DesignUpdateComponentData.getNonRemovedAspectsForFeature(userContext.designUpdateId, feature.componentReferenceId);
            }

            featureAspects.forEach((aspect) =>{
                let scenarios = [];

                if(baseDesignTest) {
                    scenarios = DesignComponentData.getChildComponentsOfType(userContext.designVersionId, ComponentType.SCENARIO, aspect.componentReferenceId)
                } else {
                    scenarios = DesignUpdateComponentData.getNonRemovedChildComponentsOfType(userContext.designUpdateId, ComponentType.SCENARIO, aspect.componentReferenceId);
                }

                // Add Feature aspect and scenarios if there are any test expectations
                let expectationTotal = 0;

                scenarios.forEach((scenario) => {
                    const unitestExpectations = ScenarioTestExpectationData.getScenarioTestExpectationsForScenarioTestType(userContext.designVersionId, scenario.componentReferenceId, TestType.UNIT);
                    expectationTotal += unitestExpectations.length;
                });

                if(scenarios.length > 0 && expectationTotal > 0) {

                    fileText += "\n    describe('" + aspect.componentNameNew + "', function(){\n\n";

                    scenarios.forEach((scenario) => {

                        // See if there are any test expectations for Unit tests

                        const unitTestExpectations = ScenarioTestExpectationData.getScenarioTestExpectationsForScenarioTestType(userContext.designVersionId, scenario.componentReferenceId, TestType.UNIT);

                        if(unitTestExpectations.length === 1){

                            // Just one unit test, no permutations

                            fileText += "        it('" + scenario.componentNameNew + "', function(){\n            // Replace this with test code\n            expect.fail(null, null, 'Test not implemented yet');\n        });\n\n";

                        } else {

                            if(unitTestExpectations.length > 1){

                                fileText += "\n        describe('" + scenario.componentNameNew + "', function(){\n";

                                // We have permutations - get a list of unique ones
                                let perms = [];
                                unitTestExpectations.forEach((expectation) =>{

                                    if(expectation.permutationId !== 'NONE') {

                                        if (!perms.includes(expectation.permutationId)) {
                                            perms.push(expectation.permutationId);
                                        }
                                    }
                                });

                                // For each permutation value add a test
                                perms.forEach((permId) =>{

                                    const permName = DesignPermutationData.getDesignPermutationById(permId).permutationName;
                                    const expectationValues = ScenarioTestExpectationData.getPermutationValuesForScenarioTestTypePerm(userContext.designVersionId, scenario.componentReferenceId, TestType.UNIT, permId);

                                    expectationValues.forEach((expectationValue) => {

                                        const permValue = DesignPermutationValueData.getDesignPermutationValueById(expectationValue.permutationValueId);

                                        fileText += "\n            it('" + permName + ' - ' + permValue.permutationValueName + "', function(){\n                // Replace this with test code\n            expect.fail(null, null, 'Test not implemented yet');\n            });\n\n";
                                    });

                                });

                                // End scenario describe
                                fileText += "        });\n"
                            }
                        }

                    });

                    // End aspect describe
                    fileText += "    });\n"
                }

            });

            // And tidy up the bottom
            fileText += "});\n";

            // And write the file
            fs.writeFileSync(outputDir + fileName, fileText);

            log((msg) => console.log(msg), LogLevel.DEBUG, "File written: {}", fileName);
        }

    }

}

export const UltrawideMochaTestServices = new UltrawideMochaTestServicesClass();
