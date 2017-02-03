
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class DesignComponentActions{

    designerAddApplication(expectation){
        server.call('testDesignComponents.addApplication', 'gloria', expectation);
    }

    designerAddApplicationCalled(appName, expectation){
        server.call('testDesignComponents.addApplication', 'gloria', expectation);
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, appName, expectation);
    }

    designerAddDesignSectionToApplication_(appName, expectation){
        server.call('testDesignComponents.addDesignSectionToApplication', appName, expectation);
    }

    designerAddDesignSectionToApplication_Called(appName, sectionName, expectation){
        server.call('testDesignComponents.addDesignSectionToApplication', appName, expectation);
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, sectionName, expectation);
    }

    designerAddDesignSectionToDesignSection_(sectionName, expectation){
        server.call('testDesignComponents.addDesignSectionToDesignSection', sectionName, expectation);
    }

    designerAddDesignSectionToDesignSection_Called(sectionName, newSectionName, expectation){
        server.call('testDesignComponents.addDesignSectionToDesignSection', sectionName, expectation);
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, newSectionName, expectation);
    }

    designerAddFeatureToSection_(sectionName, expectation){
        server.call('testDesignComponents.addFeatureToDesignSection', sectionName, expectation);
    }

    designerAddFeatureToSection_Called(sectionName, featureName, expectation){
        server.call('testDesignComponents.addFeatureToDesignSection', sectionName, expectation);
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, featureName, expectation);
    }

    designerAddFeatureAspectToFeature_(featureName, expectation){
        server.call('testDesignComponents.addFeatureAspectToFeature', featureName, expectation);
    }

    designerAddScenarioToFeature(featureName, expectation){
        server.call('testDesignComponents.addScenarioToFeature', featureName, expectation);
    }

    designerAddScenarioToFeatureAspect(featureName, featureAspectName, expectation){
        server.call('testDesignComponents.addScenarioToFeatureAspect', featureName, featureAspectName, expectation);
    }

    designerAddScenarioToFeatureAspect_Called(featureName, featureAspectName, scenarioName, expectation){
        server.call('testDesignComponents.addScenarioToFeatureAspect', featureName, featureAspectName, expectation);
        server.call('testDesignComponents.updateComponentName', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, scenarioName, expectation);
    }

    designerSelectComponentType_WithParent_Called_(componentType, componentParent, componentName){
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

    designerEditSelectedComponentNameTo_(newName, expectation){
        server.call('testDesignComponents.updateSelectedComponentName', newName, 'gloria', expectation);
    }

    designerRemoveDesignComponentOfType_WithParent_Called_(type, parentName, componentName, expectation){
        server.call('testDesignComponents.removeComponent', type, parentName, componentName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerRemovesSelectedDesignComponent(expectation){
        server.call('testDesignComponents.removeSelectedComponent', 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerMoveSelectedComponentToTarget_WithParent_Called_(targetType, targetParentName, targetComponentName, expectation){
        server.call('testDesignComponents.moveSelectedComponent', targetType, targetParentName, targetComponentName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerReorderSelectedComponentToAbove_WithParent_Called_(targetType, targetParentName, targetComponentName, expectation){
        server.call('testDesignComponents.reorderSelectedComponent', targetType, targetParentName, targetComponentName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerEditSelectedFeatureNarrativeTo(newText, expectation){
        server.call('testDesignComponents.updateSelectedFeatureNarrative', newText, 'gloria', expectation);
    }
}

export default new DesignComponentActions();
