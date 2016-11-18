
import {ScenarioSteps}                  from '../../collections/design/scenario_steps.js';
import {FeatureBackgroundSteps}         from '../../collections/design/feature_background_steps.js';
import {UserAccTestMashData}          from '../../collections/dev/user_acc_test_mash_data.js';
import {UserDevFeatureScenarioSteps}    from '../../collections/dev/user_dev_feature_scenario_steps.js'

import { ScenarioStepType, ScenarioStepStatus, StepContext, MashStatus, MashTestStatus} from '../../constants/constants.js';
import { DefaultComponentNames, DefaultDetailsText } from '../../constants/default_names.js';

class ScenarioServices{


    getDefaultRawStepText(stepText){

        let text = 'add step text here...';

        if(stepText){
            text = stepText;
        }

        return {
            "entityMap" : {  },
            "blocks" : [
                { "key" : "5efv7", "text" : text,
                    "type" : "unstyled",
                    "depth" : 0,
                    "inlineStyleRanges" : [ ],
                    "entityRanges" : [ ],
                    "data" : {  }
                }
            ]
        };
    };

    addNewFeatureBackgroundStep(featureReferenceId, userItemContext, featureInScope){

        // A new step should be added to the feature background referenced for the current design or design update component
        // The step is always added at the end of the list

        // Background step has a design update Id if Scenario is in a Design Update
        let designUpdateId = 'NONE';
        if(userItemContext.designUpdateId){
            designUpdateId = userItemContext.designUpdateId;
        }

        FeatureBackgroundSteps.insert(
            {
                stepReferenceId:            'TEMP',                                     // Will set this after created
                designId:                   userItemContext.designId,
                designVersionId:            userItemContext.designVersionId,
                designUpdateId:             designUpdateId,
                featureReferenceId:         featureReferenceId,

                // Data
                stepType:                   ScenarioStepType.STEP_NEW,
                stepText:                   'set step text here',
                stepFullName:               'NEW Step',
                stepTextRaw:                this.getDefaultRawStepText(),
                // Step index defaults and then is set correctly below

                // State
                devStatus:                  ScenarioStepStatus.STEP_STATUS_UNLINKED,
                updateFocus:                featureInScope,
                isRemovable:                true,
                isRemoved:                  false,
                isNew:                      true,
                isChanged:                  false
            },

            (error, result) => {
                if(error){
                    // Error handler
                    //console.log("Insert Feature Background Step - Error: " + error);
                } else {
                    //console.log("Insert Feature Background Step - Success: " + result);

                    // Update the component reference to be the _id.
                    FeatureBackgroundSteps.update(
                        {_id: result},
                        { $set: {stepReferenceId: result}}
                    );

                    // Set the default index for a new component
                    this.setStepIndex(result, featureReferenceId, userItemContext, StepContext.STEP_FEATURE);

                }
            }
        );
    }

    // Used for data restore only
    importFeatureBackgroundStep(designId, designVersionId, designUpdateId, step){


        const featureBackgroundStepId = FeatureBackgroundSteps.insert(
            {
                // Identity
                stepReferenceId:            step.stepReferenceId,
                componentType:              step.componentType,
                designId:                   designId,                   // New Design Id from import
                designVersionId:            designVersionId,            // New Design Version Id from import
                designUpdateId:             designUpdateId,             // New Design Update Id from import (if an update step)
                featureReferenceId:         step.featureReferenceId,    // This is preserved across import / export
                stepIndex:                  step.stepIndex,

                // Data
                stepType:                   step.stepType,
                stepText:                   step.stepText,
                stepFullName:               step.stepFullName,
                stepTextRaw:                step.stepTextRaw,

                // State
                devStatus:                  step.devStatus,
                updateFocus:                step.updateFocus,
                isRemovable:                step.isRemovable,
                isRemoved:                  step.isRemoved,
                isNew:                      step.isNew,
                isChanged:                  step.isChanged,
            }
        );

        return featureBackgroundStepId;
    }

    addNewScenarioStep(scenarioReferenceId, userContext, scenarioInScope){

        // A new step should be added to the scenario referenced for the current design or design update component
        // The step is always added at the end of the list

        ScenarioSteps.insert(
            {
                stepReferenceId:            'TEMP',                                     // Will set this after created
                designId:                   userContext.designId,
                designVersionId:            userContext.designVersionId,
                designUpdateId:             userContext.designUpdateId,
                scenarioReferenceId:        scenarioReferenceId,

                // Data
                stepType:                   ScenarioStepType.STEP_NEW,
                stepText:                   'set step text here',
                stepFullName:               'NEW Step',
                stepTextRaw:                this.getDefaultRawStepText(),
                // Step index defaults and then is set correctly below

                // State
                devStatus:                  ScenarioStepStatus.STEP_STATUS_UNLINKED,
                updateFocus:                scenarioInScope,
                isRemovable:                true,
                isRemoved:                  false,
                isNew:                      true,
                isChanged:                  false
            },

            (error, result) => {
                if(error){
                    // Error handler
                    //console.log("Insert Scenario Step - Error: " + error);
                } else {
                    //console.log("Insert Scenario Step - Success: " + result);

                    // Update the component reference to be the _id.
                    ScenarioSteps.update(
                        {_id: result},
                        { $set: {stepReferenceId: result}}
                    );

                    // Set the default index for a new component
                    this.setStepIndex(result, scenarioReferenceId, userContext, StepContext.STEP_SCENARIO);

                }
            }
        );

    };

    addDesignScenarioStepFromDev(scenarioReferenceId, userContext, stepType, stepText, stepFullName, stepIndex, mashItemId){

        // A new step is added to the Design from a step defined in a Dev feature file

        let newStepId = ScenarioSteps.insert(
            {
                stepReferenceId:            'TEMP',                                     // Will set this after created
                designId:                   userContext.designId,
                designVersionId:            userContext.designVersionId,
                designUpdateId:             userContext.designUpdateId,
                scenarioReferenceId:        scenarioReferenceId,

                // Data
                stepType:                   stepType,
                stepText:                   stepText,
                stepFullName:               stepFullName,
                stepTextRaw:                this.getDefaultRawStepText(stepText),
                stepIndex:                  stepIndex,

                // State
                devStatus:                  ScenarioStepStatus.STEP_STATUS_UNLINKED,
                updateFocus:                true,
                isRemovable:                true,
                isRemoved:                  false,
                isNew:                      true,
                isChanged:                  false
            },

            (error, result) => {
                if(error){
                    // Error handler
                    //console.log("Insert DEV Scenario Step - Error: " + error);
                } else {
                    //console.log("Insert DEV Scenario Step - Success: " + result);

                    // Update the component reference to be the _id.
                    ScenarioSteps.update(
                        {_id: result},
                        { $set: {stepReferenceId: result}}
                    );

                    // And as we are adding Dev Mash item to the design, need to update the mash item with new design details
                    // Mark this step as linked with correct index and now referencing the new Design item
                    UserAccTestMashData.update(
                        {_id: mashItemId},
                        {
                            $set: {
                                designComponentReferenceId:     result,
                                designScenarioReferenceId:      scenarioReferenceId,
                                designScenarioStepReferenceId:  result,
                                stepTextRaw:                    this.getDefaultRawStepText(stepText),
                                mashItemIndex:                  stepIndex,
                                mashStatus:                     MashStatus.MASH_LINKED,
                                mashTestStatus:                 MashTestStatus.MASH_PENDING,

                            }
                        }
                    );

                }
            }
        );

        return newStepId;

    };

    // Used for data restore only
    importScenarioStep(designId, designVersionId, designUpdateId, step){

        const scenarioStepId = ScenarioSteps.insert(
            {
                // Identity
                stepReferenceId:            step.stepReferenceId,
                componentType:              step.componentType,
                designId:                   designId,                   // New Design Id from import
                designVersionId:            designVersionId,            // New Design Version Id from import
                designUpdateId:             designUpdateId,             // New Design Update Id from import (if an update step)
                scenarioReferenceId:        step.scenarioReferenceId,   // This is preserved across import / export
                stepIndex:                  step.stepIndex,

                // Data
                stepType:                   step.stepType,
                stepText:                   step.stepText,
                stepFullName:               step.stepFullName,
                stepTextRaw:                step.stepTextRaw,

                // State
                devStatus:                  step.devStatus,
                updateFocus:                step.updateFocus,
                isRemovable:                step.isRemovable,
                isRemoved:                  step.isRemoved,
                isNew:                      step.isNew,
                isChanged:                  step.isChanged,
            }
        );

        return scenarioStepId;
    }

    // Set index at the end of the list.  Index is used for drag-drop ordering of steps
    setStepIndex(stepId, parentReferenceId, userItemContext, stepContext){

        // Scenario step has a design update Id if Scenario is in a Design Update
        let designUpdateId = 'NONE';
        if(userItemContext.designUpdateId){
            designUpdateId = userItemContext.designUpdateId;
        }

        // Get the max index of OTHER steps in this feature / scenario
        let otherSteps = null;

        switch(stepContext){
            case StepContext.STEP_FEATURE:
                otherSteps = FeatureBackgroundSteps.find(
                    {
                        _id: {$ne: stepId},
                        designId:               userItemContext.designId,
                        designVersionId:        userItemContext.designVersionId,
                        designUpdateId:         designUpdateId,
                        featureReferenceId:     parentReferenceId
                    },
                    {sort:{stepIndex: -1}
                    }
                );
                break;
            case StepContext.STEP_SCENARIO:
                otherSteps = ScenarioSteps.find(
                    {
                        _id: {$ne: stepId},
                        designId:               userItemContext.designId,
                        designVersionId:        userItemContext.designVersionId,
                        designUpdateId:         designUpdateId,
                        scenarioReferenceId:    parentReferenceId
                    },
                    {sort:{stepIndex: -1}
                    }
                );
                break;
        }

        // If no steps then leave as default
        if(otherSteps.count() > 0){
            //console.log("Highest step is " + otherSteps.fetch()[0].stepText);

            let newIndex = otherSteps.fetch()[0].stepIndex + 100;

            switch(stepContext) {
                case StepContext.STEP_FEATURE:
                    FeatureBackgroundSteps.update(
                        {_id: stepId},
                        {
                            $set: {
                                stepIndex: newIndex
                            }
                        }
                    );
                    break;
                case StepContext.STEP_SCENARIO:
                    ScenarioSteps.update(
                        {_id: stepId},
                        {
                            $set: {
                                stepIndex: newIndex
                            }
                        }
                    );
            }
        }
    };


    updateScenarioStepText(stepId, stepType, newPlainText, newRawText, stepContext){

        switch (stepContext){
            case StepContext.STEP_FEATURE:
                FeatureBackgroundSteps.update(
                    {_id: stepId},
                    {
                        $set:{
                            stepType:                   stepType,
                            stepText:                   newPlainText,
                            stepFullName:               stepType + ' ' + newPlainText,
                            stepTextRaw:                newRawText,
                            isChanged:                  true
                        }
                    },
                    (error, result) => {
                        if(error){
                            //console.log("Error saving Feature Background Step: " + error);
                        } else {
                            //console.log("Feature Background Step Saved " + stepId);
                        }
                    }
                );
                break;
            case StepContext.STEP_SCENARIO:
                ScenarioSteps.update(
                    {_id: stepId},
                    {
                        $set:{
                            stepType:                   stepType,
                            stepText:                   newPlainText,
                            stepFullName:               stepType + ' ' + newPlainText,
                            stepTextRaw:                newRawText,
                            isChanged:                  true
                        }
                    },
                    (error, result) => {
                        if(error){
                            //console.log("Error saving Scenario Step: " + error);
                        } else {
                            //console.log("Scenario Step Saved " + stepId);
                        }
                    }
                );
                break;
        }

    };

    removeScenarioStep(stepId, stepContext){

        switch (stepContext) {
            case StepContext.STEP_FEATURE:
                FeatureBackgroundSteps.remove(
                    {_id: stepId},
                    (error, result) => {
                        if (error) {
                            //console.log("Error removing Feature Background Step: " + error);
                        } else {
                            //console.log("Feature Background Step Removed " + stepId);
                        }
                    }
                );
                break;
            case StepContext.STEP_SCENARIO:
                ScenarioSteps.remove(
                    {_id: stepId},
                    (error, result) => {
                        if (error) {
                            //console.log("Error removing Scenario Step: " + error);
                        } else {
                            //console.log("Scenario Step Removed " + stepId);
                        }
                    }
                );
                break;
        }
    };

    logicalDeleteMashScenarioStep(step, userContext){

        switch(step.mashStatus){
            case MashStatus.MASH_NOT_IMPLEMENTED:

                // A Design Only Step - logically delete the Design Item
                this.logicallyDeleteDesignStep(step.designComponentId, step.stepContext);

                // And delete the Mash item so it disappears immediately - it won't get recreated on next refresh
                this.deleteMashStepItem(step._id);
                break;

            case MashStatus.MASH_LINKED:

                // A linked step - do the same and this will push it into being a Dev Only step
                this.logicallyDeleteDesignStep(step.designComponentId, step.stepContext);

                // And change the item to be Dev only now...
                UserAccTestMashData.update(
                    {_id: step._id},
                    {
                        $set:{
                            mashStatus: MashStatus.MASH_NOT_DESIGNED
                        }
                    }
                );

                break;
            case MashStatus.MASH_NOT_DESIGNED:

                // Dev Only Step - logically delete the step in dev data.  This will cause the step to be deleted from the file on the next export
                this.logicallyDeleteDevStep(step, userContext);

                // And delete the Mash item so it disappears immediately - it won't get recreated on next refresh
                this.deleteMashStepItem(step._id);
                break;
        }

    };

    logicallyDeleteDesignStep(stepId, stepContext){
        switch (stepContext) {
            case StepContext.STEP_FEATURE:
                FeatureBackgroundSteps.update(
                    {_id: stepId},
                    {
                        $set:{
                            isRemoved: true
                        }
                    },
                    (error, result) => {
                        if (error) {
                            //console.log("Error logically deleting Feature Background Step: " + error);
                        } else {
                            //console.log("Feature Background Step logically deleted " + stepId);
                        }
                    }
                );
                break;
            case StepContext.STEP_SCENARIO:
                ScenarioSteps.update(
                    {_id: stepId},
                    {
                        $set:{
                            isRemoved: true
                        }
                    },
                    (error, result) => {
                        if (error) {
                            //console.log("Error logically deleting Scenario Step: " + error);
                        } else {
                            //console.log("Scenario Step logically deleted " + stepId);
                        }
                    }
                );
                break;
        }
    }

    deleteMashStepItem(mashItemId){

        UserAccTestMashData.remove(
            {_id: mashItemId}
        );
    };


    logicallyDeleteDevStep(mashStep, userContext){

        UserDevFeatureScenarioSteps.update(
            {
                userId:                 userContext.userId,
                featureReferenceId:     userContext.featureReferenceId,
                scenarioReferenceId:    userContext.scenarioReferenceId,
                stepType:               mashStep.stepType,
                stepText:               mashStep.stepText
            },
            {
                $set:{
                    isRemoved: true
                }
            },
            (error, result) => {
                if (error) {
                    //console.log("Error logically deleting Dev Scenario Step: " + error);
                } else {
                    //console.log("Dev Scenario Step logically deleted " + mashStep.stepText);
                }
            }
        );
    }



    // Move the component to a new position in its local list
    reorderStep(movingStepId, targetStepId){
        // The new position is always just above the target step

        const movingStep = ScenarioSteps.findOne({_id: movingStepId});
        const targetStep = ScenarioSteps.findOne({_id: targetStepId});

        // Other steps in the list are those in the same design version / update with the same scenario parent
        const peerSteps = ScenarioSteps.find(
            {
                _id: {$ne: movingStepId},
                designId: movingStep.designId,
                designVersionId: movingStep.designVersionId,
                designUpdateId: movingStep.designUpdateId,
                scenarioReferenceId: movingStep.scenarioReferenceId
            },
            {sort:{stepIndex: -1}}
        );

        let indexBelow = targetStep.stepIndex;
        //console.log("Index below = " + indexBelow);

        let indexAbove = 0;                                 // The default if nothing exists above
        const listMaxArrayIndex = peerSteps.count() -1;
        //console.log("List max = " + listMaxArrayIndex);

        const peerArray = peerSteps.fetch();

        // Go through the list of peers (ordered from bottom to top)
        let i = 0;
        while (i <= listMaxArrayIndex){
            if(peerArray[i].stepIndex === targetStep.stepIndex){
                // OK, this is the target component so the next one in the list (if there is one) is the one that will be above the new position
                if(i < listMaxArrayIndex){
                    indexAbove = peerArray[i+1].stepIndex;
                }
                break;
            }
            i++;
        }

        //console.log("Index above = " + indexAbove);

        // The new index is half way between the above an below index - sort of Dewey Decimal system to avoid having to reindex everything every time
        const indexDiff = indexBelow - indexAbove;
        const newIndex = (indexBelow + indexAbove) / 2;

        //console.log("Setting new index for " + movingStepId + " to " + newIndex);

        ScenarioSteps.update(
            {_id: movingStepId},
            {
                $set:{
                    stepIndex: newIndex
                }
            }
        );


        // Over time the indexing differences may get too small to work any more so periodically reset the indexes for this list.
        if(indexDiff < 0.001){
            //console.log("Steps Index reset!");

            // Get the scenario steps in current order
            const resetSteps = ScenarioSteps.find(
                {
                    designId: movingStep.designId,
                    designVersionId: movingStep.designVersionId,
                    designUpdateId: movingStep.designUpdateId,
                    scenarioReferenceId: movingStep.scenarioReferenceId
                },
                {sort:{stepIndex: 1}}
            );

            let resetIndex = 100;

            // Reset them to 100, 200, 300 etc...
            resetSteps.forEach((step) => {
                ScenarioSteps.update(
                    {_id: step._id},
                    {
                        $set:{
                            stepIndex: resetIndex
                        }
                    }
                );

                resetIndex = resetIndex + 100;
            })
        }


    }

}

export default new ScenarioServices();