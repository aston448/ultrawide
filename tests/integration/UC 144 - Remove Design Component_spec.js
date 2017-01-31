
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

describe('UC 144 - Remove Design Component', function(){

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
    it('A Scenario with no Scenario Steps may be removed from a Design Version', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario1', 'Design1', 'DesignVersion1', 1));

        // Execute
        DesignComponentActions.designerRemoveDesignComponentOfType_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario1');

        // Verify
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario1', 'Design1', 'DesignVersion1', 0));
    });

    it('A Feature Aspect with no Scenarios may be removed from a Design Version', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        // Remove Scenarios so Aspect can be removed
        DesignComponentActions.designerRemoveDesignComponentOfType_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario1');
        DesignComponentActions.designerRemoveDesignComponentOfType_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario444');
        // There are originally 3 Actions in default data
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Actions', 'Design1', 'DesignVersion1', 3));

        // Execute
        DesignComponentActions.designerRemoveDesignComponentOfType_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');

        // Verify - now only 2
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Actions', 'Design1', 'DesignVersion1', 2));
    });

    it('A Feature with no Feature Aspects or Scenarios may be removed from a Design Version', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        // Remove Scenarios and Feature Aspects from Feature2
        DesignComponentActions.designerRemoveDesignComponentOfType_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario3');
        DesignComponentActions.designerRemoveDesignComponentOfType_WithParent_Called_(ComponentType.SCENARIO, 'Conditions', 'Scenario4');
        DesignComponentActions.designerRemoveDesignComponentOfType_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature2', 'Interface');
        DesignComponentActions.designerRemoveDesignComponentOfType_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions');
        DesignComponentActions.designerRemoveDesignComponentOfType_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions');
        DesignComponentActions.designerRemoveDesignComponentOfType_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature2', 'Consequences');

        // Execute
        DesignComponentActions.designerRemoveDesignComponentOfType_WithParent_Called_(ComponentType.FEATURE, 'Section2', 'Feature2');

        // Verify
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature2', 'Design1', 'DesignVersion1', 0));

    });

    it('A Design Section with no Features or sub sections may be removed from a Design Version', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section99', 'Design1', 'DesignVersion1', 1));

        // Execute - Use Section99
        DesignComponentActions.designerRemoveDesignComponentOfType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application99', 'Section99');

        // Verify
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section99', 'Design1', 'DesignVersion1', 0));
    });

    it('An Application with no Design sections may be removed from a Design Version', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.APPLICATION, 'Application99', 'Design1', 'DesignVersion1', 1));
        // Remove Section99 from Application99
        DesignComponentActions.designerRemoveDesignComponentOfType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application99', 'Section99');

        // Execute
        DesignComponentActions.designerRemoveDesignComponentOfType_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application99');

        // Verify
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.APPLICATION, 'Application99', 'Design1', 'DesignVersion1', 0));
    });


    // Conditions

    it('An Application may only be removed if it has no Design Sections', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.APPLICATION, 'Application99', 'Design1', 'DesignVersion1', 1));

        // Execute
        DesignComponentActions.designerRemoveDesignComponentOfType_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application99');

        // Verify - not removed
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.APPLICATION, 'Application99', 'Design1', 'DesignVersion1', 1));

    });

    it('A Design Section may only be removed if it has no sub sections', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        // Add a sub-section to Section99
        DesignComponentActions.designerAddDesignSectionToDesignSection_('Section99');

        // Execute
        DesignComponentActions.designerRemoveDesignComponentOfType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application99', 'Section99');

        // Verify - not removed
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section99', 'Design1', 'DesignVersion1', 1));

    });

    it ('A Design Section may only be removed if it has no Features', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');

        // Execute
        DesignComponentActions.designerRemoveDesignComponentOfType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');

        // Verify - not removed
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1', 1));
    });

    it('A Feature may only be removed if it has no Feature Aspects', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');

        // Execute
        DesignComponentActions.designerRemoveDesignComponentOfType_WithParent_Called_(ComponentType.FEATURE, 'Section2', 'Feature2');

        // Verify - not removed
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE, 'Feature2', 'Design1', 'DesignVersion1', 1));
    });

    it('A Feature may only be removed if it has no Scenarios');

    it('A Feature Aspect may only be removed if it has no Scenarios', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        // There are originally 3 Actions in default data
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Actions', 'Design1', 'DesignVersion1', 3));

        // Execute
        DesignComponentActions.designerRemoveDesignComponentOfType_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');

        // Verify - not removed
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Actions', 'Design1', 'DesignVersion1', 3));
    });

    it('A Scenario may only be removed if it has no Scenario Steps');



    // Consequences
    it('Removing a Design Component in a base Design Version removes it from any related Design Update');

    it('Removing a Design Component in a base Design Version removes it from any related Work Package');

});
