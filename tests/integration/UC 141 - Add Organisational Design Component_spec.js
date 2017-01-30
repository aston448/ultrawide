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

describe('UC 141 - Add Organisational Design Component', function(){

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
    it('A Design Section may be added to an Application', function(){

        // Setup
        // Edit the default Design Version
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');

        // Execute
        // Add a Design Section
        DesignComponentActions.designerAddDesignSectionToApplication_('Application1');


        // Verify - New Design Section in Application1
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Design1', 'DesignVersion1', 'Application1'));
    });


    it('A Design Section may be added to another Design Section as a subsection', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');

        // Execute - add new section to 'Section1'
        DesignComponentActions.designerAddDesignSectionToDesignSection_('Section1');

        // Verify - new component added with parent Section1
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Design1', 'DesignVersion1', 'Section1'));
    });

    it('A Feature Aspect may be added to a Feature', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');

        // Execute - add new section to 'Section1'
        DesignComponentActions.designerAddFeatureAspectToFeature_('Feature1');

        // Verify - new component added
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Design1', 'DesignVersion1', 'Feature1'));
    });


    // Conditions
    it('Only a Designer may add organisational components');

    it('Organisational components may only be added when in edit mode');


    // Consequences
    it('Adding an organisational component to a base Design Version makes it available in any Design Updates based on that version');

    it('Adding an organisational component to a base Design Version makes it available in any Work Packages based on that version');

});
