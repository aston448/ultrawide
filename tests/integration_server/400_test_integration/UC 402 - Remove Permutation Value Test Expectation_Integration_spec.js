import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { DesignComponentActions }       from '../../../test_framework/test_wrappers/design_component_actions.js';
import { TestExpectationActions }       from '../../../test_framework/test_wrappers/test_expectation_actions.js';
import { TestExpectationVerifications } from '../../../test_framework/test_wrappers/test_expectation_verifications.js'

describe('UC 402 - Remove Permutation Value Test Expectation', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 402 - Remove Permutation Value Test Expectation');

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();
    });

    after(function(){

    });

    beforeEach(function(){

        TestFixtures.clearTestExpectations();

    });

    afterEach(function(){

    });


    describe('Actions', function(){


        describe('A Designer may remove a Permutation Value Test Expectation for a Scenario test type', function(){

            it('Test Type - Unit', function(){

                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsUnitExpectation('Scenario1');

                // Set 2 value expectations
                TestExpectationActions.designerSelectsUnitPermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');
                TestExpectationActions.designerSelectsUnitPermutationValue('Scenario1', 'Permutation1', 'PermutationValue2');

                expect(TestExpectationVerifications.designerUnitTestForScenario_Permutation_Value_Exists('Scenario1', 'Permutation1', 'PermutationValue1'));
                expect(TestExpectationVerifications.designerUnitTestForScenario_Permutation_Value_Exists('Scenario1', 'Permutation1', 'PermutationValue2'));

                // Execute
                TestExpectationActions.designerUnselectsUnitPermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');

                // Verify
                expect(TestExpectationVerifications.designerUnitTestForScenario_Permutation_Value_DoesNotExist('Scenario1', 'Permutation1', 'PermutationValue1'));
                expect(TestExpectationVerifications.designerUnitTestForScenario_Permutation_Value_Exists('Scenario1', 'Permutation1', 'PermutationValue2'));
            });


            it('Test Type - Integration', function(){

                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsIntegrationExpectation('Scenario1');

                // Set 2 value expectations
                TestExpectationActions.designerSelectsIntegrationPermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');
                TestExpectationActions.designerSelectsIntegrationPermutationValue('Scenario1', 'Permutation1', 'PermutationValue2');

                expect(TestExpectationVerifications.designerIntegrationTestForScenario_Permutation_Value_Exists('Scenario1', 'Permutation1', 'PermutationValue1'));
                expect(TestExpectationVerifications.designerIntegrationTestForScenario_Permutation_Value_Exists('Scenario1', 'Permutation1', 'PermutationValue2'));

                // Execute
                TestExpectationActions.designerUnselectsIntegrationPermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');

                // Verify
                expect(TestExpectationVerifications.designerIntegrationTestForScenario_Permutation_Value_DoesNotExist('Scenario1', 'Permutation1', 'PermutationValue1'));
                expect(TestExpectationVerifications.designerIntegrationTestForScenario_Permutation_Value_Exists('Scenario1', 'Permutation1', 'PermutationValue2'));
            });


            it('Test Type - Acceptance', function(){

                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsAcceptanceExpectation('Scenario1');

                // Set 2 value expectations
                TestExpectationActions.designerSelectsAcceptancePermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');
                TestExpectationActions.designerSelectsAcceptancePermutationValue('Scenario1', 'Permutation1', 'PermutationValue2');

                expect(TestExpectationVerifications.designerAcceptanceTestForScenario_Permutation_Value_Exists('Scenario1', 'Permutation1', 'PermutationValue1'));
                expect(TestExpectationVerifications.designerAcceptanceTestForScenario_Permutation_Value_Exists('Scenario1', 'Permutation1', 'PermutationValue2'));

                // Execute
                TestExpectationActions.designerUnselectsAcceptancePermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');

                // Verify
                expect(TestExpectationVerifications.designerAcceptanceTestForScenario_Permutation_Value_DoesNotExist('Scenario1', 'Permutation1', 'PermutationValue1'));
                expect(TestExpectationVerifications.designerAcceptanceTestForScenario_Permutation_Value_Exists('Scenario1', 'Permutation1', 'PermutationValue2'));
            });

        });
    });
});
