import {RoleType, ViewMode, ComponentType, WorkPackageType, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 232 - Remove Design Component from Scope - Initial Design Version', function(){

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
        // Add Basic Data to the Design Version
        server.call('testDesigns.editDesignVersion', 'Design1', 'DesignVersion1', 'gloria', RoleType.DESIGNER);
        server.call('testFixtures.AddBasicDesignData', 'Design1', 'DesignVersion1');
        // Add A Work Package
        server.call('testDesigns.selectDesign', 'Design1', 'miles');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'miles');
        server.call('testWorkPackages.addNewWorkPackage', 'miles', RoleType.MANAGER, WorkPackageType.WP_BASE);
        server.call('testWorkPackages.selectWorkPackage', DefaultItemNames.NEW_WORK_PACKAGE_NAME, 'miles');
        server.call('testWorkPackages.updateWorkPackageName', 'WorkPackage1', RoleType.MANAGER, 'miles');
        // Scope everything
        server.call('testWorkPackages.editWorkPackage', 'WorkPackage1', WorkPackageType.WP_BASE, 'miles', RoleType.MANAGER);
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', 'WorkPackage1', ComponentType.APPLICATION, 'NONE', 'Application1', 'miles');
    });

    afterEach(function(){

    });


    // Actions
    it('A Manager can remove all in-scope Scenarios for an Application in an Initial Design Version from a Work Package Scope', function(){

        // Setup - verify all in scope
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

        // Execute
        server.call('testWorkPackageComponents.toggleInitialWpComponentOutScope', 'WorkPackage1', ComponentType.APPLICATION, 'NONE', 'Application1', 'miles');

        // Verify - everything not in scope
        // Application1 is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.APPLICATION, 'NONE', 'Application1', 'miles');
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
        // Section2 is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'miles');
        // Feature2 is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.FEATURE, 'Section2', 'Feature2', 'miles');
        // Feature2 Actions out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'miles');
        // Scenario3 is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'miles');
        // Feature2 Conditions is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'miles');
        // Scenario4 is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'miles');
    });

    it('A Manager can remove all in-scope Scenarios for a Design Section in an Initial Design Version from a Work Package Scope', function(){

        // Setup - verify all in scope
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

        // Execute
        server.call('testWorkPackageComponents.toggleInitialWpComponentOutScope', 'WorkPackage1', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'miles');

        // Verify - everything in Section1 is out of scope - rest still in
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

    it('A Manager can remove all in-scope Scenarios for a Feature in an Initial Design Version from a Work Package Scope', function(){

        // Setup - verify all in scope
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

        // Execute
        server.call('testWorkPackageComponents.toggleInitialWpComponentOutScope', 'WorkPackage1', ComponentType.FEATURE, 'Section1', 'Feature1', 'miles');

        // Verify - everything in Feature1 is out of scope - rest still in
        // Application1 is in parent scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.APPLICATION, 'NONE', 'Application1', 'miles');
        // Section1 is out of scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'miles');
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

    it('A Manager can remove all in-scope Scenarios for a Feature Aspect in an Initial Design Version from a Work Package Scope', function(){

        // Setup - verify all in scope
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

        // Execute
        server.call('testWorkPackageComponents.toggleInitialWpComponentOutScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'miles');

        // Verify - everything in Feature1 Actions is out of scope - rest still in
        // Application1 is in parent scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.APPLICATION, 'NONE', 'Application1', 'miles');
        // Section1 is out of scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'miles');
        // Feature1 is out of scope
        server.call('verifyWorkPackageComponents.componentIsInScope', 'WorkPackage1', ComponentType.FEATURE, 'Section1', 'Feature1', 'miles');
        // Feature1 Actions is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'miles');
        // Scenario1 is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'miles');
        // Feature1 Conditions is out of scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'miles');
        // Scenario2 is out of scope
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

    it('A Manager can remove an in-scope Scenario in an Initial Design Version from a Work Package Scope', function(){

        // Setup - verify all in scope
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

        // Execute
        server.call('testWorkPackageComponents.toggleInitialWpComponentOutScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Actions', 'Scenario1', 'miles');

        // Verify - Scenario1 is out of scope - rest still in
        // Application1 is in parent scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.APPLICATION, 'NONE', 'Application1', 'miles');
        // Section1 is out of scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'miles');
        // Feature1 is out of scope
        server.call('verifyWorkPackageComponents.componentIsInScope', 'WorkPackage1', ComponentType.FEATURE, 'Section1', 'Feature1', 'miles');
        // Feature1 Actions is out of scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'miles');
        // Scenario1 is out of scope
        server.call('verifyWorkPackageComponents.componentIsNotInScope', 'WorkPackage1', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'miles');
        // Feature1 Conditions is out of scope
        server.call('verifyWorkPackageComponents.componentIsInParentScope', 'WorkPackage1', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'miles');
        // Scenario2 is out of scope
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


    // Conditions
    it('Design Components cannot be removed from Initial Design Version Work Package Scope in View Only mode');


    // Consequences
    it('When a Design Component is removed from Initial Design Version Work Package Scope any parent Design Components that no longer have any child Scenarios are also removed from Scope');

});

describe('UC 232 - Remove Design Component from Scope - Design Update', function(){

    before(function(){

    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });


    // Actions
    it('A Manager can remove all in-scope Scenarios for an Application in a Design Update from a Work Package Scope');

    it('A Manager can remove all in-scope Scenarios for a Design Section in a Design Update from a Work Package Scope');

    it('A Manager can remove all in-scope Scenarios for a Feature in a Design Update from a Work Package Scope');

    it('A Manager can remove all in-scope Scenarios for a Feature Aspect in a Design Update from a Work Package Scope');

    it('A Manager can remove an in-scope Scenario in a Design Update from a Work Package Scope');



    // Conditions
    it('Design Components cannot be removed from Design Update Work Package Scope in View Only mode');


    // Consequences
    it('When a Design Component is removed from Design Update Work Package Scope any parent Design Components that no longer have any child Scenarios are also removed from Scope');

});
