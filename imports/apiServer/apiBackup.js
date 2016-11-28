
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { backupDesign } from '../apiValidatedMethods/backup_methods.js'


class ServerBackupApi {

    backupDesign(designId, userRole, callback){

        backupDesign.call(
            {
                designId: designId,
                userRole: userRole
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };
}

export default new ServerBackupApi();
