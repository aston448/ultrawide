
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class DesignActions{

    designerAddsNewDesignCalled(designName){
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, designName);
    };

    designerSelectsDesign(designName){
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
    }


}

export default new DesignActions();
