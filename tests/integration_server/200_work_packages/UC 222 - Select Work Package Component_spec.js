
import TestFixtures                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import DesignActions                from '../../../test_framework/test_wrappers/design_actions.js';
import DesignVersionActions         from '../../../test_framework/test_wrappers/design_version_actions.js';
import DesignUpdateActions          from '../../../test_framework/test_wrappers/design_update_actions.js';
import DesignComponentActions       from '../../../test_framework/test_wrappers/design_component_actions.js';
import UpdateComponentActions       from '../../../test_framework/test_wrappers/design_update_component_actions.js';
import DesignVerifications          from '../../../test_framework/test_wrappers/design_verifications.js';
import DesignUpdateVerifications    from '../../../test_framework/test_wrappers/design_update_verifications.js';
import DesignVersionVerifications   from '../../../test_framework/test_wrappers/design_version_verifications.js';
import DesignComponentVerifications from '../../../test_framework/test_wrappers/design_component_verifications.js';
import UserContextVerifications     from '../../../test_framework/test_wrappers/user_context_verifications.js';
import WorkPackageActions           from '../../../test_framework/test_wrappers/work_package_actions.js';
import WorkPackageVerifications     from '../../../test_framework/test_wrappers/work_package_verifications.js';
import WpComponentActions           from '../../../test_framework/test_wrappers/work_package_component_actions.js';
import WpComponentVerifications     from '../../../test_framework/test_wrappers/work_package_component_verifications.js';

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction, WorkPackageStatus} from '../../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../../imports/constants/default_names.js';
import {WorkPackageComponentValidationErrors} from '../../../imports/constants/validation_errors.js'

describe('UC 222 - Select Work Package Component', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 222 - Select Work Package Component');
    });

    after(function(){

    });

    beforeEach(function(){

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();

        // Designer Publish DesignVersion1
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');

        // Manager selects DesignVersion1
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');

        // Add new Base WP
        WorkPackageActions.managerAddsBaseDesignWorkPackage();
        WorkPackageActions.managerSelectsWorkPackage(DefaultItemNames.NEW_WORK_PACKAGE_NAME);
        WorkPackageActions.managerUpdatesSelectedWpNameTo('WorkPackage1');

        WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage1')

    });

    afterEach(function(){

    });

    // Actions
    it('A Work Package Application may be selected', function(){

        // Execute
        WpComponentActions.managerSelectsWorkPackageComponent(ComponentType.APPLICATION, 'NONE', 'Application1');

        // Verify
        expect(UserContextVerifications.userContextForRole_DesignComponentIs(RoleType.MANAGER, ComponentType.APPLICATION, 'NONE', 'Application1'));
    });

    it('A Work Package Design Section may be selected', function(){

        // Execute
        WpComponentActions.managerSelectsWorkPackageComponent(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');

        // Verify
        expect(UserContextVerifications.userContextForRole_DesignComponentIs(RoleType.MANAGER, ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
    });

    it('A Work Package Feature may be selected', function(){

        // Execute
        WpComponentActions.managerSelectsWorkPackageComponent(ComponentType.FEATURE, 'Section1', 'Feature1');

        // Verify
        expect(UserContextVerifications.userContextForRole_DesignComponentIs(RoleType.MANAGER, ComponentType.FEATURE, 'Section1', 'Feature1'));
    });

    it('A Work Package Feature Aspect may be selected', function(){

        // Execute
        WpComponentActions.managerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');

        // Verify
        expect(UserContextVerifications.userContextForRole_DesignComponentIs(RoleType.MANAGER, ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
    });

    it('A Work Package Scenario may be selected', function(){

        // Execute
        WpComponentActions.managerSelectsWorkPackageComponent(ComponentType.SCENARIO, 'Actions', 'Scenario1');

        // Verify
        expect(UserContextVerifications.userContextForRole_DesignComponentIs(RoleType.MANAGER, ComponentType.SCENARIO, 'Actions', 'Scenario1'));
    });

});
