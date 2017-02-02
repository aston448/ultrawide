
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class UpdateComponentActions{

    // Component additions
    designerAddsApplicationToCurrentUpdate(expectation){
        server.call('testDesignUpdateComponents.addApplication', 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerAddsApplicationCalled(appName, expectation){
        server.call('testDesignUpdateComponents.addApplication', 'gloria', ViewMode.MODE_EDIT, expectation);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.APPLICATION, 'NONE', DefaultComponentNames.NEW_APPLICATION_NAME, appName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerAddsDesignSectionToCurrentUpdateApplication(appName, expectation){
        server.call('testDesignUpdateComponents.addDesignSectionToApplication', 'NONE', appName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerAddsDesignSectionToCurrentUpdateSection(sectionParent, sectionName, expectation){
        server.call('testDesignUpdateComponents.addSectionToDesignSection', sectionParent, sectionName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerAddsDesignSectionToApplication_Called(appName, sectionName, expectation){
        server.call('testDesignUpdateComponents.addDesignSectionToApplication', 'NONE', appName, 'gloria', ViewMode.MODE_EDIT, expectation);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.DESIGN_SECTION, appName, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, sectionName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerAddsFeatureToCurrentUpdateSection(sectionParent, sectionName, expectation){
        server.call('testDesignUpdateComponents.addFeatureToDesignSection', sectionParent, sectionName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerAddsDesignSectionTo_Section_Called(sectionParent, sectionName, subSectionName, expectation){
        server.call('testDesignUpdateComponents.addSectionToDesignSection', sectionParent, sectionName, 'gloria', ViewMode.MODE_EDIT, expectation);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.DESIGN_SECTION, sectionName, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, subSectionName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerAddsFeatureTo_Section_Called(sectionParent, sectionName, featureName, expectation){
        server.call('testDesignUpdateComponents.addFeatureToDesignSection', sectionParent, sectionName, 'gloria', ViewMode.MODE_EDIT, expectation);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.FEATURE, sectionName, DefaultComponentNames.NEW_FEATURE_NAME, featureName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerAddsFeatureAspectToCurrentUpdateFeature(featureParent, featureName, expectation){
        server.call('testDesignUpdateComponents.addFeatureAspectToFeature', featureParent, featureName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerAddsFeatureAspectTo_Feature_Called(sectionParent, featureName, aspectName, expectation){
        server.call('testDesignUpdateComponents.addFeatureAspectToFeature', sectionParent, featureName, 'gloria', ViewMode.MODE_EDIT, expectation);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.FEATURE_ASPECT, featureName, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, aspectName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerAddsScenarioToCurrentUpdateFeatureAspect(featureName, aspectName, expectation){
        server.call('testDesignUpdateComponents.addScenarioToFeatureAspect', featureName, aspectName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerAddsScenarioTo_FeatureAspect_Called(featureName, aspectName, scenarioName, expectation){
        server.call('testDesignUpdateComponents.addScenarioToFeatureAspect', featureName, aspectName, 'gloria', ViewMode.MODE_EDIT, expectation);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.SCENARIO, aspectName, DefaultComponentNames.NEW_SCENARIO_NAME, scenarioName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    // Scope addition
    designerAddsFeatureToCurrentUpdateScope(featureParent, featureName, expectation){
        server.call('testDesignUpdateComponents.addComponentToUpdateScope', ComponentType.FEATURE, featureParent, featureName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerAddsFeatureAspectToCurrentUpdateScope(featureName, aspectName, expectation){
        server.call('testDesignUpdateComponents.addComponentToUpdateScope', ComponentType.FEATURE_ASPECT, featureName, aspectName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerAddsScenarioToCurrentUpdateScope(aspectName, scenarioName, expectation){
        server.call('testDesignUpdateComponents.addComponentToUpdateScope', ComponentType.SCENARIO, aspectName, scenarioName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    // Scope removal
    designerRemovesFeatureFromCurrentUpdateScope(featureParent, featureName, expectation){
        server.call('testDesignUpdateComponents.removeComponentFromUpdateScope', ComponentType.FEATURE, featureParent, featureName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerRemovesFeatureAspectFromCurrentUpdateScope(featureName, aspectName, expectation){
        server.call('testDesignUpdateComponents.removeComponentFromUpdateScope', ComponentType.FEATURE_ASPECT, featureName, aspectName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerRemovesScenarioFromCurrentUpdateScope(aspectName, scenarioName, expectation){
        server.call('testDesignUpdateComponents.removeComponentFromUpdateScope', ComponentType.SCENARIO, aspectName, scenarioName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    // Select
    designerSelectsUpdateComponent(componentType, componentParent, componentName, expectation){
        server.call('testDesignUpdateComponents.selectComponent', componentType, componentParent, componentName, 'gloria', expectation);
    }

    // Rename selected
    designerUpdatesSelectedUpdateComponentNameTo(newName, expectation){
        server.call('testDesignUpdateComponents.updateCurrentComponentName', newName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    // Move Selected
    designerMovesSelectedUpdateComponentTo(targetType, targetParent, targetName, expectation){
        server.call('testDesignUpdateComponents.moveSelectedDesignComponent', targetType, targetParent, targetName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    // Reorder Selected
    designerReordersSelectedUpdateComponentToAbove(targetType, targetParent, targetName, expectation){
        server.call('testDesignUpdateComponents.reorderSelectedDesignComponent', targetType, targetParent, targetName, 'gloria', ViewMode.MODE_EDIT, expectation)
    }

    // Update Narrative for selected Feature
    designerUpdatesSelectedUpdateFeatureNarrativeTo(newNarrative, expectation){
        server.call('testDesignUpdateComponents.updateSelectedFeatureNarrative', newNarrative, 'gloria', ViewMode.MODE_EDIT, expectation);
    }


    // Logical Deletes
    designerLogicallyDeletesUpdateApplication(appName, expectation){
        server.call('testDesignUpdateComponents.logicallyDeleteDesignComponent', ComponentType.APPLICATION, 'NONE', appName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerLogicallyDeletesUpdateSection(sectionParent, sectionName, expectation){
        server.call('testDesignUpdateComponents.logicallyDeleteDesignComponent', ComponentType.DESIGN_SECTION, sectionParent, sectionName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerLogicallyDeletesUpdateFeature(featureParent, featureName, expectation){
        server.call('testDesignUpdateComponents.logicallyDeleteDesignComponent', ComponentType.FEATURE, featureParent, featureName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerLogicallyDeletesUpdateFeatureAspect(featureName, aspectName, expectation){
        server.call('testDesignUpdateComponents.logicallyDeleteDesignComponent', ComponentType.FEATURE_ASPECT, featureName, aspectName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerLogicallyDeletesUpdateScenario(aspectName, scenarioName, expectation){
        server.call('testDesignUpdateComponents.logicallyDeleteDesignComponent', ComponentType.SCENARIO, aspectName, scenarioName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    // Logical Restores
    designerRestoresDeletedUpdateApplication(appName, expectation){
        server.call('testDesignUpdateComponents.restoreDesignComponent', ComponentType.APPLICATION, 'NONE', appName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerRestoresDeletedUpdateSection(sectionParent, sectionName, expectation){
        server.call('testDesignUpdateComponents.restoreDesignComponent', ComponentType.DESIGN_SECTION, sectionParent, sectionName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerRestoresDeletedUpdateFeature(featureParent, featureName, expectation){
        server.call('testDesignUpdateComponents.restoreDesignComponent', ComponentType.FEATURE, featureParent, featureName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerRestoresDeletedUpdateFeatureAspect(featureName, aspectName, expectation){
        server.call('testDesignUpdateComponents.restoreDesignComponent', ComponentType.FEATURE_ASPECT, featureName, aspectName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerRestoresDeletedUpdateScenario(aspectName, scenarioName, expectation){
        server.call('testDesignUpdateComponents.restoreDesignComponent', ComponentType.SCENARIO, aspectName, scenarioName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    // Actual Deletes of new components
    designerRemovesUpdateApplication(appName, expectation){
        server.call('testDesignUpdateComponents.removeDesignComponent', ComponentType.APPLICATION, 'NONE', appName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerRemovesUpdateSection(sectionParent, sectionName, expectation){
        server.call('testDesignUpdateComponents.removeDesignComponent', ComponentType.DESIGN_SECTION, sectionParent, sectionName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerRemovesUpdateFeature(featureParent, featureName, expectation){
        server.call('testDesignUpdateComponents.removeDesignComponent', ComponentType.FEATURE, featureParent, featureName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerRemovesUpdateFeatureAspect(featureName, aspectName, expectation){
        server.call('testDesignUpdateComponents.removeDesignComponent', ComponentType.FEATURE_ASPECT, featureName, aspectName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

    designerRemovesUpdateScenario(aspectName, scenarioName, expectation){
        server.call('testDesignUpdateComponents.removeDesignComponent', ComponentType.SCENARIO, aspectName, scenarioName, 'gloria', ViewMode.MODE_EDIT, expectation);
    }

}

export default new UpdateComponentActions();
