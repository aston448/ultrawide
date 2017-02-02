import { Meteor } from 'meteor/meteor';

import ClientDesignVersionServices      from '../../imports/apiClient/apiClientDesignVersion.js';
import TestDataHelpers                  from '../test_modules/test_data_helpers.js'

import { ViewType, RoleType} from '../../imports/constants/constants.js';

Meteor.methods({

    'testDesignVersions.selectDesignVersion'(designVersionName, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const designVersion = TestDataHelpers.getDesignVersion(userContext.designId, designVersionName);

        const outcome = ClientDesignVersionServices.setDesignVersion(userContext, designVersion._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation);
    },

    'testDesignVersions.publishDesignVersion'(designVersionName, userRole, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const designVersion = TestDataHelpers.getDesignVersion(userContext.designId, designVersionName);

        const outcome = ClientDesignVersionServices.publishDesignVersion(userRole, userContext, designVersion._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation);
    },

    'testDesignVersions.withdrawDesignVersion'(designVersionName, userName, userRole, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const designVersion = TestDataHelpers.getDesignVersion(userContext.designId, designVersionName);

        const outcome = ClientDesignVersionServices.withdrawDesignVersion(userRole, userContext, designVersion._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation);
    },

    'testDesignVersions.editDesignVersion'(designVersionName, userRole, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const viewOptions = TestDataHelpers.getViewOptions(userName);
        const designVersion = TestDataHelpers.getDesignVersion(userContext.designId, designVersionName);

        const outcome = ClientDesignVersionServices.editDesignVersion(userRole, viewOptions, userContext, designVersion._id, false);

        TestDataHelpers.processClientCallOutcome(outcome, expectation);
    },

    'testDesignVersions.viewDesignVersion'(designVersionName, userRole, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const viewOptions = TestDataHelpers.getViewOptions(userName);
        const designVersion = TestDataHelpers.getDesignVersion(userContext.designId, designVersionName);

        const outcome = ClientDesignVersionServices.viewDesignVersion(userRole, viewOptions, userContext, designVersion, false);

        TestDataHelpers.processClientCallOutcome(outcome, expectation);
    },

    'testDesignVersions.updateDesignVersionName'(newName, userRole, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        // Assumption that DV is always selected before it can be updated
        const userContext = TestDataHelpers.getUserContext(userName);

        const outcome = ClientDesignVersionServices.updateDesignVersionName(userRole, userContext.designVersionId, newName);

        TestDataHelpers.processClientCallOutcome(outcome, expectation);
    },

    'testDesignVersions.updateDesignVersionNumber'(newNumber, userRole, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        // Assumption that DV is always selected before it can be updated
        const userContext = TestDataHelpers.getUserContext(userName);

        const outcome = ClientDesignVersionServices.updateDesignVersionNumber(userRole, userContext.designVersionId, newNumber);

        TestDataHelpers.processClientCallOutcome(outcome, expectation);
    },

    'testDesignVersions.createNextDesignVersion'(currentDesignVersionName, userRole, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const designVersion = TestDataHelpers.getDesignVersion(userContext.designId, currentDesignVersionName);

        const outcome = ClientDesignVersionServices.createNextDesignVersion(userRole, userContext, designVersion._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation);
    }

});
