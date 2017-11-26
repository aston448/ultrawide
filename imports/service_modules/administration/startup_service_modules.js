
import fs from 'fs';

// Ultrawide Services
import { UltrawideDirectory, LogLevel } from '../../constants/constants.js';
import { log }              from '../../common/utils.js';

// Data Access
import AppGlobalData        from '../../data/app/app_global_db.js';

//======================================================================================================================
//
// Server Modules for Import Export.
//
// Methods called from within main API methods
//
//======================================================================================================================

class StartupModules{

    setUltrawideVersionData(){

        let dataStore = process.env.ULTRAWIDE_DATA_STORE;

        if (typeof(dataStore) === 'undefined') {
            throw new Meteor.Error('STARTUP', 'Ultrawide Data Store is not defined');
        }

        if(dataStore.length === 0){
            throw new Meteor.Error('STARTUP', 'Ultrawide Data Store is not defined');
        }

        // Add trailing / if missing
        if(!dataStore.endsWith('/')){
            dataStore = dataStore + '/';
        }

        const appData = AppGlobalData.getDataByVersionKey('CURRENT_VERSION');

        // MODIFY THIS CODE FOR EACH NEW RELEASE
        const appVersion = 1;                   // Version of Ultrawide
        const dataVersion = 1;                  // DB Version of Ultrawide
        const versionDate = '2017-05-04';       // Date this version introduced

        if(!appData){

            AppGlobalData.insertNewGlobalData(
                'CURRENT_VERSION',
                appVersion,
                dataVersion,
                versionDate,
                dataStore
            );

        } else {

            AppGlobalData.updateGlobalDataForVersionKey(
                'CURRENT_VERSION',
                appVersion,
                dataVersion,
                versionDate,
                dataStore
            );
        }

        return dataStore;
    }

    checkCreateDataDirs(dataStore){

        // There are two fixed dirs under the main ultrawide data dir: design_backups and test_outputs
        try {
            if (!fs.existsSync(dataStore + UltrawideDirectory.BACKUP_DIR)) {
                fs.mkdirSync(dataStore + UltrawideDirectory.BACKUP_DIR);
            }

            if (!fs.existsSync(dataStore + UltrawideDirectory.TEST_OUTPUT_DIR)) {
                fs.mkdirSync(dataStore + UltrawideDirectory.TEST_OUTPUT_DIR);
            }

            if (!fs.existsSync(dataStore + UltrawideDirectory.EXPORT_DIR)) {
                fs.mkdirSync(dataStore + UltrawideDirectory.EXPORT_DIR);
            }

        } catch (e) {
            log((msg) => console.log(msg), LogLevel.ERROR, 'Failed to create basic Ultrawide directories: {}', e.stack);
            throw new Meteor.Error(e.code, e.stack);
        }
    }


}

export default new StartupModules();
