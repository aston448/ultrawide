
import TestFixtures                 from '../../test_framework/test_wrappers/test_fixtures.js';
import DesignActions                from '../../test_framework/test_wrappers/design_actions.js';
import DesignVersionActions         from '../../test_framework/test_wrappers/design_version_actions.js';
import DesignUpdateActions          from '../../test_framework/test_wrappers/design_update_actions.js';
import DesignComponentActions       from '../../test_framework/test_wrappers/design_component_actions.js';
import UpdateComponentActions       from '../../test_framework/test_wrappers/design_update_component_actions.js';
import DesignVerifications          from '../../test_framework/test_wrappers/design_verifications.js';
import DesignUpdateVerifications    from '../../test_framework/test_wrappers/design_update_verifications.js';
import DesignVersionVerifications   from '../../test_framework/test_wrappers/design_version_verifications.js';
import DesignComponentVerifications from '../../test_framework/test_wrappers/design_component_verifications.js';
import UserContextVerifications     from '../../test_framework/test_wrappers/user_context_verifications.js';

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


describe('UC 108 - Edit Design Version', function(){

    before(function(){

    });

    after(function(){

    });

    beforeEach(function(){

        TestFixtures.clearAllData();

        // Add  Basic Design / Design Version
        TestFixtures.addDesignWithDefaultData();
    });

    afterEach(function(){

    });


    // Actions
    it('A Designer can edit a New Design Version', function(){

        // Setup
        // Make sure the design is in the user context and the design version isn't
        DesignActions.designerSelectsDesign('Design1');
        expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.DESIGNER));

        // Execute
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');

        // Verify
        // The Design version will be in the user context if now editing - other evidence is interface specific and can only be seen in acceptance tests
        expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.DESIGNER, 'DesignVersion1'));
    });

    it('A Designer can edit a Draft Design Version', function(){
        // Setup
        // Make sure the design is in the user context
        DesignActions.designerSelectsDesign('Design1');
        // Publish it so its draft
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        // Go back and select the Design so that no Design Version in user context
        DesignActions.designerSelectsDesign('Design1');
        expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.DESIGNER));

        // Execute
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');

        // Verify
        // The Design version will be in the user context if now editing - other evidence is interface specific and can only be seen in acceptance tests
        expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.DESIGNER, 'DesignVersion1'));
    });


    // Consequences
    it('When a Design Version is edited it is opened in edit mode with an option to view only');

});
