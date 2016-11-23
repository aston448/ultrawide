import { Meteor } from 'meteor/meteor';

import { Designs }                  from '../../imports/collections/design/designs.js';
import { DesignComponents }         from '../../imports/collections/design/design_components.js';
import { UserCurrentEditContext }   from '../../imports/collections/context/user_current_edit_context.js';
import { UserRoles }                from '../../imports/collections/users/user_roles.js';

import ClientDesignComponentServices    from '../../imports/apiClient/apiClientDesignComponent.js';
import DesignComponentModules           from '../../imports/service_modules/design/design_component_service_modules.js';

import {RoleType, ViewType, ViewMode, ComponentType} from '../../imports/constants/constants.js';

Meteor.methods({

    'testDesignComponents.addApplication'(userName){

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;
        const mode = ViewMode.MODE_EDIT;

        // Get user's Design Version Id as the one being worked on
        const user = UserRoles.findOne({userName: userName});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});

        ClientDesignComponentServices.addApplicationToDesignVersion(view, mode, userContext.designVersionId);

    },

    'testDesignComponents.addApplicationInMode'(userName, mode){

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;

        // Get user's Design Version Id as the one being worked on
        const user = UserRoles.findOne({userName: userName});
        const userContext = UserCurrentEditContext.findOne({userId: user.userId});

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

        ClientDesignComponentServices.addScenario(view, mode, featureComponent);

    },


    'testDesignComponents.updateComponentName'(componentType, oldName, newName){

        // Assume view is correct
        const view = ViewType.DESIGN_NEW_EDIT;
        const mode = ViewMode.MODE_EDIT;

        const component = DesignComponents.findOne({componentType: componentType, componentName: oldName});
        const rawName = DesignComponentModules.getRawTextFor(newName);

        ClientDesignComponentServices.updateComponentName(view, mode, component._id, newName, rawName)

    },

});
