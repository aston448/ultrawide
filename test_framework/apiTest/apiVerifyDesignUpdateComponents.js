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
            componentNameNew: componentName
        });

        const designUpdate = DesignUpdates.findOne({_id: userContext.designUpdateId});

        if(designUpdateComponent){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "No Design Update Component of type " + componentType + " exists with name " + componentName + " in Design Update " + designUpdate.updateName);
        }
    },

    'verifyDesignUpdateComponents.componentExistsInDesignUpdateWithParentCalled'(componentType, parentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        // This will throw an error if the component is not found
        const designUpdateComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            componentType,
            parentName,
            componentName
        );

        return true;
    },

    'verifyDesignUpdateComponents.componentHasFeatureReference'(componentType, parentName, componentName, featureName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        // This will throw an error if the component is not found
        const designUpdateComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            componentType,
            parentName,
            componentName
        );

        const featureComponent = DesignUpdateComponents.findOne({
            designUpdateId: userContext.designUpdateId,
            componentNameNew: featureName,
            componentType: ComponentType.FEATURE
        });

        if(featureComponent){
            if(designUpdateComponent.componentFeatureReferenceIdNew === featureComponent.componentReferenceId){
                return true;
            } else {
                throw new Meteor.Error("FAIL", "Expecting feature ref for component " + componentName + " to be " + featureComponent.componentReferenceId + " but found " + designUpdateComponent.componentFeatureReferenceIdNew);
            }
        } else {
            throw new Meteor.Error("FAIL", "Feature not found with name " + featureName + " in Design Update " + userContext.designUpdateId);
        }

    },

    'verifyDesignUpdateComponents.componentCountWithNameIs'(componentType, componentName, expectedCount, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const actualCount = DesignUpdateComponents.find({
            designVersionId: userContext.designVersionId,
            designUpdateId: userContext.designUpdateId,
            componentType: componentType,
            componentNameNew: componentName
        }).count();

        if(expectedCount != actualCount){
            throw new Meteor.Error("FAIL", "Found " + actualCount + " components of type " + componentType + " with name " + componentName + ". Expecting " + expectedCount);
        } else {
            return true;
        }
    },


    'verifyDesignUpdateComponents.componentDoesNotExistCalled'(componentType, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const designUpdateComponent = DesignUpdateComponents.findOne({
            designVersionId: userContext.designVersionId,
            designUpdateId: userContext.designUpdateId,
            componentType: componentType,
            componentNameNew: componentName
        });

        const designUpdate = DesignUpdates.findOne({_id: userContext.designUpdateId});

        if(designUpdateComponent){
            throw new Meteor.Error("FAIL", "A Design Update Component of type " + componentType + " exists with name " + componentName + " in Design Update " + designUpdate.updateName);

        } else {
            return true;
        }
    },

    'verifyDesignUpdateComponents.selectedComponentIs'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const designUpdateComponent = DesignUpdateComponents.findOne({_id: userContext.designComponentId});

        if(designUpdateComponent){
            let parentComponent = null;
            let parentName = 'NONE';
            if(componentType != ComponentType.APPLICATION) {
                parentComponent = DesignUpdateComponents.findOne({_id: designUpdateComponent.componentParentIdNew});
                if(parentComponent){
                    parentName = parentComponent.componentNameNew;
                }
            }
            if(designUpdateComponent.componentNameNew === componentName && designUpdateComponent.componentType === componentType && parentName === componentParentName){
                return true;
            } else {
                throw new Meteor.Error("FAIL", "Expecting selected component to be " + componentName + " with parent " + componentParentName + " but got " + designUpdateComponent.componentNameNew + " with parent " + parentName);
            }
        } else {
            throw new Meteor.Error("FAIL", "No Design Update Component is selected.  Expecting " + componentName);
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

    'verifyDesignUpdateComponents.componentIsRemoved'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const designUpdateComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            componentType,
            componentParentName,
            componentName
        );

        if(designUpdateComponent.isRemoved){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expecting component " + componentName + " to be removed");
        }
    },

    'verifyDesignUpdateComponents.componentIsNotRemoved'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const designUpdateComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            componentType,
            componentParentName,
            componentName
        );

        if(designUpdateComponent.isRemoved){
            throw new Meteor.Error("FAIL", "Expecting component " + componentName + " NOT to be removed");
        } else {
            return true;
        }
    },

    'verifyDesignUpdateComponents.componentIsRemovedElsewhere'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const designUpdateComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            componentType,
            componentParentName,
            componentName
        );

        if(designUpdateComponent.isRemovedElsewhere){
            if(designUpdateComponent.isRemoved){
                throw new Meteor.Error("FAIL", "Expecting component " + componentName + " to be removed elsewhere but not removed itself");
            } else {
                return true;
            }
        } else {
            throw new Meteor.Error("FAIL", "Expecting component " + componentName + " to be removed elsewhere");
        }
    },

    'verifyDesignUpdateComponents.componentIsNotRemovedElsewhere'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const designUpdateComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            componentType,
            componentParentName,
            componentName
        );

        if(designUpdateComponent.isRemovedElsewhere){
            throw new Meteor.Error("FAIL", "Expecting component " + componentName + " NOT to be removed elsewhere");

        } else {
            if(designUpdateComponent.isRemoved){
                throw new Meteor.Error("FAIL", "Expecting component " + componentName + " NOT to be removed");
            } else {
                return true;
            }
        }
    },

    'verifyDesignUpdateComponents.componentIsNew'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const designUpdateComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            componentType,
            componentParentName,
            componentName
        );

        if(designUpdateComponent.isNew){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expecting component " + componentName + " to be New");
        }
    },

    'verifyDesignUpdateComponents.componentIsChanged'(componentType, componentParentName, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const designUpdateComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            componentType,
            componentParentName,
            componentName
        );

        if(designUpdateComponent.isChanged){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expecting component " + componentName + " to be Changed");
        }
    },

    'verifyDesignUpdateComponents.selectedComponentOldNameIs'(oldName, userName){

        // Component MUST be selected first
        const userContext = TestDataHelpers.getUserContext(userName);

        const selectedComponent = DesignUpdateComponents.findOne({_id: userContext.designComponentId});

        if(selectedComponent.componentNameOld === oldName){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expecting component old name to be " + oldName + " but found " + selectedComponent.componentNameOld);
        }
    },

    'verifyDesignUpdateComponents.selectedComponentNewNameIs'(newName, userName){

        // Component MUST be selected first
        const userContext = TestDataHelpers.getUserContext(userName);

        const selectedComponent = DesignUpdateComponents.findOne({_id: userContext.designComponentId});

        if(selectedComponent.componentNameNew === newName){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expecting component new name to be " + newName + " but found " + selectedComponent.componentNameNew);
        }
    },

    'verifyDesignUpdateComponents.componentCountCalledIs'(componentType, componentName, componentCount){

        // const designComponentsCount = DesignVersionComponents.find({componentType: componentType, componentNameNew: componentName}).count();
        //
        // if(designComponentsCount === componentCount){
        //     return true;
        // } else {
        //     throw new Meteor.Error("FAIL", "Found " + designComponentsCount + " components of type " + componentType + " with name " + componentName + ". Expecting " + componentCount);
        // }
    },

    // Note - be careful when testing to make sure that component names are unique before using this check
    'verifyDesignUpdateComponents.componentParentIs'(componentType, componentName, componentParentName){

        // const designComponent = DesignVersionComponents.findOne({componentType: componentType, componentNameNew: componentName});
        // const parentComponent = DesignVersionComponents.findOne({_id: designComponent.componentParentIdNew});
        //
        // let parentName = 'NONE';
        // if(parentComponent){
        //     parentName = parentComponent.componentNameNew;
        // }
        //
        // if(parentName != componentParentName){
        //     throw new Meteor.Error("FAIL", "Expected parent to be " + componentParentName + " but got " + parentName);
        // } else {
        //     return true;
        // }

    },

    'verifyDesignUpdateComponents.componentInDesignVersionParentIs'(designName, designVersionName, componentType, componentName, componentParentName){

        // const design = TestDataHelpers.getDesign(designName);
        // const designVersion = TestDataHelpers.getDesignVersion(design._id, designVersionName);
        //
        // const designComponent = DesignVersionComponents.findOne({designVersionId: designVersion._id, componentType: componentType, componentNameNew: componentName});
        // if(!designComponent){
        //     throw new Meteor.Error("FAIL", "Design Component " + componentName + " not found for Design Version " + designVersionName);
        // }
        // const parentComponent = DesignVersionComponents.findOne({_id: designComponent.componentParentIdNew});
        //
        // let parentName = 'NONE';
        // if(parentComponent){
        //     parentName = parentComponent.componentNameNew;
        // }
        //
        // if(parentName != componentParentName){
        //     throw new Meteor.Error("FAIL", "Expected parent to be " + componentParentName + " but got " + parentName);
        // } else {
        //     return true;
        // }

    },

    // Note - be careful when testing to make sure that component names are unique before using this check
    'verifyDesignUpdateComponents.componentLevelIs'(componentType, componentName, componentLevel){

        // const designComponent = DesignVersionComponents.findOne({componentType: componentType, componentNameNew: componentName});
        //
        // if(designComponent.componentLevel != componentLevel){
        //     throw new Meteor.Error("FAIL", "Expected level to be " + componentLevel + " but got " + designComponent.componentLevel);
        // } else {
        //     return true;
        // }

    },

    // Note - be careful when testing to make sure that component names are unique before using this check
    'verifyDesignUpdateComponents.componentFeatureIs'(componentType, componentName, componentFeature){

        // const designComponent = DesignVersionComponents.findOne({componentType: componentType, componentNameNew: componentName});
        // const featureComponent = DesignVersionComponents.findOne({componentReferenceId: designComponent.componentFeatureReferenceIdNew});
        //
        // let featureName = 'NONE';
        // if(featureComponent){
        //     featureName = featureComponent.componentNameNew;
        // }
        //
        // if(featureName != componentFeature){
        //     throw new Meteor.Error("FAIL", "Expected Feature to be " + componentFeature + " but got " + featureName);
        // } else {
        //     return true;
        // }

    },

    // Note - be careful when testing to make sure that component names are unique before using this check
    'verifyDesignUpdateComponents.componentIsAboveComponent'(componentType, componentAboveParentName, componentAboveName, componentBelowParentName, componentBelowName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const aboveComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            componentType,
            componentAboveParentName,
            componentAboveName
        );

        const belowComponent = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            componentType,
            componentBelowParentName,
            componentBelowName
        );

        if(aboveComponent.componentIndexNew >= belowComponent.componentIndexNew){
            //console.log("FAIL!");
            throw new Meteor.Error("FAIL", "Expected component " + componentAboveName + " to be above component " + componentBelowName + " in the list of " + componentType +"s");
        } else {
            return true;
        }

    },

    'verifyDesignUpdateComponents.selectedComponentIsAboveComponent'(targetType, targetParentName, targetName, userName){

        // Component MUST be selected first
        const userContext = TestDataHelpers.getUserContext(userName);

        const selectedComponent = DesignUpdateComponents.findOne({_id: userContext.designComponentId});
        const targetComponent = TestDataHelpers.getDesignUpdateComponentWithParent(userContext.designVersionId, userContext.designUpdateId, targetType, targetParentName, targetName);

        // Components highest in the list have the lowest indexes
        //console.log("Component " + componentAboveName + " has index " + designComponentAbove.componentIndexNew);
        //console.log("Component " + componentBelowName + " has index " + designComponentBelow.componentIndexNew);
        if(selectedComponent.componentIndexNew >= targetComponent.componentIndexNew){
            //console.log("FAIL!");
            throw new Meteor.Error("FAIL", "Expected update component " + selectedComponent + " to be above component " + targetComponent + " in the list of " + targetType +"s");
        } else {
            return true;
        }

    },

    'verifyDesignUpdateComponents.featureNarrativeIs'(parentName, featureName, narrativeText, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const feature = TestDataHelpers.getDesignUpdateComponentWithParent(
            userContext.designVersionId,
            userContext.designUpdateId,
            ComponentType.FEATURE,
            parentName,
            featureName
        );

        //console.log("Feature narrative is: " + feature.componentNarrativeNew);
        //console.log("Expected narrative is: " + narrativeText);

        if(feature.componentNarrativeNew.trim() !=  narrativeText.trim()){
            throw new Meteor.Error("FAIL", "Expected feature narrative to be " + narrativeText + " but found " + feature.componentNarrativeNew);
        } else {
            return true;
        }
    },

    'verifyDesignUpdateComponents.selectedFeatureNarrativeIs'(narrativeText, userName){

        // Must select Feature first before calling this

        const userContext = TestDataHelpers.getUserContext(userName);

        const feature = DesignUpdateComponents.findOne({_id: userContext.designComponentId});

        //console.log("Feature narrative is: " + feature.componentNarrativeNew);
        //console.log("Expected narrative is: " + narrativeText);

        if(feature.componentNarrativeNew.trim() !=  narrativeText.trim()){
            throw new Meteor.Error("FAIL", "Expected feature narrative to be " + narrativeText + " but found " + feature.componentNarrativeNew);
        } else {
            return true;
        }
    },

    'verifyDesignUpdateComponents.selectedOldFeatureNarrativeIs'(narrativeText, userName){

        // Must select Feature first before calling this

        const userContext = TestDataHelpers.getUserContext(userName);

        const feature = DesignUpdateComponents.findOne({_id: userContext.designComponentId});

        //console.log("Feature narrative is: " + feature.componentNarrativeNew);
        //console.log("Expected narrative is: " + narrativeText);

        if(feature.componentNarrativeOld.trim() !=  narrativeText.trim()){
            throw new Meteor.Error("FAIL", "Expected old feature narrative to be " + narrativeText + " but found " + feature.componentNarrativeOld);
        } else {
            return true;
        }
    }

});
