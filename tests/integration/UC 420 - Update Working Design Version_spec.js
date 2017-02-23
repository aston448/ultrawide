
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
import {DesignVersionValidationErrors} from '../../imports/constants/validation_errors.js';


describe('UC 420 - Update Working Design Version', function(){

    before(function(){

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
        // Add a new Feature in the Update
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section1', 'Feature3');
        // Publish Update - sets to Merge
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');

    });

    afterEach(function(){

    });


    // Actions
    it('A Designer may update an Updatable Design Version with Design Updates set for Merge', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');

        // Execute
        DesignVersionActions.designerUpdatesDesignVersionWithUpdates('DesignVersion2');

        // Verify - DV2 should now contain Feature3 but DV1 does not
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature3', 'Design1', 'DesignVersion2', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature3', 'Design1', 'DesignVersion1', 0));
    });

    it('A Developer may update an Updatable Design Version with Design Updates set for Merge', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');

        // Execute
        DesignVersionActions.developerUpdatesDesignVersionWithUpdates('DesignVersion2');

        // Verify - DV2 should now contain Feature3 but DV1 does not
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature3', 'Design1', 'DesignVersion2', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature3', 'Design1', 'DesignVersion1', 0));
    });


    // Conditions
    it('A Manager may not update an Updatable Design Version', function(){

        // Setup
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');

        // Execute
        const expectation = {success: false, message: DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_UPDATE_WORKING};
        DesignVersionActions.managerUpdatesDesignVersionWithUpdates('DesignVersion2', expectation);

        // Verify - no change to DVs
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature3', 'Design1', 'DesignVersion2', 0));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature3', 'Design1', 'DesignVersion1', 0));
    });

    it('Only an Updatable Design Version may be updated', function(){
        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');

        // Execute
        const expectation = {success: false, message: DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_UPDATE_WORKING};
        DesignVersionActions.designerUpdatesDesignVersionWithUpdates('DesignVersion1', expectation);

        // Verify - no change to DVs
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature3', 'Design1', 'DesignVersion2', 0));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature3', 'Design1', 'DesignVersion1', 0));
    });

    it('An Updatable Design Version may only be updated if there is at least one Design Update for it marked as Merge', function(){

        // Setup - set the update to IGNORE
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_IGNORE);

        // Execute
        const expectation = {success: false, message: DesignVersionValidationErrors.DESIGN_VERSION_INVALID_UPDATE_WORKING};
        DesignVersionActions.designerUpdatesDesignVersionWithUpdates('DesignVersion2', expectation);

        // Verify - DV2 should now contain Feature3 but DV1 does not
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature3', 'Design1', 'DesignVersion2', 0));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature3', 'Design1', 'DesignVersion1', 0));
    });


    // Consequences
    it('When an Updatable Design Version is updated the latest changes in any Design Updates marked as Merge are added to it', function(){

        // Setup
        // Add another Design Update
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');
        // Add new stuff to it...
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');
        UpdateComponentActions.designerAddsApplicationCalled('Application2');
        UpdateComponentActions.designerAddsDesignSectionToApplication_Called('Application2', 'Section20');
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application2', 'Section20', 'Feature20');
        UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature20', 'Actions', 'Scenario8');
        // Rename existing Feature2
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section2', 'Feature2');
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('Feature22');
        // Publish
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate2');

        // Execute - will add DUs 1 and 2 to the Working DV
        DesignVersionActions.designerUpdatesDesignVersionWithUpdates('DesignVersion2');
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature3', 'Design1', 'DesignVersion2', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature3', 'Design1', 'DesignVersion1', 0));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.APPLICATION, 'Application2', 'Design1', 'DesignVersion2', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.APPLICATION, 'Application2', 'Design1', 'DesignVersion1', 0));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section20', 'Design1', 'DesignVersion2', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section20', 'Design1', 'DesignVersion1', 0));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature20', 'Design1', 'DesignVersion2', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature20', 'Design1', 'DesignVersion1', 0));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Interface', 'Design1', 'DesignVersion2', 5));  // Now 5 features in total as 2 added
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Interface', 'Design1', 'DesignVersion1', 3));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Actions', 'Design1', 'DesignVersion2', 5));  // Now 5 features in total as 2 added
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Actions', 'Design1', 'DesignVersion1', 3));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Conditions', 'Design1', 'DesignVersion2', 5));  // Now 5 features in total as 2 added
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Conditions', 'Design1', 'DesignVersion1', 3));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Consequences', 'Design1', 'DesignVersion2', 5));  // Now 5 features in total as 2 added
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Consequences', 'Design1', 'DesignVersion1', 3));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario8', 'Design1', 'DesignVersion2', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario8', 'Design1', 'DesignVersion1', 0));
        // The renamed feature
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature22', 'Design1', 'DesignVersion2', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature22', 'Design1', 'DesignVersion1', 0));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature2', 'Design1', 'DesignVersion2', 0));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature2', 'Design1', 'DesignVersion1', 1));
    });

    it('When an Updatable Design Version is updated any previous changes for Design Updates no longer marked as Merge are rolled back', function(){

        // Setup
        // Add another Design Update
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');
        // Add new stuff to it...
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');
        UpdateComponentActions.designerAddsApplicationCalled('Application2');
        UpdateComponentActions.designerAddsDesignSectionToApplication_Called('Application2', 'Section20');
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application2', 'Section20', 'Feature20');
        UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature20', 'Actions', 'Scenario8');
        // Rename existing Feature2
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section2', 'Feature2');
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('Feature22');
        // Publish
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate2');

        // Check position when both updates added
        DesignVersionActions.designerUpdatesDesignVersionWithUpdates('DesignVersion2');
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature3', 'Design1', 'DesignVersion2', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature3', 'Design1', 'DesignVersion1', 0));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.APPLICATION, 'Application2', 'Design1', 'DesignVersion2', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.APPLICATION, 'Application2', 'Design1', 'DesignVersion1', 0));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section20', 'Design1', 'DesignVersion2', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section20', 'Design1', 'DesignVersion1', 0));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature20', 'Design1', 'DesignVersion2', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature20', 'Design1', 'DesignVersion1', 0));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Interface', 'Design1', 'DesignVersion2', 5));  // Now 5 features in total as 2 added
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Interface', 'Design1', 'DesignVersion1', 3));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Actions', 'Design1', 'DesignVersion2', 5));  // Now 5 features in total as 2 added
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Actions', 'Design1', 'DesignVersion1', 3));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Conditions', 'Design1', 'DesignVersion2', 5));  // Now 5 features in total as 2 added
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Conditions', 'Design1', 'DesignVersion1', 3));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Consequences', 'Design1', 'DesignVersion2', 5));  // Now 5 features in total as 2 added
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Consequences', 'Design1', 'DesignVersion1', 3));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario8', 'Design1', 'DesignVersion2', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario8', 'Design1', 'DesignVersion1', 0));
        // The renamed feature
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature22', 'Design1', 'DesignVersion2', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature22', 'Design1', 'DesignVersion1', 0));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature2', 'Design1', 'DesignVersion2', 0));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature2', 'Design1', 'DesignVersion1', 1));

        // Set DU2 to Ignore
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate2');
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_IGNORE);

        // Execute - Update the working DV
        DesignVersionActions.designerUpdatesDesignVersionWithUpdates('DesignVersion2');

        // Verify DU1 stuff still there
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature3', 'Design1', 'DesignVersion2', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature3', 'Design1', 'DesignVersion1', 0));
        // Verify DU2 stuff no longer included
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.APPLICATION, 'Application2', 'Design1', 'DesignVersion2', 0));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.APPLICATION, 'Application2', 'Design1', 'DesignVersion1', 0));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section20', 'Design1', 'DesignVersion2', 0));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section20', 'Design1', 'DesignVersion1', 0));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature20', 'Design1', 'DesignVersion2', 0));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature20', 'Design1', 'DesignVersion1', 0));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Interface', 'Design1', 'DesignVersion2', 4));  // Now 4 features in total as 1 added
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Interface', 'Design1', 'DesignVersion1', 3));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Actions', 'Design1', 'DesignVersion2', 4));  // Now 4 features in total as 1 added
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Actions', 'Design1', 'DesignVersion1', 3));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Conditions', 'Design1', 'DesignVersion2', 4));  // Now 4 features in total as 1 added
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Conditions', 'Design1', 'DesignVersion1', 3));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Consequences', 'Design1', 'DesignVersion2', 4));  // Now 4 features in total as 1 added
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Consequences', 'Design1', 'DesignVersion1', 3));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario8', 'Design1', 'DesignVersion2', 0));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario8', 'Design1', 'DesignVersion1', 0));
        // The renamed feature is not renamed
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature22', 'Design1', 'DesignVersion2', 0));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature22', 'Design1', 'DesignVersion1', 0));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature2', 'Design1', 'DesignVersion2', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature2', 'Design1', 'DesignVersion1', 1));
    });

});
