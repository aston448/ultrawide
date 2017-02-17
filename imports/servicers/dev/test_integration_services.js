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
//import {UserAccTestMashData}          from '../../collections/dev/user_acc_test_mash_data.js';
import {UserCurrentDevContext}          from '../../collections/context/user_current_dev_context.js';
import { UserWorkPackageFeatureStepData }   from '../../collections/dev/user_work_package_feature_step_data.js';

// Ultrawide Services
import {ComponentType, WorkPackageType, UserDevFeatureStatus, UserDevFeatureFileStatus, UserDevScenarioStatus,
    UserDevScenarioStepStatus, StepContext, MashStatus, MashTestStatus, DevTestTag, TestRunner, ViewOptionType, LogLevel} from '../../constants/constants.js';
import {log}                            from '../../common/utils.js';

import FeatureFileServices              from './feature_file_services.js'
import ScenarioServices                 from '../design/scenario_services.js';
import MashDataModules                  from '../../service_modules/dev/test_integration_service_modules.js';
import MashFeatureFileModules           from '../../service_modules/dev/mash_feature_file_service_modules.js';
import TestSummaryServices              from '../../servicers/dev/test_summary_services.js';
import ChimpMochaTestServices           from '../../service_modules/dev/test_processor_chimp_mocha.js';

//======================================================================================================================
//
// Server Code for Test Mash Processing.
//
// Methods called directly by Server API
//
//======================================================================================================================

class TestIntegrationServices{

    populateWorkPackageMashData(userContext){

        // To be called when a Work Package is opened to get the basic mash data ready

        if(Meteor.isServer){

            // Recalculate the Design Mash data and add in the latest results
            MashDataModules.calculateWorkPackageMash(userContext)

        }
    }

    updateTestMashData(userContext, userRole, viewOptions){

        // User has chosen to update the test mash data with latest test results

        if(Meteor.isServer){

            if(viewOptions.devAccTestsVisible){
                // Get the latest feature files
                MashFeatureFileModules.loadUserFeatureFileData(userContext);

                // Calculate the linkages between the actual files and the work package design
                MashDataModules.linkAcceptanceFilesToDesign(userContext);

                // Get latest Acc Tests Results
                MashDataModules.getAcceptanceTestResults(userContext);

            }

            if(viewOptions.devIntTestsVisible){
                // Get latest Int Test Results
                MashDataModules.getIntegrationTestResults(userContext, userRole);
            }

            if(viewOptions.devUnitTestsVisible){
                // Get latest Unit Test Results
                MashDataModules.getUnitTestResults(userContext, userRole);
            }

            if(viewOptions.devAccTestsVisible || viewOptions.devIntTestsVisible || viewOptions.devUnitTestsVisible){
                // Add in the latest results
                MashDataModules.updateMashResults(userContext, viewOptions)
            }

        }
    };

    updateTestSummaryData(userContext, userRole){

        // Called if the test summary needs a refresh

        if(Meteor.isServer){

            MashDataModules.getAcceptanceTestResults(userContext);
            MashDataModules.getIntegrationTestResults(userContext, userRole);
            MashDataModules.getUnitTestResults(userContext, userRole);

            // Recreate the summary mash
            console.log("Refreshing SUMMARY");
            TestSummaryServices.refreshTestSummaryData(userContext);
        }
    }

    // User generates a test file from a Design or Design Update Feature
    exportIntegrationTestFile(userContext, testRunner){

        // Add in other test generation here...
        switch(testRunner){
            case TestRunner.CHIMP_MOCHA:
                ChimpMochaTestServices.writeIntegrationTestFile(userContext);
                break;
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

    // exportScenario(scenarioReferenceId, userContext){
    //
    //     // Make out that this entire scenario is linked.  This should update the Scenario Entry and all the steps
    //     UserAccTestMashData.update(
    //         {
    //             userId:                         userContext.userId,
    //             designVersionId:                userContext.designVersionId,
    //             designUpdateId:                 userContext.designUpdateId,
    //             workPackageId:                  userContext.workPackageId,
    //             designScenarioReferenceId:      scenarioReferenceId
    //         },
    //         {
    //             $set:{
    //                 mashStatus: MashStatus.MASH_LINKED
    //             }
    //         },
    //         { multi: true }
    //     );
    //
    //     // Then export the whole feature
    //     this.exportFeatureConfiguration(userContext);
    // }

    exportFeatureConfiguration(userContext){

        //const devContext = UserCurrentDevContext.findOne({userId: userContext.userId});
        // TODO Refactor this to use user context properly

        FeatureFileServices.writeFeatureFile(userContext.featureReferenceId, userContext);

    }

    // exportIntegrationTests(userContext){
    //
    //     FeatureFileServices.writeIntegrationFile(userContext);
    //
    // }


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

export default new TestIntegrationServices();
