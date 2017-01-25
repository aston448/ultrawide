import {RoleType, ViewMode, ComponentType, WorkPackageType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 201 - Add New Initial Design Version Work Package', function(){

    before(function(){

    });

    after(function(){

    });

    beforeEach(function(){

        server.call('testFixtures.clearAllData');

        // Add  Design - Design1: will create default Design Version - then set DV as DesignVersion1
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, 'Design1');
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria');
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
    });

    afterEach(function(){

    });


    // Interface
    it('The Work Package list for a Design Version has an option to add a new Work Package');


    // Actions
    it('A Manager may add a new Work Package to an Initial Design Version', function() {

        // Setup
        // Designer Publish DesignVersion1
        server.call('testDesignVersions.publishDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        // Manager select DesignVersion1
        server.call('testDesigns.selectDesign', 'Design1', 'miles');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'miles');

        // Execute - add WP as Manager
        server.call('testWorkPackages.addNewWorkPackage', WorkPackageType.WP_BASE, RoleType.MANAGER, 'miles');

        // Verify
        server.call('verifyWorkPackages.workPackageExistsCalled', DefaultItemNames.NEW_WORK_PACKAGE_NAME, 'miles');
    });


    // Conditions
    it('Only a Manager can add new Initial Design Version Work Packages', function() {

        // Setup
        // Designer Publish DesignVersion1
        server.call('testDesignVersions.publishDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');

        // Execute - Designer try to create WP
        // Designer select DesignVersion1
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'gloria');
        server.call('testWorkPackages.addNewWorkPackage', WorkPackageType.WP_BASE, RoleType.DESIGNER, 'gloria');

        // Verify
        server.call('verifyWorkPackages.workPackageDoesNotExistCalled', DefaultItemNames.NEW_WORK_PACKAGE_NAME, 'gloria');

        // Execute - Developer try to create WP
        // Developer select DesignVersion1
        server.call('testDesigns.selectDesign', 'Design1', 'hugh');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'hugh');
        server.call('testWorkPackages.addNewWorkPackage', WorkPackageType.WP_BASE, RoleType.DEVELOPER, 'hugh');

        // Verify
        server.call('verifyWorkPackages.workPackageDoesNotExistCalled', DefaultItemNames.NEW_WORK_PACKAGE_NAME, 'hugh');

    });

    it('A Work Package cannot be added to a New Design Version', function() {

        // Setup - leave the DV as New
        // Manager select DesignVersion1
        server.call('testDesigns.selectDesign', 'Design1', 'miles');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'miles');

        // Execute - add WP as Manager
        server.call('testWorkPackages.addNewWorkPackage', WorkPackageType.WP_BASE, RoleType.MANAGER, 'miles');

        // Verify
        server.call('verifyWorkPackages.workPackageDoesNotExistCalled', DefaultItemNames.NEW_WORK_PACKAGE_NAME, 'miles');

    });

    it('A Work Package cannot be added to a Complete Design Version');

    it('A Work Package cannot be added to an Updatable Design Version');

});
