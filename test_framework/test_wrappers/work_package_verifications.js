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

    workPackageDoesNotExistForManagerCalled(wpName){
        server.call('verifyWorkPackages.workPackageDoesNotExistCalled', wpName, 'miles',
            (function(error, result){
                return(error === null);
            })
        );
    }

    workPackageCalled_CountForManagerIs(wpName, count){
        server.call('verifyWorkPackages.workPackageCalledCountIs', wpName, count, 'miles',
            (function(error, result){
                return(error === null);
            })
        );
    }

    currentManagerWorkPackageIs(workPackageName){
        server.call('verifyWorkPackages.currentWorkPackageNameIs', workPackageName, 'miles');
    }

    currentDeveloperWorkPackageIs(workPackageName){
        server.call('verifyWorkPackages.currentWorkPackageNameIs', workPackageName, 'hugh');
    }

    currentDesignerWorkPackageIs(workPackageName){
        server.call('verifyWorkPackages.currentWorkPackageNameIs', workPackageName, 'gloria');
    }

}

export default new WorkPackageVerifications();
