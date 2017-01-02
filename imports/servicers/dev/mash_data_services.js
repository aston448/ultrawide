// External
import fs from 'fs';

// Ultrawide Collections
import {DesignComponents}               from '../../collections/design/design_components.js';
import {DesignUpdateComponents}         from '../../collections/design_update/design_update_components.js';
import {FeatureBackgroundSteps}         from '../../collections/design/feature_background_steps.js';
import {ScenarioSteps}                  from '../../collections/design/scenario_steps.js';
import {WorkPackages}                   from '../../collections/work/work_packages.js';
import {WorkPackageComponents}          from '../../collections/work/work_package_components.js';
import {UserDevFeatures}                from '../../collections/dev/user_dev_features.js';
import {UserDevFeatureScenarios}        from '../../collections/dev/user_dev_feature_scenarios.js';
import {UserDevFeatureScenarioSteps}    from '../../collections/dev/user_dev_feature_scenario_steps.js';
import {UserAccTestMashData}          from '../../collections/dev/user_acc_test_mash_data.js';
import {UserCurrentDevContext}          from '../../collections/context/user_current_dev_context.js';
import { UserWorkPackageFeatureStepData }   from '../../collections/dev/user_work_package_feature_step_data.js';

// Ultrawide Services
import {ComponentType, WorkPackageType, UserDevFeatureStatus, UserDevFeatureFileStatus, UserDevScenarioStatus,
    UserDevScenarioStepStatus, StepContext, MashStatus, MashTestStatus, DevTestTag, TestRunner, ViewOptionType, LogLevel} from '../../constants/constants.js';
import {log}                            from '../../common/utils.js';

import FeatureFileServices              from './feature_file_services.js'
import ScenarioServices                 from '../design/scenario_services.js';
import IntegrationTestServices          from './integration_test_services.js';
import ModuleTestServices               from './module_test_services.js';
import MashDataModules                  from '../../service_modules/dev/mash_data_service_modules.js';
import MashFeatureFileModules           from '../../service_modules/dev/mash_feature_file_service_modules.js';
import TestSummaryServices              from '../../servicers/dev/test_summary_services.js';

//======================================================================================================================
//
// Server Code for Test Mash Processing.
//
// Methods called directly by Server API
//
//======================================================================================================================

class MashDataServices{

    populateWorkPackageMashData(userContext){

        // To be called when a Work Package is opened to get the basic mash data ready

        if(Meteor.isServer){

            // Recalculate the Design Mash data and add in the latest results
            MashDataModules.calculateWorkPackageMash(userContext)

        }
    }

    updateTestMashData(userContext, viewOptions){

        // User has chosen to update the test mash data with latest test results

        if(Meteor.isServer){

            let testSummaryVisible = (viewOptions.designTestSummaryVisible || viewOptions.updateTestSummaryVisible || viewOptions.devTestSummaryVisible);

            if(viewOptions.devAccTestsVisible || testSummaryVisible){
                // Get the latest feature files
                MashFeatureFileModules.loadUserFeatureFileData(userContext);

                // Calculate the linkages between the actual files and the work package design
                MashDataModules.linkAcceptanceFilesToDesign(userContext);

                // Get latest Acc Tests Results
                MashDataModules.getAcceptanceTestResults(TestRunner.CHIMP_CUCUMBER, userContext);

            }

            if(viewOptions.devIntTestsVisible || testSummaryVisible){
                // Get latest Int Test Results
                MashDataModules.getIntegrationTestResults(TestRunner.CHIMP_MOCHA, userContext);
            }

            if(viewOptions.devModTestsVisible || testSummaryVisible){
                // Get latest Mod Test Results
                MashDataModules.getModuleTestResults(TestRunner.METEOR_MOCHA, userContext);
            }

            if(viewOptions.devAccTestsVisible || viewOptions.devIntTestsVisible || viewOptions.devModTestsVisible){
                // Add in the latest results
                MashDataModules.updateMashResults(userContext, viewOptions)
            }


            if(testSummaryVisible){
                // Recreate the summary mash
                TestSummaryServices.refreshTestSummaryData(userContext);
            }

        }
    };


     // A Design Only step is moved into the Linked Steps area...
    updateMovedDesignStep(mashDataItemId)  {

        if(Meteor.isServer){
            // Mark this step as linked
            MashDataModules.setTestStepMashStatus(mashDataItemId, MashStatus.MASH_LINKED, MashTestStatus.MASH_PENDING);
        }

    };

    // A Dev Only step is moved into the Linked Steps area
    updateMovedDevStep(devMashItemId, targetMashItemId, userContext){

        // The target step is the one below where the new step will fall

        // Get the index of the target step if there is one (there won't be if dropping into empty box)
        let targetIndex = 0;
        let newIndex = 0;

        const movingStep = UserWorkPackageFeatureStepData.findOne({_id: devMashItemId});
        const currentScenarioId = userContext.scenarioReferenceId;

        if(targetMashItemId) {
            targetIndex = UserWorkPackageFeatureStepData.findOne({_id: targetMashItemId}).mashItemIndex;
        }

        if(targetIndex > 0){
            log((msg) => console.log(msg), LogLevel.TRACE, "Target Index =  {}", targetIndex);
            let previousIndex = 0;

            // Find the next smallest index in the current set of steps

            const currentSteps = this.getFinalScenarioSteps(currentScenarioId, userContext);

            // The steps returned are in ascending order
            let lastItem = 0;
            currentSteps.forEach((step) => {

                if(step._id === targetMashItemId){
                    previousIndex = lastItem;
                }
                lastItem = step.mashItemIndex;
            });
            log((msg) => console.log(msg), LogLevel.TRACE, "Previous Index =  {}", previousIndex);

            newIndex = ((previousIndex + targetIndex) / 2);

            log((msg) => console.log(msg), LogLevel.TRACE, "New Index =  {}", newIndex);
        }

        // This data needs to be added to the design.  This process also updates the Mash data with the new Design item details
        const stepFullName = movingStep.stepType + ' ' +  movingStep.stepText;
        ScenarioServices.addDesignScenarioStepFromDev(currentScenarioId, userContext, movingStep.stepType, movingStep.stepText, stepFullName, newIndex, devMashItemId);

    }

    exportScenario(scenarioReferenceId, userContext){

        // Make out that this entire scenario is linked.  This should update the Scenario Entry and all the steps
        UserAccTestMashData.update(
            {
                userId:                         userContext.userId,
                designVersionId:                userContext.designVersionId,
                designUpdateId:                 userContext.designUpdateId,
                workPackageId:                  userContext.workPackageId,
                designScenarioReferenceId:      scenarioReferenceId
            },
            {
                $set:{
                    mashStatus: MashStatus.MASH_LINKED
                }
            },
            { multi: true }
        );

        // Then export the whole feature
        this.exportFeatureConfiguration(userContext);
    }

    exportFeatureConfiguration(userContext){

        //const devContext = UserCurrentDevContext.findOne({userId: userContext.userId});
        // TODO Refactor this to use user context properly

        FeatureFileServices.writeFeatureFile(userContext.featureReferenceId, userContext);

        // Reload all the data
        //this.loadUserFeatureFileData(userContext, userContext.featureFilesLocation);
        //this.createAccTestMashData(userContext);

    }

    exportIntegrationTests(userContext){

        FeatureFileServices.writeIntegrationFile(userContext);

    }

    updateTestData(userContext, viewOptions){

        // if(viewOptions.designAccTestsVisible || viewOptions.devAccTestsVisible){
        //     this.updateAcceptanceTestData(userContext);
        // }
        //
        // if(viewOptions.designIntTestsVisible || viewOptions.devIntTestsVisible){
        //     IntegrationTestServices.getIntegrationTestResults('CHIMP_MOCHA', userContext);
        // }
        //
        // if(viewOptions.designModTestsVisible || viewOptions.devModTestsVisible){
        //     ModuleTestServices.getModuleTestResults('METEOR_MOCHA', userContext);
        // }
    }

    updateAcceptanceTestData(userContext){

        // if(Meteor.isServer) {
        //     MochaTestServices.processTestResults(userContext);
        // }

        // Read the test results file
        const resultsText = fs.readFileSync(userContext.acceptanceTestResultsLocation);

        let results = JSON.parse(resultsText);

        log((msg) => console.log(msg), LogLevel.TRACE, "UPDATE TEST DATA: {}", results);

        results.forEach((result) => {
            if(result.keyword === 'Feature'){
                const featureName = result.name;
                let featureTestStatus = MashTestStatus.MASH_PASS;

                let designFeature = null;
                if(userContext.designUpdateId === 'NONE'){
                    designFeature = DesignComponents.findOne({
                        designId: userContext.designId,
                        designVersionId: userContext.designVersionId,
                        componentType: ComponentType.FEATURE,
                        componentName: featureName
                    });
                } else {
                    designFeature = DesignUpdateComponents.findOne({
                        designId: userContext.designId,
                        designVersionId: userContext.designVersionId,
                        designUpdateId: userContext.designUpdateId,
                        componentType: ComponentType.FEATURE,
                        componentNameNew: featureName
                    });
                }

                result.elements.forEach((element) => {
                    if(element.keyword === 'Scenario'){
                        const scenarioName = element.name;
                        let scenarioTestStatus = MashTestStatus.MASH_PASS;
                        let scenarioError = '';
                        element.steps.forEach((step) => {
                            if(step.result.status != 'passed'){
                                scenarioTestStatus = MashTestStatus.MASH_FAIL;
                                featureTestStatus = MashTestStatus.MASH_FAIL;
                                scenarioError = step.result.error_message;
                            }


                        });


                        // Update the data for this scenario
                        let designScenario = null;
                        if(userContext.designUpdateId === 'NONE'){
                            designScenario = DesignComponents.findOne({
                                designId: userContext.designId,
                                designVersionId: userContext.designVersionId,
                                componentType: ComponentType.SCENARIO,
                                componentName: scenarioName
                            });
                        } else {
                            designScenario = DesignUpdateComponents.findOne({
                                designId: userContext.designId,
                                designVersionId: userContext.designVersionId,
                                designUpdateId: userContext.designUpdateId,
                                componentType: ComponentType.SCENARIO,
                                componentNameNew: scenarioName
                            });
                        }

                        log((msg) => console.log(msg), LogLevel.TRACE, "Design Scenario is: {}", designScenario);

                        if(designFeature && designScenario) {
                            UserAccTestMashData.update(
                                {
                                    userId:                         userContext.userId,
                                    designVersionId:                userContext.designVersionId,
                                    designUpdateId:                 userContext.designUpdateId,
                                    workPackageId:                  userContext.workPackageId,
                                    mashComponentType:              ComponentType.SCENARIO,
                                    designFeatureReferenceId:       designFeature.componentReferenceId,
                                    designScenarioReferenceId:      designScenario.componentReferenceId,
                                 },
                                {
                                    $set:{
                                        mashTestStatus: scenarioTestStatus
                                    }
                                },
                                (error, result) => {
                                    log((msg) => console.log(msg), LogLevel.TRACE, "Updated {} scenario", result);
                                }

                            );

                            // And update the step results too
                            element.steps.forEach((step) => {

                                UserAccTestMashData.update(
                                    {
                                        userId:                         userContext.userId,
                                        designVersionId:                userContext.designVersionId,
                                        designUpdateId:                 userContext.designUpdateId,
                                        workPackageId:                  userContext.workPackageId,
                                        mashComponentType:              ComponentType.SCENARIO_STEP,
                                        designFeatureReferenceId:       designFeature.componentReferenceId,
                                        designScenarioReferenceId:      designScenario.componentReferenceId,
                                        stepText:                       step.name
                                    },
                                    {
                                        $set:{
                                            mashTestStatus: step.result.status === 'passed' ? MashTestStatus.MASH_PASS : MashTestStatus.MASH_FAIL
                                        }
                                    },
                                    (error, result) => {
                                        log((msg) => console.log(msg), LogLevel.TRACE, "Updated {} scenario step", result);
                                    }
                                )
                            });
                        }
                    }
                });

                // TODO - Update this to set Feature Aspect and Feature Status by looking at the Scenarios within them...

                // Update the feature test status as well
                if(designFeature){
                    UserAccTestMashData.update(
                        {
                            userId:                         userContext.userId,
                            designVersionId:                userContext.designVersionId,
                            designUpdateId:                 userContext.designUpdateId,
                            workPackageId:                  userContext.workPackageId,
                            mashComponentType:              ComponentType.FEATURE,
                            designFeatureReferenceId:       designFeature.componentReferenceId,
                        },
                        {
                            $set:{
                                mashTestStatus: featureTestStatus
                            }
                        }

                    );
                }
            }
        });

    };

    // GENERIC FIND FUNCTIONS ==========================================================================================

    getFinalScenarioSteps(designScenarioReferenceId, userContext) {
        return UserWorkPackageFeatureStepData.find(
            {
                userId: userContext.userId,
                designVersionId: userContext.designVersionId,
                designUpdateId: userContext.designUpdateId,
                workPackageId: userContext.workPackageId,
                designScenarioReferenceId: designScenarioReferenceId,
                accMashStatus: MashStatus.MASH_LINKED
            },
            {sort: {mashItemIndex: 1}}
        ).fetch();
    };

    getDesignOnlyScenarioSteps(designScenarioReferenceId, userContext) {
        return UserWorkPackageFeatureStepData.find(
            {
                userId: userContext.userId,
                designVersionId: userContext.designVersionId,
                designUpdateId: userContext.designUpdateId,
                workPackageId: userContext.workPackageId,
                designScenarioReferenceId: designScenarioReferenceId,
                accMashStatus: MashStatus.MASH_NOT_IMPLEMENTED
            },
            {sort: {mashItemIndex: 1}}
        ).fetch();
    };

}

export default new MashDataServices();
