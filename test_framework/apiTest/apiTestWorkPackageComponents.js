import { Meteor } from 'meteor/meteor';

import { WorkPackages }             from '../../imports/collections/work/work_packages.js';

import {RoleType, ViewType, ViewMode, DisplayContext, ComponentType} from '../../imports/constants/constants.js';
import ClientWorkPackageComponentServices   from '../../imports/apiClient/apiClientWorkPackageComponent.js';
import TestDataHelpers                      from '../test_modules/test_data_helpers.js'

Meteor.methods({

    'testWorkPackageComponents.toggleInitialWpComponentInScope'(componentType, componentParentName, componentName, userName){

        const view = ViewType.WORK_PACKAGE_BASE_EDIT;
        const displayContext = DisplayContext.WP_SCOPE;

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        ClientWorkPackageComponentServices.toggleInScope(view, displayContext, workPackageComponent._id, true);

        return true;
    },

    'testWorkPackageComponents.toggleInitialWpComponentOutScope'(componentType, componentParentName, componentName, userName){

        const view = ViewType.WORK_PACKAGE_BASE_EDIT;
        const displayContext = DisplayContext.WP_SCOPE;

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        ClientWorkPackageComponentServices.toggleInScope(view, displayContext, workPackageComponent._id, false);

        return true;
    },

    'testWorkPackageComponents.toggleUpdateWpComponentInScope'(componentType, componentParentName, componentName, userName){

        const view = ViewType.WORK_PACKAGE_UPDATE_EDIT;
        const displayContext = DisplayContext.WP_SCOPE;

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        ClientWorkPackageComponentServices.toggleInScope(view, displayContext, workPackageComponent._id, true);

        return true;
    },

    'testWorkPackageComponents.toggleUpdateWpComponentOutScope'(componentType, componentParentName, componentName, userName){

        const view = ViewType.WORK_PACKAGE_UPDATE_EDIT;
        const displayContext = DisplayContext.WP_SCOPE;

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        ClientWorkPackageComponentServices.toggleInScope(view, displayContext, workPackageComponent._id, false);

        return true;
    },

});

