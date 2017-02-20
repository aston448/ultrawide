
import { Meteor } from 'meteor/meteor';

import { WorkPackages }             from '../../imports/collections/work/work_packages.js';

import ClientWorkPackageServices    from '../../imports/apiClient/apiClientWorkPackage.js';
import TestDataHelpers              from '../test_modules/test_data_helpers.js'

Meteor.methods({

    'testWorkPackages.selectWorkPackage'(workPackageName, userRole, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);

        // This is not a validated action
        ClientWorkPackageServices.selectWorkPackage(userRole, userContext, workPackage);
    },

    'testWorkPackages.addNewWorkPackage'(workPackageType, userRole, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        let openWpItems = [];

        const outcome = ClientWorkPackageServices.addNewWorkPackage(userRole, userContext, workPackageType, openWpItems);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Add WP');
    },

    'testWorkPackages.publishSelectedWorkPackage'(userName, userRole, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});

        const outcome = ClientWorkPackageServices.publishWorkPackage(userRole, userContext, workPackage._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Publish WP');
    },

    'testWorkPackages.withdrawSelectedWorkPackage'(userName, userRole, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});

        const outcome = ClientWorkPackageServices.withdrawWorkPackage(userRole, userContext, workPackage._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Withdraw WP');
    },

    'testWorkPackages.editWorkPackage'(workPackageName, workPackageType, userName, userRole, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);

        const outcome = ClientWorkPackageServices.editWorkPackage(userRole, userContext, workPackage._id, workPackageType);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Edit WP');
    },

    'testWorkPackages.editSelectedWorkPackage'(workPackageType, userName, userRole, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});

        const outcome = ClientWorkPackageServices.editWorkPackage(userRole, userContext, workPackage._id, workPackageType);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Edit Selected WP');
    },

    'testWorkPackages.viewWorkPackage'(workPackageName, workPackageType, userName, userRole, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);

        const outcome = ClientWorkPackageServices.viewWorkPackage(userRole, userContext, workPackage._id, workPackageType);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'View WP');
    },

    'testWorkPackages.updateWorkPackageName'(newName, userRole, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        // Assumption that WP is always selected before it can be updated
        const userContext = TestDataHelpers.getUserContext(userName);

        const outcome = ClientWorkPackageServices.updateWorkPackageName(userRole, userContext.workPackageId, newName);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Update WP Name');
    },

    'testWorkPackages.removeSelectedWorkPackage'(userName, userRole, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});

        const outcome = ClientWorkPackageServices.removeWorkPackage(userRole, userContext, workPackage._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Remove WP');
    },

    'testWorkPackages.developSelectedWorkPackage'(userName, userRole, viewOptions, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        viewOptions.userId = userContext.userId;
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});
        const mashDataStale = true; // Make the data load for the WP (REDUX setting)

        const outcome = ClientWorkPackageServices.developWorkPackage(userRole, userContext, viewOptions, workPackage._id, false, mashDataStale);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Develop WP');
    }

});