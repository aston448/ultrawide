
import { AppGlobal }                    from '../../collections/app/app_global.js';

class AppGlobalDataClass{

    // INSERT ==========================================================================================================

    insertNewGlobalData(versionKey, appVersion, dataVersion, versionDate, dataStore){

        return AppGlobal.insert({
            versionKey:         'CURRENT_VERSION',
            appVersion:         appVersion,
            dataVersion:        dataVersion,
            versionDate:        versionDate,
            dataStore:          dataStore
        });
    }

    // SELECT ==========================================================================================================

    getDataByVersionKey(versionKey){

        return AppGlobal.findOne({
            versionKey: versionKey
        });
    }

    getAllDataVersions(){

        return AppGlobal.find({}, {$sort: {versionDate: -1}}).fetch();
    }

    // UPDATE ==========================================================================================================

    updateGlobalDataForVersionKey(versionKey, appVersion, dataVersion, versionDate, dataStore){

        return AppGlobal.update(
            {versionKey: versionKey},
            {
                $set:{
                    appVersion:         appVersion,
                    dataVersion:        dataVersion,
                    versionDate:        versionDate,
                    dataStore:          dataStore
                }
            }
        );
    }
}

export const AppGlobalData = new AppGlobalDataClass()