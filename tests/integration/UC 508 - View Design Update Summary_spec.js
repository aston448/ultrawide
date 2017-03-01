
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

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';
import {DesignUpdateComponentValidationErrors} from '../../imports/constants/validation_errors.js';

describe('UC 508 - View Design Update Summary', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 508 - View Design Update Summary');

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

        // Start again with new Design Update
        TestFixtures.clearDesignUpdates();
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');

    });

    afterEach(function(){

    });


    // Actions
    it('A Design Update summary is shown when a Design Update is selected');


    // Conditions
    it('A new Feature added in the Design Update is listed in the additions list', function(){

        // Setup
        // Add a new Feature to Section1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section1', 'Feature3');

        // Refresh Summary
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        DesignUpdateActions.designerRefreshesUpdateSummary();

        // Verify
        expect(DesignUpdateSummaryVerifications.feature_IsInCurrentDesignUpdateSummaryAdditionsForDesigner('Feature3'));

    });

    it('A new Scenario added to an existing Feature in the Design Update is listed in the additions list', function(){

        // Setup
        // Add a new Scenario to Feature1 Actions - need to Scope Actions
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature1', 'Actions', 'Scenario8');

        // Refresh Summary
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        DesignUpdateActions.designerRefreshesUpdateSummary();

        // Verify only scenario in list
        expect(DesignUpdateSummaryVerifications.scenario_IsInCurrentDesignUpdateSummaryAdditionsForDesigner('Scenario8'));
        expect(DesignUpdateSummaryVerifications.feature_IsNotInCurrentDesignUpdateSummaryAdditionsForDesigner('Feature1'));
    });

    it('A new Scenario added to a new Feature in the Design Update is listed in the additions list', function(){

        // Setup
        // Add a new Feature and Scenario to Section1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section1', 'Feature3');
        UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature3', 'Actions', 'Scenario8');

        // Refresh Summary
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        DesignUpdateActions.designerRefreshesUpdateSummary();

        // Verify - both in list
        expect(DesignUpdateSummaryVerifications.feature_IsInCurrentDesignUpdateSummaryAdditionsForDesigner('Feature3'));
        expect(DesignUpdateSummaryVerifications.scenario_IsInCurrentDesignUpdateSummaryAdditionsForDesigner('Scenario8'));
    });

    it('An existing Feature removed in the Design Update is listed in the removals list', function(){

        // Setup - remove Feature444
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature444');
        UpdateComponentActions.designerLogicallyDeletesUpdateFeature('Section1', 'Feature444');

        // Refresh Summary
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        DesignUpdateActions.designerRefreshesUpdateSummary();

        // Verify
        expect(DesignUpdateSummaryVerifications.feature_IsInCurrentDesignUpdateSummaryRemovalsForDesigner('Feature444'));
    });

    it('An existing Scenario removed in the Design Update is listed in the removals list', function(){

        // Setup
        // Remove Scenario1 from Feature1 Actions - need to Scope Scenario1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');
        UpdateComponentActions.designerLogicallyDeletesUpdateScenario('Actions', 'Scenario1');

        // Refresh Summary
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        DesignUpdateActions.designerRefreshesUpdateSummary();

        // Verify
        expect(DesignUpdateSummaryVerifications.scenario_IsInCurrentDesignUpdateSummaryRemovalsForDesigner('Scenario1'));
    });

    it('An existing Feature removed by removing its parent in the Design Update is listed in the removals list', function(){

        // Setup
        // Remove Section2 - Will remove Feature2
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerLogicallyDeletesUpdateSection('Application1', 'Section2');

        // Refresh Summary
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        DesignUpdateActions.designerRefreshesUpdateSummary();

        // Verify
        expect(DesignUpdateSummaryVerifications.feature_IsInCurrentDesignUpdateSummaryRemovalsForDesigner('Feature2'));
    });

    it('An existing Scenario removed by removing its parent in the Design Update is listed in the removals list', function(){

        // Setup
        // Remove Section2 - Will remove Feature2 + Scenarios 3 and 4
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerLogicallyDeletesUpdateSection('Application1', 'Section2');

        // Refresh Summary
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        DesignUpdateActions.designerRefreshesUpdateSummary();

        // Verify
        expect(DesignUpdateSummaryVerifications.feature_IsInCurrentDesignUpdateSummaryRemovalsForDesigner('Feature2'));
        expect(DesignUpdateSummaryVerifications.scenario_IsInCurrentDesignUpdateSummaryRemovalsForDesigner('Scenario3'));
        expect(DesignUpdateSummaryVerifications.scenario_IsInCurrentDesignUpdateSummaryRemovalsForDesigner('Scenario4'));
    });

    it('A new Feature added and removed in the Design Update is not listed in the additions or removals list', function(){

        // Setup
        // Add a new Feature to Section1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section1', 'Feature3');

        // Refresh Summary
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        DesignUpdateActions.designerRefreshesUpdateSummary();

        // Verify
        expect(DesignUpdateSummaryVerifications.feature_IsInCurrentDesignUpdateSummaryAdditionsForDesigner('Feature3'));

        // Then remove it again (have to remove all aspects first)
        UpdateComponentActions.designerRemovesUpdateFeatureAspect('Feature3', 'Interface');
        UpdateComponentActions.designerRemovesUpdateFeatureAspect('Feature3', 'Actions');
        UpdateComponentActions.designerRemovesUpdateFeatureAspect('Feature3', 'Conditions');
        UpdateComponentActions.designerRemovesUpdateFeatureAspect('Feature3', 'Consequences');
        UpdateComponentActions.designerRemovesUpdateFeature('Section1', 'Feature3');

        // Refresh Summary
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        DesignUpdateActions.designerRefreshesUpdateSummary();

        // Verify - not in addition or removal
        expect(DesignUpdateSummaryVerifications.feature_IsNotInCurrentDesignUpdateSummaryAdditionsForDesigner('Feature3'));
        expect(DesignUpdateSummaryVerifications.feature_IsNotInCurrentDesignUpdateSummaryRemovalsForDesigner('Feature3'));
    });

    it('A new Scenario added and removed in the Design Update is not listed in the additions or removals list', function(){

        // Setup
        // Add a new Scenario to Feature1 Actions - need to Scope Actions
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature1', 'Actions', 'Scenario8');

        // Refresh Summary
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        DesignUpdateActions.designerRefreshesUpdateSummary();

        // Verify only scenario in list
        expect(DesignUpdateSummaryVerifications.scenario_IsInCurrentDesignUpdateSummaryAdditionsForDesigner('Scenario8'));

        // Then remove it again
        UpdateComponentActions.designerRemovesUpdateScenario('Actions', 'Scenario8');

        // Refresh Summary
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        DesignUpdateActions.designerRefreshesUpdateSummary();

        // Verify - not in addition or removal
        expect(DesignUpdateSummaryVerifications.scenario_IsNotInCurrentDesignUpdateSummaryAdditionsForDesigner('Scenario8'));
        expect(DesignUpdateSummaryVerifications.scenario_IsNotInCurrentDesignUpdateSummaryRemovalsForDesigner('Scenario8'));
    });

    it('An existing Feature that has been modified is listed in the changes list with its old and new text', function(){

        // Setup
        // Modify Feature1 Name
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section1', 'Feature1');
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('New Feature Name');

        // Refresh Summary
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        DesignUpdateActions.designerRefreshesUpdateSummary();

        // Verify
        expect(DesignUpdateSummaryVerifications.feature_ChangedTo_IsInCurrentDesignUpdateSummaryChangesForDesigner('Feature1', 'New Feature Name'));
    });

    it('An existing Scenario that has been modified is listed in the changes list with its old and new text', function(){

        // Setup
        // Modify Scenario1 Name
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.SCENARIO, 'Actions', 'Scenario1');
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('New Scenario Name');

        // Refresh Summary
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        DesignUpdateActions.designerRefreshesUpdateSummary();

        // Verify
        expect(DesignUpdateSummaryVerifications.scenario_ChangedTo_IsInCurrentDesignUpdateSummaryChangesForDesigner('Scenario1', 'New Scenario Name'));
    });

    it('A new Feature modified in the Design Update is not shown in the changes list', function(){

        // Setup
        // Add a new Feature to Section1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section1', 'Feature3');

        // Refresh Summary
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        DesignUpdateActions.designerRefreshesUpdateSummary();
        expect(DesignUpdateSummaryVerifications.feature_IsInCurrentDesignUpdateSummaryAdditionsForDesigner('Feature3'));

        // Change the name of Feature3
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section1', 'Feature3');
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('New Feature Name');

        // Refresh Summary
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        DesignUpdateActions.designerRefreshesUpdateSummary();

        // Verify - not in changes - still in New as new name
        expect(DesignUpdateSummaryVerifications.feature_ChangedTo_IsNotInCurrentDesignUpdateSummaryChangesForDesigner('Feature3', 'New Feature Name'));
        expect(DesignUpdateSummaryVerifications.feature_IsInCurrentDesignUpdateSummaryAdditionsForDesigner('New Feature Name'));

    });

    it('A new Scenario modified in the Design Update is not shown in the changes list', function(){

        // Setup
        // Add a new Scenario to Feature1 Actions - need to Scope Actions
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature1', 'Actions', 'Scenario8');

        // Refresh Summary
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        DesignUpdateActions.designerRefreshesUpdateSummary();
        expect(DesignUpdateSummaryVerifications.scenario_IsInCurrentDesignUpdateSummaryAdditionsForDesigner('Scenario8'));

        // Modify name
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.SCENARIO, 'Actions', 'Scenario8');
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('New Scenario Name');

        // Refresh Summary
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        DesignUpdateActions.designerRefreshesUpdateSummary();

        // Verify - not in changes - still in New as new name
        expect(DesignUpdateSummaryVerifications.scenario_ChangedTo_IsNotInCurrentDesignUpdateSummaryChangesForDesigner('Scenario1', 'New Scenario Name'));
        expect(DesignUpdateSummaryVerifications.scenario_IsInCurrentDesignUpdateSummaryAdditionsForDesigner('New Scenario Name'));
    });

});
