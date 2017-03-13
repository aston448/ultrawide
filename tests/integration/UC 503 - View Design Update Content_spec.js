
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

describe('UC 503 - View Design Update Content', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 503 - View Design Update Content');

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();

        // Complete the Design Version and create the next
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2');

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1'); // Published
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2'); // Still New
    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });


    // Actions
    it('A Designer can view a New or Published Design Update', function(){

        // Setup
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');

        // Execute
        DesignUpdateActions.designerViewsUpdate('DesignUpdate1');

        // Verify
        expect(DesignUpdateVerifications.currentUpdateForDesignerIs('DesignUpdate1'));

        // Setup
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');

        // Execute
        DesignUpdateActions.designerViewsUpdate('DesignUpdate2');

        // Verify
        expect(DesignUpdateVerifications.currentUpdateForDesignerIs('DesignUpdate2'));


    });

    it('A Developer can view a Published Design Update', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');

        // Execute
        DesignUpdateActions.developerViewsUpdate('DesignUpdate1');

        // Verify
        expect(DesignUpdateVerifications.currentUpdateForDeveloperIs('DesignUpdate1'));
    });

    it('A Manager can view a Published Design Update', function(){

        // Setup
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');

        // Execute
        DesignUpdateActions.managerViewsUpdate('DesignUpdate1');

        // Verify
        expect(DesignUpdateVerifications.currentUpdateForManagerIs('DesignUpdate1'));
    });


    // Conditions
    it('Only a Designer can view a New Design Update', function(){

        // Setup - Developer
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');

        // Execute
        const expectation = {success: false, message: DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_VIEW_NEW};
        DesignUpdateActions.developerViewsUpdate('DesignUpdate2', expectation);

        // Setup - Manager
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');

        // Execute
        DesignUpdateActions.managerViewsUpdate('DesignUpdate2', expectation);

    });

});
