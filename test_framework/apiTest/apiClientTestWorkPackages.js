
import { Meteor } from 'meteor/meteor';

import { WorkPackages }             from '../../imports/collections/work/work_packages.js';

import ClientWorkPackageServices    from '../../imports/apiClient/apiClientWorkPackage.js';
import TestDataHelpers              from '../test_modules/test_data_helpers.js'

Meteor.methods({

    'testWorkPackages.addNewWorkPackage'(workPackageType, userRole, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        let openWpItems = [];

        ClientWorkPackageServices.addNewWorkPackage(userRole, userContext, workPackageType, openWpItems)
    },

    'testWorkPackages.selectWorkPackage'(workPackageName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);

        ClientWorkPackageServices.setWorkPackage(userContext, workPackage._id);
    },

    'testWorkPackages.publishWorkPackage'(workPackageName, userName, userRole){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);

        ClientWorkPackageServices.publishWorkPackage(userRole, userContext, workPackage._id);
    },

    'testWorkPackages.publishSelectedWorkPackage'(userName, userRole){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});

        ClientWorkPackageServices.publishWorkPackage(userRole, userContext, workPackage._id);
    },

    'testWorkPackages.withdrawWorkPackage'(workPackageName, userName, userRole){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);

        ClientWorkPackageServices.withdrawWorkPackage(userRole, userContext, workPackage._id);
    },

    'testWorkPackages.withdrawSelectedWorkPackage'(userName, userRole){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});

        ClientWorkPackageServices.withdrawWorkPackage(userRole, userContext, workPackage._id);
    },

    'testWorkPackages.editWorkPackage'(workPackageName, workPackageType, userName, userRole){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);

        ClientWorkPackageServices.editWorkPackage(userRole, userContext, workPackage._id, workPackageType);
    },

    'testWorkPackages.editSelectedWorkPackage'(workPackageType, userName, userRole){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});

        ClientWorkPackageServices.editWorkPackage(userRole, userContext, workPackage._id, workPackageType);
    },

    'testWorkPackages.viewWorkPackage'(workPackageName, workPackageType, userName, userRole){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);

        ClientWorkPackageServices.viewWorkPackage(userRole, userContext, workPackage._id, workPackageType);
    },

    'testWorkPackages.updateWorkPackageName'(newName, userRole, userName){

        // Assumption that WP is always selected before it can be updated
        const userContext = TestDataHelpers.getUserContext(userName);

        ClientWorkPackageServices.updateWorkPackageName(userRole, userContext.workPackageId, newName)
    },

    'testWorkPackages.removeWorkPackage'(workPackageName, userName, userRole){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);

        ClientWorkPackageServices.removeWorkPackage(userRole, userContext, workPackage._id)
    },

    'testWorkPackages.removeSelectedWorkPackage'(userName, userRole){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});

        ClientWorkPackageServices.removeWorkPackage(userRole, userContext, workPackage._id)
    }

});