import {RoleType, ViewMode, ComponentType, WorkPackageType, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 205 - Remove Work Package - Initial Design Version', function(){

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
    it('A Manager may remove a New Initial Design Version Work Package', function(){

        // Setup - verify WP
        server.call('verifyWorkPackages.workPackageStatusIs', 'WorkPackage1', WorkPackageStatus.WP_NEW, 'miles');

        // Execute
        server.call('testWorkPackages.removeWorkPackage', 'WorkPackage1', 'miles', RoleType.MANAGER);

        // Verify
        server.call('verifyWorkPackages.workPackageDoesNotExistCalled', 'WorkPackage1', 'miles');
    });


    // Conditions
    it('Only a Manager may remove an Initial Design Version Work Package', function(){

        // Setup
        server.call('testDesigns.selectDesign', 'Design1', 'hugh');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'hugh');
        server.call('testWorkPackages.selectWorkPackage', 'WorkPackage1', 'hugh');
        server.call('verifyWorkPackages.workPackageStatusIs', 'WorkPackage1', WorkPackageStatus.WP_NEW, 'hugh');

        // Execute as Developer
        server.call('testWorkPackages.removeWorkPackage', 'WorkPackage1', 'hugh', RoleType.DEVELOPER);

        // Verify - still Exists
        server.call('verifyWorkPackages.workPackageExistsCalled', 'WorkPackage1', 'hugh');

        // Setup
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'gloria');
        server.call('testWorkPackages.selectWorkPackage', 'WorkPackage1', 'gloria');
        server.call('verifyWorkPackages.workPackageStatusIs', 'WorkPackage1', WorkPackageStatus.WP_NEW, 'gloria');

        // Execute as Designer
        server.call('testWorkPackages.removeWorkPackage', 'WorkPackage1', 'gloria', RoleType.DESIGNER);

        // Verify - still Exists
        server.call('verifyWorkPackages.workPackageExistsCalled', 'WorkPackage1', 'gloria');
    });

    it('An Available Initial Design Version Work Package may not be removed', function(){

        // Setup - publish the WP
        server.call('testWorkPackages.publishWorkPackage', 'WorkPackage1', 'miles', RoleType.MANAGER);
        server.call('verifyWorkPackages.workPackageStatusIs', 'WorkPackage1', WorkPackageStatus.WP_AVAILABLE, 'miles');

        // Execute
        server.call('testWorkPackages.removeWorkPackage', 'WorkPackage1', 'miles', RoleType.MANAGER);

        // Verify - still Exists
        server.call('verifyWorkPackages.workPackageExistsCalled', 'WorkPackage1', 'miles');

    });

    it('An Adopted Initial Design Version Work Package may not be removed');

    it('A Complete Initial Design Version Work Package may not be removed');

});

describe('UC 205 - Remove Work Package - Design Update', function(){

    before(function(){

    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });


    // Actions
    it('A Manager may remove a New Design Update Work Package');


    // Conditions
    it('Only a Manager may remove a Design Update Work Package');

    it('An Available Design Update Work Package may not be removed');

    it('An Adopted Design Update Work Package may not be removed');

    it('A Complete Design Update Work Package may not be removed');

});
