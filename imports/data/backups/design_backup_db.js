
import { DesignBackups }                from '../../collections/backups/design_backups.js';

class DesignBackupData{

    // INSERT ==========================================================================================================

    insertNewBackup(metadata, fileName){

        return DesignBackups.insert({
            backupName:             metadata.backupName,
            backupFileName:         fileName,
            backupDesignName:       metadata.designName,
            backupDate:             metadata.backupDate,
            backupDataVersion:      metadata.backupDataVersion,
            fileExists:             true
        });
    }
    // SELECT ==========================================================================================================

    getAllBackups(){

        return DesignBackups.find({}).fetch();
    }

    getBackupByFileName(fileName){

        return DesignBackups.findOne({backupFileName: fileName});
    }

    // UPDATE ==========================================================================================================

    markAllAsNoFile(){

        return DesignBackups.update({}, {$set: {fileExists: false}}, {multi: true});
    }

    setFileExists(fileId, fileExists){

        return DesignBackups.update(
            {_id: fileId},
            {
                $set:{
                    fileExists: fileExists
                }
            }
        );
    }

    // REMOVE ==========================================================================================================

    removeAllNonExistingBackups(){

        return DesignBackups.remove({
            fileExists: false
        });
    }

}

export default new DesignBackupData();