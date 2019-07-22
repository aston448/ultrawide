import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { DesignComponentActions }       from '../../../test_framework/test_wrappers/design_component_actions.js';
import { TestExpectationActions }       from '../../../test_framework/test_wrappers/test_expectation_actions.js';
import { TestExpectationVerifications } from '../../../test_framework/test_wrappers/test_expectation_verifications.js'

describe('UC 400 - Set Scenario Test Expectation', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 400 - Set Scenario Test Expectation');

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


        describe('A Designer may set a test type as expected for a Scenario', function(){

            it('Test Type - Unit', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');

                // Execute
                TestExpectationActions.designerSelectsUnitExpectation('Scenario1');

                // Verify
                expect(TestExpectationVerifications.designerScenarioUnitTestForScenario_Exists('Scenario1'));
            });

            it('Test Type - Integration', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');

                // Execute
                TestExpectationActions.designerSelectsIntegrationExpectation('Scenario1');

                // Verify
                expect(TestExpectationVerifications.designerScenarioIntegrationTestForScenario_Exists('Scenario1'));
            });

            it('Test Type - Acceptance', function(){
                // Setup
                DesignActions.designerWorksOnDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
                DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');

                // Execute
                TestExpectationActions.designerSelectsAcceptanceExpectation('Scenario1');

                // Verify
                expect(TestExpectationVerifications.designerScenarioAcceptanceTestForScenario_Exists('Scenario1'));
            });
        });

        it('A Designer may set more than one test type as expected for a Scenario', function(){
            // Setup
            DesignActions.designerWorksOnDesign('Design1');
            DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
            DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
            DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');

            // Execute
            TestExpectationActions.designerSelectsAcceptanceExpectation('Scenario1');
            TestExpectationActions.designerSelectsIntegrationExpectation('Scenario1');
            TestExpectationActions.designerSelectsUnitExpectation('Scenario1');

            // Verify
            expect(TestExpectationVerifications.designerScenarioAcceptanceTestForScenario_Exists('Scenario1'));
            expect(TestExpectationVerifications.designerScenarioIntegrationTestForScenario_Exists('Scenario1'));
            expect(TestExpectationVerifications.designerScenarioUnitTestForScenario_Exists('Scenario1'));
        });

    });

    describe('Consequences', function(){


        describe('When a Scenario Test Expectation is set the current status of the expectation is calculated from the latest loaded test data', function(){

            it('Test Type - Unit', function(){
                // Check that initial Unit test status is No Test Expected

                // Add a unit expectation for scenario1

                // Check that status is Test Missing before there is a test

                // Load a test result as a pass

                // Check that status is now pass

                // Load a test result as fail

                // Check that status is now fail

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

        describe('When a Scenario Test Expectation is set the Test Summary for the Scenario and Feature is updated', function(){

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
