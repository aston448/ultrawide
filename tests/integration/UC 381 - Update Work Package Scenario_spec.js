
import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
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
import OutputLocationsActions       from '../../test_framework/test_wrappers/output_locations_actions.js';
import OutputLocationsVerifications from '../../test_framework/test_wrappers/output_locations_verifications.js';
import TestResultActions            from '../../test_framework/test_wrappers/test_integration_actions.js';
import TestResultVerifications      from '../../test_framework/test_wrappers/test_result_verifications.js';
import ViewOptionsActions           from '../../test_framework/test_wrappers/view_options_actions.js';
import ViewOptionsVerifications     from '../../test_framework/test_wrappers/view_options_verifications.js';

import {DefaultLocationText} from '../../imports/constants/default_names.js';
import {TestOutputLocationValidationErrors, WorkPackageValidationErrors}   from '../../imports/constants/validation_errors.js';
import { ComponentType, WorkPackageStatus } from '../../imports/constants/constants.js';

describe('UC 381 - Update Work Package Scenario - Base Design', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 381 - Update Work Package Scenario - Base Design');

        // Basic Design Version Data
        TestFixtures.clearAllData();
        TestFixtures.addDesignWithDefaultData();

        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');


    });

    after(function(){

    });

    beforeEach(function(){

        // Start again with a new WP
        TestFixtures.clearWorkPackages();

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
    it('A Developer can edit the name of a Base Design Version Work Package Scenario and save changes', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.SCENARIO, 'Actions', 'Scenario1');
        WpComponentActions.developerUpdatesSelectedComponentNameTo('New Scenario Name');

        // Verify
        expect(WpComponentVerifications.developerSelectedComponentNameIs('New Scenario Name'));
    });



    // Conditions
    it('Only a Developer can edit the name of a Base Design Version Work Package Scenario');

    it('Only Scenarios are editable in a Base Design Version Work Package');


    // Consequences
    it('When a Base Design Version Work Package Scenario is edited by a Developer the new version appears in the Base Design Version');


});

describe('UC 381 - Update Work Package Scenario - Design Update', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 381 - Update Work Package Scenario - Design Update');


    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });

    // Actions
    it('A Developer can edit the name of a Design Update Work Package Scenario and save changes');

    // Conditions
    it('Only a Developer can edit the name of a Design Update Work Package Scenario');

    it('Only Scenarios are editable in a Design Update Work Package');

    // Consequences
    it('When a Design Update Work Package Scenario is edited by a Developer the new version appears in the Design Update');

});