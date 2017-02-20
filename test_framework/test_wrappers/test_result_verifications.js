import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

import TestFixtures from './test_fixtures.js';

class TestResultVerifications {

    developerIntegrationTestResultForScenario_Is(scenarioName, result) {

        server.call('verifyTestResults.scenarioIntTestResultIs', scenarioName, result, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );

    };

}

export default new TestResultVerifications();