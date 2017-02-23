
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
import { WorkPackageStatus } from '../../imports/constants/constants.js';

describe('UC 302 - Release Work Package', function(){

    before(function(){

        // Basic Design Version

        TestFixtures.clearAllData();
        TestFixtures.addDesignWithDefaultData();

        // Create a Work Package with Feature1 and Feature2 in it
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
    });

    after(function(){

    });

    beforeEach(function(){

        // Start again with WPs

        TestFixtures.clearWorkPackages();

        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerAddsBaseDesignWorkPackageCalled('WorkPackage1');
        WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage1');
        WpComponentActions.managerAddsFeatureToScopeForCurrentBaseWp('Section1', 'Feature1');
        WpComponentActions.managerAddsFeatureToScopeForCurrentBaseWp('Section2', 'Feature2');
        // But make sure Scenario7 in Feature1 is not in scope
        WpComponentActions.managerRemovesScenarioFromScopeForCurrentBaseWp('Actions', 'Scenario7');
        WorkPackageActions.managerPublishesSelectedWorkPackage();
    });

    afterEach(function(){

    });

    // Actions
    it('A Developer can release a Work Package that they have adopted', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        // Confirm it is adopted by this developer
        expect(WorkPackageVerifications.workPackage_StatusForDeveloperIs('WorkPackage1', WorkPackageStatus.WP_ADOPTED));
        expect(WorkPackageVerifications.currentDeveloperWorkPackageIsAdoptedByDeveloper());

        // Execute
        WorkPackageActions.developerReleasesSelectedWorkPackage();

        // Verify
        expect(WorkPackageVerifications.workPackage_StatusForDeveloperIs('WorkPackage1', WorkPackageStatus.WP_AVAILABLE));
        expect(WorkPackageVerifications.currentDeveloperWorkPackageHasNoAdopter());

    });

    it('A Manager can release any adopted Work Package', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        // Confirm it is adopted by this developer
        expect(WorkPackageVerifications.workPackage_StatusForDeveloperIs('WorkPackage1', WorkPackageStatus.WP_ADOPTED));
        expect(WorkPackageVerifications.currentDeveloperWorkPackageIsAdoptedByDeveloper());

        // Execute
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.managerReleasesSelectedWorkPackage();

        // Verify
        expect(WorkPackageVerifications.workPackage_StatusForDeveloperIs('WorkPackage1', WorkPackageStatus.WP_AVAILABLE));
        expect(WorkPackageVerifications.currentDeveloperWorkPackageHasNoAdopter());
    });


    // Conditions
    it('A Designer cannot release an adopted Work Package', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        // Confirm it is adopted by this developer
        expect(WorkPackageVerifications.workPackage_StatusForDeveloperIs('WorkPackage1', WorkPackageStatus.WP_ADOPTED));
        expect(WorkPackageVerifications.currentDeveloperWorkPackageIsAdoptedByDeveloper());

        // Execute
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.designerSelectsWorkPackage('WorkPackage1');
        const expectation = {success: false, message: WorkPackageValidationErrors.WORK_PACKAGE_INVALID_ROLE_RELEASE};
        WorkPackageActions.designerReleasesSelectedWorkPackage(expectation);

        // Verify - not changed
        expect(WorkPackageVerifications.workPackage_StatusForDeveloperIs('WorkPackage1', WorkPackageStatus.WP_ADOPTED));
        expect(WorkPackageVerifications.currentDeveloperWorkPackageIsAdoptedByDeveloper());
    });

    it('A Developer cannot release a Work Package adopted by another Developer', function(){

        // Setup - second developer adopts WP
        DesignActions.anotherDeveloperWorksOnDesign('Design1');
        DesignVersionActions.anotherDeveloperSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.anotherDeveloperSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.anotherDeveloperAdoptsSelectedWorkPackage();
        // Confirm it is adopted by this developer
        expect(WorkPackageVerifications.workPackage_StatusForAnotherDeveloperIs('WorkPackage1', WorkPackageStatus.WP_ADOPTED));
        expect(WorkPackageVerifications.currentDeveloperWorkPackageIsAdoptedByAnotherDeveloper());

        // Execute - first developer tries to release it
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        const expectation = {success: false, message: WorkPackageValidationErrors.WORK_PACKAGE_INVALID_USER_RELEASE};
        WorkPackageActions.developerReleasesSelectedWorkPackage(expectation);

        // Verify - no change
        expect(WorkPackageVerifications.workPackage_StatusForAnotherDeveloperIs('WorkPackage1', WorkPackageStatus.WP_ADOPTED));
        expect(WorkPackageVerifications.currentDeveloperWorkPackageIsAdoptedByAnotherDeveloper());
    });

    it('Only an Adopted Work Package can be released', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        expect(WorkPackageVerifications.workPackage_StatusForDeveloperIs('WorkPackage1', WorkPackageStatus.WP_AVAILABLE));
        expect(WorkPackageVerifications.currentDeveloperWorkPackageHasNoAdopter());

        // Execute - try to release Available WP
        const expectation = {success: false, message: WorkPackageValidationErrors.WORK_PACKAGE_INVALID_STATE_RELEASE};
        WorkPackageActions.developerReleasesSelectedWorkPackage(expectation);

        // Verify - no change
        expect(WorkPackageVerifications.workPackage_StatusForDeveloperIs('WorkPackage1', WorkPackageStatus.WP_AVAILABLE));
        expect(WorkPackageVerifications.currentDeveloperWorkPackageHasNoAdopter());

        // Manager withdraw WP
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.managerWithdrawsSelectedWorkPackage();

        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        expect(WorkPackageVerifications.workPackage_StatusForDeveloperIs('WorkPackage1', WorkPackageStatus.WP_NEW));
        expect(WorkPackageVerifications.currentDeveloperWorkPackageHasNoAdopter());

        // Execute - try to release New WP - same expectation
        WorkPackageActions.developerReleasesSelectedWorkPackage(expectation);

        // Verify - no change
        expect(WorkPackageVerifications.workPackage_StatusForDeveloperIs('WorkPackage1', WorkPackageStatus.WP_AVAILABLE));
        expect(WorkPackageVerifications.currentDeveloperWorkPackageHasNoAdopter());
    });

});
