import {RoleType, ViewMode, ComponentType, WorkPackageType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 206 - Edit Work Package Content - Initial Design', function(){

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
        // Name and Publish a Design Version
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria');
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignVersions.publishDesignVersion', 'DesignVersion1', 'gloria', RoleType.DESIGNER);
        // Add Two Work Packages
        server.call('testDesigns.selectDesign', 'Design1', 'miles');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'miles');
        server.call('testWorkPackages.addNewWorkPackage', 'miles', RoleType.MANAGER, WorkPackageType.WP_BASE);
        server.call('testWorkPackages.selectWorkPackage', DefaultItemNames.NEW_WORK_PACKAGE_NAME, 'miles');
        server.call('testWorkPackages.updateWorkPackageName', 'WorkPackage1', RoleType.MANAGER, 'miles');
        server.call('testWorkPackages.addNewWorkPackage', 'miles', RoleType.MANAGER, WorkPackageType.WP_BASE);
        server.call('testWorkPackages.selectWorkPackage', DefaultItemNames.NEW_WORK_PACKAGE_NAME, 'miles');
        server.call('testWorkPackages.updateWorkPackageName', 'WorkPackage2', RoleType.MANAGER, 'miles');
    });

    afterEach(function(){

    });


    // Interface
    it('A Work Package has an option to edit it');


    // Actions
    it('A Manager may edit a New Initial Design Version Work Package', function(){

        // Setup - make sure WP2 is selected before trying to edit WP1
        server.call('testWorkPackages.selectWorkPackage', 'WorkPackage2', 'miles');

        // Execute - should automatically switch selection to WP1 if successful
        server.call('testWorkPackages.editWorkPackage', 'WorkPackage1', WorkPackageType.WP_BASE, 'miles', RoleType.MANAGER);

        // Verify - current WP is WP1
        server.call('verifyWorkPackages.currentWorkPackageNameIs', 'WorkPackage1', 'miles');

    });

    it('A Manager may edit a Draft Initial Design Version Work Package', function(){

        // Setup - publish WP1 and make sure WP2 is selected before trying to edit WP1
        server.call('testWorkPackages.selectWorkPackage', 'WorkPackage1', 'miles');
        server.call('testWorkPackages.publishWorkPackage', 'WorkPackage1', 'miles', RoleType.MANAGER);
        server.call('testWorkPackages.selectWorkPackage', 'WorkPackage2', 'miles');

        // Execute - should automatically switch selection to WP1 if successful
        server.call('testWorkPackages.editWorkPackage', 'WorkPackage1', WorkPackageType.WP_BASE, 'miles', RoleType.MANAGER);

        // Verify - current WP is WP1
        server.call('verifyWorkPackages.currentWorkPackageNameIs', 'WorkPackage1', 'miles');
    });

    it('A Manager may edit an Adopted Initial Design Version Work Package');



    // Conditions
    it('Only a Manager may edit a Published Initial Design Version Work Package', function(){

        // Setup - publish WP1
        server.call('testWorkPackages.selectWorkPackage', 'WorkPackage1', 'miles');
        server.call('testWorkPackages.publishWorkPackage', 'WorkPackage1', 'miles', RoleType.MANAGER);

        // Try as Developer
        server.call('testDesigns.selectDesign', 'Design1', 'hugh');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'hugh');
        server.call('testWorkPackages.selectWorkPackage', 'WorkPackage2', 'hugh');

        // Execute - should automatically switch selection to WP1 if successful
        server.call('testWorkPackages.editWorkPackage', 'WorkPackage1', WorkPackageType.WP_BASE, 'hugh', RoleType.DEVELOPER);

        // Verify - current WP is still WP2
        server.call('verifyWorkPackages.currentWorkPackageNameIs', 'WorkPackage2', 'hugh');


        // Try as Designer
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'gloria');
        server.call('testWorkPackages.selectWorkPackage', 'WorkPackage2', 'gloria');

        // Execute - should automatically switch selection to WP1 if successful
        server.call('testWorkPackages.editWorkPackage', 'WorkPackage1', WorkPackageType.WP_BASE, 'gloria', RoleType.DESIGNER);

        // Verify - current WP is still WP2
        server.call('verifyWorkPackages.currentWorkPackageNameIs', 'WorkPackage2', 'gloria');
    });

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
