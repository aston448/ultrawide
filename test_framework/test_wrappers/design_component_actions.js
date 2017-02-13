
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class DesignComponentActions{

    // Add Components
    designerAddsApplication(expectation){
        server.call('testDesignComponents.addApplication', 'gloria', expectation);
    }

    designerAddsApplicationCalled(appName, expectation){
        server.call('testDesignComponents.addApplication', 'gloria', expectation);
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, appName, expectation);
    }

    designerAddsDesignSectionToApplication_(appName, expectation){
        server.call('testDesignComponents.addDesignSectionToApplication', appName, expectation);
    }

    designerAddsDesignSectionToApplication_Called(appName, sectionName, expectation){
        server.call('testDesignComponents.addDesignSectionToApplication', appName, expectation);
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, sectionName, expectation);
    }

    designerAddsDesignSectionToDesignSection_(sectionName, expectation){
        server.call('testDesignComponents.addDesignSectionToDesignSection', sectionName, expectation);
    }

    designerAddsDesignSectionToDesignSection_Called(sectionName, newSectionName, expectation){
        server.call('testDesignComponents.addDesignSectionToDesignSection', sectionName, expectation);
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, newSectionName, expectation);
    }

    designerAddsFeatureToSection_(sectionName, expectation){
        server.call('testDesignComponents.addFeatureToDesignSection', sectionName, expectation);
    }

    designerAddsFeatureToSection_Called(sectionName, featureName, expectation){
        server.call('testDesignComponents.addFeatureToDesignSection', sectionName, expectation);
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, featureName, expectation);
    }

    designerAddsFeatureAspectToFeature_(featureName, expectation){
        server.call('testDesignComponents.addFeatureAspectToFeature', featureName, expectation);
    }

    designerAddsScenarioToFeature(featureName, expectation){
        server.call('testDesignComponents.addScenarioToFeature', featureName, expectation);
    }

    designerAddsScenarioToFeatureAspect(featureName, featureAspectName, expectation){
        server.call('testDesignComponents.addScenarioToFeatureAspect', featureName, featureAspectName, expectation);
    }

    designerAddsScenarioToFeatureAspect_Called(featureName, featureAspectName, scenarioName, expectation){
        server.call('testDesignComponents.addScenarioToFeatureAspect', featureName, featureAspectName, expectation);
        server.call('testDesignComponents.updateComponentName', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, scenarioName, expectation);
    }

    // Select
    designerSelectsComponentType_WithParent_Called_(componentType, componentParent, componentName){
        server.call('testDesignComponents.selectComponent', componentType, componentParent, componentName, 'gloria');
    }

    designerSelectsApplication(appName){
        server.call('testDesignComponents.selectComponent', ComponentType.APPLICATION, 'NONE', appName, 'gloria');
    }

    designerSelectsDesignSection(parentName, sectionName){
        server.call('testDesignComponents.selectComponent', ComponentType.DESIGN_SECTION, parentName, sectionName, 'gloria');
    }

    designerSelectsFeature(parentName, featureName){
        server.call('testDesignComponents.selectComponent', ComponentType.FEATURE, parentName, featureName, 'gloria');
    }

    designerSelectsFeatureAspect(parentName, aspectName){
        server.call('testDesignComponents.selectComponent', ComponentType.FEATURE_ASPECT, parentName, aspectName, 'gloria');
    }

    designerSelectsScenario(featureName, aspectName, scenarioName){
        server.call('testDesignComponents.selectComponent', ComponentType.SCENARIO, aspectName, scenarioName, 'gloria');
    }

    // Edit Name
    designerEditsSelectedComponentNameTo_(newName, expectation){
        server.call('testDesignComponents.updateSelectedComponentName', newName, 'gloria', expectation);
    }

    // Edit Feature Narrative
    designerEditsSelectedFeatureNarrativeTo(newText, expectation){
        server.call('testDesignComponents.updateSelectedFeatureNarrative', newText, 'gloria', expectation);
    }

    // Edit Text
    designerEditsSelectedComponentTextTo(newText, expectation){
        server.call('testDesignComponents.updateSelectedComponentDetailsText', newText, RoleType.DESIGNER, 'gloria', expectation);
    }

    // Remove
    designerRemovesDesignComponentOfType_WithParent_Called_(type, parentName, componentName, expectation){
        server.call('testDesignComponents.removeComponent', type, parentName, componentName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerRemovesSelectedDesignComponent(expectation){
        server.call('testDesignComponents.removeSelectedComponent', 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    // Move
    designerMovesSelectedComponentToTarget_WithParent_Called_(targetType, targetParentName, targetComponentName, expectation){
        server.call('testDesignComponents.moveSelectedComponent', targetType, targetParentName, targetComponentName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    // Reorder
    designerReordersSelectedComponentToAbove_WithParent_Called_(targetType, targetParentName, targetComponentName, expectation){
        server.call('testDesignComponents.reorderSelectedComponent', targetType, targetParentName, targetComponentName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

}

export default new DesignComponentActions();
