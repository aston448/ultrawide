
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
import WpComponentActions           from '../../test_framework/test_wrappers/work_package_component_actions.js';
import WpComponentVerifications     from '../../test_framework/test_wrappers/work_package_component_verifications.js';

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';
import {WorkPackageComponentValidationErrors} from '../../imports/constants/validation_errors.js'

describe('UC 231 - Add Design Component to Work Package Scope - Initial Design Version', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 231 - Add Design Component to Work Package Scope - Initial Design Version');
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

        // Add new Base WP
        WorkPackageActions.managerAddsBaseDesignWorkPackage();
        WorkPackageActions.managerSelectsWorkPackage(DefaultItemNames.NEW_WORK_PACKAGE_NAME);
        WorkPackageActions.managerUpdatesSelectedWpNameTo('WorkPackage2');
    });

    afterEach(function(){

    });


    // Interface
    it('An Initial Design Version Work Package Scope pane shows all Design Components for the Design Version', function(){

        // We have an Initial Design Version with an App, Design Sections, Features and Scenarios - check that they all exist in the scope

        // Setup - open the WP for view
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerViewsBaseWorkPackage('WorkPackage1');

        // Verify
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

    });


    // Actions
    it('A Manager can add all non-scoped Scenarios for an Application in an Initial Design Version to a Work Package Scope', function(){

        // Setup - edit the WP
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage1');

        // Execute - toggle Application1 in scope
        WpComponentActions.managerAddsApplicationToScopeForCurrentBaseWp('Application1');

        // Verify
        // Application1 is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        // Section1 is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        // Feature1 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        // Feature1 Actions is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        // Scenario1 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        // Feature1 Conditions is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        // Scenario2 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        // Section2 is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        // Feature2 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        // Feature2 Actions is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        // Scenario3 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3',));
        // Feature2 Conditions is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        // Scenario4 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });

    it('A Manager can add all non-scoped Scenarios for a Design Section in an Initial Design Version to a Work Package Scope', function(){

        // Setup - edit the WP
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage1');

        // Execute - toggle Section1 in scope
        WpComponentActions.managerAddsDesignSectionToScopeForCurrentBaseWp('Application1', 'Section1');

        // Verify
        // Application1 is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        // Section1 is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        // Feature1 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        // Feature1 Actions is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        // Scenario1 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        // Feature1 Conditions is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        // Scenario2 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        // Section2 is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        // Feature2 is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        // Feature2 Actions is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        // Scenario3 is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        // Feature2 Conditions is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        // Scenario4 is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });

    it('A Manager can add all non-scoped Scenarios for a Feature in an Initial Design Version to a Work Package Scope', function(){

        // Setup - edit the WP
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage1');

        // Execute - toggle Feature1 in scope
        WpComponentActions.managerAddsFeatureToScopeForCurrentBaseWp('Section1', 'Feature1');

        // Verify
        // Application1 is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        // Section1 is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        // Feature1 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        // Feature1 Actions is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        // Scenario1 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        // Feature1 Conditions is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        // Scenario2 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        // Section2 is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        // Feature2 is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        // Feature2 Actions is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        // Scenario3 is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        // Feature2 Conditions is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        // Scenario4 is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });

    it('A Manager can add all non-scoped Scenarios for a Feature Aspect in an Initial Design Version to a Work Package Scope', function(){

        // Setup - edit the WP
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage1');

        // Execute - toggle Feature1 Actions in scope
        WpComponentActions.managerAddsFeatureAspectToScopeForCurrentBaseWp('Feature1', 'Actions');

        // Verify
        // Application1 is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        // Section1 is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        // Feature1 is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        // Feature1 Actions is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        // Scenario1 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        // Feature1 Conditions is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        // Scenario2 is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        // Section2 is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        // Feature2 is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        // Feature2 Actions is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        // Scenario3 is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        // Feature2 Conditions is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        // Scenario4 is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });

    it('A Manager can add a non-scoped Scenario in an Initial Design Version to a Work Package Scope', function(){

        // Setup - edit the WP
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage1');

        // Execute - toggle Scenario3 in scope
        WpComponentActions.managerAddsScenarioToScopeForCurrentBaseWp('Actions', 'Scenario3');

        // Verify
        // Application1 is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        // Section1 is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        // Feature1 is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        // Feature1 Actions is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        // Scenario1 is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        // Feature1 Conditions is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        // Scenario2 is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        // Section2 is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        // Feature2 is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        // Feature2 Actions in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        // Scenario3 is in Scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        // Feature2 Conditions is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        // Scenario4 is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });


    // Conditions
    it('Any Scenario child of the Scope selection already in Scope for another Work Package for the same Initial Design Version is not added to a Work Package Scope', function(){

        // Setup - add Scenario3 to WP 1 scope
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage1');
        WpComponentActions.managerAddsScenarioToScopeForCurrentBaseWp('Actions', 'Scenario3');

        // Execute - add everything below Application1 in scope for WorkPackage2
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage2');
        WpComponentActions.managerAddsApplicationToScopeForCurrentBaseWp('Application1');

        // Verify - Scenarios 1, 2 and 4 should be in scope but not 3
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // Feature2 should be in scope for both WPs but as parent only for WP1
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage1');
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));

    });

    it('An individual Scenario cannot be added to a Work Package Scope if it is in Scope for another Work Package for the same Initial Design Version', function(){

        // Setup - add Scenario3 to WP 1 scope
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage1');
        WpComponentActions.managerAddsScenarioToScopeForCurrentBaseWp('Actions', 'Scenario3');

        // Execute - add Scenario3 in scope for WorkPackage2
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage2');
        const expectation = {success: false, message: WorkPackageComponentValidationErrors.WORK_PACKAGE_COMPONENT_ALREADY_IN_SCOPE};
        WpComponentActions.managerAddsScenarioToScopeForCurrentBaseWp('Actions', 'Scenario3', expectation);

        // Verify - Scenario3 should be in scope for WP1 but not WP2
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage1');
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage2');
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));

        // And F2 Actions, Feature2, Section2, Application1 should not be in Parent Scope for WP2
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
    });


    // Consequences
    it('When a Design Component is added to an Initial Design Version Work Package Scope its parents are also added to the Scope', function() {

        // Setup - edit the WP
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage1');

        // Execute - toggle Scenario3 in scope
        WpComponentActions.managerAddsScenarioToScopeForCurrentBaseWp('Actions', 'Scenario3');

        // Verify
        // Application1 is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        // Section2 is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        // Feature2 is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        // Feature2 Actions in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));

    });

});

describe('UC 231 - Add Design Component to Work Package Scope - Design Update', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 231 - Add Design Component to Work Package Scope - Design Update');
        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();

        // Designer Publish DesignVersion1 and create a new updatable DV DesignVersion2
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2');

    });

    after(function(){

    });

    beforeEach(function(){

        TestFixtures.clearWorkPackages();
        TestFixtures.clearDesignUpdates();

        // Add update to the updatable DV
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');

        // The update is to Feature1 Scenarios 1 and 2 and to Feature2 - a new Scenario in Actions
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Conditions', 'Scenario2');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section2', 'Feature2');
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature2', 'Actions');
        UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature2', 'Actions', 'NewScenario');
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');

        // And add a new Update WP
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerAddsUpdateWorkPackage();
        WorkPackageActions.managerSelectsWorkPackage(DefaultItemNames.NEW_WORK_PACKAGE_NAME);
        WorkPackageActions.managerUpdatesSelectedWpNameTo('UpdateWorkPackage1');

    });

    afterEach(function(){

    });


    // Interface
    it('A Design Update Work Package Scope pane shows all in scope Features and Scenarios for the Design Update and their parent components', function(){

        // Setup - open the WP for view
        WorkPackageActions.managerViewsUpdateWorkPackage('UpdateWorkPackage1');

        // Verify - WP potential scope contains Scenario1 and 2 plus their parents and the new Feature 2 scenario and its parents
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'NewScenario'));

        // But does not contain other items
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Section1', 'SubSection1'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Interface'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Consequences'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'ExtraAspect'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario7'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Section2', 'SubSection2'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Interface'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Consequences'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });


    // Actions
    it('A Manager can add all non-scoped Scenarios for an Application in a Design Update to a Work Package Scope', function(){

        // In these tests when stuff is added to the WP scope it is in scope for the WP if it was a Feature or Scenario in scope in the DU and parent scope only if a parent of
        // an item that is in scope.  Adding a higher level item includes all DU in scope items below it as in scope

        // Setup - edit WP
        WorkPackageActions.managerEditsUpdateWorkPackage('UpdateWorkPackage1');

        // Execute - Add Application1 to scope
        WpComponentActions.managerAddsApplicationToScopeForCurrentUpdateWp('Application1');

        // Verify

        // Actual Scoped Items - included Feature and Scenario items that were in DU scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'NewScenario'));

        // Parents of Scoped Items
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));

        // Available but not scoped

        // Not Available
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Section1', 'SubSection1'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Interface'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Consequences'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'ExtraAspect'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario7'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Section2', 'SubSection2'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Interface'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Consequences'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));



    });

    it('A Manager can add all non-scoped Scenarios for a Design Section in a Design Update to a Work Package Scope', function(){

        // Setup - edit WP
        WorkPackageActions.managerEditsUpdateWorkPackage('UpdateWorkPackage1');

        // Execute - Add Application1 to scope
        WpComponentActions.managerAddsDesignSectionToScopeForCurrentUpdateWp('Application1', 'Section2');

        // Verify - Just Feature2 + New Scenario and its parents in scope

        // Actual Scoped Items - included Feature and Scenario items that were in DU scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'NewScenario'));

        // Parents of Scoped Items
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));

        // Available but not scoped
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));

        // Not Available
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Section1', 'SubSection1'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Interface'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Consequences'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'ExtraAspect'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario7'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Section2', 'SubSection2'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Interface'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Consequences'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });

    it('A Manager can add all non-scoped Scenarios for a Feature in a Design Update to a Work Package Scope', function(){

        // Setup - edit WP
        WorkPackageActions.managerEditsUpdateWorkPackage('UpdateWorkPackage1');

        // Execute - Add Feature1 to scope
        WpComponentActions.managerAddsFeatureToScopeForCurrentUpdateWp('Section1', 'Feature1');

        // Verify

        // Actual Scoped Items - included Feature and Scenario items that were in DU scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));

        // Parents of Scoped Items
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));

        // Available but not scoped
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'NewScenario'));

        // Not Available
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Section1', 'SubSection1'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Interface'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Consequences'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'ExtraAspect'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario7'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Section2', 'SubSection2'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Interface'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Consequences'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });

    it('A Manager can add all non-scoped Scenarios for a Feature Aspect in a Design Update to a Work Package Scope', function(){

        // Setup - edit WP
        WorkPackageActions.managerEditsUpdateWorkPackage('UpdateWorkPackage1');

        // Execute - Add Feature2 Actions to scope
        WpComponentActions.managerAddsFeatureAspectToScopeForCurrentUpdateWp('Feature2', 'Actions');

        // Verify

        // Actual Scoped Items - included Feature and Scenario items that were in DU scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'NewScenario'));

        // Parents of Scoped Items
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));

        // Available but not scoped
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));

        // Not Available
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Section1', 'SubSection1'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Interface'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Consequences'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'ExtraAspect'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario7'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Section2', 'SubSection2'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Interface'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Consequences'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });

    it('A Manager can add a non-scoped Scenario in a Design Update to a Work Package Scope', function(){

        // Setup - edit WP
        WorkPackageActions.managerEditsUpdateWorkPackage('UpdateWorkPackage1');

        // Execute - Add Feature2 Actions to scope
        WpComponentActions.managerAddsScenarioToScopeForCurrentUpdateWp('Actions', 'NewScenario');

        // Verify

        // Actual Scoped Items - included Feature and Scenario items that were in DU scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'NewScenario'));

        // Parents of Scoped Items
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));

        // Available but not scoped
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));

        // Not Available
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Section1', 'SubSection1'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Interface'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Consequences'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'ExtraAspect'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario7'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Section2', 'SubSection2'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Interface'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Consequences'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });


    // Conditions

    it('Any Scenario child of the Scope selection already in Scope for another Work Package for the same Base Design Version is not added to a Design Update Work Package Scope', function(){

        // Setup
        // Add another WP based on the update
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerAddsUpdateWorkPackage();
        WorkPackageActions.managerSelectsWorkPackage(DefaultItemNames.NEW_WORK_PACKAGE_NAME);
        WorkPackageActions.managerUpdatesSelectedWpNameTo('UpdateWorkPackage2');

        // Put Scenario1 in scope for the new WP
        WorkPackageActions.managerEditsUpdateWorkPackage('UpdateWorkPackage2');
        WpComponentActions.managerAddsScenarioToScopeForCurrentUpdateWp('Actions', 'Scenario1');

        // Execute - add Feature1 to the scope for the original WP
        WorkPackageActions.managerEditsUpdateWorkPackage('UpdateWorkPackage1');
        WpComponentActions.managerAddsFeatureToScopeForCurrentUpdateWp('Section1', 'Feature1');

        // Verify - Scenario1 not in scope in original WP but Scenario2 is

        // Actual Scoped Items - included Feature and Scenario items that were in DU scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));

        // Parents of Scoped Items
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));

        // Available but not scoped
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'NewScenario'));

        // Not Available
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Section1', 'SubSection1'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Interface'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Consequences'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'ExtraAspect'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario7'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Section2', 'SubSection2'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Interface'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Consequences'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // Check - Scenario1 is in scope for new WP
        WorkPackageActions.managerEditsUpdateWorkPackage('UpdateWorkPackage2');
        // Scenario1 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));

    });

    it('An individual Scenario cannot be added to a Work Package Scope if it is in Scope for another Design Update Work Package for the same Base Design Version', function(){

        // Setup
        // Add another WP based on the update
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerAddsUpdateWorkPackage();
        WorkPackageActions.managerSelectsWorkPackage(DefaultItemNames.NEW_WORK_PACKAGE_NAME);
        WorkPackageActions.managerUpdatesSelectedWpNameTo('UpdateWorkPackage2');

        // Put Scenario1 in scope for the new WP
        WorkPackageActions.managerEditsUpdateWorkPackage('UpdateWorkPackage2');
        WpComponentActions.managerAddsScenarioToScopeForCurrentUpdateWp('Actions', 'Scenario1');

        // Execute - add Scenario1 to the scope for the original WP - expect failure
        WorkPackageActions.managerEditsUpdateWorkPackage('UpdateWorkPackage1');
        const expectation = {success: false, message: WorkPackageComponentValidationErrors.WORK_PACKAGE_COMPONENT_ALREADY_IN_SCOPE};
        WpComponentActions.managerAddsScenarioToScopeForCurrentUpdateWp('Actions', 'Scenario1', expectation);

        // Verify - nothing in scope

        // Actual Scoped Items - included Feature and Scenario items that were in DU scope

        // Parents of Scoped Items

        // Available but not scoped
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'NewScenario'));

        // Not Available
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Section1', 'SubSection1'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Interface'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Consequences'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'ExtraAspect'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario7'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Section2', 'SubSection2'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Interface'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Consequences'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // Check - Scenario1 in scope for other WP
        WorkPackageActions.managerEditsUpdateWorkPackage('UpdateWorkPackage2');
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));

    });


    // Consequences
    it('When a Design Component is added to an Design Update Work Package Scope its parents are also added to the Scope', function(){

        // Setup - edit WP
        WorkPackageActions.managerEditsUpdateWorkPackage('UpdateWorkPackage1');

        // Execute - Add  Actions New Scenario to scope
        WpComponentActions.managerAddsScenarioToScopeForCurrentUpdateWp('Actions', 'NewScenario');

        // Verify

        // Parents of Scoped Items
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
    });

});

