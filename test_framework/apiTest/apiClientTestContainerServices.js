import { Meteor } from 'meteor/meteor';

import ClientDataServices               from '../../imports/apiClient/apiClientDataServices.js';
import { TestDataHelpers }                  from '../test_modules/test_data_helpers.js'

import {RoleType, ViewType, ViewMode, DisplayContext, ComponentType} from '../../imports/constants/constants.js';

Meteor.methods({

    'testContainerServices.getAndValidateChildComponentsForParent'(parentType, parentParentName, parentName, componentType, componentName, userName, view, displayContext, testCase){

        const userContext = TestDataHelpers.getUserContext(userName);
        let component = null;

        // Get parent component
        if (userContext.designUpdateId === 'NONE') {
            component = TestDataHelpers.getDesignComponentWithParent(
                userContext.designVersionId,
                parentType,
                parentParentName,
                parentName
            );
        } else {
            component = TestDataHelpers.getDesignUpdateComponentWithParent(
                userContext.designVersionId,
                userContext.designUpdateId,
                parentType,
                parentParentName,
                parentName
            );
        }


        const data = ClientDataServices.getComponentDataForParentComponent(componentType, view, userContext.designVersionId, userContext.designUpdateId, userContext.workPackageId, component.componentReferenceId, displayContext);

        if(data) {
            switch (testCase) {
                case 'VALIDATE_NO_COMPONENT_RETURNED':

                    if (data.length > 0) {
                        throw new Meteor.Error("FAIL", "Expecting no " + componentType + " components to be returned");
                    }
                    break;

                case 'VALIDATE_COMPONENT_RETURNED':

                    if (data.length > 0) {
                        let found = false;
                        data.forEach((component) => {

                            if (userContext.designUpdateId === 'NONE') {
                                if (component.componentNameNew === componentName) {
                                    found = true;
                                }
                            } else {
                                if (component.componentNameNew === componentName) {
                                    found = true;
                                }
                            }
                        });

                        if (!found) {
                            throw new Meteor.Error("FAIL", "Component " + componentName + " was not returned");
                        }

                    } else {
                        throw new Meteor.Error("FAIL", "No " + componentType + " components were returned");
                    }
                    break;
                default:
                    throw new Meteor.Error("FAIL", "No test case defined");
            }
        } else {
            throw new Meteor.Error("FAIL", "No data found");
        }
    },

});
