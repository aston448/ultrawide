
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

describe('UC 110 - Edit Design Version Name and Number', function(){

    before(function(){

    });

    after(function(){

    });

    beforeEach(function(){

        TestFixtures.clearAllData();

        // Add  Design - Design1: will create default Design Version
        DesignActions.addNewDesignAsRole(RoleType.DESIGNER);
        DesignActions.designerSelectsDesign('Design1');
        DesignActions.designerEditsDesignNameFrom_To_(DefaultItemNames.NEW_DESIGN_NAME, 'Design1');
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'DesignVersion1')
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
    it('Only a Designer may update a Design Version Name', function(){

        // Try Developer
        // Setup
        // Make sure the design and design version is in the user context
        DesignActions.developerSelectsDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');

        // Execute
        DesignVersionActions.developerUpdatesDesignVersionNameTo('New Name');

        // Verify that name has not in fact changed
        expect(DesignVersionVerifications.currentDesignVersionNameForDeveloperIs('DesignVersion1'));

        // Try Manager
        // Setup
        // Make sure the design and design version is in the user context
        DesignActions.managerSelectsDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');

        // Execute
        DesignVersionActions.managerUpdatesDesignVersionNameTo('New Name');

        // Verify that name has not in fact changed
        expect(DesignVersionVerifications.currentDesignVersionNameForManagerIs('DesignVersion1'));

    });

    it('Only a Designer may update a Design Version number', function(){

        // Try Developer
        // Setup
        // Make sure the design and design version is in the user context
        DesignActions.developerSelectsDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');

        // Execute
        DesignVersionActions.developerUpdatesDesignVersionNumberTo('1.1');

        // Verify that number has not in fact changed
        expect(DesignVersionVerifications.currentDesignVersionNumberForDeveloperIs(DefaultItemNames.NEW_DESIGN_VERSION_NUMBER));

        // Try Manager
        // Setup
        // Make sure the design and design version is in the user context
        DesignActions.managerSelectsDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');

        // Execute
        DesignVersionActions.managerUpdatesDesignVersionNumberTo('1.1');

        // Verify that number has not in fact changed
        expect(DesignVersionVerifications.currentDesignVersionNumberForManagerIs(DefaultItemNames.NEW_DESIGN_VERSION_NUMBER));
    });

    it('A Design Version may not be renamed to the same name as another version in the Design', function(){
        // Setup
        // Make sure the design and design version is in the user context
        DesignActions.designerSelectsDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');


        // Create new Design Version
        // Setup - create new DV from original
        const params = {
            designName: 'Design1',
            designVersionName: 'DesignVersion1'
        };

        DesignVersionActions.designerCreateNextDesignVersionFromNew(params);

        // Execute - try to rename new version to DesignVersion1
        DesignVersionActions.designerSelectsDesignVersion(DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        DesignVersionActions.designerUpdatesDesignVersionNameTo('DesignVersion1');

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

        // Create new Design Version
        // Setup - create new DV from original
        const params = {
            designName: 'Design1',
            designVersionName: 'DesignVersion1'
        };

        DesignVersionActions.designerCreateNextDesignVersionFromNew(params);

        // Execute - try to rename new version number to 1.0
        DesignVersionActions.designerSelectsDesignVersion(DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        DesignVersionActions.designerUpdatesDesignVersionNumberTo('1.0');

        // Verify
        // Check that still retains default Number
        expect(DesignVersionVerifications.currentDesignVersionNumberForDesignerIs(DefaultItemNames.NEXT_DESIGN_VERSION_NUMBER));
    });

});
