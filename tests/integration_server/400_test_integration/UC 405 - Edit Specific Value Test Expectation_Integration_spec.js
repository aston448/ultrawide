import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { DesignComponentActions }       from '../../../test_framework/test_wrappers/design_component_actions.js';
import { TestExpectationActions }       from '../../../test_framework/test_wrappers/test_expectation_actions.js';
import { TestExpectationVerifications } from '../../../test_framework/test_wrappers/test_expectation_verifications.js'
import {DefaultItemNames} from "../../../imports/constants/default_names";

describe('UC 405 - Edit Specific Value Test Expectation', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 405 - Edit Specific Value Test Expectation');

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


        describe('A Designer can edit a Specific Value and save changes', function(){

            it('Test Type - Unit', function(){

                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsUnitExpectation('Scenario1');

                expect(TestExpectationVerifications.designerScenarioUnitTestForScenario_Exists('Scenario1'));

                // Set a specific value expectation
                TestExpectationActions.designerAddsSpecificValueUnitTestExpectation('Scenario1');
                expect(TestExpectationVerifications.designerUnitTestForScenario_SpecificValue_Exists('Scenario1', DefaultItemNames.NEW_VALUE_EXPECTATION));

                // Execute
                TestExpectationActions.designerUpdatesSpecificValueUnitTestExpectation('Scenario1', DefaultItemNames.NEW_VALUE_EXPECTATION, 'SpecificValue1');

                // Verify
                expect(TestExpectationVerifications.designerUnitTestForScenario_SpecificValue_Exists('Scenario1', 'SpecificValue1'));
            });


            it('Test Type - Integration', function(){

                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsIntegrationExpectation('Scenario1');

                expect(TestExpectationVerifications.designerScenarioIntegrationTestForScenario_Exists('Scenario1'));

                // Set a specific value expectation
                TestExpectationActions.designerAddsSpecificValueIntegrationTestExpectation('Scenario1');
                expect(TestExpectationVerifications.designerIntegrationTestForScenario_SpecificValue_Exists('Scenario1', DefaultItemNames.NEW_VALUE_EXPECTATION));

                // Execute
                TestExpectationActions.designerUpdatesSpecificValueIntegrationTestExpectation('Scenario1', DefaultItemNames.NEW_VALUE_EXPECTATION, 'SpecificValue1');

                // Verify
                expect(TestExpectationVerifications.designerIntegrationTestForScenario_SpecificValue_Exists('Scenario1', 'SpecificValue1'));
            });


            it('Test Type - Acceptance', function(){

                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsAcceptanceExpectation('Scenario1');

                expect(TestExpectationVerifications.designerScenarioAcceptanceTestForScenario_Exists('Scenario1'));

                // Set a specific value expectation
                TestExpectationActions.designerAddsSpecificValueAcceptanceTestExpectation('Scenario1');
                expect(TestExpectationVerifications.designerAcceptanceTestForScenario_SpecificValue_Exists('Scenario1', DefaultItemNames.NEW_VALUE_EXPECTATION));

                // Execute
                TestExpectationActions.designerUpdatesSpecificValueAcceptanceTestExpectation('Scenario1', DefaultItemNames.NEW_VALUE_EXPECTATION, 'SpecificValue1');

                // Verify
                expect(TestExpectationVerifications.designerAcceptanceTestForScenario_SpecificValue_Exists('Scenario1', 'SpecificValue1'));
            });

        });
    });

    describe('Consequences', function(){


        describe('When a Specific Value is saved the current status of the Test Expectation is calculated from the latest loaded test data', function(){

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
});
