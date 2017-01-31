
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
import WorkPackageActions           from '../../test_framework/test_wrappers/work_package_actions.js';
import WorkPackageVerifications     from '../../test_framework/test_wrappers/work_package_verifications.js';

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 203 - Edit Work Package Name', function(){

    before(function(){

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
    });

    afterEach(function(){

    });


    // Actions
    it('A Manager may edit the name of a Work Package', function(){

        // Setup - select the WP
        WorkPackageActions.managerSelectsWorkPackage(DefaultItemNames.NEW_WORK_PACKAGE_NAME);

        // Execute
        WorkPackageActions.managerUpdatesSelectedWpNameTo('WorkPackage1');

        // Verify
        expect(WorkPackageVerifications.workPackageExistsForManagerCalled('WorkPackage1'));
    });

    it('A Work Package name being edited may be discarded without losing the old name');


    // Conditions
    it('A Work Package may not be given the same name as another Work Package for the Design Version', function(){

        // Setup - select WP and rename
        WorkPackageActions.managerSelectsWorkPackage(DefaultItemNames.NEW_WORK_PACKAGE_NAME);
        WorkPackageActions.managerUpdatesSelectedWpNameTo('WorkPackage1');
        expect(WorkPackageVerifications.workPackageCalled_CountForManagerIs('WorkPackage1', 1));

        // Add another WP
        WorkPackageActions.managerAddsBaseDesignWorkPackage();

        // Execute - select new WP and try to rename to WorkPackage1
        WorkPackageActions.managerSelectsWorkPackage(DefaultItemNames.NEW_WORK_PACKAGE_NAME);
        WorkPackageActions.managerUpdatesSelectedWpNameTo('WorkPackage1');

        // Verify - should be only 1 with new name and 1 with default
        expect(WorkPackageVerifications.workPackageCalled_CountForManagerIs('WorkPackage1', 1));
        expect(WorkPackageVerifications.workPackageCalled_CountForManagerIs(DefaultItemNames.NEW_WORK_PACKAGE_NAME, 1));
    });

});
