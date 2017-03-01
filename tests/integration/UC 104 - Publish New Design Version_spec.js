
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

describe('UC 104 - Publish New Design Version', function() {

    before(function(){
        TestFixtures.logTestSuite('UC 104 - Publish New Design Version');
    });

    after(function(){

    });

    beforeEach(function(){
        TestFixtures.clearAllData();

        // Add  Design - Design1: will create default Design Version
        DesignActions.designerAddsNewDesignCalled('Design1');
    });

    afterEach(function(){

    });

    // Actions
    it('A Designer can update a Design Version from New to Published', function() {

        // Setup -------------------------------------------------------------------------------------------------------
        // Make sure the design is in the user context
        DesignActions.designerSelectsDesign('Design1');
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs(DefaultItemNames.NEW_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_NEW));

        // Execute -----------------------------------------------------------------------------------------------------
        DesignVersionActions.designerPublishesDesignVersion(DefaultItemNames.NEW_DESIGN_VERSION_NAME);

        // Verify ------------------------------------------------------------------------------------------------------
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs(DefaultItemNames.NEW_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_DRAFT));
    });

});
