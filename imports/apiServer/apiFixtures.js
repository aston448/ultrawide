import { Meteor } from 'meteor/meteor';

import { AppGlobal }            from '../collections/app/app_global.js';
import { Designs }                  from '../collections/design/designs.js';
import { UserRoles }                from '../collections/users/user_roles.js';
import { UserContext }   from '../collections/context/user_context.js';


import  ImpExServices     from '../servicers/administration/impex_services.js';

// Meteor.methods({
//
//     'fixtures.startup'(){
//
//         console.log('STARTUP...  Fixtures');
//
//         if(AppGlobal.find({}).count() === 0){
//
//             AppGlobal.insert({
//                 appVersion:         '1',
//                 dataVersion:        '1',
//                 versionDate:        '20161128'
//             });
//         }
//
//
//         if(UserRoles.find({}).count() === 0) {
//
//              console.log('Inserting data...');
//
//
//             // Import the last saved data
//             ImpExServices.importUltrawideData();
//
//         } else {
//             // Run migration code if needed.
//             console.log('Using existing data...');
//
//         }
//
//     },
//
//     'fixtures.forceRemoveDesign'(designId){
//         ImpExServices.forceRemoveDesign(designId);
//     }
//
// });
