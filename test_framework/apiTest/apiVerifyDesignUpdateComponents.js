import { Meteor } from 'meteor/meteor';

import { Designs }                  from '../../imports/collections/design/designs.js'
import { DesignUpdates }           from '../../imports/collections/design_update/design_updates.js'
import { DesignUpdateComponents }         from '../../imports/collections/design_update/design_update_components.js';
import { DefaultItemNames, DefaultComponentNames }         from '../../imports/constants/default_names.js';
import { ComponentType }            from '../../imports/constants/constants.js';

import TestDataHelpers              from '../test_modules/test_data_helpers.js'

Meteor.methods({


    'verifyDesignUpdateComponents.componentExistsInDesignUpdateCalled'(componentType, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const designUpdateComponent = DesignUpdateComponents.findOne({
            designVersionId: userContext.designVersionId,
            designUpdateId: userContext.designUpdateId,
            componentType: componentType,
            componentName: componentName
        });

        const designUpdate = DesignUpdates.findOne({_id: userContext.designUpdateId});

        if(designUpdateComponent){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "No Design Update Component of type " + componentType + " exists with name " + componentName + " in Design Update " + designUpdate.updateName);
        }
    },

    'verifyDesignUpdateComponents.componentDoesNotExistCalled'(componentType, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const designUpdateComponent = DesignUpdateComponents.findOne({
            designVersionId: userContext.designVersionId,
            designUpdateId: userContext.designUpdateId,
            componentType: componentType,
            componentName: componentName
        });

        const designUpdate = DesignUpdates.findOne({_id: userContext.designUpdateId});

        if(designUpdateComponent){
            throw new Meteor.Error("FAIL", "A Design Update Component of type " + componentType + " exists with name " + componentName + " in Design Update " + designUpdate.updateName);

        } else {
            return true;
        }
    },

    'verifyDesignUpdateComponents.componentIsInScope'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const designUpdateComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            componentType,
            componentParentName,
            componentName
        );

        if(designUpdateComponent.isInScope){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expecting component " + componentName + " to be in scope");
        }
    },

    'verifyDesignUpdateComponents.componentIsInParentScope'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const designUpdateComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            componentType,
            componentParentName,
            componentName
        );

        if(designUpdateComponent.isParentScope){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expecting component " + componentName + " to be in parent scope");
        }
    },

    'verifyDesignUpdateComponents.componentIsNotInScope'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const designUpdateComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            componentType,
            componentParentName,
            componentName
        );

        if(!(designUpdateComponent.isInScope || designUpdateComponent.isParentScope)){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expecting component " + componentName + " to not be in scope");
        }
    },

    'verifyDesignUpdateComponents.componentCountCalledIs'(componentType, componentName, componentCount){

        const designComponentsCount = DesignComponents.find({componentType: componentType, componentName: componentName}).count();

        if(designComponentsCount === componentCount){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Found " + designComponentsCount + " components of type " + componentType + " with name " + componentName + ". Expecting " + componentCount);
        }
    },

    // Note - be careful when testing to make sure that component names are unique before using this check
    'verifyDesignUpdateComponents.componentParentIs'(componentType, componentName, componentParentName){

        const designComponent = DesignComponents.findOne({componentType: componentType, componentName: componentName});
        const parentComponent = DesignComponents.findOne({_id: designComponent.componentParentId});

        let parentName = 'NONE';
        if(parentComponent){
            parentName = parentComponent.componentName;
        }

        if(parentName != componentParentName){
            throw new Meteor.Error("FAIL", "Expected parent to be " + componentParentName + " but got " + parentName);
        } else {
            return true;
        }

    },

    'verifyDesignUpdateComponents.componentInDesignVersionParentIs'(designName, designVersionName, componentType, componentName, componentParentName){

        const design = TestDataHelpers.getDesign(designName);
        const designVersion = TestDataHelpers.getDesignVersion(design._id, designVersionName);

        const designComponent = DesignComponents.findOne({designVersionId: designVersion._id, componentType: componentType, componentName: componentName});
        if(!designComponent){
            throw new Meteor.Error("FAIL", "Design Component " + componentName + " not found for Design Version " + designVersionName);
        }
        const parentComponent = DesignComponents.findOne({_id: designComponent.componentParentId});

        let parentName = 'NONE';
        if(parentComponent){
            parentName = parentComponent.componentName;
        }

        if(parentName != componentParentName){
            throw new Meteor.Error("FAIL", "Expected parent to be " + componentParentName + " but got " + parentName);
        } else {
            return true;
        }

    },

    // Note - be careful when testing to make sure that component names are unique before using this check
    'verifyDesignUpdateComponents.componentLevelIs'(componentType, componentName, componentLevel){

        const designComponent = DesignComponents.findOne({componentType: componentType, componentName: componentName});

        if(designComponent.componentLevel != componentLevel){
            throw new Meteor.Error("FAIL", "Expected level to be " + componentLevel + " but got " + designComponent.componentLevel);
        } else {
            return true;
        }

    },

    // Note - be careful when testing to make sure that component names are unique before using this check
    'verifyDesignUpdateComponents.componentFeatureIs'(componentType, componentName, componentFeature){

        const designComponent = DesignComponents.findOne({componentType: componentType, componentName: componentName});
        const featureComponent = DesignComponents.findOne({componentReferenceId: designComponent.componentFeatureReferenceId});

        let featureName = 'NONE';
        if(featureComponent){
            featureName = featureComponent.componentName;
        }

        if(featureName != componentFeature){
            throw new Meteor.Error("FAIL", "Expected Feature to be " + componentFeature + " but got " + featureName);
        } else {
            return true;
        }

    },

    // Note - be careful when testing to make sure that component names are unique before using this check
    'verifyDesignUpdateComponents.componentIsAboveComponent'(componentType, componentAboveName, componentBelowName){

        const designComponentAbove = DesignComponents.findOne({componentType: componentType, componentName: componentAboveName});
        const designComponentBelow = DesignComponents.findOne({componentType: componentType, componentName: componentBelowName});

        // Components highest in the list have the lowest indexes
        console.log("Component " + componentAboveName + " has index " + designComponentAbove.componentIndex);
        console.log("Component " + componentBelowName + " has index " + designComponentBelow.componentIndex);
        if(designComponentAbove.componentIndex >= designComponentBelow.componentIndex){
            console.log("FAIL!");
            throw new Meteor.Error("FAIL", "Expected component " + componentAboveName + " to be above component " + componentBelowName + " in the list of " + componentType +"s");
        } else {
            return true;
        }

    },

    'verifyDesignUpdateComponents.featureNarrativeIs'(featureName, narrativeText){

        const featureComponent = DesignComponents.findOne({componentType: ComponentType.FEATURE, componentName: featureName});

        let featureNarrative = DefaultComponentNames.NEW_NARRATIVE_TEXT;
        if(featureComponent){
            featureNarrative = featureComponent.componentNarrative;
        }

        if(featureNarrative.trim() !=  narrativeText.trim()){
            throw new Meteor.Error("FAIL", "Expected feature narrative to be " + narrativeText + " but found " + featureNarrative);
        } else {
            return true;
        }
    }

});
