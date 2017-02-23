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

    workPackage_TypeForManagerIs(wpName, wpType){
        server.call('verifyWorkPackages.workPackageTypeIs', wpName, wpType, 'miles',
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

    workPackage_StatusForManagerIs(wpName, wpStatus){
        server.call('verifyWorkPackages.workPackageStatusIs', wpName, wpStatus, 'miles',
            (function(error, result){
                return(error === null);
            })
        );
    }

    workPackage_StatusForDeveloperIs(wpName, wpStatus){
        server.call('verifyWorkPackages.workPackageStatusIs', wpName, wpStatus, 'hugh',
            (function(error, result){
                return(error === null);
            })
        );
    }

    workPackage_StatusForAnotherDeveloperIs(wpName, wpStatus){
        server.call('verifyWorkPackages.workPackageStatusIs', wpName, wpStatus, 'davey',
            (function(error, result){
                return(error === null);
            })
        );
    }

    workPackage_StatusForDesignerIs(wpName, wpStatus){
        server.call('verifyWorkPackages.workPackageStatusIs', wpName, wpStatus, 'gloria',
            (function(error, result){
                return(error === null);
            })
        );
    }

    currentManagerWorkPackageIs(workPackageName){
        server.call('verifyWorkPackages.currentWorkPackageNameIs', workPackageName, 'miles',
            (function(error, result){
                return(error === null);
            })
        );
    }

    currentDeveloperWorkPackageIs(workPackageName){
        server.call('verifyWorkPackages.currentWorkPackageNameIs', workPackageName, 'hugh',
            (function(error, result){
                return(error === null);
            })
        );
    }

    currentDesignerWorkPackageIs(workPackageName){
        server.call('verifyWorkPackages.currentWorkPackageNameIs', workPackageName, 'gloria',
            (function(error, result){
                return(error === null);
            })
        );
    }

    currentDeveloperWorkPackageAdopterIsAdoptedByDeveloper(){
        server.call('verifyWorkPackages.currentWorkPackageAdopterIs', 'hugh', 'hugh',
            (function(error, result){
                return(error === null);
            })
        );
    }

    currentDeveloperWorkPackageAdopterIsAdoptedByAnotherDeveloper(){
        server.call('verifyWorkPackages.currentWorkPackageAdopterIs', 'davey', 'hugh',
            (function(error, result){
                return(error === null);
            })
        );
    }

    currentDesignerWorkPackageAdopterIsAdoptedByDeveloper(){
        server.call('verifyWorkPackages.currentWorkPackageAdopterIs', 'hugh', 'gloria',
            (function(error, result){
                return(error === null);
            })
        );
    }

    currentManagerWorkPackageAdopterIsAdoptedByDeveloper(){
        server.call('verifyWorkPackages.currentWorkPackageAdopterIs', 'hugh', 'miles',
            (function(error, result){
                return(error === null);
            })
        );
    }

    currentDeveloperWorkPackageHasNoAdopter(){
        server.call('verifyWorkPackages.currentWorkPackageHasNoAdoper', 'hugh',
            (function(error, result){
                return(error === null);
            })
        );
    }

}

export default new WorkPackageVerifications();
