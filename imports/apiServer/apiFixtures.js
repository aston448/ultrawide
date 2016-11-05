import { Meteor } from 'meteor/meteor';

import { Designs }                  from '../collections/design/designs.js';
import { UserRoles }                from '../collections/users/user_roles.js';
import { UserCurrentEditContext }   from '../collections/context/user_current_edit_context.js';
import { UserCurrentDevContext }    from '../collections/context/user_current_dev_context.js';

import  ImpExServices     from '../servicers/import_export.js';

Meteor.methods({

    'fixtures.startup'(){

        console.log('STARTUP...  Fixtures');


        if(UserRoles.find({}).count() === 0) {

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

            //TODO get proper root
            // NOTE: The Features folder is in the TEST version of Ultrawide - for self testing!
            const root =  '/Users/aston/WebstormProjects/ultrawide-test';    //Meteor.rootPath;

            console.log("Setting root path to " + root);

            // Start that user at the beginning.  Assume no settings yet
            UserCurrentEditContext.insert({
                userId: designerUserId,
            });
            UserCurrentDevContext.insert({
                userId: designerUserId,
                featureFilesLocation:   root + '/tests/features/',
                featureTestResultsLocation: '/Users/aston/WebstormProjects/shared/test/test_results.json'
            });

            UserCurrentEditContext.insert({
                userId: developerUserId,
            });
            UserCurrentDevContext.insert({
                userId: developerUserId,
                featureFilesLocation:   root + '/tests/features/',
                featureTestResultsLocation: '/Users/aston/WebstormProjects/shared/test/test_results.json'
            });

            UserCurrentEditContext.insert({
                userId: managerUserId,
            });
            UserCurrentDevContext.insert({
                userId: managerUserId,
                featureFilesLocation:   root + '/tests/features/',
                featureTestResultsLocation: '/Users/aston/WebstormProjects/shared/test/test_results.json'
            });

            // Import the last saved data
            ImpExServices.importUltrawideData();

        } else {
            // Run migration code if needed.
            console.log('Using existing data...');

        }

    }

});
