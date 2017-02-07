import { Meteor } from 'meteor/meteor';

import TestDataHelpers              from '../test_modules/test_data_helpers.js'

Meteor.methods({

    'verifyUserContext.designIs'(designName, userName){

        let design = null;
        let designId = 'NONE';

        if(designName != 'NONE'){
            design = TestDataHelpers.getDesign(designName);
            designId = design._id;
        }

        const userContext = TestDataHelpers.getUserContext(userName);

        if(userContext.designId != designId){
            throw new Meteor.Error("FAIL", "User context design id for user " + userName + " is: " + userContext.designId + " expected: " + design._id);
        }
    },

    'verifyUserContext.designVersionIs'(designVersionName, userName){
        // Assume that Design is set in user context before checking Design Version
        const userContext = TestDataHelpers.getUserContext(userName);
        const designVersion = TestDataHelpers.getDesignVersion(userContext.designId, designVersionName);

        if(userContext.designVersionId != designVersion._id){
            throw new Meteor.Error("FAIL", "User context design version id for user " + userName + " is: " + userContext.designVersionId + " expected: " + designVersion._id);
        }
    },

    'verifyUserContext.designUpdateIs'(designUpdateName, userName){
        // Assume that Design / Design Version is set in user context before checking Design Update
        const userContext = TestDataHelpers.getUserContext(userName);
        const designUpdate = TestDataHelpers.getDesignUpdate(userContext.designVersionId, designUpdateName);

        if(userContext.designUpdateId != designUpdate._id){
            throw new Meteor.Error("FAIL", "User context design update id for user " + userName + " is: " + userContext.designUpdateId + " expected: " + designUpdate._id);
        }
    },

    'verifyUserContext.workPackageIs'(workPackageName, userName){
        // Assume that Design / Design Version / Design Update is set in user context before checking Work Package
        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);

        if(userContext.workPackageId != workPackage._id){
            throw new Meteor.Error("FAIL", "User context work package id for user " + userName + " is: " + userContext.workPackageId + " expected: " + workPackage._id);
        }
    },

    'verifyUserContext.designComponentIs'(componentType, parentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const component = TestDataHelpers.getDesignComponentWithParent(
            userContext.designVersionId,
            componentType,
            parentName,
            componentName
        );

        if(userContext.designComponentId != component._id){
            throw new Meteor.Error("FAIL", "User context design component id for user " + userName + " is: " + userContext.designComponentId + " expected: " + component._id);
        }
    },

    // Methods to verify that context is cleared
    'verifyUserContext.designIsNone'(userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        if(userContext.designId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context design id for user " + userName + " is: " + userContext.designId + " expected: NONE");
        }
    },

    'verifyUserContext.designVersionIsNone'(userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        if(userContext.designVersionId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context design version id for user " + userName + " is: " + userContext.designVersionId + " expected: NONE");
        }
    },

    'verifyUserContext.designUpdateIsNone'(userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        if(userContext.designUpdateId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context design update id for user " + userName + " is: " + userContext.designUpdateId + " expected: NONE");
        }
    },

    'verifyUserContext.workPackageIsNone'(userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        if(userContext.workPackageId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context work package id for user " + userName + " is: " + userContext.workPackageId + " expected: NONE");
        }
    },

    'verifyUserContext.designComponentIsNone'(userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        if(userContext.designComponentId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context design component id for user " + userName + " is: " + userContext.designComponentId + " expected: NONE");
        }
    },

    'verifyUserContext.designComponentTypeIsNone'(userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        if(userContext.designComponentType != 'NONE'){
            throw new Meteor.Error("FAIL", "User context design component type for user " + userName + " is: " + userContext.designComponentType + " expected: NONE");
        }
    },

    'verifyUserContext.featureReferenceIsNone'(userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        if(userContext.featureReferenceId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context feature reference for user " + userName + " is: " + userContext.featureReferenceId + " expected: NONE");
        }
    },

    'verifyUserContext.featureAspectReferenceIsNone'(userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        if(userContext.featureAspectReferenceId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context feature aspect reference for user " + userName + " is: " + userContext.featureAspectReferenceId + " expected: NONE");
        }
    },

    'verifyUserContext.scenarioReferenceIsNone'(userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        if(userContext.scenarioReferenceId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context scenario reference for user " + userName + " is: " + userContext.scenarioReferenceId + " expected: NONE");
        }
    },

    'verifyUserContext.scenarioStepIsNone'(userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        if(userContext.scenarioStepId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context scenario step reference for user " + userName + " is: " + userContext.scenarioStepId + " expected: NONE");
        }
    },

});

