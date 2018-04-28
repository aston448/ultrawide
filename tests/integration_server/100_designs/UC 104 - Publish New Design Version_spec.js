
import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { DesignVersionVerifications }   from '../../../test_framework/test_wrappers/design_version_verifications.js';

import { DesignVersionStatus } from '../../../imports/constants/constants.js'
import {DefaultItemNames } from '../../../imports/constants/default_names.js';

describe('UC 104 - Publish New Design Version', function() {

    before(function(){
        TestFixtures.logTestSuite('UC 104 - Publish New Design Version');
    });

    after(function(){

    });

    beforeEach(function(){
        TestFixtures.clearAllData();

        // Add  Design - Design1: will create default Design Version
        DesignActions.designerAddsNewDesignCalled('Design1');
    });

    afterEach(function(){

    });

    // Actions
    it('A Designer can update a Design Version from New to Published', function() {

        // Setup -------------------------------------------------------------------------------------------------------
        // Make sure the design is in the user context
        DesignActions.designerSelectsDesign('Design1');
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs(DefaultItemNames.NEW_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_NEW));

        // Execute -----------------------------------------------------------------------------------------------------
        DesignVersionActions.designerPublishesDesignVersion(DefaultItemNames.NEW_DESIGN_VERSION_NAME);

        // Verify ------------------------------------------------------------------------------------------------------
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs(DefaultItemNames.NEW_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_DRAFT));
    });

});
