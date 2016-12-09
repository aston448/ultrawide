import { Meteor } from 'meteor/meteor';

import ClientDesignUpdateComponentServices      from '../../imports/apiClient/apiClientDesignUpdateComponent.js';
import TestDataHelpers                          from '../test_modules/test_data_helpers.js'

import {RoleType, ViewType, ViewMode, DisplayContext, ComponentType} from '../../imports/constants/constants.js';

Meteor.methods({

    'testDesignUpdateComponents.addComponentToUpdateScope'(componentType, componentParentName, componentName, mode, userName){

        const view = ViewType.DESIGN_UPDATE_EDIT;
        const displayContext = DisplayContext.UPDATE_SCOPE;

        const userContext = TestDataHelpers.getUserContext(userName);

        const designUpdateComponent = TestDataHelpers.getDesignUpdateComponentWithParent(userContext.designVersionId, userContext.designUpdateId, componentType, componentParentName, componentName);

        ClientDesignUpdateComponentServices.toggleInScope(view, mode, displayContext, designUpdateComponent, true)
    },

    'testDesignUpdateComponents.removeComponentFromUpdateScope'(componentType, componentParentName, componentName, mode, userName){

        const view = ViewType.DESIGN_UPDATE_EDIT;
        const displayContext = DisplayContext.UPDATE_SCOPE;

        const userContext = TestDataHelpers.getUserContext(userName);

        const designUpdateComponent = TestDataHelpers.getDesignUpdateComponentWithParent(userContext.designVersionId, userContext.designUpdateId, componentType, componentParentName, componentName);

        ClientDesignUpdateComponentServices.toggleInScope(view, mode, displayContext, designUpdateComponent, false)
    },


});
