// External
import fs from 'fs';

// Ultrawide Collections
import {DesignUpdates}                  from '../../collections/design_update/design_updates.js';
//import {UserAccTestMashData}          from '../../collections/dev/user_acc_test_mash_data.js';
import { UserWorkPackageFeatureStepData }   from '../../collections/dev/user_work_package_feature_step_data.js';

// Ultrawide Services
import DesignUpdateSummaryServices      from '../summary/design_update_summary_services.js';

import {ComponentType, WorkPackageType, UserDevFeatureStatus, UserDevFeatureFileStatus, UserDevScenarioStatus,
    UserDevScenarioStepStatus, StepContext, MashStatus, MashTestStatus, DevTestTag, TestRunner, ViewOptionType, LogLevel} from '../../constants/constants.js';
import {log}                            from '../../common/utils.js';

import FeatureFileServices              from './feature_file_services.js'
import ScenarioServices                 from '../design/scenario_services.js';
import MashDataModules                  from '../../service_modules/dev/test_integration_service_modules.js';
import TestSummaryServices              from '../summary/test_summary_services.js';
import ChimpMochaTestServices           from '../../service_modules/dev/test_processor_chimp_mocha.js';

//======================================================================================================================
//
// Server Code for Test Mash Processing.
//
// Methods called directly by Server API
//
//======================================================================================================================

class TestIntegrationServices{

    refreshTestData(userContext){

        // To be called when the Design Version data is loaded or the Design Version changes or user requests a data refresh

        if(Meteor.isServer){

            log((msg) => console.log(msg), LogLevel.DEBUG, "REFRESH MASH DATA...");

            // Get latest results
            MashDataModules.getIntegrationTestResults(userContext);
            MashDataModules.getUnitTestResults(userContext);

            // Load the unit test data below the Scenario level
            MashDataModules.updateUnitTestScenarioResults(userContext);

            // Recalculate the Design Mash Scenarios
            MashDataModules.updateUserMashScenariosForDesignVersion(userContext);


            // And update the test summary data
            this.updateTestSummaryData(userContext);

            // Update DU Summary if a DU selected
            if(userContext.designVersionId !== 'NONE') {

                // Mark ALL design update summary data as stale so that results are updated when update is accessed
                DesignUpdates.update(
                    {designVersionId: userContext.designVersionId},
                    {
                        $set: {summaryDataStale: true}
                    },
                    {multi: true}

                );

                // And update the current update now in needed
                if(userContext.designUpdateId !== 'NONE') {
                    DesignUpdateSummaryServices.recreateDesignUpdateSummaryData(userContext);
                }
            }

            log((msg) => console.log(msg), LogLevel.DEBUG, "REFRESH MASH DATA - DONE");
        }
    }


    updateTestSummaryData(userContext){

        // Called if the test summary needs a refresh

        if(Meteor.isServer){

            // Recreate the summary mash
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
