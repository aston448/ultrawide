
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
import {DesignUpdateComponentValidationErrors} from '../../imports/constants/validation_errors.js';

describe('UC 550 - Add Organisational Design Update Component', function(){

    before(function(){

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();

        // Complete the Design Version and create the next
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2')
    });

    after(function(){

    });

    beforeEach(function(){

        // Remove any Design Updates before each test
        TestFixtures.clearDesignUpdates();

        // Add a new Design Update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdate();
        DesignUpdateActions.designerSelectsUpdate(DefaultItemNames.NEW_DESIGN_UPDATE_NAME);
        DesignUpdateActions.designerEditsSelectedUpdateNameTo('DesignUpdate1');
    });

    afterEach(function(){

    });


    // Actions
    it('An Application can be added to a Design Update', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Add Application
        UpdateComponentActions.designerAddsApplicationToCurrentUpdate();

        // Verify
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', DefaultComponentNames.NEW_APPLICATION_NAME));

    });

    it('A Design Section can be added to a Design Update Application', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Add new Section to original Application 1
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateApplication('Application1');

        // Verify
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', DefaultComponentNames.NEW_DESIGN_SECTION_NAME));
    });

    it('A Design Section can be added to a Design Update Design Section', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Add new Section to original Section 1
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateSection('Application1', 'Section1');

        // Verify
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Section1', DefaultComponentNames.NEW_DESIGN_SECTION_NAME));
    });

    it('A Feature Aspect can be added to an in Scope Design Update Feature', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Make sure Feature1 is in Scope
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');

        // Add new Feature Aspect to Feature1
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateFeature('Section1', 'Feature1');

        // Verify
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME));
    });


    // Conditions
    it('A Feature Aspect cannot be added to a Feature that is not in Scope for the Design Update', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        // Don't add Feature1 to scope

        // Add new Feature Aspect to Feature1
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_COMPONENT_ADD};
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateFeature('Section1', 'Feature1', expectation);

        // Verify
        expect(UpdateComponentVerifications.componentDoesNotExistForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME));
    });

    it('An organisational Design Update Component cannot be added to a component removed in this or another Design Update', function(){

        // Setup
        // And another update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');
        // Delete Section2 in that update
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');
        UpdateComponentActions.designerLogicallyDeletesUpdateSection('Application1', 'Section2');

        // Execute - try to add SubSection3 to Section2 in DU1.  Note: need to add to a non-scopable component for this failure to be possible
        // as otherwise it would not be possible to scope the parent and would fail because parent not scoped
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_ADDABLE_PARENT_REMOVED};
        UpdateComponentActions.designerAddsDesignSectionTo_Section_Called('Application1', 'Section2', 'SubSection3');

        // Verify - no new section
        expect(UpdateComponentVerifications.componentDoesNotExistForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'SubSection3'));

    });


    // Consequences
    it('When an organisational Design Component is added to a Design Update it is also added to the Design Update Scope', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Add new Section to original Application 1
        UpdateComponentActions.designerAddsDesignSectionToApplication_Called('Application1', 'Section3');

        // Verify - added as Parent Scope
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section3'));
        expect(UpdateComponentVerifications.componentIsInParentScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section3'));
    });

    it('When an organisational Design Component is added to a Draft Design Update is is also added to any Work Package including the update', function(){

        // Setup
        // Create a WP based on DU1
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerAddsUpdateWorkPackageCalled('UpdateWorkPackage1');

        // Execute - Designer Adds Section3 to DU1
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsDesignSectionToApplication_Called('Application1', 'Section3');

        // Verify - Section3 is in the WP now too
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerEditsUpdateWorkPackage('UpdateWorkPackage1');
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section3'));

    });

    it('An organisational Design Component added to a Design Update appears as an organisational addition in the Design Update summary');

});
