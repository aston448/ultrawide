import { Meteor } from 'meteor/meteor';

import { Designs }                  from '../../imports/collections/design/designs.js';
import { UserCurrentEditContext }   from '../../imports/collections/context/user_current_edit_context.js';

import  ClientDesignServices    from '../../imports/apiClient/apiClientDesign.js'
import {RoleType} from '../../imports/constants/constants.js';

Meteor.methods({

    'testDesigns.addNewDesign'(role){
        ClientDesignServices.addNewDesign(role);
    },

    'testDesigns.updateDesignName'(role, existingName, newName){

        const design = Designs.findOne({designName: existingName});

        ClientDesignServices.saveDesignName(role, design._id, newName);

    },

    'testDesigns.selectDesign'(newDesign){

        const design = Designs.findOne({designName: newDesign});
        const userId = Meteor.userId();
        const userContext = UserCurrentEditContext.findOne({userId: userId});

        ClientDesignServices.setDesign(userContext, design._id);
    },

    'testDesigns.workDesign'(designName){
        const design = Designs.findOne({designName: designName});
        const userId = Meteor.userId();
        const userContext = UserCurrentEditContext.findOne({userId: userId});

        ClientDesignServices.workDesign(userContext, RoleType.DESIGNER, design._id)
    }

});