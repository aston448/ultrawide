import { Meteor } from 'meteor/meteor';

import { Designs }                  from '../../imports/collections/design/designs.js';
import { UserCurrentEditContext }   from '../../imports/collections/context/user_current_edit_context.js';
import { UserRoles }                from '../../imports/collections/users/user_roles.js';

import  ClientDesignServices    from '../../imports/apiClient/apiClientDesign.js'
import {RoleType} from '../../imports/constants/constants.js';

Meteor.methods({

    'testDesigns.addNewDesign'(role){
        ClientDesignServices.addNewDesign(role);
    },

    'testDesigns.updateDesignName'(role, existingName, newName){

        const design = Designs.findOne({designName: existingName});

        ClientDesignServices.updateDesignName(role, design._id, newName);

    },

    'testDesigns.selectDesign'(designName, userName){

        const design = Designs.findOne({designName: designName});
        const user = UserRoles.findOne({userName: userName});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});

        ClientDesignServices.setDesign(userContext, design._id);
    },

    'testDesigns.workDesign'(designName, userName){
        const design = Designs.findOne({designName: designName});
        const user = UserRoles.findOne({userName: userName});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});

        ClientDesignServices.workDesign(userContext, RoleType.DESIGNER, design._id)
    },

    'testDesigns.removeDesign'(designName, userName, userRole){
        const design = Designs.findOne({designName: designName});
        const user = UserRoles.findOne({userName: userName});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});

        ClientDesignServices.removeDesign(userContext, userRole, design._id)
    }

});