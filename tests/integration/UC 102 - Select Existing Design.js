
import {RoleType} from '../../imports/constants/constants.js'
import {DefaultItemNames} from '../../imports/constants/default_names.js';

beforeEach(function(){
    server.call('testFixtures.clearAllData');
});

afterEach(function(){

});

describe('UC 102 - Select Existing Design', function() {

    it('An existing Design can be selected as the working Design', function() {
        // Setup -------------------------------------------------------------------------------------------------------
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, 'Design1');
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, 'Design2');

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');

        // Verify ------------------------------------------------------------------------------------------------------
        server.call('verifyUserContext.designIs', 'Design1', 'gloria', (function(error, result){expect(!error);}));

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('testDesigns.selectDesign', 'Design2', 'gloria');

        // Verify ------------------------------------------------------------------------------------------------------
        server.call('verifyUserContext.designIs', 'Design2', (function(error, result){expect(!error);}));

    });

    it('When a new Design is selected previous user context is cleared', function() {

        // Setup -------------------------------------------------------------------------------------------------------
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, 'Design1');
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

