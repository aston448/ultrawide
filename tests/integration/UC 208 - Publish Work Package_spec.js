import {RoleType, ViewMode, ComponentType, WorkPackageType, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 208 - Publish Work Package - Initial Design Version', function(){

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
        server.call('testDesignVersions.publishDesignVersion', 'DesignVersion1', 'gloria', RoleType.DESIGNER);
        // Create New WP
        server.call('testDesigns.selectDesign', 'Design1', 'miles');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'miles');
        server.call('testWorkPackages.addNewWorkPackage', 'miles', RoleType.MANAGER, WorkPackageType.WP_BASE);
        server.call('testWorkPackages.selectWorkPackage', DefaultItemNames.NEW_WORK_PACKAGE_NAME, 'miles');
        server.call('testWorkPackages.updateWorkPackageName', 'WorkPackage1', RoleType.MANAGER, 'miles');

    });

    afterEach(function(){

    });


    // Actions
    it('A Manager can publish a New Initial Design Version Work Package', function(){

        // Execute
        server.call('testWorkPackages.publishWorkPackage', 'WorkPackage1', 'miles', RoleType.MANAGER);

        // Validate
        server.call('verifyWorkPackages.workPackageStatusIs', 'WorkPackage1', WorkPackageStatus.WP_AVAILABLE, 'miles');
    });


    // Conditions
    it('Only a Manager can publish a New Initial Design Version Work Package', function(){

        // Setup - Try Developer
        server.call('testDesigns.selectDesign', 'Design1', 'hugh');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'hugh');
        server.call('testWorkPackages.selectWorkPackage', 'WorkPackage1', 'hugh');

        // Execute
        server.call('testWorkPackages.publishWorkPackage', 'WorkPackage1', 'hugh', RoleType.DEVELOPER);

        // Validate
        server.call('verifyWorkPackages.workPackageStatusIs', 'WorkPackage1', WorkPackageStatus.WP_NEW, 'hugh');

        // Setup - Try Designer
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'gloria');
        server.call('testWorkPackages.selectWorkPackage', 'WorkPackage1', 'gloria');

        // Execute
        server.call('testWorkPackages.publishWorkPackage', 'WorkPackage1', 'gloria', RoleType.DESIGNER);

        // Validate
        server.call('verifyWorkPackages.workPackageStatusIs', 'WorkPackage1', WorkPackageStatus.WP_NEW, 'glria');
    });

});

describe('UC 208 - Publish Work Package - Design Update', function(){

    before(function(){

    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });


    // Actions
    it('A Manager can publish a New Design Update Work Package');


    // Conditions
    it('Only a Manager can publish a New Design Update Work Package');

});
