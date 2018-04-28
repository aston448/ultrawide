
import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { DesignUpdateActions }          from '../../../test_framework/test_wrappers/design_update_actions.js';
import { DesignUpdateVerifications }    from '../../../test_framework/test_wrappers/design_update_verifications.js';

import {DefaultItemNames} from '../../../imports/constants/default_names.js';
import {DesignUpdateValidationErrors} from '../../../imports/constants/validation_errors.js';

describe('UC 504 - Edit Design Update Content', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 504 - Edit Design Update Content');

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();

        // Complete the Design Version and create the next
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2');

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1'); // Published
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2'); // Still New

    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });


    // Actions
    it('A Designer may edit a New Design Update', function(){

        // Setup
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');

        // Execute
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');

        // Verify
        expect(DesignUpdateVerifications.currentUpdateForDesignerIs('DesignUpdate2'));
    });

    it('A Designer may edit a Draft Design Update', function(){

        // Setup
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');

        // Execute
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Verify
        expect(DesignUpdateVerifications.currentUpdateForDesignerIs('DesignUpdate1'));
    });


    // Conditions
    it('A Designer cannot edit a Complete Design Update');

    it('Only a Designer can edit a Design Update', function(){

        // Setup - Developer
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');

        // Execute
        const expectation = {success: false, message: DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_EDIT};
        DesignUpdateActions.developerEditsUpdate('DesignUpdate1', expectation);

        // Setup - Manager
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');

        // Execute
        DesignUpdateActions.managerEditsUpdate('DesignUpdate1', expectation);

    });

});
