import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { DesignComponentActions }       from '../../../test_framework/test_wrappers/design_component_actions.js';
import { TestExpectationActions }       from '../../../test_framework/test_wrappers/test_expectation_actions.js';
import { TestExpectationVerifications } from '../../../test_framework/test_wrappers/test_expectation_verifications.js'
import {DefaultItemNames} from "../../../imports/constants/default_names";

describe('UC 403 - Remove Scenario Test Expectation', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 403 - Remove Scenario Test Expectation');
    });

    after(function(){

    });

    beforeEach(function(){
        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();
    });

    afterEach(function(){

    });


    describe('Actions', function(){


        describe('A Designer may remove all Test Expectations for a Scenario test type', function(){

            it('Test Type - Unit', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsUnitExpectation('Scenario1');

                expect(TestExpectationVerifications.designerScenarioUnitTestForScenario_Exists('Scenario1'));

                // Execute
                TestExpectationActions.designerUnselectsUnitExpectation('Scenario1');

                // Verify
                expect(TestExpectationVerifications.designerScenarioUnitTestForScenario_DoesNotExist('Scenario1'));
            });


            it('Test Type - Integration', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsIntegrationExpectation('Scenario1');

                expect(TestExpectationVerifications.designerScenarioIntegrationTestForScenario_Exists('Scenario1'));

                // Execute
                TestExpectationActions.designerUnselectsIntegrationExpectation('Scenario1');

                // Verify
                expect(TestExpectationVerifications.designerScenarioIntegrationTestForScenario_DoesNotExist('Scenario1'));
            });


            it('Test Type - Acceptance', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsAcceptanceExpectation('Scenario1');

                expect(TestExpectationVerifications.designerScenarioAcceptanceTestForScenario_Exists('Scenario1'));

                // Execute
                TestExpectationActions.designerUnselectsAcceptanceExpectation('Scenario1');

                // Verify
                expect(TestExpectationVerifications.designerScenarioAcceptanceTestForScenario_DoesNotExist('Scenario1'));
            });

        });
    });

    describe('Consequences', function(){


        describe('When a Scenario Test Expectation is removed for a test type all Design Permutation and Specific Value expectations are also removed for that test type', function(){

            it('Test Type - Unit', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsUnitExpectation('Scenario1');

                expect(TestExpectationVerifications.designerScenarioUnitTestForScenario_Exists('Scenario1'));

                // Set 2 value expectations
                TestExpectationActions.designerSelectsUnitPermutationValue('Scenario1', 'Permutation1', 'PermValue1');
                TestExpectationActions.designerSelectsUnitPermutationValue('Scenario1', 'Permutation1', 'PermValue2');

                expect(TestExpectationVerifications.designerUnitTestForScenario_Permutation_Value_Exists('Scenario1', 'Permutation1', 'PermValue1'));
                expect(TestExpectationVerifications.designerUnitTestForScenario_Permutation_Value_Exists('Scenario1', 'Permutation1', 'PermValue2'));

                // Set a specific value expectation
                TestExpectationActions.designerAddsSpecificValueUnitTestExpectation('Scenario1');
                TestExpectationActions.designerUpdatesSpecificValueUnitTestExpectation('Scenario1', DefaultItemNames.NEW_VALUE_EXPECTATION, 'SpecificValue1');

                expect(TestExpectationVerifications.designerUnitTestForScenario_SpecificValue_Exists('Scenario1', 'SpecificValue1'));

                // Execute
                TestExpectationActions.designerUnselectsUnitExpectation('Scenario1');

                // Verify
                expect(TestExpectationVerifications.designerScenarioUnitTestForScenario_DoesNotExist('Scenario1'));
                expect(TestExpectationVerifications.designerUnitTestForScenario_Permutation_Value_DoesNotExist('Scenario1', 'Permutation1', 'PermValue1'));
                expect(TestExpectationVerifications.designerUnitTestForScenario_Permutation_Value_DoesNotExist('Scenario1', 'Permutation1', 'PermValue2'));
                expect(TestExpectationVerifications.designerUnitTestForScenario_SpecificValue_DoesNotExist('Scenario1', 'SpecificValue1'));
            });


            it('Test Type - Integration', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsIntegrationExpectation('Scenario1');

                expect(TestExpectationVerifications.designerScenarioIntegrationTestForScenario_Exists('Scenario1'));

                // Set 2 value expectations
                TestExpectationActions.designerSelectsIntegrationPermutationValue('Scenario1', 'Permutation1', 'PermValue1');
                TestExpectationActions.designerSelectsIntegrationPermutationValue('Scenario1', 'Permutation1', 'PermValue2');

                expect(TestExpectationVerifications.designerIntegrationTestForScenario_Permutation_Value_Exists('Scenario1', 'Permutation1', 'PermValue1'));
                expect(TestExpectationVerifications.designerIntegrationTestForScenario_Permutation_Value_Exists('Scenario1', 'Permutation1', 'PermValue2'));

                // Set a specific value expectation
                TestExpectationActions.designerAddsSpecificValueIntegrationTestExpectation('Scenario1');
                TestExpectationActions.designerUpdatesSpecificValueIntegrationTestExpectation('Scenario1', DefaultItemNames.NEW_VALUE_EXPECTATION, 'SpecificValue1');

                expect(TestExpectationVerifications.designerIntegrationTestForScenario_SpecificValue_Exists('Scenario1', 'SpecificValue1'));

                // Execute
                TestExpectationActions.designerUnselectsIntegrationExpectation('Scenario1');

                // Verify
                expect(TestExpectationVerifications.designerScenarioIntegrationTestForScenario_DoesNotExist('Scenario1'));
                expect(TestExpectationVerifications.designerIntegrationTestForScenario_Permutation_Value_DoesNotExist('Scenario1', 'Permutation1', 'PermValue1'));
                expect(TestExpectationVerifications.designerIntegrationTestForScenario_Permutation_Value_DoesNotExist('Scenario1', 'Permutation1', 'PermValue2'));
                expect(TestExpectationVerifications.designerIntegrationTestForScenario_SpecificValue_DoesNotExist('Scenario1', 'SpecificValue1'));
            });


            it('Test Type - Acceptance', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsAcceptanceExpectation('Scenario1');

                expect(TestExpectationVerifications.designerScenarioAcceptanceTestForScenario_Exists('Scenario1'));

                // Set 2 value expectations
                TestExpectationActions.designerSelectsAcceptancePermutationValue('Scenario1', 'Permutation1', 'PermValue1');
                TestExpectationActions.designerSelectsAcceptancePermutationValue('Scenario1', 'Permutation1', 'PermValue2');

                expect(TestExpectationVerifications.designerAcceptanceTestForScenario_Permutation_Value_Exists('Scenario1', 'Permutation1', 'PermValue1'));
                expect(TestExpectationVerifications.designerAcceptanceTestForScenario_Permutation_Value_Exists('Scenario1', 'Permutation1', 'PermValue2'));

                // Set a specific value expectation
                TestExpectationActions.designerAddsSpecificValueAcceptanceTestExpectation('Scenario1');
                TestExpectationActions.designerUpdatesSpecificValueAcceptanceTestExpectation('Scenario1', DefaultItemNames.NEW_VALUE_EXPECTATION, 'SpecificValue1');

                expect(TestExpectationVerifications.designerAcceptanceTestForScenario_SpecificValue_Exists('Scenario1', 'SpecificValue1'));

                // Execute
                TestExpectationActions.designerUnselectsAcceptanceExpectation('Scenario1');

                // Verify
                expect(TestExpectationVerifications.designerScenarioAcceptanceTestForScenario_DoesNotExist('Scenario1'));
                expect(TestExpectationVerifications.designerAcceptanceTestForScenario_Permutation_Value_DoesNotExist('Scenario1', 'Permutation1', 'PermValue1'));
                expect(TestExpectationVerifications.designerAcceptanceTestForScenario_Permutation_Value_DoesNotExist('Scenario1', 'Permutation1', 'PermValue2'));
                expect(TestExpectationVerifications.designerAcceptanceTestForScenario_SpecificValue_DoesNotExist('Scenario1', 'SpecificValue1'));
            });

        });
    });
});
