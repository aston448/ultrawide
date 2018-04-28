import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

import { TestFixtures } from './test_fixtures.js';

class TestResultVerificationsClass {

    // INTEGRATION -----------------------------------------------------------------------------------------------------
    // Check test result
    developerIntegrationTestResultForScenario_Is(scenarioName, result) {

        server.call('verifyTestResults.scenarioIntTestResultIs', scenarioName, result, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );

    };

    // Check for Mash Present
    // developerIntegrationTestsWindowContainsFeature(featureName){
    //
    //     server.call('verifyTestResults.testMashWindowContainsComponent', ComponentType.FEATURE, featureName, 'hugh',
    //         (function (error, result) {
    //             return (error === null);
    //         })
    //     );
    // }
    //
    // developerIntegrationTestsWindowContainsFeatureAspect(featureName, aspectName){
    //
    //     server.call('verifyTestResults.testMashWindowContainsFeatureAspect', featureName, aspectName, 'hugh',
    //         (function (error, result) {
    //             return (error === null);
    //         })
    //     );
    // }

    // developerIntegrationTestsWindowContainsScenario(scenarioName){
    //
    //     server.call('verifyTestResults.testMashWindowContainsComponent', ComponentType.SCENARIO, scenarioName, 'hugh',
    //         (function (error, result) {
    //             return (error === null);
    //         })
    //     );
    // }

    // // Check for Mash Not Present
    // developerIntegrationTestsWindowDoesNotContainFeature(featureName){
    //
    //     server.call('verifyTestResults.testMashWindowDoesNotContainComponent', ComponentType.FEATURE, featureName, 'hugh',
    //         (function (error, result) {
    //             return (error === null);
    //         })
    //     );
    // }
    //
    // developerIntegrationTestsWindowDoesNotContainFeatureAspect(featureName, aspectName){
    //
    //     server.call('verifyTestResults.testMashWindowDoesNotContainFeatureAspect', featureName, aspectName, 'hugh',
    //         (function (error, result) {
    //             return (error === null);
    //         })
    //     );
    // }
    //
    // developerIntegrationTestsWindowDoesNotContainScenario(scenarioName){
    //
    //     server.call('verifyTestResults.testMashWindowDoesNotContainComponent', ComponentType.SCENARIO, scenarioName, 'hugh',
    //         (function (error, result) {
    //             return (error === null);
    //         })
    //     );
    // }

    // UNIT ------------------------------------------------------------------------------------------------------------
    // Check scenario result
    developerUnitTestResultForScenario_Is(scenarioName, result) {

        server.call('verifyTestResults.scenarioUnitTestResultIs', scenarioName, result, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    // Check unit test result
    developerUnitTestResultForScenario_UnitTest_Is(scenarioName, unitTestName, result) {

        server.call('verifyTestResults.unitTestResultIs', scenarioName, unitTestName, result, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    // Check for Mash Present
    // developerUnitTestsWindowContainsFeature(featureName){
    //
    //     server.call('verifyTestResults.testMashWindowContainsComponent', ComponentType.FEATURE, featureName, 'hugh',
    //         (function (error, result) {
    //             return (error === null);
    //         })
    //     );
    // }
    //
    // developerUnitTestsWindowContainsFeatureAspect(featureName, aspectName){
    //
    //     server.call('verifyTestResults.testMashWindowContainsFeatureAspect', featureName, aspectName, 'hugh',
    //         (function (error, result) {
    //             return (error === null);
    //         })
    //     );
    // }
    //
    // developerUnitTestsWindowContainsScenario(scenarioName){
    //
    //     server.call('verifyTestResults.testMashWindowContainsComponent', ComponentType.SCENARIO, scenarioName, 'hugh',
    //         (function (error, result) {
    //             return (error === null);
    //         })
    //     );
    // }

    developerUnitTestsWindowContainsUnitTest(scenarioName, unitTestName){

        server.call('verifyTestResults.testMashWindowContainsUnitTest', scenarioName, unitTestName, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    }

    // Check for Mash Not Present
    // developerUnitTestsWindowDoesNotContainFeature(featureName){
    //
    //     server.call('verifyTestResults.testMashWindowDoesNotContainComponent', ComponentType.FEATURE, featureName, 'hugh',
    //         (function (error, result) {
    //             return (error === null);
    //         })
    //     );
    // }
    //
    // developerUnitTestsWindowDoesNotContainFeatureAspect(featureName, aspectName){
    //
    //     server.call('verifyTestResults.testMashWindowDoesNotContainFeatureAspect', featureName, aspectName, 'hugh',
    //         (function (error, result) {
    //             return (error === null);
    //         })
    //     );
    // }
    //
    // developerUnitTestsWindowDoesNotContainScenario(scenarioName){
    //
    //     server.call('verifyTestResults.testMashWindowDoesNotContainComponent', ComponentType.SCENARIO, scenarioName, 'hugh',
    //         (function (error, result) {
    //             return (error === null);
    //         })
    //     );
    // }

    developerUnitTestsWindowDoesNotContainUnitTest(scenarioName, unitTestName){

        server.call('verifyTestResults.testMashWindowDoesNotContainUnitTest', scenarioName, unitTestName, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    }


}

export const TestResultVerifications = new TestResultVerificationsClass();