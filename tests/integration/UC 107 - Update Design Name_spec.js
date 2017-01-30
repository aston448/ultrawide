
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

describe('UC 107 - Update Design Name', function() {

    beforeEach(function(){
        TestFixtures.clearAllData();
    });

    afterEach(function(){

    });

    it('Only a Designer can update a Design name', function() {
        // Setup -------------------------------------------------------------------------------------------------------
        DesignActions.addNewDesignAsRole(RoleType.DESIGNER);
        DesignActions.designerEditsDesignNameFrom_To_(DefaultItemNames.NEW_DESIGN_NAME, 'Design1');
        expect(DesignVerifications.designExistsCalled('Design1'));

        // Execute -----------------------------------------------------------------------------------------------------
        // Give Developer a go...
        DesignActions.developerEditsDesignNameFrom_To_('Design1', 'New Name');

        // Verify ------------------------------------------------------------------------------------------------------
        // No update to name
        expect(DesignVerifications.designDoesNotExistCalled('New Name'));
        expect(DesignVerifications.designExistsCalled('Design1'));

        // And there is only one design
        expect(DesignVerifications.designCountIs(1));

        // Execute -----------------------------------------------------------------------------------------------------
        // Give Manager a go...
        DesignActions.managerEditsDesignNameFrom_To_('Design1', 'New Name');

        // Verify ------------------------------------------------------------------------------------------------------
        // No update to name
        expect(DesignVerifications.designDoesNotExistCalled('New Name'));
        expect(DesignVerifications.designExistsCalled('Design1'));
        // And there is only one design
        expect(DesignVerifications.designCountIs(1));
    });

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

    it('A Design cannot be given the same name as another existing Design', function() {

        // Setup -------------------------------------------------------------------------------------------------------
        DesignActions.addNewDesignAsRole(RoleType.DESIGNER);
        DesignActions.designerEditsDesignNameFrom_To_(DefaultItemNames.NEW_DESIGN_NAME, 'Design1');
        DesignActions.addNewDesignAsRole(RoleType.DESIGNER);
        expect(DesignVerifications.designExistsCalled('Design1'));
        expect(DesignVerifications.designExistsCalled(DefaultItemNames.NEW_DESIGN_NAME));

        // Execute -----------------------------------------------------------------------------------------------------
        DesignActions.designerEditsDesignNameFrom_To_(DefaultItemNames.NEW_DESIGN_NAME, 'Design1');

        // Verify ------------------------------------------------------------------------------------------------------
        // No change to design names
        expect(DesignVerifications.designExistsCalled('Design1'));
        expect(DesignVerifications.designExistsCalled(DefaultItemNames.NEW_DESIGN_NAME));
        // And there are only 2 designs
        expect(DesignVerifications.designCountIs(2));
    });

});
