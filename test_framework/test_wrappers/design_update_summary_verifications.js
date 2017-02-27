import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

class DesignUpdateSummaryVerifications {

    // Additions
    feature_IsInCurrentDesignUpdateSummaryAdditionsForDesigner(featureName) {
        server.call('verifyDesignUpdateSummary.additionsListContains', ComponentType.FEATURE, featureName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    scenario_IsInCurrentDesignUpdateSummaryAdditionsForDesigner(scenarioName) {
        server.call('verifyDesignUpdateSummary.additionsListContains', ComponentType.SCENARIO, scenarioName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    feature_IsNotInCurrentDesignUpdateSummaryAdditionsForDesigner(featureName) {
        server.call('verifyDesignUpdateSummary.additionsListDoesNotContain', ComponentType.FEATURE, featureName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    scenario_IsNotInCurrentDesignUpdateSummaryAdditionsForDesigner(scenarioName) {
        server.call('verifyDesignUpdateSummary.additionsListDoesNotContain', ComponentType.SCENARIO, scenarioName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    // Removals
    feature_IsInCurrentDesignUpdateSummaryRemovalsForDesigner(featureName) {
        server.call('verifyDesignUpdateSummary.removalsListContains', ComponentType.FEATURE, featureName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    scenario_IsInCurrentDesignUpdateSummaryRemovalsForDesigner(scenarioName) {
        server.call('verifyDesignUpdateSummary.removalsListContains', ComponentType.SCENARIO, scenarioName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    feature_IsNotInCurrentDesignUpdateSummaryRemovalsForDesigner(featureName) {
        server.call('verifyDesignUpdateSummary.removalsListDoesNotContain', ComponentType.FEATURE, featureName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    scenario_IsNotInCurrentDesignUpdateSummaryRemovalsForDesigner(scenarioName) {
        server.call('verifyDesignUpdateSummary.removalsListDoesNotContain', ComponentType.SCENARIO, scenarioName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    // Changes
    feature_ChangedTo_IsInCurrentDesignUpdateSummaryChangesForDesigner(featureName, featureNewName) {
        server.call('verifyDesignUpdateSummary.changesListContains', ComponentType.FEATURE, featureName, featureNewName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    scenario_ChangedTo_IsInCurrentDesignUpdateSummaryChangesForDesigner(scenarioName, scenarioNewName) {
        server.call('verifyDesignUpdateSummary.changesListContains', ComponentType.SCENARIO, scenarioName, scenarioNewName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    feature_ChangedTo_IsNotInCurrentDesignUpdateSummaryChangesForDesigner(featureName, featureNewName) {
        server.call('verifyDesignUpdateSummary.changesListDoesNotContain', ComponentType.FEATURE, featureName, featureNewName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    scenario_ChangedTo_IsNotInCurrentDesignUpdateSummaryChangesForDesigner(scenarioName, scenarioNewName) {
        server.call('verifyDesignUpdateSummary.changesListDoesNotContain', ComponentType.SCENARIO, scenarioName, scenarioNewName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };


}

export default new DesignUpdateSummaryVerifications();