import TestFixtures                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import DesignActions                from '../../../test_framework/test_wrappers/design_actions.js';
import DesignVersionActions         from '../../../test_framework/test_wrappers/design_version_actions.js';
import DesignUpdateActions          from '../../../test_framework/test_wrappers/design_update_actions.js';
import DesignComponentActions       from '../../../test_framework/test_wrappers/design_component_actions.js';
import UpdateComponentActions       from '../../../test_framework/test_wrappers/design_update_component_actions.js';
import DesignVerifications          from '../../../test_framework/test_wrappers/design_verifications.js';
import DesignUpdateVerifications    from '../../../test_framework/test_wrappers/design_update_verifications.js';
import DesignVersionVerifications   from '../../../test_framework/test_wrappers/design_version_verifications.js';
import DesignComponentVerifications from '../../../test_framework/test_wrappers/design_component_verifications.js';
import UserContextVerifications     from '../../../test_framework/test_wrappers/user_context_verifications.js';

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../../imports/constants/default_names.js';


describe('UC 111 - Select Existing Design Version', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 111 - Select Existing Design Version');
    });

    after(function(){

    });

    beforeEach(function(){

        TestFixtures.clearAllData();

        // Create Design1, DesignVersion1
        TestFixtures.addDesignWithDefaultData();

        // Create a second Design Version
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerSelectsDesignVersion(DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        DesignVersionActions.designerUpdatesDesignVersionNameTo('DesignVersion2');

    });

    afterEach(function(){

    });


    // Actions
    it('An existing Design Version can be selected as the current working Design Version', function(){

        // Work on Design1
        DesignActions.designerWorksOnDesign('Design1');

        // Select DV1
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');

        // Verify Context has DV1
        expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.DESIGNER, 'DesignVersion1'));

        // Select DV2
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');

        // Verify Context has DV2
        expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.DESIGNER, 'DesignVersion2'));

    });


    // Consequences
    it('When a new Design Version is chosen previous user context except for the Design is cleared', function(){

        // Work on Design1
        DesignActions.designerWorksOnDesign('Design1');

        // Select DV1
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');

        // Select a component of DV1
        DesignVersionActions.designerViewsDesignVersion('DesignVersion1');
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');

        expect(UserContextVerifications.userContextForRole_DesignComponentIs(RoleType.DESIGNER, ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));

        // Change to DV2
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');

        // Verify that old design component cleared
        expect(UserContextVerifications.userContextDesignComponentNotSetForRole(RoleType.DESIGNER));
    });

});
