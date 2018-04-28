
import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { DesignUpdateActions }          from '../../../test_framework/test_wrappers/design_update_actions.js';
import { UpdateComponentActions }       from '../../../test_framework/test_wrappers/design_update_component_actions.js';;
import { UpdateComponentVerifications } from '../../../test_framework/test_wrappers/design_update_component_verifications.js';

import {ComponentType} from '../../../imports/constants/constants.js'
import {DefaultItemNames} from '../../../imports/constants/default_names.js';

describe('UC 522 - Select Design Update Component', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 522 - Select Design Update Component');

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();

        // Complete the Design Version and create the next
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2');

        // Add a published update to DV2
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');

    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });


    // Actions
    it('An Application in a Design Update may be selected', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');

        // Execute
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.APPLICATION, 'NONE', 'Application1');

        // Verify - now the selected component for user
        expect(UpdateComponentVerifications.designerSelectedComponentIs(ComponentType.APPLICATION, 'NONE', 'Application1'));

    });

    it('A Design Section in a Design Update may be selected', function() {

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateScope('Application1', 'Section1');

        // Execute
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');

        // Verify - now the selected component for user
        expect(UpdateComponentVerifications.designerSelectedComponentIs(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
    });

    it('A Feature in a Design Update may be selected', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');

        // Execute
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section1', 'Feature1');

        // Verify - now the selected component for user
        expect(UpdateComponentVerifications.designerSelectedComponentIs(ComponentType.FEATURE, 'Section1', 'Feature1'));
    });

    it('A Feature Aspect in a Design Update may be selected', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');

        // Execute
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');

        // Verify - now the selected component for user
        expect(UpdateComponentVerifications.designerSelectedComponentIs(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
    });

    it('A Scenario in a Design Update may be selected', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');

        // Execute
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.SCENARIO, 'Actions', 'Scenario1');

        // Verify - now the selected component for user
        expect(UpdateComponentVerifications.designerSelectedComponentIs(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
    });

});
