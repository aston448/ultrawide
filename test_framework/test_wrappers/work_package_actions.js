import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction, WorkPackageType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class WorkPackageActions{

    // Add
    managerAddsBaseDesignWorkPackage(expectation){
        server.call('testWorkPackages.addNewWorkPackage', WorkPackageType.WP_BASE, RoleType.MANAGER, 'miles', expectation);
    }

    managerAddsBaseDesignWorkPackageCalled(wpName, expectation){
        server.call('testWorkPackages.addNewWorkPackage', WorkPackageType.WP_BASE, RoleType.MANAGER, 'miles', expectation);
        server.call('testWorkPackages.selectWorkPackage', DefaultItemNames.NEW_WORK_PACKAGE_NAME, RoleType.MANAGER, 'miles');
        server.call('testWorkPackages.updateWorkPackageName', wpName, RoleType.MANAGER, 'miles', expectation);
    }

    managerAddsUpdateWorkPackage(expectation){
        server.call('testWorkPackages.addNewWorkPackage', WorkPackageType.WP_UPDATE, RoleType.MANAGER, 'miles', expectation);
    }

    managerAddsUpdateWorkPackageCalled(wpName, expectation){
        server.call('testWorkPackages.addNewWorkPackage', WorkPackageType.WP_UPDATE, RoleType.MANAGER, 'miles', expectation);
        server.call('testWorkPackages.selectWorkPackage', DefaultItemNames.NEW_WORK_PACKAGE_NAME, RoleType.MANAGER, 'miles');
        server.call('testWorkPackages.updateWorkPackageName', wpName, RoleType.MANAGER, 'miles', expectation);
    }

    // Select
    managerSelectsWorkPackage(wpName){
        server.call('testWorkPackages.selectWorkPackage', wpName, RoleType.MANAGER, 'miles');
    }

    developerSelectsWorkPackage(wpName){
        server.call('testWorkPackages.selectWorkPackage', wpName, RoleType.DEVELOPER, 'hugh');
    }

    anotherDeveloperSelectsWorkPackage(wpName){
        server.call('testWorkPackages.selectWorkPackage', wpName, RoleType.DEVELOPER, 'davey');
    }


    designerSelectsWorkPackage(wpName){
        server.call('testWorkPackages.selectWorkPackage', wpName, RoleType.DESIGNER, 'gloria');
    }

    // Update Name
    managerUpdatesSelectedWpNameTo(newName, expectation){
        server.call('testWorkPackages.updateWorkPackageName', newName, RoleType.MANAGER, 'miles', expectation);
    }

    // Publish / Withdraw
    managerPublishesSelectedWorkPackage(expectation){
        server.call('testWorkPackages.publishSelectedWorkPackage', 'miles', RoleType.MANAGER, expectation);
    }

    managerWithdrawsSelectedWorkPackage(expectation){
        server.call('testWorkPackages.withdrawSelectedWorkPackage', 'miles', RoleType.MANAGER, expectation);
    }

    // Remove
    managerRemovesSelectedWorkPackage(expectation){
        server.call('testWorkPackages.removeSelectedWorkPackage', 'miles', RoleType.MANAGER, expectation);
    }

    // Edit
    managerEditsBaseWorkPackage(wpName, expectation){
        server.call('testWorkPackages.editWorkPackage', wpName, WorkPackageType.WP_BASE, 'miles', RoleType.MANAGER, expectation);
    }

    managerEditsUpdateWorkPackage(wpName, expectation){
        server.call('testWorkPackages.editWorkPackage', wpName, WorkPackageType.WP_UPDATE, 'miles', RoleType.MANAGER, expectation);
    }

    managerEditsSelectedBaseWorkPackage(expectation){
        server.call('testWorkPackages.editSelectedWorkPackage', WorkPackageType.WP_BASE, 'miles', RoleType.MANAGER, expectation);
    }

    // View
    managerViewsBaseWorkPackage(wpName, expectation){
        server.call('testWorkPackages.viewWorkPackage', wpName, WorkPackageType.WP_BASE, 'miles', RoleType.MANAGER, expectation);
    }

    managerViewsUpdateWorkPackage(wpName, expectation){
        server.call('testWorkPackages.viewWorkPackage', wpName, WorkPackageType.WP_UPDATE, 'miles', RoleType.MANAGER, expectation);
    }

    developerViewsBaseWorkPackage(wpName, expectation){
        server.call('testWorkPackages.viewWorkPackage', wpName, WorkPackageType.WP_BASE, 'hugh', RoleType.DEVELOPER, expectation);
    }

    developerViewsUpdateWorkPackage(wpName, expectation){
        server.call('testWorkPackages.viewWorkPackage', wpName, WorkPackageType.WP_UPDATE, 'hugh', RoleType.DEVELOPER, expectation);
    }

    designerViewsBaseWorkPackage(wpName, expectation){
        server.call('testWorkPackages.viewWorkPackage', wpName, WorkPackageType.WP_BASE, 'gloria', RoleType.DESIGNER, expectation);
    }

    designerViewsUpdateWorkPackage(wpName, expectation){
        server.call('testWorkPackages.viewWorkPackage', wpName, WorkPackageType.WP_UPDATE, 'gloria', RoleType.DESIGNER, expectation);
    }

    // Adopt
    developerAdoptsSelectedWorkPackage(expectation){
        server.call('testWorkPackages.adoptSelectedWorkPackage', 'hugh', RoleType.DEVELOPER, expectation);
    }

    anotherDeveloperAdoptsSelectedWorkPackage(expectation){
        server.call('testWorkPackages.adoptSelectedWorkPackage', 'davey', RoleType.DEVELOPER, expectation);
    }

    designerAdoptsSelectedWorkPackage(expectation){
        server.call('testWorkPackages.adoptSelectedWorkPackage', 'gloria', RoleType.DESIGNER, expectation);
    }

    managerAdoptsSelectedWorkPackage(expectation){
        server.call('testWorkPackages.adoptSelectedWorkPackage', 'miles', RoleType.MANAGER, expectation);
    }

    // Release
    developerReleasesSelectedWorkPackage(expectation){
        server.call('testWorkPackages.releaseSelectedWorkPackage', 'hugh', RoleType.DEVELOPER, expectation);
    }

    designerReleasesSelectedWorkPackage(expectation){
        server.call('testWorkPackages.releaseSelectedWorkPackage', 'gloria', RoleType.DESIGNER, expectation);
    }

    managerReleasesSelectedWorkPackage(expectation){
        server.call('testWorkPackages.releaseSelectedWorkPackage', 'miles', RoleType.MANAGER, expectation);
    }

    // Develop
    developerDevelopsSelectedWorkPackage(expectation){
        server.call('testWorkPackages.developSelectedWorkPackage', 'hugh', RoleType.DEVELOPER, expectation)
    }

    anotherDeveloperDevelopsSelectedWorkPackage(expectation){
        server.call('testWorkPackages.developSelectedWorkPackage', 'davey', RoleType.DEVELOPER, expectation)
    }

    managerDevelopsSelectedWorkPackage(expectation){
        server.call('testWorkPackages.developSelectedWorkPackage', 'miles', RoleType.MANAGER, expectation)
    }

    designerDevelopsSelectedWorkPackage(expectation){
        server.call('testWorkPackages.developSelectedWorkPackage', 'gloria', RoleType.DESIGNER, expectation)
    }



}

export default new WorkPackageActions();