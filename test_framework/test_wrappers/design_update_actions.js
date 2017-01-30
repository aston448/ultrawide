
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class DesignUpdateActions{

    designerAddsAnUpdateCalled(updateName){

        server.call('testDesignUpdates.addDesignUpdate', RoleType.DESIGNER, 'gloria');
        // Name it
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', updateName, RoleType.DESIGNER, 'gloria');

    };

    designerEditsUpdate(updateName){
        server.call('testDesignUpdates.editDesignUpdate', updateName, RoleType.DESIGNER, 'gloria');
    }

    designerPublishesUpdate(updateName){
        // Publish it
        server.call('testDesignUpdates.publishDesignUpdate', updateName, RoleType.DESIGNER, 'gloria');
    }

    designerSetsUpdateActionTo(action){
        server.call('testDesignUpdates.updateMergeAction', action, RoleType.DESIGNER, 'gloria');
    }

    designerSelectsUpdate(updateName){
        server.call('testDesignUpdates.selectDesignUpdate', updateName, 'gloria');
    }


}

export default new DesignUpdateActions();
