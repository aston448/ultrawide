
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class DesignVerifications{

    defaultNewDesignExists(){
        server.call('verifyDesigns.designExistsCalled', DefaultItemNames.NEW_DESIGN_NAME,
            (function(error, result){
                return(error === null);
            })
        );
    }

    defaultNewDesignDoesNotExist(){
        server.call('verifyDesigns.designDoesNotExistCalled', DefaultItemNames.NEW_DESIGN_NAME,
            (function(error, result){
                return(error === null);
            })
        );
    }

    designExistsCalled(designName){
        server.call('verifyDesigns.designExistsCalled', designName,
            (function(error, result){
                return(error === null);
            })
        );
    }

    designDoesNotExistCalled(designName){
        server.call('verifyDesigns.designDoesNotExistCalled', designName,
            (function(error, result){
                return(error === null);
            })
        );
    }

    designCountIs(count){
        server.call('verifyDesigns.designCountIs', count,
            (function(error, result){
                return(error === null);
            })
        );
    }


}

export default new DesignVerifications();
