
class TestSummaryVerificationsClass {

    // Feature Summary -------------------------------------------------------------------------------------------------

    designerTestSummaryFeatureStatusIs(featureParent, featureName, testStatus) {

        server.call('verifyTestSummary.featureTestStatusIs', featureParent, featureName, testStatus, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    developerTestSummaryFeatureStatusIs(featureParent, featureName, testStatus) {

        server.call('verifyTestSummary.featureTestStatusIs', featureParent, featureName, testStatus, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    managerTestSummaryFeatureStatusIs(featureParent, featureName, testStatus) {

        server.call('verifyTestSummary.featureTestStatusIs', featureParent, featureName, testStatus, 'miles',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    designerTestSummaryFeaturePassCountIs(featureParent, featureName, testCount) {

        server.call('verifyTestSummary.featurePassingTestsCountIs', featureParent, featureName, testCount, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    developerTestSummaryFeaturePassCountIs(featureParent, featureName, testCount) {

        server.call('verifyTestSummary.featurePassingTestsCountIs', featureParent, featureName, testCount, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    managerTestSummaryFeaturePassCountIs(featureParent, featureName, testCount) {

        server.call('verifyTestSummary.featurePassingTestsCountIs', featureParent, featureName, testCount, 'miles',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    designerTestSummaryFeatureFailCountIs(featureParent, featureName, testCount) {

        server.call('verifyTestSummary.featureFailingTestsCountIs', featureParent, featureName, testCount, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    developerTestSummaryFeatureFailCountIs(featureParent, featureName, testCount) {

        server.call('verifyTestSummary.featureFailingTestsCountIs', featureParent, featureName, testCount, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    managerTestSummaryFeatureFailCountIs(featureParent, featureName, testCount) {

        server.call('verifyTestSummary.featureFailingTestsCountIs', featureParent, featureName, testCount, 'miles',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    designerTestSummaryFeatureNoTestCountIs(featureParent, featureName, testCount) {

        server.call('verifyTestSummary.featureUntestedCountIs', featureParent, featureName, testCount, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    developerTestSummaryFeatureNoTestCountIs(featureParent, featureName, testCount) {

        server.call('verifyTestSummary.featureUntestedCountIs', featureParent, featureName, testCount, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    managerTestSummaryFeatureNoTestCountIs(featureParent, featureName, testCount) {

        server.call('verifyTestSummary.featureUntestedCountIs', featureParent, featureName, testCount, 'miles',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    // Scenario Summary ------------------------------------------------------------------------------------------------

    designerTestSummaryScenarioStatusIs(scenarioParent, scenarioName, testStatus){

        server.call('verifyTestSummary.scenarioTestStatusIs', scenarioParent, scenarioName, testStatus, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    }

    developerTestSummaryScenarioStatusIs(scenarioParent, scenarioName, testStatus){

        server.call('verifyTestSummary.scenarioTestStatusIs', scenarioParent, scenarioName, testStatus, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    }

    managerTestSummaryScenarioStatusIs(scenarioParent, scenarioName, testStatus){

        server.call('verifyTestSummary.scenarioTestStatusIs', scenarioParent, scenarioName, testStatus, 'miles',
            (function (error, result) {
                return (error === null);
            })
        );
    }

    designerTestSummaryScenarioIntTestStatusIs(scenarioParent, scenarioName, testStatus){

        server.call('verifyTestSummary.scenarioIntTestResultIs', scenarioParent, scenarioName, testStatus, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    }

    developerTestSummaryScenarioIntTestStatusIs(scenarioParent, scenarioName, testStatus){

        server.call('verifyTestSummary.scenarioIntTestResultIs', scenarioParent, scenarioName, testStatus, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    }

    managerTestSummaryScenarioIntTestStatusIs(scenarioParent, scenarioName, testStatus){

        server.call('verifyTestSummary.scenarioIntTestResultIs', scenarioParent, scenarioName, testStatus, 'miles',
            (function (error, result) {
                return (error === null);
            })
        );
    }

    designerTestSummaryScenarioUnitTestPassCountIs(scenarioParent, scenarioName, testCount){

        server.call('verifyTestSummary.scenarioUnitTestPassCountIs', scenarioParent, scenarioName, testCount, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    }

    developerTestSummaryScenarioUnitTestPassCountIs(scenarioParent, scenarioName, testCount){

        server.call('verifyTestSummary.scenarioUnitTestPassCountIs', scenarioParent, scenarioName, testCount, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    }

    managerTestSummaryScenarioUnitTestPassCountIs(scenarioParent, scenarioName, testCount){

        server.call('verifyTestSummary.scenarioUnitTestPassCountIs', scenarioParent, scenarioName, testCount, 'miles',
            (function (error, result) {
                return (error === null);
            })
        );
    }

    designerTestSummaryScenarioUnitTestFailCountIs(scenarioParent, scenarioName, testCount){

        server.call('verifyTestSummary.scenarioUnitTestFailCountIs', scenarioParent, scenarioName, testCount, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    }

    developerTestSummaryScenarioUnitTestFailCountIs(scenarioParent, scenarioName, testCount){

        server.call('verifyTestSummary.scenarioUnitTestFailCountIs', scenarioParent, scenarioName, testCount, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    }

    managerTestSummaryScenarioUnitTestFailCountIs(scenarioParent, scenarioName, testCount){

        server.call('verifyTestSummary.scenarioUnitTestFailCountIs', scenarioParent, scenarioName, testCount, 'miles',
            (function (error, result) {
                return (error === null);
            })
        );
    }
}

export const TestSummaryVerifications = new TestSummaryVerificationsClass();