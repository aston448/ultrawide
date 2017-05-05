
// Ultrawide Collections
import { AppGlobalData }                from '../../collections/app/app_global_data.js';


// Ultrawide Services
import { LogLevel } from '../../constants/constants.js';
import { log }              from '../../common/utils.js';


//======================================================================================================================
//
// Server Modules for Import Export.
//
// Methods called from within main API methods
//
//======================================================================================================================

class StartupModules{

    setUltrawideVersionData(){

        const appData = AppGlobalData.findOne({
            versionKey: 'CURRENT_VERSION'
        });

        // MODIFY THIS CODE FOR EACH NEW RELEASE
        const appVersion = 1;                   // Version of Ultrawide
        const dataVersion = 1;                  // DB Version of Ultrawide
        const versionDate = '2017-05-04';       // Date this version introduced

        if(!appData){

            AppGlobalData.insert({
                versionKey:         'CURRENT_VERSION',
                appVersion:         appVersion,
                dataVersion:        dataVersion,
                versionDate:        versionDate
            });

        } else {

            AppGlobalData.update(
                {versionKey: 'CURRENT_VERSION'},
                {
                    $set:{
                        appVersion:         appVersion,
                        dataVersion:        dataVersion,
                        versionDate:        versionDate
                    }
                }
            )
        }
    }
}

export default new StartupModules();
