import {RoleType, ViewMode, ComponentType, WorkPackageType, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 231 - Add Design Component to Scope - Initial Design Version', function(){

    before(function(){

        server.call('testFixtures.clearAllData');

        // Create a Design
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, 'Design1');
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        // Name and Publish a Design Version
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria');
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignVersions.publishDesignVersion', 'DesignVersion1', 'gloria', RoleType.DESIGNER);
        // Add Basic Data to the Design Version
        server.call('testDesigns.editDesignVersion', 'Design1', 'DesignVersion1', 'gloria', RoleType.DESIGNER);
        server.call('testFixtures.AddBasicDesignData', 'Design1', 'DesignVersion1');
        // Add A Work Package
        server.call('testDesigns.selectDesign', 'Design1', 'miles');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'miles');
        server.call('testWorkPackages.addNewWorkPackage', 'miles', RoleType.MANAGER, WorkPackageType.WP_BASE);
        server.call('testWorkPackages.selectWorkPackage', DefaultItemNames.NEW_WORK_PACKAGE_NAME, 'miles');
        server.call('testWorkPackages.updateWorkPackageName', 'WorkPackage1', RoleType.MANAGER, 'miles');

    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });


    // Interface
    it('An Initial Design Version Work Package Scope pane shows all Design Components for the Design Version', function(){

        // We have an Initial Design Version with an App, Design Sections, Features and Scenarios - check that they all exist in the scope

        // Setup - open the WP for view
        server.call('testWorkPackages.viewWorkPackage', 'WorkPackage1', WorkPackageType.WP_BASE, 'miles', RoleType.MANAGER);

        // Verify
        server.call('verifyWorkPackageComponents.componentExistsCalled', 'WorkPackage1', ComponentType.APPLICATION, 'Application1', 'miles');
        server.call('verifyWorkPackageComponents.componentExistsCalled', 'WorkPackage1', ComponentType.DESIGN_SECTION, 'Section1', 'miles');
        server.call('verifyWorkPackageComponents.componentExistsCalled', 'WorkPackage1', ComponentType.DESIGN_SECTION, 'Section2', 'miles');
        server.call('verifyWorkPackageComponents.componentExistsCalled', 'WorkPackage1', ComponentType.FEATURE, 'Feature1', 'miles');
        server.call('verifyWorkPackageComponents.componentExistsCalled', 'WorkPackage1', ComponentType.FEATURE, 'Feature2', 'miles');
        server.call('verifyWorkPackageComponents.componentExistsCalled', 'WorkPackage1', ComponentType.SCENARIO, 'Scenario1', 'miles');
        server.call('verifyWorkPackageComponents.componentExistsCalled', 'WorkPackage1', ComponentType.SCENARIO, 'Scenario2', 'miles');
        server.call('verifyWorkPackageComponents.componentExistsCalled', 'WorkPackage1', ComponentType.SCENARIO, 'Scenario3', 'miles');
        server.call('verifyWorkPackageComponents.componentExistsCalled', 'WorkPackage1', ComponentType.SCENARIO, 'Scenario4', 'miles');

        // And verify correct parents
        server.call('verifyWorkPackageComponents.componentParentIs', 'WorkPackage1', ComponentType.APPLICATION, 'Application1', 'NONE', 'miles');
        server.call('verifyWorkPackageComponents.componentParentIs', 'WorkPackage1', ComponentType.DESIGN_SECTION, 'Section1', 'Application1', 'miles');
        server.call('verifyWorkPackageComponents.componentParentIs', 'WorkPackage1', ComponentType.DESIGN_SECTION, 'Section2', 'Application1', 'miles');
        server.call('verifyWorkPackageComponents.componentParentIs', 'WorkPackage1', ComponentType.FEATURE, 'Feature1', 'Section1', 'miles');
        server.call('verifyWorkPackageComponents.componentParentIs', 'WorkPackage1', ComponentType.FEATURE, 'Feature2', 'Section2', 'miles');
        server.call('verifyWorkPackageComponents.componentParentIs', 'WorkPackage1', ComponentType.SCENARIO, 'Scenario1', 'Actions', 'miles');
        server.call('verifyWorkPackageComponents.componentParentIs', 'WorkPackage1', ComponentType.SCENARIO, 'Scenario2', 'Conditions', 'miles');
        server.call('verifyWorkPackageComponents.componentParentIs', 'WorkPackage1', ComponentType.SCENARIO, 'Scenario3', 'Actions', 'miles');
        server.call('verifyWorkPackageComponents.componentParentIs', 'WorkPackage1', ComponentType.SCENARIO, 'Scenario4', 'Conditions', 'miles');
    });


    // Actions
    it('A Manager can add all non-scoped Scenarios for an Application in an Initial Design Version to a Work Package Scope', function(){

        // Setup - edit the WP
        server.call('testWorkPackages.editWorkPackage', 'WorkPackage1', WorkPackageType.WP_BASE, 'miles', RoleType.MANAGER);

        // Execute - toggle Application1 in scope
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', 'WorkPackage1', ComponentType.APPLICATION, 'NONE', 'Application1', 'miles');

        // Verify
        // Application1 is in parent scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.APPLICATION, 'NONE', 'Application1', 'miles');
        // Section1 is in parent scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'miles');
        // Feature1 is in scope
        server.call('verifyWorkPackageComponents.componentIsInScope', 'WorkPackage1', ComponentType.FEATURE, 'Section1', 'Feature1', 'miles');
        // Feature1 Actions is in parent scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'miles');
        // Scenario1 is in scope
        server.call('verifyWorkPackageComponents.componentIsInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'miles');
        // Feature1 Conditions is in parent scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'miles');
        // Scenario2 is in scope
        server.call('verifyWorkPackageComponents.componentIsInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'miles');
        // Section2 is in parent scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'miles');
        // Feature2 is in scope
        server.call('verifyWorkPackageComponents.componentIsInScope', 'WorkPackage1', ComponentType.FEATURE, 'Section2', 'Feature2', 'miles');
        // Feature2 Actions is in parent scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'miles');
        // Scenario3 is in scope
        server.call('verifyWorkPackageComponents.componentIsInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'miles');
        // Feature2 Conditions is in parent scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'miles');
        // Scenario4 is in scope
        server.call('verifyWorkPackageComponents.componentIsInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'miles');
    });

    it('A Manager can add all non-scoped Scenarios for a Design Section in an Initial Design Version to a Work Package Scope', function(){

        // Setup - edit the WP
        server.call('testWorkPackages.editWorkPackage', 'WorkPackage1', WorkPackageType.WP_BASE, 'miles', RoleType.MANAGER);

        // Execute - toggle Section1 in scope
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', 'WorkPackage1', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'miles');

        // Verify
        // Application1 is in parent scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.APPLICATION, 'NONE', 'Application1', 'miles');
        // Section1 is in parent scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'miles');
        // Feature1 is in scope
        server.call('verifyWorkPackageComponents.componentIsInScope', 'WorkPackage1', ComponentType.FEATURE, 'Section1', 'Feature1', 'miles');
        // Feature1 Actions is in parent scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'miles');
        // Scenario1 is in scope
        server.call('verifyWorkPackageComponents.componentIsInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'miles');
        // Feature1 Conditions is in parent scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'miles');
        // Scenario2 is in scope
        server.call('verifyWorkPackageComponents.componentIsInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'miles');
        // Section2 is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'miles');
        // Feature2 is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.FEATURE, 'Section2', 'Feature2', 'miles');
        // Feature2 Actions is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'miles');
        // Scenario3 is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'miles');
        // Feature2 Conditions is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'miles');
        // Scenario4 is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'miles');
    });

    it('A Manager can add all non-scoped Scenarios for a Feature in an Initial Design Version to a Work Package Scope', function(){

        // Setup - edit the WP
        server.call('testWorkPackages.editWorkPackage', 'WorkPackage1', WorkPackageType.WP_BASE, 'miles', RoleType.MANAGER);

        // Execute - toggle Feature1 in scope
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', 'WorkPackage1', ComponentType.FEATURE, 'Section1', 'Feature1', 'miles');

        // Verify
        // Application1 is in parent scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.APPLICATION, 'NONE', 'Application1', 'miles');
        // Section1 is in parent scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'miles');
        // Feature1 is in scope
        server.call('verifyWorkPackageComponents.componentIsInScope', 'WorkPackage1', ComponentType.FEATURE, 'Section1', 'Feature1', 'miles');
        // Feature1 Actions is in parent scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'miles');
        // Scenario1 is in scope
        server.call('verifyWorkPackageComponents.componentIsInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'miles');
        // Feature1 Conditions is in parent scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'miles');
        // Scenario2 is in scope
        server.call('verifyWorkPackageComponents.componentIsInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'miles');
        // Section2 is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'miles');
        // Feature2 is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.FEATURE, 'Section2', 'Feature2', 'miles');
        // Feature2 Actions is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'miles');
        // Scenario3 is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'miles');
        // Feature2 Conditions is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'miles');
        // Scenario4 is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'miles');
    });

    it('A Manager can add all non-scoped Scenarios for a Feature Aspect in an Initial Design Version to a Work Package Scope', function(){

        // Setup - edit the WP
        server.call('testWorkPackages.editWorkPackage', 'WorkPackage1', WorkPackageType.WP_BASE, 'miles', RoleType.MANAGER);

        // Execute - toggle Feature1 Actions in scope
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'miles');

        // Verify
        // Application1 is in parent scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.APPLICATION, 'NONE', 'Application1', 'miles');
        // Section1 is in parent scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'miles');
        // Feature1 is in parent scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.FEATURE, 'Section1', 'Feature1', 'miles');
        // Feature1 Actions is in parent scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'miles');
        // Scenario1 is in scope
        server.call('verifyWorkPackageComponents.componentIsInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'miles');
        // Feature1 Conditions is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'miles');
        // Scenario2 is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'miles');
        // Section2 is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'miles');
        // Feature2 is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.FEATURE, 'Section2', 'Feature2', 'miles');
        // Feature2 Actions is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'miles');
        // Scenario3 is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'miles');
        // Feature2 Conditions is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'miles');
        // Scenario4 is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'miles');
    });

    it('A Manager can add a non-scoped Scenario in an Initial Design Version to a Work Package Scope', function(){

        // Setup - edit the WP
        server.call('testWorkPackages.editWorkPackage', 'WorkPackage1', WorkPackageType.WP_BASE, 'miles', RoleType.MANAGER);

        // Execute - toggle Scenario3 in scope
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'miles');

        // Verify
        // Application1 is in parent scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.APPLICATION, 'NONE', 'Application1', 'miles');
        // Section1 is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'miles');
        // Feature1 is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.FEATURE, 'Section1', 'Feature1', 'miles');
        // Feature1 Actions is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'miles');
        // Scenario1 is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'miles');
        // Feature1 Conditions is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'miles');
        // Scenario2 is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'miles');
        // Section2 is in parent scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'miles');
        // Feature2 is in parent scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.FEATURE, 'Section2', 'Feature2', 'miles');
        // Feature2 Actions in parent scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'miles');
        // Scenario3 is in Scope
        server.call('verifyWorkPackageComponents.componentIsInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'miles');
        // Feature2 Conditions is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'miles');
        // Scenario4 is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'miles');
    });


    // Conditions
    it('Design Components cannot be added to Initial Design Version Work Package Scope in View Only mode', function(){

        // Setup - edit the WP
        server.call('testWorkPackages.viewWorkPackage', 'WorkPackage1', WorkPackageType.WP_BASE, 'miles', RoleType.MANAGER);

        // Execute - toggle Application1 in scope
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', 'WorkPackage1', ComponentType.APPLICATION, 'NONE', 'Application1', 'miles');

        // Verify
        // Application1 is not in scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.APPLICATION, 'NONE', 'Application1', 'miles');

    });

    it('Any Scenario child of the Scope selection already in Scope for another Work Package for the same Initial Design Version is not added to a Work Package Scope', function(){

        // Setup - add Scenario3 to WP 1 scope
        server.call('testWorkPackages.editWorkPackage', 'WorkPackage1', WorkPackageType.WP_BASE, 'miles', RoleType.MANAGER);
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'miles');
        // Add a new WP...
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'miles');
        server.call('testWorkPackages.addNewWorkPackage', 'miles', RoleType.MANAGER, WorkPackageType.WP_BASE);
        server.call('testWorkPackages.selectWorkPackage', DefaultItemNames.NEW_WORK_PACKAGE_NAME, 'miles');
        server.call('testWorkPackages.updateWorkPackageName', 'WorkPackage2', RoleType.MANAGER, 'miles');

        // Execute - add everything below Application1 in scope for WorkPackage2
        server.call('testWorkPackages.editWorkPackage', 'WorkPackage2', WorkPackageType.WP_BASE, 'miles', RoleType.MANAGER);
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', 'WorkPackage2', ComponentType.APPLICATION, 'NONE', 'Application1', 'miles');

        // Verify - Scenarios 1, 2 and 4 should be in scope but not 3
        server.call('verifyWorkPackageComponents.componentIsInScope', 'WorkPackage2', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'miles');
        server.call('verifyWorkPackageComponents.componentIsInScope', 'WorkPackage2', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'miles');
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage2', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'miles');
        server.call('verifyWorkPackageComponents.componentIsInScope', 'WorkPackage2', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'miles');

        // Feature2 should be in scope for both WPs but as parent only for WP1
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.FEATURE, 'Section2', 'Feature2', 'miles');
        server.call('verifyWorkPackageComponents.componentIsInScope', 'WorkPackage2', ComponentType.FEATURE, 'Section2', 'Feature2', 'miles');

    });

    it('An individual Scenario cannot be added to a Work Package Scope if it is in Scope for another Work Package for the same Initial Design Version', function(){

        // Setup - add Scenario3 to WP 1 scope
        server.call('testWorkPackages.editWorkPackage', 'WorkPackage1', WorkPackageType.WP_BASE, 'miles', RoleType.MANAGER);
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'miles');
        // Add a new WP...
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'miles');
        server.call('testWorkPackages.addNewWorkPackage', 'miles', RoleType.MANAGER, WorkPackageType.WP_BASE);
        server.call('testWorkPackages.selectWorkPackage', DefaultItemNames.NEW_WORK_PACKAGE_NAME, 'miles');
        server.call('testWorkPackages.updateWorkPackageName', 'WorkPackage2', RoleType.MANAGER, 'miles');

        // Execute - add Scenario3 in scope for WorkPackage2
        server.call('testWorkPackages.editWorkPackage', 'WorkPackage2', WorkPackageType.WP_BASE, 'miles', RoleType.MANAGER);
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', 'WorkPackage2',  ComponentType.SCENARIO, 'Actions', 'Scenario3', 'miles');

        // Verify - Scenario3 should be in scope for WP1 but not WP2
        server.call('verifyWorkPackageComponents.componentIsInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'miles');
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage2', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'miles');

        // And F2 Actions, Feature2, Section2, Application1 should not be in Parent Scope for WP2
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage2', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'miles');
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage2', ComponentType.FEATURE, 'Section2', 'Feature2', 'miles');
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage2', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'miles');
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage2', ComponentType.APPLICATION, 'NONE', 'Application1', 'miles');
    });


    // Consequences
    it('When a Design Component is added to an Initial Design Version Work Package Scope its parents are also added to the Scope');

});

describe('UC 231 - Add Design Component to Scope - Design Update', function(){

    before(function(){

    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });


    // Interface
    it('A Design Update Work Package Scope pane shows all Design Update Components for the Design Update');


    // Actions
    it('A Manager can add all non-scoped Scenarios for an Application in a Design Update to a Work Package Scope');

    it('A Manager can add all non-scoped Scenarios for a Design Section in a Design Update to a Work Package Scope');

    it('A Manager can add all non-scoped Scenarios for a Feature in a Design Update to a Work Package Scope');

    it('A Manager can add all non-scoped Scenarios for a Feature Aspect in a Design Update to a Work Package Scope');

    it('A Manager can add a non-scoped Scenario in a Design Update to a Work Package Scope');


    // Conditions
    it('Design Components cannot be added to Design Update Work Package Scope in View Only mode');

    it('Any Scenario child of the Scope selection already in Scope for another Work Package for the same Base Design Version is not added to a Design Update Work Package Scope');

    it('An individual Scenario cannot be added to a Work Package Scope if it is in Scope for another Design Update Work Package for the same Base Design Version');


    // Consequences
    it('When a Design Component is added to an Design Update Work Package Scope its parents are also added to the Scope');

});

