
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

describe('UC 232 - Remove Design Component from Scope - Initial Design Version', function(){

    before(function(){

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
        WpComponentActions.managerAddsApplicationToScopeForCurrentBaseWp('Application1');
    });

    afterEach(function(){

    });


    // Actions
    it('A Manager can remove all in-scope Scenarios for an Application in an Initial Design Version from a Work Package Scope', function(){

        // Setup - verify all in scope
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

        // Execute
        WpComponentActions.managerRemovesApplicationFromScopeForCurrentBaseWp('Application1');

        // Verify - everything not in scope
        // Application1 is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
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
        // Section2 is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        // Feature2 is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        // Feature2 Actions out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        // Scenario3 is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        // Feature2 Conditions is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        // Scenario4 is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });

    it('A Manager can remove all in-scope Scenarios for a Design Section in an Initial Design Version from a Work Package Scope', function(){

        // Setup - verify all in scope
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
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        // Feature2 Conditions is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        // Scenario4 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // Execute
        WpComponentActions.managerRemovesDesignSectionFromScopeForCurrentBaseWp('Application1', 'Section1');

        // Verify - everything in Section1 is out of scope - rest still in
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
        // Feature2 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        // Feature2 Actions is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        // Scenario3 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        // Feature2 Conditions is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        // Scenario4 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });

    it('A Manager can remove all in-scope Scenarios for a Feature in an Initial Design Version from a Work Package Scope', function(){

        // Setup - verify all in scope
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
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        // Feature2 Conditions is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        // Scenario4 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // Execute
        WpComponentActions.managerRemovesFeatureFromScopeForCurrentBaseWp('Section1', 'Feature1');

        // Verify - everything in Feature1 is out of scope - rest still in
        // Application1 is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        // Section1 is out of scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
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
        // Feature2 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        // Feature2 Actions is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        // Scenario3 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        // Feature2 Conditions is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        // Scenario4 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });

    it('A Manager can remove all in-scope Scenarios for a Feature Aspect in an Initial Design Version from a Work Package Scope', function(){

        // Setup - verify all in scope
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
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        // Feature2 Conditions is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        // Scenario4 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // Execute
        WpComponentActions.managerRemovesFeatureAspectFromScopeForCurrentBaseWp('Feature1', 'Actions');

        // Verify - everything in Feature1 Actions is out of scope - rest still in
        // Application1 is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        // Section1 is out of scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        // Feature1 is out of scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        // Feature1 Actions is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        // Scenario1 is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        // Feature1 Conditions is out of scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        // Scenario2 is out of scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        // Section2 is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        // Feature2 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        // Feature2 Actions is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        // Scenario3 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        // Feature2 Conditions is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        // Scenario4 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });

    it('A Manager can remove an in-scope Scenario in an Initial Design Version from a Work Package Scope', function(){

        // Setup - verify all in scope
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
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        // Feature2 Conditions is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        // Scenario4 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // Execute
        WpComponentActions.managerRemovesScenarioFromScopeForCurrentBaseWp('Actions', 'Scenario1');

        // Verify - Scenario1 is out of scope - rest still in
        // Application1 is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        // Section1 is out of scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        // Feature1 is out of scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        // Feature1 Actions is out of scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        // Scenario1 is out of scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        // Feature1 Conditions is out of scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        // Scenario2 is out of scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        // Section2 is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        // Feature2 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
        // Feature2 Actions is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        // Scenario3 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        // Feature2 Conditions is in parent scope
        expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        // Scenario4 is in scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
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
