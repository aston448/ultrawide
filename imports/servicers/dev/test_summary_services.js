
// Ultrawide Collections
import { UserDevTestSummaryData }       from '../../collections/dev/user_dev_test_summary_data.js';
import { UserDevDesignSummaryData }     from '../../collections/dev/user_dev_design_summary_data.js';
import { DesignVersionComponents }      from '../../collections/design/design_version_components.js';
import { DesignUpdateComponents }       from '../../collections/design_update/design_update_components.js';
import { WorkPackageComponents }        from '../../collections/work/work_package_components.js';
import { UserIntTestResults }           from '../../collections/dev/user_int_test_results.js';
import { UserUnitTestResults }          from '../../collections/dev/user_unit_test_results.js';

// Ultrawide services
import { ComponentType, MashStatus, MashTestStatus, FeatureTestSummaryStatus, UpdateMergeStatus, UpdateScopeType, WorkPackageScopeType, LogLevel }   from '../../constants/constants.js';
import {log}        from '../../common/utils.js'

import ClientIdentityServices       from '../../apiClient/apiIdentity.js';
import ChimpMochaTestServices       from '../../service_modules/dev/test_processor_chimp_mocha.js';

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
        });

        // Get the Design Scenario Data
        const designScenarios = DesignVersionComponents.find({
            designId: userContext.designId,
            designVersionId: userContext.designVersionId,
            componentType: ComponentType.SCENARIO,
            updateMergeStatus : {$ne: UpdateMergeStatus.COMPONENT_REMOVED}
        }).fetch();

        const totalScenarioCount = designScenarios.length;
        let totalUnitTestsPassing = 0;
        let totalUnitTestsFailing = 0;
        let totalUnitTestsPending = 0;
        let totalIntTestsPassing = 0;
        let totalIntTestsFailing = 0;
        let totalIntTestsPending = 0;
        let totalAccTestsPassing = 0;
        let totalAccTestsFailing = 0;
        let totalAccTestsPending = 0;
        let totalScenariosWithoutTests = 0;

        // Populate the Scenario summary data
        designScenarios.forEach((designScenario) =>{

            let integrationTestResult = null;
            let scenarioName = '';
            let featureReferenceId = '';

            let acceptanceTestDisplay = MashTestStatus.MASH_NOT_LINKED;
            let integrationTestDisplay = MashTestStatus.MASH_NOT_LINKED;
            let unitTestPasses = 0;
            let unitTestFails = 0;
            let testsFound = false;

            // See if we have any test results
            scenarioName = designScenario.componentNameNew;
            featureReferenceId = designScenario.componentFeatureReferenceIdNew;

            // TODO Acceptance Tests

            // Integration Tests
            integrationTestResult = UserIntTestResults.findOne(
                {
                    userId:     userContext.userId,
                    testName:   scenarioName
                }
            );

            if(integrationTestResult){
                integrationTestDisplay = integrationTestResult.testResult;

                switch(integrationTestResult.testResult){
                    case MashTestStatus.MASH_PASS:
                        totalIntTestsPassing++;
                        testsFound = true;
                        break;
                    case MashTestStatus.MASH_FAIL:
                        totalIntTestsFailing++;
                        testsFound = true;
                        break;
                    case MashTestStatus.MASH_PENDING:
                        totalIntTestsPending++;
                }
            } else{

            }

            // Unit Tests - tests related to a Scenario
            let searchRegex = new RegExp(scenarioName);

            unitTestPasses = UserUnitTestResults.find({
                userId:         userContext.userId,
                testFullName:   {$regex: searchRegex},
                testResult:     MashTestStatus.MASH_PASS
            }).count();

            if(unitTestPasses > 0){
                testsFound = true;
            }
            totalUnitTestsPassing += unitTestPasses;

            unitTestFails= UserUnitTestResults.find({
                userId:         userContext.userId,
                testFullName:   {$regex: searchRegex},
                testResult:     MashTestStatus.MASH_FAIL
            }).count();

            if(unitTestFails > 0){
                testsFound = true;
            }
            totalUnitTestsFailing += unitTestFails;

            UserDevTestSummaryData.insert({
                userId:                         userContext.userId,
                designVersionId:                userContext.designVersionId,
                designUpdateId:                 userContext.designUpdateId,
                scenarioReferenceId:            designScenario.componentReferenceId,
                featureReferenceId:             featureReferenceId,
                accTestStatus:                  acceptanceTestDisplay,
                intTestStatus:                  integrationTestDisplay,
                unitTestPassCount:              unitTestPasses,
                unitTestFailCount:              unitTestFails,
                featureSummaryStatus:           FeatureTestSummaryStatus.FEATURE_NO_TESTS,
                duFeatureSummaryStatus:         FeatureTestSummaryStatus.FEATURE_NO_TESTS,
                wpFeatureSummaryStatus:         FeatureTestSummaryStatus.FEATURE_NO_TESTS,
            });


            if(!testsFound){
                totalScenariosWithoutTests++;
            }

        });

        // Populate the Feature summary data
        const designFeatures = DesignVersionComponents.find({
            designId: userContext.designId,
            designVersionId: userContext.designVersionId,
            componentType: ComponentType.FEATURE
        }).fetch();


        const totalFeatureCount = designFeatures.length;

        designFeatures.forEach((designFeature) =>{

            let featureScenarios = UserDevTestSummaryData.find({
                designVersionId:    userContext.designVersionId,
                featureReferenceId: designFeature.componentReferenceId
            }).fetch();

            let featureTestStatus = FeatureTestSummaryStatus.FEATURE_NO_TESTS;
            let passingTests = 0;
            let failingTests = 0;
            let featureNoTestScenarios = 0;

            let duFeatureTestStatus = FeatureTestSummaryStatus.FEATURE_NO_TESTS;
            let duPassingTests = 0;
            let duFailingTests = 0;
            let duFeatureNoTestScenarios = 0;

            let wpFeatureTestStatus = FeatureTestSummaryStatus.FEATURE_NO_TESTS;
            let wpPassingTests = 0;
            let wpFailingTests = 0;
            let wpFeatureNoTestScenarios = 0;

            featureScenarios.forEach((featureScenario)=>{

                let hasResult = false;

                if(featureScenario.accTestStatus === MashTestStatus.MASH_FAIL){
                    failingTests++;
                    hasResult = true;
                }
                if(featureScenario.intTestStatus === MashTestStatus.MASH_FAIL){
                    failingTests++;
                    hasResult = true;
                }

                if(featureScenario.unitTestFailCount > 0) {
                    failingTests += featureScenario.unitTestFailCount;
                    hasResult = true;
                }

                if(featureScenario.accTestStatus === MashTestStatus.MASH_PASS){
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

                // Get stats for DU if this feature scenario in DU
                if(userContext.designUpdateId !== 'NONE') {
                    const inDu = DesignUpdateComponents.findOne({
                        designUpdateId: userContext.designUpdateId,
                        componentReferenceId: featureScenario.scenarioReferenceId,
                        scopeType: UpdateScopeType.SCOPE_IN_SCOPE
                    });

                    if (inDu) {
                        if (featureScenario.accTestStatus === MashTestStatus.MASH_FAIL) {
                            duFailingTests++;
                        }
                        if (featureScenario.intTestStatus === MashTestStatus.MASH_FAIL) {
                            duFailingTests++;
                        }

                        if (featureScenario.unitTestFailCount > 0) {
                            duFailingTests += featureScenario.unitTestFailCount;
                        }

                        if (featureScenario.accTestStatus === MashTestStatus.MASH_PASS) {
                            duPassingTests++;
                        }
                        if (featureScenario.intTestStatus === MashTestStatus.MASH_PASS) {
                            duPassingTests++;
                        }

                        if (featureScenario.unitTestPassCount > 0) {
                            duPassingTests += featureScenario.unitTestPassCount;
                        }

                        // Any fails is a fail even if passes.  Any passes and no fails is a pass
                        if (failingTests > 0) {
                            duFeatureTestStatus = FeatureTestSummaryStatus.FEATURE_FAILING_TESTS;
                        } else {
                            if (passingTests > 0) {
                                duFeatureTestStatus = FeatureTestSummaryStatus.FEATURE_PASSING_TESTS;
                            }
                        }

                        if (hasResult === false) {
                            duFeatureNoTestScenarios++;
                        }
                    }
                }

                // Get stats for WP if this feature scenario in WP
                if(userContext.workPackageId !== 'NONE') {
                    const inWp = WorkPackageComponents.findOne({
                        workPackageId: userContext.workPackageId,
                        componentReferenceId: featureScenario.scenarioReferenceId,
                        scopeType: WorkPackageScopeType.SCOPE_ACTIVE
                    });

                    if (inWp) {
                        if (featureScenario.accTestStatus === MashTestStatus.MASH_FAIL) {
                            wpFailingTests++;
                        }
                        if (featureScenario.intTestStatus === MashTestStatus.MASH_FAIL) {
                            wpFailingTests++;
                        }

                        if (featureScenario.unitTestFailCount > 0) {
                            wpFailingTests += featureScenario.unitTestFailCount;
                        }

                        if (featureScenario.accTestStatus === MashTestStatus.MASH_PASS) {
                            wpPassingTests++;
                        }
                        if (featureScenario.intTestStatus === MashTestStatus.MASH_PASS) {
                            wpPassingTests++;
                        }

                        if (featureScenario.unitTestPassCount > 0) {
                            wpPassingTests += featureScenario.unitTestPassCount;
                        }

                        // Any fails is a fail even if passes.  Any passes and no fails is a pass
                        if (failingTests > 0) {
                            wpFeatureTestStatus = FeatureTestSummaryStatus.FEATURE_FAILING_TESTS;
                        } else {
                            if (passingTests > 0) {
                                wpFeatureTestStatus = FeatureTestSummaryStatus.FEATURE_PASSING_TESTS;
                            }
                        }

                        if (hasResult === false) {
                            wpFeatureNoTestScenarios++;
                        }
                    }
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
                featureNoTestCount:             featureNoTestScenarios,
                duFeatureSummaryStatus:         duFeatureTestStatus,
                duFeatureTestPassCount:         duPassingTests,
                duFeatureTestFailCount:         duFailingTests,
                duFeatureNoTestCount:           duFeatureNoTestScenarios,
                wpFeatureSummaryStatus:         wpFeatureTestStatus,
                wpFeatureTestPassCount:         wpPassingTests,
                wpFeatureTestFailCount:         wpFailingTests,
                wpFeatureNoTestCount:           wpFeatureNoTestScenarios,
            });

        });

        // And now refresh the Design Summary
        UserDevDesignSummaryData.remove({
            userId:             userContext.userId,
            // designVersionId:    userContext.designVersionId,
            // designUpdateId:     userContext.designUpdateId
        });


        UserDevDesignSummaryData.insert({
            userId:                         userContext.userId,
            designVersionId:                userContext.designVersionId,
            designUpdateId:                 userContext.designUpdateId,
            featureCount:                   totalFeatureCount,
            scenarioCount:                  totalScenarioCount,
            untestedScenarioCount:          totalScenariosWithoutTests,
            unitTestPassCount:              totalUnitTestsPassing,
            unitTestFailCount:              totalUnitTestsFailing,
            unitTestPendingCount:           totalUnitTestsPending,
            intTestPassCount:               totalIntTestsPassing,
            intTestFailCount:               totalIntTestsFailing,
            intTestPendingCount:            totalIntTestsPending,
            accTestPassCount:               totalAccTestsPassing,
            accTestFailCount:               totalAccTestsFailing,
            accTestPendingCount:            totalAccTestsPending
        });

    }

}

export default new TestSummaryServices();
