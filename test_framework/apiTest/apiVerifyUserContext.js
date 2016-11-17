import { Meteor } from 'meteor/meteor';

import { Designs }                  from '../../imports/collections/design/designs.js';
import { UserCurrentEditContext }   from '../../imports/collections/context/user_current_edit_context.js';

Meteor.methods({

    'verifyUserContext.designIs'(designName){

        const userId = Meteor.userId();
        const design = Designs.findOne({designName: designName});
        const userContext = UserCurrentEditContext.findOne({userId: userId});

        if(userContext.designId != design._id){
            throw new Meteor.Error("FAIL", "User context design id is: " + userContext.designId + " expected: " + design._id);
        }
    },

    // Methods to verify that context is cleared
    'verifyUserContext.designVersionIsNone'(){

        const userId = Meteor.userId();
        const userContext = UserCurrentEditContext.findOne({userId: userId});

        if(userContext.designVersionId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context design version id is: " + userContext.designVersionId + " expected: NONE");
        }
    },

    'verifyUserContext.designUpdateIsNone'(){

        const userId = Meteor.userId();
        const userContext = UserCurrentEditContext.findOne({userId: userId});

        if(userContext.designUpdateId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context design update id is: " + userContext.designUpdateId + " expected: NONE");
        }
    },

    'verifyUserContext.workPackageIsNone'(){

        const userId = Meteor.userId();
        const userContext = UserCurrentEditContext.findOne({userId: userId});

        if(userContext.workPackageId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context work package id is: " + userContext.workPackageId + " expected: NONE");
        }
    },

    'verifyUserContext.designComponentIsNone'(){

        const userId = Meteor.userId();
        const userContext = UserCurrentEditContext.findOne({userId: userId});

        if(userContext.designComponentId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context design component id is: " + userContext.designComponentId + " expected: NONE");
        }
    },

    'verifyUserContext.designComponentTypeIsNone'(){

        const userId = Meteor.userId();
        const userContext = UserCurrentEditContext.findOne({userId: userId});

        if(userContext.designComponentType != 'NONE'){
            throw new Meteor.Error("FAIL", "User context design component type is: " + userContext.designComponentType + " expected: NONE");
        }
    },

    'verifyUserContext.featureReferenceIsNone'(){

        const userId = Meteor.userId();
        const userContext = UserCurrentEditContext.findOne({userId: userId});

        if(userContext.featureReferenceId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context feature reference is: " + userContext.featureReferenceId + " expected: NONE");
        }
    },

    'verifyUserContext.featureAspectReferenceIsNone'(){

        const userId = Meteor.userId();
        const userContext = UserCurrentEditContext.findOne({userId: userId});

        if(userContext.featureAspectReferenceId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context feature aspect reference is: " + userContext.featureAspectReferenceId + " expected: NONE");
        }
    },

    'verifyUserContext.scenarioReferenceIsNone'(){

        const userId = Meteor.userId();
        const userContext = UserCurrentEditContext.findOne({userId: userId});

        if(userContext.scenarioReferenceId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context scenario reference is: " + userContext.scenarioReferenceId + " expected: NONE");
        }
    },

    'verifyUserContext.scenarioStepIsNone'(){

        const userId = Meteor.userId();
        const userContext = UserCurrentEditContext.findOne({userId: userId});

        if(userContext.scenarioStepId != 'NONE'){
            throw new Meteor.Error("FAIL", "User context scenario step reference is: " + userContext.scenarioStepId + " expected: NONE");
        }
    },

});

