
// Ultrawide services
import { MashTestStatus, FeatureTestSummaryStatus, UpdateScopeType, WorkPackageScopeType, TestType, LogLevel }   from '../../constants/constants.js';
import {log}        from '../../common/utils.js'

import {ScenarioTestExpectationData}                from "../../data/design/scenario_test_expectations_db";
import {UserDvScenarioTestExpectationStatusData}    from "../../data/mash/user_dv_scenario_test_expectation_status_db";
import {UserDvTestSummaryData}                      from "../../data/summary/user_dv_test_summary_db";
import {WorkPackageComponentData}                   from "../../data/work/work_package_component_db";
import {DesignUpdateComponentData}                  from "../../data/design_update/design_update_component_db";
import {DesignComponentData}                        from "../../data/design/design_component_db";


class TestSummaryModulesClass{

    getSummaryDataForScenario(userContext, scenarioReferenceId){

        const testExpectations = ScenarioTestExpectationData.getScenarioTestExpectationsForScenario(
            userContext.designVersionId,
            scenarioReferenceId
        );

        const scenario = DesignComponentData.getDesignComponentByRef(userContext.designVersionId, scenarioReferenceId);

        let accTestExpectedCount = 0;
        let accTestPassCount = 0;
        let accTestFailCount = 0;
        let accTestMissingCount = 0;
        let intTestExpectedCount = 0;
        let intTestPassCount = 0;
        let intTestFailCount = 0;
        let intTestMissingCount = 0;
        let unitTestExpectedCount = 0;
        let unitTestPassCount = 0;
        let unitTestFailCount = 0;
        let unitTestMissingCount = 0;
        let scenarioTestStatus = MashTestStatus.MASH_NOT_LINKED;

        testExpectations.forEach((testExpectation) => {

            const expectationStatus = UserDvScenarioTestExpectationStatusData.getUserExpectationStatusData(
                userContext.userId,
                userContext.designVersionId,
                testExpectation._id
            );

            if(expectationStatus) {

                switch (testExpectation.testType) {
                    case TestType.ACCEPTANCE:
                        accTestExpectedCount++;
                        switch (expectationStatus.expectationStatus) {
                            case MashTestStatus.MASH_PASS:
                                accTestPassCount++;
                                break;
                            case MashTestStatus.MASH_FAIL:
                                accTestFailCount++;
                                break;
                            default:
                                accTestMissingCount++;
                                break;
                        }
                        break;
                    case TestType.INTEGRATION:
                        intTestExpectedCount++;
                        switch (expectationStatus.expectationStatus) {
                            case MashTestStatus.MASH_PASS:
                                intTestPassCount++;
                                break;
                            case MashTestStatus.MASH_FAIL:
                                intTestFailCount++;
                                break;
                            default:
                                intTestMissingCount++;
                                break;
                        }
                        break;
                    case TestType.UNIT:
                        unitTestExpectedCount++;
                        switch (expectationStatus.expectationStatus) {
                            case MashTestStatus.MASH_PASS:
                                unitTestPassCount++;
                                break;
                            case MashTestStatus.MASH_FAIL:
                                unitTestFailCount++;
                                break;
                            default:
                                unitTestMissingCount++;
                                break;
                        }
                        break;
                }
            }
        });

        // Derive overall status
        const totalExpectedTests = accTestExpectedCount + intTestExpectedCount + unitTestExpectedCount;

        // Fail if any failures at all
        if(accTestFailCount > 0 || intTestFailCount > 0 || unitTestFailCount > 0){
            scenarioTestStatus = MashTestStatus.MASH_FAIL;
        } else {
            // If all expectations are passes (and there were some tests expected) its a total success
            if((totalExpectedTests > 0) &&
                (accTestExpectedCount === accTestPassCount) &&
                (intTestExpectedCount === intTestPassCount) &&
                (unitTestExpectedCount === unitTestPassCount)
            ){
                scenarioTestStatus = MashTestStatus.MASH_PASS;
            } else {
                // No failures and not all passing so if any are passing its a partial success
                if(accTestPassCount > 0 || intTestPassCount > 0 || unitTestPassCount > 0){
                    scenarioTestStatus = MashTestStatus.MASH_INCOMPLETE;
                } else {
                    // There are no tests completed - is this because there are no expectations
                    if(totalExpectedTests > 0){
                        scenarioTestStatus = MashTestStatus.MASH_NO_TESTS;
                    } else {
                        scenarioTestStatus = MashTestStatus.MASH_NO_EXPECTATIONS;
                    }
                }
            }
        }

        // Return a data entry
        return{
            userId:                 userContext.userId,
            designVersionId:        userContext.designVersionId,
            scenarioReferenceId:    scenarioReferenceId,
            featureReferenceId:     scenario.componentFeatureReferenceIdNew,
            accTestExpectedCount:   accTestExpectedCount,
            accTestPassCount:       accTestPassCount,
            accTestFailCount:       accTestFailCount,
            accTestMissingCount:    accTestMissingCount,
            intTestExpectedCount:   intTestExpectedCount,
            intTestPassCount:       intTestPassCount,
            intTestFailCount:       intTestFailCount,
            intTestMissingCount:    intTestMissingCount,
            unitTestExpectedCount:  unitTestExpectedCount,
            unitTestPassCount:      unitTestPassCount,
            unitTestFailCount:      unitTestFailCount,
            unitTestMissingCount:   unitTestMissingCount,
            scenarioTestStatus:     scenarioTestStatus,
        };

    }

    getSummaryDataForFeature(userContext, featureRefId){

        let featureScenarioCount = 0;
        let featureExpectedTestCount = 0;
        let featurePassingTestCount = 0;
        let featureFailingTestCount = 0;
        let featureMissingTestCount = 0;
        let featureTestStatus = MashTestStatus.MASH_NOT_LINKED;

        let featureScenarioSummaries = {};

        // The summary totals will depend on the context - only calculate for what the user actually sees.
        if(userContext.workPackageId !== 'NONE'){

            // Get just scenario summaries in current WP
            const wpScenarios = WorkPackageComponentData.getActiveFeatureScenarios(userContext.workPackageId, featureRefId);

            wpScenarios.forEach((scenario) => {

                const scenarioSummary = UserDvTestSummaryData.getScenarioSummary(
                    userContext.userId, userContext.designVersionId, scenario.componentReferenceId
                );

                featureScenarioSummaries.push(scenarioSummary);
            })
        } else {

            if(userContext.designUpdateId !== 'NONE'){

                // Get just scenario summaries in current DU
                const duScenarios = DesignUpdateComponentData.getNonRemovedFeatureScenarios(
                    userContext.designVersionId,
                    userContext.designUpdateId,
                    featureRefId
                );

                duScenarios.forEach((scenario) => {

                    const scenarioSummary = UserDvTestSummaryData.getScenarioSummary(
                        userContext.userId, userContext.designVersionId, scenario.componentReferenceId
                    );

                    featureScenarioSummaries.push(scenarioSummary);
                });

            } else {

                // Get all scenarios in feature
                featureScenarioSummaries = UserDvTestSummaryData.getScenarioSummariesForFeature(
                    userContext.userId, userContext.designVersionId, featureRefId
                );
            }
        }

        // Now we have all relevant Scenario Summaries for the Feature, calculate a Feature Summary

        featureScenarioSummaries.forEach((sSum) => {

            featureScenarioCount ++;
            featureExpectedTestCount += (sSum.accTestExpectedCount + sSum.intTestExpectedCount + sSum.unitTestExpectedCount);
            featurePassingTestCount += (sSum.accTestPassCount + sSum.intTestPassCount + sSum.unitTestPassCount);
            featureFailingTestCount += (sSum.accTestFailCount + sSum.intTestFailCount + sSum.unitTestFailCount);
            featureMissingTestCount += (sSum.accTestMissingCount + sSum.intTestMissingCount + sSum.unitTestMissingCount);
        });

        //  Status
        if(featureFailingTestCount > 0){
            featureTestStatus = MashTestStatus.MASH_FAIL;
        } else {
            // If all tests are passes (and there were some tests expected) its a total success
            if( (featureExpectedTestCount > 0) &&
                (featureExpectedTestCount === featurePassingTestCount)
            ){
                featureTestStatus = MashTestStatus.MASH_PASS;
            } else {
                // No failures and not all passing so if any are passing its a partial success
                if(featurePassingTestCount > 0){
                    featureTestStatus = MashTestStatus.MASH_INCOMPLETE;
                } else {
                    // There are no tests completed - is this because there are no expectations
                    if(featureExpectedTestCount > 0){
                        featureTestStatus = MashTestStatus.MASH_NO_TESTS;
                    } else {
                        featureTestStatus = MashTestStatus.MASH_NO_EXPECTATIONS;
                    }
                }
            }
        }

        // Return a data entry
        return{
            userId:                     userContext.userId,
            designVersionId:            userContext.designVersionId,
            featureReferenceId:         featureRefId,
            featureScenarioCount:       featureScenarioCount,
            featureExpectedTestCount:   featureExpectedTestCount,
            featurePassingTestCount:    featurePassingTestCount,
            featureFailingTestCount:    featureFailingTestCount,
            featureMissingTestCount:    featureMissingTestCount,
            featureTestStatus:          featureTestStatus
        };
    }

    getSummaryDataForDesignVersion(userContext){

        let dvFeatureCount = 0;
        let dvScenarioCount = 0;
        let dvExpectedTestCount = 0;
        let dvPassingTestCount = 0;
        let dvFailingTestCount = 0;
        let dvMissingTestCount = 0;

        // Get all feature summaries for DV
        const featureSummaries = UserDvTestSummaryData.getFeatureSummariesForDesignVersion(userContext.userId, userContext.designVersionId);

        featureSummaries.forEach((summary) => {

            dvFeatureCount++;

            dvScenarioCount += summary.featureScenarioCount;
            dvExpectedTestCount += summary.featureExpectedTestCount;
            dvPassingTestCount += summary.featurePassingTestCount;
            dvFailingTestCount += summary.featureFailingTestCount;
            dvMissingTestCount += summary.featureMissingTestCount;

        });

        // Return a data entry
        return{
            userId:                     userContext.userId,
            designVersionId:            userContext.designVersionId,
            dvFeatureCount:             dvFeatureCount,
            dvScenarioCount:            dvScenarioCount,
            dvExpectedTestCount:        dvExpectedTestCount,
            dvPassingTestCount:         dvPassingTestCount,
            dvFailingTestCount:         dvFailingTestCount,
            dvMissingTestCount:         dvMissingTestCount
        };
    }

    calculateScenarioSummaryData(userContext, featureScenario, contextDuData, contextWpData, globalData){

        let newGlobalData = globalData;

        //newGlobalData.totalScenarioCount++;
        newGlobalData.featureScenarioCount++;

        log((msg) => console.log(msg), LogLevel.TRACE, "Processing Summary Scenario: {} with unit pass count {}", featureScenario.scenarioName, featureScenario.unitPassCount);

        let hasAccResult = false;
        let hasIntResult = false;
        let hasUnitResult = false;

        let duHasAccResult = false;
        let duHasIntResult = false;
        let duHasUnitResult = false;

        let wpHasAccResult = false;
        let wpHasIntResult = false;
        let wpHasUnitResult = false;

        let scenarioPassingTests = 0;
        let scenarioFailingTests = 0;


        if(featureScenario.accMashTestStatus === MashTestStatus.MASH_FAIL){
            log((msg) => console.log(msg), LogLevel.TRACE, "  -- Acc Test fail {}", featureScenario.scenarioName);
            newGlobalData.featureFailingTests++;
            scenarioFailingTests++;
            hasAccResult = true;
        }
        if(featureScenario.intMashTestStatus === MashTestStatus.MASH_FAIL){
            log((msg) => console.log(msg), LogLevel.TRACE, "  -- Int Test fail {}", featureScenario.scenarioName);
            newGlobalData.featureFailingTests++;
            scenarioFailingTests++;
            hasIntResult = true;
        }

        if(featureScenario.unitFailCount > 0) {
            log((msg) => console.log(msg), LogLevel.TRACE, "  -- Unit Test fail {}", featureScenario.scenarioName);
            newGlobalData.featureFailingTests += featureScenario.unitFailCount;
            scenarioFailingTests += featureScenario.unitFailCount;
            hasUnitResult = true;
        }

        if(featureScenario.accMashTestStatus === MashTestStatus.MASH_PASS){
            log((msg) => console.log(msg), LogLevel.TRACE, "  -- Acc Test pass {}", featureScenario.scenarioName);
            newGlobalData.featurePassingTests++;
            scenarioPassingTests++;
            hasAccResult = true;
        }
        if(featureScenario.intMashTestStatus === MashTestStatus.MASH_PASS){
            log((msg) => console.log(msg), LogLevel.TRACE, "  -- Int Test pass {}", featureScenario.scenarioName);
            newGlobalData.featurePassingTests++;
            scenarioPassingTests++;
            hasIntResult = true;
        }

        if(featureScenario.unitPassCount > 0) {
            log((msg) => console.log(msg), LogLevel.TRACE, "  -- Unit Test pass {}", featureScenario.scenarioName);
            newGlobalData.featurePassingTests += featureScenario.unitPassCount;
            scenarioPassingTests += featureScenario.unitPassCount;
            hasUnitResult = true;
        }

        // Any fails is a fail even if passes.  Any passes and no fails is a pass
        if(scenarioFailingTests > 0){
            newGlobalData.totalFailingScenarioCount ++;
        } else {
            if(scenarioPassingTests > 0){
                newGlobalData.totalPassingScenarioCount++;
            }
        }

        // Get test expectations for Scenario
        const scenarioAccTestExpectations = ScenarioTestExpectationData.getScenarioTestExpectationsForScenarioTestType(userContext.designVersionId, featureScenario.designScenarioReferenceId, TestType.ACCEPTANCE);
        const scenarioIntTestExpectations = ScenarioTestExpectationData.getScenarioTestExpectationsForScenarioTestType(userContext.designVersionId, featureScenario.designScenarioReferenceId, TestType.INTEGRATION);
        const scenarioUnitTestExpectations = ScenarioTestExpectationData.getScenarioTestExpectationsForScenarioTestType(userContext.designVersionId, featureScenario.designScenarioReferenceId, TestType.UNIT);

        // Get expected test count for feature


        if(featureScenario.requiresAcceptanceTest){
            log((msg) => console.log(msg), LogLevel.TRACE, "  -- Requires Acceptance: {}", featureScenario.scenarioName);
            newGlobalData.featureExpectedTestCount++;
            if(featureScenario.accMashTestStatus === MashTestStatus.MASH_PASS){
                newGlobalData.featureFulfilledTestCount++;
            }
        }

        if(featureScenario.requiresIntegrationTest){
            log((msg) => console.log(msg), LogLevel.TRACE, "  -- Requires Integration: {}", featureScenario.scenarioName);
            newGlobalData.featureExpectedTestCount++;
            if(featureScenario.intMashTestStatus === MashTestStatus.MASH_PASS){
                newGlobalData.featureFulfilledTestCount++;
            }
        }

        if(featureScenario.requiresUnitTest){
            log((msg) => console.log(msg), LogLevel.TRACE, "  -- Requires Unit: {}", featureScenario.scenarioName);
            newGlobalData.featureExpectedTestCount++;
            if((featureScenario.unitPassCount) > 0 && (featureScenario.unitFailCount === 0)){
                newGlobalData.featureFulfilledTestCount++;
            }
        }

        // Any fails is a fail even if passes.  Any passes and no fails is a pass
        if (newGlobalData.featureFailingTests > 0) {
            newGlobalData.featureTestStatus = FeatureTestSummaryStatus.FEATURE_FAILING_TESTS;
        } else {
            if (newGlobalData.featurePassingTests > 0 && newGlobalData.featureExpectedTestCount > 0) {
                newGlobalData.featureTestStatus = FeatureTestSummaryStatus.FEATURE_PASSING_TESTS;
                newGlobalData.featureAllTestsFulfilled = (newGlobalData.featureExpectedTestCount === newGlobalData.featureFulfilledTestCount);
            } else {
                newGlobalData.featureTestStatus = FeatureTestSummaryStatus.FEATURE_NO_TESTS;
            }
        }

        // Mark as no test if a test is required
        if(
            (!hasAccResult && featureScenario.requiresAcceptanceTest) ||
            (!hasIntResult && featureScenario.requiresIntegrationTest) ||
            (!hasUnitResult && featureScenario.requiresUnitTest)
        ) {
            log((msg) => console.log(msg), LogLevel.TRACE, "  -- Scenario with no test {}", featureScenario.scenarioName);
            newGlobalData.featureNoTestScenarios++;
            //newGlobalData.totalScenariosWithoutTests++;
        }

        // Mark as no requirement if no requirements for scenario
        if(
            !(featureScenario.requiresAcceptanceTest || featureScenario.requiresIntegrationTest || featureScenario.requiresUnitTest)
        ){
            log((msg) => console.log(msg), LogLevel.TRACE, "  -- Scenario with no test requirements {}", featureScenario.scenarioName);
            newGlobalData.featureNoRequirementScenarios++;
        }

        let duComponent = null;
        let wpComponent = null;


        // Get stats for DU if this feature scenario in DU
        if(userContext.designUpdateId !== 'NONE') {

            duComponent = contextDuData.findOne({
                componentReferenceId: featureScenario.designScenarioReferenceId
            });

            if (duComponent && duComponent.scopeType === UpdateScopeType.SCOPE_IN_SCOPE) {

                log((msg) => console.log(msg), LogLevel.TRACE, "Adding DU scenario {}", duComponent.componentNameNew);

                newGlobalData.duFeatureScenarioCount++;

                if (featureScenario.accMashTestStatus === MashTestStatus.MASH_FAIL) {
                    newGlobalData.duFeatureFailingTests++;
                    duHasAccResult = true;
                }
                if (featureScenario.intMashTestStatus === MashTestStatus.MASH_FAIL) {
                    newGlobalData.duFeatureFailingTests++;
                    duHasIntResult = true;
                    log((msg) => console.log(msg), LogLevel.TRACE, "Failed INT test.  Count: {}", newGlobalData.duFeatureFailingTests);
                }

                if (featureScenario.unitFailCount > 0) {
                    log((msg) => console.log(msg), LogLevel.TRACE, "Failed UNIT tests {}", featureScenario.unitFailCount);
                    newGlobalData.duFeatureFailingTests += featureScenario.unitFailCount;
                    duHasUnitResult = true;
                }

                if (featureScenario.accMashTestStatus === MashTestStatus.MASH_PASS) {
                    newGlobalData.duFeaturePassingTests++;
                    duHasAccResult = true;
                }
                if (featureScenario.intMashTestStatus === MashTestStatus.MASH_PASS) {
                    newGlobalData.duFeaturePassingTests++;
                    duHasIntResult = true;
                }

                if (featureScenario.unitPassCount > 0) {
                    newGlobalData.duFeaturePassingTests += featureScenario.unitPassCount;
                    duHasUnitResult = true;
                }

                // Get expected test count for du feature
                if(featureScenario.requiresAcceptanceTest){
                    newGlobalData.duFeatureExpectedTestCount++;
                    if(featureScenario.accMashTestStatus === MashTestStatus.MASH_PASS){
                        newGlobalData.duFeatureFulfilledTestCount++;
                    }
                }

                if(featureScenario.requiresIntegrationTest){
                    newGlobalData.duFeatureExpectedTestCount++;
                    if(featureScenario.intMashTestStatus === MashTestStatus.MASH_PASS){
                        newGlobalData.duFeatureFulfilledTestCount++;
                    }
                }

                if(featureScenario.requiresUnitTest){
                    newGlobalData.duFeatureExpectedTestCount++;
                    if((featureScenario.unitPassCount) > 0 && (featureScenario.unitFailCount === 0)){
                        newGlobalData.duFeatureFulfilledTestCount++;
                    }
                }

                // Any fails is a fail even if passes.  Any passes and no fails is a pass
                if (newGlobalData.duFeatureFailingTests > 0) {
                    newGlobalData.duFeatureTestStatus = FeatureTestSummaryStatus.FEATURE_FAILING_TESTS;
                } else {
                    if (newGlobalData.duFeaturePassingTests > 0 && newGlobalData.duFeatureExpectedTestCount > 0) {
                        newGlobalData.duFeatureTestStatus = FeatureTestSummaryStatus.FEATURE_PASSING_TESTS;
                    }
                }


                // DU No tests where tests are expected
                if (
                    (!duHasAccResult && featureScenario.requiresAcceptanceTest) ||
                    (!duHasIntResult && featureScenario.requiresIntegrationTest) ||
                    (!duHasUnitResult && featureScenario.requiresUnitTest)
                ) {
                    newGlobalData.duFeatureNoTestScenarios++;
                }
            }
        }

        // Get stats for WP if this feature scenario in WP
        if(userContext.workPackageId !== 'NONE') {

            wpComponent = contextWpData.findOne({componentReferenceId: featureScenario.designScenarioReferenceId});

            let nonRemovedComponent = true;

            if(duComponent && duComponent.isRemoved){
                nonRemovedComponent = false;
            }

            if (wpComponent && wpComponent.scopeType === WorkPackageScopeType.SCOPE_ACTIVE && nonRemovedComponent) {

                newGlobalData.wpFeatureScenarioCount++;

                if (featureScenario.accMashTestStatus === MashTestStatus.MASH_FAIL) {
                    newGlobalData.wpFeatureFailingTests++;
                    wpHasAccResult = true;
                }
                if (featureScenario.intMashTestStatus === MashTestStatus.MASH_FAIL) {
                    newGlobalData.wpFeatureFailingTests++;
                    wpHasIntResult = true;
                }

                if (featureScenario.unitFailCount > 0) {
                    newGlobalData.wpFeatureFailingTests += featureScenario.unitFailCount;
                    wpHasUnitResult = true;
                }

                if (featureScenario.accMashTestStatus === MashTestStatus.MASH_PASS) {
                    newGlobalData.wpFeaturePassingTests++;
                    wpHasAccResult = true;
                }
                if (featureScenario.intMashTestStatus === MashTestStatus.MASH_PASS) {
                    newGlobalData.wpFeaturePassingTests++;
                    wpHasIntResult = true;
                }

                if (featureScenario.unitPassCount > 0) {
                    newGlobalData.wpFeaturePassingTests += featureScenario.unitPassCount;
                    wpHasUnitResult = true;
                }

                // Get expected test count for wp feature
                if(featureScenario.requiresAcceptanceTest){
                    newGlobalData.wpFeatureExpectedTestCount++;
                    if(featureScenario.accMashTestStatus === MashTestStatus.MASH_PASS){
                        newGlobalData.wpFeatureFulfilledTestCount++;
                    }
                }

                if(featureScenario.requiresIntegrationTest){
                    newGlobalData.wpFeatureExpectedTestCount++;
                    if(featureScenario.intMashTestStatus === MashTestStatus.MASH_PASS){
                        newGlobalData.wpFeatureFulfilledTestCount++;
                    }
                }

                if(featureScenario.requiresUnitTest){
                    newGlobalData.wpFeatureExpectedTestCount++;
                    if((featureScenario.unitPassCount) > 0 && (featureScenario.unitFailCount === 0)){
                        newGlobalData.wpFeatureFulfilledTestCount++;
                    }
                }

                // Any fails is a fail even if passes.  Any passes and no fails is a pass
                if (newGlobalData.wpFeatureFailingTests > 0) {
                    newGlobalData.wpFeatureTestStatus = FeatureTestSummaryStatus.FEATURE_FAILING_TESTS;

                } else {
                    if (newGlobalData.wpFeaturePassingTests > 0 && newGlobalData.wpFeatureExpectedTestCount > 0) {
                        newGlobalData.wpFeatureTestStatus = FeatureTestSummaryStatus.FEATURE_PASSING_TESTS;
                    }
                }

                // WP No tests where tests are expected
                if (
                    (!wpHasAccResult && featureScenario.requiresAcceptanceTest) ||
                    (!wpHasIntResult && featureScenario.requiresIntegrationTest) ||
                    (!wpHasUnitResult && featureScenario.requiresUnitTest)
                ) {
                    newGlobalData.wpFeatureNoTestScenarios++;
                }

                log((msg) => console.log(msg), LogLevel.TRACE, "WP Passing Tests =  {}", newGlobalData.wpFeaturePassingTests);
            }
        }

        return newGlobalData;
    }
}

export const TestSummaryModules = new TestSummaryModulesClass();