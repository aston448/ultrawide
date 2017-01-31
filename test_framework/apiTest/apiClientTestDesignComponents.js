import { Meteor } from 'meteor/meteor';

import { Designs }                  from '../../imports/collections/design/designs.js';
import { DesignComponents }         from '../../imports/collections/design/design_components.js';
import { UserCurrentEditContext }   from '../../imports/collections/context/user_current_edit_context.js';
import { UserRoles }                from '../../imports/collections/users/user_roles.js';

import ClientDesignComponentServices    from '../../imports/apiClient/apiClientDesignComponent.js';
import DesignComponentModules           from '../../imports/service_modules/design/design_component_service_modules.js';
import TestDataHelpers                  from '../test_modules/test_data_helpers.js'

import {RoleType, ViewType, ViewMode, DisplayContext, ComponentType} from '../../imports/constants/constants.js';

Meteor.methods({

    'testDesignComponents.addApplication'(userName){

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;
        const mode = ViewMode.MODE_EDIT;

        // Get user's Design Version Id as the one being worked on
        const userContext = TestDataHelpers.getUserContext(userName);

        ClientDesignComponentServices.addApplicationToDesignVersion(view, mode, userContext.designVersionId);

    },

    'testDesignComponents.addApplicationInMode'(userName, mode){

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;

        // Get user's Design Version Id as the one being worked on
        const userContext = TestDataHelpers.getUserContext(userName);

        ClientDesignComponentServices.addApplicationToDesignVersion(view, mode, userContext.designVersionId);

    },

    'testDesignComponents.addDesignSectionToApplication'(applicationName){

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;
        const mode = ViewMode.MODE_EDIT;

        // And the parent component
        const applicationComponent = DesignComponents.findOne({componentType: ComponentType.APPLICATION, componentName: applicationName});

        ClientDesignComponentServices.addDesignSectionToApplication(view, mode, applicationComponent);

    },

    'testDesignComponents.addDesignSectionToDesignSection'(sectionName){

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;
        const mode = ViewMode.MODE_EDIT;

        // And the parent component
        const sectionComponent = DesignComponents.findOne({componentType: ComponentType.DESIGN_SECTION, componentName: sectionName});

        ClientDesignComponentServices.addDesignSectionToDesignSection(view, mode, sectionComponent);

    },

    'testDesignComponents.addFeatureToDesignSection'(sectionName){

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;
        const mode = ViewMode.MODE_EDIT;

        // And the parent component
        const sectionComponent = DesignComponents.findOne({componentType: ComponentType.DESIGN_SECTION, componentName: sectionName});

        ClientDesignComponentServices.addFeatureToDesignSection(view, mode, sectionComponent);

    },

    'testDesignComponents.addFeatureAspectToFeature'(featureName){

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;
        const mode = ViewMode.MODE_EDIT;

        // And the parent component
        const featureComponent = DesignComponents.findOne({componentType: ComponentType.FEATURE, componentName: featureName});

        ClientDesignComponentServices.addFeatureAspectToFeature(view, mode, featureComponent);

    },

    'testDesignComponents.addScenarioToFeature'(featureName){

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;
        const mode = ViewMode.MODE_EDIT;

        // And the parent component
        const featureComponent = DesignComponents.findOne({componentType: ComponentType.FEATURE, componentName: featureName});

        ClientDesignComponentServices.addScenario(view, mode, featureComponent);

    },

    'testDesignComponents.addScenarioToFeatureAspect'(featureName, featureAspectName){

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;
        const mode = ViewMode.MODE_EDIT;

        // As Feature Aspects don't have to have unique names - and very likely won't - double check by getting the Feature too
        const featureComponent = DesignComponents.findOne({componentType: ComponentType.FEATURE, componentName: featureName});
        const featureAspectComponent = DesignComponents.findOne({componentType: ComponentType.FEATURE_ASPECT, componentName: featureAspectName, componentParentId: featureComponent._id});

        ClientDesignComponentServices.addScenario(view, mode, featureAspectComponent);

    },


    'testDesignComponents.updateComponentName'(componentType, oldName, newName){

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;
        const mode = ViewMode.MODE_EDIT;

        const component = DesignComponents.findOne({componentType: componentType, componentName: oldName});
        const rawName = DesignComponentModules.getRawTextFor(newName);

        ClientDesignComponentServices.updateComponentName(view, mode, component._id, newName, rawName)

    },

    'testDesignComponents.updateSelectedComponentName'(newName, userName){

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;
        const mode = ViewMode.MODE_EDIT;

        const userContext = TestDataHelpers.getUserContext(userName);
        const rawName = DesignComponentModules.getRawTextFor(newName);

        if(userContext.designComponentId === 'NONE'){
            throw new Meteor.Error("FAIL", "No Design Component is currently selected for user " + userName);
        }

        ClientDesignComponentServices.updateComponentName(view, mode, userContext.designComponentId, newName, rawName)

    },

    'testDesignComponents.updateFeatureNarrative'(featureName, newText, mode){

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;

        const featureComponent = DesignComponents.findOne({componentType: ComponentType.FEATURE, componentName: featureName});
        const newRawText = DesignComponentModules.getRawTextFor(newText);

        ClientDesignComponentServices.updateFeatureNarrative(view, mode, featureComponent._id, newText, newRawText);
    },

    'testDesignComponents.updateComponentNameInMode'(componentType, oldName, newName, mode){

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;

        const component = DesignComponents.findOne({componentType: componentType, componentName: oldName});
        const rawName = DesignComponentModules.getRawTextFor(newName);

        ClientDesignComponentServices.updateComponentName(view, mode, component._id, newName, rawName)

    },

    'testDesignComponents.removeComponent'(componentType, parentName, componentName, userName, mode){

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;

        const userContext = TestDataHelpers.getUserContext(userName);
        const designComponent = TestDataHelpers.getDesignComponentWithParent(userContext.designVersionId, componentType, parentName, componentName);

        ClientDesignComponentServices.removeDesignComponent(view, mode, designComponent, userContext);

    },

    // Use Select and then MoveSelected for unambiguous results
    'testDesignComponents.moveComponent'(componentType, componentName, newParentType, newParentName, mode){

        // Assume view and context is correct
        const view = ViewType.DESIGN_NEW_EDIT;
        const displayContext = DisplayContext.BASE_EDIT;

        const movingComponent = DesignComponents.findOne({componentType: componentType, componentName: componentName});
        const newParentComponent = DesignComponents.findOne({componentType: newParentType, componentName: newParentName});

        ClientDesignComponentServices.moveDesignComponent(view, mode, displayContext, movingComponent._id, newParentComponent._id);

    },

    'testDesignComponents.reorderComponent'(componentType, movingComponentName, targetComponentName, mode){

        // Assume view and context is correct
        const view = ViewType.DESIGN_NEW_EDIT;
        const displayContext = DisplayContext.BASE_EDIT;

        const movingComponent = DesignComponents.findOne({componentType: componentType, componentName: movingComponentName});
        const targetComponent = DesignComponents.findOne({componentType: componentType, componentName: targetComponentName});

        ClientDesignComponentServices.reorderDesignComponent(view, mode, displayContext, movingComponent._id, targetComponent._id);

    },

    'testDesignComponents.selectComponent'(componentType, parentName, componentName, userName){

        const displayContext = DisplayContext.BASE_EDIT;
        const userContext = TestDataHelpers.getUserContext(userName);

        const component = TestDataHelpers.getDesignComponentWithParent(
            userContext.designVersionId,
            componentType,
            parentName,
            componentName
        );

        ClientDesignComponentServices.setDesignComponent(component._id, userContext, displayContext);
    },

    'testDesignComponents.moveSelectedComponent'(targetType, targetParentName, targetName,  userName, mode){

        // Assume view and context is correct
        const view = ViewType.DESIGN_NEW_EDIT;
        const displayContext = DisplayContext.BASE_EDIT;
        // Component MUST be selected first
        const userContext = TestDataHelpers.getUserContext(userName);

        const movingComponent = DesignComponents.findOne({_id: userContext.designComponentId});
        const newParentComponent = TestDataHelpers.getDesignComponentWithParent(userContext.designVersionId, targetType, targetParentName, targetName);

        ClientDesignComponentServices.moveDesignComponent(view, mode, displayContext, movingComponent._id, newParentComponent._id);

    },

});
