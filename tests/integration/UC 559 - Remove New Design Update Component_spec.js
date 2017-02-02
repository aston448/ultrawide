
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

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 559 - Remove New Design Update Component', function(){

    before(function(){

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();

        // Complete the Design Version and create the next
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2');
    });

    after(function(){

    });

    beforeEach(function(){

        // Remove any Design Updates before each test
        TestFixtures.clearDesgnUpdates();

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
        UpdateComponentActions.designerAddsDesignSectionToApplication_Called('Application1', 'Section3');

        // Remove Section
        UpdateComponentActions.designerRemovesUpdateSection('Application1', 'Section3');

        // Verify completely gone
        expect(UpdateComponentVerifications.componentDoesNotExistForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Section3'));
    });

    it('A new Feature with no children in a Design Update can be removed', function(){

        // Setup - add new Feature - need to remove default Feature Aspects
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
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
        UpdateComponentActions.designerRemovesUpdateApplication('Application2');

        // Verify not removed
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application2'));
    });

    it('A new Design Section cannot be removed from a Design Update if it has children', function(){

        // Setup - add new Section
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsDesignSectionToApplication_Called('Application1', 'Section3');
        // Add Feature to it
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section3', 'Feature3');

        // Remove Section
        UpdateComponentActions.designerRemovesUpdateSection('Application1', 'Section3');

        // Verify not removed
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section3'));
    });

    it('A new Feature cannot be removed from a Design Update if it has children', function(){

        // Setup - add new Feature - automatically adds aspects as children
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section1', 'Feature3');

        // Remove Feature
        UpdateComponentActions.designerRemovesUpdateFeature('Section1', 'Feature3');

        // Verify not removed
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature3'));
    });

    it('A new Feature Aspect cannot be removed from a Design Update if it has children', function(){

        // Setup - add new Feature - automatically adds aspects as children
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section1', 'Feature3');
        // Add Scenario to Actions aspect
        UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature3', 'Actions', 'Scenario99');

        // Remove Feature Aspect
        UpdateComponentActions.designerRemovesUpdateFeatureAspect('Feature3', 'Actions');

        // Verify not removed
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature3', 'Actions'));

    });

    it('A new Scenario cannot be removed from a Design Update if it has Scenario Steps');

});
