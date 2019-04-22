import {RoleType, ViewType, TestType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

class TestExpectationActionsClass {

    // REFRESH ---------------------------------------------------------------------------------------------------------

    // Select Scenario
    designerSelectsAcceptanceExpectation(scenarioName, expectation){

        server.call('testExpectations.selectScenarioTestTypeExpectation', 'gloria', scenarioName, TestType.ACCEPTANCE, expectation);
    };

    designerSelectsIntegrationExpectation(scenarioName, expectation){

        server.call('testExpectations.selectScenarioTestTypeExpectation', 'gloria', scenarioName, TestType.INTEGRATION, expectation);
    };

    designerSelectsUnitExpectation(scenarioName, expectation){

        server.call('testExpectations.selectScenarioTestTypeExpectation', 'gloria', scenarioName, TestType.UNIT, expectation);
    };

    // Unselect Scenario
    designerUnselectsAcceptanceExpectation(scenarioName, expectation){

        server.call('testExpectations.unselectScenarioTestTypeExpectation', 'gloria', scenarioName, TestType.ACCEPTANCE, expectation);
    };

    designerUnselectsIntegrationExpectation(scenarioName, expectation){

        server.call('testExpectations.unselectScenarioTestTypeExpectation', 'gloria', scenarioName, TestType.INTEGRATION, expectation);
    };

    designerUnselectsUnitExpectation(scenarioName, expectation){

        server.call('testExpectations.unselectScenarioTestTypeExpectation', 'gloria', scenarioName, TestType.UNIT, expectation);
    };

    // Add specific value test
    designerAddsSpecificValueAcceptanceTestExpectation(scenarioName, expectation){

        server.call('testExpectations.addSpecificValueTestTypeExpectation', 'gloria', scenarioName, TestType.ACCEPTANCE, expectation);
    };

    designerAddsSpecificValueIntegrationTestExpectation(scenarioName, expectation){

        server.call('testExpectations.addSpecificValueTestTypeExpectation', 'gloria', scenarioName, TestType.INTEGRATION, expectation);
    };

    designerAddsSpecificValueUnitTestExpectation(scenarioName, expectation){

        server.call('testExpectations.addSpecificValueTestTypeExpectation', 'gloria', scenarioName, TestType.UNIT, expectation);
    };

    // Update specific value test
    designerUpdatesSpecificValueAcceptanceTestExpectation(scenarioName, oldValue, newValue, expectation){

        server.call('testExpectations.updateSpecificValueTestTypeExpectation', 'gloria', scenarioName, TestType.ACCEPTANCE, oldValue, newValue, expectation);
    };

    designerUpdatesSpecificValueIntegrationTestExpectation(scenarioName, oldValue, newValue, expectation){

        server.call('testExpectations.updateSpecificValueTestTypeExpectation', 'gloria', scenarioName, TestType.INTEGRATION, oldValue, newValue, expectation);
    };

    designerUpdatesSpecificValueUnitTestExpectation(scenarioName, oldValue, newValue, expectation){

        server.call('testExpectations.updateSpecificValueTestTypeExpectation', 'gloria', scenarioName, TestType.UNIT, oldValue, newValue, expectation);
    };

    // Remove specific value test
    designerRemovesSpecificValueAcceptanceTestExpectation(scenarioName, value, expectation){

        server.call('testExpectations.removeSpecificValueTestTypeExpectation', 'gloria', scenarioName, TestType.ACCEPTANCE, value, expectation);
    };

    designerRemovesSpecificValueIntegrationTestExpectation(scenarioName, value, expectation){

        server.call('testExpectations.removeSpecificValueTestTypeExpectation', 'gloria', scenarioName, TestType.INTEGRATION, value, expectation);
    };

    designerRemovesSpecificValueUnitTestExpectation(scenarioName, value, expectation){

        server.call('testExpectations.removeSpecificValueTestTypeExpectation', 'gloria', scenarioName, TestType.UNIT, value, expectation);
    };

    // Unselect permutation type (Note no select perm type as this has no effect except in GUI - for tests just go straight to selecting the perm value.  This unselects all values)
    designerUnselectsAcceptancePermutationType(scenarioName, permutationName, expectation){

        server.call('testExpectations.removeSpecificValueTestTypeExpectation', 'gloria', scenarioName, TestType.ACCEPTANCE, permutationName, expectation);
    }

    designerUnselectsIntegrationPermutationType(scenarioName, permutationName, expectation){

        server.call('testExpectations.removeSpecificValueTestTypeExpectation', 'gloria', scenarioName, TestType.INTEGRATION, permutationName, expectation);
    }

    designerUnselectsUnitPermutationType(scenarioName, permutationName, expectation){

        server.call('testExpectations.removeSpecificValueTestTypeExpectation', 'gloria', scenarioName, TestType.UNIT, permutationName, expectation);
    }

    // Select Specific Permutation Value
    designerSelectsAcceptancePermutationValue(scenarioName, permutationName, permutationValueName, expectation){

        server.call('testExpectations.selectTestTypePermutationValueExpectation', 'gloria', scenarioName, TestType.ACCEPTANCE, permutationName, permutationValueName, expectation);
    }

    designerSelectsIntegrationPermutationValue(scenarioName, permutationName, permutationValueName, expectation){

        server.call('testExpectations.selectTestTypePermutationValueExpectation', 'gloria', scenarioName, TestType.INTEGRATION, permutationName, permutationValueName, expectation);
    }

    designerSelectsUnitPermutationValue(scenarioName, permutationName, permutationValueName, expectation){

        server.call('testExpectations.selectTestTypePermutationValueExpectation', 'gloria', scenarioName, TestType.UNIT, permutationName, permutationValueName, expectation);
    }

    // UnSelect Specific Permutation Value
    designerUnselectsAcceptancePermutationValue(scenarioName, permutationName, permutationValueName, expectation){

        server.call('testExpectations.unselectTestTypePermutationValueExpectation', 'gloria', scenarioName, TestType.ACCEPTANCE, permutationName, permutationValueName, expectation);
    }

    designerUnselectsIntegrationPermutationValue(scenarioName, permutationName, permutationValueName, expectation){

        server.call('testExpectations.unselectTestTypePermutationValueExpectation', 'gloria', scenarioName, TestType.INTEGRATION, permutationName, permutationValueName, expectation);
    }

    designerUnselectsUnitPermutationValue(scenarioName, permutationName, permutationValueName, expectation){

        server.call('testExpectations.unselectTestTypePermutationValueExpectation', 'gloria', scenarioName, TestType.UNIT, permutationName, permutationValueName, expectation);
    }

}
export const TestExpectationActions = new TestExpectationActionsClass();
