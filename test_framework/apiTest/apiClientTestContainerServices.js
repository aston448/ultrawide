import { Meteor } from 'meteor/meteor';

import { Designs }                  from '../../imports/collections/design/designs.js';
import { DesignComponents }         from '../../imports/collections/design/design_components.js';
import { UserCurrentEditContext }   from '../../imports/collections/context/user_current_edit_context.js';
import { UserRoles }                from '../../imports/collections/users/user_roles.js';

import ClientContainerServices          from '../../imports/apiClient/apiClientContainerServices.js';
import ClientTextEditorServices         from '../../imports/apiClient/apiClientTextEditor.js';
import DesignComponentModules           from '../../imports/service_modules/design/design_component_service_modules.js';
import TestDataHelpers                  from '../test_modules/test_data_helpers.js'

import {RoleType, ViewType, ViewMode, DisplayContext, ComponentType} from '../../imports/constants/constants.js';

Meteor.methods({

    'testContainerServices.getAndValidateChildComponentsForParent'(componentType, parentName, componentName, userName, view, displayContext, testCase, expectedComponentName = 'NONE'){

        const userContext = TestDataHelpers.getUserContext(userName);

        const component = TestDataHelpers.getDesignComponentWithParent(
            userContext.designVersionId,
            componentType,
            parentName,
            componentName
        );

        const data = ClientContainerServices.getComponentDataForParentComponent(componentType, view, userContext.designVersionId, userContext.designUpdateId, userContext.workPackageId, component._id, displayContext);


        switch(testCase){
            case 'VALIDATE_NO_COMPONENT_RETURNED':

                if(data.components.length > 0){
                    throw new Meteor.Error("FAIL", "Expecting no components to be returned");
                }
                break;

            case 'VALIDATE_COMPONENT_RETURNED':

                if(data.components.length > 0){
                    let found = false;
                    data.components.forEach((component) => {

                        if(userContext.designUpdateId === 'NONE'){
                            if(component.componentName === expectedComponentName){
                                found = true;
                            }
                        } else {
                            if(component.componentNameNew === expectedComponentName){
                                found = true;
                            }
                        }
                    });

                    if(!found){
                        throw new Meteor.Error("FAIL", "Component " + expectedComponentName + " was not returned");
                    }

                } else {
                    throw new Meteor.Error("FAIL", "No components were returned");
                }
                break;
            default:
                throw new Meteor.Error("FAIL", "No test case defined");
        }
    },

});
