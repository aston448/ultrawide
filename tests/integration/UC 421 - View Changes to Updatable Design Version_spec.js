
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

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction, WorkPackageStatus, UpdateMergeStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';
import {DesignVersionValidationErrors} from '../../imports/constants/validation_errors.js';

describe('UC 421 - View Changes to Updatable Design Version', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 421 - View Changes to Updatable Design Version');
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

        // Create a Design Update to preview-merge
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');
    });

    afterEach(function(){

    });


    // Interface
    it('A Design Component added in a Design Update has a status of Added', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section1', 'Feature3');
        // Publish Update - sets to Merge
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');

        // Execute
        DesignVersionActions.designerUpdatesDesignVersionWithUpdates('DesignVersion2');

        // Verify
        DesignVersionActions.designerViewsDesignVersion('DesignVersion2');
        DesignComponentActions.designerSelectsFeature('Section1', 'Feature3');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_ADDED));
    });

    it('A Design Component whose name is modified in a Design Update has a status of Modified', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.SCENARIO, 'Actions', 'Scenario1');
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('Scenario111');
        // Publish Update - sets to Merge
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');

        // Execute
        DesignVersionActions.designerUpdatesDesignVersionWithUpdates('DesignVersion2');

        // Verify
        DesignVersionActions.designerViewsDesignVersion('DesignVersion2');
        DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario111');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_MODIFIED));
    });

    it('A Design Component whose text is modified in a Design Update has a status of Text Changed');

    it('A Design Component removed in a Design Update has a status of Removed', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');
        UpdateComponentActions.designerLogicallyDeletesUpdateScenario('Actions', 'Scenario1');
        // Publish Update - sets to Merge
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');

        // Execute
        DesignVersionActions.designerUpdatesDesignVersionWithUpdates('DesignVersion2');

        // Verify
        DesignVersionActions.designerViewsDesignVersion('DesignVersion2');
        DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_REMOVED));
    });

    it('A Design Component moved in an Documentation Update has a status of Moved');

    it('For Design Components whose name has changed, the new and old names are shown');

    it('For Design Components whose details have changed, the new and old details are shown');

    it('Removed Design Components are shown as struck through');


    // Actions
    it('Test summary data may be shown if hidden');

    it('Test summary data may be hidden if showing');

});
