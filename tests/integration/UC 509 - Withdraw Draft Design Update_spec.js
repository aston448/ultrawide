
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

describe('UC 509 - Withdraw Draft Design Update', function(){

    before(function(){

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

        TestFixtures.clearWorkPackages();
        TestFixtures.clearDesignUpdates();

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1'); // Published
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2'); // Still New
    });

    afterEach(function(){

    });


    // Actions
    it('A Designer can withdraw a Draft Design Update with no Work Packages', function(){

        // Setup
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        expect(DesignUpdateVerifications.updateStatusForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT));

        // Execute
        DesignUpdateActions.designerWithdrawsUpdate('DesignUpdate1');

        // Verify
        expect(DesignUpdateVerifications.updateStatusForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateStatus.UPDATE_NEW));
    });


    // Conditions
    it('A New Design Update cannot be withdrawn', function(){

        // Setup
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate2');
        expect(DesignUpdateVerifications.updateStatusForUpdate_ForDesignerIs('DesignUpdate2', DesignUpdateStatus.UPDATE_NEW));

        // Execute
        const expectation = {success: false, message: DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_STATE_WITHDRAW};
        DesignUpdateActions.designerWithdrawsUpdate('DesignUpdate2', expectation);

        // Verify
        expect(DesignUpdateVerifications.updateStatusForUpdate_ForDesignerIs('DesignUpdate2', DesignUpdateStatus.UPDATE_NEW));
    });

    it('A Complete Design Update cannot be withdrawn');

    it('A Draft Design Update cannot be withdrawn if it has Design Update Work Packages based on it', function(){

        // Setup
        // Manager creates a WP based on DU1
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerAddsUpdateWorkPackageCalled('UpdateWorkPackage1');

        // Setup
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        expect(DesignUpdateVerifications.updateStatusForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT));

        // Execute
        const expectation = {success: false, message: DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_WPS_WITHDRAW};
        DesignUpdateActions.designerWithdrawsUpdate('DesignUpdate1', expectation);

        // Verify
        expect(DesignUpdateVerifications.updateStatusForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT));
    });

    it('Only a Designer can withdraw a Draft Design Update', function(){
        // Setup
        // Manager
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');

        // Execute
        let expectation = {success: false, message: DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_WITHDRAW};
        DesignUpdateActions.managerWithdrawsUpdate('DesignUpdate1', expectation);

        // Verify
        expect(DesignUpdateVerifications.updateStatusForUpdate_ForManagerIs('DesignUpdate1', DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT));

        // Developer
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.developerSelectsUpdate('DesignUpdate1');

        // Execute
        expectation = {success: false, message: DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_WITHDRAW};
        DesignUpdateActions.developerWithdrawsUpdate('DesignUpdate1', expectation);

        // Verify
        expect(DesignUpdateVerifications.updateStatusForUpdate_ForDeveloperIs('DesignUpdate1', DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT));
    });

});
