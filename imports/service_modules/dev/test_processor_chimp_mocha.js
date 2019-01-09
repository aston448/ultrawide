import fs from 'fs';

// Ultrawide Services
import {ComponentType, TestType, LogLevel}   from '../../constants/constants.js';
import {log}        from '../../common/utils.js';

// Data Access
import { DesignComponentData }                      from '../../data/design/design_component_db.js';
import { DesignUpdateComponentData }                from '../../data/design_update/design_update_component_db.js';
import {ScenarioTestExpectationData}                from "../../data/design/scenario_test_expectations_db";
import {DesignPermutationData}                      from "../../data/design/design_permutation_db";
import {DesignPermutationValueData}                 from '../../data/design/design_permutation_value_db.js';


// Plugin class to read test results from a screen scraped chimp mocha JSON reported file
class ChimpMochaTestServicesClass {

    writeIntegrationTestFile(userContext, outputDir){

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

            const fileName = feature.componentNameNew + '_spec.js';

            log((msg) => console.log(msg), LogLevel.DEBUG, "Writing integration test file {}", fileName);


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
                    const integrationTestExpectations = ScenarioTestExpectationData.getScenarioTestExpectationsForScenarioTestType(userContext.designVersionId, scenario.componentReferenceId, TestType.INTEGRATION);
                    expectationTotal += integrationTestExpectations.length;
                });

                if(scenarios.length > 0 && expectationTotal > 0) {

                    fileText += "\n    describe('" + aspect.componentNameNew + "', function(){\n\n";

                    scenarios.forEach((scenario) => {

                        // See if there are any test expectations for Integration tests

                        const integrationTestExpectations = ScenarioTestExpectationData.getScenarioTestExpectationsForScenarioTestType(userContext.designVersionId, scenario.componentReferenceId, TestType.INTEGRATION);

                        if(integrationTestExpectations.length === 1){

                            // Just one integration test, no permutations

                            fileText += "        it('" + scenario.componentNameNew + "', function(){\n            // Replace this with test code\n            expect.fail(null, null, 'Test not implemented yet');\n        });\n\n";

                        } else {

                            if(integrationTestExpectations.length > 1){

                                fileText += "\n        describe('" + scenario.componentNameNew + "', function(){\n";

                                // We have permutations - get a list of unique ones
                                let perms = [];
                                integrationTestExpectations.forEach((expectation) =>{

                                    if(expectation.permutationId !== 'NONE') {

                                        if (!perms.includes(expectation.permutationId)) {
                                            perms.push(expectation.permutationId);
                                        }
                                    }
                                });

                                // For each permutation value add a test
                                perms.forEach((permId) =>{

                                    const permName = DesignPermutationData.getDesignPermutationById(permId).permutationName;
                                    const expectationValues = ScenarioTestExpectationData.getPermutationValuesForScenarioTestTypePerm(userContext.designVersionId, scenario.componentReferenceId, TestType.INTEGRATION, permId);

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


}

export const ChimpMochaTestServices = new ChimpMochaTestServicesClass();