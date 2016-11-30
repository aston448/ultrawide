import fs from 'fs';

import {DesignComponents}               from '../../collections/design/design_components.js';
import {DesignUpdateComponents}         from '../../collections/design_update/design_update_components.js';

import {UserModTestMashData}            from '../../collections/dev/user_mod_test_mash_data.js';

import {ComponentType, MashStatus, MashTestStatus, LogLevel} from '../../constants/constants.js';
import {log}                            from '../../common/utils.js';

import MeteorMochaTestServices          from '../../service_modules/dev/test_results_processor_meteor_mocha.js';

//======================================================================================================================
//
// Server Code for Module Test Processing.
//
// Methods called directly by Server API
//
//======================================================================================================================

class ModuleTestServices{

    getModuleTestResults(testType, userContext){

        let resultsData = [];

        // Call the correct results service to get the test data
        switch(testType){
            case 'METEOR_MOCHA':
                let testFile = userContext.moduleTestResultsLocation;

                resultsData = MeteorMochaTestServices.getJsonTestResults(testFile);
                break;

        }

        // Clear data for this user
        UserModTestMashData.remove({userId: userContext.userId});

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

        // Parse Test Results
        resultsData.forEach((result) => {

            let testIdentity = this.getTestIdentity(result.testName, result.testFullName)

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
                            testOutcome:                 result.testResult
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
                        testOutcome:                 result.testResult
                    }
                );
            }
        });

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

export default new ModuleTestServices();

