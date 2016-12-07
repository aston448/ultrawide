import { Meteor } from 'meteor/meteor';

import { WorkPackages }             from '../../imports/collections/work/work_packages.js';

import {RoleType, ViewType, ViewMode, DisplayContext, ComponentType} from '../../imports/constants/constants.js';
import ClientWorkPackageComponentServices   from '../../imports/apiClient/apiClientWorkPackageComponent.js';
import TestDataHelpers                      from '../test_modules/test_data_helpers.js'

Meteor.methods({

    'testWorkPackageComponents.toggleInitialWpComponentInScope'(workPackageName, componentType, componentParentName, componentName, userName){

        const view = ViewType.WORK_PACKAGE_BASE_EDIT;
        const displayContext = DisplayContext.WP_SCOPE;

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        ClientWorkPackageComponentServices.toggleInScope(view, displayContext, workPackageComponent._id, true);

        return true;
    },

    'testWorkPackageComponents.toggleInitialWpComponentOutScope'(workPackageName, componentType, componentParentName, componentName, userName){

        const view = ViewType.WORK_PACKAGE_BASE_EDIT;
        const displayContext = DisplayContext.WP_SCOPE;

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        ClientWorkPackageComponentServices.toggleInScope(view, displayContext, workPackageComponent._id, false);

        return true;
    },

    'testWorkPackageComponents.toggleUpdateWpComponentInScope'(workPackageName, componentType, componentParentName, componentName, userName){

        const view = ViewType.WORK_PACKAGE_UPDATE_EDIT;
        const displayContext = DisplayContext.WP_SCOPE;

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        ClientWorkPackageComponentServices.toggleInScope(view, displayContext, workPackageComponent._id, true);

        return true;
    },

    'testWorkPackageComponents.toggleUpdateWpComponentOutScope'(workPackageName, componentType, componentParentName, componentName, userName){

        const view = ViewType.WORK_PACKAGE_UPDATE_EDIT;
        const displayContext = DisplayContext.WP_SCOPE;

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        ClientWorkPackageComponentServices.toggleInScope(view, displayContext, workPackageComponent._id, false);

        return true;
    },

});

