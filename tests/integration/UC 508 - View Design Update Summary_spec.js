
import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
import DesignActions                    from '../../test_framework/test_wrappers/design_actions.js';
import DesignVersionActions             from '../../test_framework/test_wrappers/design_version_actions.js';
import DesignUpdateActions              from '../../test_framework/test_wrappers/design_update_actions.js';
import DesignComponentActions           from '../../test_framework/test_wrappers/design_component_actions.js';
import UpdateComponentActions           from '../../test_framework/test_wrappers/design_update_component_actions.js';
import DesignVerifications              from '../../test_framework/test_wrappers/design_verifications.js';
import DesignUpdateVerifications        from '../../test_framework/test_wrappers/design_update_verifications.js';
import DesignUpdateSummaryVerifications from '../../test_framework/test_wrappers/design_update_summary_verifications.js';
import DesignVersionVerifications       from '../../test_framework/test_wrappers/design_version_verifications.js';
import DesignComponentVerifications     from '../../test_framework/test_wrappers/design_component_verifications.js';
import UserContextVerifications         from '../../test_framework/test_wrappers/user_context_verifications.js';
import WorkPackageActions               from '../../test_framework/test_wrappers/work_package_actions.js';
import WorkPackageVerifications         from '../../test_framework/test_wrappers/work_package_verifications.js';
import WpComponentActions               from '../../test_framework/test_wrappers/work_package_component_actions.js';
import WpComponentVerifications         from '../../test_framework/test_wrappers/work_package_component_verifications.js';
import UpdateComponentVerifications     from '../../test_framework/test_wrappers/design_update_component_verifications.js';
import ViewOptionsActions           from '../../test_framework/test_wrappers/view_options_actions.js';

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';
import {DesignUpdateComponentValidationErrors} from '../../imports/constants/validation_errors.js';

describe('UC 508 - View Design Update Summary', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 508 - View Design Update Summary');
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

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');

        // Make sure Update Summary is showing so the data refreshes
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        ViewOptionsActions.designerTogglesDesignUpdateSummary()
    });

    afterEach(function(){

    });


    // Interface
    it('A list of Design Components added in the selected Design Update grouped by the item they are added to');

    it('A list of Design Components removed in the selected Design Update grouped by the item they are removed from');

    it('A list of Design Components modified in the selected Design Update grouped by their parent item');

    it('A list of Scenarios to confirm tests for in the selected Design Update grouped by their parent item');

    it('The additions list is not visible if there are no Design Components added');

    it('The removals list is not visible if there are no Design Components removed');

    it('The changes list is not visible if there are no changes to existing Design Components');

    it('The test checks list is not visible if no existing unchanged Scenarios are included');

    it('A new Application added in a Design Update is shown as bing added to the current Design');

    it('Each Scenario in the Design Update Summary shows its current Test Summary status');


    // Actions
    it('A Design Update Summary is shown when a Design Update is selected');

    it('A Design Update Summary is shown when a Design Update is edited or viewed');

    it('The Design Update Summary is updated when a Design Component is added to a Design Update', function(){

        // Add a new Scenario
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateFeatureAspect('Feature1', 'Actions');

        // New Scenario in Update Summary
        DesignUpdateSummaryVerifications.scenario_IsInCurrentDesignUpdateSummaryAdditionsForDesigner(DefaultComponentNames.NEW_SCENARIO_NAME);
    });

    it('The Design Update Summary is updated when a Design Component is removed from a Design Update', function(){

        // Remove existing Scenario
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');
        UpdateComponentActions.designerLogicallyDeletesUpdateScenario('Actions', 'Scenario1');

        // Seen in REMOVE list
        expect(DesignUpdateSummaryVerifications.scenario_IsInCurrentDesignUpdateSummaryRemovalsForDesigner('Scenario1'));
    });

    it('The Design Update Summary is updated when a Design Component is modified in a Design Update', function(){

        // Modify existing Scenario
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.SCENARIO, 'Actions', 'Scenario1');
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('New Scenario');

        // Scenario1 added to Modifications
        expect(DesignUpdateSummaryVerifications.scenario_ChangedTo_IsInCurrentDesignUpdateSummaryChangesForDesigner('Scenario1', 'NewScenario'));
    });

    it('The Design Update Summary is updated when a Scenario is added to the Design Update Scope', function(){

        // Just select a Sceario to check its tests
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');

        // Scenario1 in the Queries
        expect(DesignUpdateSummaryVerifications.scenario_IsInCurrentDesignUpdateSummaryQueriesForDesigner('Scenario1'));
    });

    it('The Design Update Summary is updated when a Scenario is removed from the Design Update Scope', function(){
        // Just select a Sceario to check its tests
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');

        // Check Scenario1 in the Queries
        expect(DesignUpdateSummaryVerifications.scenario_IsInCurrentDesignUpdateSummaryQueriesForDesigner('Scenario1'));

        // Remove from scope
        UpdateComponentActions.designerRemovesScenarioFromCurrentUpdateScope('Actions', 'Scenario1');

        expect(DesignUpdateSummaryVerifications.scenario_IsNotInCurrentDesignUpdateSummaryQueriesForDesigner('Scenario1'));
    });


    // Conditions
    it('A new Design Component added and removed in the Design Update is not listed in the additions or removals list', function(){

        // Add a new Scenario
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateFeatureAspect('Feature1', 'Actions');
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.SCENARIO, 'Actions', DefaultComponentNames.NEW_SCENARIO_NAME);
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('Scenario8');

        // New Scenario in Update Summary
        expect(DesignUpdateSummaryVerifications.scenario_IsInCurrentDesignUpdateSummaryAdditionsForDesigner('Scenario8'));

        // Remove it again
        UpdateComponentActions.designerRemovesScenarioFromCurrentUpdateScope('Actions', 'Scenario8');

        // Not in additions or removals
        expect(DesignUpdateSummaryVerifications.scenario_IsNotInCurrentDesignUpdateSummaryAdditionsForDesigner('Scenario8'));
        expect(DesignUpdateSummaryVerifications.scenario_IsNotInCurrentDesignUpdateSummaryRemovalsForDesigner('Scenario8'));

    });

    it('A new Design Component whose name is modified in the Design Update is not shown in the changes list', function(){

        // Add a new Scenario
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateFeatureAspect('Feature1', 'Actions');


        // New Scenario in Update Summary
        expect(DesignUpdateSummaryVerifications.scenario_IsInCurrentDesignUpdateSummaryAdditionsForDesigner(DefaultComponentNames.NEW_SCENARIO_NAME));

        // Now give it a proper name
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.SCENARIO, 'Actions', DefaultComponentNames.NEW_SCENARIO_NAME);
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('Scenario8');

        // Still a NEW item even though name changed
        expect(DesignUpdateSummaryVerifications.scenario_IsInCurrentDesignUpdateSummaryAdditionsForDesigner('Scenario8'));
    });

});
