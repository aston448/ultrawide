
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

describe('UC 557 - Edit Design Update Feature Narrative', function(){

    before(function(){

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();

        // Complete the Design Version and create the next
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2');
    });

    after(function(){

    });

    beforeEach(function(){

        // Remove any Design Updates before each test
        TestFixtures.clearDesgnUpdates();

        // Add a new Design Update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdate();
        DesignUpdateActions.designerSelectsUpdate(DefaultItemNames.NEW_DESIGN_UPDATE_NAME);
        DesignUpdateActions.designerEditsSelectedUpdateNameTo('DesignUpdate1');
    });

    afterEach(function(){

    });


    // Actions
    it('A Designer may edit the Narrative of a new Design Update Feature', function(){

        const newNarrative = 'As a Designer\nI want to update my Narrative\nSo that I can clarify what my Feature is about\n';

        // Setup - add new Feature to Section1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section1', 'Feature3');
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section1', 'Feature3');
        expect(UpdateComponentVerifications.designerSelectedFeatureNarrativeIs(DefaultComponentNames.NEW_NARRATIVE_TEXT));

        // Execute
        UpdateComponentActions.designerUpdatesSelectedUpdateFeatureNarrativeTo(newNarrative);

        // Verify
        expect(UpdateComponentVerifications.designerSelectedFeatureNarrativeIs(newNarrative));
    });

    it('A Designer may edit the Narrative of an existing Feature that is in Scope for the Design Update', function(){

        let newNarrative = 'As a Designer\nI want to update my Narrative\nSo that I can clarify what my Feature is about\n';

        // Setup - add Feature to Scope
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section1', 'Feature1');
        expect(UpdateComponentVerifications.designerSelectedFeatureNarrativeIs(DefaultComponentNames.NEW_NARRATIVE_TEXT));

        // Execute
        UpdateComponentActions.designerUpdatesSelectedUpdateFeatureNarrativeTo(newNarrative);

        // Verify
        expect(UpdateComponentVerifications.designerSelectedFeatureNarrativeIs(newNarrative));
    });


    // Conditions
    it('An existing Design Update Feature Narrative cannot be edited if the Feature is not in Scope', function(){

        let newNarrative = 'As a Designer\nI want to update my Narrative\nSo that I can clarify what my Feature is about\n';

        // Setup - don't add Feature to Scope
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section1', 'Feature1');
        expect(UpdateComponentVerifications.designerSelectedFeatureNarrativeIs(DefaultComponentNames.NEW_NARRATIVE_TEXT));

        // Execute
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_SCOPE_EDIT};
        UpdateComponentActions.designerUpdatesSelectedUpdateFeatureNarrativeTo(newNarrative, expectation);

        // Verify unchanged
        expect(UpdateComponentVerifications.designerSelectedFeatureNarrativeIs(DefaultComponentNames.NEW_NARRATIVE_TEXT));
    });

});
