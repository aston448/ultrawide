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

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 142 - Add Functional Design Component', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 142 - Add Functional Design Component');
    });

    after(function(){

    });

    beforeEach(function(){

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();
    });

    afterEach(function(){

    });


    it('A Feature may be added to a Design Section', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');

        // Execute
        // Add a Feature
        DesignComponentActions.designerAddsFeatureToSection_('Section1');

        // Verify
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Design1', 'DesignVersion1', 'Section1'));
    });


    it('A Scenario may be added to a Feature Aspect', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');

        // Execute
        // Add a Scenario
        DesignComponentActions.designerAddsScenarioToFeatureAspect('Feature1', 'Actions');

        // Verify
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'Design1', 'DesignVersion1', 'Actions'));
    });


    // Consequences
    it('Adding a functional component to a base Design Version makes it available in any Work Packages based on that version', function(){

        // Setup
        // Publish DV1
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        // Add 2 work packages
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerAddsBaseDesignWorkPackage();
        WorkPackageActions.managerSelectsWorkPackage(DefaultItemNames.NEW_WORK_PACKAGE_NAME);
        WorkPackageActions.managerUpdatesSelectedWpNameTo('WorkPackage1');
        WorkPackageActions.managerAddsBaseDesignWorkPackage();
        WorkPackageActions.managerSelectsWorkPackage(DefaultItemNames.NEW_WORK_PACKAGE_NAME);
        WorkPackageActions.managerUpdatesSelectedWpNameTo('WorkPackage2');

        // Execute - designer adds Feature3 to Section1
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
        DesignComponentActions.designerAddsFeatureToSection_Called('Section1', 'Feature3');

        // Verify - Feature3 now in WP1 and WP2 and not in scope
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.managerEditsSelectedBaseWorkPackage();
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature3'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature3'));

        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerSelectsWorkPackage('WorkPackage2');
        WorkPackageActions.managerEditsSelectedBaseWorkPackage();
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature3'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature3'));
    });

    it('A Scenario added to a Feature Aspect in scope in a Work Package becomes in scope in that Work Package', function(){

        // Setup
        // Publish DV1
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        // Add 2 work packages
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerAddsBaseDesignWorkPackage();
        WorkPackageActions.managerSelectsWorkPackage(DefaultItemNames.NEW_WORK_PACKAGE_NAME);
        WorkPackageActions.managerUpdatesSelectedWpNameTo('WorkPackage1');
        WorkPackageActions.managerAddsBaseDesignWorkPackage();
        WorkPackageActions.managerSelectsWorkPackage(DefaultItemNames.NEW_WORK_PACKAGE_NAME);
        WorkPackageActions.managerUpdatesSelectedWpNameTo('WorkPackage2');

        // Put Feature1 Actions in Scope for WP1
        WorkPackageActions.managerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.managerEditsSelectedBaseWorkPackage();
        WpComponentActions.managerAddsFeatureAspectToScopeForCurrentWp('Feature1', 'Actions');

        // Execute - designer adds Scenario5 to Feature1 Actions
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
        DesignComponentActions.designerAddsScenarioToFeatureAspect('Feature1', 'Actions');
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.SCENARIO, 'Actions', DefaultComponentNames.NEW_SCENARIO_NAME);
        DesignComponentActions.designerEditsSelectedComponentNameTo_('Scenario5');

        // Verify - Scenario5 now in WP1 and WP2 and in scope for WP1 only
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.managerEditsSelectedBaseWorkPackage();
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario5'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario5'));

        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerSelectsWorkPackage('WorkPackage2');
        WorkPackageActions.managerEditsSelectedBaseWorkPackage();
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario5'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario5'));
    })

});
