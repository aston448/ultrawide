import { Meteor } from 'meteor/meteor';

import ClientDesignVersionServices      from '../../imports/apiClient/apiClientDesignVersion.js';
import TestDataHelpers                  from '../test_modules/test_data_helpers.js'

import { ViewType, RoleType} from '../../imports/constants/constants.js';

Meteor.methods({

    'testDesignVersions.selectDesignVersion'(designVersionName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designVersion = TestDataHelpers.getDesignVersion(userContext.designId, designVersionName);

        ClientDesignVersionServices.setDesignVersion(userContext, designVersion._id);
    },

    'testDesignVersions.publishDesignVersion'(designVersionName, userRole, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designVersion = TestDataHelpers.getDesignVersion(userContext.designId, designVersionName);

        ClientDesignVersionServices.publishDesignVersion(userRole, userContext, designVersion._id);
    },

    'testDesignVersions.withdrawDesignVersion'(designVersionName, userName, userRole){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designVersion = TestDataHelpers.getDesignVersion(userContext.designId, designVersionName);

        ClientDesignVersionServices.withdrawDesignVersion(userRole, userContext, designVersion._id);
    },

    'testDesignVersions.editDesignVersion'(designVersionName, userRole, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const viewOptions = TestDataHelpers.getViewOptions(userName);
        const designVersion = TestDataHelpers.getDesignVersion(userContext.designId, designVersionName);

        ClientDesignVersionServices.editDesignVersion(userRole, viewOptions, userContext, designVersion._id, false);
    },

    'testDesignVersions.viewDesignVersion'(designVersionName, userRole, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const viewOptions = TestDataHelpers.getViewOptions(userName);
        const designVersion = TestDataHelpers.getDesignVersion(userContext.designId, designVersionName);

        ClientDesignVersionServices.viewDesignVersion(userRole, viewOptions, userContext, designVersion, false);
    },

    'testDesignVersions.updateDesignVersionName'(newName, userRole, userName){

        // Assumption that DV is always selected before it can be updated
        const userContext = TestDataHelpers.getUserContext(userName);

        ClientDesignVersionServices.updateDesignVersionName(userRole, userContext.designVersionId, newName)
    },

    'testDesignVersions.updateDesignVersionNumber'(newNumber, userRole, userName){

        // Assumption that DV is always selected before it can be updated
        const userContext = TestDataHelpers.getUserContext(userName);

        ClientDesignVersionServices.updateDesignVersionNumber(userRole, userContext.designVersionId, newNumber)
    },

    'testDesignVersions.createNextDesignVersion'(currentDesignVersionName, userRole, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designVersion = TestDataHelpers.getDesignVersion(userContext.designId, currentDesignVersionName);

        ClientDesignVersionServices.createNextDesignVersion(userRole, userContext, designVersion._id)
    }

});
