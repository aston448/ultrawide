import { Meteor } from 'meteor/meteor';

import { WorkPackages }             from '../../imports/collections/work/work_packages.js';

import TestDataHelpers              from '../test_modules/test_data_helpers.js'

Meteor.methods({

    'verifyWorkPackageComponents.componentExistsCalled'(workPackageName, componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);

        // This call will actually verify the component exists and return error if not
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        return true;
    },

    'verifyWorkPackageComponents.componentExistsInCurrentWpCalled'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});

        // This call will actually verify the component exists and return error if not
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        return true;
    },

    'verifyWorkPackageComponents.componentDoesNotExistInCurrentWpCalled'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});

        // This call will actually verify the component exists but we are telling it to expect a failure so it returns true if failing
        const result = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName, true);

        if(!result){
            throw new Meteor.Error("FAIL", "Expecting WP Component " + componentParentName + " - " + componentName + " not to exist but it does");
        }
    },

    'verifyWorkPackageComponents.componentParentIs'(workPackageName, componentType, componentName, parentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);
        const actualParentName = TestDataHelpers.getWorkPackageComponentParentName(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentName);

        if(actualParentName === parentName){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Work Package Component parent is: " + actualParentName + " expected: " + parentName);
        }
    },

    'verifyWorkPackageComponents.componentIsInScope'(workPackageName, componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        if(workPackageComponent.componentActive){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Work Package Component " + componentName + " with parent: " + componentParentName + " is not Active in Scope");
        }
    },

    'verifyWorkPackageComponents.currentWpComponentIsInScope'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        if(workPackageComponent.componentActive){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Work Package Component " + componentName + " with parent: " + componentParentName + " is not Active in Scope");
        }
    },

    'verifyWorkPackageComponents.componentIsInParentScope'(workPackageName, componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        if(workPackageComponent.componentParent){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Work Package Component " + componentName + " with parent: " + componentParentName + " is not in Parent Scope");
        }
    },

    'verifyWorkPackageComponents.currentWpComponentIsInParentScope'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        if(workPackageComponent.componentParent){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Work Package Component " + componentName + " with parent: " + componentParentName + " is not in Parent Scope");
        }
    },

    'verifyWorkPackageComponents.componentIsNotInScope'(workPackageName, componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        if(workPackageComponent.componentParent || workPackageComponent.componentActive){
            throw new Meteor.Error("FAIL", "Work Package Component " + componentName + " with parent: " + componentParentName + " is in Scope!");
        } else {
            return true;
        }
    },

    'verifyWorkPackageComponents.currentWpComponentIsNotInScope'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        if(workPackageComponent.componentParent || workPackageComponent.componentActive){
            throw new Meteor.Error("FAIL", "Work Package Component " + componentName + " with parent: " + componentParentName + " is in Scope!");
        } else {
            return true;
        }
    },
});
