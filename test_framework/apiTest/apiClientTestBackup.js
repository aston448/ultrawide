import { Meteor } from 'meteor/meteor';

import { Designs }                      from '../../imports/collections/design/designs.js';

import { ClientImpExServices }          from '../../imports/apiClient/apiClientImpEx.js'
import { TestDataHelpers }              from '../test_modules/test_data_helpers.js'

Meteor.methods({

    'testBackup.backupDesign'(designName, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const role = TestDataHelpers.getUserRole(userName);

        const design = Designs.findOne({designName: designName});

        const outcome = ClientImpExServices.backupDesign(design._id, role);

        //console.log("Called backup Design");

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Backup Design');
    },

});
