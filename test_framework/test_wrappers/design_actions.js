
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class DesignActionsClass {

    addNewDesignAsRole(userRole, expectation){
        server.call('testDesigns.addNewDesign', userRole, expectation);
    }

    designerAddsNewDesignCalled(designName, expectation){
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER, expectation);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, designName, expectation);
    };

    designerSelectsDesign(designName, expectation){
        server.call('testDesigns.selectDesign', designName, 'gloria', expectation);
    }

    developerSelectsDesign(designName, expectation){
        server.call('testDesigns.selectDesign', designName, 'hugh', expectation);
    }

    managerSelectsDesign(designName, expectation){
        server.call('testDesigns.selectDesign', designName, 'miles', expectation);
    }

    designerRemovesDesign(designName, expectation){
        server.call('testDesigns.removeDesign', designName, RoleType.DESIGNER, 'gloria', expectation);
    }

    developerRemovesDesign(designName, expectation){
        server.call('testDesigns.removeDesign', designName, RoleType.DEVELOPER, 'hugh', expectation);
    }

    managerRemovesDesign(designName, expectation){
        server.call('testDesigns.removeDesign', designName, RoleType.MANAGER, 'miles', expectation);
    }

    designerEditsDesignNameFrom_To_(oldName, newName, expectation){
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, oldName, newName, expectation);
    }

    developerEditsDesignNameFrom_To_(oldName, newName, expectation){
        server.call('testDesigns.updateDesignName', RoleType.DEVELOPER, oldName, newName, expectation);
    }

    managerEditsDesignNameFrom_To_(oldName, newName, expectation){
        server.call('testDesigns.updateDesignName', RoleType.MANAGER, oldName, newName, expectation);
    }

    designerWorksOnDesign(designName, expectation){
        server.call('testDesigns.workDesign', designName, 'gloria', expectation);
    }

    developerWorksOnDesign(designName, expectation){
        server.call('testDesigns.workDesign', designName, 'hugh', expectation);
    }

    anotherDeveloperWorksOnDesign(designName, expectation){
        server.call('testDesigns.workDesign', designName, 'davey', expectation);
    }

    managerWorksOnDesign(designName, expectation){
        server.call('testDesigns.workDesign', designName, 'miles', expectation);
    }

    designerBacksUpDesign(designName, expectation){
        server.call('testBackup.backupDesign', designName, 'gloria', expectation);
    }

    developerBacksUpDesign(designName, expectation){
        server.call('testBackup.backupDesign', designName, 'hugh', expectation);
    }

    managerBacksUpDesign(designName, expectation){
        server.call('testBackup.backupDesign', designName, 'miles', expectation);
    }





}

export const DesignActions = new DesignActionsClass();
