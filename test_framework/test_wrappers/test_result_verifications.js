import {TestType} from '../../imports/constants/constants.js'

class TestResultVerificationsClass {

    // SCENARIO
    designerScenarioOverallTestResultIs(scenarioName, expectedResult){

        server.call('verifyGuiInputs.scenarioOverallTestResultIs', 'gloria', scenarioName, expectedResult,
            (function (error, result) {
                return (error === null);
            })
        );
    }


    // USER GUI DATA
    designerTestExpectationResultDataIs(scenarioName, expectedUnitResult, expectedIntResult, expectedAccResult){

        server.call('verifyGuiInputs.scenarioTestResultsInputsInclude', 'gloria', scenarioName, TestType.UNIT, scenarioName, expectedUnitResult,
            (function (error, result) {
                return (error === null);
            })
        );

        server.call('verifyGuiInputs.scenarioTestResultsInputsInclude', 'gloria', scenarioName, TestType.INTEGRATION, scenarioName, expectedIntResult,
            (function (error, result) {
                return (error === null);
            })
        );

        server.call('verifyGuiInputs.scenarioTestResultsInputsInclude', 'gloria', scenarioName, TestType.ACCEPTANCE, scenarioName, expectedAccResult,
            (function (error, result) {
                return (error === null);
            })
        );
    };

    developerTestExpectationResultDataIs(scenarioName, expectedUnitResult, expectedIntResult, expectedAccResult){

        server.call('verifyGuiInputs.scenarioTestResultsInputsInclude', 'hugh', scenarioName, TestType.UNIT, scenarioName, expectedUnitResult,
            (function (error, result) {
                return (error === null);
            })
        );

        server.call('verifyGuiInputs.scenarioTestResultsInputsInclude', 'hugh', scenarioName, TestType.INTEGRATION, scenarioName, expectedIntResult,
            (function (error, result) {
                return (error === null);
            })
        );

        server.call('verifyGuiInputs.scenarioTestResultsInputsInclude', 'hugh', scenarioName, TestType.ACCEPTANCE, scenarioName, expectedAccResult,
            (function (error, result) {
                return (error === null);
            })
        );
    };

    managerTestExpectationResultDataIs(scenarioName, expectedUnitResult, expectedIntResult, expectedAccResult){

        server.call('verifyGuiInputs.scenarioTestResultsInputsInclude', 'miles', scenarioName, TestType.UNIT, scenarioName, expectedUnitResult,
            (function (error, result) {
                return (error === null);
            })
        );

        server.call('verifyGuiInputs.scenarioTestResultsInputsInclude', 'miles', scenarioName, TestType.INTEGRATION, scenarioName, expectedIntResult,
            (function (error, result) {
                return (error === null);
            })
        );

        server.call('verifyGuiInputs.scenarioTestResultsInputsInclude', 'miles', scenarioName, TestType.ACCEPTANCE, scenarioName, expectedAccResult,
            (function (error, result) {
                return (error === null);
            })
        );
    };

    // UNIT ------------------------------------------------------------------------------------------------------------
    // Check test result
    designerUnitTestExpectationResultForScenarioIs(scenarioName, expectedResult) {

        server.call('verifyTestResults.scenarioTestExpectationResultIs', scenarioName, 'NONE', 'NONE', TestType.UNIT, expectedResult, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    developerUnitTestExpectationResultForScenarioIs(scenarioName, expectedResult) {

        server.call('verifyTestResults.scenarioTestExpectationResultIs', scenarioName, 'NONE', 'NONE', TestType.UNIT, expectedResult, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    designerUnitTestExpectationResultForScenarioPermutationIs(scenarioName, designPermutationName, designPermutationValue, expectedResult) {

        server.call('verifyTestResults.scenarioTestExpectationResultIs', scenarioName, designPermutationName, designPermutationValue, TestType.UNIT, expectedResult, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    developerUnitTestExpectationResultForScenarioPermutationIs(scenarioName, designPermutationName, designPermutationValue, expectedResult) {

        server.call('verifyTestResults.scenarioTestExpectationResultIs', scenarioName, designPermutationName, designPermutationValue, TestType.UNIT, expectedResult, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    // INTEGRATION -----------------------------------------------------------------------------------------------------
    // Check test result
    designerIntegrationTestExpectationResultForScenarioIs(scenarioName, expectedResult) {

        server.call('verifyTestResults.scenarioTestExpectationResultIs', scenarioName, 'NONE', 'NONE', TestType.INTEGRATION, expectedResult, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    developerIntegrationTestExpectationResultForScenarioIs(scenarioName, expectedResult) {

        server.call('verifyTestResults.scenarioTestExpectationResultIs', scenarioName, 'NONE', 'NONE', TestType.INTEGRATION, expectedResult, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    designerIntegrationTestExpectationResultForScenarioPermutationIs(scenarioName, designPermutationName, designPermutationValue, expectedResult) {

        server.call('verifyTestResults.scenarioTestExpectationResultIs', scenarioName, designPermutationName, designPermutationValue, TestType.INTEGRATION, expectedResult, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    developerIntegrationTestExpectationResultForScenarioPermutationIs(scenarioName, designPermutationName, designPermutationValue, expectedResult) {

        server.call('verifyTestResults.scenarioTestExpectationResultIs', scenarioName, designPermutationName, designPermutationValue, TestType.INTEGRATION, expectedResult, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    // ACCEPTANCE ------------------------------------------------------------------------------------------------------
    // Check test result
    designerAcceptanceTestExpectationResultForScenarioIs(scenarioName, expectedResult) {

        server.call('verifyTestResults.scenarioTestExpectationResultIs', scenarioName, 'NONE', 'NONE', TestType.ACCEPTANCE, expectedResult, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    developerAcceptanceTestExpectationResultForScenarioIs(scenarioName, expectedResult) {

        server.call('verifyTestResults.scenarioTestExpectationResultIs', scenarioName, 'NONE', 'NONE', TestType.ACCEPTANCE, expectedResult, 'hugh',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    designerAcceptanceTestExpectationResultForScenarioPermutationIs(scenarioName, designPermutationName, designPermutationValue, expectedResult) {

        server.call('verifyTestResults.scenarioTestExpectationResultIs', scenarioName, designPermutationName, designPermutationValue, TestType.ACCEPTANCE, expectedResult, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    developerAcceptanceTestExpectationResultForScenarioPermutationIs(scenarioName, designPermutationName, designPermutationValue, expectedResult) {

        server.call('verifyTestResults.scenarioTestExpectationResultIs', scenarioName, designPermutationName, designPermutationValue, TestType.ACCEPTANCE, expectedResult, 'hugh',
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