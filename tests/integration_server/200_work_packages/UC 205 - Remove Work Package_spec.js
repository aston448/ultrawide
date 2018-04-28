
import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { DesignUpdateActions }          from '../../../test_framework/test_wrappers/design_update_actions.js';
import { WorkPackageActions }           from '../../../test_framework/test_wrappers/work_package_actions.js';
import { WorkPackageVerifications }     from '../../../test_framework/test_wrappers/work_package_verifications.js';

import {WorkPackageStatus} from '../../../imports/constants/constants.js'
import {DefaultItemNames} from '../../../imports/constants/default_names.js';
import {WorkPackageValidationErrors} from '../../../imports/constants/validation_errors.js';

describe('UC 205 - Remove Work Package - Initial Design Version', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 205 - Remove Work Package - Initial Design Version');
    });

    after(function(){

    });

    beforeEach(function(){

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();

        // Designer Publish DesignVersion1
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');

        // Manager selects DesignVersion1
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');

        // Add new Base WP - not published
        WorkPackageActions.managerAddsBaseDesignWorkPackage();
        WorkPackageActions.managerSelectsWorkPackage(DefaultItemNames.NEW_WORK_PACKAGE_NAME);
        WorkPackageActions.managerUpdatesSelectedWpNameTo('WorkPackage1');
    });

    afterEach(function(){

    });


    // Actions
    it('A Manager may remove a New Initial Design Version Work Package', function(){

        // Setup
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerSelectsWorkPackage('WorkPackage1');

        // Execute
        WorkPackageActions.managerRemovesSelectedWorkPackage();

        // Verify
        expect(WorkPackageVerifications.workPackageDoesNotExistForManagerCalled('WorkPackage1'));
    });


    // Conditions
    it('An Available Initial Design Version Work Package may not be removed', function(){

        // Setup - publish the WP
        WorkPackageActions.managerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.managerPublishesSelectedWorkPackage();

        // Execute
        const expectation = {success: false, message: WorkPackageValidationErrors.WORK_PACKAGE_INVALID_STATE_REMOVE};
        WorkPackageActions.managerRemovesSelectedWorkPackage(expectation);

        // Verify - still Exists
        expect(WorkPackageVerifications.workPackageExistsForManagerCalled('WorkPackage1'))

    });

});

describe('UC 205 - Remove Work Package - Design Update', function(){

    before(function(){

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();

        // Designer Publish DesignVersion1
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');

        // Create next Design Version
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2');

        // Add a Design Update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
    });

    after(function(){

    });

    beforeEach(function(){

        TestFixtures.clearWorkPackages();

    });

    afterEach(function(){

    });


    // Actions
    it('A Manager may remove a New Design Update Work Package', function(){

        // Setup
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerAddsUpdateWorkPackageCalled('UpdateWorkPackage1');
        expect(WorkPackageVerifications.workPackageExistsForManagerCalled('UpdateWorkPackage1'));
        expect(WorkPackageVerifications.workPackage_StatusForManagerIs('UpdateWorkPackage1', WorkPackageStatus.WP_NEW));

        // Execute
        WorkPackageActions.managerRemovesSelectedWorkPackage();

        // Verify
        expect(WorkPackageVerifications.workPackageDoesNotExistForManagerCalled('UpdateWorkPackage1'));

    });


    // Conditions
    it('An Available Design Update Work Package may not be removed', function(){

        // Setup
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerAddsUpdateWorkPackageCalled('UpdateWorkPackage1');
        WorkPackageActions.managerPublishesSelectedWorkPackage();
        expect(WorkPackageVerifications.workPackageExistsForManagerCalled('UpdateWorkPackage1'));
        expect(WorkPackageVerifications.workPackage_StatusForManagerIs('UpdateWorkPackage1', WorkPackageStatus.WP_AVAILABLE));

        // Execute
        const expectation = {success: false, message: WorkPackageValidationErrors.WORK_PACKAGE_INVALID_STATE_REMOVE};
        WorkPackageActions.managerRemovesSelectedWorkPackage(expectation);

        // Verify - still there
        expect(WorkPackageVerifications.workPackageExistsForManagerCalled('UpdateWorkPackage1'));

    });

    it('An Adopted Design Update Work Package may not be removed');

    it('A Complete Design Update Work Package may not be removed');

});
