import { Meteor } from 'meteor/meteor';

import { Designs }                  from '../../imports/collections/design/designs.js'
import { DesignVersions }           from '../../imports/collections/design/design_versions.js'
import { DesignComponents }         from '../../imports/collections/design/design_components.js';
import { DefaultItemNames, DefaultComponentNames }         from '../../imports/constants/default_names.js';
import { ComponentType }            from '../../imports/constants/constants.js';

import TestDataHelpers              from '../test_modules/test_data_helpers.js'

Meteor.methods({

    'verifyDesignComponents.componentExistsCalled'(componentType, componentName){

        const designComponent = DesignComponents.findOne({componentType: componentType, componentName: componentName});

        if(designComponent){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "No Design Component of type " + componentType + " exists with name " + componentName);
        }
    },

    'verifyDesignComponents.componentExistsInDesignVersionCalled'(designName, designVersionName, componentType, componentName){

        const design = TestDataHelpers.getDesign(designName);
        const designVersion = TestDataHelpers.getDesignVersion(design._id, designVersionName);

        const designComponent = DesignComponents.findOne({designVersionId: designVersion._id, componentType: componentType, componentName: componentName});

        if(designComponent){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "No Design Component of type " + componentType + " exists with name " + componentName + " in Design Version " + designVersionName + " for Design " + designName);
        }
    },

    'verifyDesignComponents.componentDoesNotExistCalled'(componentType, componentName){

        const designComponent = DesignComponents.findOne({componentType: componentType, componentName: componentName});

        if(designComponent){
            throw new Meteor.Error("FAIL", "A Design Component of type " + componentType + " exists with name " + componentName);

        } else {
            return true;
        }
    },

    'verifyDesignComponents.componentCountCalledIs'(componentType, componentName, componentCount){

        const designComponentsCount = DesignComponents.find({componentType: componentType, componentName: componentName}).count();

        if(designComponentsCount === componentCount){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Found " + designComponentsCount + " components of type " + componentType + " with name " + componentName + ". Expecting " + componentCount);
        }
    },

    // Note - be careful when testing to make sure that component names are unique before using this check
    'verifyDesignComponents.componentParentIs'(componentType, componentName, componentParentName){

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

    'verifyDesignComponents.componentInDesignVersionParentIs'(designName, designVersionName, componentType, componentName, componentParentName){

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
    'verifyDesignComponents.componentLevelIs'(componentType, componentName, componentLevel){

        const designComponent = DesignComponents.findOne({componentType: componentType, componentName: componentName});

        if(designComponent.componentLevel != componentLevel){
            throw new Meteor.Error("FAIL", "Expected level to be " + componentLevel + " but got " + designComponent.componentLevel);
        } else {
            return true;
        }

    },

    // Note - be careful when testing to make sure that component names are unique before using this check
    'verifyDesignComponents.componentFeatureIs'(componentType, componentName, componentFeature){

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
    'verifyDesignComponents.componentIsAboveComponent'(componentType, componentAboveName, componentBelowName){

        const designComponentAbove = DesignComponents.findOne({componentType: componentType, componentName: componentAboveName});
        const designComponentBelow = DesignComponents.findOne({componentType: componentType, componentName: componentBelowName});

        // Components highest in the list have the lowest indexes
        //console.log("Component " + componentAboveName + " has index " + designComponentAbove.componentIndex);
        //console.log("Component " + componentBelowName + " has index " + designComponentBelow.componentIndex);
        if(designComponentAbove.componentIndex >= designComponentBelow.componentIndex){
            //console.log("FAIL!");
            throw new Meteor.Error("FAIL", "Expected component " + componentAboveName + " to be above component " + componentBelowName + " in the list of " + componentType +"s");
        } else {
            return true;
        }

    },

    'verifyDesignComponents.featureNarrativeIs'(featureName, narrativeText){

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

