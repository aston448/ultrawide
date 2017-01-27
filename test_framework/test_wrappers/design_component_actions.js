
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class DesignComponentActions{

    designerAddApplicationCalled(appName){
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, appName);
    }

    designerAddDesignSectionToApplication_Called(appName, sectionName){
        server.call('testDesignComponents.addDesignSectionToApplication', appName);
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, sectionName);
    }

    designerAddFeatureToSection_Called(sectionName, featureName){
        server.call('testDesignComponents.addFeatureToDesignSection', sectionName);
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, featureName);
    }
}

export default new DesignComponentActions();
