
import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { UserContextVerifications }     from '../../../test_framework/test_wrappers/user_context_verifications.js';

import {RoleType} from '../../../imports/constants/constants.js'

describe('UC 140 - Edit Design Version Content', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 140 - Edit Design Version');
    });

    after(function(){

    });

    beforeEach(function(){

        TestFixtures.clearAllData();

        // Add  Basic Design / Design Version
        TestFixtures.addDesignWithDefaultData();
    });

    afterEach(function(){

    });


    describe('Actions', function(){


        describe('A Designer can edit a New or Published Base Design Version', function(){

            it('Item Status - New', function(){

                // Setup
                // Make sure the design is in the user context and the design version isn't
                DesignActions.designerSelectsDesign('Design1');
                expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.DESIGNER));

                // Execute
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');

                // Verify
                // The Design version will be in the user context if now editing - other evidence is interface specific and can only be seen in acceptance tests
                expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.DESIGNER, 'DesignVersion1'));
            });


            it('Item Status - Published', function(){

                // Setup
                // Make sure the design is in the user context
                DesignActions.designerSelectsDesign('Design1');
                // Publish it
                DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
                // Go back and select the Design so that no Design Version in user context
                DesignActions.designerSelectsDesign('Design1');
                expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.DESIGNER));

                // Execute
                DesignVersionActions.designerEditsDesignVersion('DesignVersion1');

                // Verify
                // The Design version will be in the user context if now editing - other evidence is interface specific and can only be seen in acceptance tests
                expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.DESIGNER, 'DesignVersion1'));
            });

        });
    });
});
