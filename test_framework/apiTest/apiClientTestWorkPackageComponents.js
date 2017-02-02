import { Meteor } from 'meteor/meteor';

import { WorkPackages }             from '../../imports/collections/work/work_packages.js';

import {RoleType, ViewType, ViewMode, DisplayContext, ComponentType} from '../../imports/constants/constants.js';
import ClientWorkPackageComponentServices   from '../../imports/apiClient/apiClientWorkPackageComponent.js';
import TestDataHelpers                      from '../test_modules/test_data_helpers.js'

Meteor.methods({

    'testWorkPackageComponents.toggleInitialWpComponentInScope'(componentType, componentParentName, componentName, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const view = ViewType.WORK_PACKAGE_BASE_EDIT;
        const displayContext = DisplayContext.WP_SCOPE;

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        const outcome = ClientWorkPackageComponentServices.toggleInScope(view, displayContext, workPackageComponent._id, true);

        TestDataHelpers.processClientCallOutcome(outcome, expectation);
    },

    'testWorkPackageComponents.toggleInitialWpComponentOutScope'(componentType, componentParentName, componentName, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const view = ViewType.WORK_PACKAGE_BASE_EDIT;
        const displayContext = DisplayContext.WP_SCOPE;

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        const outcome = ClientWorkPackageComponentServices.toggleInScope(view, displayContext, workPackageComponent._id, false);

        TestDataHelpers.processClientCallOutcome(outcome, expectation);
    },

    'testWorkPackageComponents.toggleUpdateWpComponentInScope'(componentType, componentParentName, componentName, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const view = ViewType.WORK_PACKAGE_UPDATE_EDIT;
        const displayContext = DisplayContext.WP_SCOPE;

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        const outcome = ClientWorkPackageComponentServices.toggleInScope(view, displayContext, workPackageComponent._id, true);

        TestDataHelpers.processClientCallOutcome(outcome, expectation);
    },

    'testWorkPackageComponents.toggleUpdateWpComponentOutScope'(componentType, componentParentName, componentName, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const view = ViewType.WORK_PACKAGE_UPDATE_EDIT;
        const displayContext = DisplayContext.WP_SCOPE;

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        const outcome = ClientWorkPackageComponentServices.toggleInScope(view, displayContext, workPackageComponent._id, false);

        TestDataHelpers.processClientCallOutcome(outcome, expectation);
    },

});

