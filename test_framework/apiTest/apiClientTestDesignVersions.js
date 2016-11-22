import { Meteor } from 'meteor/meteor';

import { Designs }                  from '../../imports/collections/design/designs.js';
import { DesignVersions }           from '../../imports/collections/design/design_versions.js';
import { UserCurrentEditContext }   from '../../imports/collections/context/user_current_edit_context.js';
import { UserCurrentViewOptions }   from '../../imports/collections/context/user_current_view_options.js';
import { UserRoles }                from '../../imports/collections/users/user_roles.js';

import ClientDesignVersionServices      from '../../imports/apiClient/apiClientDesignVersion.js';

import {RoleType} from '../../imports/constants/constants.js';

Meteor.methods({

    'testDesignVersions.publishDesignVersion'(designVersionName, userName, userRole){

        const user = UserRoles.findOne({userName: userName});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});
        const designVersion = DesignVersions.findOne({designId: userContext.designId, designVersionName: designVersionName});

        ClientDesignVersionServices.publishDesignVersion(userRole, userContext, designVersion._id);
    },

    'testDesignVersions.unpublishDesignVersion'(designVersionName, userName, userRole){

        const user = UserRoles.findOne({userName: userName});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});
        const designVersion = DesignVersions.findOne({designId: userContext.designId, designVersionName: designVersionName});

        ClientDesignVersionServices.unpublishDesignVersion(userRole, userContext, designVersion._id);
    },

    'testDesignVersions.editDesignVersion'(designVersionName, userName, userRole){

        const user = UserRoles.findOne({userName: userName});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});
        const viewOptions = UserCurrentViewOptions.findOne({userId: user.userId});
        const designVersion = DesignVersions.findOne({designId: userContext.designId, designVersionName: designVersionName});

        ClientDesignVersionServices.editDesignVersion(userRole, viewOptions, userContext, designVersion._id, false);
    }
});
