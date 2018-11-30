
import { TestFixtures }             from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }            from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }     from '../../../test_framework/test_wrappers/design_version_actions.js';


import { DesignVerifications } from '../../../test_framework/test_wrappers/design_verifications.js';

import { BrowserActions }                   from '../../../test_framework/browser_actions/browser_actions.js';
import { BrowserChecks }                    from '../../../test_framework/browser_actions/browser_checks.js';
import {MenuAction}                     from "../../../imports/constants/constants";
import {DefaultItemNames}               from "../../../imports/constants/default_names";


describe('UC 211 - Follow Work Package Link', function() {

    before(function(){
        TestFixtures.logTestSuite('UC 211 - Follow Work Package Link');
    });

    after(function(){
        //BrowserActions.selectMenuItem(MenuAction.MENU_ACTION_LOGOUT);
    });

    beforeEach(function(){
        TestFixtures.clearAllData();

        TestFixtures.addDesignWithDefaultData();

        // Get the user context correct so that WPs can be added
        DesignActions.designerSelectsDesign('Design1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignActions.managerSelectsDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');

        // Add WorkPackage1 and WorkPackage2
        TestFixtures.addBaseDesignWorkPackages();

    });


    // Actions
    it('A Work Package has a Work Package Link when selected.', function() {

        // Setup -------------------------------------------------------------------------------------------------------
        BrowserActions.loginAsManager();
        BrowserActions.selectWorkPackagesTab();

        // Execute -----------------------------------------------------------------------------------------------------
        BrowserActions.selectAvailableWpsTab();
        BrowserActions.selectWorkItem('WorkPackage1');

        // Verify ------------------------------------------------------------------------------------------------------
        // Created a new Design
        BrowserChecks.componentIsVisible('linkLabel WorkPackage1');
        BrowserChecks.componentIsNotVisible('linkLabel WorkPackage2');
    });


});