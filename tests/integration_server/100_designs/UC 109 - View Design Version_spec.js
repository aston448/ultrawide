
import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { DesignUpdateActions }          from '../../../test_framework/test_wrappers/design_update_actions.js';
import { DesignComponentActions }       from '../../../test_framework/test_wrappers/design_component_actions.js';
import { UpdateComponentActions }       from '../../../test_framework/test_wrappers/design_update_component_actions.js';
import { DesignVersionVerifications }   from '../../../test_framework/test_wrappers/design_version_verifications.js';
import { DesignComponentVerifications } from '../../../test_framework/test_wrappers/design_component_verifications.js';
import { UserContextVerifications }     from '../../../test_framework/test_wrappers/user_context_verifications.js';

import {RoleType, DesignVersionStatus, UpdateMergeStatus, ComponentType, DesignUpdateMergeAction} from '../../../imports/constants/constants.js'
import {DefaultItemNames} from '../../../imports/constants/default_names.js';

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
    it('When a completed Updatable Design Version is viewed any Design Components removed in that version are not shown', function(){

        // Setup - create updatable design version
        DesignActions.designerSelectsDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerSelectsDesignVersion(DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        DesignVersionActions.designerUpdatesDesignVersionNameTo('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        // Make the update remove Feature1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');
        UpdateComponentActions.designerLogicallyDeletesUpdateFeature('Section1', 'Feature1');
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_INCLUDE);

        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion2');
        DesignVersionActions.designerSelectsDesignVersion(DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        DesignVersionActions.designerUpdatesDesignVersionNameTo('DesignVersion3');

        // Verify - Design Version 2 has Feature1 and Children removed (not visible)
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignVersionActions.designerViewsDesignVersion('DesignVersion2');
        DesignComponentActions.designerSelectsFeature('Section1', 'Feature1');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_REMOVED));
        DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_REMOVED));
        // Nor do they exist at all in the latest design version
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion3');
        DesignVersionActions.designerViewsDesignVersion('DesignVersion3');
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion3'));
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.SCENARIO, 'Scenario1', 'Design1', 'DesignVersion3'));
        // But still exist in the original version
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.SCENARIO, 'Scenario1', 'Design1', 'DesignVersion1'));
    });


});
