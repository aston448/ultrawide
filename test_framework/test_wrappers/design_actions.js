
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class DesignActions{

    addNewDesignAsRole(userRole){
        server.call('testDesigns.addNewDesign', userRole);
    }

    designerAddsNewDesignCalled(designName){
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, designName);
    };

    designerSelectsDesign(designName){
        server.call('testDesigns.selectDesign', designName, 'gloria');
    }

    developerSelectsDesign(designName){
        server.call('testDesigns.selectDesign', designName, 'hugh');
    }

    managerSelectsDesign(designName){
        server.call('testDesigns.selectDesign', designName, 'miles');
    }

    designerRemovesDesign(designName){
        server.call('testDesigns.removeDesign', designName, RoleType.DESIGNER, 'gloria');
    }

    developerRemovesDesign(designName){
        server.call('testDesigns.removeDesign', designName, RoleType.DEVELOPER, 'hugh');
    }

    managerRemovesDesign(designName){
        server.call('testDesigns.removeDesign', designName, RoleType.MANAGER, 'miles');
    }

    designerEditsDesignNameFrom_To_(oldName, newName){
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, oldName, newName);
    }

    developerEditsDesignNameFrom_To_(oldName, newName){
        server.call('testDesigns.updateDesignName', RoleType.DEVELOPER, oldName, newName);
    }

    managerEditsDesignNameFrom_To_(oldName, newName){
        server.call('testDesigns.updateDesignName', RoleType.MANAGER, oldName, newName);
    }

    designerWorksOnDesign(designName){
        server.call('testDesigns.workDesign', designName, 'gloria');
    }





}

export default new DesignActions();
