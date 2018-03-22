
// Ultrawide services
import { MashTestStatus, FeatureTestSummaryStatus, UpdateScopeType, WorkPackageScopeType, LogLevel }   from '../../constants/constants.js';
import {log}        from '../../common/utils.js'


class TestSummaryModules{

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
                    log((msg) => console.log(msg), LogLevel.TRACE, "Failed INT test.  Count: {}", duFailingTests);
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

                log((msg) => console.log(msg), LogLevel.TRACE, "WP Passing Tests =  {}", newGlobalData.wpPassingTests);
            }
        }

        return newGlobalData;
    }
}

export default new TestSummaryModules();