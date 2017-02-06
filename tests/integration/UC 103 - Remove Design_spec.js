import TestFixtures                 from '../../test_framework/test_wrappers/test_fixtures.js';
import DesignActions                from '../../test_framework/test_wrappers/design_actions.js';
import DesignVersionActions         from '../../test_framework/test_wrappers/design_version_actions.js';
import DesignUpdateActions          from '../../test_framework/test_wrappers/design_update_actions.js';
import DesignComponentActions       from '../../test_framework/test_wrappers/design_component_actions.js';
import UpdateComponentActions       from '../../test_framework/test_wrappers/design_update_component_actions.js';
import DesignVerifications          from '../../test_framework/test_wrappers/design_verifications.js';
import DesignComponentVerifications from '../../test_framework/test_wrappers/design_component_verifications.js';
import UserContextVerifications     from '../../test_framework/test_wrappers/user_context_verifications.js';

import {RoleType, ComponentType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';
import {DesignValidationErrors} from '../../imports/constants/validation_errors.js';

describe('UC 103 - Remove Design', function() {

    beforeEach(function(){
        TestFixtures.clearAllData();

        // Add  Design - Design1
        DesignActions.designerAddsNewDesignCalled('Design1');
    });

    afterEach(function(){

    });

    // Actions
    it('A Designer can remove a Design that is removable', function() {
        // Execute -----------------------------------------------------------------------------------------------------
        DesignActions.designerRemovesDesign('Design1');

        // Verify ------------------------------------------------------------------------------------------------------
        // Design should not exist
        expect(DesignVerifications.designDoesNotExistCalled('Design1'));
    });

    // Conditions
    it('A Design can only be removed if it has no Features', function() {
        // Setup -------------------------------------------------------------------------------------------------------
        // Work on Design1
        DesignActions.designerWorksOnDesign('Design1');
        // And edit the default Design Version
        DesignVersionActions.designerEditsDesignVersion(DefaultItemNames.NEW_DESIGN_VERSION_NAME);
        // Add an Application - Application1
        DesignComponentActions.designerAddsApplicationCalled('Application1');
        // Add a Design Section - Section1
        DesignComponentActions.designerAddsDesignSectionToApplication_Called('Application1', 'Section1');
        // Add a Feature - Feature1
        DesignComponentActions.designerAddsFeatureToSection_Called('Section1', 'Feature1');

        // Execute -----------------------------------------------------------------------------------------------------
        const expectation = {success: false, message: DesignValidationErrors.DESIGN_NOT_REMOVABLE};
        DesignActions.designerRemovesDesign('Design1', expectation);

        // Verify ------------------------------------------------------------------------------------------------------
        // Design should still exist
        expect(DesignVerifications.designExistsCalled('Design1'));
    });

    it('A Design without Features cannot be removed if it contains a Design Update with Features', function() {
        // Setup -------------------------------------------------------------------------------------------------------
        // Work on Design1
        DesignActions.designerWorksOnDesign('Design1');
        // Name and Publish a Design Version
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'DesignVersion1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        // Complete the Design Version and create the next Updatable version
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2');

        // Add a new Design Update
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');

        // And edit the new Design Update
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Add an Application - Application1
        UpdateComponentActions.designerAddsApplicationCalled('Application1');
        // Add a Design Section - Section1
        UpdateComponentActions.designerAddsDesignSectionToApplication_Called('Application1', 'Section1');
        // Add a Feature - Feature1
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section1', 'Feature1');

        // Execute -----------------------------------------------------------------------------------------------------
        const expectation = {success: false, message: DesignValidationErrors.DESIGN_NOT_REMOVABLE};
        DesignActions.designerRemovesDesign('Design1', expectation);

        // Verify ------------------------------------------------------------------------------------------------------
        // Design should still exist
        expect(DesignVerifications.designExistsCalled('Design1'));
    });

    // Consequences
    it('When a Design is removed, any user with that Design as their default has the default cleared', function() {
        // Setup -------------------------------------------------------------------------------------------------------
        // Work on Design1
        DesignActions.designerWorksOnDesign('Design1');
        // Make sure all users have selected Design1
        DesignActions.designerSelectsDesign('Design1');
        DesignActions.developerSelectsDesign('Design1');
        DesignActions.managerSelectsDesign('Design1');

        // Check
        expect(UserContextVerifications.userContextForRole_DesignIs(RoleType.DESIGNER, 'Design1'));
        expect(UserContextVerifications.userContextForRole_DesignIs(RoleType.DEVELOPER, 'Design1'));
        expect(UserContextVerifications.userContextForRole_DesignIs(RoleType.MANAGER, 'Design1'));

        // Execute -----------------------------------------------------------------------------------------------------
        DesignActions.designerRemovesDesign('Design1');

        // Verify ------------------------------------------------------------------------------------------------------
        // Design1 removed from user contexts
        expect(UserContextVerifications.userContextDesignNotSetForRole(RoleType.DESIGNER));
        expect(UserContextVerifications.userContextDesignNotSetForRole(RoleType.DEVELOPER));
        expect(UserContextVerifications.userContextDesignNotSetForRole(RoleType.MANAGER));
    });

    it('When a Design is removed, all subcomponents of that Design are deleted', function() {
        // Setup -------------------------------------------------------------------------------------------------------
        // Work on Design1
        DesignActions.designerWorksOnDesign('Design1');
        // And edit the default Design Version
        DesignVersionActions.designerEditsDesignVersion(DefaultItemNames.NEW_DESIGN_VERSION_NAME);
        // Add an Application - Application1
        DesignComponentActions.designerAddsApplicationCalled('Application1');
        // Add a Design Section - Section1
        DesignComponentActions.designerAddsDesignSectionToApplication_Called('Application1', 'Section1');

        // Execute -----------------------------------------------------------------------------------------------------
        DesignActions.designerRemovesDesign('Design1');

        // Verify ------------------------------------------------------------------------------------------------------
        // Design should not exist
        expect(DesignVerifications.designDoesNotExistCalled('Design1'));
        // Application should not exist
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExist(ComponentType.APPLICATION, 'Application1'));
        // Design Section should not exist
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExist(ComponentType.DESIGN_SECTION, 'Section1'));

    });

});

