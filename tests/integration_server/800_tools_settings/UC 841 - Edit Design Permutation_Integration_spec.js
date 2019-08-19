import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { DesignPermutationActions}      from "../../../test_framework/test_wrappers/design_permutation_actions";
import { DesignPermutationVerifications } from '../../../test_framework/test_wrappers/design_permutation_verifications.js'
import {DefaultItemNames}               from "../../../imports/constants/default_names";

describe('UC 841 - Edit Design Permutation', function(){

    before(function(){

        TestFixtures.logTestSuite('UC 841 - Edit Design Permutation');

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

        it('A Design Permutation name can be edited and saved by a Designer', function(){

            // Setup
            DesignActions.designerWorksOnDesign('Design1');
            DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
            DesignPermutationActions.designerAddsDesignPermutation();

            // Check efault permutation existing
            DesignPermutationVerifications.defaultNewDesignPermutationExistsForDesign('Design1');

            // Execute
            DesignPermutationActions.designerUpdatesPermutationName(DefaultItemNames.NEW_PERMUTATION_NAME, 'My Permutation');

            // Verify
            DesignPermutationVerifications.designPermutationExistsForDesignCalled('Design1', 'My Permutation');

        });

    });
});
