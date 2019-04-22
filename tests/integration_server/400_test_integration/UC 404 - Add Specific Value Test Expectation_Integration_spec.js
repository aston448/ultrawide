import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { DesignComponentActions }       from '../../../test_framework/test_wrappers/design_component_actions.js';
import { TestExpectationActions }       from '../../../test_framework/test_wrappers/test_expectation_actions.js';
import { TestExpectationVerifications } from '../../../test_framework/test_wrappers/test_expectation_verifications.js'
import {DefaultItemNames} from "../../../imports/constants/default_names";

describe('UC 404 - Add Specific Value Test Expectation', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 404 - Add Specific Value Test Expectation');
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


        describe('A Designer can add a new Specific Value to a Scenario Test Expectation', function(){

            it('Test Type - Unit', function(){

                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
                TestExpectationActions.designerSelectsUnitExpectation('Scenario1');

                expect(TestExpectationVerifications.designerScenarioUnitTestForScenario_Exists('Scenario1'));

                // Execute
                TestExpectationActions.designerAddsSpecificValueUnitTestExpectation('Scenario1');

                // Verify
                expect(TestExpectationVerifications.designerUnitTestForScenario_SpecificValue_Exists('Scenario1', DefaultItemNames.NEW_VALUE_EXPECTATION));
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
                TestExpectationActions.designerAddsSpecificValueIntegrationTestExpectation('Scenario1');

                // Verify
                expect(TestExpectationVerifications.designerIntegrationTestForScenario_SpecificValue_Exists('Scenario1', DefaultItemNames.NEW_VALUE_EXPECTATION));
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
                TestExpectationActions.designerAddsSpecificValueAcceptanceTestExpectation('Scenario1');

                // Verify
                expect(TestExpectationVerifications.designerAcceptanceTestForScenario_SpecificValue_Exists('Scenario1', DefaultItemNames.NEW_VALUE_EXPECTATION));
            });

        });
    });

    describe('Consequences', function(){


        describe('When a Specific Value Test Expectation is set the current status of the expectation is calculated from the latest loaded test data', function(){

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

        describe('When a Specific Value Test Expectation is set the Test Summary for the Scenario and Feature is updated', function(){

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
