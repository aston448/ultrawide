import { Meteor } from 'meteor/meteor';

import ClientDesignUpdateServices       from '../../imports/apiClient/apiClientDesignUpdate.js';
import TestDataHelpers                  from '../test_modules/test_data_helpers.js'

import {RoleType} from '../../imports/constants/constants.js';

Meteor.methods({

    'testDesignUpdates.addDesignUpdate'(userName, userRole){

        const userContext = TestDataHelpers.getUserContext(userName);

        ClientDesignUpdateServices.addNewDesignUpdate(userRole, userContext.designVersionId)
    },

    'testDesignUpdates.selectDesignUpdate'(designUpdateName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designUpdate = TestDataHelpers.getDesignUpdate(userContext.designVersionId, designUpdateName);

        ClientDesignUpdateServices.setDesignUpdate(userContext, designUpdate._id);
    },

    'testDesignUpdates.publishDesignUpdate'(designUpdateName, userName, userRole){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designUpdate = TestDataHelpers.getDesignUpdate(userContext.designVersionId, designUpdateName);

        ClientDesignUpdateServices.publishDesignUpdate(userRole, userContext, designUpdate._id);
    },

    'testDesignUpdates.withdrawDesignUpdate'(designUpdateName, userName, userRole){

    },

    'testDesignUpdates.editDesignUpdate'(designUpdateName, userName, userRole){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designUpdate = TestDataHelpers.getDesignUpdate(userContext.designVersionId, designUpdateName);

        ClientDesignUpdateServices.editDesignUpdate(userRole, userContext, designUpdate._id);
    },

    'testDesignUpdates.viewDesignUpdate'(designUpdateName, userName, userRole){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designUpdate = TestDataHelpers.getDesignUpdate(userContext.designVersionId, designUpdateName);

        ClientDesignUpdateServices.viewDesignUpdate(userRole, userContext, designUpdate._id);
    },

    'testDesignUpdates.updateDesignUpdateName'(newName, userRole, userName){

        // Assumption that DU is selected before name updated
        const userContext = TestDataHelpers.getUserContext(userName);

        ClientDesignUpdateServices.updateDesignUpdateName(userRole, userContext.designUpdateId, newName)
    },

    'testDesignUpdates.updateDesignUpdateVersion'(newVersion, userRole, userName){

        // Assumption that DU is always selected before it can be updated
        const userContext = TestDataHelpers.getUserContext(userName);

        ClientDesignUpdateServices.updateDesignUpdateVersion(userRole, userContext.designUpdateId, newVersion)
    },

});
