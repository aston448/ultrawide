import {TestType} from "../../imports/constants/constants";


class TestExpectationVerificationsClass {

    // Verify Scenario expectation
    designerScenarioAcceptanceTestForScenario_Exists(scenarioName) {

        server.call('verifyTestExpectations.testTypeScenarioExpectationExistsFor', scenarioName, TestType.ACCEPTANCE, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    designerScenarioIntegrationTestForScenario_Exists(scenarioName) {

        server.call('verifyTestExpectations.testTypeScenarioExpectationExistsFor', scenarioName, TestType.INTEGRATION, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    designerScenarioUnitTestForScenario_Exists(scenarioName) {

        server.call('verifyTestExpectations.testTypeScenarioExpectationExistsFor', scenarioName, TestType.UNIT, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    // Verify Scenario Expectation Deleted
    designerScenarioAcceptanceTestForScenario_DoesNotExist(scenarioName) {

        server.call('verifyTestExpectations.testTypeScenarioExpectationDoesNotExistFor', scenarioName, TestType.ACCEPTANCE, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    designerScenarioIntegrationTestForScenario_DoesNotExist(scenarioName) {

        server.call('verifyTestExpectations.testTypeScenarioExpectationDoesNotExistFor', scenarioName, TestType.INTEGRATION, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    designerScenarioUnitTestForScenario_DoesNotExist(scenarioName) {

        server.call('verifyTestExpectations.testTypeScenarioExpectationDoesNotExistFor', scenarioName, TestType.UNIT, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    // Verify Permutation Value Expectation
    designerAcceptanceTestForScenario_Permutation_Value_Exists(scenarioName, permutationName, permutationValueName) {

        server.call('verifyTestExpectations.testTypePermValueExpectationExistsFor', scenarioName, TestType.ACCEPTANCE, permutationName, permutationValueName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    designerIntegrationTestForScenario_Permutation_Value_Exists(scenarioName, permutationName, permutationValueName) {

        server.call('verifyTestExpectations.testTypePermValueExpectationExistsFor', scenarioName, TestType.INTEGRATION, permutationName, permutationValueName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };


    designerUnitTestForScenario_Permutation_Value_Exists(scenarioName, permutationName, permutationValueName) {

        server.call('verifyTestExpectations.testTypePermValueExpectationExistsFor', scenarioName, TestType.UNIT, permutationName, permutationValueName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    // Verify Permutation Value Expectation Deleted
    designerAcceptanceTestForScenario_Permutation_Value_DoesNotExist(scenarioName, permutationName, permutationValueName) {

        server.call('verifyTestExpectations.testTypePermValueExpectationDoesNotExistFor', scenarioName, TestType.ACCEPTANCE, permutationName, permutationValueName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    designerIntegrationTestForScenario_Permutation_Value_DoesNotExist(scenarioName, permutationName, permutationValueName) {

        server.call('verifyTestExpectations.testTypePermValueExpectationDoesNotExistFor', scenarioName, TestType.INTEGRATION, permutationName, permutationValueName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };


    designerUnitTestForScenario_Permutation_Value_DoesNotExist(scenarioName, permutationName, permutationValueName) {

        server.call('verifyTestExpectations.testTypePermValueExpectationDoesNotExistFor', scenarioName, TestType.UNIT, permutationName, permutationValueName, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    // Verify Specific Value Test Permutation Added
    designerAcceptanceTestForScenario_SpecificValue_Exists(scenarioName, specificValue) {

        server.call('verifyTestExpectations.testTypeSpecificValueExpectationExistsFor', scenarioName, TestType.ACCEPTANCE, specificValue, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    designerIntegrationTestForScenario_SpecificValue_Exists(scenarioName, specificValue) {

        server.call('verifyTestExpectations.testTypeSpecificValueExpectationExistsFor', scenarioName, TestType.INTEGRATION, specificValue, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    designerUnitTestForScenario_SpecificValue_Exists(scenarioName, specificValue) {

        server.call('verifyTestExpectations.testTypeSpecificValueExpectationExistsFor', scenarioName, TestType.UNIT, specificValue, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    // Verify Specific Value Test Permutation removed
    designerAcceptanceTestForScenario_SpecificValue_DoesNotExist(scenarioName, specificValue) {

        server.call('verifyTestExpectations.testTypeSpecificValueExpectationDoesNotExistFor', scenarioName, TestType.ACCEPTANCE, specificValue, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    designerIntegrationTestForScenario_SpecificValue_DoesNotExist(scenarioName, specificValue) {

        server.call('verifyTestExpectations.testTypeSpecificValueExpectationDoesNotExistFor', scenarioName, TestType.INTEGRATION, specificValue, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };

    designerUnitTestForScenario_SpecificValue_DoesNotExist(scenarioName, specificValue) {

        server.call('verifyTestExpectations.testTypeSpecificValueExpectationDoesNotExistFor', scenarioName, TestType.UNIT, specificValue, 'gloria',
            (function (error, result) {
                return (error === null);
            })
        );
    };
}
export const TestExpectationVerifications = new TestExpectationVerificationsClass();