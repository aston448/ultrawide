import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { DesignPermutationActions}      from "../../../test_framework/test_wrappers/design_permutation_actions";
import { DesignPermutationVerifications } from '../../../test_framework/test_wrappers/design_permutation_verifications.js'
import {DefaultItemNames}               from "../../../imports/constants/default_names";
import {DesignComponentActions} from "../../../test_framework/test_wrappers/design_component_actions";
import {TestExpectationActions} from "../../../test_framework/test_wrappers/test_expectation_actions";
import {TestExpectationMessages} from "../../../imports/constants/message_texts";
import {DesignPermutationValidationErrors, DesignValidationErrors} from "../../../imports/constants/validation_errors";

describe('UC 842 - Remove Design Permutation', function(){

    before(function(){

        TestFixtures.logTestSuite('UC 842 - Remove Design Permutation');

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

        it('An unused Design Permutation can be removed from the list by a Designer', function(){

            // Setup
            DesignActions.designerWorksOnDesign('Design1');
            DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
            DesignPermutationActions.designerAddsDesignPermutation();

            // Check
            DesignPermutationVerifications.defaultNewDesignPermutationExistsForDesign('Design1');

            // Execute
            DesignPermutationActions.designerRemovesPermutation(DefaultItemNames.NEW_PERMUTATION_NAME);

            // Verify
            DesignPermutationVerifications.defaultNewDesignPermutationDoesNotExistForDesign('Design1');

        });

    });

    describe('Conditions', function(){

        it('A Design Permutation cannot be removed if any of its values are in use for Scenario test requirements', function(){

            // Setup
            DesignActions.designerWorksOnDesign('Design1');
            DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
            DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
            DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
            TestExpectationActions.designerSelectsUnitExpectation('Scenario1');
            TestExpectationActions.designerSelectsUnitPermutationValue('Scenario1', 'Permutation1', 'PermutationValue1');
            TestExpectationActions.designerSelectsUnitPermutationValue('Scenario1', 'Permutation1', 'PermutationValue2');

            // Now try and remove Permutation1 - expect to fail
            const expectation = {success: false, message: DesignPermutationValidationErrors.PERMUTATION_REMOVE_IN_USE};
            DesignPermutationActions.designerRemovesPermutation('Permutation1', expectation);

            // Check still exists
            DesignPermutationVerifications.designPermutationExistsForDesignCalled('Design1', 'Permutation1');
        });

    });

    describe('Consequences', function(){

        it('When a Design Permutation is removed, any values associated with it are removed.', function(){

            // Setup
            DesignActions.designerWorksOnDesign('Design1');
            DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');

            // Checks
            DesignPermutationVerifications.designPermutationValueExistsForDesignVersionCalled('Design1', 'DesignVersion1', 'Permutation1', 'PermutationValue1');
            DesignPermutationVerifications.designPermutationValueExistsForDesignVersionCalled('Design1', 'DesignVersion1', 'Permutation1', 'PermutationValue2');

            // Execute
            DesignPermutationActions.designerRemovesPermutation('Permutation1');

            // Verify
            DesignPermutationVerifications.designPermutationValueDoesNotExistForDesignVersionCalled('Design1', 'DesignVersion1', 'Permutation1', 'PermutationValue1');
            DesignPermutationVerifications.designPermutationValueDoesNotExistForDesignVersionCalled('Design1', 'DesignVersion1', 'Permutation1', 'PermutationValue2');
        });

    });
});
