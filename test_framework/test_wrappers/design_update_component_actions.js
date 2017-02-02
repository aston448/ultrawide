
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class UpdateComponentActions{

    // Component additions
    designerAddsApplicationToCurrentUpdate(){
        server.call('testDesignUpdateComponents.addApplication', 'gloria', ViewMode.MODE_EDIT);
    }

    designerAddsApplicationCalled(appName){
        server.call('testDesignUpdateComponents.addApplication', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.APPLICATION, 'NONE', DefaultComponentNames.NEW_APPLICATION_NAME, appName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerAddsDesignSectionToCurrentUpdateApplication(appName){
        server.call('testDesignUpdateComponents.addDesignSectionToApplication', 'NONE', appName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerAddsDesignSectionToCurrentUpdateSection(sectionParent, sectionName){
        server.call('testDesignUpdateComponents.addSectionToDesignSection', sectionParent, sectionName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerAddsDesignSectionToApplication_Called(appName, sectionName){
        server.call('testDesignUpdateComponents.addDesignSectionToApplication', 'NONE', appName, 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.DESIGN_SECTION, appName, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, sectionName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerAddsFeatureToCurrentUpdateSection(sectionParent, sectionName){
        server.call('testDesignUpdateComponents.addFeatureToDesignSection', sectionParent, sectionName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerAddsDesignSectionTo_Section_Called(sectionParent, sectionName, subSectionName){
        server.call('testDesignUpdateComponents.addSectionToDesignSection', sectionParent, sectionName, 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.DESIGN_SECTION, sectionName, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, subSectionName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerAddsFeatureTo_Section_Called(sectionParent, sectionName, featureName){
        server.call('testDesignUpdateComponents.addFeatureToDesignSection', sectionParent, sectionName, 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.FEATURE, sectionName, DefaultComponentNames.NEW_FEATURE_NAME, featureName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerAddsFeatureAspectToCurrentUpdateFeature(featureParent, featureName, expectation){
        server.call('testDesignUpdateComponents.addFeatureAspectToFeature', featureParent, featureName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerAddsFeatureAspectTo_Feature_Called(sectionParent, featureName, aspectName){
        server.call('testDesignUpdateComponents.addFeatureAspectToFeature', sectionParent, featureName, 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.FEATURE_ASPECT, featureName, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, aspectName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerAddsScenarioToCurrentUpdateFeatureAspect(featureName, aspectName){
        server.call('testDesignUpdateComponents.addScenarioToFeatureAspect', featureName, aspectName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerAddsScenarioTo_FeatureAspect_Called(featureName, aspectName, scenarioName){
        server.call('testDesignUpdateComponents.addScenarioToFeatureAspect', featureName, aspectName, 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.SCENARIO, aspectName, DefaultComponentNames.NEW_SCENARIO_NAME, scenarioName, 'gloria', ViewMode.MODE_EDIT);
    }

    // Scope addition
    designerAddsFeatureToCurrentUpdateScope(featureParent, featureName){
        server.call('testDesignUpdateComponents.addComponentToUpdateScope', ComponentType.FEATURE, featureParent, featureName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerAddsFeatureAspectToCurrentUpdateScope(featureName, aspectName){
        server.call('testDesignUpdateComponents.addComponentToUpdateScope', ComponentType.FEATURE_ASPECT, featureName, aspectName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerAddsScenarioToCurrentUpdateScope(aspectName, scenarioName){
        server.call('testDesignUpdateComponents.addComponentToUpdateScope', ComponentType.SCENARIO, aspectName, scenarioName, 'gloria', ViewMode.MODE_EDIT);
    }

    // Scope removal
    designerRemovesFeatureFromCurrentUpdateScope(featureParent, featureName){
        server.call('testDesignUpdateComponents.removeComponentFromUpdateScope', ComponentType.FEATURE, featureParent, featureName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerRemovesFeatureAspectFromCurrentUpdateScope(featureName, aspectName){
        server.call('testDesignUpdateComponents.removeComponentFromUpdateScope', ComponentType.FEATURE_ASPECT, featureName, aspectName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerRemovesScenarioFromCurrentUpdateScope(aspectName, scenarioName){
        server.call('testDesignUpdateComponents.removeComponentFromUpdateScope', ComponentType.SCENARIO, aspectName, scenarioName, 'gloria', ViewMode.MODE_EDIT);
    }

    // Select
    designerSelectsUpdateComponent(componentType, componentParent, componentName){
        server.call('testDesignUpdateComponents.selectComponent', componentType, componentParent, componentName, 'gloria');
    }

    // Rename selected
    designerUpdatesSelectedUpdateComponentNameTo(newName){
        server.call('testDesignUpdateComponents.updateCurrentComponentName', newName, 'gloria', ViewMode.MODE_EDIT);
    }

    // Move Selected
    designerMovesSelectedUpdateComponentTo(targetType, targetParent, targetName){
        server.call('testDesignUpdateComponents.moveSelectedDesignComponent', targetType, targetParent, targetName, 'gloria', ViewMode.MODE_EDIT);
    }

    // Reorder Selected
    designerReordersSelectedUpdateComponentToAbove(targetType, targetParent, targetName){
        server.call('testDesignUpdateComponents.reorderSelectedDesignComponent', targetType, targetParent, targetName, 'gloria', ViewMode.MODE_EDIT)
    }

    // Update Narrative for selected Feature
    designerUpdatesSelectedUpdateFeatureNarrativeTo(newNarrative){
        server.call('testDesignUpdateComponents.updateSelectedFeatureNarrative', newNarrative, 'gloria', ViewMode.MODE_EDIT);
    }


    // Logical Deletes
    designerLogicallyDeletesUpdateApplication(appName){
        server.call('testDesignUpdateComponents.logicallyDeleteDesignComponent', ComponentType.APPLICATION, 'NONE', appName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerLogicallyDeletesUpdateSection(sectionParent, sectionName){
        server.call('testDesignUpdateComponents.logicallyDeleteDesignComponent', ComponentType.DESIGN_SECTION, sectionParent, sectionName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerLogicallyDeletesUpdateFeature(featureParent, featureName){
        server.call('testDesignUpdateComponents.logicallyDeleteDesignComponent', ComponentType.FEATURE, featureParent, featureName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerLogicallyDeletesUpdateFeatureAspect(featureName, aspectName){
        server.call('testDesignUpdateComponents.logicallyDeleteDesignComponent', ComponentType.FEATURE_ASPECT, featureName, aspectName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerLogicallyDeletesUpdateScenario(aspectName, scenarioName){
        server.call('testDesignUpdateComponents.logicallyDeleteDesignComponent', ComponentType.SCENARIO, aspectName, scenarioName, 'gloria', ViewMode.MODE_EDIT);
    }

    // Logical Restores
    designerRestoresDeletedUpdateApplication(appName){
        server.call('testDesignUpdateComponents.restoreDesignComponent', ComponentType.APPLICATION, 'NONE', appName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerRestoresDeletedUpdateSection(sectionParent, sectionName){
        server.call('testDesignUpdateComponents.restoreDesignComponent', ComponentType.DESIGN_SECTION, sectionParent, sectionName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerRestoresDeletedUpdateFeature(featureParent, featureName){
        server.call('testDesignUpdateComponents.restoreDesignComponent', ComponentType.FEATURE, featureParent, featureName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerRestoresDeletedUpdateFeatureAspect(featureName, aspectName){
        server.call('testDesignUpdateComponents.restoreDesignComponent', ComponentType.FEATURE_ASPECT, featureName, aspectName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerRestoresDeletedUpdateScenario(aspectName, scenarioName){
        server.call('testDesignUpdateComponents.restoreDesignComponent', ComponentType.SCENARIO, aspectName, scenarioName, 'gloria', ViewMode.MODE_EDIT);
    }

    // Actual Deletes of new components
    designerRemovesUpdateApplication(appName){
        server.call('testDesignUpdateComponents.removeDesignComponent', ComponentType.APPLICATION, 'NONE', appName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerRemovesUpdateSection(sectionParent, sectionName){
        server.call('testDesignUpdateComponents.removeDesignComponent', ComponentType.DESIGN_SECTION, sectionParent, sectionName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerRemovesUpdateFeature(featureParent, featureName){
        server.call('testDesignUpdateComponents.removeDesignComponent', ComponentType.FEATURE, featureParent, featureName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerRemovesUpdateFeatureAspect(featureName, aspectName){
        server.call('testDesignUpdateComponents.removeDesignComponent', ComponentType.FEATURE_ASPECT, featureName, aspectName, 'gloria', ViewMode.MODE_EDIT);
    }

    designerRemovesUpdateScenario(aspectName, scenarioName){
        server.call('testDesignUpdateComponents.removeDesignComponent', ComponentType.SCENARIO, aspectName, scenarioName, 'gloria', ViewMode.MODE_EDIT);
    }

}

export default new UpdateComponentActions();
