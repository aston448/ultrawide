
import TestFixtures from '../../test_framework/test_wrappers/test_fixtures.js';
import DesignActions from '../../test_framework/test_wrappers/design_actions.js';
import DesignVerifications from '../../test_framework/test_wrappers/design_verifications.js';
import DesignVersionVerifications from '../../test_framework/test_wrappers/design_version_verifications.js';

import {RoleType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 101 - Add New Design', function() {

    before(function(){
        TestFixtures.logTestSuite('UC 101 - Add New Design');
    });

    after(function(){

    });

    beforeEach(function(){
        TestFixtures.clearAllData();
    });

    afterEach(function(){

    });


    // Actions
    it('A Designer can add a new Design to Ultrawide', function() {

        // Setup -------------------------------------------------------------------------------------------------------

        // Execute -----------------------------------------------------------------------------------------------------
        DesignActions.addNewDesignAsRole(RoleType.DESIGNER);

        // Verify ------------------------------------------------------------------------------------------------------
        // Created a new Design
        expect(DesignVerifications.defaultNewDesignExists());

    });

    // Consequences
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


