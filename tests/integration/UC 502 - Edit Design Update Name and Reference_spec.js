
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
import WorkPackageActions           from '../../test_framework/test_wrappers/work_package_actions.js';
import WorkPackageVerifications     from '../../test_framework/test_wrappers/work_package_verifications.js';
import WpComponentActions           from '../../test_framework/test_wrappers/work_package_component_actions.js';
import WpComponentVerifications     from '../../test_framework/test_wrappers/work_package_component_verifications.js';

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';
import {DesignUpdateValidationErrors} from '../../imports/constants/validation_errors.js';

describe('UC 502 - Edit Design Update Name and Reference', function(){

    before(function(){

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();

        // Complete the Design Version and create the next
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2')
    });

    after(function(){

    });

    beforeEach(function(){

        // Remove any Design Updates before each test
        TestFixtures.clearDesignUpdates();
    });

    afterEach(function(){

    });


    // Actions
    it('A Designer may update a Design Update name', function(){

        // Setup - create a new Design Update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdate();
        expect(DesignUpdateVerifications.updateExistsForDesignerCalled(DefaultItemNames.NEW_DESIGN_UPDATE_NAME));

        // Execute
        DesignUpdateActions.designerSelectsUpdate(DefaultItemNames.NEW_DESIGN_UPDATE_NAME);
        DesignUpdateActions.designerEditsSelectedUpdateNameTo('DesignUpdate1');

        // Verify
        expect(DesignUpdateVerifications.updateExistsForDesignerCalled('DesignUpdate1'));

    });

    it('A Designer may update a Design Update reference', function(){

        // Setup - create a new Design Update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdate();
        expect(DesignUpdateVerifications.updateExistsForDesignerCalled(DefaultItemNames.NEW_DESIGN_UPDATE_NAME));

        // Execute
        DesignUpdateActions.designerSelectsUpdate(DefaultItemNames.NEW_DESIGN_UPDATE_NAME);
        DesignUpdateActions.designerEditsSelectedUpdateRefTo('CR999');

        // Verify
        expect(DesignUpdateVerifications.selectedUpdateRefForDesignerIs('CR999'));
    });

    it('The same Design Update reference may be used on more than one Design Update for a Base Design Version', function(){
        // Setup - create a new Design Update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdate();
        DesignUpdateActions.designerSelectsUpdate(DefaultItemNames.NEW_DESIGN_UPDATE_NAME);
        DesignUpdateActions.designerEditsSelectedUpdateNameTo('DesignUpdate1');
        // And now a second Update....
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdate();
        DesignUpdateActions.designerSelectsUpdate(DefaultItemNames.NEW_DESIGN_UPDATE_NAME);
        DesignUpdateActions.designerEditsSelectedUpdateNameTo('DesignUpdate2');

        // Execute - set same ref on both
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        DesignUpdateActions.designerEditsSelectedUpdateRefTo('CR999');
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate2');
        DesignUpdateActions.designerEditsSelectedUpdateRefTo('CR999');

        // Verify both changed
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        expect(DesignUpdateVerifications.selectedUpdateRefForDesignerIs('CR999'));

        DesignUpdateActions.designerSelectsUpdate('DesignUpdate2');
        expect(DesignUpdateVerifications.selectedUpdateRefForDesignerIs('CR999'));
    });


    // Conditions
    it('A Design Update name must be unique for the Base Design Version', function(){

        // Setup - create a new Design Update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdate();
        DesignUpdateActions.designerSelectsUpdate(DefaultItemNames.NEW_DESIGN_UPDATE_NAME);
        DesignUpdateActions.designerEditsSelectedUpdateNameTo('DesignUpdate1');
        // And now a second Update....
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdate();

        // Execute - try to give it same name as before
        DesignUpdateActions.designerSelectsUpdate(DefaultItemNames.NEW_DESIGN_UPDATE_NAME);
        const expectation = {success: false, message: DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_NAME_DUPLICATE};
        DesignUpdateActions.designerEditsSelectedUpdateNameTo('DesignUpdate1', expectation);

        // Verify - name has not changed
        expect(DesignUpdateVerifications.selectedUpdateNameForDesignerIs(DefaultItemNames.NEW_DESIGN_UPDATE_NAME));
    });



});
