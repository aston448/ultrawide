
import TestFixtures                 from '../../test_framework/test_wrappers/test_fixtures.js';
import DesignActions                from '../../test_framework/test_wrappers/design_actions.js';
import DesignVersionActions         from '../../test_framework/test_wrappers/design_version_actions.js';
import DesignUpdateActions          from '../../test_framework/test_wrappers/design_update_actions.js';
import DesignComponentActions       from '../../test_framework/test_wrappers/design_component_actions.js';
import UpdateComponentActions       from '../../test_framework/test_wrappers/design_update_component_actions.js';
import DesignVerifications          from '../../test_framework/test_wrappers/design_verifications.js';
import DesignVersionVerifications   from '../../test_framework/test_wrappers/design_version_verifications.js';
import DesignComponentVerifications from '../../test_framework/test_wrappers/design_component_verifications.js';
import UserContextVerifications     from '../../test_framework/test_wrappers/user_context_verifications.js';

import {RoleType, DesignVersionStatus, ComponentType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 105 - Withdraw Design Version', function(){

    beforeEach(function(){

        TestFixtures.clearAllData();

        // Add  Design - Design1: will create default Design Version
        DesignActions.designerAddsNewDesignCalled('Design1');

    });

    afterEach(function(){

    });


    // Actions
    it('A Designer can revert a Design Version from Draft published to New', function() {

        // Setup
        DesignActions.designerSelectsDesign('Design1');
        DesignVersionActions.designerPublishesDesignVersion(DefaultItemNames.NEW_DESIGN_VERSION_NAME);
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs(DefaultItemNames.NEW_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_DRAFT));

        // Execute
        DesignVersionActions.designerWithdrawsDesignVersion(DefaultItemNames.NEW_DESIGN_VERSION_NAME);

        // Validate - NEW again
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs(DefaultItemNames.NEW_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_NEW));

    });


    // Conditions
    it('Only a Draft Design Version can be withdrawn');

    it('Only a Designer can withdraw a Design Version', function(){

        // Setup -------------------------------------------------------------------------------------------------------
        // Get Designer to publish it...
        DesignActions.designerSelectsDesign('Design1');
        DesignVersionActions.designerPublishesDesignVersion(DefaultItemNames.NEW_DESIGN_VERSION_NAME);
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs(DefaultItemNames.NEW_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_DRAFT));

        // See if Developer can unpublish
        // Make sure the design is in the user context
        DesignActions.developerSelectsDesign('Design1');

        // Execute -----------------------------------------------------------------------------------------------------
        DesignVersionActions.developerWithdrawsDesignVersion(DefaultItemNames.NEW_DESIGN_VERSION_NAME);

        // Verify ------------------------------------------------------------------------------------------------------
        expect(DesignVersionVerifications.designVersion_StatusForDeveloperIs(DefaultItemNames.NEW_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_NEW));

        // See if Manager can unpublish
        // Make sure the design is in the user context
        DesignActions.managerSelectsDesign('Design1');

        // Execute -----------------------------------------------------------------------------------------------------
        DesignVersionActions.managerWithdrawsDesignVersion(DefaultItemNames.NEW_DESIGN_VERSION_NAME);

        // Verify ------------------------------------------------------------------------------------------------------
        expect(DesignVersionVerifications.designVersion_StatusForManagerIs(DefaultItemNames.NEW_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_NEW));
    });

    it('A Design Version that has Design Updates cannot be withdrawn');

});
