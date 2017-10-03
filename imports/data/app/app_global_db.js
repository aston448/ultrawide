
import { AppGlobal }                    from '../../collections/app/app_global.js';

class AppGlobalData{

    // SELECT ==========================================================================================================

    getDataByVersionKey(versionKey){

        return AppGlobal.findOne({
            versionKey: versionKey
        });
    }

    getAllDataVersions(){

        return AppGlobal.find({}, {$sort: {versionDate: -1}}).fetch();
    }
}

export default new AppGlobalData()