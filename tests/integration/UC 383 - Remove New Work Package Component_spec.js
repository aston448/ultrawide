
import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
import DesignActions                from '../../test_framework/test_wrappers/design_actions.js';
import DesignVersionActions         from '../../test_framework/test_wrappers/design_version_actions.js';
import DesignUpdateActions          from '../../test_framework/test_wrappers/design_update_actions.js';
import DesignComponentActions       from '../../test_framework/test_wrappers/design_component_actions.js';
import UpdateComponentActions       from '../../test_framework/test_wrappers/design_update_component_actions.js';
import UpdateComponentVerifications from '../../test_framework/test_wrappers/design_update_component_verifications.js';
import DesignVerifications          from '../../test_framework/test_wrappers/design_verifications.js';
import DesignUpdateVerifications    from '../../test_framework/test_wrappers/design_update_verifications.js';
import DesignVersionVerifications   from '../../test_framework/test_wrappers/design_version_verifications.js';
import DesignComponentVerifications from '../../test_framework/test_wrappers/design_component_verifications.js';
import UserContextVerifications     from '../../test_framework/test_wrappers/user_context_verifications.js';
import WorkPackageActions           from '../../test_framework/test_wrappers/work_package_actions.js';
import WorkPackageVerifications     from '../../test_framework/test_wrappers/work_package_verifications.js';
import WpComponentActions           from '../../test_framework/test_wrappers/work_package_component_actions.js';
import WpComponentVerifications     from '../../test_framework/test_wrappers/work_package_component_verifications.js';
import OutputLocationsActions       from '../../test_framework/test_wrappers/output_locations_actions.js';
import OutputLocationsVerifications from '../../test_framework/test_wrappers/output_locations_verifications.js';
import TestResultActions            from '../../test_framework/test_wrappers/test_integration_actions.js';
import TestResultVerifications      from '../../test_framework/test_wrappers/test_result_verifications.js';
import ViewOptionsActions           from '../../test_framework/test_wrappers/view_options_actions.js';
import ViewOptionsVerifications     from '../../test_framework/test_wrappers/view_options_verifications.js';

import {DefaultLocationText, DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';
import {WorkPackageComponentValidationErrors, DesignComponentValidationErrors, DesignUpdateComponentValidationErrors}   from '../../imports/constants/validation_errors.js';
import { ComponentType, WorkPackageStatus } from '../../imports/constants/constants.js';

describe('UC 383 - Remove New Work Package Component - Base Design', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 383 - Remove New Work Package Component - Base Design');
    });

    after(function(){

    });

    beforeEach(function(){

        // Basic Design Version Data
        TestFixtures.clearAllData();
        TestFixtures.addDesignWithDefaultData();

        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');

        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerAddsBaseDesignWorkPackageCalled('WorkPackage1');
        WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage1');
        WpComponentActions.managerAddsFeatureToScopeForCurrentBaseWp('Section1', 'Feature1');
        WpComponentActions.managerAddsFeatureToScopeForCurrentBaseWp('Section2', 'Feature2');
        WorkPackageActions.managerPublishesSelectedWorkPackage();
    });

    afterEach(function(){

    });


    // Actions
    it('A Developer can remove a Scenario that has been added to a Base Design Version Work Package');

    it('A Developer can remove a Feature Aspect that has been added to a Base Design Version Work Package');


    // Conditions
    it('A Developer cannot remove an existing Scenario from a Base Design Version Work Package');

    it('A Developer cannot remove an existing Feature Aspect from a Base Design Version Work Package');

    it('A Developer cannot remove an existing Feature from a Base Design Version Work Package');

    it('A Developer cannot remove an existing Design Section from a Base Design Version Work Package');

    it('A Developer cannot remove an existing Application from a Base Design Version Work Package');

    it('A new Feature Aspect cannot be removed from a Base Design Version Work Package if it has a child Scenario');


    // Consequences
    it('When a Base Design Version Work Package Scenario is removed by a Developer it is no longer in the Base Design Version');

    it('When a Base Design Version Work Package Feature Aspect is removed by a Developer it is no longer in the Base Design Version');

});

describe('UC 383 - Remove New Work Package Component - Design Update', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 383 - Remove New Work Package Component - Design Update');

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

        // Clear WPs and Design Updates and start again...
        TestFixtures.clearDesignUpdates();
        TestFixtures.clearWorkPackages();

        // Add a new Design Update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');
        // Add some new functionality to it and publish
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section1', 'Feature3');
        UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature3', 'Actions', 'Scenario8');
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        // Manager creates Update WP that includes the new Feature3
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerAddsUpdateWorkPackageCalled('UpdateWorkPackage1');
        WorkPackageActions.managerEditsUpdateWorkPackage('UpdateWorkPackage1');
        WpComponentActions.managerAddsFeatureToScopeForCurrentUpdateWp('Section1', 'Feature3');
        WorkPackageActions.managerPublishesSelectedWorkPackage();
    });

    afterEach(function(){

    });


    // Actions
    it('A Developer can remove a Scenario that has been added to a Design Update Work Package');

    it('A Developer can remove a Feature Aspect that has been added to a Design Update Work Package');


    // Conditions
    it('A Developer cannot remove an existing Scenario from a Design Update Work Package');

    it('A Developer cannot remove an existing Feature Aspect from a Design Update Work Package');

    it('A Developer cannot remove an existing Feature from a Design Update Work Package');

    it('A Developer cannot remove an existing Design Section from a Design Update Work Package');

    it('A Developer cannot remove an existing Application from a Design Update Work Package');

    it('A new Feature Aspect cannot be removed from a Design Update Work Package if it has a child Scenario');


    // Consequences
    it('When a Design Update Work Package Scenario is removed by a Developer it is no longer in the Design Update');

    it('When a Design Update Work Package Feature Aspect is removed by a Developer it is no longer in the Design Update');

});
