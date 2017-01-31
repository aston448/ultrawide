
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

describe('UC 147 - Edit Feature Narrative', function(){

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


    // Interface
    it('Each Feature has a default Narrative template', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');

        // Verify default Narrative template is there
        expect(DesignComponentVerifications.feature_NarrativeIs('Feature1', DefaultComponentNames.NEW_NARRATIVE_TEXT));

    });

    it('Each Narrative has an option to edit it');

    it('A Narrative being edited has an option to save changes');

    it('A Narrative being edited has an option to discard any changes');


    // Actions
    it('A Designer can edit and save a Feature Narrative', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');

        let oldNarrative = DefaultComponentNames.NEW_NARRATIVE_TEXT;
        let newNarrative = 'As a hen\nI want to peck\nSo that I can eat';
        // Check
        expect(DesignComponentVerifications.feature_NarrativeIs('Feature1', oldNarrative));

        // Execute
        DesignComponentActions.designerSelectFeature('Section1', 'Feature1');
        DesignComponentActions.designerEditSelectedFeatureNarrativeTo(newNarrative);

        // Verify
        expect(DesignComponentVerifications.feature_NarrativeIs('Feature1', newNarrative));
    });

    it('A designer can edit but then discard changes to a Feature Narrative');


    // Conditions
    it('A Feature Narrative can only be edited when in edit mode');


    // Consequences
    it('When a Narrative is updated in a base Design Version, any related Design Updates are updated');

    it('When a Narrative is updated in a base Design Version, any related Work Packages are updated');

});
