
import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { DesignUpdateActions }          from '../../../test_framework/test_wrappers/design_update_actions.js';
import { UpdateComponentActions }       from '../../../test_framework/test_wrappers/design_update_component_actions.js';
import { DesignUpdateVerifications }    from '../../../test_framework/test_wrappers/design_update_verifications.js';
import { UpdateComponentVerifications } from '../../../test_framework/test_wrappers/design_update_component_verifications.js';

import {ComponentType} from '../../../imports/constants/constants.js'
import {DefaultItemNames} from '../../../imports/constants/default_names.js';

describe('UC 501 - Add New Design Update', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 501 - Add New Design Update');

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
    });

    afterEach(function(){

    });


    // Actions
    it('A Designer may add a Design Update to an Updatable Design Version', function(){

        // Setup
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');

        // Execute
        DesignUpdateActions.designerAddsAnUpdate();

        // Verify
        expect(DesignUpdateVerifications.updateExistsForDesignerCalled(DefaultItemNames.NEW_DESIGN_UPDATE_NAME));
    });


    // Consequences
    it('When a new Design Update is added any removals made in other Design Updates for the Design Version are visible', function(){

        // Setup
        // Add an update with a removal in it
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateScope('Application1', 'Section1');
        UpdateComponentActions.designerLogicallyDeletesUpdateSection('Application1', 'Section1');
        // Make sure that changes are public
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');

        // Execute
        // Add a second update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');

        // Verify - removed stuff is marked as removed in the scope
        expect(UpdateComponentVerifications.updateScopeComponentIsRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.updateScopeComponentIsRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.updateScopeComponentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.updateScopeComponentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
    });

    it('When a new Design Update is added any additions or changes made in other Design Updates for the Design Version are not visible',function(){

        // Setup
        // Add an update with an addition and modification in it
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsApplicationCalled('Application2');
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.APPLICATION, 'NONE', 'Application1');
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('OldApplication');

        // Make sure that changes are public
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');

        // Execute
        // Add a second update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');

        // Verify that in this update we are still starting from the baseline
        // No new App2
        expect(UpdateComponentVerifications.componentIsNotAvailableForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application2'));
        // App1 still has old name
        expect(UpdateComponentVerifications.componentIsNotAvailableForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'OldApplication'));
        expect(UpdateComponentVerifications.componentIsAvailableForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application1'));
    })

});
