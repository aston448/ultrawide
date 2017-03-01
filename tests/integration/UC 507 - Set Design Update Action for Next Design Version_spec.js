
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
import UpdateComponentVerifications from '../../test_framework/test_wrappers/design_update_component_verifications.js';
import UserContextVerifications     from '../../test_framework/test_wrappers/user_context_verifications.js';
import WorkPackageActions           from '../../test_framework/test_wrappers/work_package_actions.js';
import WorkPackageVerifications     from '../../test_framework/test_wrappers/work_package_verifications.js';
import WpComponentActions           from '../../test_framework/test_wrappers/work_package_component_actions.js';
import WpComponentVerifications     from '../../test_framework/test_wrappers/work_package_component_verifications.js';

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';
import {DesignUpdateValidationErrors} from '../../imports/constants/validation_errors.js';

describe('UC 507 - Set Design Update Action for Next Design Version', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 507 - Set Design Update Action for Next Design Version');

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();

        // Complete the Design Version and create the next
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2');
    });

    after(function(){

    });

    beforeEach(function(){

        TestFixtures.clearDesignUpdates();

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1'); // Published
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2'); // Still New
    });

    afterEach(function(){

    });


    // Actions
    it('A Designer may set a Draft Design Update as Merge', function(){

        // Setup - Draft DU is merge by default so change it back first
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_IGNORE);
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateMergeAction.MERGE_IGNORE));

        // Execute
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_INCLUDE);

        // Verify
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateMergeAction.MERGE_INCLUDE));
    });

    it('A Designer may set a Draft Design Update as Carry Forward', function(){

        // Setup
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateMergeAction.MERGE_INCLUDE));

        // Execute
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_ROLL);

        // Verify
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateMergeAction.MERGE_ROLL));
    });

    it('A Designer may set a Draft Design Update as Ignore', function(){

        // Setup
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateMergeAction.MERGE_INCLUDE));

        // Execute
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_IGNORE);

        // Verify
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateMergeAction.MERGE_IGNORE));
    });


    // Conditions
    it('A Designer cannot set Design Update actions for a New Design Update', function(){

        // Setup
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate2');
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate2', DesignUpdateMergeAction.MERGE_IGNORE));

        // Execute
        const expectation = {success: false, message: DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_STATE_MERGE_ACTION};
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_INCLUDE, expectation);

        // Verify
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate2', DesignUpdateMergeAction.MERGE_IGNORE));
    });

    it('A Designer cannot set Design Update actions for a Complete Design Update');

    it('A Developer cannot set Design Update actions', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.developerSelectsUpdate('DesignUpdate1');
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDeveloperIs('DesignUpdate1', DesignUpdateMergeAction.MERGE_INCLUDE));

        // Execute
        const expectation = {success: false, message: DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_MERGE_ACTION};
        DesignUpdateActions.developerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_IGNORE, expectation);

        // Validate
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDeveloperIs('DesignUpdate1', DesignUpdateMergeAction.MERGE_INCLUDE));
    });

    it('A Manager cannot set Design Update actions', function(){

        // Setup
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForManagerIs('DesignUpdate1', DesignUpdateMergeAction.MERGE_INCLUDE));

        // Execute
        const expectation = {success: false, message: DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_MERGE_ACTION};
        DesignUpdateActions.managerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_IGNORE, expectation);

        // Validate
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForManagerIs('DesignUpdate1', DesignUpdateMergeAction.MERGE_INCLUDE));
    });

});
