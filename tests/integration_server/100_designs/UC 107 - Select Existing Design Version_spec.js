
import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { DesignComponentActions }       from '../../../test_framework/test_wrappers/design_component_actions.js';
import { UserContextVerifications }     from '../../../test_framework/test_wrappers/user_context_verifications.js';

import {RoleType, ComponentType} from '../../../imports/constants/constants.js'
import {DefaultItemNames} from '../../../imports/constants/default_names.js';

describe('UC 107 - Select Existing Design Version', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 107 - Select Existing Design Version');
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


    describe('Actions', function(){

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

    });

    describe('Consequences', function(){

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
});
