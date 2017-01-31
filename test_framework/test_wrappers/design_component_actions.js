
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class DesignComponentActions{

    designerAddApplication(){
        server.call('testDesignComponents.addApplication', 'gloria');
    }

    designerAddApplicationCalled(appName){
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, appName);
    }

    designerAddDesignSectionToApplication_(appName){
        server.call('testDesignComponents.addDesignSectionToApplication', appName);
    }

    designerAddDesignSectionToApplication_Called(appName, sectionName){
        server.call('testDesignComponents.addDesignSectionToApplication', appName);
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, sectionName);
    }

    designerAddDesignSectionToDesignSection_(sectionName){
        server.call('testDesignComponents.addDesignSectionToDesignSection', sectionName);
    }

    designerAddFeatureToSection_(sectionName){
        server.call('testDesignComponents.addFeatureToDesignSection', sectionName);
    }

    designerAddFeatureToSection_Called(sectionName, featureName){
        server.call('testDesignComponents.addFeatureToDesignSection', sectionName);
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, featureName);
    }

    designerAddFeatureAspectToFeature_(featureName){
        server.call('testDesignComponents.addFeatureAspectToFeature', featureName);
    }

    designerAddScenarioToFeature(featureName){
        server.call('testDesignComponents.addScenarioToFeature', featureName);
    }

    designerAddScenarioToFeatureAspect(featureName, featureAspectName){
        server.call('testDesignComponents.addScenarioToFeatureAspect', featureName, featureAspectName);
    }

    designerSelectComponentType_WithParent_Called_(componentType, componentParent, componentName) {
        server.call('testDesignComponents.selectComponent', componentType, componentParent, componentName, 'gloria');
    }

    designerEditSelectedComponentNameTo_(newName){
        server.call('testDesignComponents.updateSelectedComponentName', newName, 'gloria');
    }

    designerRemoveDesignComponentOfType_WithParent_Called_(type, parentName, componentName){
        server.call('testDesignComponents.removeComponent', type, parentName, componentName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerMoveSelectedComponentToTargetOfType_WithParent_Called_(targetType, targetParentName, targetComponentName){
        server.call('testDesignComponents.moveSelectedComponent', targetType, targetParentName, targetComponentName, 'gloria', ViewMode.MODE_EDIT);
    }
}

export default new DesignComponentActions();
