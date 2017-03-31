
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

describe('UC 232 - Remove Design Component from Work Package Scope - Initial Design Version', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 232 - Remove Design Component from Work Package Scope - Initial Design Version');
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

        // Add new Base WP - published
        WorkPackageActions.managerAddsBaseDesignWorkPackage();
        WorkPackageActions.managerSelectsWorkPackage(DefaultItemNames.NEW_WORK_PACKAGE_NAME);
        WorkPackageActions.managerUpdatesSelectedWpNameTo('WorkPackage1');
        
        // Add Application1 in scope
        WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage1');
        WpComponentActions.managerAddsApplicationToScopeForCurrentWp('Application1');
    });

    afterEach(function(){

    });


    // Actions
    it('A Manager can remove all in-scope Scenarios for an Application in an Initial Design Version from a Work Package Scope', function(){

        // Setup - verify all in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3',));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // Execute
        WpComponentActions.managerRemovesApplicationFromScopeForCurrentWp('Application1');

        // Verify - everything not in scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });

    it('A Manager can remove all in-scope Scenarios for a Design Section in an Initial Design Version from a Work Package Scope', function(){

        // Setup - verify all in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3',));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // Execute
        WpComponentActions.managerRemovesDesignSectionFromScopeForCurrentWp('Application1', 'Section1');

        // Verify - everything in Section1 is out of scope - rest still in
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));

        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });

    it('A Manager can remove all in-scope Scenarios for a Feature in an Initial Design Version from a Work Package Scope', function(){

        // Setup - verify all in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3',));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // Execute
        WpComponentActions.managerRemovesFeatureFromScopeForCurrentWp('Section1', 'Feature1');

        // Verify - everything in Feature1 is out of scope - rest still in
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));

        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });

    it('A Manager can remove all in-scope Scenarios for a Feature Aspect in an Initial Design Version from a Work Package Scope', function(){

        // Setup - verify all in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3',));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // Execute
        WpComponentActions.managerRemovesFeatureAspectFromScopeForCurrenWp('Feature1', 'Actions');

        // Verify - everything in Feature1 Actions is out of scope - rest still in
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));

        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });

    it('A Manager can remove an in-scope Scenario in an Initial Design Version from a Work Package Scope', function(){

        // Setup - verify all in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3',));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // Execute
        WpComponentActions.managerRemovesScenarioFromScopeForCurrentWp('Actions', 'Scenario1');

        // Verify - Scenario1 is out of scope.  Actions is still in scope because of Scenario 7
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));

        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario7'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });


    // Consequences
    it('When a Design Component is removed from Initial Design Version Work Package Scope any parent Design Components that no longer have any child Scenarios are also removed from Scope', function(){
        // This is actually tessted by above tests
    });

});

describe('UC 232 - Remove Design Component from Work Package Scope - Design Update', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 232 - Remove Design Component from Work Package Scope - Design Update');

    });

    after(function(){

    });

    beforeEach(function(){

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();

        // Designer Publish DesignVersion1 and create a new updatable DV DesignVersion2
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2');

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

        // Add the whole of Application1 to the WP scope
        WorkPackageActions.managerEditsUpdateWorkPackage('UpdateWorkPackage1');
        WpComponentActions.managerAddsApplicationToScopeForCurrentWp('Application1');

    });

    afterEach(function(){

    });


    // Actions
    it('A Manager can remove all in-scope Scenarios for an Application in a Design Update from a Work Package Scope', function(){

        // Setup - verify start position

        // Actual Scoped Items - included Feature and Scenario items that were in DU scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'NewScenario'));


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

        // Execute
        WpComponentActions.managerRemovesApplicationFromScopeForCurrentWp('Application1');

        // Verify - nothing now in scope

        // Actual Scoped Items - included Feature and Scenario items that were in DU scope

        // Parents of Scoped Items

        // Available but not scoped
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'NewScenario'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));

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

    it('A Manager can remove all in-scope Scenarios for a Design Section in a Design Update from a Work Package Scope', function(){

        // Setup - verify start position
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

        // Execute
        WpComponentActions.managerRemovesDesignSectionFromScopeForCurrentWp('Application1', 'Section1');

        // Verify
        // Actual Scoped Items - included Feature and Scenario items that were in DU scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'NewScenario'));

        // Parents of Scoped Items
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));

        // Available but not scoped
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));

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

    it('A Manager can remove all in-scope Scenarios for a Feature in a Design Update from a Work Package Scope', function(){

        // Setup - verify start position
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

        // Execute
        WpComponentActions.managerRemovesFeatureFromScopeForCurrentWp('Section2', 'Feature2');

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
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'NewScenario'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));

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

    it('A Manager can remove all in-scope Scenarios for a Feature Aspect in a Design Update from a Work Package Scope', function(){

        // Setup - verify start position
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

        // Execute
        WpComponentActions.managerRemovesFeatureAspectFromScopeForCurrentWp('Feature1', 'Actions');

        // Verify
        // Actual Scoped Items - included Feature and Scenario items that were in DU scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'NewScenario'));

        // Parents of Scoped Items
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));

        // Available but not scoped
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));

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

    it('A Manager can remove an in-scope Scenario in a Design Update from a Work Package Scope', function(){

        // Setup - verify start position
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

        // Execute
        WpComponentActions.managerRemovesScenarioFromScopeForCurrentWp('Actions', 'NewScenario');

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

        // Available but not scoped - Feature 2 is removed because no scenarios remaining in it
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'NewScenario'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));

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


    // Consequences
    it('When a Design Component is removed from Design Update Work Package Scope any parent Design Components that no longer have any child Scenarios are also removed from Scope', function(){
        // This is actually tested by above tests
    });

});
