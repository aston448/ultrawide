import { Meteor } from 'meteor/meteor';

import { DesignUpdateComponents }   from '../../imports/collections/design_update/design_update_components.js';

import ClientDesignUpdateComponentServices      from '../../imports/apiClient/apiClientDesignUpdateComponent.js';
import ClientDesignComponentServices            from '../../imports/apiClient/apiClientDesignComponent.js';
import DesignComponentModules                   from '../../imports/service_modules/design/design_component_service_modules.js';
import TestDataHelpers                          from '../test_modules/test_data_helpers.js'


import {RoleType, ViewType, ViewMode, DisplayContext, ComponentType} from '../../imports/constants/constants.js';

Meteor.methods({

    'testDesignUpdateComponents.addComponentToUpdateScope'(componentType, componentParentName, componentName, userName, mode){

        const view = ViewType.DESIGN_UPDATE_EDIT;
        const displayContext = DisplayContext.UPDATE_SCOPE;

        const userContext = TestDataHelpers.getUserContext(userName);

        const designUpdateComponent = TestDataHelpers.getDesignUpdateComponentWithParent(userContext.designVersionId, userContext.designUpdateId, componentType, componentParentName, componentName);

        ClientDesignUpdateComponentServices.toggleInScope(view, mode, displayContext, designUpdateComponent, true)
    },

    'testDesignUpdateComponents.removeComponentFromUpdateScope'(componentType, componentParentName, componentName, userName, mode){

        const view = ViewType.DESIGN_UPDATE_EDIT;
        const displayContext = DisplayContext.UPDATE_SCOPE;

        const userContext = TestDataHelpers.getUserContext(userName);

        const designUpdateComponent = TestDataHelpers.getDesignUpdateComponentWithParent(userContext.designVersionId, userContext.designUpdateId, componentType, componentParentName, componentName);

        ClientDesignUpdateComponentServices.toggleInScope(view, mode, displayContext, designUpdateComponent, false)
    },


    'testDesignUpdateComponents.addApplication'(userName, mode){

        // Assume view is correct
        const view = ViewType.DESIGN_UPDATE_EDIT;

        // Get user's Design Version Id as the one being worked on
        const userContext = TestDataHelpers.getUserContext(userName);

        ClientDesignUpdateComponentServices.addApplicationToDesignVersion(view, mode, userContext.designVersionId, userContext.designUpdateId);
    },

    'testDesignUpdateComponents.addDesignSectionToApplication'(targetParentName, targetComponentName, userName, mode){

        // Assume view is correct
        const view = ViewType.DESIGN_UPDATE_EDIT;

        // Get user's Design Version Id as the one being worked on
        const userContext = TestDataHelpers.getUserContext(userName);
        const parentComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            ComponentType.APPLICATION,
            targetParentName,
            targetComponentName
        );

        ClientDesignUpdateComponentServices.addDesignSectionToApplication(view, mode, parentComponent);
    },

    'testDesignUpdateComponents.addSectionToDesignSection'(targetParentName, targetComponentName, userName, mode){

        // Assume view is correct
        const view = ViewType.DESIGN_UPDATE_EDIT;

        // Get user's Design Version Id as the one being worked on
        const userContext = TestDataHelpers.getUserContext(userName);
        const parentComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            ComponentType.DESIGN_SECTION,
            targetParentName,
            targetComponentName
        );

        const outcome = ClientDesignUpdateComponentServices.addSectionToDesignSection(view, mode, parentComponent);

        if(!outcome.success){
            throw new Meteor.Error('INVALID', outcome.message);
        }
    },

    'testDesignUpdateComponents.addFeatureToDesignSection'(targetParentName, targetComponentName, userName, mode){

        // Assume view is correct
        const view = ViewType.DESIGN_UPDATE_EDIT;

        // Get user's Design Version Id as the one being worked on
        const userContext = TestDataHelpers.getUserContext(userName);
        const parentComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            ComponentType.DESIGN_SECTION,
            targetParentName,
            targetComponentName
        );

        ClientDesignUpdateComponentServices.addFeatureToDesignSection(view, mode, parentComponent);
    },

    'testDesignUpdateComponents.addFeatureAspectToFeature'(targetParentName, targetComponentName, userName, mode){

        // Assume view is correct
        const view = ViewType.DESIGN_UPDATE_EDIT;

        // Get user's Design Version Id as the one being worked on
        const userContext = TestDataHelpers.getUserContext(userName);
        const parentComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            ComponentType.FEATURE,
            targetParentName,
            targetComponentName
        );

        ClientDesignUpdateComponentServices.addFeatureAspectToFeature(view, mode, parentComponent);
    },

    'testDesignUpdateComponents.addScenarioToFeature'(targetParentName, targetComponentName, userName, mode){

        // Assume view is correct
        const view = ViewType.DESIGN_UPDATE_EDIT;

        // Get user's Design Version Id as the one being worked on
        const userContext = TestDataHelpers.getUserContext(userName);
        const parentComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            ComponentType.FEATURE,
            targetParentName,
            targetComponentName
        );

        ClientDesignUpdateComponentServices.addScenario(view, mode, parentComponent);
    },

    'testDesignUpdateComponents.addScenarioToFeatureAspect'(targetParentName, targetComponentName, userName, mode){

        // Assume view is correct
        const view = ViewType.DESIGN_UPDATE_EDIT;

        // Get user's Design Version Id as the one being worked on
        const userContext = TestDataHelpers.getUserContext(userName);
        const parentComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            ComponentType.FEATURE_ASPECT,
            targetParentName,
            targetComponentName
        );

        ClientDesignUpdateComponentServices.addScenario(view, mode, parentComponent);
    },

    'testDesignUpdateComponents.updateComponentName'(componentType, targetParentName, targetComponentName, newName, userName, mode){

        // Assume view is correct
        const view = ViewType.DESIGN_UPDATE_EDIT;
        
        // Get user's Design Version Id as the one being worked on
        const userContext = TestDataHelpers.getUserContext(userName);
        const targetComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            componentType,
            targetParentName,
            targetComponentName
        );
        
        const newNameRaw = DesignComponentModules.getRawTextFor(newName);
        
        ClientDesignUpdateComponentServices.updateComponentName(view, mode, targetComponent._id, newName, newNameRaw)
    },

    'testDesignUpdateComponents.updateCurrentComponentName'(newName, userName, mode){
        // Only use this after selecting the component

        // Assume view is correct
        const view = ViewType.DESIGN_UPDATE_EDIT;

        // Get user's Design Version Id as the one being worked on
        const userContext = TestDataHelpers.getUserContext(userName);
        const targetComponent = DesignUpdateComponents.findOne({_id: userContext.designComponentId});

        const newNameRaw = DesignComponentModules.getRawTextFor(newName);

        ClientDesignUpdateComponentServices.updateComponentName(view, mode, targetComponent._id, newName, newNameRaw)
    },

    'testDesignUpdateComponents.logicallyDeleteDesignComponent'(componentType, componentParentName, componentName, userName, mode){
        // Called in the context of an EXISTING component

        // Assume view is correct
        const view = ViewType.DESIGN_UPDATE_EDIT;

        // Get user's Design Version Id as the one being worked on
        const userContext = TestDataHelpers.getUserContext(userName);
        const targetComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            componentType,
            componentParentName,
            componentName
        );

        ClientDesignUpdateComponentServices.removeComponent(view, mode, targetComponent);
    },

    'testDesignUpdateComponents.removeDesignComponent'(componentType, componentParentName, componentName, userName, mode){
        // Called in the context of an NEW component

        // Assume view is correct
        const view = ViewType.DESIGN_UPDATE_EDIT;

        // Get user's Design Version Id as the one being worked on
        const userContext = TestDataHelpers.getUserContext(userName);
        const targetComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            componentType,
            componentParentName,
            componentName
        );

        ClientDesignUpdateComponentServices.removeComponent(view, mode, targetComponent);
    },

    'testDesignUpdateComponents.restoreDesignComponent'(componentType, componentParentName, componentName, userName, mode){

        // Assume view is correct
        const view = ViewType.DESIGN_UPDATE_EDIT;

        // Get user's Design Version Id as the one being worked on
        const userContext = TestDataHelpers.getUserContext(userName);
        const targetComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            componentType,
            componentParentName,
            componentName
        );

        ClientDesignUpdateComponentServices.restoreComponent(view, mode, targetComponent);
    },

    'testDesignUpdateComponents.moveDesignComponent'(movingComponentType, movingComponentParentName, movingComponentName, targetComponentType, targetComponentParentName, targetComponentName, userName, mode){

        // Assume view is correct
        const view = ViewType.DESIGN_UPDATE_EDIT;
        const displayContext = DisplayContext.UPDATE_EDIT;

        // Get user's Design Version Id as the one being worked on
        const userContext = TestDataHelpers.getUserContext(userName);
        const movingComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            movingComponentType,
            movingComponentParentName,
            movingComponentName
        );
        const targetComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            targetComponentType,
            targetComponentParentName,
            targetComponentName
        );

        ClientDesignUpdateComponentServices.moveComponent(view, mode, displayContext, movingComponent, targetComponent);
    },

    'testDesignUpdateComponents.moveSelectedDesignComponent'(targetComponentType, targetComponentParentName, targetComponentName, userName, mode){

        // Assume view is correct
        const view = ViewType.DESIGN_UPDATE_EDIT;
        const displayContext = DisplayContext.UPDATE_EDIT;

        // Get user's Design Version Id as the one being worked on
        const userContext = TestDataHelpers.getUserContext(userName);
        const movingComponent = DesignUpdateComponents.findOne({_id: userContext.designComponentId});
        const targetComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            targetComponentType,
            targetComponentParentName,
            targetComponentName
        );

        ClientDesignUpdateComponentServices.moveComponent(view, mode, displayContext, movingComponent, targetComponent);
    },

    'testDesignUpdateComponents.reorderDesignComponent'(movingComponentType, movingComponentParentName, movingComponentName, targetComponentParentName, targetComponentName, userName, mode){

        // Assume view is correct
        const view = ViewType.DESIGN_UPDATE_EDIT;
        const displayContext = DisplayContext.UPDATE_EDIT;

        // Get user's Design Version Id as the one being worked on
        const userContext = TestDataHelpers.getUserContext(userName);
        const movingComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            movingComponentType,
            movingComponentParentName,
            movingComponentName
        );
        const targetComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            movingComponentType,
            targetComponentParentName,
            targetComponentName
        );

        ClientDesignUpdateComponentServices.reorderComponent(view, mode, displayContext, movingComponent, targetComponent);
    },

    'testDesignUpdateComponents.reorderSelectedDesignComponent'(targetType, targetComponentParentName, targetComponentName, userName, mode){

        // Assume view is correct
        const view = ViewType.DESIGN_UPDATE_EDIT;
        const displayContext = DisplayContext.UPDATE_EDIT;

        // Get user's Design Version Id as the one being worked on
        const userContext = TestDataHelpers.getUserContext(userName);
        const movingComponent = DesignUpdateComponents.findOne({_id: userContext.designComponentId});
        const targetComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            targetType,
            targetComponentParentName,
            targetComponentName
        );

        ClientDesignUpdateComponentServices.reorderComponent(view, mode, displayContext, movingComponent, targetComponent);
    },

    'testDesignUpdateComponents.updateFeatureNarrative'(parentName, featureName, newPlainText, userName, mode){

        // Assume view is correct
        const view = ViewType.DESIGN_UPDATE_EDIT;

        const userContext = TestDataHelpers.getUserContext(userName);
        const feature = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            ComponentType.FEATURE,
            parentName,
            featureName
        );

        const newRawText = DesignComponentModules.getRawTextFor(newPlainText);

        ClientDesignUpdateComponentServices.updateFeatureNarrative(view, mode, feature._id, newPlainText, newRawText)
    },

    'testDesignUpdateComponents.updateSelectedFeatureNarrative'(newPlainText, userName, mode){

        // Assume view is correct
        const view = ViewType.DESIGN_UPDATE_EDIT;

        const userContext = TestDataHelpers.getUserContext(userName);
        const feature = DesignUpdateComponents.findOne({_id: userContext.designComponentId});

        const newRawText = DesignComponentModules.getRawTextFor(newPlainText);

        ClientDesignUpdateComponentServices.updateFeatureNarrative(view, mode, feature._id, newPlainText, newRawText)
    },

    'testDesignUpdateComponents.selectComponent'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const targetComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            componentType,
            componentParentName,
            componentName
        );
        const displayContext = DisplayContext.UPDATE_EDIT;

        // Note this is same function for both base design and updates
        ClientDesignComponentServices.setDesignComponent(targetComponent._id, userContext, displayContext);
    }



});
