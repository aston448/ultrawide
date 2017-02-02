import { Meteor } from 'meteor/meteor';

import { Designs }                  from '../../imports/collections/design/designs.js';
import { DesignVersions }           from '../../imports/collections/design/design_versions.js';
import { UserCurrentEditContext }   from '../../imports/collections/context/user_current_edit_context.js';
import { UserCurrentViewOptions }   from '../../imports/collections/context/user_current_view_options.js';
import { UserRoles }                from '../../imports/collections/users/user_roles.js';

import ClientBackupServices         from '../../imports/apiClient/apiClientBackup.js'
import TestDataHelpers              from '../test_modules/test_data_helpers.js'

import {RoleType} from '../../imports/constants/constants.js';

Meteor.methods({

    'testBackup.backupDesign'(designName, role, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const design = Designs.findOne({designName: designName});

        const outcome = ClientBackupServices.backupDesign(design._id, role);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Backup Design');
    },

});
