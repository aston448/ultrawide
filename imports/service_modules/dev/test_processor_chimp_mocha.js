import fs from 'fs';

// Ultrawide Services
import {ComponentType, LogLevel}   from '../../constants/constants.js';
import {log}        from '../../common/utils.js';

// Data Access
import DesignComponentData                      from '../../data/design/design_component_db.js';
import DesignUpdateComponentData                from '../../data/design_update/design_update_component_db.js';


// Plugin class to read test results from a screen scraped chimp mocha JSON reported file
class ChimpMochaTestServices{

    writeIntegrationTestFile(userContext, outputDir){

        if(Meteor.isServer) {

            // Get the selected Feature - already validated that current item is a Feature
            let feature = null;

            // Are we working from an Initial Design or a Design Update?
            if(userContext.designUpdateId === 'NONE') {
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

            if(userContext.designUpdateId === 'NONE') {
                featureAspects = DesignComponentData.getFeatureAspects(userContext.designVersionId, feature.componentReferenceId);
            } else {
                featureAspects = DesignUpdateComponentData.getNonRemovedAspectsForFeature(userContext.designUpdateId, feature.componentReferenceId);
            }

            featureAspects.forEach((aspect) =>{
                let scenarios = [];

                if(userContext.designUpdateId === 'NONE') {
                    scenarios = DesignComponentData.getChildComponentsOfType(userContext.designVersionId, ComponentType.SCENARIO, aspect.componentReferenceId)
                } else {
                    scenarios = DesignUpdateComponentData.getNonRemovedChildComponentsOfType(userContext.designUpdateId, ComponentType.SCENARIO, aspect.componentReferenceId);
                }

                // Add Feature aspect comment and scenarios if there are any
                if(scenarios.length > 0) {

                    fileText += "\n    describe('" + aspect.componentNameNew + "', function(){\n";

                    scenarios.forEach((scenario) => {

                        fileText += "        it('" + scenario.componentNameNew + "');\n\n";

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

    // getJsonTestResults(resultsFile, userId){
    //
    //     if(Meteor.isServer) {
    //
    //         // Read ----------------------------------------------------------------------------------------------------
    //         let resultsText = '';
    //
    //         try {
    //             resultsText = fs.readFileSync(resultsFile);
    //         } catch (e) {
    //             log((msg) => console.log(msg), LogLevel.ERROR, "Failed to open mocha tests file: {}", e);
    //             return [];
    //         }
    //
    //         // Clean ---------------------------------------------------------------------------------------------------
    //         // Cleaning no longer needed
    //         let cleanText = resultsText;
    //         // let cleanText = '';
    //         // try {
    //         //     cleanText = this.cleanResults(resultsText.toString());
    //         // } catch (e) {
    //         //     log((msg) => console.log(msg), LogLevel.ERROR, "Failed to clean mocha tests file: {}", e);
    //         //     return [];
    //         // }
    //
    //         //log((msg) => console.log(msg), LogLevel.TRACE, "Cleaned file text is:\n {}", cleanText);
    //
    //
    //         // Parse ---------------------------------------------------------------------------------------------------
    //         let resultsJson = {};
    //
    //         if(cleanText.length > 0) {
    //             try {
    //                 resultsJson = JSON.parse(cleanText);
    //             } catch (e) {
    //                 log((msg) => console.log(msg), LogLevel.ERROR, "Failed to parse mocha tests file: {}", e);
    //                 return [];
    //             }
    //         } else {
    //             log((msg) => console.log(msg), LogLevel.WARNING, "No integration test data found", e);
    //             return [];
    //         }
    //
    //         if(resultsJson && resultsJson.passes && resultsJson.failures && resultsJson.pending) {
    //             // Return Standard Data ------------------------------------------------------------------------------------
    //
    //             // testFullName must always contain the Scenario as all of part of it.  May also contain test Suite Group and Name as well
    //             // If it contains these it should be in the form 'Suite Group Name'
    //
    //             log((msg) => console.log(msg), LogLevel.DEBUG, "Results: Passes {}, Fails {}, Pending {}", resultsJson.passes.length, resultsJson.failures.length, resultsJson.pending.length,);
    //
    //             let resultsBatch = [];
    //
    //             // Add latest results
    //             resultsJson.passes.forEach((test) => {
    //
    //                 resultsBatch.push(
    //                     {
    //                         userId: userId,
    //                         testFullName: test.fullTitle,
    //                         testSuite: 'NONE',             // Not yet calculated
    //                         testGroup: 'NONE',             // Not yet calculated
    //                         testName: test.title,
    //                         testResult: MashTestStatus.MASH_PASS,
    //                         testError: '',
    //                         testErrorReason: '',
    //                         testDuration: test.duration,
    //                         testStackTrace: ''
    //                     }
    //                 );
    //             });
    //
    //             resultsJson.failures.forEach((test) => {
    //
    //                 resultsBatch.push(
    //                     {
    //                         userId: userId,
    //                         testFullName: test.fullTitle,
    //                         testSuite: 'NONE',             // Not yet calculated
    //                         testGroup: 'NONE',             // Not yet calculated
    //                         testName: test.title,
    //                         testResult: MashTestStatus.MASH_FAIL,
    //                         testError: test.err.message,       // This is the Reason plus the Error
    //                         testErrorReason: test.err.reason,
    //                         testDuration: test.duration,
    //                         testStackTrace: test.err.stack
    //                     }
    //                 );
    //             });
    //
    //             resultsJson.pending.forEach((test) => {
    //
    //                 resultsBatch.push(
    //                     {
    //                         userId: userId,
    //                         testFullName: test.fullTitle,
    //                         testSuite: 'NONE',             // Not yet calculated
    //                         testGroup: 'NONE',             // Not yet calculated
    //                         testName: test.title,
    //                         testResult: MashTestStatus.MASH_PENDING,
    //                         testError: '',
    //                         testErrorReason: '',
    //                         testDuration: 0,
    //                         testStackTrace: ''
    //                     }
    //                 );
    //             });
    //
    //             log((msg) => console.log(msg), LogLevel.DEBUG, "    New batches populated.");
    //
    //             // Bulk insert the new data
    //             if (resultsBatch.length > 0) {
    //                 UserIntegrationTestResults.batchInsert(resultsBatch);
    //             }
    //
    //             log((msg) => console.log(msg), LogLevel.DEBUG, "    New data inserted.");
    //
    //
    //             log((msg) => console.log(msg), LogLevel.DEBUG, "DONE Chimp Mocha results");
    //         }
    //
    //     }
    //
    // };
    //
    // cleanResults(fileText){
    //
    //     // For this format, want everything from the first {
    //
    //     const jsonStart = fileText.indexOf('{');
    //
    //     return fileText.substring(jsonStart);
    //
    // }

}

export default new ChimpMochaTestServices();