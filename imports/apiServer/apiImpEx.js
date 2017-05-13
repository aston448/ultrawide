
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import {
    backupDesign,
    restoreDesign,
    archiveDesign
} from '../apiValidatedMethods/impex_methods.js'


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

    restoreDesign(backupFileName, userId, callback){

        restoreDesign.call(
            {
                backupFileName: backupFileName,
                userId:         userId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    archiveDesign(designId, userId, callback){

        archiveDesign.call(
            {
                designId:   designId,
                userId:     userId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };
}

export default new ServerBackupApi();