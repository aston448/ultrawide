import { Meteor } from 'meteor/meteor';

import { WorkPackages }             from '../../imports/collections/work/work_packages.js';


import {RoleType, ViewType, ViewMode, DisplayContext, ComponentType, WorkPackageType} from '../../imports/constants/constants.js';
import ClientWorkPackageComponentServices   from '../../imports/apiClient/apiClientWorkPackageComponent.js';
import ClientDesignComponentServices        from '../../imports/apiClient/apiClientDesignComponent.js';
import ClientDesignUpdateComponentServices  from '../../imports/apiClient/apiClientDesignUpdateComponent.js';
import TestDataHelpers                      from '../test_modules/test_data_helpers.js'

Meteor.methods({

    'testWorkPackageComponents.toggleWpComponentInScope'(componentType, componentParentName, componentName, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        let view = '';
        const displayContext = DisplayContext.WP_SCOPE;
        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getContextWorkPackage(userContext.workPackageId);
        let designComponent = null;

        if(workPackage.workPackageType === WorkPackageType.WP_BASE){
            view = ViewType.WORK_PACKAGE_BASE_EDIT;
            designComponent = TestDataHelpers.getDesignComponentWithParent(userContext.designVersionId, componentType, componentParentName, componentName);
        } else {
            view = ViewType.WORK_PACKAGE_UPDATE_EDIT;
            designComponent =  TestDataHelpers.getDesignUpdateComponentWithParent(userContext.designVersionId, userContext.designUpdateId, componentType, componentParentName, componentName);
        }


        const outcome = ClientWorkPackageComponentServices.toggleInScope(view, displayContext, userContext, designComponent._id, true);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'WP Component In Scope for ' + componentName);
    },

    'testWorkPackageComponents.toggleWpComponentOutScope'(componentType, componentParentName, componentName, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        let view = '';
        const displayContext = DisplayContext.WP_SCOPE;
        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getContextWorkPackage(userContext.workPackageId);
        let designComponent = null;

        if(workPackage.workPackageType === WorkPackageType.WP_BASE){
            view = ViewType.WORK_PACKAGE_BASE_EDIT;
            designComponent = TestDataHelpers.getDesignComponentWithParent(userContext.designVersionId, componentType, componentParentName, componentName);
        } else {
            view = ViewType.WORK_PACKAGE_UPDATE_EDIT;
            designComponent =  TestDataHelpers.getDesignUpdateComponentWithParent(userContext.designVersionId, userContext.designUpdateId, componentType, componentParentName, componentName);
        }

        const outcome = ClientWorkPackageComponentServices.toggleInScope(view, displayContext, userContext, designComponent._id, false);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'WP Component Out Scope');
    },

    // 'testWorkPackageComponents.toggleUpdateWpComponentInScope'(componentType, componentParentName, componentName, userName, expectation){
    //
    //     expectation = TestDataHelpers.getExpectation(expectation);
    //
    //     const view = ViewType.WORK_PACKAGE_UPDATE_EDIT;
    //     const displayContext = DisplayContext.WP_SCOPE;
    //
    //     const userContext = TestDataHelpers.getUserContext(userName);
    //     const workPackage = TestDataHelpers.getContextWorkPackage(userContext.workPackageId);
    //
    //     const designUpdateComponent =  TestDataHelpers.getDesignUpdateComponentWithParent(userContext.designVersionId, userContext.designUpdateId, componentType, componentParentName, componentName);
    //
    //     const outcome = ClientWorkPackageComponentServices.toggleInScope(view, displayContext, userContext, designUpdateComponent._id, true);
    //
    //     TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Upd WP Component In Scope');
    // },
    //
    // 'testWorkPackageComponents.toggleUpdateWpComponentOutScope'(componentType, componentParentName, componentName, userName, expectation){
    //
    //     expectation = TestDataHelpers.getExpectation(expectation);
    //
    //     const view = ViewType.WORK_PACKAGE_UPDATE_EDIT;
    //     const displayContext = DisplayContext.WP_SCOPE;
    //
    //     const userContext = TestDataHelpers.getUserContext(userName);
    //     const workPackage = TestDataHelpers.getContextWorkPackage(userContext.workPackageId);
    //
    //     const designUpdateComponent =  TestDataHelpers.getDesignUpdateComponentWithParent(userContext.designVersionId, userContext.designUpdateId, componentType, componentParentName, componentName);
    //
    //     const outcome = ClientWorkPackageComponentServices.toggleInScope(view, displayContext, userContext, designUpdateComponent._id, false);
    //
    //     TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Upd WP Component Out Scope');
    // },

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
    },

    'testWorkPackageComponents.updateSelectedComponentName'(newName, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getContextWorkPackage(userContext.workPackageId);

        let view = '';
        let mode = ViewMode.MODE_EDIT;  // Assume we are in edit mode
        let outcome = null;
        const rawName = TestDataHelpers.getRawTextFor(newName);

        switch(workPackage.workPackageType){
            case WorkPackageType.WP_BASE:
                view = ViewType.DEVELOP_BASE_WP;
                outcome = ClientDesignComponentServices.updateComponentName(view, mode, userContext.designComponentId, newName, rawName);
                break;
            case WorkPackageType.WP_UPDATE:
                view = ViewType.DEVELOP_UPDATE_WP;
                const designUpdateComponent = TestDataHelpers.getContextDesignUpdateComponent(userContext.designComponentId);
                outcome = ClientDesignUpdateComponentServices.updateComponentName(view, mode, designUpdateComponent, newName, rawName);
                break;
        }

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'WP Update Component Name');
    },

    'testWorkPackageComponents.addNewScenarioToSelectedComponent'(userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getContextWorkPackage(userContext.workPackageId);

        let view = '';
        let mode = ViewMode.MODE_EDIT;  // Assume we are in edit mode
        let outcome = null;

        switch(workPackage.workPackageType){
            case WorkPackageType.WP_BASE:
                view = ViewType.DEVELOP_BASE_WP;
                const designComponent = TestDataHelpers.getContextDesignComponent(userContext.designComponentId);
                if(designComponent.componentType != ComponentType.FEATURE_ASPECT){
                    throw new Meteor.Error("FAIL", "Can only add Scenarios to Feature Aspects.  This is a " + designComponent.componentType);
                }
                outcome = ClientDesignComponentServices.addScenario(view, mode, designComponent, workPackage._id);
                break;
            case WorkPackageType.WP_UPDATE:
                view = ViewType.DEVELOP_UPDATE_WP;
                const designUpdateComponent = TestDataHelpers.getContextDesignUpdateComponent(userContext.designComponentId);
                if(designUpdateComponent.componentType != ComponentType.FEATURE_ASPECT){
                    throw new Meteor.Error("FAIL", "Can only add Scenarios to Feature Aspects.  This is a " + designUpdateComponent.componentType);
                }
                outcome = ClientDesignUpdateComponentServices.addScenario(view, mode, designUpdateComponent);
                break;
        }

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'WP Add Scenario');
    },

    'testWorkPackageComponents.addNewFeatureAspectToSelectedComponent'(userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getContextWorkPackage(userContext.workPackageId);

        let view = '';
        let mode = ViewMode.MODE_EDIT;  // Assume we are in edit mode
        let outcome = null;

        switch(workPackage.workPackageType){
            case WorkPackageType.WP_BASE:
                view = ViewType.DEVELOP_BASE_WP;
                const designComponent = TestDataHelpers.getContextDesignComponent(userContext.designComponentId);
                if(designComponent.componentType != ComponentType.FEATURE){
                    throw new Meteor.Error("FAIL", "Can only add Feature Aspects to Features.  This is a " + designComponent.componentType);
                }
                outcome = ClientDesignComponentServices.addFeatureAspectToFeature(view, mode, designComponent);
                break;
            case WorkPackageType.WP_UPDATE:
                view = ViewType.DEVELOP_UPDATE_WP;
                const designUpdateComponent = TestDataHelpers.getContextDesignUpdateComponent(userContext.designComponentId);
                if(designUpdateComponent.componentType != ComponentType.FEATURE){
                    throw new Meteor.Error("FAIL", "Can only add Feature Aspects to Features.  This is a " + designUpdateComponent.componentType);
                }
                outcome = ClientDesignUpdateComponentServices.addFeatureAspectToFeature(view, mode, designUpdateComponent);
                break;
        }

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'WP Add Feature Aspect');
    },

    'testWorkPackageComponents.addNewComponentToSelectedComponent'(componentType, userName, expectation){

        // Generic function for testing what should not be allowed...

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getContextWorkPackage(userContext.workPackageId);

        let view = '';
        let mode = ViewMode.MODE_EDIT;  // Assume we are in edit mode
        let outcome = null;

        switch(workPackage.workPackageType){
            case WorkPackageType.WP_BASE:
                view = ViewType.DEVELOP_BASE_WP;

                // Get parent component - if not adding App
                let designComponent = null;
                if(componentType != ComponentType.APPLICATION) {
                    designComponent = TestDataHelpers.getContextDesignComponent(userContext.designComponentId);
                }

                switch(componentType){
                    case ComponentType.APPLICATION:
                        outcome = ClientDesignComponentServices.addApplicationToDesignVersion(view, mode, userContext.designVersionId)
                        break;
                    case ComponentType.DESIGN_SECTION:
                        if(designComponent.componentType === ComponentType.APPLICATION) {
                            outcome = ClientDesignComponentServices.addDesignSectionToApplication(view, mode, designComponent)
                        } else {
                            outcome = ClientDesignComponentServices.addSectionToDesignSection(view, mode, designComponent)
                        }
                        break;
                    case ComponentType.FEATURE:
                        outcome = ClientDesignComponentServices.addFeatureToDesignSection(view, mode, designComponent);
                        break;
                }

                break;
            case WorkPackageType.WP_UPDATE:
                view = ViewType.DEVELOP_UPDATE_WP;
                // Get parent component - if not adding App
                let designUpdateComponent = null;
                if(componentType != ComponentType.APPLICATION) {
                    designUpdateComponent = TestDataHelpers.getContextDesignUpdateComponent(userContext.designComponentId);
                }

                switch(componentType){
                    case ComponentType.APPLICATION:
                        outcome = ClientDesignUpdateComponentServices.addApplicationToDesignVersion(view, mode, userContext.designVersionId, userContext.designUpdateId);
                        break;
                    case ComponentType.DESIGN_SECTION:
                        if(designUpdateComponent.componentType === ComponentType.APPLICATION) {
                            outcome = ClientDesignUpdateComponentServices.addDesignSectionToApplication(view, mode, designUpdateComponent)
                        } else {
                            outcome = ClientDesignUpdateComponentServices.addSectionToDesignSection(view, mode, designUpdateComponent)
                        }
                        break;
                    case ComponentType.FEATURE:
                        outcome = ClientDesignUpdateComponentServices.addFeatureToDesignSection(view, mode, designUpdateComponent);
                        break;
                }
                break;
        }

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'WP Add Component');
    },

    'testWorkPackageComponents.removeSelectedComponent'(componentType, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getContextWorkPackage(userContext.workPackageId);

        let view = '';
        let mode = ViewMode.MODE_EDIT;  // Assume we are in edit mode
        let outcome = null;

        switch(workPackage.workPackageType){
            case WorkPackageType.WP_BASE:
                view = ViewType.DEVELOP_BASE_WP;
                const designComponent = TestDataHelpers.getContextDesignComponent(userContext.designComponentId);
                if(designComponent.componentType != componentType){
                    throw new Meteor.Error("FAIL", "Expecting " + componentType + " to be selected.  This is a " + designComponent.componentType);
                }
                outcome = ClientDesignComponentServices.removeDesignComponent(view, mode, designComponent, userContext);
                break;
            case WorkPackageType.WP_UPDATE:
                view = ViewType.DEVELOP_UPDATE_WP;
                const designUpdateComponent = TestDataHelpers.getContextDesignUpdateComponent(userContext.designComponentId);
                if(designUpdateComponent.componentType != componentType){
                    throw new Meteor.Error("FAIL", "Expecting " + componentType + " to be selected.  This is a " + designUpdateComponent.componentType);
                }
                outcome = ClientDesignUpdateComponentServices.removeComponent(view, mode, designUpdateComponent);
                break;
        }

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'WP Add Scenario');
    },

});

