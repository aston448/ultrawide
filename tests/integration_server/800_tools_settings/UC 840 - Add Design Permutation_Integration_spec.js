import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { DesignPermutationActions}      from "../../../test_framework/test_wrappers/design_permutation_actions";
import { DesignPermutationVerifications } from '../../../test_framework/test_wrappers/design_permutation_verifications.js'

describe('UC 840 - Add Design Permutation', function(){

    before(function(){

        TestFixtures.logTestSuite('UC 840 - Add Design Permutation');

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();
    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });


    describe('Actions', function(){

        it('A Designer may add a new Design Permutation to the list of Design Permutations for a Design', function(){

            // Setup
            DesignActions.designerWorksOnDesign('Design1');
            DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');

            // Check no default permutation existing
            DesignPermutationVerifications.defaultNewDesignPermutationDoesNotExistForDesign('Design1');

            // Execute
            DesignPermutationActions.designerAddsDesignPermutation();

            // Verify
            DesignPermutationVerifications.defaultNewDesignPermutationExistsForDesign('Design1');
        });

    });
});
