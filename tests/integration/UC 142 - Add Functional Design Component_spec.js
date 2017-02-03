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


    // Actions
    it('An Application may be added to a Design Version', function() {

        // Setup
        // Edit the default Design Version
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');

        // Execute
        // Add an Application
        DesignComponentActions.designerAddApplication();

        // Verify
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Design1', 'DesignVersion1', 'NONE'));
    });

    it('A Feature may be added to a Design Section', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');

        // Execute
        // Add a Feature
        DesignComponentActions.designerAddFeatureToSection_('Section1');

        // Verify
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Design1', 'DesignVersion1', 'Section1'));
    });

    it('A Scenario may be added to a Feature', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');

        // Execute
        // Add a Scenario
        DesignComponentActions.designerAddScenarioToFeature('Feature1');

        // Verify
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'Design1', 'DesignVersion1', 'Feature1'));
    });


    it('A Scenario may be added to a Feature Aspect', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');

        // Execute
        // Add a Scenario
        DesignComponentActions.designerAddScenarioToFeatureAspect('Feature1', 'Actions');

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
        // Manager add a WP
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerAddsBaseDesignWorkPackage();
        WorkPackageActions.managerSelectsWorkPackage(DefaultItemNames.NEW_WORK_PACKAGE_NAME);
        WorkPackageActions.managerUpdatesSelectedWpNameTo('WorkPackage1');
        WorkPackageActions.managerEditsSelectedBaseWorkPackage();
        // And add Section1 to it
        WpComponentActions.managerAddsDesignSectionToScopeForCurrentBaseWp('Application1', 'Section1');
        // Check on Scenarios in WP Scope
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));

        // Execute - designer adds Scenario3 to Feature1 Actions
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        DesignComponentActions.designerAddScenarioToFeatureAspect('Feature1', 'Actions');
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.SCENARIO, 'Actions', DefaultComponentNames.NEW_SCENARIO_NAME);
        DesignComponentActions.designerEditSelectedComponentNameTo_('Scenario3');

        // Verify - Scenario3 now in WP1 not in scope
        DesignActions.managerWorksOnDesign('Design1');
        DesignVerifications.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.managerEditsSelectedBaseWorkPackage();
        expect(WpComponentVerifications.componentExistsForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
    });

});
