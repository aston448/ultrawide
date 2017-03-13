
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

describe('UC 510 - Select Existing Design Update', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 510 - Select Existing Design Update');

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
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2'); // Published
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate2');
    });

    afterEach(function(){

    });


    // Actions
    it('An existing Design Update can be selected as the current working Design Update', function(){

        // Setup - Designer Select Update1
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        expect(UserContextVerifications.userContextForRole_DesignUpdateIs(RoleType.DESIGNER, 'DesignUpdate1'));

        // Execute
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate2');

        // Verify
        expect(UserContextVerifications.userContextForRole_DesignUpdateIs(RoleType.DESIGNER, 'DesignUpdate2'));
    });

});
