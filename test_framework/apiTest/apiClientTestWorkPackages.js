
import { Meteor } from 'meteor/meteor';

import { WorkPackages }             from '../../imports/collections/work/work_packages.js';
import { UserCurrentEditContext }   from '../../imports/collections/context/user_current_edit_context.js';
import { UserCurrentViewOptions }   from '../../imports/collections/context/user_current_view_options.js';
import { UserRoles }                from '../../imports/collections/users/user_roles.js';

import ClientWorkPackageServices    from '../../imports/apiClient/apiClientWorkPackage.js';

import {RoleType} from '../../imports/constants/constants.js';

Meteor.methods({

    'testWorkPackages.addNewWorkPackage'(userName, userRole, workPackageType){

        const user = UserRoles.findOne({userName: userName});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});

        ClientWorkPackageServices.addNewWorkPackage(userRole, userContext.designVersionId, userContext.designUpdateId, workPackageType)
    },

    'testWorkPackages.selectWorkPackage'(workPackageName, userName){

        const user = UserRoles.findOne({userName: userName});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});
        const workPackage = WorkPackages.findOne({
            designVersionId: userContext.designVersionId,
            designUpdateId: userContext.designUpdateId,
            workPackageName: workPackageName});

        ClientWorkPackageServices.setWorkPackage(userContext, workPackage._id);
    },

    'testWorkPackages.publishWorkPackage'(workPackageName, userName, userRole){

        const user = UserRoles.findOne({userName: userName});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});
        const workPackage = WorkPackages.findOne({
            designVersionId: userContext.designVersionId,
            designUpdateId: userContext.designUpdateId,
            workPackageName: workPackageName});

        ClientWorkPackageServices.publishWorkPackage(userRole, userContext, workPackage._id);
    },

    'testWorkPackages.editWorkPackage'(workPackageName, workPackageType, userName, userRole){

        const user = UserRoles.findOne({userName: userName});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});
        const viewOptions = UserCurrentViewOptions.findOne({userId: user.userId});
        const workPackage = WorkPackages.findOne({
            designVersionId: userContext.designVersionId,
            designUpdateId: userContext.designUpdateId,
            workPackageName: workPackageName});

        ClientWorkPackageServices.editWorkPackage(userRole, userContext, workPackage._id, workPackageType);
    },

    'testWorkPackages.viewWorkPackage'(workPackageName, workPackageType, userName, userRole){

        const user = UserRoles.findOne({userName: userName});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});
        const viewOptions = UserCurrentViewOptions.findOne({userId: user.userId});
        const workPackage = WorkPackages.findOne({
            designVersionId: userContext.designVersionId,
            designUpdateId: userContext.designUpdateId,
            workPackageName: workPackageName});

        ClientWorkPackageServices.viewWorkPackage(userRole, userContext, workPackage._id, workPackageType);
    },

    'testWorkPackages.updateWorkPackageName'(newName, userRole, userName){

        // Assumption that WP is always selected before it can be updated
        const user = UserRoles.findOne({userName: userName});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});

        ClientWorkPackageServices.updateWorkPackageName(userRole, userContext.workPackageId, newName)
    }

});