
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class DesignUpdateVerificationsClass{

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

    updateStatusForUpdate_ForDeveloperIs(updateName, status){
        server.call('verifyDesignUpdates.designUpdateStatusIs', updateName, status, 'hugh',
            (function(error, result){
                return(error === null);
            })
        );
    }

    updateStatusForUpdate_ForManagerIs(updateName, status){
        server.call('verifyDesignUpdates.designUpdateStatusIs', updateName, status, 'miles',
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

    updateMergeActionForUpdate_ForDeveloperIs(updateName, action){
        server.call('verifyDesignUpdates.designUpdateMergeActionIs', updateName, action, 'hugh',
            (function(error, result){
                return(error === null);
            })
        );
    }

    updateMergeActionForUpdate_ForManagerIs(updateName, action){
        server.call('verifyDesignUpdates.designUpdateMergeActionIs', updateName, action, 'miles',
            (function(error, result){
                return(error === null);
            })
        );
    }

    updateWpStatusForUpdate_ForDesignerIs(updateName, status){
        server.call('verifyDesignUpdates.designUpdateWpStatusIs', updateName, status, 'gloria',
            (function(error, result){
                return(error === null);
            })
        );
    }

    updateWpStatusForUpdate_ForDeveloperIs(updateName, status){
        server.call('verifyDesignUpdates.designUpdateWpStatusIs', updateName, status, 'hugh',
            (function(error, result){
                return(error === null);
            })
        );
    }

    updateWpStatusForUpdate_ForManagerIs(updateName, status){
        server.call('verifyDesignUpdates.designUpdateWpStatusIs', updateName, status, 'miles',
            (function(error, result){
                return(error === null);
            })
        );
    }

    updateTestStatusForUpdate_ForDesignerIs(updateName, status){
        server.call('verifyDesignUpdates.designUpdateTestStatusIs', updateName, status, 'gloria',
            (function(error, result){
                return(error === null);
            })
        );
    }

    updateTestStatusForUpdate_ForDeveloperIs(updateName, status){
        server.call('verifyDesignUpdates.designUpdateTestStatusIs', updateName, status, 'hugh',
            (function(error, result){
                return(error === null);
            })
        );
    }

    updateTestStatusForUpdate_ForManagerIs(updateName, status){
        server.call('verifyDesignUpdates.designUpdateTestStatusIs', updateName, status, 'miles',
            (function(error, result){
                return(error === null);
            })
        );
    }

    currentUpdateForDesignerIs(updateName){
        server.call('verifyDesignUpdates.currentDesignUpdateNameIs', updateName, 'gloria',
            (function(error, result){
                return(error === null);
            })
        )
    }

    currentUpdateForDeveloperIs(updateName){
        server.call('verifyDesignUpdates.currentDesignUpdateNameIs', updateName, 'hugh',
            (function(error, result){
                return(error === null);
            })
        )
    }

    currentUpdateForManagerIs(updateName){
        server.call('verifyDesignUpdates.currentDesignUpdateNameIs', updateName, 'miles',
            (function(error, result){
                return(error === null);
            })
        )
    }


}

export const DesignUpdateVerifications = new DesignUpdateVerificationsClass();
