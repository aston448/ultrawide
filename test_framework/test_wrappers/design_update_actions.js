
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class du{

    a_designer_adds_and_publishes_a_design_update_called(updateName){

        server.call('testDesignUpdates.addDesignUpdate', RoleType.DESIGNER, 'gloria');
        // Name it
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', updateName, RoleType.DESIGNER, 'gloria');
        // Publish it
        server.call('testDesignUpdates.publishDesignUpdate', updateName, RoleType.DESIGNER, 'gloria');

    };


}

export default new du();
