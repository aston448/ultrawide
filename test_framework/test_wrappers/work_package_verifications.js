import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction, WorkPackageType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class WorkPackageVerifications{

    workPackageExistsForManagerCalled(wpName){
        server.call('verifyWorkPackages.workPackageExistsCalled', wpName, 'miles',
            (function(error, result){
                return(error === null);
            })
        );
    }
}

export default new WorkPackageVerifications();
