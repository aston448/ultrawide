import fs from 'fs';

import {DesignVersionComponents}               from '../../collections/design/design_version_components.js';
import {DesignUpdateComponents}         from '../../collections/design_update/design_update_components.js';

import {UserIntTestResults} from '../../collections/dev/user_int_test_results.js'

import {ComponentType, TestType, MashTestStatus, LogLevel}   from '../../constants/constants.js';
import {log}        from '../../common/utils.js';

// Plugin class to read test results from a screen scraped chimp mocha JSON reported file
class ChimpMochaTestServices{

    writeIntegrationTestFile(userContext){

        if(Meteor.isServer) {

            // Get the selected Feature - already validated that current item is a Feature
            let feature = null;

            // Are we working from an Initial Design or a Design Update?
            if(userContext.designUpdateId === 'NONE') {
                feature = DesignVersionComponents.findOne({_id: userContext.designComponentId});
            } else {
                feature = DesignUpdateComponents.findOne({_id: userContext.designComponentId});
            }

            if(!feature){
                log((msg) => console.log(msg), LogLevel.ERROR, "No Feature found");
                return;
            }

            const fileName = feature.componentNameNew + '_spec.js';

            log((msg) => console.log(msg), LogLevel.DEBUG, "Writing integration test file {}", fileName);

            // TODO replace this in user context
            const filePath = '/Users/aston/WebstormProjects/ultrawide/tests/integration/';


            // Safety - don't export if file exists to prevent accidental overwrite of good data
            if(fs.existsSync(filePath + fileName)){
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
                featureAspects = DesignVersionComponents.find(
                    {
                        componentType: ComponentType.FEATURE_ASPECT,
                        componentFeatureReferenceIdNew: feature.componentReferenceId
                    },
                    {sort: {componentIndexNew: 1}}
                ).fetch();
            } else {
                featureAspects = DesignUpdateComponents.find(
                    {
                        componentType: ComponentType.FEATURE_ASPECT,
                        componentFeatureReferenceIdNew: feature.componentReferenceId
                    },
                    {sort: {componentIndexNew: 1}}
                ).fetch();
            }



            featureAspects.forEach((aspect) =>{
                let scenarios = [];

                if(userContext.designUpdateId === 'NONE') {
                    scenarios = DesignVersionComponents.find(
                        {
                            componentType: ComponentType.SCENARIO,
                            componentParentReferenceIdNew: aspect.componentReferenceId
                        },
                        {sort: {componentIndexNew: 1}}
                    ).fetch();
                } else {
                    scenarios = DesignUpdateComponents.find(
                        {
                            componentType: ComponentType.SCENARIO,
                            componentParentReferenceIdNew: aspect.componentReferenceId
                        },
                        {sort: {componentIndexNew: 1}}
                    ).fetch();
                }

                // Add Feature aspect comment and scenarios if there are any
                if(scenarios.length > 0) {

                    fileText += "\n    // " + aspect.componentNameNew + "\n";

                    scenarios.forEach((scenario) => {

                        fileText += "    it('" + scenario.componentNameNew + "');\n\n";

                    });
                }

            });

            // And tidy up the bottom
            fileText += "});\n";

            // And write the file
            fs.writeFileSync(filePath + fileName, fileText);

            log((msg) => console.log(msg), LogLevel.DEBUG, "File written: {}", fileName);
        }

    }

    getJsonTestResults(resultsFile, userId, testType){

        if(Meteor.isServer) {

            // Read ----------------------------------------------------------------------------------------------------
            let resultsText = '';

            try {
                resultsText = fs.readFileSync(resultsFile);
            } catch (e) {
                log((msg) => console.log(msg), LogLevel.ERROR, "Failed to open mocha tests file: {}", e);
                return [];
            }

            // Clean ---------------------------------------------------------------------------------------------------
            let cleanText = '';
            try {
                cleanText = this.cleanResults(resultsText.toString());
            } catch (e) {
                log((msg) => console.log(msg), LogLevel.ERROR, "Failed to clean mocha tests file: {}", e);
                return [];
            }

            //log((msg) => console.log(msg), LogLevel.TRACE, "Cleaned file text is:\n {}", cleanText);


            // Parse ---------------------------------------------------------------------------------------------------
            let resultsJson = [];

            if(cleanText.length > 0) {
                try {
                    resultsJson = JSON.parse(cleanText);
                } catch (e) {
                    log((msg) => console.log(msg), LogLevel.ERROR, "Failed to parse mocha tests file: {}", e);
                    return [];
                }
            } else {
                log((msg) => console.log(msg), LogLevel.WARNING, "No integration test data found", e);
                return [];
            }


            // Return Standard Data ------------------------------------------------------------------------------------

            log((msg) => console.log(msg), LogLevel.DEBUG, "Results: Passes {}, Fails {}, Pending {}", resultsJson.passes.length, resultsJson.failures.length, resultsJson.pending.length,);

            switch(testType){
                case TestType.INTEGRATION:

                    // Add latest results
                    resultsJson.passes.forEach((test) => {
                        UserIntTestResults.insert(
                            {
                                userId:             userId,
                                testName:           test.title,
                                testFullName:       test.fullTitle,
                                testResult:         MashTestStatus.MASH_PASS,
                                testError:          '',
                                testErrorReason:    '',
                                testDuration:       test.duration,
                                stackTrace:         ''
                            }
                        );
                    });

                    resultsJson.failures.forEach((test) => {
                        UserIntTestResults.insert(
                            {
                                userId:             userId,
                                testName:           test.title,
                                testFullName:       test.fullTitle,
                                testResult:         MashTestStatus.MASH_FAIL,
                                testError:          test.err.message,       // This is the Reason plus the Error
                                testErrorReason:    test.err.reason,
                                testDuration:       test.duration,
                                stackTrace:         test.err.stack
                            }
                        );
                    });

                    resultsJson.pending.forEach((test) => {
                        UserIntTestResults.insert(
                            {
                                userId:             userId,
                                testName:           test.title,
                                testFullName:       test.fullTitle,
                                testResult:         MashTestStatus.MASH_PENDING,
                                testError:          '',
                                testErrorReason:    '',
                                testDuration:       0,
                                stackTrace:         ''
                            }
                        );
                    });

                    break;
                default:
            }



        }

    };

    cleanResults(fileText){

        // For this format, want everything from the first {

        const jsonStart = fileText.indexOf('{');

        return fileText.substring(jsonStart);

    }

}

export default new ChimpMochaTestServices();