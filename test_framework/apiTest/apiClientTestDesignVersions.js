import { Meteor } from 'meteor/meteor';

import ClientDesignVersionServices      from '../../imports/apiClient/apiClientDesignVersion.js';
import TestDataHelpers                  from '../test_modules/test_data_helpers.js'

import { ViewType, RoleType} from '../../imports/constants/constants.js';

Meteor.methods({

    'testDesignVersions.selectDesignVersion'(designVersionName, userName, expectation){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designVersion = TestDataHelpers.getDesignVersion(userContext.designId, designVersionName);

        // This is not a validated method - don't process outcome
        ClientDesignVersionServices.setDesignVersion(userContext, designVersion._id);

    },

    'testDesignVersions.publishDesignVersion'(designVersionName, userRole, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const designVersion = TestDataHelpers.getDesignVersion(userContext.designId, designVersionName);

        const outcome = ClientDesignVersionServices.publishDesignVersion(userRole, userContext, designVersion._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Publish Design Version');
    },

    'testDesignVersions.withdrawDesignVersion'(designVersionName, userName, userRole, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const designVersion = TestDataHelpers.getDesignVersion(userContext.designId, designVersionName);

        const outcome = ClientDesignVersionServices.withdrawDesignVersion(userRole, userContext, designVersion._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Withdraw Design Version');
    },

    'testDesignVersions.editDesignVersion'(designVersionName, userRole, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const viewOptions = TestDataHelpers.getViewOptions(userName);
        const designVersion = TestDataHelpers.getDesignVersion(userContext.designId, designVersionName);

        const outcome = ClientDesignVersionServices.editDesignVersion(userRole, viewOptions, userContext, designVersion._id, false);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Edit Design Version');
    },

    'testDesignVersions.viewDesignVersion'(designVersionName, userRole, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const viewOptions = TestDataHelpers.getViewOptions(userName);
        const designVersion = TestDataHelpers.getDesignVersion(userContext.designId, designVersionName);

        const outcome = ClientDesignVersionServices.viewDesignVersion(userRole, viewOptions, userContext, designVersion._id, false, true);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'View Design Version');
    },

    'testDesignVersions.updateDesignVersionName'(newName, userRole, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        // Assumption that DV is always selected before it can be updated
        const userContext = TestDataHelpers.getUserContext(userName);

        const outcome = ClientDesignVersionServices.updateDesignVersionName(userRole, userContext.designVersionId, newName);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Update Design Version Name');
    },

    'testDesignVersions.updateDesignVersionNumber'(newNumber, userRole, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        // Assumption that DV is always selected before it can be updated
        const userContext = TestDataHelpers.getUserContext(userName);

        const outcome = ClientDesignVersionServices.updateDesignVersionNumber(userRole, userContext.designVersionId, newNumber);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Update Design Version Number');
    },

    'testDesignVersions.createNextDesignVersion'(currentDesignVersionName, userRole, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const designVersion = TestDataHelpers.getDesignVersion(userContext.designId, currentDesignVersionName);

        const outcome = ClientDesignVersionServices.createNextDesignVersion(userRole, userContext, designVersion._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Create Next Design Version');
    },

    'testDesignVersions.updateWorkingDesignVersion'(designVersionName, userRole, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const designVersion = TestDataHelpers.getDesignVersion(userContext.designId, designVersionName);

        const outcome = ClientDesignVersionServices.updateWorkingDesignVersion(userRole, userContext, designVersion._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Update Working Design Version');
    }

});
