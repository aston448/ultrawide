import { Meteor } from 'meteor/meteor';

import { ClientDesignServices }             from '../../imports/apiClient/apiClientDesign.js'
import { ClientDesignVersionServices }      from '../../imports/apiClient/apiClientDesignVersion.js';
import {TestDataHelpers}                 from '../test_modules/test_data_helpers.js'

import {RoleType} from '../../imports/constants/constants.js';

Meteor.methods({

    'testDesigns.addNewDesign'(role, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const outcome = ClientDesignServices.addNewDesign(role);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Add Design');
    },

    'testDesigns.updateDesignName'(role, existingName, newName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const design = TestDataHelpers.getDesign(existingName);

        const outcome = ClientDesignServices.updateDesignName(role, design._id, newName);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Update Design Name');
    },

    'testDesigns.selectDesign'(designName, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const design = TestDataHelpers.getDesign(designName);
        const userContext = TestDataHelpers.getUserContext(userName);

        const outcome = ClientDesignServices.setDesign(userContext, design._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Select Design');
    },

    'testDesigns.workDesign'(designName, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const design = TestDataHelpers.getDesign(designName);
        const userContext = TestDataHelpers.getUserContext(userName);

        const outcome = ClientDesignServices.workDesign(userContext, RoleType.DESIGNER, design._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Work Design');
    },

    'testDesigns.removeDesign'(designName, userRole, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const design = TestDataHelpers.getDesign(designName);
        const userContext = TestDataHelpers.getUserContext(userName);

        const outcome = ClientDesignServices.removeDesign(userContext, userRole, design._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Remove Design');
    },

    // 'testDesigns.editDesignVersion'(designName, designVersionName, userRole, userName, expectation){
    //
    //     expectation = TestDataHelpers.getExpectation(expectation);
    //
    //     const design = TestDataHelpers.getDesign(designName);
    //     const designVersion = TestDataHelpers.getDesignVersion(design._id, designVersionName);
    //     const userContext = TestDataHelpers.getUserContext(userName);
    //     const viewOptions = TestDataHelpers.getViewOptions(userName);
    //
    //     const outcome = ClientDesignVersionServices.editDesignVersion(userRole, viewOptions, userContext, designVersion._id, false);
    //
    //     TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Edit Design Version');
    // },

});