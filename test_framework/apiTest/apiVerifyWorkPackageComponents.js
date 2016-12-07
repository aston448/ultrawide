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
});
