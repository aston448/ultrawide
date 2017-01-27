
import {RoleType} from '../../imports/constants/constants.js'
import {DefaultItemNames} from '../../imports/constants/default_names.js';

import DesignActions from '../../test_framework/test_wrappers/design_actions.js';
import UserContextVerifications from '../../test_framework/test_wrappers/user_context_verifications.js';

describe('UC 102 - Select Existing Design', function() {

    beforeEach(function(){
        server.call('testFixtures.clearAllData');
    });

    afterEach(function(){

    });

    it('An existing Design can be selected as the working Design', function() {
        // Setup -------------------------------------------------------------------------------------------------------
        DesignActions.designerAddsNewDesignCalled('Design1');
        DesignActions.designerAddsNewDesignCalled('Design2');

        // Execute -----------------------------------------------------------------------------------------------------
        DesignActions.designerSelectsDesign('Design1');

        // Verify ------------------------------------------------------------------------------------------------------
        expect(UserContextVerifications.designerUserContextDesignIs('Design1'));

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('testDesigns.selectDesign', 'Design2', 'gloria');

        // Verify ------------------------------------------------------------------------------------------------------
        server.call('verifyUserContext.designIs', 'Design2', 'gloria', (function(error, result){expect(!error);}));

    });

    it('When a new Design is selected previous user context is cleared', function() {

        // Setup -------------------------------------------------------------------------------------------------------
        DesignActions.designerAddsNewDesignCalled('Design1');

        // This sets all edit context items to "DUMMY"
        server.call('testUserContext.setFullDummyEditContext', 'gloria');

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');

        // Verify ------------------------------------------------------------------------------------------------------
        server.call('verifyUserContext.designIs', 'Design1', 'gloria', (function(error, result){expect(!error);}));
        // And rest should be "NONE"
        server.call('verifyUserContext.designVersionIsNone', 'gloria', (function(error, result){expect(!error);}));
        server.call('verifyUserContext.designUpdateIsNone', 'gloria', (function(error, result){expect(!error);}));
        server.call('verifyUserContext.workPackageIsNone', 'gloria', (function(error, result){expect(!error);}));
        server.call('verifyUserContext.designComponentIsNone', 'gloria', (function(error, result){expect(!error);}));
        server.call('verifyUserContext.designComponentTypeIsNone', 'gloria', (function(error, result){expect(!error);}));
        server.call('verifyUserContext.featureReferenceIsNone', 'gloria', (function(error, result){expect(!error);}));
        server.call('verifyUserContext.featureAspectReferenceIsNone', 'gloria', (function(error, result){expect(!error);}));
        server.call('verifyUserContext.scenarioReferenceIsNone', 'gloria', (function(error, result){expect(!error);}));
        server.call('verifyUserContext.scenarioStepIsNone', 'gloria', (function(error, result){expect(!error);}));
    });

});

