
import TestFixtures                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import DesignActions                from '../../../test_framework/test_wrappers/design_actions.js';
import DesignVersionActions         from '../../../test_framework/test_wrappers/design_version_actions.js';
import DesignUpdateActions          from '../../../test_framework/test_wrappers/design_update_actions.js';
import DesignComponentActions       from '../../../test_framework/test_wrappers/design_component_actions.js';
import UpdateComponentActions       from '../../../test_framework/test_wrappers/design_update_component_actions.js';
import DesignVerifications          from '../../../test_framework/test_wrappers/design_verifications.js';
import DesignVersionVerifications   from '../../../test_framework/test_wrappers/design_version_verifications.js';
import DesignComponentVerifications from '../../../test_framework/test_wrappers/design_component_verifications.js';
import UserContextVerifications     from '../../../test_framework/test_wrappers/user_context_verifications.js';

import {RoleType, DesignVersionStatus, ComponentType} from '../../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../../imports/constants/default_names.js';
import {DesignVersionValidationErrors} from '../../../imports/constants/validation_errors.js';

describe('UC 105 - Withdraw Design Version', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 105 - Withdraw Design Version');
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
    it('A Designer can revert a Design Version from Draft published to New', function() {

        // Setup
        DesignActions.designerSelectsDesign('Design1');
        DesignVersionActions.designerPublishesDesignVersion(DefaultItemNames.NEW_DESIGN_VERSION_NAME);
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs(DefaultItemNames.NEW_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_DRAFT));

        // Execute
        DesignVersionActions.designerWithdrawsDesignVersion(DefaultItemNames.NEW_DESIGN_VERSION_NAME);

        // Validate - NEW again
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs(DefaultItemNames.NEW_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_NEW));

    });

});
