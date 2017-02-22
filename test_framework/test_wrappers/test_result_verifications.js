import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

import TestFixtures from './test_fixtures.js';

class TestResultVerifications {

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
    developerIntegrationTestsWindowContainsFeature(featureName){

        server.call('verifyTestResults.testMashWindowContainsComponent', ComponentType.FEATURE, featureName, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    }

    developerIntegrationTestsWindowContainsFeatureAspect(featureName, aspectName){

        server.call('verifyTestResults.testMashWindowContainsFeatureAspect', featureName, aspectName, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    }

    developerIntegrationTestsWindowContainsScenario(scenarioName){

        server.call('verifyTestResults.testMashWindowContainsComponent', ComponentType.SCENARIO, scenarioName, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    }

    // Check for Mash Not Present
    developerIntegrationTestsWindowDoesNotContainFeature(featureName){

        server.call('verifyTestResults.testMashWindowDoesNotContainComponent', ComponentType.FEATURE, featureName, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    }

    developerIntegrationTestsWindowDoesNotContainFeatureAspect(featureName, aspectName){

        server.call('verifyTestResults.testMashWindowDoesNotContainFeatureAspect', featureName, aspectName, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    }

    developerIntegrationTestsWindowDoesNotContainScenario(scenarioName){

        server.call('verifyTestResults.testMashWindowDoesNotContainComponent', ComponentType.SCENARIO, scenarioName, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    }

    // UNIT ------------------------------------------------------------------------------------------------------------
    // Check test result
    developerUnitTestResultForScenario_Is(scenarioName, result) {

        server.call('verifyTestResults.scenarioUnitTestResultIs', scenarioName, result, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );

    };
}

export default new TestResultVerifications();