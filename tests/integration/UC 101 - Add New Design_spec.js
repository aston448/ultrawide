
import TestFixtures from '../../test_framework/test_wrappers/test_fixtures.js';
import DesignActions from '../../test_framework/test_wrappers/design_actions.js';
import DesignVerifications from '../../test_framework/test_wrappers/design_verifications.js';
import DesignVersionVerifications from '../../test_framework/test_wrappers/design_version_verifications.js';

import {RoleType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 101 - Add New Design', function() {
    beforeEach(function(){
        TestFixtures.clearAllData();
    });

    afterEach(function(){

    });

    it('A new Design can only be added by a Designer', function() {
        // Setup -------------------------------------------------------------------------------------------------------


        // Execute -----------------------------------------------------------------------------------------------------
        DesignActions.addNewDesignAsRole(RoleType.DEVELOPER);

        // Verify ------------------------------------------------------------------------------------------------------
        // No new design created
        expect(DesignVerifications.defaultNewDesignDoesNotExist());

        // Execute -----------------------------------------------------------------------------------------------------
        DesignActions.addNewDesignAsRole(RoleType.MANAGER);

        // Verify ------------------------------------------------------------------------------------------------------
        // No new design created
        expect(DesignVerifications.defaultNewDesignDoesNotExist());

    });

    it('A Designer can add a new Design to Ultrawide', function() {

        // Setup -------------------------------------------------------------------------------------------------------

        // Execute -----------------------------------------------------------------------------------------------------
        DesignActions.addNewDesignAsRole(RoleType.DESIGNER);

        // Verify ------------------------------------------------------------------------------------------------------
        // Created a new Design
        expect(DesignVerifications.defaultNewDesignExists());

    });

    it('When a new Design is added an initial Design Version is created for it', function() {

        // Setup -------------------------------------------------------------------------------------------------------

        // Execute -----------------------------------------------------------------------------------------------------
        DesignActions.addNewDesignAsRole(RoleType.DESIGNER);

        // Verify ------------------------------------------------------------------------------------------------------
        // Created a new Design and a new Design Version linked to it
        expect(DesignVerifications.defaultNewDesignExists());
        expect(DesignVersionVerifications.defaultNewDesignVersionExistsForDesign(DefaultItemNames.NEW_DESIGN_NAME));

    })
});


