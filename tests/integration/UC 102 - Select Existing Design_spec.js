
import TestFixtures from '../../test_framework/test_wrappers/test_fixtures.js';
import DesignActions from '../../test_framework/test_wrappers/design_actions.js';
import UserContextVerifications from '../../test_framework/test_wrappers/user_context_verifications.js';

import {RoleType} from '../../imports/constants/constants.js'

describe('UC 102 - Select Existing Design', function() {

    before(function(){
        TestFixtures.logTestSuite('UC 102 - Select Existing Design');
    });

    after(function(){

    });

    beforeEach(function(){
        TestFixtures.clearAllData();
    });

    afterEach(function(){

    });

    // Actions
    it('An existing Design can be selected as the working Design', function() {

        // Setup -------------------------------------------------------------------------------------------------------
        DesignActions.designerAddsNewDesignCalled('Design1');
        DesignActions.designerAddsNewDesignCalled('Design2');

        // Execute -----------------------------------------------------------------------------------------------------
        DesignActions.designerSelectsDesign('Design1');

        // Verify ------------------------------------------------------------------------------------------------------
        expect(UserContextVerifications.userContextForRole_DesignIs(RoleType.DESIGNER, 'Design1'));

        // Execute -----------------------------------------------------------------------------------------------------
        DesignActions.designerSelectsDesign('Design2');

        // Verify ------------------------------------------------------------------------------------------------------
        expect(UserContextVerifications.userContextForRole_DesignIs(RoleType.DESIGNER, 'Design2'));
    });

    // Consequences
    it('When a new Design is selected previous user context is cleared', function() {

        // Setup -------------------------------------------------------------------------------------------------------
        DesignActions.designerAddsNewDesignCalled('Design1');

        // This sets all user context items to "DUMMY"
        TestFixtures.setDummyUserContextForDesigner();


        // Execute -----------------------------------------------------------------------------------------------------
        DesignActions.designerSelectsDesign('Design1');

        // Verify ------------------------------------------------------------------------------------------------------
        expect(UserContextVerifications.userContextForRole_DesignIs(RoleType.DESIGNER, 'Design1'));

        // And rest should be "NONE"
        expect(UserContextVerifications.userContextDesignVersionNotSetForRole(RoleType.DESIGNER));
        expect(UserContextVerifications.userContextDesignUpdateNotSetForRole(RoleType.DESIGNER));
        expect(UserContextVerifications.userContextWorkPackageNotSetForRole(RoleType.DESIGNER));
        expect(UserContextVerifications.userContextDesignComponentNotSetForRole(RoleType.DESIGNER));
        expect(UserContextVerifications.userContextDesignComponentTypeNotSetForRole(RoleType.DESIGNER));

        expect(UserContextVerifications.userContextFeatureReferenceNotSetForRole(RoleType.DESIGNER));
        expect(UserContextVerifications.userContextFeatureAspectReferenceNotSetForRole(RoleType.DESIGNER));
        expect(UserContextVerifications.userContextScenarioReferenceNotSetForRole(RoleType.DESIGNER));
        expect(UserContextVerifications.userContextScenarioStepNotSetForRole(RoleType.DESIGNER));

    });

});

