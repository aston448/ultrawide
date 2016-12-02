import { Meteor } from 'meteor/meteor';

import { UserCurrentEditContext }   from '../../imports/collections/context/user_current_edit_context.js';
import { UserRoles }                from '../../imports/collections/users/user_roles.js';
import { DesignVersions }           from '../../imports/collections/design/design_versions.js';
import { WorkPackages }             from '../../imports/collections/work/work_packages.js';
import {DefaultItemNames} from '../../imports/constants/default_names.js';

Meteor.methods({

    'verifyWorkPackages.workPackageStatusIs'(workPackageName, newStatus, userName){

        const user = UserRoles.findOne({userName: userName});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});
        const workPackage = WorkPackages.findOne({
            designVersionId: userContext.designVersionId,
            designUpdateId: userContext.designUpdateId,
            workPackageName: workPackageName});

        if(workPackage.workPackageStatus === newStatus){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expected WP status " + newStatus + " but has status " + workPackage.workPackageStatus);
        }
    },

    'verifyWorkPackages.workPackageStatusIsNot'(workPackageName, newStatus, userName){

        const user = UserRoles.findOne({userName: userName});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});
        const workPackage = WorkPackages.findOne({
            designVersionId: userContext.designVersionId,
            designUpdateId: userContext.designUpdateId,
            workPackageName: workPackageName});

        if(workPackage.workPackageStatus != newStatus){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expected WP status not to be " + newStatus);
        }
    },

    'verifyWorkPackages.currentWorkPackageNameIs'(workPackageName, userName){

        // WP must be selected by user before this test will work
        const user = UserRoles.findOne({userName: userName});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});
        const workPackage = WorkPackages.findOne({
            _id: userContext.workPackageId
        });

        if(workPackage.workPackageName === workPackageName){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expected WP name to be " + workPackageName + " but got " + workPackage.workPackageName);
        }
    },

});

