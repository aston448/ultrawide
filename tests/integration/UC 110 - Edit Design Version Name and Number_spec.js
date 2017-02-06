
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
import {DesignVersionValidationErrors} from '../../imports/constants/validation_errors.js';

describe('UC 110 - Edit Design Version Name and Number', function(){

    before(function(){

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


    // Actions
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


    // Conditions
    it('Only a Designer may update a Design Version name', function(){

        // Setup
        DesignActions.developerSelectsDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');

        // Execute
        let expectation = {success: false, message: DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_UPDATE};
        DesignVersionActions.developerUpdatesDesignVersionNameTo('New Name', expectation);

        // Verify - not changed
        expect(DesignVersionVerifications.currentDesignVersionNameForDeveloperIs('DesignVersion1'));

        // Setup
        DesignActions.managerSelectsDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');

        // Execute
        expectation = {success: false, message: DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_UPDATE};
        DesignVersionActions.managerUpdatesDesignVersionNameTo('New Name', expectation);

        // Verify - not changed
        expect(DesignVersionVerifications.currentDesignVersionNameForManagerIs('DesignVersion1'));

    });

    it('Only a Designer may update a Design Version number', function(){

        // Setup
        DesignActions.developerSelectsDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        expect(DesignVersionVerifications.currentDesignVersionNumberForDeveloperIs(DefaultItemNames.NEW_DESIGN_VERSION_NUMBER));

        // Execute
        let expectation = {success: false, message: DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_UPDATE};
        DesignVersionActions.developerUpdatesDesignVersionNumberTo('1.1', expectation);

        // Verify - not changed
        expect(DesignVersionVerifications.currentDesignVersionNumberForDeveloperIs(DefaultItemNames.NEW_DESIGN_VERSION_NUMBER));

        // Setup
        DesignActions.managerSelectsDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        expect(DesignVersionVerifications.currentDesignVersionNumberForManagerIs(DefaultItemNames.NEW_DESIGN_VERSION_NUMBER));

        // Execute
        expectation = {success: false, message: DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_UPDATE};
        DesignVersionActions.managerUpdatesDesignVersionNumberTo('New Name', expectation);

        // Verify - not changed
        expect(DesignVersionVerifications.currentDesignVersionNumberForManagerIs(DefaultItemNames.NEW_DESIGN_VERSION_NUMBER));
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
