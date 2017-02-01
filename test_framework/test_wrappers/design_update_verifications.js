
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class DesignUpdateVerifications{

    updateExistsForDesignerCalled(updateName){
        server.call('verifyDesignUpdates.designUpdateExistsCalled', updateName, 'gloria',
            (function(error, result){
                return(error === null);
            })
        );
    }

    updateDoesNotExistForDesignerCalled(updateName){
        server.call('verifyDesignUpdates.designUpdateDoesNotExistCalled', updateName, 'gloria',
            (function(error, result){
                return(error === null);
            })
        );
    }

    selectedUpdateNameForDesignerIs(updateName){
        server.call('verifyDesignUpdates.currentDesignUpdateNameIs', updateName, 'gloria',
            (function(error, result){
                return(error === null);
            })
        );
    }

    selectedUpdateRefForDesignerIs(updateRef){
        server.call('verifyDesignUpdates.currentDesignUpdateRefIs', updateRef, 'gloria',
            (function(error, result){
                return(error === null);
            })
        );
    }

    updateStatusForUpdate_ForDesignerIs(updateName, status){
        server.call('verifyDesignUpdates.designUpdateStatusIs', updateName, status, 'gloria',
            (function(error, result){
                return(error === null);
            })
        );
    }

    updateMergeActionForUpdate_ForDesignerIs(updateName, action){
        server.call('verifyDesignUpdates.designUpdateMergeActionIs', updateName, action, 'gloria',
            (function(error, result){
                return(error === null);
            })
        );
    }


}

export default new DesignUpdateVerifications();
