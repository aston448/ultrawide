
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


describe('UC 207 - View Work Package Content - Initial Design Version', function(){

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


    // Interface


    // Actions
    it('A Manager may view a New Initial Design Version Work Package', function(){

        // Setup - make sure WP1 is selected before trying to view WP2
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerSelectsWorkPackage('WorkPackage1');

        // Execute - should automatically switch selection to WP2 if successful
        WorkPackageActions.managerViewsBaseWorkPackage('WorkPackage2');

        // Verify - current WP is WP2
        expect(WorkPackageVerifications.currentManagerWorkPackageIs('WorkPackage2'));
    });

    it('Any user role may view a Draft Initial Design Version Work Package', function(){

        // Setup - make sure WP2 is selected before trying to view WP1
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerSelectsWorkPackage('WorkPackage2');

        // Execute for Manager - should automatically switch selection to WP1 if successful
        WorkPackageActions.managerViewsBaseWorkPackage('WorkPackage1');

        // Verify - current WP is WP1
        expect(WorkPackageVerifications.currentManagerWorkPackageIs('WorkPackage1'));

        // Setup - Developer
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage2');

        // Execute for Developer - should automatically switch selection to WP1 if successful
        WorkPackageActions.developerViewsBaseWorkPackage('WorkPackage1');

        // Verify - current WP is WP1
        expect(WorkPackageVerifications.currentDeveloperWorkPackageIs('WorkPackage1'));

        // Setup - Designer
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.designerSelectsWorkPackage('WorkPackage2');

        // Execute for Designer - should automatically switch selection to WP1 if successful
        WorkPackageActions.designerViewsBaseWorkPackage('WorkPackage1');

        // Verify - current WP is WP1
        expect(WorkPackageVerifications.currentDesignerWorkPackageIs('WorkPackage1'));
    });

    it('Any user role may view a Complete Initial Design Version Work Package');


});


describe('UC 207 - View Work Package Content - Design Update', function(){

    before(function(){

    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });


    // Interface


    // Actions

    it('A Manager may view a New Design Update Work Package');

    it('Any user role may view a Draft Design Update Work Package');

    it('Any user role may view a Complete Design Update Work Package');


    // Conditions
    it('Only a Manager may view a New Design Update Work Package');


    // Consequences

});
