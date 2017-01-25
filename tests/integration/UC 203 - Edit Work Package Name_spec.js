import {RoleType, ViewMode, ComponentType, WorkPackageType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 203 - Edit Work Package Name', function(){

    before(function(){

    });

    after(function(){

    });

    beforeEach(function(){

        server.call('testFixtures.clearAllData');

        // Add  Design - Design1: will create default Design Version - then set DV as DesignVersion1 and publish it
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, 'Design1');
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria');
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignVersions.publishDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        // Add a new Work Package
        server.call('testDesigns.selectDesign', 'Design1', 'miles');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'miles');
        server.call('testWorkPackages.addNewWorkPackage', WorkPackageType.WP_BASE, RoleType.MANAGER, 'miles');
    });

    afterEach(function(){

    });


    // Interface
    it('A Work Package has an option to edit its name');

    it('When a Work Package name is being edited there is an option to save changes');

    it('When a Work Package name is being edited there is an option to undo changes');


    // Actions
    it('A Manager may edit the name of a Work Package', function(){

        // Setup - select and verify the WP
        server.call('testWorkPackages.selectWorkPackage', DefaultItemNames.NEW_WORK_PACKAGE_NAME, 'miles');
        server.call('verifyWorkPackages.currentWorkPackageNameIs', DefaultItemNames.NEW_WORK_PACKAGE_NAME, 'miles');

        // Execute
        server.call('testWorkPackages.updateWorkPackageName', 'WorkPackage1', RoleType.MANAGER, 'miles');

        // Verify
        server.call('verifyWorkPackages.currentWorkPackageNameIs', 'WorkPackage1', 'miles');
    });

    it('A Work Package name being edited may be discarded without losing the old name');


    // Conditions
    it('Only a Manager may edit a Work Package name', function(){

        // Setup - select and verify the WP
        server.call('testWorkPackages.selectWorkPackage', DefaultItemNames.NEW_WORK_PACKAGE_NAME, 'miles');
        server.call('verifyWorkPackages.currentWorkPackageNameIs', DefaultItemNames.NEW_WORK_PACKAGE_NAME, 'miles');

        // Execute as Designer
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'gloria');
        server.call('testWorkPackages.selectWorkPackage', DefaultItemNames.NEW_WORK_PACKAGE_NAME, 'gloria');
        server.call('testWorkPackages.updateWorkPackageName', 'WorkPackage1', RoleType.DESIGNER, 'gloria');

        // Verify
        server.call('verifyWorkPackages.currentWorkPackageNameIs', DefaultItemNames.NEW_WORK_PACKAGE_NAME, 'gloria');

        // Execute as Developer
        server.call('testDesigns.selectDesign', 'Design1', 'hugh');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'hugh');
        server.call('testWorkPackages.selectWorkPackage', DefaultItemNames.NEW_WORK_PACKAGE_NAME, 'hugh');
        server.call('testWorkPackages.updateWorkPackageName', 'WorkPackage1', RoleType.DEVELOPER, 'hugh');

        // Verify
        server.call('verifyWorkPackages.currentWorkPackageNameIs', DefaultItemNames.NEW_WORK_PACKAGE_NAME, 'hugh');
    });

    it('A Work Package may not be given the same name as another Work Package for the Design Version', function(){

        // Setup - select WP and rename
        server.call('testWorkPackages.selectWorkPackage', DefaultItemNames.NEW_WORK_PACKAGE_NAME, 'miles');
        server.call('testWorkPackages.updateWorkPackageName', 'WorkPackage1', RoleType.MANAGER, 'miles');
        server.call('verifyWorkPackages.workPackageCalledCountIs', 'WorkPackage1', 1, 'miles');
        // Add another WP
        server.call('testWorkPackages.addNewWorkPackage', WorkPackageType.WP_BASE, RoleType.MANAGER, 'miles');

        // Execute - select new WP and try to rename to WorkPackage1
        server.call('testWorkPackages.selectWorkPackage', DefaultItemNames.NEW_WORK_PACKAGE_NAME, 'miles');
        server.call('testWorkPackages.updateWorkPackageName', 'WorkPackage1', RoleType.MANAGER, 'miles');

        // Verify - should be only 1 with new name and 1 with default
        server.call('verifyWorkPackages.workPackageCalledCountIs', DefaultItemNames.NEW_WORK_PACKAGE_NAME, 1, 'miles');
        server.call('verifyWorkPackages.workPackageCalledCountIs', 'WorkPackage1', 1, 'miles');
    });

});
