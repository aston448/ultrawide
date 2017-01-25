import {RoleType, ViewMode, ComponentType, WorkPackageType, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 209 - Withdraw Work Package - Initial Design Version', function(){

    before(function(){

    });

    after(function(){

    });

    beforeEach(function(){

        server.call('testFixtures.clearAllData');

        // Create a Design
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, 'Design1');
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        // Name  and Publish Design Version
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria');
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignVersions.publishDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        // Create New WP
        server.call('testDesigns.selectDesign', 'Design1', 'miles');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'miles');
        server.call('testWorkPackages.addNewWorkPackage', WorkPackageType.WP_BASE, RoleType.MANAGER, 'miles');
        server.call('testWorkPackages.selectWorkPackage', DefaultItemNames.NEW_WORK_PACKAGE_NAME, 'miles');
        server.call('testWorkPackages.updateWorkPackageName', 'WorkPackage1', RoleType.MANAGER, 'miles');

    });

    afterEach(function(){

    });


    // Actions
    it('A Manager can withdraw an Available Initial Design Version Work Package', function(){

        // Setup - publish the WP
        server.call('testWorkPackages.publishWorkPackage', 'WorkPackage1', 'miles', RoleType.MANAGER);
        server.call('verifyWorkPackages.workPackageStatusIs', 'WorkPackage1', WorkPackageStatus.WP_AVAILABLE, 'miles');

        // Execute
        server.call('testWorkPackages.withdrawWorkPackage', 'WorkPackage1', 'miles', RoleType.MANAGER);

        // Verify
        server.call('verifyWorkPackages.workPackageStatusIs', 'WorkPackage1', WorkPackageStatus.WP_NEW, 'miles');

    });


    // Conditions
    it('Only a Manager can withdraw an Initial Design Version Work Package', function(){

        // Setup - publish the WP
        server.call('testWorkPackages.publishWorkPackage', 'WorkPackage1', 'miles', RoleType.MANAGER);
        server.call('verifyWorkPackages.workPackageStatusIs', 'WorkPackage1', WorkPackageStatus.WP_AVAILABLE, 'miles');

        // Execute as Developer
        server.call('testDesigns.selectDesign', 'Design1', 'hugh');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'hugh');
        server.call('testWorkPackages.selectWorkPackage', 'WorkPackage1', 'hugh');
        server.call('testWorkPackages.withdrawWorkPackage', 'WorkPackage1', 'hugh', RoleType.DEVELOPER);

        // Verify - still Available
        server.call('verifyWorkPackages.workPackageStatusIs', 'WorkPackage1', WorkPackageStatus.WP_AVAILABLE, 'hugh');

        // Execute as Designer
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'gloria');
        server.call('testWorkPackages.selectWorkPackage', 'WorkPackage1', 'gloria');
        server.call('testWorkPackages.withdrawWorkPackage', 'WorkPackage1', 'gloria', RoleType.DESIGNER);

        // Verify - still Available
        server.call('verifyWorkPackages.workPackageStatusIs', 'WorkPackage1', WorkPackageStatus.WP_AVAILABLE, 'gloria');

    });

    it('A New Initial Design Version Work Package cannot be withdrawn', function(){

        // Setup - verify is New
        server.call('verifyWorkPackages.workPackageStatusIs', 'WorkPackage1', WorkPackageStatus.WP_NEW, 'miles');

        // Execute
        server.call('testWorkPackages.withdrawWorkPackage', 'WorkPackage1', 'miles', RoleType.MANAGER);

        // Verify - still New
        server.call('verifyWorkPackages.workPackageStatusIs', 'WorkPackage1', WorkPackageStatus.WP_NEW, 'miles');

    });

    it('An Adopted Initial Design Version Work Package cannot be withdrawn');


    it('A Complete Initial Design Version Work Package cannot be withdrawn');

});

describe('UC 209 - Withdraw Work Package - Design Update', function(){

    before(function(){

    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });


    // Actions
    it('A Manager can withdraw an Available Design Update Work Package');


    // Conditions
    it('Only a Manager can withdraw a Design Update Work Package');

    it('An Adopted Design Update Work Package cannot be withdrawn');

    it('A New Design Update Work Package cannot be withdrawn');

    it('A Complete Design Update Work Package cannot be withdrawn');

});
