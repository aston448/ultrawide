import {RoleType, ViewMode, ComponentType, WorkPackageType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 204 - Select Existing Work Package', function(){

    // Tests for Initial Design Version Work Packages

    before(function(){
        // This test data is used for all tests

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

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });


    // Interface
    it('When a Work Package is selected it is highlighted in the Work Package list');


    // Actions
    it('A Manager may select a Published Work Package from the Initial Design Version Work Package list', function(){

        // Setup - publish the WPs
        server.call('testDesigns.selectDesign', 'Design1', 'miles');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'miles');
        server.call('testWorkPackages.selectWorkPackage', 'WorkPackage1', 'miles');
        server.call('testWorkPackages.publishWorkPackage', 'WorkPackage1', 'miles', RoleType.MANAGER);
        server.call('testWorkPackages.selectWorkPackage', 'WorkPackage2', 'miles');
        server.call('testWorkPackages.publishWorkPackage', 'WorkPackage2', 'miles', RoleType.MANAGER);


        // Execute
        server.call('testWorkPackages.selectWorkPackage', 'WorkPackage1', 'miles');

        // Verify
        server.call('verifyWorkPackages.currentWorkPackageNameIs', 'WorkPackage1', 'miles');

        // Execute
        server.call('testWorkPackages.selectWorkPackage', 'WorkPackage2', 'miles');

        // Verify
        server.call('verifyWorkPackages.currentWorkPackageNameIs', 'WorkPackage2', 'miles');
    });

    it('A Developer may select a Published Work Package from the Initial Design Version Work Package list', function(){

        // Setup - publish the WPs
        server.call('testDesigns.selectDesign', 'Design1', 'miles');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'miles');
        server.call('testWorkPackages.selectWorkPackage', 'WorkPackage1', 'miles');
        server.call('testWorkPackages.publishWorkPackage', 'WorkPackage1', 'miles', RoleType.MANAGER);
        server.call('testWorkPackages.selectWorkPackage', 'WorkPackage2', 'miles');
        server.call('testWorkPackages.publishWorkPackage', 'WorkPackage2', 'miles', RoleType.MANAGER);

        server.call('testDesigns.selectDesign', 'Design1', 'hugh');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'hugh');

        // Execute
        server.call('testWorkPackages.selectWorkPackage', 'WorkPackage1', 'hugh');

        // Verify
        server.call('verifyWorkPackages.currentWorkPackageNameIs', 'WorkPackage1', 'hugh');

        // Execute
        server.call('testWorkPackages.selectWorkPackage', 'WorkPackage2', 'hugh');

        // Verify
        server.call('verifyWorkPackages.currentWorkPackageNameIs', 'WorkPackage2', 'hugh');
    });

    it('A Designer may select a Published Work Package from the Initial Design Version Work Package list', function(){

        // Setup - publish the WPs
        server.call('testDesigns.selectDesign', 'Design1', 'miles');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'miles');
        server.call('testWorkPackages.selectWorkPackage', 'WorkPackage1', 'miles');
        server.call('testWorkPackages.publishWorkPackage', 'WorkPackage1', 'miles', RoleType.MANAGER);
        server.call('testWorkPackages.selectWorkPackage', 'WorkPackage2', 'miles');
        server.call('testWorkPackages.publishWorkPackage', 'WorkPackage2', 'miles', RoleType.MANAGER);

        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'gloria');

        // Execute
        server.call('testWorkPackages.selectWorkPackage', 'WorkPackage1', 'gloria');

        // Verify
        server.call('verifyWorkPackages.currentWorkPackageNameIs', 'WorkPackage1', 'gloria');

        // Execute
        server.call('testWorkPackages.selectWorkPackage', 'WorkPackage2', 'gloria');

        // Verify
        server.call('verifyWorkPackages.currentWorkPackageNameIs', 'WorkPackage2', 'gloria');
    });


    // Conditions
    it('Only a Manager may select a New Work Package from the Initial Design Version Work Package list', function(){

        // Setup - Manager
        server.call('testDesigns.selectDesign', 'Design1', 'miles');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'miles');

        // Execute
        server.call('testWorkPackages.selectWorkPackage', 'WorkPackage2', 'miles');

        // Verify
        server.call('verifyWorkPackages.currentWorkPackageNameIs', 'WorkPackage2', 'miles');


        // Setup - Developer
        server.call('testDesigns.selectDesign', 'Design1', 'hugh');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'hugh');

        // Execute
        server.call('testWorkPackages.selectWorkPackage', 'WorkPackage2', 'hugh');

        // Verify
        server.call('verifyWorkPackages.currentWorkPackageNameIs', 'NONE', 'hugh');


        // Setup - Designer
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'gloria');

        // Execute
        server.call('testWorkPackages.selectWorkPackage', 'WorkPackage2', 'gloria');

        // Verify
        server.call('verifyWorkPackages.currentWorkPackageNameIs', 'NONE', 'gloria');
    });

});
