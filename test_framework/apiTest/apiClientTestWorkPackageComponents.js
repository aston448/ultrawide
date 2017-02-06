import { Meteor } from 'meteor/meteor';

import { WorkPackages }             from '../../imports/collections/work/work_packages.js';

import {RoleType, ViewType, ViewMode, DisplayContext, ComponentType} from '../../imports/constants/constants.js';
import ClientWorkPackageComponentServices   from '../../imports/apiClient/apiClientWorkPackageComponent.js';
import ClientDesignComponentServices        from '../../imports/apiClient/apiClientDesignComponent.js';
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

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'WP Component In Scope');
    },

    'testWorkPackageComponents.toggleInitialWpComponentOutScope'(componentType, componentParentName, componentName, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const view = ViewType.WORK_PACKAGE_BASE_EDIT;
        const displayContext = DisplayContext.WP_SCOPE;

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        const outcome = ClientWorkPackageComponentServices.toggleInScope(view, displayContext, workPackageComponent._id, false);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'WP Component Out Scope');
    },

    'testWorkPackageComponents.toggleUpdateWpComponentInScope'(componentType, componentParentName, componentName, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const view = ViewType.WORK_PACKAGE_UPDATE_EDIT;
        const displayContext = DisplayContext.WP_SCOPE;

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        const outcome = ClientWorkPackageComponentServices.toggleInScope(view, displayContext, workPackageComponent._id, true);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Upd WP Component In Scope');
    },

    'testWorkPackageComponents.toggleUpdateWpComponentOutScope'(componentType, componentParentName, componentName, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const view = ViewType.WORK_PACKAGE_UPDATE_EDIT;
        const displayContext = DisplayContext.WP_SCOPE;

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        const outcome = ClientWorkPackageComponentServices.toggleInScope(view, displayContext, workPackageComponent._id, false);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Upd WP Component Out Scope');
    },

    'testWorkPackageComponents.selectWorkPackageComponent'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        let displayContext = DisplayContext.WP_SCOPE;

        let designComponent = null;
        if(userContext.designUpdateId === 'NONE'){
            // Get Design Component
            designComponent = TestDataHelpers.getDesignComponentWithParent(userContext.designVersionId, componentType, componentParentName, componentName);
        } else {
            // Get Design Update Component
            designComponent = TestDataHelpers.getDesignUpdateComponentWithParent(userContext.designVersionId, userContext.designUpdateId, componentType, componentParentName, componentName);
        }

        ClientDesignComponentServices.setDesignComponent(designComponent._id, userContext, displayContext)
    }

});

