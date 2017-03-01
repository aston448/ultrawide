
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

describe('UC 109 - View Design Version', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 109 - View Design Version');
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
    it('A Designer can view an New Design Version', function(){

        // Setup
        // Make sure the design is in the user context and the design version isn't
        DesignActions.designerSelectsDesign('Design1');
        expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.DESIGNER));

        // Execute
        DesignVersionActions.designerViewsDesignVersion('DesignVersion1');

        // Verify
        // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
        expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.DESIGNER, 'DesignVersion1'));
    });

    it('All roles can view a Draft Design Version', function(){
        // Setup
        // Make sure the design is in the user context and the design version isn't
        DesignActions.designerSelectsDesign('Design1');
        expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.DESIGNER));
        // Publish it so its draft
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');

        // Try for Designer
        // Execute
        DesignVersionActions.designerViewsDesignVersion('DesignVersion1');

        // Verify
        // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
        expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.DESIGNER, 'DesignVersion1'));

        // Try for Developer
        DesignActions.developerSelectsDesign('Design1');
        expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.DEVELOPER));

        // Execute
        DesignVersionActions.developerViewsDesignVersion('DesignVersion1');

        // Verify
        // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
        expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.DEVELOPER, 'DesignVersion1'));

        // Try for Manager
        DesignActions.managerSelectsDesign('Design1');
        expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.MANAGER));

        // Execute
        DesignVersionActions.managerViewsDesignVersion('DesignVersion1');

        // Verify
        // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
        expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.MANAGER, 'DesignVersion1'));
    });


    it('All roles can view a Complete Design Version', function(){

        // Setup
        // Make sure the design is in the user context and the design version isn't
        DesignActions.designerSelectsDesign('Design1');
        expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.DESIGNER));
        // Publish it so its draft
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        // Create next version
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2');
        // Verify - new DV created with default name as well as DV1
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion1'));
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion2'));
        // Select the new DV
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        // And status should be updatable
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion2', DesignVersionStatus.VERSION_UPDATABLE,));
        // And previous DV should be complete
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion1', DesignVersionStatus.VERSION_DRAFT_COMPLETE,));

        // Try for Designer
        DesignActions.designerSelectsDesign('Design1');
        expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.DESIGNER));

        // Execute
        DesignVersionActions.designerViewsDesignVersion('DesignVersion1');

        // Verify
        // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
        expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.DESIGNER, 'DesignVersion1'));

        // Try for Developer
        DesignActions.developerSelectsDesign('Design1');
        expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.DEVELOPER));

        // Execute
        DesignVersionActions.developerViewsDesignVersion('DesignVersion1');

        // Verify
        // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
        expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.DEVELOPER, 'DesignVersion1'));

        // Try for Manager
        DesignActions.managerSelectsDesign('Design1');
        expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.MANAGER));

        // Execute
        DesignVersionActions.managerViewsDesignVersion('DesignVersion1');

        // Verify
        // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
        expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.MANAGER, 'DesignVersion1'));

    });

    it('All roles can view an Updatable Design Version', function(){

        // Setup
        // Make sure the design is in the user context and the design version isn't
        DesignActions.designerSelectsDesign('Design1');
        expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.DESIGNER));
        // Publish it so its draft
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        // Create next version
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2');
        // Verify - new DV created with default name as well as DV1
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion1'));
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion2'));
        // Select the new DV
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        // And status should be updatable
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion2', DesignVersionStatus.VERSION_UPDATABLE,));
        // And previous DV should be complete
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion1', DesignVersionStatus.VERSION_DRAFT_COMPLETE,));

        // Try for Designer
        DesignActions.designerSelectsDesign('Design1');
        expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.DESIGNER));

        // Execute
        DesignVersionActions.designerViewsDesignVersion('DesignVersion2');

        // Verify
        // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
        expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.DESIGNER, 'DesignVersion2'));

        // Try for Developer
        DesignActions.developerSelectsDesign('Design1');
        expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.DEVELOPER));

        // Execute
        DesignVersionActions.developerViewsDesignVersion('DesignVersion2');

        // Verify
        // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
        expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.DEVELOPER, 'DesignVersion2'));

        // Try for Manager
        DesignActions.managerSelectsDesign('Design1');
        expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.MANAGER));

        // Execute
        DesignVersionActions.managerViewsDesignVersion('DesignVersion2');

        // Verify
        // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
        expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.MANAGER, 'DesignVersion2'));

    });


    // Consequences
    it('When a non-editable Design Version is viewed it is opened View Only with no option to edit');

    it('When an editable Design Version is opened by a Designer it is opened View Only with an option to edit');

});
