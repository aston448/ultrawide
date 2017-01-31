
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

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

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
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');

        // Execute
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application1');
        DesignComponentActions.designerEditSelectedComponentNameTo_('My App');

        // Verify
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'My App', 'Design1', 'DesignVersion1'));

    });

    it('A Design Component name can be edited but then the changes discarded');


    // Conditions
    it('An Application name may not be changed to the same name as another Application in the Design', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        // Add another App
        DesignComponentActions.designerAddApplication();
        // Should be one with the default name too now
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.APPLICATION, 'Application1', 'Design1', 'DesignVersion1', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Design1', 'DesignVersion1', 1));

        // Execute
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.APPLICATION, 'NONE', DefaultComponentNames.NEW_APPLICATION_NAME);
        DesignComponentActions.designerEditSelectedComponentNameTo_('Application1');

        // Verify - not changed to Application1 - should still be the default
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.APPLICATION, 'Application1', 'Design1', 'DesignVersion1', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Design1', 'DesignVersion1', 1));
    });

    it('A Feature name may not be changed to the same name as another Feature in the Design', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        // Check both features are there (from default setup)
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion1', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature2', 'Design1', 'DesignVersion1', 1));

        // Execute - try to update Feature2 to Feature1
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.FEATURE, 'Section2', 'Feature2');
        DesignComponentActions.designerEditSelectedComponentNameTo_('Feature1');

        // Verify - not changed to Feature1 - should still be Feature2
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion1', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature2', 'Design1', 'DesignVersion1', 1));
    });

    it('A Scenario name may not be changed to the same name as another Scenario in the Design', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        // Check both scenarios are there
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario1', 'Design1', 'DesignVersion1', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario2', 'Design1', 'DesignVersion1', 1));

        // Execute - try to update Scenario2 to Scenario1
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.SCENARIO, 'Conditions', 'Scenario2');
        DesignComponentActions.designerEditSelectedComponentNameTo_('Scenario1');

        // Verify - not changed to Scenario1 - should still be Scenario2
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario1', 'Design1', 'DesignVersion1', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario2', 'Design1', 'DesignVersion1', 1));
    });

    it('A Design Section name may not be changed to the same name as another Design Section under the same parent section', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        // Check both Sections are there
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section2', 'Design1', 'DesignVersion1', 1));

        // Execute - try to update Section2 to Section1
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section2');
        DesignComponentActions.designerEditSelectedComponentNameTo_('Section1');

        // Verify - not changed to Section1 - should still be Section2
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section2', 'Design1', 'DesignVersion1', 1));


    });

    it('A Feature Aspect name may not be changed to the same name as another Feature Aspect in the same Feature', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        // Check both feature aspects are there
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Actions', 'Design1', 'DesignVersion1', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Conditions', 'Design1', 'DesignVersion1', 1));

        // Execute - try to update Actions to Conditions
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');
        DesignComponentActions.designerEditSelectedComponentNameTo_('Conditions');

        // Verify - not changed
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Actions', 'Design1', 'DesignVersion1', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Conditions', 'Design1', 'DesignVersion1', 1));
    });

    it('A Design Section name may be changed to the same name as a Design Section in a different parent', function(){
        // Setup - Section99 is in Application99
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        // Check both Sections are there
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section99', 'Design1', 'DesignVersion1', 1));

        // Execute - update Section1 to Section99
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');
        DesignComponentActions.designerEditSelectedComponentNameTo_('Section99');

        // Verify - now 2 Section99s
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1', 0));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section99', 'Design1', 'DesignVersion1', 2));
    });

    it('A Feature Aspect name may be changed to the same name as a Feature Aspect in another Feature', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');

        // Add a new Feature Aspect to Feature 1
        DesignComponentActions.designerAddFeatureAspectToFeature_('Feature1');
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME);
        DesignComponentActions.designerEditSelectedComponentNameTo_('Aspect1');

        // Add a new Feature Aspect to Feature 2
        DesignComponentActions.designerAddFeatureAspectToFeature_('Feature2');

        // Execute - And call it the same name
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature2', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME);
        DesignComponentActions.designerEditSelectedComponentNameTo_('Aspect1');

        // Verify - now 2 Aspect1s
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Aspect1', 'Design1', 'DesignVersion1', 2));
    });


    // Consequences
    it('Updating the name of a Design Component in a base Design Version updates it in any related Design Update');

    it('Updating the name of a Design Component in a base Design Version updates it in any related Work Package');

});
