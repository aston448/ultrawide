
import {RoleType} from '../../imports/constants/constants.js'

beforeEach(function(){
    server.call('testFixtures.clearAllData');
});

afterEach(function(){
    server.call('testLogin.logout');
});

describe('UC 102 - Select Existing Design', function() {

    it('An existing Design can be selected as the working Design', function() {
        // Setup -------------------------------------------------------------------------------------------------------
        server.call('testLogin.loginAs', RoleType.DESIGNER);
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, 'New Design', 'Design1');
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, 'New Design', 'Design2');

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('testDesigns.selectDesign', 'Design1');

        // Verify ------------------------------------------------------------------------------------------------------
        server.call('verifyUserContext.designIs', 'Design1', (function(error, result){expect(!error);}));

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('testDesigns.selectDesign', 'Design2');

        // Verify ------------------------------------------------------------------------------------------------------
        server.call('verifyUserContext.designIs', 'Design2', (function(error, result){expect(!error);}));

    });

    it('When a new Design is selected previous user context is cleared', function() {

        // Setup -------------------------------------------------------------------------------------------------------
        server.call('testLogin.loginAs', RoleType.DESIGNER);
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, 'New Design', 'Design1');
        // This sets all edit context items to "DUMMY"
        server.call('testUserContext.setFullDummyEditContext');

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('testDesigns.selectDesign', 'Design1');

        // Verify ------------------------------------------------------------------------------------------------------
        server.call('verifyUserContext.designIs', 'Design1', (function(error, result){expect(!error);}));
        // And rest should be "NONE"
        server.call('verifyUserContext.designVersionIsNone', (function(error, result){expect(!error);}));
        server.call('verifyUserContext.designUpdateIsNone', (function(error, result){expect(!error);}));
        server.call('verifyUserContext.workPackageIsNone', (function(error, result){expect(!error);}));
        server.call('verifyUserContext.designComponentIsNone', (function(error, result){expect(!error);}));
        server.call('verifyUserContext.designComponentTypeIsNone', (function(error, result){expect(!error);}));
        server.call('verifyUserContext.featureReferenceIsNone', (function(error, result){expect(!error);}));
        server.call('verifyUserContext.featureAspectReferenceIsNone', (function(error, result){expect(!error);}));
        server.call('verifyUserContext.scenarioReferenceIsNone', (function(error, result){expect(!error);}));
        server.call('verifyUserContext.scenarioStepIsNone', (function(error, result){expect(!error);}));
    });

});

