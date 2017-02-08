import { Meteor } from 'meteor/meteor';

import { AppGlobalData }            from '../collections/app/app_global_data.js';
import { Designs }                  from '../collections/design/designs.js';
import { UserRoles }                from '../collections/users/user_roles.js';
import { UserCurrentEditContext }   from '../collections/context/user_current_edit_context.js';
import { UserCurrentDevContext }    from '../collections/context/user_current_dev_context.js';

import  ImpExServices     from '../servicers/backup/import_export.js';

Meteor.methods({

    'fixtures.startup'(){

        console.log('STARTUP...  Fixtures');

        if(AppGlobalData.find({}).count() === 0){

            AppGlobalData.insert({
                appVersion:         '1',
                dataVersion:        '1',
                versionDate:        '20161128'
            });
        }


        if(UserRoles.find({}).count() === 0) {

            console.log('Inserting data...');


            // Import the last saved data
            ImpExServices.importUltrawideData();

        } else {
            // Run migration code if needed.
            console.log('Using existing data...');

        }

    },

    'fixtures.forceRemoveDesign'(designId){
        ImpExServices.forceRemoveDesign(designId);
    }

});
