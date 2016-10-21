/**
 * Created by aston on 03/07/2016.
 */

import { Meteor } from 'meteor/meteor';

import { Designs } from '../../collections/design/designs.js';
import { DesignVersions } from '../../collections/design/design_versions.js';
import { DesignUpdates } from '../../collections/design_update/design_updates.js';
import { UserRoles } from '../../collections/users/user_roles.js';
import { UserCurrentEditContext } from '../../collections/context/user_current_edit_context.js';
import { UserCurrentDevContext } from '../../collections/context/user_current_dev_context.js';

import { DesignVersionStatus, ItemType } from '../../constants/constants.js';
import DataCreate from '../server/data_create.js';
import ImpExServices from '../../servicers/import_export.js'

// Set up some dummy data
Meteor.startup(() => {

    if(Meteor.isServer){
        console.log('STARTUP...  Fixtures');



        if(Designs.find({}).count() === 0) {

            console.log('Inserting data...');


            // Make up a temporary user until login implemented


            // Create a new account
            let designerUserId = Accounts.createUser(
                {
                    username: 'user1',
                    password: 'user1'
                }
            );

            UserRoles.insert({
                userId: designerUserId,
                userName: 'gloria',
                displayName: 'Gloria Slap',
                isDesigner: true,
                isDeveloper: false,
                isManager: false
            });

            let developerUserId = Accounts.createUser(
                {
                    username: 'user2',
                    password: 'user2'
                }
            );

            UserRoles.insert({
                userId: developerUserId,
                userName: 'hugh',
                displayName: 'Hugh Gengin',
                isDesigner: false,
                isDeveloper: true,
                isManager: false
            });

            let managerUserId = Accounts.createUser(
                {
                    username: 'user3',
                    password: 'user3'
                }
            );

            UserRoles.insert({
                userId: managerUserId,
                userName: 'miles',
                displayName: 'Miles Behind',
                isDesigner: false,
                isDeveloper: false,
                isManager: true
            });

            // Start that user at the beginning.  Assume no settings yet
            UserCurrentEditContext.insert({
                userId: designerUserId
            });

            UserCurrentEditContext.insert({
                userId: developerUserId
            });

            UserCurrentDevContext.insert({
                userId: developerUserId,
                featureFilesLocation: '/Users/aston/WebstormProjects/shared/features/'
            });

            UserCurrentEditContext.insert({
                userId: managerUserId
            });

            // Import the last saved data
            ImpExServices.importUltrawideData();

        } else {
            // Run migration code if needed.


        }
    }
});


