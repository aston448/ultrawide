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


            // Import the last saved data
            ImpExServices.importUltrawideData();

        } else {
            // Run migration code if needed.
            console.log('Using existing data...');

        }

    }

});
