import { Meteor } from 'meteor/meteor';

import fs from 'fs';

import { ClientImpExServices }          from '../../imports/apiClient/apiClientImpEx.js'
import { TestDataHelpers }              from '../test_modules/test_data_helpers.js'
import { ImpexModules }                 from '../../imports/service_modules/administration/impex_service_modules.js';

Meteor.methods({

    'testRestore.restoreDesignBackup'(userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const user = TestDataHelpers.getUser(userName);

        const backupDir = ImpexModules.getBackupLocation();

        const backupFiles = fs.readdirSync(backupDir);

        if(backupFiles.length !== 1){

            // Error - only ever expecting 1 backup file
            throw new Meteor.Error("BACKUP FILES ERROR", "Found " + backupFiles.length + " file(s).  Expecting just one.");

        } else {

            const backupFile = backupFiles[0];

            const outcome = ClientImpExServices.restoreDesign(backupFile, user.userId);

            //console.log("Called restore Design with backup file " + backupFile);

            TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Restore Design');
        }

    },

});
