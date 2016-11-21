import { Meteor } from 'meteor/meteor';

import { Designs }                  from '../../imports/collections/design/designs.js';
import { DesignVersions }           from '../../imports/collections/design/design_versions.js';
import { UserCurrentEditContext }   from '../../imports/collections/context/user_current_edit_context.js';
import { UserCurrentViewOptions }   from '../../imports/collections/context/user_current_view_options.js';
import { UserRoles }                from '../../imports/collections/users/user_roles.js';

import ClientDesignServices             from '../../imports/apiClient/apiClientDesign.js'
import ClientDesignVersionServices      from '../../imports/apiClient/apiClientDesignVersion.js';

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
    },

    'testDesigns.selectDesignVersion'(){

    },

    'testDesigns.editDesignVersion'(designName, designVersionName, userName, userRole){

        const design = Designs.findOne({designName: designName});
        const designVersion = DesignVersions.findOne({designId: design._id, designVersionName: designVersionName});
        const user = UserRoles.findOne({userName: userName});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});
        const viewOptions = UserCurrentViewOptions.findOne({userId: user.userId});


        ClientDesignVersionServices.editDesignVersion(userRole, viewOptions, userContext, designVersion._id)
    },

});