
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class DesignVersionActions{

    designerUpdatesDesignVersionNameFrom_To_(oldName, newName){
        server.call('testDesignVersions.selectDesignVersion', oldName, 'gloria');
        server.call('testDesignVersions.updateDesignVersionName', newName, RoleType.DESIGNER, 'gloria');

    }

    designerPublishesDesignVersion(versionName){
        server.call('testDesignVersions.publishDesignVersion', versionName, RoleType.DESIGNER, 'gloria');
    }

    designerCreatesNextDesignVersionFrom(oldDesignVersion){
        server.call('testDesignVersions.createNextDesignVersion', oldDesignVersion, RoleType.DESIGNER, 'gloria');
    }

    designerEditDesign_DesignVersion(designName, designVersionName){
        server.call('testDesigns.editDesignVersion', designName, designVersionName, RoleType.DESIGNER, 'gloria');
    }



}

export default new DesignVersionActions();
