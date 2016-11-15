import fs from 'fs';

import {DesignComponents}               from '../../collections/design/design_components.js';
import {DesignUpdateComponents}         from '../../collections/design_update/design_update_components.js';
// import {FeatureBackgroundSteps}         from '../collections/design/feature_background_steps.js';
// import {ScenarioSteps}                  from '../collections/design/scenario_steps.js';
// import {WorkPackages}                   from '../collections/work/work_packages.js';
// import {WorkPackageComponents}          from '../collections/work/work_package_components.js';
// import {UserDevFeatures}                from '../collections/dev/user_dev_features.js';
// import {UserDevFeatureScenarios}        from '../collections/dev/user_dev_feature_scenarios.js';
// import {UserDevFeatureScenarioSteps}    from '../collections/dev/user_dev_feature_scenario_steps.js';
// import {UserDesignDevMashData}          from '../collections/dev/user_design_dev_mash_data.js';
// import {UserCurrentDevContext}          from '../collections/context/user_current_dev_context.js';
import {UserModTestMashData}            from '../../collections/dev/user_mod_test_mash_data.js';

import {ComponentType, WorkPackageType, UserDevFeatureStatus, UserDevFeatureFileStatus, UserDevScenarioStatus,
    UserDevScenarioStepStatus, StepContext, MashStatus, MashTestStatus, DevTestTag, LogLevel} from '../../constants/constants.js';
import {log}                            from '../../common/utils.js';
// import FeatureFileServices              from './feature_file_services.js'
// import ScenarioServices                 from './scenario_services.js';

class MeteorMochaTestServices{

    processTestResults(userContext){

        if(Meteor.isServer) {

            // Clear data for this user
            UserModTestMashData.remove({userId: userContext.userId});

            // Read the test results file

            const resultsFile = userContext.moduleTestResultsLocation;
            let resultsText = '';

            try {
                resultsText = fs.readFileSync(resultsFile);
            } catch (e){
                console.log("Failed to open mocha tests file: " + e);
                return;
            }

            const cleanText = this.cleanResults(resultsText.toString());

            //console.log(cleanText);

            const resultsJson = JSON.parse(cleanText);

            //console.log("Passes " + resultsJson.stats.passes);

            let designScenarios = [];

            // Get relevant scenarios
            if(userContext.designUpdateId === 'NONE'){
                designScenarios = DesignComponents.find({
                    designVersionId:    userContext.designVersionId,
                    componentType:      ComponentType.SCENARIO
                }).fetch();
            } else {
                designScenarios = DesignUpdateComponents.find({
                    designVersionId:    userContext.designVersionId,
                    designUpdateId:     userContext.designUpdateId,
                    componentType:      ComponentType.SCENARIO
                }).fetch();
            }

            let designScenarioList = [];

            // Get a uniform list
            designScenarios.forEach((designScenario) => {
                if(userContext.designUpdateId === 'NONE'){
                    designScenarioList.push({
                        scenarioName:   designScenario.componentName,
                        scenarioRef:    designScenario.componentReferenceId,
                        aspectRef:      designScenario.componentParentReferenceId,
                        featureRef:     designScenario.componentFeatureReferenceId,

                    });
                } else {
                    designScenarioList.push({
                        scenarioName:   designScenario.componentNameNew,
                        scenarioRef:    designScenario.componentReferenceId,
                        aspectRef:      designScenario.componentParentReferenceIdNew,
                        featureRef:     designScenario.componentFeatureReferenceIdNew,

                    });
                }
            });

            // Parse Passed Tests
            resultsJson.passes.forEach((passedTest) => {

                let testIdentity = this.getTestIdentity(passedTest.title, passedTest.fullTitle)

                let linked = false;

                // See if the test relates to a Scenario
                designScenarioList.forEach((designScenario) => {
                   if(testIdentity.testContext.includes(designScenario.scenarioName)){

                       // Get the rest of the context details
                       let testContextGroup = this.getContextDetails(testIdentity.testContext, designScenario.scenarioName);

                       // Insert a linked record
                       UserModTestMashData.insert(
                           {
                               // Identity
                               userId:                      userContext.userId,
                               suiteName:                   designScenario.scenarioName,
                               testGroupName:               testContextGroup,
                               designScenarioReferenceId:   designScenario.scenarioRef,
                               designAspectReferenceId:     designScenario.aspectRef,
                               designFeatureReferenceId:    designScenario.featureRef,
                               // Data
                               testName:                    testIdentity.testName,
                               // Status
                               mashStatus:                  MashStatus.MASH_LINKED,
                               testOutcome:                 MashTestStatus.MASH_PASS
                           }
                       );

                       linked = true;
                   }
                });

                // If no scenarios matched, insert as non-linked test
                if(!linked){
                    UserModTestMashData.insert(
                        {
                            // Identity
                            userId:                      userContext.userId,
                            suiteName:                   testIdentity.testContext,
                            testGroupName:               testIdentity.testContext,
                            designScenarioReferenceId:   'NONE',
                            designAspectReferenceId:     'NONE',
                            designFeatureReferenceId:    'NONE',
                            // Data
                            testName:                    testIdentity.testName,
                            // Status
                            mashStatus:                  MashStatus.MASH_NOT_DESIGNED,
                            testOutcome:                 MashTestStatus.MASH_PASS
                        }
                    );
                }
            });

            // Parse Failed Tests
            //TODO

            // Parse Pending Tests
            //TODO

        }
    };

    cleanResults(inputText){

        let outputText = '';

        let outputLines = inputText.split('\n');

        outputLines.forEach((line) => {

            if(line.startsWith('[34m')){

                let actualTextStart = line.indexOf('[39m');
                let finalLine = line.substring(actualTextStart + 5);
                outputText += finalLine + '\n';
            }
        });

        return outputText;

    };

    getTestIdentity(title, fullTitle){
        let titleStart = fullTitle.indexOf(title);

        return({
            testName: title,
            testContext: fullTitle.substring(0, titleStart)
        });
    };

    getContextDetails(testContext, scenarioName){
        // Given that the Scenario Name is part of the test context, anything else must be a test group
        if(testContext.trim() === scenarioName.trim()) {
            // No other context
            return '';
        } else {
            // Return what is after the Scenario Name
            return testContext.substring(scenarioName.length);
        }

    }
}

export default new MeteorMochaTestServices();
