
// Ultrawide Collections
import { UserDevTestSummaryData }       from '../../collections/dev/user_dev_test_summary_data.js';
import { DesignComponents }             from '../../collections/design/design_components.js';
import { DesignUpdateComponents }       from '../../collections/design_update/design_update_components.js';
import { UserIntTestResults }           from '../../collections/dev/user_int_test_results.js';
import { UserUnitTestMashData }          from '../../collections/dev/user_unit_test_mash_data.js';

// Ultrawide services
import { ComponentType, MashStatus, MashTestStatus, FeatureTestSummaryStatus, LogLevel }   from '../../constants/constants.js';
import {log}        from '../../common/utils.js'

import ClientIdentityServices       from '../../apiClient/apiIdentity.js';
import ChimpMochaTestServices       from '../../service_modules/dev/test_results_processor_chimp_mocha.js';

//======================================================================================================================
//
// Server Code for Test Summary Processing.
//
// Methods called directly by Server API
//
//======================================================================================================================

class TestSummaryServices {

    refreshTestSummaryData(userContext){

        // Delete data for current user context
        UserDevTestSummaryData.remove({
            userId:             userContext.userId,
            designVersionId:    userContext.designVersionId,
            designUpdateId:     userContext.designUpdateId
        });

        // Get the Design Scenario Data
        let designScenarios = [];
        if(userContext.designUpdateId === 'NONE'){

            // In a base Design Version context
            designScenarios = DesignComponents.find({
                designId: userContext.designId,
                designVersionId: userContext.designVersionId,
                componentType: ComponentType.SCENARIO
            }).fetch();

        } else {

            // In a Design Update context
            designScenarios = DesignUpdateComponents.find({
                designId: userContext.designId,
                designVersionId: userContext.designVersionId,
                designUpdateId: userContext.designUpdateId,
                componentType: ComponentType.SCENARIO,
                isRemoved: false
            }).fetch();
        }

        // Populate the Scenario summary data
        designScenarios.forEach((designScenario) =>{

            let integrationTestResult = null;
            let featureReferenceId = '';

            let acceptanceTestDisplay = MashTestStatus.MASH_NOT_LINKED;
            let integrationTestDisplay = MashTestStatus.MASH_NOT_LINKED;
            let unitTestPasses = 0;
            let unitTestFails = 0;

            // See if we have any test results

            // Integration Tests
            if(userContext.designUpdateId === 'NONE'){
                integrationTestResult = UserIntTestResults.findOne(
                    {
                        userId:     userContext.userId,
                        testName:   designScenario.componentName
                    }
                );
                featureReferenceId = designScenario.componentFeatureReferenceId;
            } else {
                integrationTestResult = UserIntTestResults.findOne(
                    {
                        userId:     userContext.userId,
                        testName:   designScenario.componentNameNew
                    }
                );
                featureReferenceId = designScenario.componentFeatureReferenceIdNew;
            }

            if(integrationTestResult){
                integrationTestDisplay = integrationTestResult.testResult;
            }

            // Unit Tests
            unitTestPasses = UserUnitTestMashData.find({
                userId:     userContext.userId,
                designScenarioReferenceId: designScenario.componentReferenceId,
                testOutcome: MashTestStatus.MASH_PASS
            }).count();

            unitTestFails= UserUnitTestMashData.find({
                userId:     userContext.userId,
                designScenarioReferenceId: designScenario.componentReferenceId,
                testOutcome: MashTestStatus.MASH_FAIL
            }).count();

            UserDevTestSummaryData.insert({
                userId:                         userContext.userId,
                designVersionId:                userContext.designVersionId,
                designUpdateId:                 userContext.designUpdateId,
                scenarioReferenceId:            designScenario.componentReferenceId,
                featureReferenceId:             featureReferenceId,
                accTestStatus:                  acceptanceTestDisplay,
                intTestStatus:                  integrationTestDisplay,
                unitTestPassCount:               unitTestPasses,
                unitTestFailCount:               unitTestFails,
                featureSummaryStatus:           FeatureTestSummaryStatus.FEATURE_NO_TESTS
            });

        });

        // Populate the Feature summary data
        let designFeatures = [];
        if(userContext.designUpdateId === 'NONE'){

            // In a base Design Version context
            designFeatures = DesignComponents.find({
                designId: userContext.designId,
                designVersionId: userContext.designVersionId,
                componentType: ComponentType.FEATURE
            }).fetch();

        } else {

            // In a Design Update context
            designFeatures = DesignUpdateComponents.find({
                designId: userContext.designId,
                designVersionId: userContext.designVersionId,
                designUpdateId: userContext.designUpdateId,
                componentType: ComponentType.FEATURE,
                isRemoved: false
            }).fetch();
        }

        designFeatures.forEach((designFeature) =>{

            console.log("Getting summary data for Feature " + designFeature.componentName);

            let featureScenarios = UserDevTestSummaryData.find({featureReferenceId: designFeature.componentReferenceId}).fetch();

            let featureTestStatus = FeatureTestSummaryStatus.FEATURE_NO_TESTS;
            let passingTests = 0;
            let failingTests = 0;
            let featureNoTestScenarios = 0;

            featureScenarios.forEach((featureScenario)=>{
                //console.log("  Has Scenario " + featureScenario.scenarioReferenceId);
                let hasResult = false;

                if(featureScenario.accTestStatus === MashTestStatus.MASH_FAIL){
                    //console.log("    FAIL");
                    failingTests++;
                    hasResult = true;
                }
                if(featureScenario.intTestStatus === MashTestStatus.MASH_FAIL){
                    //console.log("    FAIL");
                    failingTests++;
                    hasResult = true;
                }

                if(featureScenario.unitTestFailCount > 0) {
                    failingTests += featureScenario.unitTestFailCount;
                    hasResult = true;
                }

                if(featureScenario.accTestStatus === MashTestStatus.MASH_PASS){
                    //console.log("    PASS");
                    passingTests++;
                    hasResult = true;
                }
                if(featureScenario.intTestStatus === MashTestStatus.MASH_PASS){
                    //console.log("    PASS");
                    passingTests++;
                    hasResult = true;
                }

                if(featureScenario.unitTestPassCount > 0) {
                    passingTests += featureScenario.unitTestPassCount;
                    hasResult = true;
                }

                // Any fails is a fail even if passes.  Any passes and no fails is a pass
                if(failingTests > 0){
                    featureTestStatus = FeatureTestSummaryStatus.FEATURE_FAILING_TESTS;
                } else {
                    if(passingTests > 0){
                        featureTestStatus = FeatureTestSummaryStatus.FEATURE_PASSING_TESTS;
                    }
                }

                if(hasResult === false) {
                    featureNoTestScenarios++;
                }

            });

            UserDevTestSummaryData.insert({
                userId:                         userContext.userId,
                designVersionId:                userContext.designVersionId,
                designUpdateId:                 userContext.designUpdateId,
                scenarioReferenceId:            'NONE',
                featureReferenceId:             designFeature.componentReferenceId,
                accTestStatus:                  MashTestStatus.MASH_NOT_LINKED,
                intTestStatus:                  MashTestStatus.MASH_NOT_LINKED,
                unitTestPassCount:               0,
                unitTestFailCount:               0,
                featureSummaryStatus:           featureTestStatus,
                featureTestPassCount:           passingTests,
                featureTestFailCount:           failingTests,
                featureNoTestCount:             featureNoTestScenarios
            });

        });


    }

}

export default new TestSummaryServices();
