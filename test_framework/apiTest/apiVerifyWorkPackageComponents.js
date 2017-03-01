import { Meteor } from 'meteor/meteor';

import { DesignComponents }         from '../../imports/collections/design/design_components.js';
import { DesignUpdateComponents }   from '../../imports/collections/design_update/design_update_components.js';
import { WorkPackages }             from '../../imports/collections/work/work_packages.js';
import { WorkPackageComponents }    from '../../imports/collections/work/work_package_components.js';

import {RoleType, ViewType, ViewMode, DisplayContext, ComponentType, WorkPackageType} from '../../imports/constants/constants.js';
import TestDataHelpers              from '../test_modules/test_data_helpers.js'

Meteor.methods({

    'verifyWorkPackageComponents.componentExistsCalled'(workPackageName, componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);

        // This call will actually verify the component exists and return error if not
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        return true;
    },

    'verifyWorkPackageComponents.componentExistsInCurrentWpCalled'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});

        // This call will actually verify the component exists and return error if not
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        return true;
    },

    'verifyWorkPackageComponents.componentDoesNotExistInCurrentWpCalled'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});

        // This call will actually verify the component exists but we are telling it to expect a failure so it returns true if failing
        const result = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName, true);

        if(!result){
            throw new Meteor.Error("FAIL", "Expecting WP Component " + componentParentName + " - " + componentName + " not to exist but it does");
        }
    },

    'verifyWorkPackageComponents.componentParentIs'(workPackageName, componentType, componentName, parentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);
        const actualParentName = TestDataHelpers.getWorkPackageComponentParentName(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentName);

        if(actualParentName === parentName){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Work Package Component parent is: " + actualParentName + " expected: " + parentName);
        }
    },

    'verifyWorkPackageComponents.componentIsInScope'(workPackageName, componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        if(workPackageComponent.componentActive){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Work Package Component " + componentName + " with parent: " + componentParentName + " is not Active in Scope");
        }
    },

    'verifyWorkPackageComponents.currentWpComponentIsInScope'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        if(workPackageComponent.componentActive){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Work Package Component " + componentName + " with parent: " + componentParentName + " is not Active in Scope");
        }
    },

    'verifyWorkPackageComponents.componentIsInParentScope'(workPackageName, componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        if(workPackageComponent.componentParent){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Work Package Component " + componentName + " with parent: " + componentParentName + " is not in Parent Scope");
        }
    },

    'verifyWorkPackageComponents.currentWpComponentIsInParentScope'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        if(workPackageComponent.componentParent){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Work Package Component " + componentName + " with parent: " + componentParentName + " is not in Parent Scope");
        }
    },

    'verifyWorkPackageComponents.componentIsNotInScope'(workPackageName, componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        if(workPackageComponent.componentParent || workPackageComponent.componentActive){
            throw new Meteor.Error("FAIL", "Work Package Component " + componentName + " with parent: " + componentParentName + " is in Scope!");
        } else {
            return true;
        }
    },

    'verifyWorkPackageComponents.currentWpComponentIsNotInScope'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        if(workPackageComponent.componentParent || workPackageComponent.componentActive){
            throw new Meteor.Error("FAIL", "Work Package Component " + componentName + " with parent: " + componentParentName + " is in Scope!");
        } else {
            return true;
        }
    },

    'verifyWorkPackageComponents.currentWpComponentIsAboveComponent'(targetType, targetParentName, targetName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});
        const targetWorkPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, targetType, targetParentName, targetName);
        let movingWorkPackageDesignComponent = null;
        if(userContext.designUpdateId === 'NONE'){
            // Get Design Component
            movingWorkPackageDesignComponent = DesignComponents.findOne({_id: userContext.designComponentId});
        } else {
            // Get Design Update Component
            movingWorkPackageDesignComponent = DesignUpdateComponents.findOne({_id: userContext.designComponentId});
        }
        const movingWorkPackageComponent = WorkPackageComponents.findOne({
            designVersionId: userContext.designVersionId,
            workPackageId: userContext.workPackageId,
            componentReferenceId: movingWorkPackageDesignComponent.componentReferenceId
        });

        if(movingWorkPackageComponent.componentIndex >= targetWorkPackageComponent.componentIndex){
            throw new Meteor.Error("FAIL", "Expected component " + movingWorkPackageDesignComponent._id + " to be above component " + targetWorkPackageComponent._id + " in the list of " + targetType +"s");
        } else {
            return true;
        }
    },


    'verifyWorkPackageComponents.currentWpFeatureNarrativeIs'(narrativeText, userName){
        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});
        let currentDesignComponent = null;
        let featureNarrative = '';
        if(userContext.designUpdateId === 'NONE'){
            // Get Design Component
            currentDesignComponent = DesignComponents.findOne({_id: userContext.designComponentId});
            if(currentDesignComponent){
                featureNarrative = currentDesignComponent.componentNarrative;
            } else {
                throw new Meteor.Error("FAIL", 'No component is currently selected');
            }
        } else {
            // Get Design Update Component
            currentDesignComponent = DesignUpdateComponents.findOne({_id: userContext.designComponentId});
            if(currentDesignComponent){
                featureNarrative = currentDesignComponent.componentNarrativeNew;
            } else {
                throw new Meteor.Error("FAIL", 'No component is currently selected');
            }
        }

        if(featureNarrative.trim() != narrativeText.trim()){
            throw new Meteor.Error("FAIL", 'Expected narrative to be ' + narrativeText + ' but got ' + featureNarrative);
        } else {
            return true;
        }

    },

    'verifyWorkPackageComponents.currentComponentNameIs'(componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getContextWorkPackage(userContext.workPackageId);

        switch(workPackage.workPackageType){
            case WorkPackageType.WP_BASE:

                const designComponent = TestDataHelpers.getContextDesignComponent(userContext.designComponentId);
                if(designComponent.componentName != componentName){
                    throw new Meteor.Error("FAIL", 'Expected component name to be ' + componentName + ' but got ' + designComponent.componentName);
                }
                break;
            case WorkPackageType.WP_UPDATE:

                const designUpdateComponent = TestDataHelpers.getContextDesignUpdateComponent(userContext.designComponentId);
                if(designUpdateComponent.componentNameNew != componentName){
                    throw new Meteor.Error("FAIL", 'Expected update component name to be ' + componentName + ' but got ' + designUpdateComponent.componentNameNew);
                }
                break;
        }
    }

});
