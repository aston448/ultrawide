import { Meteor } from 'meteor/meteor';

import { Designs }                  from '../../imports/collections/design/designs.js';
import { DesignComponents }         from '../../imports/collections/design/design_components.js';
import { UserCurrentEditContext }   from '../../imports/collections/context/user_current_edit_context.js';
import { UserRoles }                from '../../imports/collections/users/user_roles.js';

import ClientDesignComponentServices    from '../../imports/apiClient/apiClientDesignComponent.js';
import ClientTextEditorServices         from '../../imports/apiClient/apiClientTextEditor.js';
import DesignComponentModules           from '../../imports/service_modules/design/design_component_service_modules.js';
import TestDataHelpers                  from '../test_modules/test_data_helpers.js'

import {RoleType, ViewType, ViewMode, DisplayContext, ComponentType} from '../../imports/constants/constants.js';

Meteor.methods({

    'testDesignComponents.selectComponent'(componentType, parentName, componentName, userName){

        const displayContext = DisplayContext.BASE_EDIT;
        const userContext = TestDataHelpers.getUserContext(userName);

        const component = TestDataHelpers.getDesignComponentWithParent(
            userContext.designVersionId,
            componentType,
            parentName,
            componentName
        );

        // This is not a validated action
        ClientDesignComponentServices.setDesignComponent(component._id, userContext, displayContext);

    },

    'testDesignComponents.addApplication'(userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;
        const mode = ViewMode.MODE_EDIT;

        // Get user's Design Version Id as the one being worked on
        const userContext = TestDataHelpers.getUserContext(userName);

        const outcome = ClientDesignComponentServices.addApplicationToDesignVersion(view, mode, userContext.designVersionId);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Add Application');
    },


    'testDesignComponents.addDesignSectionToApplication'(applicationName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;
        const mode = ViewMode.MODE_EDIT;

        // And the parent component
        const applicationComponent = DesignComponents.findOne({componentType: ComponentType.APPLICATION, componentName: applicationName});

        const outcome = ClientDesignComponentServices.addDesignSectionToApplication(view, mode, applicationComponent);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Add Section to App');
    },

    'testDesignComponents.addDesignSectionToDesignSection'(sectionName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;
        const mode = ViewMode.MODE_EDIT;

        // And the parent component
        const sectionComponent = DesignComponents.findOne({componentType: ComponentType.DESIGN_SECTION, componentName: sectionName});

        const outcome = ClientDesignComponentServices.addDesignSectionToDesignSection(view, mode, sectionComponent);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Add Section to Section');
    },

    'testDesignComponents.addFeatureToDesignSection'(sectionName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;
        const mode = ViewMode.MODE_EDIT;

        // And the parent component
        const sectionComponent = DesignComponents.findOne({componentType: ComponentType.DESIGN_SECTION, componentName: sectionName});

        const outcome = ClientDesignComponentServices.addFeatureToDesignSection(view, mode, sectionComponent);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Add Feature to Section');
    },

    'testDesignComponents.addFeatureAspectToFeature'(featureName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;
        const mode = ViewMode.MODE_EDIT;

        // And the parent component
        const featureComponent = DesignComponents.findOne({componentType: ComponentType.FEATURE, componentName: featureName});

        const outcome = ClientDesignComponentServices.addFeatureAspectToFeature(view, mode, featureComponent);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Add Aspect to Feature');
    },

    'testDesignComponents.addScenarioToFeature'(featureName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;
        const mode = ViewMode.MODE_EDIT;

        // And the parent component
        const featureComponent = DesignComponents.findOne({componentType: ComponentType.FEATURE, componentName: featureName});

        const outcome = ClientDesignComponentServices.addScenario(view, mode, featureComponent);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Add scenario to Feature');
    },

    'testDesignComponents.addScenarioToFeatureAspect'(featureName, featureAspectName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;
        const mode = ViewMode.MODE_EDIT;

        // As Feature Aspects don't have to have unique names - and very likely won't - double check by getting the Feature too
        const featureComponent = DesignComponents.findOne({componentType: ComponentType.FEATURE, componentName: featureName});
        const featureAspectComponent = DesignComponents.findOne({componentType: ComponentType.FEATURE_ASPECT, componentName: featureAspectName, componentParentId: featureComponent._id});

        const outcome = ClientDesignComponentServices.addScenario(view, mode, featureAspectComponent);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Add Scenario to Aspect');
    },


    'testDesignComponents.updateComponentName'(componentType, oldName, newName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;
        const mode = ViewMode.MODE_EDIT;

        const component = DesignComponents.findOne({componentType: componentType, componentName: oldName});
        const rawName = DesignComponentModules.getRawTextFor(newName);

        const outcome = ClientDesignComponentServices.updateComponentName(view, mode, component._id, newName, rawName)

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Update Component Name');
    },

    'testDesignComponents.updateSelectedComponentName'(newName, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;
        const mode = ViewMode.MODE_EDIT;

        const userContext = TestDataHelpers.getUserContext(userName);
        const rawName = DesignComponentModules.getRawTextFor(newName);

        if(userContext.designComponentId === 'NONE'){
            throw new Meteor.Error("FAIL", "No Design Component is currently selected for user " + userName);
        }

        const outcome = ClientDesignComponentServices.updateComponentName(view, mode, userContext.designComponentId, newName, rawName)

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Update Selected Component Name');
    },

    'testDesignComponents.updateSelectedComponentDetailsText'(newText, userRole, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;
        const mode = ViewMode.MODE_EDIT;

        const userContext = TestDataHelpers.getUserContext(userName);
        const newRawText = DesignComponentModules.getRawTextFor(newText);

        const outcome = ClientTextEditorServices.saveDesignComponentText(userRole, userContext.designComponentId, newRawText)

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Update Component Details Text');
    },

    'testDesignComponents.updateFeatureNarrative'(featureName, newText, mode, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;

        const featureComponent = DesignComponents.findOne({componentType: ComponentType.FEATURE, componentName: featureName});
        const newRawText = DesignComponentModules.getRawTextFor(newText);

        const outcome = ClientDesignComponentServices.updateFeatureNarrative(view, mode, featureComponent._id, newText, newRawText);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Update Feature Narrative');
    },

    'testDesignComponents.updateSelectedFeatureNarrative'(newText, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;
        const mode = ViewMode.MODE_EDIT;

        const userContext = TestDataHelpers.getUserContext(userName);

        if(userContext.designComponentId === 'NONE'){
            throw new Meteor.Error("FAIL", "No Feature is currently selected for user " + userName);
        }

        const newRawText = DesignComponentModules.getRawTextFor(newText);

        const outcome = ClientDesignComponentServices.updateFeatureNarrative(view, mode, userContext.designComponentId, newText, newRawText);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Update Selected Feature Narrative');
    },

    'testDesignComponents.removeComponent'(componentType, parentName, componentName, userName, mode, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;

        const userContext = TestDataHelpers.getUserContext(userName);
        const designComponent = TestDataHelpers.getDesignComponentWithParent(userContext.designVersionId, componentType, parentName, componentName);

        const outcome = ClientDesignComponentServices.removeDesignComponent(view, mode, designComponent, userContext);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Remove Component');
    },

    'testDesignComponents.removeSelectedComponent'(userName, mode, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;

        const userContext = TestDataHelpers.getUserContext(userName);
        const designComponent =  DesignComponents.findOne({_id: userContext.designComponentId});

        const outcome = ClientDesignComponentServices.removeDesignComponent(view, mode, designComponent, userContext);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Remove Selected Component');
    },


    'testDesignComponents.moveSelectedComponent'(targetType, targetParentName, targetName,  userName, mode, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        // Assume view and context is correct
        const view = ViewType.DESIGN_NEW_EDIT;
        const displayContext = DisplayContext.BASE_EDIT;
        // Component MUST be selected first
        const userContext = TestDataHelpers.getUserContext(userName);

        const movingComponent = DesignComponents.findOne({_id: userContext.designComponentId});
        const newParentComponent = TestDataHelpers.getDesignComponentWithParent(userContext.designVersionId, targetType, targetParentName, targetName);

        const outcome = ClientDesignComponentServices.moveDesignComponent(view, mode, displayContext, movingComponent._id, newParentComponent._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Move Component');
    },

    'testDesignComponents.reorderSelectedComponent'(targetType, targetParentName, targetName, userName, mode, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        // Assume view and context is correct
        const view = ViewType.DESIGN_NEW_EDIT;
        const displayContext = DisplayContext.BASE_EDIT;
        // Component MUST be selected first
        const userContext = TestDataHelpers.getUserContext(userName);


        const movingComponent = DesignComponents.findOne({_id: userContext.designComponentId});
        const targetComponent = TestDataHelpers.getDesignComponentWithParent(userContext.designVersionId, targetType, targetParentName, targetName);

        const outcome = ClientDesignComponentServices.reorderDesignComponent(view, mode, displayContext, movingComponent._id, targetComponent._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Reorder Component');
    },

});
