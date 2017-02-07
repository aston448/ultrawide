
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class DesignUpdateActions{

    // Add
    designerAddsAnUpdate(expectation){
        server.call('testDesignUpdates.addDesignUpdate', RoleType.DESIGNER, 'gloria', expectation);
    }

    designerAddsAnUpdateCalled(updateName, expectation){
        server.call('testDesignUpdates.addDesignUpdate', RoleType.DESIGNER, 'gloria', expectation);
        // Name it
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria', expectation);
        server.call('testDesignUpdates.updateDesignUpdateName', updateName, RoleType.DESIGNER, 'gloria', expectation);

    };

    // Select
    designerSelectsUpdate(updateName){
        server.call('testDesignUpdates.selectDesignUpdate', updateName, 'gloria');
    }

    managerSelectsUpdate(updateName){
        server.call('testDesignUpdates.selectDesignUpdate', updateName, 'miles');
    }

    developerSelectsUpdate(updateName){
        server.call('testDesignUpdates.selectDesignUpdate', updateName, 'hugh');
    }

    // Edit
    designerEditsSelectedUpdateNameTo(newName, expectation){
        server.call('testDesignUpdates.updateDesignUpdateName', newName, RoleType.DESIGNER, 'gloria', expectation);
    }

    designerEditsSelectedUpdateRefTo(newRef, expectation){
        server.call('testDesignUpdates.updateDesignUpdateRef', newRef, RoleType.DESIGNER, 'gloria', expectation);
    }

    designerEditsUpdate(updateName, expectation){
        server.call('testDesignUpdates.editDesignUpdate', updateName, RoleType.DESIGNER, 'gloria', expectation);
    }

    developerEditsUpdate(updateName, expectation){
        server.call('testDesignUpdates.editDesignUpdate', updateName, RoleType.DEVELOPER, 'hugh', expectation);
    }

    managerEditsUpdate(updateName, expectation){
        server.call('testDesignUpdates.editDesignUpdate', updateName, RoleType.MANAGER, 'miles', expectation);
    }

    // View
    designerViewsUpdate(updateName, expectation){
        server.call('testDesignUpdates.viewDesignUpdate', updateName, RoleType.DESIGNER, 'gloria', expectation);
    }

    developerViewsUpdate(updateName, expectation){
        server.call('testDesignUpdates.viewDesignUpdate', updateName, RoleType.DEVELOPER, 'hugh', expectation);
    }

    managerViewsUpdate(updateName, expectation){
        server.call('testDesignUpdates.viewDesignUpdate', updateName, RoleType.MANAGER, 'miles', expectation);
    }

    // Publish
    designerPublishesUpdate(updateName, expectation){
        server.call('testDesignUpdates.publishDesignUpdate', updateName, RoleType.DESIGNER, 'gloria', expectation);
    }

    developerPublishesUpdate(updateName, expectation){
        server.call('testDesignUpdates.publishDesignUpdate', updateName, RoleType.DEVELOPER, 'hugh', expectation);
    }

    managerPublishesUpdate(updateName, expectation){
        server.call('testDesignUpdates.publishDesignUpdate', updateName, RoleType.MANAGER, 'miles', expectation);
    }

    // Withdraw
    designerWithdrawsUpdate(updateName, expectation){
        server.call('testDesignUpdates.withdrawDesignUpdate', updateName, RoleType.DESIGNER, 'gloria', expectation);
    }

    developerWithdrawsUpdate(updateName, expectation){
        server.call('testDesignUpdates.withdrawDesignUpdate', updateName, RoleType.DEVELOPER, 'hugh', expectation);
    }

    managerWithdrawsUpdate(updateName, expectation){
        server.call('testDesignUpdates.withdrawDesignUpdate', updateName, RoleType.MANAGER, 'miles', expectation);
    }

    // Set Merge Action
    designerSetsUpdateMergeActionTo(action, expectation){
        server.call('testDesignUpdates.updateMergeAction', action, RoleType.DESIGNER, 'gloria', expectation);
    }

    developerSetsUpdateMergeActionTo(action, expectation){
        server.call('testDesignUpdates.updateMergeAction', action, RoleType.DEVELOPER, 'hugh', expectation);
    }

    managerSetsUpdateMergeActionTo(action, expectation){
        server.call('testDesignUpdates.updateMergeAction', action, RoleType.MANAGER, 'miles', expectation);
    }

    // Remove
    designerRemovesUpdate(updateName, expectation){
        server.call('testDesignUpdates.removeDesignUpdate',  updateName, RoleType.DESIGNER, 'gloria', expectation);
    }

    developerRemovesUpdate(updateName, expectation){
        server.call('testDesignUpdates.removeDesignUpdate',  updateName, RoleType.DEVELOPER, 'hugh', expectation);
    }

    managerRemovesUpdate(updateName, expectation){
        server.call('testDesignUpdates.removeDesignUpdate',  updateName, RoleType.MANAGER, 'miles', expectation);
    }




}

export default new DesignUpdateActions();
