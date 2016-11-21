import { Meteor } from 'meteor/meteor';

import { UserCurrentEditContext }   from '../../imports/collections/context/user_current_edit_context.js';
import { UserRoles }                from '../../imports/collections/users/user_roles.js';
import { DesignVersions }           from '../../imports/collections/design/design_versions.js';
import {DefaultItemNames} from '../../imports/constants/default_names.js';

Meteor.methods({

    'verifyDesignVersions.designVersionStatusIs'(newStatus, userName){

        const user = UserRoles.findOne({userName: userName});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});
        const designVersion = DesignVersions.findOne({
            _id: userContext.designVersionId
        });

        if(designVersion.designVersionStatus === newStatus){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expected DV status " + newStatus + " but has status " + designVersion.designVersionStatus);
        }
    },

    'verifyDesignVersions.designVersionStatusIsNot'(newStatus, userName){

        const user = UserRoles.findOne({userName: userName});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});
        const designVersion = DesignVersions.findOne({
            _id: userContext.designVersionId
        });

        if(designVersion.designVersionStatus != newStatus){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expected DV status not to be " + newStatus);
        }
    },
});
