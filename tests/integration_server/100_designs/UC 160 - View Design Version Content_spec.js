
import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { UserContextVerifications }     from '../../../test_framework/test_wrappers/user_context_verifications.js';
import {DesignVersionVerifications}     from "../../../test_framework/test_wrappers/design_version_verifications";

import {DesignVersionStatus, RoleType} from '../../../imports/constants/constants.js'
import {DefaultItemNames} from "../../../imports/constants/default_names";


describe('UC 160 - View Design Version Content', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 160 - View Design Version Content');
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


        describe('A Designer can view an New Design Version', function(){

            it('User Role - Designer', function(){
                // Setup
                // Make sure the design is in the user context and the design version isn't
                DesignActions.designerSelectsDesign('Design1');
                expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion1', DesignVersionStatus.VERSION_NEW));
                expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.DESIGNER));

                // Execute
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');

                // Verify
                // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
                expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.DESIGNER, 'DesignVersion1'));
            });

        });

        describe('All roles can view a Published Design Version', function(){

            it('User Role - Designer', function(){
                // Set Up Design Version as Published
                DesignActions.designerSelectsDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
                expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion1', DesignVersionStatus.VERSION_DRAFT));

                // Make sure the design is in the user context and the design version isn't
                DesignActions.designerSelectsDesign('Design1');
                expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.DESIGNER));

                // Execute
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');

                // Verify
                // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
                expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.DESIGNER, 'DesignVersion1'));
            });


            it('User Role - Developer', function(){
                // Set Up Design Version as Published
                DesignActions.designerSelectsDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
                expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion1', DesignVersionStatus.VERSION_DRAFT));

                // Make sure the design is in the user context and the design version isn't
                DesignActions.developerSelectsDesign('Design1');
                expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.DEVELOPER));

                // Execute
                DesignVersionActions.developerViewsDesignVersion('DesignVersion1');

                // Verify
                // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
                expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.DEVELOPER, 'DesignVersion1'));
            });


            it('User Role - Manager', function(){
                // Set Up Design Version as Published
                DesignActions.designerSelectsDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
                expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion1', DesignVersionStatus.VERSION_DRAFT));

                // Make sure the design is in the user context and the design version isn't
                DesignActions.managerSelectsDesign('Design1');
                expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.MANAGER));

                // Execute
                DesignVersionActions.managerViewsDesignVersion('DesignVersion1');

                // Verify
                // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
                expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.MANAGER, 'DesignVersion1'));
            });


            it('User Role - Guest', function(){
                // Set Up Design Version as Published
                DesignActions.designerSelectsDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
                expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion1', DesignVersionStatus.VERSION_DRAFT));

                // Make sure the design is in the user context and the design version isn't
                DesignActions.guestSelectsDesign('Design1');
                expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.GUEST_VIEWER));

                // Execute
                DesignVersionActions.guestViewsDesignVersion('DesignVersion1');

                // Verify
                // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
                expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.GUEST_VIEWER, 'DesignVersion1'));
            });

        });

        describe('All roles can view a Complete Design Version', function(){

            it('User Role - Designer', function(){
                // Set Up Design Version as Completed
                DesignActions.designerSelectsDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
                // Complete DV1 by creating next DV...
                DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
                expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion1', DesignVersionStatus.VERSION_DRAFT_COMPLETE));

                // Make sure the design is in the user context and the design version isn't
                DesignActions.designerSelectsDesign('Design1');
                expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.DESIGNER));

                // Execute
                DesignVersionActions.designerViewsDesignVersion('DesignVersion1');

                // Verify
                // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
                expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.DESIGNER, 'DesignVersion1'));
            });


            it('User Role - Developer', function(){
                // Set Up Design Version as Completed
                DesignActions.designerSelectsDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
                // Complete DV1 by creating next DV...
                DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
                expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion1', DesignVersionStatus.VERSION_DRAFT_COMPLETE));

                // Make sure the design is in the user context and the design version isn't
                DesignActions.developerSelectsDesign('Design1');
                expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.DEVELOPER));

                // Execute
                DesignVersionActions.developerViewsDesignVersion('DesignVersion1');

                // Verify
                // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
                expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.DEVELOPER, 'DesignVersion1'));
            });


            it('User Role - Manager', function(){
                // Set Up Design Version as Completed
                DesignActions.designerSelectsDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
                // Complete DV1 by creating next DV...
                DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
                expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion1', DesignVersionStatus.VERSION_DRAFT_COMPLETE));

                // Make sure the design is in the user context and the design version isn't
                DesignActions.managerSelectsDesign('Design1');
                expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.MANAGER));

                // Execute
                DesignVersionActions.managerViewsDesignVersion('DesignVersion1');

                // Verify
                // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
                expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.MANAGER, 'DesignVersion1'));
            });


            it('User Role - Guest', function(){
                // Set Up Design Version as Completed
                DesignActions.designerSelectsDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
                // Complete DV1 by creating next DV...
                DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
                expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion1', DesignVersionStatus.VERSION_DRAFT_COMPLETE));

                // Make sure the design is in the user context and the design version isn't
                DesignActions.guestSelectsDesign('Design1');
                expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.GUEST_VIEWER));

                // Execute
                DesignVersionActions.guestViewsDesignVersion('DesignVersion1');

                // Verify
                // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
                expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.GUEST_VIEWER, 'DesignVersion1'));
            });

        });

        describe('All roles can view an Updatable Design Version', function(){

            it('User Role - Designer', function(){
                // Set Up Design Version as Updatable
                DesignActions.designerSelectsDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
                DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
                DesignVersionActions.designerSelectsDesignVersion(DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
                DesignVersionActions.designerUpdatesDesignVersionNameTo('DesignVersion2');
                expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion2', DesignVersionStatus.VERSION_UPDATABLE));

                // Make sure the design is in the user context and the design version isn't
                DesignActions.designerSelectsDesign('Design1');
                expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.DESIGNER));

                // Execute
                DesignVersionActions.designerViewsDesignVersion('DesignVersion2');

                // Verify
                // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
                expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.DESIGNER, 'DesignVersion2'));
            });


            it('User Role - Developer', function(){
                // Set Up Design Version as Updatable
                DesignActions.designerSelectsDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
                DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
                DesignVersionActions.designerSelectsDesignVersion(DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
                DesignVersionActions.designerUpdatesDesignVersionNameTo('DesignVersion2');
                expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion2', DesignVersionStatus.VERSION_UPDATABLE));

                // Make sure the design is in the user context and the design version isn't
                DesignActions.developerSelectsDesign('Design1');
                expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.DEVELOPER));

                // Execute
                DesignVersionActions.developerViewsDesignVersion('DesignVersion2');

                // Verify
                // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
                expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.DEVELOPER, 'DesignVersion2'));
            });


            it('User Role - Manager', function(){
                // Set Up Design Version as Updatable
                DesignActions.designerSelectsDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
                DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
                DesignVersionActions.designerSelectsDesignVersion(DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
                DesignVersionActions.designerUpdatesDesignVersionNameTo('DesignVersion2');
                expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion2', DesignVersionStatus.VERSION_UPDATABLE));

                // Make sure the design is in the user context and the design version isn't
                DesignActions.managerSelectsDesign('Design1');
                expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.MANAGER));

                // Execute
                DesignVersionActions.managerViewsDesignVersion('DesignVersion2');

                // Verify
                // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
                expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.MANAGER, 'DesignVersion2'));
            });


            it('User Role - Guest', function(){
                // Set Up Design Version as Updatable
                DesignActions.designerSelectsDesign('Design1');
                DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
                DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
                DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
                DesignVersionActions.designerSelectsDesignVersion(DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
                DesignVersionActions.designerUpdatesDesignVersionNameTo('DesignVersion2');
                expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion2', DesignVersionStatus.VERSION_UPDATABLE));

                // Make sure the design is in the user context and the design version isn't
                DesignActions.guestSelectsDesign('Design1');
                expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.GUEST_VIEWER));

                // Execute
                DesignVersionActions.guestViewsDesignVersion('DesignVersion2');

                // Verify
                // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
                expect(UserContextVerifications.userContextForRole_DesignVersionIs(RoleType.GUEST_VIEWER, 'DesignVersion2'));
            });

        });
    });

    describe('Consequences', function(){

        it('When a completed Updatable Design Version is viewed any Design Components removed in that version are not shown', function(){
            // Replace this with test code
            expect.fail(null, null, 'Test not implemented yet');
        });

    });
});