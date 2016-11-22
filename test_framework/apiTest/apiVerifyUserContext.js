import { Meteor } from 'meteor/meteor';

import { Designs }                  from '../../imports/collections/design/designs.js';
import { DesignVersions }           from '../../imports/collections/design/design_versions.js';
import { UserCurrentEditContext }   from '../../imports/collections/context/user_current_edit_context.js';
import { UserRoles }                from '../../imports/collections/users/user_roles.js';

Meteor.methods({

    'verifyUserContext.designIs'(designName, username){

        const design = Designs.findOne({designName: designName});
        const user = UserRoles.findOne({userName: username});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});


        if(userContext.designId != design._id){
            throw new Meteor.Error("FAIL", "User context design id is: " + userContext.designId + " expected: " + design._id);
        }
    },

    'verifyUserContext.designVersionIs'(designVersionName, username){
        // Assume that Design is set in user context before checking Design Version
        const user = UserRoles.findOne({userName: username});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});

        console.log('User Context for ' + username + " is DE: " + userContext.designId + " DV: " + userContext.designVersionId);
        const designVersion = DesignVersions.findOne({designId: userContext.designId, designVersionName: designVersionName});



        if(userContext.designVersionId != designVersion._id){
            throw new Meteor.Error("FAIL", "User context design version id is: " + userContext.designVersionId + " expected: " + designVersion._id);
        }
    },

    // Methods to verify that context is cleared
    'verifyUserContext.designVersionIsNone'(username){

        const user = UserRoles.findOne({userName: username});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});

        if(userContext.designVersionId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context design version id is: " + userContext.designVersionId + " expected: NONE");
        }
    },

    'verifyUserContext.designUpdateIsNone'(username){

        const user = UserRoles.findOne({userName: username});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});

        if(userContext.designUpdateId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context design update id is: " + userContext.designUpdateId + " expected: NONE");
        }
    },

    'verifyUserContext.workPackageIsNone'(username){

        const user = UserRoles.findOne({userName: username});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});

        if(userContext.workPackageId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context work package id is: " + userContext.workPackageId + " expected: NONE");
        }
    },

    'verifyUserContext.designComponentIsNone'(username){

        const user = UserRoles.findOne({userName: username});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});

        if(userContext.designComponentId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context design component id is: " + userContext.designComponentId + " expected: NONE");
        }
    },

    'verifyUserContext.designComponentTypeIsNone'(username){

        const user = UserRoles.findOne({userName: username});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});

        if(userContext.designComponentType != 'NONE'){
            throw new Meteor.Error("FAIL", "User context design component type is: " + userContext.designComponentType + " expected: NONE");
        }
    },

    'verifyUserContext.featureReferenceIsNone'(username){

        const user = UserRoles.findOne({userName: username});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});

        if(userContext.featureReferenceId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context feature reference is: " + userContext.featureReferenceId + " expected: NONE");
        }
    },

    'verifyUserContext.featureAspectReferenceIsNone'(username){

        const user = UserRoles.findOne({userName: username});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});

        if(userContext.featureAspectReferenceId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context feature aspect reference is: " + userContext.featureAspectReferenceId + " expected: NONE");
        }
    },

    'verifyUserContext.scenarioReferenceIsNone'(username){

        const user = UserRoles.findOne({userName: username});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});

        if(userContext.scenarioReferenceId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context scenario reference is: " + userContext.scenarioReferenceId + " expected: NONE");
        }
    },

    'verifyUserContext.scenarioStepIsNone'(username){

        const user = UserRoles.findOne({userName: username});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});

        if(userContext.scenarioStepId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context scenario step reference is: " + userContext.scenarioStepId + " expected: NONE");
        }
    },

});

