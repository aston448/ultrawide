import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVerifications }          from '../../../test_framework/test_wrappers/design_verifications.js';

import {RoleType} from '../../../imports/constants/constants.js'
import {DefaultItemNames} from '../../../imports/constants/default_names.js';
import {DesignValidationErrors} from '../../../imports/constants/validation_errors.js';

describe('UC 102 - Update Design Name', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 102 - Update Design Name');
    });

    after(function(){

    });

    beforeEach(function(){
        TestFixtures.clearAllData();
    });

    afterEach(function(){

    });


    describe('Actions', function(){

        it('A Designer can edit a Design name to a new value', function(){

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

    });

    describe('Conditions', function(){

        it('A Design cannot be given the same name as another existing Design', function(){

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
});
