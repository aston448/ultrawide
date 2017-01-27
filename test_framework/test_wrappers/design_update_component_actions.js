
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class UpdateComponentActions{

    designerAddApplicationCalled(appName){
        server.call('testDesignUpdateComponents.addApplication', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.APPLICATION, 'NONE', DefaultComponentNames.NEW_APPLICATION_NAME, appName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerAddDesignSectionToApplication_Called(appName, sectionName){
        server.call('testDesignUpdateComponents.addDesignSectionToApplication', 'NONE', appName, 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.DESIGN_SECTION, appName, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, sectionName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerAddFeatureTo_Section_Called(sectionParent, sectionName, featureName){
        server.call('testDesignUpdateComponents.addFeatureToDesignSection', sectionParent, sectionName, 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.FEATURE, sectionName, DefaultComponentNames.NEW_FEATURE_NAME, featureName, 'gloria', ViewMode.MODE_EDIT);
    }
}

export default new UpdateComponentActions();
