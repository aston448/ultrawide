
// Ultrawide Collections
import { UserDevTestSummaryData }       from '../../collections/summary/user_dev_test_summary_data.js';
import { UserDevDesignSummaryData }     from '../../collections/summary/user_dev_design_summary_data.js';
import { DesignVersionComponents }      from '../../collections/design/design_version_components.js';
import { DesignUpdateComponents }       from '../../collections/design_update/design_update_components.js';
import { WorkPackageComponents }        from '../../collections/work/work_package_components.js';
import { UserIntTestResults }           from '../../collections/dev/user_int_test_results.js';
import { UserUnitTestResults }          from '../../collections/dev/user_unit_test_results.js';

// Ultrawide services
import { ComponentType, ViewType, MashTestStatus, FeatureTestSummaryStatus, UpdateMergeStatus, UpdateScopeType, WorkPackageScopeType, LogLevel }   from '../../constants/constants.js';
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

    refreshTestSummaryData(userContext, updateTestData){

        log((msg) => console.log(msg), LogLevel.DEBUG, "Refreshing test summary data with update = {}", updateTestData);

        let totalScenarioCount = 0;
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
        let totalPassingScenarioCount = 0;
        let totalFailingScenarioCount = 0;

        // If the test data needs refreshing...
        if(updateTestData) {

            // Delete data for current user context
            UserDevTestSummaryData.remove({
                userId: userContext.userId,
            });

            log((msg) => console.log(msg), LogLevel.DEBUG, "Data removed");

            // Get the Design Scenario Data
            const designScenarios = DesignVersionComponents.find({
                designId: userContext.designId,
                designVersionId: userContext.designVersionId,
                componentType: ComponentType.SCENARIO,
                updateMergeStatus: {$ne: UpdateMergeStatus.COMPONENT_REMOVED}
            }).fetch();

            totalScenarioCount = designScenarios.length;

            log((msg) => console.log(msg), LogLevel.DEBUG, "Got Scenarios");

            // Populate the Scenario summary data
            designScenarios.forEach((designScenario) => {

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
                        userId: userContext.userId,
                        testName: scenarioName
                    }
                );

                if (integrationTestResult) {
                    integrationTestDisplay = integrationTestResult.testResult;

                    switch (integrationTestResult.testResult) {
                        case MashTestStatus.MASH_PASS:
                            log((msg) => console.log(msg), LogLevel.TRACE, "  -- Int Test pass for Scenario {}", designScenario.componentNameNew);
                            totalIntTestsPassing++;
                            testsFound = true;
                            break;
                        case MashTestStatus.MASH_FAIL:
                            log((msg) => console.log(msg), LogLevel.TRACE, "  -- Int Test fail for Scenario {}", designScenario.componentNameNew);
                            totalIntTestsFailing++;
                            testsFound = true;
                            break;
                        case MashTestStatus.MASH_PENDING:
                            log((msg) => console.log(msg), LogLevel.TRACE, "  -- Int Test pending for Scenario {}", designScenario.componentNameNew);
                            totalIntTestsPending++;
                    }
                } else {

                }

                // Unit Tests - tests related to a Scenario
                let searchRegex = new RegExp(scenarioName);

                unitTestPasses = UserUnitTestResults.find({
                    userId: userContext.userId,
                    testFullName: {$regex: searchRegex},
                    testResult: MashTestStatus.MASH_PASS
                }).count();

                if (unitTestPasses > 0) {
                    log((msg) => console.log(msg), LogLevel.TRACE, "  -- {} Unit Test pass for Scenario {}", unitTestPasses, designScenario.componentNameNew);
                    testsFound = true;
                }
                totalUnitTestsPassing += unitTestPasses;

                unitTestFails = UserUnitTestResults.find({
                    userId: userContext.userId,
                    testFullName: {$regex: searchRegex},
                    testResult: MashTestStatus.MASH_FAIL
                }).count();

                if (unitTestFails > 0) {
                    log((msg) => console.log(msg), LogLevel.TRACE, "  -- {} Unit Test fail for Scenario {}", unitTestFails, designScenario.componentNameNew);
                    testsFound = true;
                }
                totalUnitTestsFailing += unitTestFails;

                // Update Scenario pass fail count
                if(acceptanceTestDisplay === MashTestStatus.MASH_FAIL || integrationTestDisplay === MashTestStatus.MASH_FAIL || unitTestFails > 0){
                    totalFailingScenarioCount++
                } else {
                    if(acceptanceTestDisplay === MashTestStatus.MASH_PASS || integrationTestDisplay === MashTestStatus.MASH_PASS || unitTestPasses > 0){
                        totalPassingScenarioCount++
                    }
                }

                log((msg) => console.log(msg), LogLevel.TRACE, "  -- Inserting Summary data for Scenario {} with id {} scenRef {} featureRef {} and tests found {}",
                    designScenario.componentNameNew, designScenario.componentReferenceId, designScenario.componentReferenceId, featureReferenceId, testsFound);

                UserDevTestSummaryData.insert({
                    userId: userContext.userId,
                    designVersionId: userContext.designVersionId,
                    scenarioReferenceId: designScenario.componentReferenceId,
                    featureReferenceId: featureReferenceId,
                    accTestStatus: acceptanceTestDisplay,
                    intTestStatus: integrationTestDisplay,
                    unitTestPassCount: unitTestPasses,
                    unitTestFailCount: unitTestFails,
                    featureSummaryStatus: FeatureTestSummaryStatus.FEATURE_NO_TESTS,
                    duFeatureSummaryStatus: FeatureTestSummaryStatus.FEATURE_NO_TESTS,
                    wpFeatureSummaryStatus: FeatureTestSummaryStatus.FEATURE_NO_TESTS,
                });


                if (!testsFound) {
                    log((msg) => console.log(msg), LogLevel.TRACE, "  -- No tests for Scenario {}", designScenario.componentNameNew);
                    totalScenariosWithoutTests++;
                }

            });

            log((msg) => console.log(msg), LogLevel.DEBUG, "Scenarios populated");
        }

        // Populate the Feature summary data
        const designFeatures = DesignVersionComponents.find({
                designId: userContext.designId,
                designVersionId: userContext.designVersionId,
                componentType: ComponentType.FEATURE,
                updateMergeStatus: {$ne: UpdateMergeStatus.COMPONENT_REMOVED}
            }).fetch();

        const totalFeatureCount = designFeatures.length;

        designFeatures.forEach((designFeature) =>{

            log((msg) => console.log(msg), LogLevel.TRACE, "FEATURE {}", designFeature.componentNameNew);

            let featureScenarios = UserDevTestSummaryData.find({
                userId:                 userContext.userId,
                designVersionId:        userContext.designVersionId,
                featureReferenceId:     designFeature.componentReferenceId,
                scenarioReferenceId:    {$ne: 'NONE'}
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

                log((msg) => console.log(msg), LogLevel.TRACE, "Processing Summary Scenario: {}", featureScenario.scenarioReferenceId);

                let hasResult = false;
                let duHasResult = false;
                let wpHasResult = false;

                if(featureScenario.accTestStatus === MashTestStatus.MASH_FAIL){
                    log((msg) => console.log(msg), LogLevel.TRACE, "  -- Acc Test fail {}", featureScenario.scenarioReferenceId);
                    failingTests++;
                }
                if(featureScenario.intTestStatus === MashTestStatus.MASH_FAIL){
                    log((msg) => console.log(msg), LogLevel.TRACE, "  -- Int Test fail {}", featureScenario.scenarioReferenceId);
                    failingTests++;
                }

                if(featureScenario.unitTestFailCount > 0) {
                    log((msg) => console.log(msg), LogLevel.TRACE, "  -- Unit Test fail {}", featureScenario.scenarioReferenceId);
                    failingTests += featureScenario.unitTestFailCount;
                }

                if(featureScenario.accTestStatus === MashTestStatus.MASH_PASS){
                    log((msg) => console.log(msg), LogLevel.TRACE, "  -- Acc Test pass {}", featureScenario.scenarioReferenceId);
                    passingTests++;
                }
                if(featureScenario.intTestStatus === MashTestStatus.MASH_PASS){
                    log((msg) => console.log(msg), LogLevel.TRACE, "  -- Int Test pass {}", featureScenario.scenarioReferenceId);
                    passingTests++;
                }

                if(featureScenario.unitTestPassCount > 0) {
                    log((msg) => console.log(msg), LogLevel.TRACE, "  -- Unit Test pass {}", featureScenario.scenarioReferenceId);
                    passingTests += featureScenario.unitTestPassCount;
                }

                // Any fails is a fail even if passes.  Any passes and no fails is a pass
                if(failingTests > 0){
                    featureTestStatus = FeatureTestSummaryStatus.FEATURE_FAILING_TESTS;
                    hasResult = true;
                } else {
                    if(passingTests > 0){
                        featureTestStatus = FeatureTestSummaryStatus.FEATURE_PASSING_TESTS;
                        hasResult = true;
                    }
                }

                if(!hasResult) {
                    log((msg) => console.log(msg), LogLevel.TRACE, "  -- Scenario with no test {}", featureScenario.scenarioReferenceId);
                    featureNoTestScenarios++;
                }

                let duComponent = null;
                let wpComponent = null;


                // Get stats for DU if this feature scenario in DU
                if(userContext.designUpdateId !== 'NONE') {

                    duComponent = DesignUpdateComponents.findOne({
                        designUpdateId: userContext.designUpdateId,
                        componentReferenceId: featureScenario.scenarioReferenceId,
                        scopeType: UpdateScopeType.SCOPE_IN_SCOPE
                    });

                    if (duComponent && userContext.workPackageId === 'NONE') {

                        log((msg) => console.log(msg), LogLevel.TRACE, "Adding DU scenario {}", duComponent.componentNameNew);

                        if (featureScenario.accTestStatus === MashTestStatus.MASH_FAIL) {
                            duFailingTests++;
                        }
                        if (featureScenario.intTestStatus === MashTestStatus.MASH_FAIL) {
                            duFailingTests++;
                            log((msg) => console.log(msg), LogLevel.TRACE, "Failed INT test.  Count: {}", duFailingTests);
                        }

                        if (featureScenario.unitTestFailCount > 0) {
                            log((msg) => console.log(msg), LogLevel.TRACE, "Failed UNIT tests {}", featureScenario.unitTestFailCount);
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
                            duHasResult = true;
                        } else {
                            if (passingTests > 0) {
                                duFeatureTestStatus = FeatureTestSummaryStatus.FEATURE_PASSING_TESTS;
                                duHasResult = true;
                            }
                        }

                        if (duHasResult === false) {
                            duFeatureNoTestScenarios++;
                        }
                    }
                }

                // Get stats for WP if this feature scenario in WP
                if(userContext.workPackageId !== 'NONE') {

                    wpComponent = WorkPackageComponents.findOne({
                        workPackageId: userContext.workPackageId,
                        componentReferenceId: featureScenario.scenarioReferenceId,
                        scopeType: WorkPackageScopeType.SCOPE_ACTIVE
                    });

                    let nonRemovedComponent = true;

                    if(duComponent && duComponent.isRemoved){
                        nonRemovedComponent = false;
                    }

                    if (wpComponent && nonRemovedComponent) {

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
                            wpHasResult = true;
                        } else {
                            if (passingTests > 0) {
                                wpFeatureTestStatus = FeatureTestSummaryStatus.FEATURE_PASSING_TESTS;
                                wpHasResult = true;
                            }
                        }

                        if (wpHasResult === false) {
                            wpFeatureNoTestScenarios++;
                        }

                        log((msg) => console.log(msg), LogLevel.TRACE, "WP Passing Tests =  {}", wpPassingTests);
                    }
                }

            });

            if(updateTestData) {

                log((msg) => console.log(msg), LogLevel.TRACE, "Adding Feature {} {} with Pass {} Fail {}, Untested {}", designFeature.componentNameNew, designFeature.componentReferenceId, passingTests, failingTests, featureNoTestScenarios);

                UserDevTestSummaryData.insert({
                    userId: userContext.userId,
                    designVersionId: userContext.designVersionId,
                    scenarioReferenceId: 'NONE',
                    featureReferenceId: designFeature.componentReferenceId,
                    accTestStatus: MashTestStatus.MASH_NOT_LINKED,
                    intTestStatus: MashTestStatus.MASH_NOT_LINKED,
                    unitTestPassCount: 0,
                    unitTestFailCount: 0,
                    featureSummaryStatus: featureTestStatus,
                    featureTestPassCount: passingTests,
                    featureTestFailCount: failingTests,
                    featureNoTestCount: featureNoTestScenarios,
                    duFeatureSummaryStatus: duFeatureTestStatus,
                    duFeatureTestPassCount: duPassingTests,
                    duFeatureTestFailCount: duFailingTests,
                    duFeatureNoTestCount: duFeatureNoTestScenarios,
                    wpFeatureSummaryStatus: wpFeatureTestStatus,
                    wpFeatureTestPassCount: wpPassingTests,
                    wpFeatureTestFailCount: wpFailingTests,
                    wpFeatureNoTestCount: wpFeatureNoTestScenarios,
                });

                // And now refresh the Design Summary
                UserDevDesignSummaryData.remove({
                    userId:             userContext.userId,
                });

                UserDevDesignSummaryData.insert({
                    userId:                         userContext.userId,
                    designVersionId:                userContext.designVersionId,
                    featureCount:                   totalFeatureCount,
                    scenarioCount:                  totalScenarioCount,
                    untestedScenarioCount:          totalScenariosWithoutTests,
                    passingScenarioCount:           totalPassingScenarioCount,
                    failingScenarioCount:           totalFailingScenarioCount,
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

            } else {

                // Just update the feature data to reflect a change in WP / DU...
                log((msg) => console.log(msg), LogLevel.TRACE, "Updating feature {} setting no test count to {} ", designFeature.componentReferenceId, featureNoTestScenarios);

                const updated = UserDevTestSummaryData.update(
                    {
                        userId: userContext.userId,
                        designVersionId: userContext.designVersionId,
                        scenarioReferenceId: 'NONE',
                        featureReferenceId: designFeature.componentReferenceId
                    },
                    {
                        $set:{
                            accTestStatus: MashTestStatus.MASH_NOT_LINKED,
                            intTestStatus: MashTestStatus.MASH_NOT_LINKED,
                            unitTestPassCount: 0,
                            unitTestFailCount: 0,
                            featureSummaryStatus: featureTestStatus,
                            featureTestPassCount: passingTests,
                            featureTestFailCount: failingTests,
                            featureNoTestCount: featureNoTestScenarios,
                            duFeatureSummaryStatus: duFeatureTestStatus,
                            duFeatureTestPassCount: duPassingTests,
                            duFeatureTestFailCount: duFailingTests,
                            duFeatureNoTestCount: duFeatureNoTestScenarios,
                            wpFeatureSummaryStatus: wpFeatureTestStatus,
                            wpFeatureTestPassCount: wpPassingTests,
                            wpFeatureTestFailCount: wpFailingTests,
                            wpFeatureNoTestCount: wpFeatureNoTestScenarios
                        }
                    }
                );

                log((msg) => console.log(msg), LogLevel.TRACE, "{} row updated", updated);
            }

        });

        log((msg) => console.log(msg), LogLevel.DEBUG, "Features calculated");



        log((msg) => console.log(msg), LogLevel.DEBUG, "Refreshing test summary data complete");
    }

}

export default new TestSummaryServices();
