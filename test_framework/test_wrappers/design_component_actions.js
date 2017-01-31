
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

    designerAddDesignSectionToDesignSection_Called(sectionName, newSectionName){
        server.call('testDesignComponents.addDesignSectionToDesignSection', sectionName);
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, newSectionName);
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

    designerAddScenarioToFeatureAspect_Called(featureName, featureAspectName, scenarioName){
        server.call('testDesignComponents.addScenarioToFeatureAspect', featureName, featureAspectName);
        server.call('testDesignComponents.updateComponentName', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, scenarioName);
    }

    designerSelectComponentType_WithParent_Called_(componentType, componentParent, componentName) {
        server.call('testDesignComponents.selectComponent', componentType, componentParent, componentName, 'gloria');
    }

    designerSelectApplication(appName){
        server.call('testDesignComponents.selectComponent', ComponentType.APPLICATION, 'NONE', appName, 'gloria');
    }

    designerSelectDesignSection(parentName, sectionName){
        server.call('testDesignComponents.selectComponent', ComponentType.DESIGN_SECTION, parentName, sectionName, 'gloria');
    }

    designerSelectFeature(parentName, featureName){
        server.call('testDesignComponents.selectComponent', ComponentType.FEATURE, parentName, featureName, 'gloria');
    }

    designerSelectFeatureAspect(parentName, aspectName){
        server.call('testDesignComponents.selectComponent', ComponentType.FEATURE_ASPECT, parentName, aspectName, 'gloria');
    }

    designerSelectScenario(featureName, aspectName, scenarioName){
        server.call('testDesignComponents.selectComponent', ComponentType.SCENARIO, aspectName, scenarioName, 'gloria');
    }

    designerEditSelectedComponentNameTo_(newName){
        server.call('testDesignComponents.updateSelectedComponentName', newName, 'gloria');
    }

    designerRemoveDesignComponentOfType_WithParent_Called_(type, parentName, componentName){
        server.call('testDesignComponents.removeComponent', type, parentName, componentName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerMoveSelectedComponentToTarget_WithParent_Called_(targetType, targetParentName, targetComponentName){
        server.call('testDesignComponents.moveSelectedComponent', targetType, targetParentName, targetComponentName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerReorderSelectedComponentToAbove_WithParent_Called_(targetType, targetParentName, targetComponentName){
        server.call('testDesignComponents.reorderSelectedComponent', targetType, targetParentName, targetComponentName, 'gloria', ViewMode.MODE_EDIT);
    }
}

export default new DesignComponentActions();
