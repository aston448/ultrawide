
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

describe('UC 505 - Publish New Design Update', function(){

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

        TestFixtures.clearDesignUpdates();

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1'); // Published
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2'); // Still New
    });

    afterEach(function(){

    });

    // Actions
    it('A Designer can publish a New Design Update', function(){

        // Setup
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate2');
        expect(DesignUpdateVerifications.updateStatusForUpdate_ForDesignerIs('DesignUpdate2', DesignUpdateStatus.UPDATE_NEW));

        // Execute
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate2');

        // Verify
        expect(DesignUpdateVerifications.updateStatusForUpdate_ForDesignerIs('DesignUpdate2', DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT));
    });


    // Conditions
    it('A Developer cannot publish a Design Update', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.developerSelectsUpdate('DesignUpdate2');
        expect(DesignUpdateVerifications.updateStatusForUpdate_ForDeveloperIs('DesignUpdate2', DesignUpdateStatus.UPDATE_NEW));

        // Execute
        const expectation = {success: false, message: DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_PUBLISH};
        DesignUpdateActions.developerPublishesUpdate('DesignUpdate2', expectation);

        // Verify
        expect(DesignUpdateVerifications.updateStatusForUpdate_ForDeveloperIs('DesignUpdate2', DesignUpdateStatus.UPDATE_NEW));
    });

    it('A Manager cannot publish a Design Update', function(){

        // Setup
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate2');
        expect(DesignUpdateVerifications.updateStatusForUpdate_ForManagerIs('DesignUpdate2', DesignUpdateStatus.UPDATE_NEW));

        // Execute
        const expectation = {success: false, message: DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_PUBLISH};
        DesignUpdateActions.managerPublishesUpdate('DesignUpdate2', expectation);

        // Verify
        expect(DesignUpdateVerifications.updateStatusForUpdate_ForManagerIs('DesignUpdate2', DesignUpdateStatus.UPDATE_NEW));
    });

    it('A Designer cannot publish a Draft Design Update', function(){

        // Setup
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        expect(DesignUpdateVerifications.updateStatusForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT));

        // Execute
        const expectation = {success: false, message: DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_STATE_PUBLISH};
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1', expectation);

        // Verify
        expect(DesignUpdateVerifications.updateStatusForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT));
    });

    it('A Designer cannot publish a Complete Design Update');


    // Consequences
    it('When a Design Update is published its default merge action is Merge', function(){

        // Setup
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate2');
        expect(DesignUpdateVerifications.updateStatusForUpdate_ForDesignerIs('DesignUpdate2', DesignUpdateStatus.UPDATE_NEW));

        // Execute
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate2');

        // Verify
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate2', DesignUpdateMergeAction.MERGE_INCLUDE));
    });

});
