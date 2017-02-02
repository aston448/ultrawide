
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class DesignVersionActions{

    designerSelectsDesignVersion(versionName){
        server.call('testDesignVersions.selectDesignVersion', versionName, 'gloria');
    }

    developerSelectsDesignVersion(versionName, expectation){
        server.call('testDesignVersions.selectDesignVersion', versionName, 'hugh', expectation);
    }

    managerSelectsDesignVersion(versionName, expectation){
        server.call('testDesignVersions.selectDesignVersion', versionName, 'miles', expectation);
    }

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

    designerUpdatesDesignVersionNumberTo(newNumber, expectation){
        server.call('testDesignVersions.updateDesignVersionNumber', newNumber, RoleType.DESIGNER, 'gloria', expectation);
    }

    developerUpdatesDesignVersionNumberTo(newNumber, expectation){
        server.call('testDesignVersions.updateDesignVersionNumber', newNumber, RoleType.DEVELOPER, 'hugh', expectation);
    }

    managerUpdatesDesignVersionNumberTo(newNumber, expectation){
        server.call('testDesignVersions.updateDesignVersionNumber', newNumber, RoleType.MANAGER, 'miles', expectation);
    }

    designerPublishesDesignVersion(versionName, expectation){
        server.call('testDesignVersions.publishDesignVersion', versionName, RoleType.DESIGNER, 'gloria', expectation);
    }

    developerPublishesDesignVersion(versionName, expectation){
        server.call('testDesignVersions.publishDesignVersion', versionName, RoleType.DEVELOPER, 'hugh', expectation);
    }

    managerPublishesDesignVersion(versionName, expectation){
        server.call('testDesignVersions.publishDesignVersion', versionName, RoleType.MANAGER, 'miles', expectation);
    }

    designerWithdrawsDesignVersion(versionName, expectation){
        server.call('testDesignVersions.withdrawDesignVersion', versionName, 'gloria', RoleType.DESIGNER, expectation);
    }

    developerWithdrawsDesignVersion(versionName, expectation){
        server.call('testDesignVersions.withdrawDesignVersion', versionName, 'hugh', RoleType.DEVELOPER, expectation);
    }

    managerWithdrawsDesignVersion(versionName, expectation){
        server.call('testDesignVersions.withdrawDesignVersion', versionName, 'miles', RoleType.MANAGER, expectation);
    }

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

    designerEditDesignVersion(designVersionName, expectation){
        server.call('testDesignVersions.editDesignVersion', designVersionName, RoleType.DESIGNER, 'gloria', expectation);
    }

    developerEditDesignVersion(designVersionName, expectation){
        server.call('testDesignVersions.editDesignVersion', designVersionName, RoleType.DEVELOPER, 'hugh', expectation);
    }

    managerEditDesignVersion(designVersionName, expectation){
        server.call('testDesignVersions.editDesignVersion', designVersionName, RoleType.MANAGER, 'miles', expectation);
    }

    designerViewDesignVersion(designVersionName, expectation){
        server.call('testDesignVersions.viewDesignVersion', designVersionName, RoleType.DESIGNER, 'gloria', expectation);
    }

    developerViewDesignVersion(designVersionName, expectation){
        server.call('testDesignVersions.viewDesignVersion', designVersionName, RoleType.DEVELOPER, 'hugh', expectation);
    }

    managerViewDesignVersion(designVersionName, expectation){
        server.call('testDesignVersions.viewDesignVersion', designVersionName, RoleType.MANAGER, 'miles', expectation);
    }




    // Complex Actions -------------------------------------------------------------------------------------------------
    designerCreateNextDesignVersionFromNew(params, expectation){
        // Setup
        // Publish the Design Version
        server.call('testDesigns.selectDesign', params.designName, 'gloria', expectation);
        server.call('testDesignVersions.publishDesignVersion', params.designVersionName, RoleType.DESIGNER, 'gloria', expectation);

        // Execute
        server.call('testDesignVersions.createNextDesignVersion', params.designVersionName, RoleType.DESIGNER, 'gloria', expectation);

        // Verify - new DV created with default name as well as DV1
        server.call('verifyDesignVersions.designVersionExistsCalled', params.designName, params.designVersionName, expectation);
        server.call('verifyDesignVersions.designVersionExistsCalled', params.designName, DefaultItemNames.NEXT_DESIGN_VERSION_NAME, expectation);
        // Select the new DV
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'gloria', expectation);
        // And status should be updatable
        server.call('verifyDesignVersions.designVersionStatusIs', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_UPDATABLE, 'gloria', expectation);
        // And previous DV should be complete
        server.call('testDesignVersions.selectDesignVersion', params.designVersionName, 'gloria', expectation);
        server.call('verifyDesignVersions.designVersionStatusIs', params.designVersionName, DesignVersionStatus.VERSION_DRAFT_COMPLETE, 'gloria', expectation);
    }

    designerCreateNextDesignVersionFromUpdatable(params, expectation){
        // Setup
        // Publish the New Design Version
        server.call('testDesigns.selectDesign', params.designName, 'gloria', expectation);
        server.call('testDesignVersions.publishDesignVersion', params.firstDesignVersion, RoleType.DESIGNER, 'gloria', expectation);
        // Create an Updatable DV from it
        server.call('testDesignVersions.createNextDesignVersion', params.firstDesignVersion, RoleType.DESIGNER, 'gloria', expectation);
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'gloria', expectation);
        server.call('testDesignVersions.updateDesignVersionName', params.secondDesignVersion, RoleType.DESIGNER, 'gloria', expectation);
        // Add a Design Update so it can be completed
        server.call('testDesignUpdates.addDesignUpdate', RoleType.DESIGNER, 'gloria', expectation);
        // Name it
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria', expectation);
        server.call('testDesignUpdates.updateDesignUpdateName', params.designUpdate, RoleType.DESIGNER, 'gloria', expectation);
        // Publish it
        server.call('testDesignUpdates.publishDesignUpdate', params.designUpdate, RoleType.DESIGNER, 'gloria', expectation);
        // Set it to INCLUDE
        server.call('testDesignUpdates.updateMergeAction', DesignUpdateMergeAction.MERGE_INCLUDE, RoleType.DESIGNER, 'gloria', expectation);
        // Check
        server.call('verifyDesignUpdates.designUpdateMergeActionIs', params.designUpdate, DesignUpdateMergeAction.MERGE_INCLUDE, 'gloria', expectation);

        // Execute - create another new DV from DesignVersion2
        server.call('testDesignVersions.createNextDesignVersion', params.secondDesignVersion, RoleType.DESIGNER, 'gloria', expectation);

        // Verify - new DV created with default name
        server.call('verifyDesignVersions.designVersionExistsCalled', params.designName, params.firstDesignVersion, expectation);
        server.call('verifyDesignVersions.designVersionExistsCalled', params.designName, params.secondDesignVersion, expectation);
        server.call('verifyDesignVersions.designVersionExistsCalled', params.designName, DefaultItemNames.NEXT_DESIGN_VERSION_NAME, expectation);
        // Select the new DV
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'gloria', expectation);
        // And status should be updatable
        server.call('verifyDesignVersions.designVersionStatusIs', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_UPDATABLE, 'gloria', expectation);
        // And previous DV should be complete
        server.call('testDesignVersions.selectDesignVersion', params.firstDesignVersion, 'gloria', expectation);
        server.call('verifyDesignVersions.designVersionStatusIs', params.firstDesignVersion, DesignVersionStatus.VERSION_DRAFT_COMPLETE, 'gloria', expectation);
    }



}

export default new DesignVersionActions();
