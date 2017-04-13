import { Meteor } from 'meteor/meteor';

import { DesignVersionComponents }         from '../../imports/collections/design/design_version_components.js';
import { DesignUpdateComponents }   from '../../imports/collections/design_update/design_update_components.js';
import { WorkPackages }             from '../../imports/collections/work/work_packages.js';
import { WorkPackageComponents }    from '../../imports/collections/work/work_package_components.js';

import {RoleType, ViewType, ViewMode, DisplayContext, ComponentType, WorkPackageType, WorkPackageScopeType, UpdateScopeType} from '../../imports/constants/constants.js';
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

    'verifyWorkPackageComponents.componentExistsInCurrentWpScopeCalled'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});

        let scopeComponent = null;

        // This call will actually verify the component exists and return error if not
        if(workPackage.workPackageType === WorkPackageType.WP_BASE){
            scopeComponent = TestDataHelpers.getDesignComponentWithParent(userContext.designVersionId, componentType, componentParentName, componentName);
        } else {
            scopeComponent = TestDataHelpers.getDesignUpdateComponentWithParent(userContext.designVersionId, userContext.designUpdateId, componentType, componentParentName, componentName)
        }

        if (workPackage.workPackageType === WorkPackageType.WP_UPDATE) {
            if(scopeComponent.scopeType === UpdateScopeType.SCOPE_IN_SCOPE || scopeComponent.scopeType === UpdateScopeType.SCOPE_PARENT_SCOPE){
                return true;
            } else {
                throw new Meteor.Error("FAIL", "Expecting WP Component " + componentParentName + " - " + componentName + " to be in WP scope");
            }
        }
        return true;
    },

    'verifyWorkPackageComponents.componentDoesNotExistInCurrentWpScopeCalled'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});

        let scopeComponent = null;

        // This call will actually verify the component exists and return error if not
        try {
            if (workPackage.workPackageType === WorkPackageType.WP_BASE) {
                scopeComponent = TestDataHelpers.getDesignComponentWithParent(userContext.designVersionId, componentType, componentParentName, componentName);
            } else {
                scopeComponent = TestDataHelpers.getDesignUpdateComponentWithParent(userContext.designVersionId, userContext.designUpdateId, componentType, componentParentName, componentName)
            }
        } catch(e) {
            // Expecting an error
            return true
        }

        // If we did get a return for Update WP because of Peer components check it is in scope
        if (workPackage.workPackageType === WorkPackageType.WP_UPDATE) {
            if(scopeComponent.scopeType === UpdateScopeType.SCOPE_IN_SCOPE || scopeComponent.scopeType === UpdateScopeType.SCOPE_PARENT_SCOPE){
                throw new Meteor.Error("FAIL", "Expecting WP Component " + componentParentName + " - " + componentName + " not to exist in WP scope but it does");
            } else {
                return true;
            }
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

        if(workPackageComponent.scopeType === WorkPackageScopeType.SCOPE_ACTIVE){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Work Package Component " + componentName + " with parent: " + componentParentName + " is not Active in Scope");
        }
    },

    'verifyWorkPackageComponents.currentWpComponentIsInScope'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        if(workPackageComponent.scopeType === WorkPackageScopeType.SCOPE_ACTIVE){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Work Package Component " + componentName + " with parent: " + componentParentName + " is not Active in Scope");
        }
    },

    'verifyWorkPackageComponents.componentIsInParentScope'(workPackageName, componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        if(workPackageComponent.scopeType === WorkPackageScopeType.SCOPE_PARENT){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Work Package Component " + componentName + " with parent: " + componentParentName + " is not in Parent Scope");
        }
    },

    'verifyWorkPackageComponents.currentWpComponentIsInParentScope'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);

        if(workPackageComponent.scopeType === WorkPackageScopeType.SCOPE_PARENT){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Work Package Component " + componentName + " with parent: " + componentParentName + " is not in Parent Scope");
        }
    },

    'verifyWorkPackageComponents.componentIsNotInScope'(workPackageName, componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = TestDataHelpers.getWorkPackage(userContext.designVersionId, userContext.designUpdateId, workPackageName);

        let  workPackageComponent = null;

        // Expecting WP Component not to exist
        try {
            workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);
        } catch(e){
            return true
        }

        // Error if it did exist and in scope
        if(workPackageComponent && (workPackageComponent.scopeType === WorkPackageScopeType.SCOPE_PARENT || workPackageComponent.scopeType === WorkPackageScopeType.SCOPE_ACTIVE)){
            throw new Meteor.Error("FAIL", "Work Package Component " + componentName + " with parent: " + componentParentName + " is in Scope!");
        } else {
            return true;
        }
    },

    'verifyWorkPackageComponents.currentWpComponentIsNotInScope'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});

        let  workPackageComponent = null;

        // Expecting WP Component not to exist
        try {
            workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);
        } catch(e){
            return true
        }

        // Error if it did exist and in scope
        if(workPackageComponent && (workPackageComponent.scopeType === WorkPackageScopeType.SCOPE_PARENT || workPackageComponent.scopeType === WorkPackageScopeType.SCOPE_ACTIVE)){
            throw new Meteor.Error("FAIL", "Work Package Component " + componentName + " with parent: " + componentParentName + " is in Scope!");
        } else {
            return true;
        }
    },

    'verifyWorkPackageComponents.currentWpComponentIsInScopeElsewhere'(componentType, componentParentName, componentName, userName){

        if(componentType !== ComponentType.SCENARIO){
            throw new Meteor.Error("FAIL", "This test is only expected to apply to Scenarios");
        }

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});

        let designComponent = null;

        if(workPackage.workPackageType === WorkPackageType.WP_BASE){
            designComponent = TestDataHelpers.getDesignComponentWithParent(userContext.designVersionId, componentType, componentParentName, componentName);
        } else {
            designComponent = TestDataHelpers.getDesignUpdateComponentWithParent(userContext.designVersionId, userContext.designUpdateId, componentType, componentParentName, componentName)
        }

        if((designComponent.workPackageId !== 'NONE') && (designComponent.workPackageId !== userContext.workPackageId)){
            return true;
        }else {
            throw new Meteor.Error("FAIL", "Work Package Scenario " + componentName + " with parent: " + componentParentName + " was expected to be in scope elswhere");
        }
    },

    'verifyWorkPackageComponents.currentWpComponentIsNotScopable'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});

        let designComponent = null;

        if(workPackage.workPackageType === WorkPackageType.WP_BASE){
            throw new Meteor.Error("FAIL", "This test is only expected to apply to Update WPs");
        } else {
            try {
                designComponent = TestDataHelpers.getDesignUpdateComponentWithParent(userContext.designVersionId, userContext.designUpdateId, componentType, componentParentName, componentName);
            } catch (error){
                // Expecting error outcome - means component is not scopable because its not there!
                designComponent = null;
            }
        }

        // If not scopable then not in Update or is in as peer scope
        if(!designComponent || (designComponent.scopeType === UpdateScopeType.SCOPE_PEER_SCOPE)){
            return true;
        }else {
            throw new Meteor.Error("FAIL", "Work Package component " + componentName + " with parent: " + componentParentName + " was expected not to have an in-scope update item");
        }
    },

    'verifyWorkPackageComponents.currentWpComponentIsRemoved'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);
        let designUpdateComponent = null;

        if(workPackageComponent){
            designUpdateComponent = DesignUpdateComponents.findOne({_id: workPackageComponent.componentId});
            if(designUpdateComponent.isRemoved){
                return true;
            } else {
                throw new Meteor.Error("FAIL", "Work Package Component " + componentName + " with parent: " + componentParentName + " is not removed");
            }
        }
    },

    'verifyWorkPackageComponents.currentWpComponentIsNotRemoved'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});
        const workPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, componentType, componentParentName, componentName);
        let designUpdateComponent = null;

        if(workPackageComponent){
            designUpdateComponent = DesignUpdateComponents.findOne({_id: workPackageComponent.componentId});
            if(designUpdateComponent.isRemoved){
                throw new Meteor.Error("FAIL", "Work Package Component " + componentName + " with parent: " + componentParentName + " is removed");
            } else {
                return true;
            }
        }
    },

    'verifyWorkPackageComponents.currentWpComponentIsAboveComponent'(targetType, targetParentName, targetName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});
        const targetWorkPackageComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, workPackage._id, targetType, targetParentName, targetName);
        let movingWorkPackageDesignComponent = null;
        if(userContext.designUpdateId === 'NONE'){
            // Get Design Component
            movingWorkPackageDesignComponent = DesignVersionComponents.findOne({_id: userContext.designComponentId});
        } else {
            // Get Design Update Component
            movingWorkPackageDesignComponent = DesignUpdateComponents.findOne({_id: userContext.designComponentId});
        }
        const movingWorkPackageComponent = WorkPackageComponents.findOne({
            designVersionId: userContext.designVersionId,
            workPackageId: userContext.workPackageId,
            componentReferenceId: movingWorkPackageDesignComponent.componentReferenceId
        });

        if(movingWorkPackageComponent.componentIndexNew >= targetWorkPackageComponent.componentIndexNew){
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
            currentDesignComponent = DesignVersionComponents.findOne({_id: userContext.designComponentId});
            if(currentDesignComponent){
                featureNarrative = currentDesignComponent.componentNarrativeNew;
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
                if(designComponent.componentNameNew != componentName){
                    throw new Meteor.Error("FAIL", 'Expected component name to be ' + componentName + ' but got ' + designComponent.componentNameNew);
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
