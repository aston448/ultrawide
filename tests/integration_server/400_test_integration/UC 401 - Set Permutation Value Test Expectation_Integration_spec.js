import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { DesignComponentActions }       from '../../../test_framework/test_wrappers/design_component_actions.js';
import { TestExpectationActions }       from '../../../test_framework/test_wrappers/test_expectation_actions.js';
import { TestExpectationVerifications } from '../../../test_framework/test_wrappers/test_expectation_verifications.js'

describe('UC 401 - Set Permutation Value Test Expectation', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 401 - Set Permutation Value Test Expectation');

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


        describe('A Designer may select one or more Permutation Values for a Scenario test type Test Expectation', function(){

            it('Test Type - Unit', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsUnitExpectation('Scenario1');

                // Execute
                TestExpectationActions.designerSelectsUnitPermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');
                TestExpectationActions.designerSelectsUnitPermutationValue('Scenario1', 'Permutation1', 'PermutationValue2');

                // Verify
                expect(TestExpectationVerifications.designerUnitTestForScenario_Permutation_Value_Exists('Scenario1', 'Permutation1', 'PermutationValue1'));
                expect(TestExpectationVerifications.designerUnitTestForScenario_Permutation_Value_Exists('Scenario1', 'Permutation1', 'PermutationValue2'));
            });

            it('Test Type - Integration', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsIntegrationExpectation('Scenario1');

                // Execute
                TestExpectationActions.designerSelectsIntegrationPermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');
                TestExpectationActions.designerSelectsIntegrationPermutationValue('Scenario1', 'Permutation1', 'PermutationValue2');

                // Verify
                expect(TestExpectationVerifications.designerIntegrationTestForScenario_Permutation_Value_Exists('Scenario1', 'Permutation1', 'PermutationValue1'));
                expect(TestExpectationVerifications.designerIntegrationTestForScenario_Permutation_Value_Exists('Scenario1', 'Permutation1', 'PermutationValue2'));
            });

            it('Test Type - Acceptance', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsAcceptanceExpectation('Scenario1');

                // Execute
                TestExpectationActions.designerSelectsAcceptancePermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');
                TestExpectationActions.designerSelectsAcceptancePermutationValue('Scenario1', 'Permutation1', 'PermutationValue2');

                // Verify
                expect(TestExpectationVerifications.designerAcceptanceTestForScenario_Permutation_Value_Exists('Scenario1', 'Permutation1', 'PermutationValue1'));
                expect(TestExpectationVerifications.designerAcceptanceTestForScenario_Permutation_Value_Exists('Scenario1', 'Permutation1', 'PermutationValue2'));
            });
        });
    });

    describe('Conditions', function(){


        describe('Permutation Values may only be selected for one Design Permutation per Scenario test type', function(){

            it.skip('Test Type - Unit', function(){
                // Replace this with test code
                // Remove skip once implemented
            });


            it.skip('Test Type - Integration', function(){
                // Replace this with test code
                // Remove skip once implemented
            });


            it.skip('Test Type - Acceptance', function(){
                // Replace this with test code
                // Remove skip once implemented
            });

        });
    });

    describe('Consequences', function(){

        it.skip('When a Permutation Value Test Expectation is set the current status of the expectation is calculated from the latest loaded test data', function(){
            // Replace this with test code
            // Remove skip once implemented
        });

        it.skip('When a Permutation Value Test Expectation is set the Test Summary for the Scenario and Feature is updated', function(){
            // Replace this with test code
            // Remove skip once implemented
        });

    });
});
