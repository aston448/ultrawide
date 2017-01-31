
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

describe('UC 206 - Edit Work Package Content - Initial Design', function(){

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
        WorkPackageActions.managerSelectsWorkPackage(DefaultItemNames.NEW_WORK_PACKAGE_NAME);
        WorkPackageActions.managerUpdatesSelectedWpNameTo('WorkPackage1');
        WorkPackageActions.managerPublishesSelectedWorkPackage();

        // Add new Base WP - unpublished
        WorkPackageActions.managerAddsBaseDesignWorkPackage();
        WorkPackageActions.managerSelectsWorkPackage(DefaultItemNames.NEW_WORK_PACKAGE_NAME);
        WorkPackageActions.managerUpdatesSelectedWpNameTo('WorkPackage2');
    });

    afterEach(function(){

    });

    // Actions
    it('A Manager may edit a New Initial Design Version Work Package', function(){

        // Setup - make sure WP1 is selected before trying to edit WP2
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerSelectsWorkPackage('WorkPackage1');

        // Execute - should automatically switch selection to WP2 if successful
        WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage2');

        // Verify - current WP is WP2
        expect(WorkPackageVerifications.currentManagerWorkPackageIs('WorkPackage2'));

    });

    it('A Manager may edit a Draft Initial Design Version Work Package', function(){

        // Setup - publish WP1 and make sure WP2 is selected before trying to edit WP1
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerSelectsWorkPackage('WorkPackage2');

        // Execute - should automatically switch selection to WP1 if successful
        WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage1');

        // Verify - current WP is WP1
        expect(WorkPackageVerifications.currentManagerWorkPackageIs('WorkPackage1'));
    });

    it('A Manager may edit an Adopted Initial Design Version Work Package');



    // Conditions
    it('Only a Manager may edit a Published Initial Design Version Work Package');

    it('A Complete Initial Design Version Work Package may not be edited');


    // Consequences
    it('When a Work Package is edited it is opened in edit mode with an option to view only');

});

describe('UC 206 - Edit Work Package Content - Design Update', function(){

    before(function(){

    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });


    // Interface
    it('A Work Package has an option to edit it');


    // Actions

    it('A Manager may edit a New Design Update Work Package');

    it('A Manager may edit a Draft Design Update Work Package');

    it('A Manager may edit an Adopted Design Update Work Package');


    // Conditions

    it('Only a Manager may edit a Design Update Work Package');

    it('A Complete Design Update Work Package may not be edited');


    // Consequences
    it('When a Work Package is edited it is opened in edit mode with an option to view only');

});
