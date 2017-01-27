
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class DesignVersionActions{

    designerSelectsDesignVersion(versionName){
        server.call('testDesignVersions.selectDesignVersion', versionName, 'gloria');
    }

    developerSelectsDesignVersion(versionName){
        server.call('testDesignVersions.selectDesignVersion', versionName, 'hugh');
    }

    managerSelectsDesignVersion(versionName){
        server.call('testDesignVersions.selectDesignVersion', versionName, 'miles');
    }

    designerUpdatesDesignVersionNameFrom_To_(oldName, newName){
        server.call('testDesignVersions.selectDesignVersion', oldName, 'gloria');
        server.call('testDesignVersions.updateDesignVersionName', newName, RoleType.DESIGNER, 'gloria');

    }

    designerPublishesDesignVersion(versionName){
        server.call('testDesignVersions.publishDesignVersion', versionName, RoleType.DESIGNER, 'gloria');
    }

    developerPublishesDesignVersion(versionName){
        server.call('testDesignVersions.publishDesignVersion', versionName, RoleType.DEVELOPER, 'gloria');
    }

    managerPublishesDesignVersion(versionName){
        server.call('testDesignVersions.publishDesignVersion', versionName, RoleType.MANAGER, 'gloria');
    }

    designerWithdrawsDesignVersion(versionName){
        server.call('testDesignVersions.withdrawDesignVersion', versionName, 'gloria', RoleType.DESIGNER);
    }

    developerWithdrawsDesignVersion(versionName){
        server.call('testDesignVersions.withdrawDesignVersion', versionName, 'hugh', RoleType.DEVELOPER);
    }

    managerWithdrawsDesignVersion(versionName){
        server.call('testDesignVersions.withdrawDesignVersion', versionName, 'miles', RoleType.MANAGER);
    }

    designerCreatesNextDesignVersionFrom(oldDesignVersion){
        server.call('testDesignVersions.createNextDesignVersion', oldDesignVersion, RoleType.DESIGNER, 'gloria');
    }

    developerCreatesNextDesignVersionFrom(oldDesignVersion){
        server.call('testDesignVersions.createNextDesignVersion', oldDesignVersion, RoleType.DEVELOPER, 'hugh');
    }

    managerCreatesNextDesignVersionFrom(oldDesignVersion){
        server.call('testDesignVersions.createNextDesignVersion', oldDesignVersion, RoleType.MANAGER, 'miles');
    }

    designerEditDesign_DesignVersion(designName, designVersionName){
        server.call('testDesigns.editDesignVersion', designName, designVersionName, RoleType.DESIGNER, 'gloria');
    }




    // Complex Actions -------------------------------------------------------------------------------------------------
    designerCreateNewDesignVersionFromDraft(params){
        // Setup
        // Publish the Design Version
        server.call('testDesigns.selectDesign', params.designName, 'gloria');
        server.call('testDesignVersions.publishDesignVersion', params.designVersionName, RoleType.DESIGNER, 'gloria');

        // Execute
        server.call('testDesignVersions.createNextDesignVersion', params.designVersionName, RoleType.DESIGNER, 'gloria');

        // Verify - new DV created with default name as well as DV1
        server.call('verifyDesignVersions.designVersionExistsCalled', params.designName, params.designVersionName);
        server.call('verifyDesignVersions.designVersionExistsCalled', params.designName, DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        // Select the new DV
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'gloria');
        // And status should be updatable
        server.call('verifyDesignVersions.designVersionStatusIs', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_UPDATABLE, 'gloria');
        // And previous DV should be complete
        server.call('testDesignVersions.selectDesignVersion', params.designVersionName, 'gloria');
        server.call('verifyDesignVersions.designVersionStatusIs', params.designVersionName, DesignVersionStatus.VERSION_DRAFT_COMPLETE, 'gloria');
    }

    designerCreateNewDesignVersionFromUpdatable(params){
        // Setup
        // Publish the New Design Version
        server.call('testDesigns.selectDesign', params.designName, 'gloria');
        server.call('testDesignVersions.publishDesignVersion', params.firstDesignVersion, RoleType.DESIGNER, 'gloria');
        // Create an Updatable DV from it
        server.call('testDesignVersions.createNextDesignVersion', params.firstDesignVersion, RoleType.DESIGNER, 'gloria');
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'gloria');
        server.call('testDesignVersions.updateDesignVersionName', params.secondDesignVersion, RoleType.DESIGNER, 'gloria');
        // Add a Design Update so it can be completed
        server.call('testDesignUpdates.addDesignUpdate', RoleType.DESIGNER, 'gloria');
        // Name it
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', params.designUpdate, RoleType.DESIGNER, 'gloria');
        // Publish it
        server.call('testDesignUpdates.publishDesignUpdate', params.designUpdate, RoleType.DESIGNER, 'gloria');
        // Set it to INCLUDE
        server.call('testDesignUpdates.updateMergeAction', DesignUpdateMergeAction.MERGE_INCLUDE, RoleType.DESIGNER, 'gloria');
        // Check
        server.call('verifyDesignUpdates.designUpdateMergeActionIs', params.designUpdate, DesignUpdateMergeAction.MERGE_INCLUDE, 'gloria');

        // Execute - create another new DV from DesignVersion2
        server.call('testDesignVersions.createNextDesignVersion', params.secondDesignVersion, RoleType.DESIGNER, 'gloria');

        // Verify - new DV created with default name
        server.call('verifyDesignVersions.designVersionExistsCalled', params.designName, params.firstDesignVersion);
        server.call('verifyDesignVersions.designVersionExistsCalled', params.designName, params.secondDesignVersion);
        server.call('verifyDesignVersions.designVersionExistsCalled', params.designName, DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        // Select the new DV
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'gloria');
        // And status should be updatable
        server.call('verifyDesignVersions.designVersionStatusIs', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_UPDATABLE, 'gloria');
        // And previous DV should be complete
        server.call('testDesignVersions.selectDesignVersion', params.firstDesignVersion, 'gloria');
        server.call('verifyDesignVersions.designVersionStatusIs', params.firstDesignVersion, DesignVersionStatus.VERSION_DRAFT_COMPLETE, 'gloria');
    }



}

export default new DesignVersionActions();
