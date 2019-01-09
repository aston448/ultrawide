
import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { DesignVersionVerifications }   from '../../../test_framework/test_wrappers/design_version_verifications.js';

import {DefaultItemNames} from '../../../imports/constants/default_names.js';
import {DesignVersionValidationErrors} from '../../../imports/constants/validation_errors.js';

describe('UC 108 - Edit Design Version Name and Number', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 108 - Edit Design Version Name and Number');
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

        it('A Designer may update the name of a Design Version', function(){

            // Setup
            // Make sure the design and design version is in the user context
            DesignActions.designerSelectsDesign('Design1');
            DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');

            // Execute
            DesignVersionActions.designerUpdatesDesignVersionNameTo('New Name');

            // Verify
            expect(DesignVersionVerifications.currentDesignVersionNameForDesignerIs('New Name'));
        });

        it('A Designer may update the number of a Design Version', function(){

            // Setup
            // Make sure the design and design version is in the user context
            DesignActions.designerSelectsDesign('Design1');
            DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');

            // Execute
            DesignVersionActions.designerUpdatesDesignVersionNumberTo('1.1');

            // Verify
            expect(DesignVersionVerifications.currentDesignVersionNumberForDesignerIs('1.1'));
        });

    });

    describe('Conditions', function(){

        describe('Only a Designer may update a Design Version name', function(){

            it('fails for User Role - Developer', function(){

                // Setup
                DesignActions.developerSelectsDesign('Design1');
                DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');

                // Execute
                const expectation = {success: false, message: DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_UPDATE};
                DesignVersionActions.developerUpdatesDesignVersionNameTo('New Name', expectation);

                // Verify - not changed
                expect(DesignVersionVerifications.currentDesignVersionNameForDeveloperIs('DesignVersion1'));

            });


            it('fails for User Role - Manager', function(){

                // Setup
                DesignActions.managerSelectsDesign('Design1');
                DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');

                // Execute
                const expectation = {success: false, message: DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_UPDATE};
                DesignVersionActions.managerUpdatesDesignVersionNameTo('New Name', expectation);

                // Verify - not changed
                expect(DesignVersionVerifications.currentDesignVersionNameForManagerIs('DesignVersion1'));
            });


            it('fails for User Role - Guest', function(){

                // Setup
                DesignActions.guestSelectsDesign('Design1');
                DesignVersionActions.guestSelectsDesignVersion('DesignVersion1');

                // Execute
                const expectation = {success: false, message: DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_UPDATE};
                DesignVersionActions.guestUpdatesDesignVersionNameTo('New Name', expectation);

                // Verify - not changed
                expect(DesignVersionVerifications.currentDesignVersionNameForGuestIs('DesignVersion1'));
            });

        });

        describe('Only a Designer may update a Design Version number', function(){

            it('fails for User Role - Developer', function(){

                // Setup
                DesignActions.developerSelectsDesign('Design1');
                DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
                expect(DesignVersionVerifications.currentDesignVersionNumberForDeveloperIs(DefaultItemNames.NEW_DESIGN_VERSION_NUMBER));

                // Execute
                const expectation = {success: false, message: DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_UPDATE};
                DesignVersionActions.developerUpdatesDesignVersionNumberTo('1.1', expectation);

                // Verify - not changed
                expect(DesignVersionVerifications.currentDesignVersionNumberForDeveloperIs(DefaultItemNames.NEW_DESIGN_VERSION_NUMBER));
            });


            it('fails for User Role - Manager', function(){

                // Setup
                DesignActions.managerSelectsDesign('Design1');
                DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
                expect(DesignVersionVerifications.currentDesignVersionNumberForManagerIs(DefaultItemNames.NEW_DESIGN_VERSION_NUMBER));

                // Execute
                const expectation = {success: false, message: DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_UPDATE};
                DesignVersionActions.managerUpdatesDesignVersionNumberTo('New Name', expectation);

                // Verify - not changed
                expect(DesignVersionVerifications.currentDesignVersionNumberForManagerIs(DefaultItemNames.NEW_DESIGN_VERSION_NUMBER));
            });


            it('fails for User Role - Guest', function(){

                // Setup
                DesignActions.guestSelectsDesign('Design1');
                DesignVersionActions.guestSelectsDesignVersion('DesignVersion1');
                expect(DesignVersionVerifications.currentDesignVersionNumberForGuestIs(DefaultItemNames.NEW_DESIGN_VERSION_NUMBER));

                // Execute
                const expectation = {success: false, message: DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_UPDATE};
                DesignVersionActions.guestUpdatesDesignVersionNumberTo('New Name', expectation);

                // Verify - not changed
                expect(DesignVersionVerifications.currentDesignVersionNumberForGuestIs(DefaultItemNames.NEW_DESIGN_VERSION_NUMBER));
            });

        });
        it('A Design Version may not be renamed to the same name as another version in the Design', function(){

            // Setup
            // Make sure the design and design version is in the user context
            DesignActions.designerSelectsDesign('Design1');
            DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
            DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
            DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');

            // Execute - try to rename new version to DesignVersion1
            DesignVersionActions.designerSelectsDesignVersion(DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
            const expectation = {success: false, message: DesignVersionValidationErrors.DESIGN_VERSION_INVALID_NAME_DUPLICATE};
            DesignVersionActions.designerUpdatesDesignVersionNameTo('DesignVersion1', expectation);

            // Verify
            // Check that still retains default Name
            expect(DesignVersionVerifications.currentDesignVersionNameForDesignerIs(DefaultItemNames.NEXT_DESIGN_VERSION_NAME));
        });

        it('A Design Version may not be renumbered to the same number as another version in the Design', function(){

            // Setup
            // Make sure the design and design version is in the user context
            DesignActions.designerSelectsDesign('Design1');
            DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
            DesignVersionActions.designerUpdatesDesignVersionNumberTo('1.0');
            DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
            DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');

            // Execute - try to rename new version number to 1.0
            DesignVersionActions.designerSelectsDesignVersion(DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
            const expectation = {success: false, message: DesignVersionValidationErrors.DESIGN_VERSION_INVALID_NUMBER_DUPLICATE};
            DesignVersionActions.designerUpdatesDesignVersionNumberTo('1.0', expectation);

            // Verify
            // Check that still retains default Number
            expect(DesignVersionVerifications.currentDesignVersionNumberForDesignerIs(DefaultItemNames.NEXT_DESIGN_VERSION_NUMBER));
        });

    });
});
