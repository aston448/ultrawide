
// Ultrawide services
import { MashTestStatus, FeatureTestSummaryStatus, UpdateScopeType, WorkPackageScopeType, LogLevel }   from '../../constants/constants.js';
import {log}        from '../../common/utils.js'

// Data Access
import DesignVersionData                from '../../data/design/design_version_db.js';
import UserDevTestSummaryData           from '../../data/summary/user_dev_test_summary_db.js';
import UserDevDesignSummaryData         from '../../data/summary/user_dev_design_summary_db.js';
import DesignUpdateComponentData        from '../../data/design_update/design_update_component_db.js';
import WorkPackageComponentData         from '../../data/work/work_package_component_db.js';
import UserDvMashScenarioData           from '../../data/mash/user_dv_mash_scenario_db.js'

//======================================================================================================================
//
// Server Code for Test Summary Processing.
//
// Methods called directly by Server API
//
//======================================================================================================================

class TestSummaryServices {

    refreshTestSummaryData(userContext){

        // NOTE: Test Summary data only holds data at the Feature level.  The Scenario data in the test summary comes
        // directly from the test results scenario mash data

        log((msg) => console.log(msg), LogLevel.DEBUG, "Refreshing test summary data...");

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

        // Delete data for current user context.
        // Its MUCH faster to remove everything, recalc and then do a bulk insert than to do updates one by one
        UserDevTestSummaryData.removeAllUserData(userContext.userId);
        UserDevDesignSummaryData.removeAllUserData(userContext.userId);

        log((msg) => console.log(msg), LogLevel.DEBUG, "Data removed");

        // Populate the Feature summary data
        const designFeatures = DesignVersionData.getNonRemovedFeatures(userContext.designId, userContext.designVersionId);

        const totalFeatureCount = designFeatures.length;

        let batchData = [];

        designFeatures.forEach((designFeature) =>{

            log((msg) => console.log(msg), LogLevel.TRACE, "FEATURE {}", designFeature.componentNameNew);

            let featureScenarios = UserDvMashScenarioData.getFeatureScenarios(
                userContext.userId,
                userContext.designVersionId,
                designFeature.componentReferenceId
            );

            let featureTestStatus = FeatureTestSummaryStatus.FEATURE_NO_TESTS;
            let featurePassingTests = 0;
            let featureFailingTests = 0;
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

                totalScenarioCount++;

                log((msg) => console.log(msg), LogLevel.TRACE, "Processing Summary Scenario: {} with unit pass count {}", featureScenario.scenarioName, featureScenario.unitPassCount);

                let hasResult = false;
                let duHasResult = false;
                let wpHasResult = false;

                let scenarioPassingTests = 0;
                let scenarioFailingTests = 0;


                if(featureScenario.accMashTestStatus === MashTestStatus.MASH_FAIL){
                    log((msg) => console.log(msg), LogLevel.TRACE, "  -- Acc Test fail {}", featureScenario.scenarioName);
                    featureFailingTests++;
                    scenarioFailingTests++;
                    hasResult = true;
                }
                if(featureScenario.intMashTestStatus === MashTestStatus.MASH_FAIL){
                    log((msg) => console.log(msg), LogLevel.TRACE, "  -- Int Test fail {}", featureScenario.scenarioName);
                    featureFailingTests++;
                    scenarioFailingTests++;
                    hasResult = true;
                }

                if(featureScenario.unitFailCount > 0) {
                    log((msg) => console.log(msg), LogLevel.TRACE, "  -- Unit Test fail {}", featureScenario.scenarioName);
                    featureFailingTests += featureScenario.unitFailCount;
                    scenarioFailingTests += featureScenario.unitFailCount;
                    hasResult = true;
                }

                if(featureScenario.accMashTestStatus === MashTestStatus.MASH_PASS){
                    log((msg) => console.log(msg), LogLevel.TRACE, "  -- Acc Test pass {}", featureScenario.scenarioName);
                    featurePassingTests++;
                    scenarioPassingTests++;
                    hasResult = true;
                }
                if(featureScenario.intMashTestStatus === MashTestStatus.MASH_PASS){
                    log((msg) => console.log(msg), LogLevel.TRACE, "  -- Int Test pass {}", featureScenario.scenarioName);
                    featurePassingTests++;
                    scenarioPassingTests++;
                    hasResult = true;
                }

                if(featureScenario.unitPassCount > 0) {
                    log((msg) => console.log(msg), LogLevel.TRACE, "  -- Unit Test pass {}", featureScenario.scenarioName);
                    featurePassingTests += featureScenario.unitPassCount;
                    scenarioPassingTests += featureScenario.unitPassCount;
                    hasResult = true;
                }

                // Any fails is a fail even if passes.  Any passes and no fails is a pass
                if(scenarioFailingTests > 0){
                    totalFailingScenarioCount ++;
                } else {
                    if(scenarioPassingTests > 0){
                        totalPassingScenarioCount++;
                    }
                }

                if(!hasResult) {
                    log((msg) => console.log(msg), LogLevel.TRACE, "  -- Scenario with no test {}", featureScenario.scenarioName);
                    featureNoTestScenarios++;
                    totalScenariosWithoutTests++;

                }

                let duComponent = null;
                let wpComponent = null;


                // Get stats for DU if this feature scenario in DU
                if(userContext.designUpdateId !== 'NONE') {

                    duComponent = DesignUpdateComponentData.getUpdateComponentByRef(
                        userContext.designVersionId,
                        userContext.designUpdateId,
                        featureScenario.designScenarioReferenceId
                    );

                    if (duComponent && duComponent.scopeType === UpdateScopeType.SCOPE_IN_SCOPE) {

                        log((msg) => console.log(msg), LogLevel.TRACE, "Adding DU scenario {}", duComponent.componentNameNew);

                        if (featureScenario.accMashTestStatus === MashTestStatus.MASH_FAIL) {
                            duFailingTests++;
                            duHasResult = true;
                        }
                        if (featureScenario.intMashTestStatus === MashTestStatus.MASH_FAIL) {
                            duFailingTests++;
                            duHasResult = true;
                            log((msg) => console.log(msg), LogLevel.TRACE, "Failed INT test.  Count: {}", duFailingTests);
                        }

                        if (featureScenario.unitFailCount > 0) {
                            log((msg) => console.log(msg), LogLevel.TRACE, "Failed UNIT tests {}", featureScenario.unitFailCount);
                            duFailingTests += featureScenario.unitFailCount;
                            duHasResult = true;
                        }

                        if (featureScenario.accMashTestStatus === MashTestStatus.MASH_PASS) {
                            duPassingTests++;
                            duHasResult = true;
                        }
                        if (featureScenario.intMashTestStatus === MashTestStatus.MASH_PASS) {
                            duPassingTests++;
                            duHasResult = true;
                        }

                        if (featureScenario.unitPassCount > 0) {
                            duPassingTests += featureScenario.unitPassCount;
                            duHasResult = true;
                        }

                        // Any fails is a fail even if passes.  Any passes and no fails is a pass
                        if (duFailingTests > 0) {
                            duFeatureTestStatus = FeatureTestSummaryStatus.FEATURE_FAILING_TESTS;
                        } else {
                            if (duPassingTests > 0) {
                                duFeatureTestStatus = FeatureTestSummaryStatus.FEATURE_PASSING_TESTS;
                            }
                        }

                        if (!duHasResult) {
                            duFeatureNoTestScenarios++;
                        }
                    }
                }

                // Get stats for WP if this feature scenario in WP
                if(userContext.workPackageId !== 'NONE') {

                    wpComponent = WorkPackageComponentData.getWpComponentByComponentRef(
                        userContext.workPackageId,
                        featureScenario.designScenarioReferenceId
                    );

                    let nonRemovedComponent = true;

                    if(duComponent && duComponent.isRemoved){
                        nonRemovedComponent = false;
                    }

                    if (wpComponent && wpComponent.scopeType === WorkPackageScopeType.SCOPE_ACTIVE && nonRemovedComponent) {

                        if (featureScenario.accMashTestStatus === MashTestStatus.MASH_FAIL) {
                            wpFailingTests++;
                            wpHasResult = true;
                        }
                        if (featureScenario.intMashTestStatus === MashTestStatus.MASH_FAIL) {
                            wpFailingTests++;
                            wpHasResult = true;
                        }

                        if (featureScenario.unitFailCount > 0) {
                            wpFailingTests += featureScenario.unitFailCount;
                            wpHasResult = true;
                        }

                        if (featureScenario.accMashTestStatus === MashTestStatus.MASH_PASS) {
                            wpPassingTests++;
                            wpHasResult = true;
                        }
                        if (featureScenario.intMashTestStatus === MashTestStatus.MASH_PASS) {
                            wpPassingTests++;
                            wpHasResult = true;
                        }

                        if (featureScenario.unitPassCount > 0) {
                            wpPassingTests += featureScenario.unitPassCount;
                            wpHasResult = true;
                        }

                        // Any fails is a fail even if passes.  Any passes and no fails is a pass
                        if (wpFailingTests > 0) {
                            wpFeatureTestStatus = FeatureTestSummaryStatus.FEATURE_FAILING_TESTS;

                        } else {
                            if (wpPassingTests > 0) {
                                wpFeatureTestStatus = FeatureTestSummaryStatus.FEATURE_PASSING_TESTS;
                            }
                        }

                        if (!wpHasResult) {
                            wpFeatureNoTestScenarios++;
                        }

                        log((msg) => console.log(msg), LogLevel.TRACE, "WP Passing Tests =  {}", wpPassingTests);
                    }
                }

            });

            // Any fails at feature level is a fail even if passes.  Any passes and no fails is a pass
            if(featureFailingTests > 0){
                featureTestStatus = FeatureTestSummaryStatus.FEATURE_FAILING_TESTS;
            } else {
                if(featurePassingTests > 0){
                    featureTestStatus = FeatureTestSummaryStatus.FEATURE_PASSING_TESTS;
                }
            }

            log((msg) => console.log(msg), LogLevel.TRACE, "Adding Feature {} {} with Pass {} Fail {}, Untested {}", designFeature.componentNameNew, designFeature.componentReferenceId, featurePassingTests, featureFailingTests, featureNoTestScenarios);

            batchData.push({
                userId: userContext.userId,
                designVersionId: userContext.designVersionId,
                scenarioReferenceId: 'NONE',
                featureReferenceId: designFeature.componentReferenceId,
                accTestStatus: MashTestStatus.MASH_NOT_LINKED,
                intTestStatus: MashTestStatus.MASH_NOT_LINKED,
                unitTestPassCount: 0,
                unitTestFailCount: 0,
                featureSummaryStatus: featureTestStatus,
                featureTestPassCount: featurePassingTests,
                featureTestFailCount: featureFailingTests,
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

        });

        // Bulk insert new feature summary data
        if(batchData.length > 0) {
            UserDevTestSummaryData.bulkInsertData(batchData);
        }

        UserDevDesignSummaryData.insertNewDesignVersionSummary(
            userContext.userId,
            userContext.designVersionId,
            totalFeatureCount,
            totalScenarioCount,
            totalScenariosWithoutTests,
            totalPassingScenarioCount,
            totalFailingScenarioCount,
            totalUnitTestsPassing,
            totalUnitTestsFailing,
            totalUnitTestsPending,
            totalIntTestsPassing,
            totalIntTestsFailing,
            totalIntTestsPending,
            totalAccTestsPassing,
            totalAccTestsFailing,
            totalAccTestsPending
        );

        log((msg) => console.log(msg), LogLevel.DEBUG, "Refreshing test summary data complete");
    }

}

export default new TestSummaryServices();
