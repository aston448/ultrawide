
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
import UpdateComponentVerifications from '../../test_framework/test_wrappers/design_update_component_verifications.js';

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, UpdateMergeStatus, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';
import {DesignUpdateComponentValidationErrors} from '../../imports/constants/validation_errors.js';

describe('UC 559 - Remove New Design Update Component', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 559 - Remove New Design Update Component');

    });

    after(function(){

    });

    beforeEach(function(){

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();

        // Complete the Design Version and create the next
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2');

        // Add a new Design Update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdate();
        DesignUpdateActions.designerSelectsUpdate(DefaultItemNames.NEW_DESIGN_UPDATE_NAME);
        DesignUpdateActions.designerEditsSelectedUpdateNameTo('DesignUpdate1');
    });

    afterEach(function(){

    });


    // Actions
    it('A new Application with no children in a Design Update can be removed', function(){

        // Setup - add new Application
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsApplicationCalled('Application2');

        // Remove Application
        UpdateComponentActions.designerRemovesUpdateApplication('Application2');

        // Verify completely gone
        expect(UpdateComponentVerifications.componentDoesNotExistForDesignerCurrentUpdate(ComponentType.APPLICATION, 'Application2'));
    });

    it('A new Design Section with no children in a Design Update can be removed', function(){

        // Setup - add new Section
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');
        UpdateComponentActions.designerAddsDesignSectionToApplication_Called('Application1', 'Section3');

        // Remove Section
        UpdateComponentActions.designerRemovesUpdateSection('Application1', 'Section3');

        // Verify completely gone
        expect(UpdateComponentVerifications.componentDoesNotExistForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Section3'));
    });

    it('A new Feature with no children in a Design Update can be removed', function(){

        // Setup - add new Feature - need to remove default Feature Aspects
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateScope('Application1', 'Section1');
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section1', 'Feature3');
        UpdateComponentActions.designerRemovesUpdateFeatureAspect('Feature3', 'Interface');
        UpdateComponentActions.designerRemovesUpdateFeatureAspect('Feature3', 'Actions');
        UpdateComponentActions.designerRemovesUpdateFeatureAspect('Feature3', 'Conditions');
        UpdateComponentActions.designerRemovesUpdateFeatureAspect('Feature3', 'Consequences');

        // Remove Feature
        UpdateComponentActions.designerRemovesUpdateFeature('Section1', 'Feature3');

        // Verify completely gone
        expect(UpdateComponentVerifications.componentDoesNotExistForDesignerCurrentUpdate(ComponentType.FEATURE, 'Feature3'));
    });

    it('A new Feature Aspect with no children in a Design Update can be removed', function(){

        // Setup - add new Feature Aspect
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');
        UpdateComponentActions.designerAddsFeatureAspectTo_Feature_Called('Section1', 'Feature1', 'Aspect1');

        // Remove Feature Aspect
        UpdateComponentActions.designerRemovesUpdateFeatureAspect('Feature1', 'Aspect1');

        // Verify completely gone
        expect(UpdateComponentVerifications.componentDoesNotExistForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Aspect1'));
    });

    it('A new Scenario with no Scenario Steps in a Design Update can be removed');


    // Conditions
    it('A new Application cannot be removed from a Design Update if it has children', function(){

        // Setup - add new Application
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsApplicationCalled('Application2');
        // And add a Section to it
        UpdateComponentActions.designerAddsDesignSectionToApplication_Called('Application2', 'Section3');

        // Remove Application
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_REMOVABLE};
        UpdateComponentActions.designerRemovesUpdateApplication('Application2', expectation);

        // Verify not removed
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application2'));
    });

    it('A new Design Section cannot be removed from a Design Update if it has children', function(){

        // Setup - add new Section
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');
        UpdateComponentActions.designerAddsDesignSectionToApplication_Called('Application1', 'Section3');
        // Add Feature to it
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section3', 'Feature3');

        // Remove Section
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_REMOVABLE};
        UpdateComponentActions.designerRemovesUpdateSection('Application1', 'Section3', expectation);

        // Verify not removed
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section3'));
    });

    it('A new Feature cannot be removed from a Design Update if it has children', function(){

        // Setup - add new Feature - automatically adds aspects as children
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateScope('Application1', 'Section1');
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section1', 'Feature3');

        // Remove Feature
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_REMOVABLE};
        UpdateComponentActions.designerRemovesUpdateFeature('Section1', 'Feature3', expectation);

        // Verify not removed
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature3'));
    });

    it('A new Feature Aspect cannot be removed from a Design Update if it has children', function(){

        // Setup - add new Feature - automatically adds aspects as children
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateScope('Application1', 'Section1');
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section1', 'Feature3');
        // Add Scenario to Actions aspect
        UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature3', 'Actions', 'Scenario99');

        // Remove Feature Aspect
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_REMOVABLE};
        UpdateComponentActions.designerRemovesUpdateFeatureAspect('Feature3', 'Actions', expectation);

        // Verify not removed
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature3', 'Actions'));

    });

    it('A new Scenario cannot be removed from a Design Update if it has Scenario Steps');

    // Consequences
    it('When a new Design Update Component is removed it is removed from any Work Package based on the Design Update', function(){

        // Setup - add new Application
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsApplicationCalled('Application2');
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        // Create a WP based on DU1
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerAddsUpdateWorkPackageCalled('WorkPackage1');

        // Check Application2 available in WP1
        WorkPackageActions.managerEditsUpdateWorkPackage('WorkPackage1');
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application2'));

        // Add to WP1 scope
        WpComponentActions.managerAddsApplicationToScopeForCurrentWp('Application2');
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application2'));

        // Remove Application
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerRemovesUpdateApplication('Application2');

        // Verify no longer in WP or available to scope
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application2'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application2'));
    });

    it('When a new Design Update Component is removed from a Design Update to be included in the current Design Version it is removed completely from the Design Version', function(){

        // Setup - add new Application
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsApplicationCalled('Application2');
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');

        // Check now new item in DV
        DesignComponentActions.designerSelectsApplication('Application2');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_ADDED));

        // Remove Application
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerRemovesUpdateApplication('Application2');

        // Verify not in DV any more
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.APPLICATION, 'Application2', 'Design1', 'DesignVersion2'));
    });
});
