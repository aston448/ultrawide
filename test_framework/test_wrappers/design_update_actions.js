
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class DesignUpdateActions{

    designerAddsAnUpdate(expectation){
        server.call('testDesignUpdates.addDesignUpdate', RoleType.DESIGNER, 'gloria', expectation);
    }

    designerAddsAnUpdateCalled(updateName, expectation){
        server.call('testDesignUpdates.addDesignUpdate', RoleType.DESIGNER, 'gloria', expectation);
        // Name it
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria', expectation);
        server.call('testDesignUpdates.updateDesignUpdateName', updateName, RoleType.DESIGNER, 'gloria', expectation);

    };

    designerSelectsUpdate(updateName){
        server.call('testDesignUpdates.selectDesignUpdate', updateName, 'gloria');
    }

    managerSelectsUpdate(updateName){
        server.call('testDesignUpdates.selectDesignUpdate', updateName, 'miles');
    }

    developerSelectsUpdate(updateName){
        server.call('testDesignUpdates.selectDesignUpdate', updateName, 'hugh');
    }

    designerEditsSelectedUpdateNameTo(newName, expectation){
        server.call('testDesignUpdates.updateDesignUpdateName', newName, RoleType.DESIGNER, 'gloria', expectation);
    }

    designerEditsSelectedUpdateRefTo(newRef, expectation){
        server.call('testDesignUpdates.updateDesignUpdateRef', newRef, RoleType.DESIGNER, 'gloria', expectation);
    }

    designerEditsUpdate(updateName, expectation){
        server.call('testDesignUpdates.editDesignUpdate', updateName, RoleType.DESIGNER, 'gloria', expectation);
    }

    designerViewsUpdate(updateName, expectation){
        server.call('testDesignUpdates.viewDesignUpdate', updateName, RoleType.DESIGNER, 'gloria', expectation);
    }

    developerViewsUpdate(updateName, expectation){
        server.call('testDesignUpdates.viewDesignUpdate', updateName, RoleType.DEVELOPER, 'hugh', expectation);
    }

    managerViewsUpdate(updateName, expectation){
        server.call('testDesignUpdates.viewDesignUpdate', updateName, RoleType.MANAGER, 'miles', expectation);
    }

    designerPublishesUpdate(updateName, expectation){
        // Publish it
        server.call('testDesignUpdates.publishDesignUpdate', updateName, RoleType.DESIGNER, 'gloria', expectation);
    }

    designerSetsUpdateActionTo(action, expectation){
        server.call('testDesignUpdates.updateMergeAction', action, RoleType.DESIGNER, 'gloria', expectation);
    }




}

export default new DesignUpdateActions();
