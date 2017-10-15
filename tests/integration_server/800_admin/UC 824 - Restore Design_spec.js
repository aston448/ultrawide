import TestFixtures                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import DesignActions                from '../../../test_framework/test_wrappers/design_actions.js';
import DesignVersionActions         from '../../../test_framework/test_wrappers/design_version_actions.js';
import DesignUpdateActions          from '../../../test_framework/test_wrappers/design_update_actions.js';
import UpdateComponentActions       from '../../../test_framework/test_wrappers/design_update_component_actions.js';
import WorkPackageActions           from '../../../test_framework/test_wrappers/work_package_actions.js';
import WpComponentActions           from '../../../test_framework/test_wrappers/work_package_component_actions.js';
import RestoreActions               from '../../../test_framework/test_wrappers/restore_actions.js';
import DesignVerifications          from '../../../test_framework/test_wrappers/design_verifications.js';
import DesignUpdateVerifications    from '../../../test_framework/test_wrappers/design_update_verifications.js';
import DesignVersionVerifications   from '../../../test_framework/test_wrappers/design_version_verifications.js';
import DesignComponentVerifications from '../../../test_framework/test_wrappers/design_component_verifications.js';
import WorkPackageVerifications     from '../../../test_framework/test_wrappers/work_package_verifications.js';
import WpComponentVerifications     from '../../../test_framework/test_wrappers/work_package_component_verifications.js';

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../../imports/constants/default_names.js';
import {UpdateMergeStatus, WorkPackageStatus} from "../../../imports/constants/constants";


// Default Data
//
//  Application1
//      Section1
//          Feature1
//              Interface
//              Actions
//                  Scenario1
//                  Scenario7
//                  ExtraScenario
//              Conditions
//                  Scenario2
//              Consequences
//              ExtraAspect
//          Feature444
//              Interface
//              Actions
//              Conditions
//              Consequences
//          SubSection1
//      Section2
//          Feature2
//              Interface
//              Actions
//                  Scenario3
//              Conditions
//                  Scenario4
//              Consequences
//          SubSection2
//  Application88
//  Application99
//      Section99
//          Feature99



describe('UC 824 - Restore Design', function(){

    before(function(){

        TestFixtures.logTestSuite('UC 824 - Restore Design');

    });

    after(function(){

    });

    beforeEach(function(){

        TestFixtures.clearAllData();
        TestFixtures.clearBackupFiles();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();

    });

    afterEach(function(){

    });


    // Interface
    it('A live Design in the Designs administration list has an option to restore it to a previous backup version');

    it('An archived Design in the Designs administration list has an option to restore it');


    // Actions
    describe('The admin user can restore a live Design to any previous backup version', function(){

        beforeEach(function(){

            TestFixtures.clearAllData();
            TestFixtures.clearBackupFiles();

            // Add  Design1 / DesignVersion1 + basic data
            TestFixtures.addDesignWithDefaultData();

        });

        it('a base design version can be restored', function(){

            DesignActions.designerWorksOnDesign('Design1');

            // Add some work packages to the Design Version ------------------------------------------------------------
            DesignActions.designerWorksOnDesign('Design1');
            DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');

            DesignActions.managerWorksOnDesign('Design1');
            DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
            WorkPackageActions.managerAddsBaseDesignWorkPackageCalled('WorkPackage1');
            WorkPackageActions.managerAddsBaseDesignWorkPackageCalled('WorkPackage2');

            // And add stuff to the WPs
            WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage1');
            WpComponentActions.managerAddsDesignSectionToScopeForCurrentWp('Application1', 'Section1');
            WorkPackageActions.managerPublishesSelectedWorkPackage();

            WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage2');
            WpComponentActions.managerAddsDesignSectionToScopeForCurrentWp('Application1', 'Section2');
            WorkPackageActions.managerPublishesSelectedWorkPackage();


            // Back up the Design --------------------------------------------------------------------------------------
            DesignActions.designerBacksUpDesign('Design1');

            // Simulate losing all the data
            TestFixtures.clearAllDesignData();

            // Restore from backup
            RestoreActions.adminRestoresBackup();

            // Verify we have the expected data ------------------------------------------------------------------------

            // The Design
            expect(DesignVerifications.designExistsCalled('Design1'));
            expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion1'));

            DesignActions.designerWorksOnDesign('Design1');
            DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
            expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion1', DesignVersionStatus.VERSION_DRAFT));

            // The Applications
            expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application1', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application88', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application99', 'Design1', 'DesignVersion1'));

            // The Sections
            expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1', 'Application1'));
            expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section2', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'Section2', 'Design1', 'DesignVersion1', 'Application1'));
            expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section99', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'Section99', 'Design1', 'DesignVersion1', 'Application99'));
            expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'SubSection1', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'SubSection1', 'Design1', 'DesignVersion1', 'Section1'));
            expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'SubSection2', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'SubSection2', 'Design1', 'DesignVersion1', 'Section2'));

            // The Features
            expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion1', 'Section1'));
            expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature2', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, 'Feature2', 'Design1', 'DesignVersion1', 'Section2'));
            expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature99', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, 'Feature99', 'Design1', 'DesignVersion1', 'Section99'));

            // The Feature Aspects
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Interface', 'Feature1', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Actions', 'Feature1', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Conditions', 'Feature1', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Consequences', 'Feature1', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('ExtraAspect', 'Feature1', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Interface', 'Feature444', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Actions', 'Feature444', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Conditions', 'Feature444', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Consequences', 'Feature444', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Interface', 'Feature2', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Actions', 'Feature2', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Conditions', 'Feature2', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Consequences', 'Feature2', 'Design1', 'DesignVersion1'));

            // The Scenarios
            expect(DesignComponentVerifications.scenario_ExistsInFeatureAspect_InDesign_Version_('Scenario1', 'Actions', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.scenario_ExistsInFeatureAspect_InDesign_Version_('Scenario7', 'Actions', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.scenario_ExistsInFeatureAspect_InDesign_Version_('ExtraScenario', 'Actions', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.scenario_ExistsInFeatureAspect_InDesign_Version_('Scenario2', 'Conditions', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.scenario_ExistsInFeatureAspect_InDesign_Version_('Scenario3', 'Actions', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.scenario_ExistsInFeatureAspect_InDesign_Version_('Scenario4', 'Conditions', 'Design1', 'DesignVersion1'));

            // The Work Packages
            DesignActions.managerWorksOnDesign('Design1');
            DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
            expect(WorkPackageVerifications.workPackageExistsForManagerCalled('WorkPackage1'));
            expect(WorkPackageVerifications.workPackageExistsForManagerCalled('WorkPackage2'));

            // The Work Package Content
            WorkPackageActions.managerSelectsWorkPackage('WorkPackage1');
            expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Interface'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Consequences'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario7'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'ExtraScenario'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));

            WorkPackageActions.managerSelectsWorkPackage('WorkPackage2');
            expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Interface'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Consequences'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
        });

        it('an updatable design version with updates can be restored', function(){

            // Add some work packages to the Design Version ------------------------------------------------------------
            DesignActions.designerWorksOnDesign('Design1');
            DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');

            DesignActions.managerWorksOnDesign('Design1');
            DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
            WorkPackageActions.managerAddsBaseDesignWorkPackageCalled('WorkPackage1');
            WorkPackageActions.managerAddsBaseDesignWorkPackageCalled('WorkPackage2');

            // And add stuff to the WPs
            WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage1');
            WpComponentActions.managerAddsDesignSectionToScopeForCurrentWp('Application1', 'Section1');
            WorkPackageActions.managerPublishesSelectedWorkPackage();

            WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage2');
            WpComponentActions.managerAddsDesignSectionToScopeForCurrentWp('Application1', 'Section2');
            WorkPackageActions.managerPublishesSelectedWorkPackage();

            // Create the next design version --------------------------------------------------------------------------
            DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
            DesignVersionActions.designerSelectsDesignVersion(DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
            DesignVersionActions.designerUpdatesDesignVersionNameTo('DesignVersion2');

            // Add a Design Update -------------------------------------------------------------------------------------
            DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');

            // Edit that Update
            DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
            DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
            UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateScope('Application1', 'Section1');
            UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section1', 'Feature3');
            UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature3', 'Actions', 'Scenario8');
            DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');

            // Create Update WorkPackage
            DesignActions.managerWorksOnDesign('Design1');
            DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
            DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
            WorkPackageActions.managerAddsUpdateWorkPackageCalled('UpdateWorkPackage1');
            WorkPackageActions.managerEditsUpdateWorkPackage('UpdateWorkPackage1');
            WpComponentActions.managerAddsFeatureToScopeForCurrentWp('Section1', 'Feature3');
            WorkPackageActions.managerPublishesSelectedWorkPackage();

            // Developer Adopts
            DesignActions.developerWorksOnDesign('Design1');
            DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
            DesignUpdateActions.developerSelectsUpdate('DesignUpdate1');
            WorkPackageActions.developerSelectsWorkPackage('UpdateWorkPackage1');
            WorkPackageActions.developerAdoptsSelectedWorkPackage();

            // Developer Adds a Scenario
            WorkPackageActions.developerDevelopsSelectedWorkPackage();
            WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature3', 'Conditions');
            WpComponentActions.developerAddsScenarioToSelectedFeatureAspect();
            WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.SCENARIO, 'Conditions', DefaultComponentNames.NEW_SCENARIO_NAME);
            WpComponentActions.developerUpdatesSelectedComponentNameTo('Scenario9');

            // Back up the Design --------------------------------------------------------------------------------------
            DesignActions.designerBacksUpDesign('Design1');

            // Simulate losing all the data
            TestFixtures.clearAllDesignData();

            // Restore from backup
            RestoreActions.adminRestoresBackup();

            // Verify we have the expected data ------------------------------------------------------------------------

            // The Design
            expect(DesignVerifications.designExistsCalled('Design1'));

            // The versions
            expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion1'));
            expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion2'));

            DesignActions.designerWorksOnDesign('Design1');
            DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
            expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion1', DesignVersionStatus.VERSION_DRAFT_COMPLETE));

            DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
            expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion2', DesignVersionStatus.VERSION_UPDATABLE));

            // The Applications
            expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application1', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application88', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application99', 'Design1', 'DesignVersion1'));

            // The Sections
            expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1', 'Application1'));
            expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section2', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'Section2', 'Design1', 'DesignVersion1', 'Application1'));
            expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section99', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'Section99', 'Design1', 'DesignVersion1', 'Application99'));
            expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'SubSection1', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'SubSection1', 'Design1', 'DesignVersion1', 'Section1'));
            expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'SubSection2', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'SubSection2', 'Design1', 'DesignVersion1', 'Section2'));

            // The Features
            expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion1', 'Section1'));
            expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature2', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, 'Feature2', 'Design1', 'DesignVersion1', 'Section2'));
            expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature99', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, 'Feature99', 'Design1', 'DesignVersion1', 'Section99'));

            expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature3', 'Design1', 'DesignVersion2'));
            expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, 'Feature3', 'Design1', 'DesignVersion2', 'Section1'));


            // The Feature Aspects
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Interface', 'Feature1', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Actions', 'Feature1', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Conditions', 'Feature1', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Consequences', 'Feature1', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('ExtraAspect', 'Feature1', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Interface', 'Feature444', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Actions', 'Feature444', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Conditions', 'Feature444', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Consequences', 'Feature444', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Interface', 'Feature2', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Actions', 'Feature2', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Conditions', 'Feature2', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Consequences', 'Feature2', 'Design1', 'DesignVersion1'));

            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Interface', 'Feature3', 'Design1', 'DesignVersion2'));
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Actions', 'Feature3', 'Design1', 'DesignVersion2'));
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Conditions', 'Feature3', 'Design1', 'DesignVersion2'));
            expect(DesignComponentVerifications.featureAspect_ExistsInFeature_InDesign_Version_('Consequences', 'Feature3', 'Design1', 'DesignVersion2'));

            // The Scenarios
            expect(DesignComponentVerifications.scenario_ExistsInFeatureAspect_InDesign_Version_('Scenario1', 'Actions', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.scenario_ExistsInFeatureAspect_InDesign_Version_('Scenario7', 'Actions', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.scenario_ExistsInFeatureAspect_InDesign_Version_('ExtraScenario', 'Actions', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.scenario_ExistsInFeatureAspect_InDesign_Version_('Scenario2', 'Conditions', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.scenario_ExistsInFeatureAspect_InDesign_Version_('Scenario3', 'Actions', 'Design1', 'DesignVersion1'));
            expect(DesignComponentVerifications.scenario_ExistsInFeatureAspect_InDesign_Version_('Scenario4', 'Conditions', 'Design1', 'DesignVersion1'));

            expect(DesignComponentVerifications.scenario_ExistsInFeatureAspect_InDesign_Version_('Scenario8', 'Actions', 'Design1', 'DesignVersion2'));
            expect(DesignComponentVerifications.scenario_ExistsInFeatureAspect_InDesign_Version_('Scenario9', 'Conditions', 'Design1', 'DesignVersion2'));

            // The Design Updates
            DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
            expect(DesignUpdateVerifications.updateExistsForDesignerCalled('DesignUpdate1'));
            DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
            expect(DesignUpdateVerifications.updateStatusForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT));
            expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateMergeAction.MERGE_INCLUDE));

            // The Work Packages
            DesignActions.managerWorksOnDesign('Design1');
            DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
            expect(WorkPackageVerifications.workPackageExistsForManagerCalled('WorkPackage1'));
            expect(WorkPackageVerifications.workPackageExistsForManagerCalled('WorkPackage2'));

            DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
            DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
            expect(WorkPackageVerifications.workPackageExistsForManagerCalled('UpdateWorkPackage1'));

            // The Work Package Content
            DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
            WorkPackageActions.managerSelectsWorkPackage('WorkPackage1');
            expect(WorkPackageVerifications.workPackage_StatusForManagerIs('WorkPackage1', WorkPackageStatus.WP_AVAILABLE));
            expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Interface'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Consequences'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario7'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'ExtraScenario'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));

            WorkPackageActions.managerSelectsWorkPackage('WorkPackage2');
            expect(WorkPackageVerifications.workPackage_StatusForManagerIs('WorkPackage2', WorkPackageStatus.WP_AVAILABLE));
            expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section2', 'Feature2'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Interface'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature2', 'Consequences'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

            DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
            DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
            WorkPackageActions.managerSelectsWorkPackage('UpdateWorkPackage1');
            expect(WorkPackageVerifications.workPackage_StatusForManagerIs('UpdateWorkPackage1', WorkPackageStatus.WP_ADOPTED));
            expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
            expect(WpComponentVerifications.componentIsInParentScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature3'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature3', 'Interface'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature3', 'Actions'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature3', 'Conditions'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature3', 'Consequences'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario8'));
            expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Conditions', 'Scenario9'));
        })
    });

    it('The admin user can restore an archived Design to the backup taken when it was archived');

    it('The admin user can import a Design from a backup made in a different instance of Ultrawide');


    // Conditions
    it('Designer, Developer and Manager users cannot restore a Design');

});
