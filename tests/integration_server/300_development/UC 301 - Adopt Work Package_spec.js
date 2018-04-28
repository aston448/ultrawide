
import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { WorkPackageActions }           from '../../../test_framework/test_wrappers/work_package_actions.js';
import { WorkPackageVerifications }     from '../../../test_framework/test_wrappers/work_package_verifications.js';
import { WpComponentActions }           from '../../../test_framework/test_wrappers/work_package_component_actions.js';

import {WorkPackageValidationErrors}   from '../../../imports/constants/validation_errors.js';
import { WorkPackageStatus } from '../../../imports/constants/constants.js';

describe('UC 301 - Adopt Work Package', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 301 - Adopt Work Package');

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
        WpComponentActions.managerAddsFeatureToScopeForCurrentWp('Section1', 'Feature1');
        WpComponentActions.managerAddsFeatureToScopeForCurrentWp('Section2', 'Feature2');
        // But make sure Scenario7 in Feature1 is not in scope
        WpComponentActions.managerRemovesScenarioFromScopeForCurrentWp('Actions', 'Scenario7');
        WorkPackageActions.managerPublishesSelectedWorkPackage();
    });

    afterEach(function(){

    });


    // Actions
    it('A Developer can adopt an Available Work Package', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        expect(WorkPackageVerifications.workPackage_StatusForDeveloperIs('WorkPackage1', WorkPackageStatus.WP_AVAILABLE));

        // Execute
        WorkPackageActions.developerAdoptsSelectedWorkPackage();

        // Verify
        expect(WorkPackageVerifications.workPackage_StatusForDeveloperIs('WorkPackage1', WorkPackageStatus.WP_ADOPTED));
    });


    // Conditions
    it('Only a Developer can adopt a Work Package', function(){

        // Setup - DESIGNER
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.designerSelectsWorkPackage('WorkPackage1');
        expect(WorkPackageVerifications.workPackage_StatusForDesignerIs('WorkPackage1', WorkPackageStatus.WP_AVAILABLE));

        // Execute
        const expectation = {success: false, message: WorkPackageValidationErrors.WORK_PACKAGE_INVALID_ROLE_ADOPT};
        WorkPackageActions.designerAdoptsSelectedWorkPackage(expectation);

        // Verify - not changed
        expect(WorkPackageVerifications.workPackage_StatusForDesignerIs('WorkPackage1', WorkPackageStatus.WP_AVAILABLE));

        // Setup - MANAGER
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerSelectsWorkPackage('WorkPackage1');
        expect(WorkPackageVerifications.workPackage_StatusForManagerIs('WorkPackage1', WorkPackageStatus.WP_AVAILABLE));

        // Execute - same expectation
        WorkPackageActions.managerAdoptsSelectedWorkPackage(expectation);

        // Verify - not changed
        expect(WorkPackageVerifications.workPackage_StatusForManagerIs('WorkPackage1', WorkPackageStatus.WP_AVAILABLE));
    });

    it('Only an Available Work Package can be adopted', function(){

        // Setup - Developer Adopts WP
        // Developer selects it...
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        expect(WorkPackageVerifications.workPackage_StatusForDeveloperIs('WorkPackage1', WorkPackageStatus.WP_ADOPTED));

        // Execute - try to adopt it again - expect failure
        const expectation = {success: false, message: WorkPackageValidationErrors.WORK_PACKAGE_INVALID_STATE_ADOPT};
        WorkPackageActions.developerAdoptsSelectedWorkPackage(expectation);
    });

});
