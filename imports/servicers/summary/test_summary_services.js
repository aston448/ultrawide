
// Ultrawide services
import { MashTestStatus, FeatureTestSummaryStatus, UpdateScopeType, WorkPackageScopeType, LogLevel }   from '../../constants/constants.js';
import {log}        from '../../common/utils.js'

import TestSummaryModules               from '../../service_modules/dev/test_summary_service_modules.js';

// Data Access
import DesignVersionData                from '../../data/design/design_version_db.js';
import DesignComponentData              from '../../data/design/design_component_db.js';
import DesugnUpdateComponentData        from '../../data/design_update/design_update_component_db.js';
import UserDevTestSummaryData           from '../../data/summary/user_dev_test_summary_db.js';
import UserDevDesignSummaryData         from '../../data/summary/user_dev_design_summary_db.js';
import DesignUpdateComponentData        from '../../data/design_update/design_update_component_db.js';
import WorkPackageComponentData         from '../../data/work/work_package_component_db.js';
import UserDvMashScenarioData           from '../../data/mash/user_dv_mash_scenario_db.js'
import {updateDefaultAspectIncluded} from "../../apiValidatedMethods/design_methods";

//======================================================================================================================
//
// Server Code for Test Summary Processing.
//
// Methods called directly by Server API
//
//======================================================================================================================

class TestSummaryServices {

    refreshTestSummaryForFeature(userContext){

        let designFeature = {};

        log((msg) => console.log(msg), LogLevel.DEBUG, "Refresh test summary for feature: DV:{} DU: {} Feature: {}", userContext.designVersionId, userContext.designUpdateId, userContext.featureReferenceId);


        if(userContext.designUpdateId !== 'NONE'){
            designFeature = DesugnUpdateComponentData.getUpdateComponentByRef(userContext.designVersionId, userContext.designUpdateId, userContext.featureReferenceId);
        } else {
            designFeature = DesignComponentData.getDesignComponentByRef(userContext.designVersionId, userContext.featureReferenceId);
        }

        const featureScenarios = UserDvMashScenarioData.getFeatureScenarios(userContext.userId, designFeature.designVersionId, designFeature.componentReferenceId);

        let featureGlobalData = {
            featureTestStatus: FeatureTestSummaryStatus.FEATURE_NO_TESTS,
            featurePassingTests: 0,
            featureFailingTests: 0,
            featureScenarioCount: 0,
            featureExpectedTestCount: 0,
            featureFulfilledTestCount: 0,
            featureNoTestScenarios: 0,
            featureAllTestsFulfilled: false,
            duFeatureTestStatus: FeatureTestSummaryStatus.FEATURE_NO_TESTS,
            duFeaturePassingTests: 0,
            duFeatureFailingTests: 0,
            duFeatureScenarioCount: 0,
            duFeatureExpectedTestCount: 0,
            duFeatureFulfilledTestCount: 0,
            duFeatureNoTestScenarios: 0,
            wpFeatureTestStatus: FeatureTestSummaryStatus.FEATURE_NO_TESTS,
            wpFeaturePassingTests: 0,
            wpFeatureFailingTests: 0,
            wpFeatureScenarioCount: 0,
            wpFeatureExpectedTestCount: 0,
            wpFeatureFulfilledTestCount: 0,
            wpFeatureNoTestScenarios: 0,
            totalFailingScenarioCount: 0,
            totalPassingScenarioCount: 0,
        };

        // Get a local copy of the in context DU / WP components if relevant so we can search from just those
        let contextDuData = new Mongo.Collection(null);
        let contextWpData = new Mongo.Collection(null);

        if(userContext.designUpdateId !== 'NONE'){

            const currentContextDuComponents = DesignUpdateComponentData.getCurrentContextComponents(userContext.designVersionId, userContext.designUpdateId);

            if(currentContextDuComponents.length > 0) {
                contextDuData.batchInsert(currentContextDuComponents);
            }
        }

        if(userContext.workPackageId !== 'NONE'){

            const currentContextWpComponents = WorkPackageComponentData.getCurrentWpComponents(userContext.workPackageId);

            if(currentContextWpComponents.length > 0) {
                contextWpData.batchInsert(currentContextWpComponents);
            }
        }

        featureScenarios.forEach((scenario) => {

            featureGlobalData = TestSummaryModules.calculateScenarioSummaryData(userContext, scenario, contextDuData, contextWpData, featureGlobalData);
        });

        // Now update the relevant test summary data for the feature.
        log((msg) => console.log(msg), LogLevel.DEBUG, "Updating feature test summary for feature {} with expected tests {}", designFeature.componentReferenceId, featureGlobalData.featureExpectedTestCount);
        UserDevTestSummaryData.updateFeatureTestSummary(userContext.userId, designFeature.designVersionId, designFeature.componentReferenceId, featureGlobalData);
        log((msg) => console.log(msg), LogLevel.DEBUG, "Updating complete");

    }

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


        // Get a local copy of just the mash data relevant to this user and the current DV.
        // This optimises processing when there are lots of users / design versions.
        let myMashScenarioData = new Mongo.Collection(null);

        const userMashScenarios = UserDvMashScenarioData.getUserDesignVersionData(userContext);

        if(userMashScenarios.length > 0) {
            myMashScenarioData.batchInsert(userMashScenarios);
        } else {
            // No data yet so no work to do
            return;
        }

        // Get a local copy of the in context DU / WP components if relevant so we can search from just those
        let contextDuData = new Mongo.Collection(null);
        let contextWpData = new Mongo.Collection(null);

        if(userContext.designUpdateId !== 'NONE'){

            const currentContextDuComponents = DesignUpdateComponentData.getCurrentContextComponents(userContext.designVersionId, userContext.designUpdateId);

            if(currentContextDuComponents.length > 0) {
                contextDuData.batchInsert(currentContextDuComponents);
            }
        }

        if(userContext.workPackageId !== 'NONE'){

            const currentContextWpComponents = WorkPackageComponentData.getCurrentWpComponents(userContext.workPackageId);

            if(currentContextWpComponents.length > 0) {
                contextWpData.batchInsert(currentContextWpComponents);
            }
        }

        const totalFeatureCount = designFeatures.length;

        let batchData = [];

        designFeatures.forEach((designFeature) =>{

            log((msg) => console.log(msg), LogLevel.TRACE, "FEATURE {}", designFeature.componentNameNew);

            let featureScenarios = myMashScenarioData.find({designFeatureReferenceId:   designFeature.componentReferenceId}).fetch();

            let featureGlobalData = {
                featureTestStatus: FeatureTestSummaryStatus.FEATURE_NO_TESTS,
                featurePassingTests: 0,
                featureFailingTests: 0,
                featureScenarioCount: 0,
                featureExpectedTestCount: 0,
                featureFulfilledTestCount: 0,
                featureNoTestScenarios: 0,
                featureAllTestsFulfilled: false,
                duFeatureTestStatus: FeatureTestSummaryStatus.FEATURE_NO_TESTS,
                duFeaturePassingTests: 0,
                duFeatureFailingTests: 0,
                duFeatureScenarioCount: 0,
                duFeatureExpectedTestCount: 0,
                duFeatureFulfilledTestCount: 0,
                duFeatureNoTestScenarios: 0,
                wpFeatureTestStatus: FeatureTestSummaryStatus.FEATURE_NO_TESTS,
                wpFeaturePassingTests: 0,
                wpFeatureFailingTests: 0,
                wpFeatureScenarioCount: 0,
                wpFeatureExpectedTestCount: 0,
                wpFeatureFulfilledTestCount: 0,
                wpFeatureNoTestScenarios: 0,
                totalFailingScenarioCount: totalFailingScenarioCount,
                totalPassingScenarioCount: totalPassingScenarioCount,
            };

            totalFailingScenarioCount = featureGlobalData.totalFailingScenarioCount;
            totalPassingScenarioCount = featureGlobalData.totalPassingScenarioCount;

            featureScenarios.forEach((featureScenario)=>{

                featureGlobalData = TestSummaryModules.calculateScenarioSummaryData(userContext, featureScenario, contextDuData, contextWpData, featureGlobalData);

            });

            // // Any fails at feature level is a fail even if passes.  Any passes and no fails is a pass
            // if(featureGlobalData.featureFailingTests > 0){
            //     featureGlobalData.featureTestStatus = FeatureTestSummaryStatus.FEATURE_FAILING_TESTS;
            // } else {
            //     if(featureGlobalData.featurePassingTests > 0){
            //         featureGlobalData.featureTestStatus = FeatureTestSummaryStatus.FEATURE_PASSING_TESTS;
            //     }
            // }

            log((msg) => console.log(msg), LogLevel.TRACE, "Adding Feature {} {} with Pass {} Fail {}, Untested {}", designFeature.componentNameNew, designFeature.componentReferenceId, featureGlobalData.featurePassingTests, featureGlobalData.featureFailingTests, featureGlobalData.featureNoTestScenarios);

            batchData.push({
                userId: userContext.userId,
                designVersionId: userContext.designVersionId,
                scenarioReferenceId: 'NONE',
                featureReferenceId: designFeature.componentReferenceId,
                accTestStatus: MashTestStatus.MASH_NOT_LINKED,
                intTestStatus: MashTestStatus.MASH_NOT_LINKED,
                unitTestPassCount: 0,
                unitTestFailCount: 0,
                featureScenarioCount: featureGlobalData.featureScenarioCount,
                featureExpectedTestCount: featureGlobalData.featureExpectedTestCount,
                featureFulfilledTestCount: featureGlobalData.featureFulfilledTestCount,
                featureSummaryStatus: featureGlobalData.featureTestStatus,
                featureTestPassCount: featureGlobalData.featurePassingTests,
                featureTestFailCount: featureGlobalData.featureFailingTests,
                featureNoTestCount: featureGlobalData.featureNoTestScenarios,
                featureAllTestsFulfilled: featureGlobalData.featureAllTestsFulfilled,
                duFeatureScenarioCount: featureGlobalData.duFeatureScenarioCount,
                duFeatureExpectedTestCount: featureGlobalData.duFeatureExpectedTestCount,
                duFeatureFulfilledTestCount: featureGlobalData.duFeatureFulfilledTestCount,
                duFeatureSummaryStatus: featureGlobalData.duFeatureTestStatus,
                duFeatureTestPassCount: featureGlobalData.duFeaturePassingTests,
                duFeatureTestFailCount: featureGlobalData.duFeatureFailingTests,
                duFeatureNoTestCount: featureGlobalData.duFeatureNoTestScenarios,
                wpFeatureSummaryStatus: featureGlobalData.wpFeatureTestStatus,
                wpFeatureTestPassCount: featureGlobalData.wpFeaturePassingTests,
                wpFeatureTestFailCount: featureGlobalData.wpFeatureFailingTests,
                wpFeatureScenarioCount: featureGlobalData.wpFeatureScenarioCount,
                wpFeatureExpectedTestCount: featureGlobalData.wpFeatureExpectedTestCount,
                wpFeatureFulfilledTestCount: featureGlobalData.wpFeatureFulfilledTestCount,
                wpFeatureNoTestCount: featureGlobalData.wpFeatureNoTestScenarios,
            });

        });

        // Bulk insert new feature summary data
        if(batchData.length > 0) {
            UserDevTestSummaryData.bulkInsertData(batchData);
        }

        UserDevDesignSummaryData.insertNewDesignSummary(
            userContext.userId,
            userContext.designVersionId,
            userContext.designUpdateId,
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
