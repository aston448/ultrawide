import { Meteor } from 'meteor/meteor';


import { UserCurrentEditContext }   from '../../imports/collections/context/user_current_edit_context.js';
import { UserRoles }                from '../../imports/collections/users/user_roles.js';

import  ClientDesignServices    from '../../imports/apiClient/apiClientDesign.js'

Meteor.methods({

    'testUserContext.setFullDummyEditContext'(userName){

        // Sets a dummy user context for test purposes
        const user = UserRoles.findOne({userName: userName});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});

        UserCurrentEditContext.update(
            {_id: userContext._id},
            {
                $set:{
                    designId:                       'DUMMY',
                    designVersionId:                'DUMMY',
                    designUpdateId:                 'DUMMY',
                    workPackageId:                  'DUMMY',
                    designComponentId:              'DUMMY',
                    designComponentType:            'DUMMY',

                    featureReferenceId:             'DUMMY',
                    featureAspectReferenceId:       'DUMMY',
                    scenarioReferenceId:            'DUMMY',
                    scenarioStepId:                 'DUMMY',

                }
            }
        )
    },


});
