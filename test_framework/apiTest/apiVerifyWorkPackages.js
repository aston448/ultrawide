import { Meteor } from 'meteor/meteor';

import { WorkPackages }             from '../../imports/collections/work/work_packages.js';

import TestDataHelpers              from '../test_modules/test_data_helpers.js'

Meteor.methods({

    'verifyWorkPackages.workPackageStatusIs'(workPackageName, newStatus, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);

        if(workPackage.workPackageStatus === newStatus){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expected WP status " + newStatus + " but has status " + workPackage.workPackageStatus);
        }
    },

    'verifyWorkPackages.workPackageStatusIsNot'(workPackageName, newStatus, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);

        if(workPackage.workPackageStatus != newStatus){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expected WP status not to be " + newStatus);
        }
    },

    'verifyWorkPackages.currentWorkPackageStatusIs'(newStatus, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getContextWorkPackage(userContext.workPackageId);

        if(workPackage.workPackageStatus === newStatus){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expected WP status " + newStatus + " but has status " + workPackage.workPackageStatus);
        }
    },

    'verifyWorkPackages.currentWorkPackageNameIs'(workPackageName, userName){

        // WP must be selected by user before this test will work
        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({
            _id: userContext.workPackageId
        });

        if(workPackage) {
            if (workPackage.workPackageName === workPackageName) {
                return true;
            } else {
                throw new Meteor.Error("FAIL", "Expected WP name to be " + workPackageName + " but got " + workPackage.workPackageName);
            }
        } else {
            // OK if NONE expected
            if (workPackageName === 'NONE') {
                return true;
            } else {
                throw new Meteor.Error("FAIL", "Not expecting no Work Package found");
            }
        }
    },

    'verifyWorkPackages.currentWorkPackageAdopterIs'(adopterName, userName){

        // WP must be selected by user before this test will work
        const userContext = TestDataHelpers.getUserContext(userName);

        const workPackage = TestDataHelpers.getContextWorkPackage(userContext.workPackageId);

        if(workPackage) {
            const adopterUser = TestDataHelpers.getUser(adopterName);

            if (workPackage.adoptingUserId === adopterUser.userId) {
                return true;
            } else {
                throw new Meteor.Error("FAIL", "Expected WP adopter to be " + adopterName + " but got " + adopterUser.userName);
            }
        }
    },

    'verifyWorkPackages.currentWorkPackageHasNoAdopter'(userName){

        // WP must be selected by user before this test will work
        const userContext = TestDataHelpers.getUserContext(userName);

        const workPackage = TestDataHelpers.getContextWorkPackage(userContext.workPackageId);

        if(workPackage) {
            if (workPackage.adoptingUserId === 'NONE') {
                return true;
            } else {
                throw new Meteor.Error("FAIL", "Expected WP adopter to be NONE but got user id" + aworkPackage.adoptingUserId);
            }
        }
    },

    'verifyWorkPackages.workPackageExistsCalled'(workPackageName, userName){

        // For testing that WP creation succeeded.  Make sure WP is unique
        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);

        if(workPackage){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "No Work Package exists with name " + workPackageName);

        }
    },

    'verifyWorkPackages.workPackageTypeIs'(workPackageName, wpType, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);

        if(workPackage.workPackageType === wpType){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Work Package " + workPackageName + " is of type " + workPackage.workPackageType + " but expected " + wpType);

        }
    },

    'verifyWorkPackages.workPackageDoesNotExistCalled'(workPackageName, userName){

        // For testing that WP creation failed.  Make sure WP is unique
        const userContext = TestDataHelpers.getUserContext(userName);

        const workPackage = WorkPackages.findOne({
            designVersionId: userContext.designVersionId,
            designUpdateId: userContext.designUpdateId,
            workPackageName: workPackageName});

        if(workPackage){
            throw new Meteor.Error("FAIL", "A Work Package exists with name " + workPackageName);

        } else {
            return true;
        }
    },

    'verifyWorkPackages.workPackageCalledCountIs'(workPackageName, workPackageCount, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const workPackages = WorkPackages.find({
            designVersionId: userContext.designVersionId,
            designUpdateId: userContext.designUpdateId,
            workPackageName: workPackageName
        });

        if(workPackageCount === workPackages.count()){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Found " + workPackages.count() + " Work Packages with name " + workPackageName + ". Expecting " + workPackageCount);
        }
    },

});

