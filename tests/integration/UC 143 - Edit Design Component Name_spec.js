
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

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';
import {DesignComponentValidationErrors} from '../../imports/constants/validation_errors.js';

describe('UC 143 - Edit Design Component Name', function(){

    before(function(){

    });

    after(function(){

    });

    beforeEach(function(){

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();
    });

    afterEach(function(){

    });


    // Actions
    it('A Design Component name can be edited and saved', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');

        // Execute
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application1');
        DesignComponentActions.designerEditsSelectedComponentNameTo_('My App');

        // Verify
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'My App', 'Design1', 'DesignVersion1'));

    });

    it('A Design Component name can be edited but then the changes discarded');


    // Conditions
    it('An Application name may not be changed to the same name as another Application in the Design', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
        // Add another App
        DesignComponentActions.designerAddsApplication();
        // Should be one with the default name too now
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.APPLICATION, 'Application1', 'Design1', 'DesignVersion1', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Design1', 'DesignVersion1', 1));

        // Execute
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.APPLICATION, 'NONE', DefaultComponentNames.NEW_APPLICATION_NAME);
        const expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_NAME_DUPLICATE};
        DesignComponentActions.designerEditsSelectedComponentNameTo_('Application1', expectation);

        // Verify - not changed to Application1 - should still be the default
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.APPLICATION, 'Application1', 'Design1', 'DesignVersion1', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Design1', 'DesignVersion1', 1));
    });

    it('A Feature name may not be changed to the same name as another Feature in the Design', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
        // Check both features are there (from default setup)
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion1', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature2', 'Design1', 'DesignVersion1', 1));

        // Execute - try to update Feature2 to Feature1
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.FEATURE, 'Section2', 'Feature2');
        const expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_NAME_DUPLICATE};
        DesignComponentActions.designerEditsSelectedComponentNameTo_('Feature1', expectation);

        // Verify - not changed to Feature1 - should still be Feature2
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion1', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature2', 'Design1', 'DesignVersion1', 1));
    });

    it('A Scenario name may not be changed to the same name as another Scenario in the Design', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
        // Check both scenarios are there
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario1', 'Design1', 'DesignVersion1', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario2', 'Design1', 'DesignVersion1', 1));

        // Execute - try to update Scenario2 to Scenario1
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.SCENARIO, 'Conditions', 'Scenario2');
        const expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_NAME_DUPLICATE};
        DesignComponentActions.designerEditsSelectedComponentNameTo_('Scenario1', expectation);

        // Verify - not changed to Scenario1 - should still be Scenario2
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario1', 'Design1', 'DesignVersion1', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario2', 'Design1', 'DesignVersion1', 1));
    });

    it('A Design Section name may not be changed to the same name as another Design Section under the same parent section', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
        // Check both Sections are there
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section2', 'Design1', 'DesignVersion1', 1));

        // Execute - try to update Section2 to Section1
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section2');
        const expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_NAME_DUPLICATE_FOR_PARENT};
        DesignComponentActions.designerEditsSelectedComponentNameTo_('Section1', expectation);

        // Verify - not changed to Section1 - should still be Section2
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section2', 'Design1', 'DesignVersion1', 1));


    });

    it('A Feature Aspect name may not be changed to the same name as another Feature Aspect in the same Feature', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
        // Check both feature aspects are there - note there are 3 of each in the default test data
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Actions', 'Design1', 'DesignVersion1', 3));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Conditions', 'Design1', 'DesignVersion1', 3));

        // Execute - try to update Actions to Conditions
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');
        const expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_NAME_DUPLICATE_FOR_PARENT};
        DesignComponentActions.designerEditsSelectedComponentNameTo_('Conditions', expectation);

        // Verify - not changed
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Actions', 'Design1', 'DesignVersion1', 3));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Conditions', 'Design1', 'DesignVersion1', 3));
    });

    it('A Design Section name may be changed to the same name as a Design Section in a different parent', function(){
        // Setup - Section99 is in Application99
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
        // Check both Sections are there
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section99', 'Design1', 'DesignVersion1', 1));

        // Execute - update Section1 to Section99
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');
        DesignComponentActions.designerEditsSelectedComponentNameTo_('Section99');

        // Verify - now 2 Section99s
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1', 0));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section99', 'Design1', 'DesignVersion1', 2));
    });

    it('A Feature Aspect name may be changed to the same name as a Feature Aspect in another Feature', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');

        // Add a new Feature Aspect to Feature 1
        DesignComponentActions.designerAddsFeatureAspectToFeature_('Feature1');
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME);
        DesignComponentActions.designerEditsSelectedComponentNameTo_('Aspect1');

        // Add a new Feature Aspect to Feature 2
        DesignComponentActions.designerAddsFeatureAspectToFeature_('Feature2');

        // Execute - And call it the same name
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature2', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME);
        DesignComponentActions.designerEditsSelectedComponentNameTo_('Aspect1');

        // Verify - now 2 Aspect1s
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Aspect1', 'Design1', 'DesignVersion1', 2));
    });


    // Consequences
    it('Updating the name of a Design Component in a base Design Version updates it in any related Work Package', function(){

        // Setup
        // Publish DV1
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        // Add 2 work packages
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerAddsBaseDesignWorkPackage();
        WorkPackageActions.managerSelectsWorkPackage(DefaultItemNames.NEW_WORK_PACKAGE_NAME);
        WorkPackageActions.managerUpdatesSelectedWpNameTo('WorkPackage1');
        WorkPackageActions.managerAddsBaseDesignWorkPackage();
        WorkPackageActions.managerSelectsWorkPackage(DefaultItemNames.NEW_WORK_PACKAGE_NAME);
        WorkPackageActions.managerUpdatesSelectedWpNameTo('WorkPackage2');

        // Put Feature1 in scope in WP1
        WorkPackageActions.managerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.managerEditsSelectedBaseWorkPackage();
        WpComponentActions.managerAddsFeatureToScopeForCurrentBaseWp('Section1', 'Feature1');

        // Execute
        // Designer changes Feature1 to Feature11 in the base version
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
        DesignComponentActions.designerSelectsFeature('Section1', 'Feature1');
        DesignComponentActions.designerEditsSelectedComponentNameTo_('Feature11');

        // Validate - both WPs have Feature11, neither has Feature1 and Feature11 in scope in WP1
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.managerEditsSelectedBaseWorkPackage();
        expect(WpComponentVerifications.componentDoesNotExistForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentExistsForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature11'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature11'));

        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerSelectsWorkPackage('WorkPackage2');
        WorkPackageActions.managerEditsSelectedBaseWorkPackage();
        expect(WpComponentVerifications.componentDoesNotExistForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentExistsForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature11'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature11'));

    });

});
