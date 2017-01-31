import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction, WorkPackageType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class WorkPackageActions{

    managerAddsBaseDesignWorkPackage(){
        server.call('testWorkPackages.addNewWorkPackage', WorkPackageType.WP_BASE, RoleType.MANAGER, 'miles');
    }

    managerAddsUpdateWorkPackage(){
        server.call('testWorkPackages.addNewWorkPackage', WorkPackageType.WP_UPDATE, RoleType.MANAGER, 'miles');
    }

    managerSelectsWorkPackage(wpName){
        server.call('testWorkPackages.selectWorkPackage', wpName, 'miles');
    }

    developerSelectsWorkPackage(wpName){
        server.call('testWorkPackages.selectWorkPackage', wpName, 'hugh');
    }

    designerSelectsWorkPackage(wpName){
        server.call('testWorkPackages.selectWorkPackage', wpName, 'gloria');
    }

    managerUpdatesSelectedWpNameTo(newName){
        server.call('testWorkPackages.updateWorkPackageName', newName, RoleType.MANAGER, 'miles');
    }

    managerPublishesSelectedWorkPackage(){
        server.call('testWorkPackages.publishSelectedWorkPackage', 'miles', RoleType.MANAGER);
    }

    managerWithdrawsSelectedWorkPackage(){
        server.call('testWorkPackages.withdrawSelectedWorkPackage', 'miles', RoleType.MANAGER);
    }

    managerRemovesSelectedWorkPackage(){
        server.call('testWorkPackages.removeSelectedWorkPackage', 'miles', RoleType.MANAGER);
    }

    managerEditsBaseWorkPackage(wpName){
        server.call('testWorkPackages.editWorkPackage', wpName, WorkPackageType.WP_BASE, 'miles', RoleType.MANAGER);
    }

    managerEditsSelectedBaseWorkPackage(){
        server.call('testWorkPackages.editSelectedWorkPackage', WorkPackageType.WP_BASE, 'miles', RoleType.MANAGER);
    }

    managerViewsBaseWorkPackage(wpName){
        server.call('testWorkPackages.viewWorkPackage', wpName, WorkPackageType.WP_BASE, 'miles', RoleType.MANAGER);
    }

    developerViewsBaseWorkPackage(wpName){
        server.call('testWorkPackages.viewWorkPackage', wpName, WorkPackageType.WP_BASE, 'hugh', RoleType.DEVELOPER);
    }

    designerViewsBaseWorkPackage(wpName){
        server.call('testWorkPackages.viewWorkPackage', wpName, WorkPackageType.WP_BASE, 'gloria', RoleType.DESIGNER);
    }


}

export default new WorkPackageActions();