
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class DesignVersionActions{

    // Select
    designerSelectsDesignVersion(versionName){
        server.call('testDesignVersions.selectDesignVersion', versionName, 'gloria');
    }

    developerSelectsDesignVersion(versionName){
        server.call('testDesignVersions.selectDesignVersion', versionName, 'hugh');
    }

    managerSelectsDesignVersion(versionName){
        server.call('testDesignVersions.selectDesignVersion', versionName, 'miles');
    }

    // Set Name
    designerUpdatesDesignVersionNameFrom_To_(oldName, newName, expectation){
        server.call('testDesignVersions.selectDesignVersion', oldName, 'gloria', expectation);
        server.call('testDesignVersions.updateDesignVersionName', newName, RoleType.DESIGNER, 'gloria', expectation);
    }

    designerUpdatesDesignVersionNameTo(newName, expectation){
        server.call('testDesignVersions.updateDesignVersionName', newName, RoleType.DESIGNER, 'gloria', expectation);
    }

    developerUpdatesDesignVersionNameTo(newName, expectation){
        server.call('testDesignVersions.updateDesignVersionName', newName, RoleType.DEVELOPER, 'hugh', expectation);
    }

    managerUpdatesDesignVersionNameTo(newName, expectation){
        server.call('testDesignVersions.updateDesignVersionName', newName, RoleType.MANAGER, 'miles', expectation);
    }

    // Set Number
    designerUpdatesDesignVersionNumberTo(newNumber, expectation){
        server.call('testDesignVersions.updateDesignVersionNumber', newNumber, RoleType.DESIGNER, 'gloria', expectation);
    }

    developerUpdatesDesignVersionNumberTo(newNumber, expectation){
        server.call('testDesignVersions.updateDesignVersionNumber', newNumber, RoleType.DEVELOPER, 'hugh', expectation);
    }

    managerUpdatesDesignVersionNumberTo(newNumber, expectation){
        server.call('testDesignVersions.updateDesignVersionNumber', newNumber, RoleType.MANAGER, 'miles', expectation);
    }

    // Publish
    designerPublishesDesignVersion(versionName, expectation){
        server.call('testDesignVersions.publishDesignVersion', versionName, RoleType.DESIGNER, 'gloria', expectation);
    }

    developerPublishesDesignVersion(versionName, expectation){
        server.call('testDesignVersions.publishDesignVersion', versionName, RoleType.DEVELOPER, 'hugh', expectation);
    }

    managerPublishesDesignVersion(versionName, expectation){
        server.call('testDesignVersions.publishDesignVersion', versionName, RoleType.MANAGER, 'miles', expectation);
    }

    // Withdraw
    designerWithdrawsDesignVersion(versionName, expectation){
        server.call('testDesignVersions.withdrawDesignVersion', versionName, 'gloria', RoleType.DESIGNER, expectation);
    }

    developerWithdrawsDesignVersion(versionName, expectation){
        server.call('testDesignVersions.withdrawDesignVersion', versionName, 'hugh', RoleType.DEVELOPER, expectation);
    }

    managerWithdrawsDesignVersion(versionName, expectation){
        server.call('testDesignVersions.withdrawDesignVersion', versionName, 'miles', RoleType.MANAGER, expectation);
    }

    // Create Next
    designerCreatesNextDesignVersionFrom(oldDesignVersion, expectation){
        server.call('testDesignVersions.selectDesignVersion', oldDesignVersion, 'gloria', expectation);
        server.call('testDesignVersions.createNextDesignVersion', oldDesignVersion, RoleType.DESIGNER, 'gloria', expectation);
    }

    developerCreatesNextDesignVersionFrom(oldDesignVersion, expectation){
        server.call('testDesignVersions.selectDesignVersion', oldDesignVersion, 'hugh', expectation);
        server.call('testDesignVersions.createNextDesignVersion', oldDesignVersion, RoleType.DEVELOPER, 'hugh', expectation);
    }

    managerCreatesNextDesignVersionFrom(oldDesignVersion, expectation){
        server.call('testDesignVersions.selectDesignVersion', oldDesignVersion, 'miles', expectation);
        server.call('testDesignVersions.createNextDesignVersion', oldDesignVersion, RoleType.MANAGER, 'miles', expectation);
    }

    // Edit
    designerEditsDesignVersion(designVersionName, expectation){
        server.call('testDesignVersions.editDesignVersion', designVersionName, RoleType.DESIGNER, 'gloria', expectation);
    }

    developerEditsDesignVersion(designVersionName, expectation){
        server.call('testDesignVersions.editDesignVersion', designVersionName, RoleType.DEVELOPER, 'hugh', expectation);
    }

    managerEditsDesignVersion(designVersionName, expectation){
        server.call('testDesignVersions.editDesignVersion', designVersionName, RoleType.MANAGER, 'miles', expectation);
    }

    // View
    designerViewsDesignVersion(designVersionName, expectation){
        server.call('testDesignVersions.viewDesignVersion', designVersionName, RoleType.DESIGNER, 'gloria', expectation);
    }

    developerViewsDesignVersion(designVersionName, expectation){
        server.call('testDesignVersions.viewDesignVersion', designVersionName, RoleType.DEVELOPER, 'hugh', expectation);
    }

    managerViewsDesignVersion(designVersionName, expectation){
        server.call('testDesignVersions.viewDesignVersion', designVersionName, RoleType.MANAGER, 'miles', expectation);
    }

    // Update Updatable
    designerUpdatesDesignVersionWithUpdates(designVersionName, expectation){
        server.call('testDesignVersions.updateWorkingDesignVersion', designVersionName, RoleType.DESIGNER, 'gloria', expectation);
    }

    developerUpdatesDesignVersionWithUpdates(designVersionName, expectation){
        server.call('testDesignVersions.updateWorkingDesignVersion', designVersionName, RoleType.DEVELOPER, 'hugh', expectation);
    }

    managerUpdatesDesignVersionWithUpdates(designVersionName, expectation){
        server.call('testDesignVersions.updateWorkingDesignVersion', designVersionName, RoleType.MANAGER, 'miles', expectation);
    }

}

export default new DesignVersionActions();
