
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
import {DesignValidationErrors} from '../../imports/constants/validation_errors.js';

describe('UC 107 - Update Design Name', function() {

    beforeEach(function(){
        TestFixtures.clearAllData();
    });

    afterEach(function(){

    });

    // Actions
    it('A Designer can edit a Design name to a new value', function() {

        // Setup -------------------------------------------------------------------------------------------------------
        DesignActions.addNewDesignAsRole(RoleType.DESIGNER);

        // Execute -----------------------------------------------------------------------------------------------------
        DesignActions.designerEditsDesignNameFrom_To_(DefaultItemNames.NEW_DESIGN_NAME, 'Design1');

        // Verify ------------------------------------------------------------------------------------------------------
        // Design name has changed
        expect(DesignVerifications.designExistsCalled('Design1'));
        expect(DesignVerifications.designDoesNotExistCalled(DefaultItemNames.NEW_DESIGN_NAME));
        // And there is only one design
        expect(DesignVerifications.designCountIs(1));

    });

    // Conditions
    it('A Design cannot be given the same name as another existing Design', function() {

        // Setup -------------------------------------------------------------------------------------------------------
        DesignActions.addNewDesignAsRole(RoleType.DESIGNER);
        DesignActions.designerEditsDesignNameFrom_To_(DefaultItemNames.NEW_DESIGN_NAME, 'Design1');
        DesignActions.addNewDesignAsRole(RoleType.DESIGNER);
        expect(DesignVerifications.designExistsCalled('Design1'));
        expect(DesignVerifications.designExistsCalled(DefaultItemNames.NEW_DESIGN_NAME));

        // Execute -----------------------------------------------------------------------------------------------------
        const expectation = {success: false, message: DesignValidationErrors.DESIGN_INVALID_NAME_DUPLICATE};
        DesignActions.designerEditsDesignNameFrom_To_(DefaultItemNames.NEW_DESIGN_NAME, 'Design1', expectation);

        // Verify ------------------------------------------------------------------------------------------------------
        // No change to design names
        expect(DesignVerifications.designExistsCalled('Design1'));
        expect(DesignVerifications.designExistsCalled(DefaultItemNames.NEW_DESIGN_NAME));
        // And there are only 2 designs
        expect(DesignVerifications.designCountIs(2));
    });

});
