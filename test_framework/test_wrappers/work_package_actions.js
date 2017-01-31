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
}

export default new WorkPackageActions();