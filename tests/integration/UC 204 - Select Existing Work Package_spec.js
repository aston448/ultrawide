
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

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';
import {WorkPackageValidationErrors} from '../../imports/constants/validation_errors.js';

describe('UC 204 - Select Existing Work Package - Base Design', function(){

    // Tests for Initial Design Version Work Packages

    before(function(){
        TestFixtures.logTestSuite('UC 204 - Select Existing Work Package - Base Design');

        // This test data is reused for all tests

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();

        // Designer Publish DesignVersion1
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');

        // Manager selects DesignVersion1
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');

        // Add new Base WP
        WorkPackageActions.managerAddsBaseDesignWorkPackageCalled('WorkPackage1');
        WorkPackageActions.managerPublishesSelectedWorkPackage();

        // Add new Base WP
        WorkPackageActions.managerAddsBaseDesignWorkPackageCalled('WorkPackage2');
        WorkPackageActions.managerPublishesSelectedWorkPackage();

        // Add new Base WP - unpublished
        WorkPackageActions.managerAddsBaseDesignWorkPackageCalled('WorkPackage3');


    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });



    // Actions
    it('A Manager may select a Published Work Package from the Initial Design Version Work Package list', function(){

        // Setup
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');

        // Execute
        WorkPackageActions.managerSelectsWorkPackage('WorkPackage1');

        // Verify
        expect(WorkPackageVerifications.currentManagerWorkPackageIs('WorkPackage1'));

        // Execute
        WorkPackageActions.managerSelectsWorkPackage('WorkPackage2');

        // Verify
        expect(WorkPackageVerifications.currentManagerWorkPackageIs('WorkPackage2'));
    });

    it('A Developer may select a Published Work Package from the Initial Design Version Work Package list', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');

        // Execute
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');

        // Verify
        expect(WorkPackageVerifications.currentDeveloperWorkPackageIs('WorkPackage1'));

        // Execute
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage2');

        // Verify
        expect(WorkPackageVerifications.currentDeveloperWorkPackageIs('WorkPackage2'));
    });

    it('A Designer may select a Published Work Package from the Initial Design Version Work Package list', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');

        // Execute
        WorkPackageActions.designerSelectsWorkPackage('WorkPackage1');

        // Verify
        expect(WorkPackageVerifications.currentDesignerWorkPackageIs('WorkPackage1'));

        // Execute
        WorkPackageActions.designerSelectsWorkPackage('WorkPackage2');

        // Verify
        expect(WorkPackageVerifications.currentDesignerWorkPackageIs('WorkPackage2'));
    });


    // Conditions
    it('Only a Manager may select a New Work Package from the Initial Design Version Work Package list', function(){

        // Setup - Manager
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');

        // Execute

        WorkPackageActions.managerSelectsWorkPackage('WorkPackage3');

        // Verify
        expect(WorkPackageVerifications.currentManagerWorkPackageIs('WorkPackage3'));


        // Setup - Developer
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');

        // Execute
        let expectation = {success: false, message: WorkPackageValidationErrors.WORK_PACKAGE_INVALID_ROLE_VIEW_NEW};
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage3', expectation);

        // Verify
        expect(WorkPackageVerifications.currentDeveloperWorkPackageIs('NONE'));


        // Setup - Designer
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');

        // Execute
        // Same failure expectation as before
        WorkPackageActions.designerSelectsWorkPackage('WorkPackage3', expectation);

        // Verify
        expect(WorkPackageVerifications.currentDesignerWorkPackageIs('NONE'));
    });

});

describe('UC 204 - Select Existing Work Package - Updates', function(){

    // Tests for Design Update Work Packages

    before(function(){
        // This test data is reused for all tests

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

        // Manager now adds 3 work packages
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerAddsUpdateWorkPackageCalled('UpdateWorkPackage1');
        WorkPackageActions.managerPublishesSelectedWorkPackage();
        WorkPackageActions.managerAddsUpdateWorkPackageCalled('UpdateWorkPackage2');
        WorkPackageActions.managerPublishesSelectedWorkPackage();
        WorkPackageActions.managerAddsUpdateWorkPackageCalled('UpdateWorkPackage3');  // Not published


    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });


    // Actions
    it('A Manager may select a Published Work Package from the Design Update Work Package list', function(){

        // Setup
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');

        // Execute
        WorkPackageActions.managerSelectsWorkPackage('UpdateWorkPackage1');

        // Verify
        expect(WorkPackageVerifications.currentManagerWorkPackageIs('UpdateWorkPackage1'));

        // Execute
        WorkPackageActions.managerSelectsWorkPackage('UpdateWorkPackage2');

        // Verify
        expect(WorkPackageVerifications.currentManagerWorkPackageIs('UpdateWorkPackage2'));
    });

    it('A Developer may select a Published Work Package from the Design Update Work Package list', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.developerSelectsUpdate('DesignUpdate1');

        // Execute
        WorkPackageActions.developerSelectsWorkPackage('UpdateWorkPackage1');

        // Verify
        expect(WorkPackageVerifications.currentDeveloperWorkPackageIs('UpdateWorkPackage1'));

        // Execute
        WorkPackageActions.developerSelectsWorkPackage('UpdateWorkPackage2');

        // Verify
        expect(WorkPackageVerifications.currentDeveloperWorkPackageIs('UpdateWorkPackage2'));
    });

    it('A Designer may select a Published Work Package from the Design Update Work Package list', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');

        // Execute
        WorkPackageActions.designerSelectsWorkPackage('UpdateWorkPackage1');

        // Verify
        expect(WorkPackageVerifications.currentDesignerWorkPackageIs('UpdateWorkPackage1'));

        // Execute
        WorkPackageActions.designerSelectsWorkPackage('UpdateWorkPackage2');

        // Verify
        expect(WorkPackageVerifications.currentDesignerWorkPackageIs('UpdateWorkPackage2'));
    });


    // Conditions
    it('Only a Manager may select a New Work Package from the Design Update Work Package list', function(){

        // Setup - Manager
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');

        // Execute

        WorkPackageActions.managerSelectsWorkPackage('UpdateWorkPackage3');

        // Verify
        expect(WorkPackageVerifications.currentManagerWorkPackageIs('UpdateWorkPackage3'));


        // Setup - Developer
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.developerSelectsUpdate('DesignUpdate1');

        // Execute
        let expectation = {success: false, message: WorkPackageValidationErrors.WORK_PACKAGE_INVALID_ROLE_VIEW_NEW};
        WorkPackageActions.developerSelectsWorkPackage('UpdateWorkPackage3', expectation);

        // Verify
        expect(WorkPackageVerifications.currentDeveloperWorkPackageIs('NONE'));


        // Setup - Designer
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');

        // Execute
        // Same failure expectation as before
        WorkPackageActions.designerSelectsWorkPackage('UpdateWorkPackage3', expectation);

        // Verify
        expect(WorkPackageVerifications.currentDesignerWorkPackageIs('NONE'));
    });

});

