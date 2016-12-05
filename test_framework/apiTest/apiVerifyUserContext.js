import { Meteor } from 'meteor/meteor';

import TestDataHelpers              from '../test_modules/test_data_helpers.js'

Meteor.methods({

    'verifyUserContext.designIs'(designName, userName){

        const design = TestDataHelpers.getDesign(designName);
        const userContext = TestDataHelpers.getUserContext(userName);

        if(userContext.designId != design._id){
            throw new Meteor.Error("FAIL", "User context design id is: " + userContext.designId + " expected: " + design._id);
        }
    },

    'verifyUserContext.designVersionIs'(designVersionName, userName){
        // Assume that Design is set in user context before checking Design Version
        const userContext = TestDataHelpers.getUserContext(userName);
        const designVersion = TestDataHelpers.getDesignVersion(userContext.designId, designVersionName);

        if(userContext.designVersionId != designVersion._id){
            throw new Meteor.Error("FAIL", "User context design version id is: " + userContext.designVersionId + " expected: " + designVersion._id);
        }
    },

    // Methods to verify that context is cleared
    'verifyUserContext.designVersionIsNone'(userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        if(userContext.designVersionId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context design version id is: " + userContext.designVersionId + " expected: NONE");
        }
    },

    'verifyUserContext.designUpdateIsNone'(userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        if(userContext.designUpdateId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context design update id is: " + userContext.designUpdateId + " expected: NONE");
        }
    },

    'verifyUserContext.workPackageIsNone'(userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        if(userContext.workPackageId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context work package id is: " + userContext.workPackageId + " expected: NONE");
        }
    },

    'verifyUserContext.designComponentIsNone'(userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        if(userContext.designComponentId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context design component id is: " + userContext.designComponentId + " expected: NONE");
        }
    },

    'verifyUserContext.designComponentTypeIsNone'(userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        if(userContext.designComponentType != 'NONE'){
            throw new Meteor.Error("FAIL", "User context design component type is: " + userContext.designComponentType + " expected: NONE");
        }
    },

    'verifyUserContext.featureReferenceIsNone'(userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        if(userContext.featureReferenceId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context feature reference is: " + userContext.featureReferenceId + " expected: NONE");
        }
    },

    'verifyUserContext.featureAspectReferenceIsNone'(userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        if(userContext.featureAspectReferenceId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context feature aspect reference is: " + userContext.featureAspectReferenceId + " expected: NONE");
        }
    },

    'verifyUserContext.scenarioReferenceIsNone'(userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        if(userContext.scenarioReferenceId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context scenario reference is: " + userContext.scenarioReferenceId + " expected: NONE");
        }
    },

    'verifyUserContext.scenarioStepIsNone'(userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        if(userContext.scenarioStepId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context scenario step reference is: " + userContext.scenarioStepId + " expected: NONE");
        }
    },

});

