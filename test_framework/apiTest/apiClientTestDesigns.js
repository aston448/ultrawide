import { Meteor } from 'meteor/meteor';

import ClientDesignServices             from '../../imports/apiClient/apiClientDesign.js'
import ClientDesignVersionServices      from '../../imports/apiClient/apiClientDesignVersion.js';
import TestDataHelpers                  from '../test_modules/test_data_helpers.js'

import {RoleType} from '../../imports/constants/constants.js';

Meteor.methods({

    'testDesigns.addNewDesign'(role){

        ClientDesignServices.addNewDesign(role);
    },

    'testDesigns.updateDesignName'(role, existingName, newName){

        const design = TestDataHelpers.getDesign(existingName);

        ClientDesignServices.updateDesignName(role, design._id, newName);

    },

    'testDesigns.selectDesign'(designName, userName){

        const design = TestDataHelpers.getDesign(designName);
        const userContext = TestDataHelpers.getUserContext(userName);

        ClientDesignServices.setDesign(userContext, design._id);
    },

    'testDesigns.workDesign'(designName, userName){

        const design = TestDataHelpers.getDesign(designName);
        const userContext = TestDataHelpers.getUserContext(userName);

        ClientDesignServices.workDesign(userContext, RoleType.DESIGNER, design._id)
    },

    'testDesigns.removeDesign'(designName, userName, userRole){

        const design = TestDataHelpers.getDesign(designName);
        const userContext = TestDataHelpers.getUserContext(userName);

        ClientDesignServices.removeDesign(userContext, userRole, design._id)
    },

    'testDesigns.selectDesignVersion'(){

    },

    'testDesigns.editDesignVersion'(designName, designVersionName, userName, userRole){

        const design = TestDataHelpers.getDesign(designName);
        const designVersion = TestDataHelpers.getDesignVersion(design._id, designVersionName);
        const userContext = TestDataHelpers.getUserContext(userName);
        const viewOptions = TestDataHelpers.getViewOptions(userName);

        ClientDesignVersionServices.editDesignVersion(userRole, viewOptions, userContext, designVersion._id)
    },

});