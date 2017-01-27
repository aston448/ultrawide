
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class UserContextVerifications{

    designerUserContextDesignIs(designName){

        server.call('verifyUserContext.designIs', designName, 'gloria', (function(error, result){
                return(error === null);
            })
        );

    };


}

export default new UserContextVerifications();
