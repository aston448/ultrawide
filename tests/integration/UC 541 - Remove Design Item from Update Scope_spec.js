
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

describe('UC 541 - Remove Design Item from Update Scope', function(){

    before(function(){

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();

        // Complete the Design Version and create the next
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2')
    });

    after(function(){

    });

    beforeEach(function(){

        // Remove any Design Updates before each test
        TestFixtures.clearDesignUpdates();

        // Add a new Design Update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdate();
        DesignUpdateActions.designerSelectsUpdate(DefaultItemNames.NEW_DESIGN_UPDATE_NAME);
        DesignUpdateActions.designerEditsSelectedUpdateNameTo('DesignUpdate1');
    });

    afterEach(function(){

    });


    // Actions
    it('An existing Feature can be removed from Design Update Scope', function(){

        // Setup - add Feature1 to scope
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));

        // Execute
        UpdateComponentActions.designerRemovesFeatureFromCurrentUpdateScope('Section1', 'Feature1');

        // Verify
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));

    });

    it('An existing Feature Aspect can be removed from Design Update Scope', function(){

        // Setup - add Feature1 Actions to scope
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));

        // Execute
        UpdateComponentActions.designerRemovesFeatureAspectFromCurrentUpdateScope('Feature1', 'Actions');

        // Verify
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
    });

    it('An existing Scenario can be removed from Design Update Scope', function(){

        // Setup - add Scenario1 to scope
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario1'));

        // Execute
        UpdateComponentActions.designerRemovesScenarioFromCurrentUpdateScope('Actions', 'Scenario1');

        // Verify
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
    });


    // Conditions
    it('A new Feature in the Design Update cannot be removed from the Design Update Scope');

    it('A new Feature Aspect in the Design Update cannot be removed from the Design Update Scope');

    it('A new Scenario in the Design Update cannot be removed from the Design Update Scope');

    it('An existing Feature cannot be removed from Design Update Scope if new Scenarios have been added to it');

    it('An existing Feature Aspect cannot be removed from Design Update Scope if new Scenarios have been added to it');


    // Consequences
    it('When a Design Component is removed from Design Update Scope it disappears from the Design Update editor');

    it('When a Design Component that is the parent of an in scope Design Component in the Design Update is removed from scope it becomes non-editable in the Design Update editor');

});
