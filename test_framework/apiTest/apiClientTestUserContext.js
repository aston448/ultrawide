import { Meteor } from 'meteor/meteor';


import { UserCurrentEditContext }   from '../../imports/collections/context/user_current_edit_context.js';

import TestDataHelpers                  from '../test_modules/test_data_helpers.js'

Meteor.methods({

    'testUserContext.setFullDummyEditContext'(userName){

        // Sets a dummy user context for test purposes
        const userContext = TestDataHelpers.getUserContext(userName);

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
