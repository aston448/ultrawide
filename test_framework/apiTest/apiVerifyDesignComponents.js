import { Meteor } from 'meteor/meteor';

import { Designs }                  from '../../imports/collections/design/designs.js'
import { DesignVersions }           from '../../imports/collections/design/design_versions.js'
import { DesignVersionComponents }         from '../../imports/collections/design/design_version_components.js';
import { DefaultItemNames, DefaultComponentNames }         from '../../imports/constants/default_names.js';
import { ComponentType }            from '../../imports/constants/constants.js';

import { TestDataHelpers }              from '../test_modules/test_data_helpers.js'

Meteor.methods({

    'verifyDesignComponents.componentExistsCalled'(componentType, componentName){

        const designComponent = DesignVersionComponents.findOne({componentType: componentType, componentNameNew: componentName});

        if(designComponent){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "No Design Component of type " + componentType + " exists with name " + componentName);
        }
    },

    'verifyDesignComponents.componentExistsInDesignVersionCalled'(designName, designVersionName, componentType, componentName){

        const design = TestDataHelpers.getDesign(designName);
        const designVersion = TestDataHelpers.getDesignVersion(design._id, designVersionName);

        const designComponent = DesignVersionComponents.findOne({designVersionId: designVersion._id, componentType: componentType, componentNameNew: componentName});

        if(designComponent){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "No Design Component of type " + componentType + " exists with name " + componentName + " in Design Version " + designVersionName + " for Design " + designName);
        }
    },

    'verifyDesignComponents.componentDoesNotExistCalled'(componentType, componentName){

        const designComponent = DesignVersionComponents.findOne({componentType: componentType, componentNameNew: componentName});

        if(designComponent){
            throw new Meteor.Error("FAIL", "A Design Component of type " + componentType + " exists with name " + componentName);

        } else {
            return true;
        }
    },

    'verifyDesignComponents.componentDoesNotExistInDesignVersionCalled'(designName, designVersionName, componentType, componentName){

        const design = TestDataHelpers.getDesign(designName);
        const designVersion = TestDataHelpers.getDesignVersion(design._id, designVersionName);

        const designComponent = DesignVersionComponents.findOne({designVersionId: designVersion._id, componentType: componentType, componentNameNew: componentName});

        if(designComponent){
            throw new Meteor.Error("FAIL", "Design Component of type " + componentType + " does exist with name " + componentName + " in Design Version " + designVersionName + " for Design " + designName);
        } else {
            return true;
        }
    },

    'verifyDesignComponents.featureAspectExistsCalled_InFeature_InDesign_DesignVersion_'(aspectName, featureName, designName, designVersionName){

        const design = TestDataHelpers.getDesign(designName);
        const designVersion = TestDataHelpers.getDesignVersion(design._id, designVersionName);

        // This will error if not found
        const aspect = TestDataHelpers.getDesignComponentWithParent(designVersion._id, ComponentType.FEATURE_ASPECT, featureName, aspectName);

        return true;
    },

    'verifyDesignComponents.scenarioExistsCalled_InFeatureAspect_InDesign_DesignVersion_'(scenarioName, aspectName, designName, designVersionName){

        const design = TestDataHelpers.getDesign(designName);
        const designVersion = TestDataHelpers.getDesignVersion(design._id, designVersionName);

        // This will error if not found
        const aspect = TestDataHelpers.getDesignComponentWithParent(designVersion._id, ComponentType.SCENARIO, aspectName, scenarioName);

        return true;
    },


    'verifyDesignComponents.componentCountCalledIs'(componentType, componentName, designName, designVersionName, componentCount){

        const design = TestDataHelpers.getDesign(designName);
        const designVersion = TestDataHelpers.getDesignVersion(design._id, designVersionName);

        const designComponentsCount = DesignVersionComponents.find({
            designVersionId: designVersion._id,
            componentType: componentType,
            componentNameNew: componentName}
            ).count();

        if(designComponentsCount === componentCount){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Found " + designComponentsCount + " components of type " + componentType + " with name " + componentName + ". Expecting " + componentCount);
        }
    },

    // Note - be careful when testing to make sure that component names are unique before using this check
    'verifyDesignComponents.componentParentIs'(componentType, componentName, componentParentName){

        const designComponent = DesignVersionComponents.findOne({componentType: componentType, componentNameNew: componentName});
        const parentComponent = DesignVersionComponents.findOne({designVersionId: designComponent.designVersionId, componentReferenceId: designComponent.componentParentReferenceIdNew});

        let parentName = 'NONE';
        if(parentComponent){
            parentName = parentComponent.componentNameNew;
        }

        if(parentName !== componentParentName){
            throw new Meteor.Error("FAIL", "Expected parent to be " + componentParentName + " but got " + parentName);
        } else {
            return true;
        }

    },

    'verifyDesignComponents.componentInDesignVersionParentIs'(designName, designVersionName, componentType, componentName, componentParentName){

        const design = TestDataHelpers.getDesign(designName);
        const designVersion = TestDataHelpers.getDesignVersion(design._id, designVersionName);

        const designComponent = DesignVersionComponents.findOne({designVersionId: designVersion._id, componentType: componentType, componentNameNew: componentName});
        if(!designComponent){
            throw new Meteor.Error("FAIL", "Design Component " + componentName + " not found for Design Version " + designVersionName);
        }
        const parentComponent = DesignVersionComponents.findOne({designVersionId: designComponent.designVersionId, componentReferenceId: designComponent.componentParentReferenceIdNew});

        let parentName = 'NONE';
        if(parentComponent){
            parentName = parentComponent.componentNameNew;
        }

        if(parentName !== componentParentName){
            throw new Meteor.Error("FAIL", "Expected parent to be " + componentParentName + " but got " + parentName);
        } else {
            return true;
        }

    },

    'verifyDesignComponents.componentInDesignVersionFeatureRefIs'(designName, designVersionName, componentType, componentParent, componentName, featureName){

        const design = TestDataHelpers.getDesign(designName);
        const designVersion = TestDataHelpers.getDesignVersion(design._id, designVersionName);

        const designComponent = TestDataHelpers.getDesignComponentWithParent(designVersion._id, componentType, componentParent, componentName);

        if(!designComponent){
            throw new Meteor.Error("FAIL", "Design Component " + componentName + " not found for Design Version " + designVersionName);
        }
        const featureComponent = DesignVersionComponents.findOne({
            designVersionId: designVersion._id,
            componentType: ComponentType.FEATURE,
            componentNameNew: featureName
        });

        let featureRef = 'NONE';

        if(featureComponent){
            featureRef = featureComponent.componentReferenceId;
        } else {
            throw new Meteor.Error("FAIL", "Feature Component " + featureName + " not found for Design Version " + designVersionName);
        }

        if(designComponent.componentFeatureReferenceIdNew !== featureRef){
            throw new Meteor.Error("FAIL", "Expected feature reference to be " + featureRef + " but got " + designComponent.componentFeatureReferenceIdNew + " for component " + componentName);
        } else {
            return true;
        }

    },

    // Note - be careful when testing to make sure that component names are unique before using this check
    'verifyDesignComponents.componentLevelIs'(componentType, componentName, componentLevel){

        const designComponent = DesignVersionComponents.findOne({componentType: componentType, componentNameNew: componentName});

        if(designComponent.componentLevel !== componentLevel){
            throw new Meteor.Error("FAIL", "Expected level to be " + componentLevel + " but got " + designComponent.componentLevel);
        } else {
            return true;
        }

    },

    // Note - be careful when testing to make sure that component names are unique before using this check
    'verifyDesignComponents.componentFeatureIs'(componentType, componentName, componentFeature){

        const designComponent = DesignVersionComponents.findOne({componentType: componentType, componentNameNew: componentName});
        const featureComponent = DesignVersionComponents.findOne({componentReferenceId: designComponent.componentFeatureReferenceIdNew});

        let featureName = 'NONE';
        if(featureComponent){
            featureName = featureComponent.componentNameNew;
        }

        if(featureName != componentFeature){
            throw new Meteor.Error("FAIL", "Expected Feature to be " + componentFeature + " but got " + featureName);
        } else {
            return true;
        }

    },

    // Note - be careful when testing to make sure that component names are unique before using this check
    'verifyDesignComponents.componentIsAboveComponent'(componentType, componentAboveName, componentBelowName){

        const designComponentAbove = DesignVersionComponents.findOne({componentType: componentType, componentNameNew: componentAboveName});
        const designComponentBelow = DesignVersionComponents.findOne({componentType: componentType, componentNameNew: componentBelowName});

        // Components highest in the list have the lowest indexes
        //console.log("Component " + componentAboveName + " has index " + designComponentAbove.componentIndexNew);
        //console.log("Component " + componentBelowName + " has index " + designComponentBelow.componentIndexNew);
        if(designComponentAbove.componentIndexNew >= designComponentBelow.componentIndexNew){
            //console.log("FAIL!");
            throw new Meteor.Error("FAIL", "Expected component " + componentAboveName + " to be above component " + componentBelowName + " in the list of " + componentType +"s");
        } else {
            return true;
        }

    },

    'verifyDesignComponents.selectedComponentIsAboveComponent'(targetType, targetParentName, targetName, userName){

        // Component MUST be selected first
        const userContext = TestDataHelpers.getUserContext(userName);

        const selectedComponent = DesignVersionComponents.findOne({_id: userContext.designComponentId});
        const targetComponent = TestDataHelpers.getDesignComponentWithParent(userContext.designVersionId, targetType, targetParentName, targetName);

        // Components highest in the list have the lowest indexes
        // console.log("Selected Component (" + selectedComponent.componentNameNew + ") has index " + selectedComponent.componentIndexNew);
        // console.log("Target Component (" + targetComponent.componentNameNew + ") has index " + targetComponent.componentIndexNew);

        if(selectedComponent.componentIndexNew >= targetComponent.componentIndexNew){
            //console.log("FAIL!");
            throw new Meteor.Error("FAIL", "Expected component " + selectedComponent.componentNameNew + " to be above component " + targetComponent.componentNameNew + " in the list of " + targetType +"s");
        } else {
            return true;
        }

    },

    'verifyDesignComponents.selectedComponentMergeStatusIs'(mergeStatus, userName){
        // Component MUST be selected first
        const userContext = TestDataHelpers.getUserContext(userName);

        const selectedComponent = DesignVersionComponents.findOne({_id: userContext.designComponentId});

        if(selectedComponent.updateMergeStatus !== mergeStatus){
            throw new Meteor.Error("FAIL", "Expected component " + selectedComponent.componentNameNew + " to have merge status " + mergeStatus + " but found " + selectedComponent.updateMergeStatus);
        } else {
            return true;
        }
    },

    'verifyDesignComponents.selectedComponentDetailsTextIs'(detailsText, userName){
        // Component MUST be selected first.  Note: can only test basic non-complex text here
        const userContext = TestDataHelpers.getUserContext(userName);

        const selectedComponent = DesignVersionComponents.findOne({_id: userContext.designComponentId});

        const rawDetails = selectedComponent.componentTextRawNew;
        const plainDetails = rawDetails.blocks[0].text;

        if(plainDetails !== detailsText){
            throw new Meteor.Error("FAIL", "Expected component " + selectedComponent.componentNameNew + " to have details text " + detailsText + " but found " + plainDetails);
        } else {
            return true;
        }
    },

    'verifyDesignComponents.selectedFeatureNarrativeIs'(narrativeText, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const featureComponent = DesignVersionComponents.findOne({
            _id: userContext.designComponentId
        });

        let featureNarrative = DefaultComponentNames.NEW_NARRATIVE_TEXT;

        if(featureComponent){
            featureNarrative = featureComponent.componentNarrativeNew;
        }

        if(featureNarrative.trim() !==  narrativeText.trim()){
            throw new Meteor.Error("FAIL", "Expected feature narrative to be " + narrativeText + " but found " + featureNarrative);
        } else {
            return true;
        }
    },

    'verifyDesignComponents.featureNarrativeIs'(featureName, narrativeText){

        const featureComponent = DesignVersionComponents.findOne({componentType: ComponentType.FEATURE, componentNameNew: featureName});

        let featureNarrative = DefaultComponentNames.NEW_NARRATIVE_TEXT;
        if(featureComponent){
            featureNarrative = featureComponent.componentNarrativeNew;
        }

        if(featureNarrative.trim() !==  narrativeText.trim()){
            throw new Meteor.Error("FAIL", "Expected feature narrative to be " + narrativeText + " but found " + featureNarrative);
        } else {
            return true;
        }
    }

});

