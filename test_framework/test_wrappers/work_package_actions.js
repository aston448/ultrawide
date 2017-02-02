import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction, WorkPackageType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class WorkPackageActions{

    managerAddsBaseDesignWorkPackage(expectation){
        server.call('testWorkPackages.addNewWorkPackage', WorkPackageType.WP_BASE, RoleType.MANAGER, 'miles', expectation);
    }

    managerAddsUpdateWorkPackage(expectation){
        server.call('testWorkPackages.addNewWorkPackage', WorkPackageType.WP_UPDATE, RoleType.MANAGER, 'miles', expectation);
    }

    managerSelectsWorkPackage(wpName){
        server.call('testWorkPackages.selectWorkPackage', wpName, 'miles');
    }

    developerSelectsWorkPackage(wpName){
        server.call('testWorkPackages.selectWorkPackage', wpName, 'hugh');
    }

    designerSelectsWorkPackage(wpName){
        server.call('testWorkPackages.selectWorkPackage', wpName, 'gloria', expectation);
    }

    managerUpdatesSelectedWpNameTo(newName, expectation){
        server.call('testWorkPackages.updateWorkPackageName', newName, RoleType.MANAGER, 'miles', expectation);
    }

    managerPublishesSelectedWorkPackage(expectation){
        server.call('testWorkPackages.publishSelectedWorkPackage', 'miles', RoleType.MANAGER, expectation);
    }

    managerWithdrawsSelectedWorkPackage(expectation){
        server.call('testWorkPackages.withdrawSelectedWorkPackage', 'miles', RoleType.MANAGER, expectation);
    }

    managerRemovesSelectedWorkPackage(expectation){
        server.call('testWorkPackages.removeSelectedWorkPackage', 'miles', RoleType.MANAGER, expectation);
    }

    managerEditsBaseWorkPackage(wpName, expectation){
        server.call('testWorkPackages.editWorkPackage', wpName, WorkPackageType.WP_BASE, 'miles', RoleType.MANAGER, expectation);
    }

    managerEditsSelectedBaseWorkPackage(expectation){
        server.call('testWorkPackages.editSelectedWorkPackage', WorkPackageType.WP_BASE, 'miles', RoleType.MANAGER, expectation);
    }

    managerViewsBaseWorkPackage(wpName, expectation){
        server.call('testWorkPackages.viewWorkPackage', wpName, WorkPackageType.WP_BASE, 'miles', RoleType.MANAGER, expectation);
    }

    developerViewsBaseWorkPackage(wpName, expectation){
        server.call('testWorkPackages.viewWorkPackage', wpName, WorkPackageType.WP_BASE, 'hugh', RoleType.DEVELOPER, expectation);
    }

    designerViewsBaseWorkPackage(wpName, expectation){
        server.call('testWorkPackages.viewWorkPackage', wpName, WorkPackageType.WP_BASE, 'gloria', RoleType.DESIGNER, expectation);
    }


}

export default new WorkPackageActions();