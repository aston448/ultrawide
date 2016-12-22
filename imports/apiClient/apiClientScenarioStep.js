// == IMPORTS ==========================================================================================================

// Meteor / React Services
import { Meteor } from 'meteor/meteor';

// Ultrawide Collections
import {ScenarioSteps} from '../collections/design/scenario_steps.js';
import {FeatureBackgroundSteps} from '../collections/design/feature_background_steps.js';

// Ultrawide Services
import { ViewType, ViewMode, DisplayContext, StepContext, LogLevel} from '../constants/constants.js';
import {reorderDropAllowed, log} from '../common/utils.js';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Client Scenario Steps Services - Supports client calls for actions relating to Scenario Steps
//
// This class is the test entry point when not testing through the GUI.
// Most functions validate and return true / false according to business rules even if there is implicit validation in the GUI
// (E.g. buttons not being visible if action invalid)
//
// ---------------------------------------------------------------------------------------------------------------------

class ClientScenarioStepServices {

    // User has added a new Feature background step
    addNewBackgroundStep(view, mode, featureReferenceId, userItemContext, featureInScope){
        // Validate - can only add if design is editable and for in-scope update features
        log((msg)=> console.log(msg), LogLevel.DEBUG, "Adding feature step with view: {} and mode: {} and in scope: {}", view, mode , featureInScope);

        if((view === ViewType.DESIGN_NEW_EDIT  || view === ViewType.DESIGN_UPDATE_EDIT) && mode === ViewMode.MODE_EDIT && featureInScope){
            Meteor.call('scenario.addNewFeatureBackgroundStep', featureReferenceId, userItemContext, featureInScope);
            return true;
        } else {
            return false;
        }
    }

    // User has added a new Scenario step
    addNewScenarioStep(view, mode, scenarioReferenceId, userItemContext, scenarioInScope){

        // Validate - can only add if design is editable and for in-scope update scenarios
        log((msg)=> console.log(msg), LogLevel.DEBUG, "Adding scenario step with view: {} and mode: {} and in scope: {}", view, mode , scenarioInScope);

        if((view === ViewType.DESIGN_NEW_EDIT  || view === ViewType.DESIGN_UPDATE_EDIT) && mode === ViewMode.MODE_EDIT && scenarioInScope){
            Meteor.call('scenario.addNewScenarioStep', scenarioReferenceId, userItemContext, scenarioInScope);
            return true;
        } else {
            return false;
        }

    };

    // Designer has chosen to delete a Scenario Step while creating the design
    removeScenarioStep(view, mode, parentInScope, stepId, stepContext){

        // Validate - can only remove if design is editable and for in-scope update scenarios
        log((msg)=> console.log(msg), LogLevel.DEBUG, "Removing scenario step with view: {} and mode: {} and in scope: {}", view, mode , parentInScope);

        if((view === ViewType.DESIGN_NEW_EDIT  || view === ViewType.DESIGN_UPDATE_EDIT) && mode === ViewMode.MODE_EDIT && parentInScope) {
            Meteor.call('scenario.removeScenarioStep', stepId, stepContext);
        } else {
            return false;
        }
    };

    // A user has decided to remove an unwanted Scenario Step from the Design-Dev Mash
    logicalDeleteMashScenarioStep(view, mode, step, userContext){

        // Validate - must be in the Mash View
        if(view === ViewType.DEVELOP_BASE_WP || view === ViewType.DEVELOP_UPDATE_WP){
            Meteor.call('scenario.logicalDeleteMashScenarioStep', step, userContext);
            return true;
        } else {
            return false;
        }
    }

    // User edited and saved Scenario Step text
    updateScenarioStepText(view, mode, parentInScope, stepId, stepType, newPlainText, newRawText, stepContext){

        log((msg)=> console.log(msg), LogLevel.DEBUG, "Saving scenario step {} text with view: {} and mode: {} and in scope: {}", stepId, view, mode , parentInScope);
        // Validate - can only update if design is editable and for in-scope update scenarios
        if((view === ViewType.DESIGN_NEW_EDIT  || view === ViewType.DESIGN_UPDATE_EDIT) && mode === ViewMode.MODE_EDIT && parentInScope){
            log((msg)=> console.log(msg), LogLevel.DEBUG, "Saving scenario step text {} with context {}", newRawText.blocks[0].text, stepContext);

            Meteor.call('scenario.updateScenarioStepText', stepId, stepType, newPlainText, newRawText, stepContext);
            return true;
        } else {
            return false;
        }

    }

    // User dragged a step to a new position in the scenario steps list
    reorderComponent(view, mode, context, movingComponent, targetComponent){

        log((msg) => console.log(msg), LogLevel.TRACE, "Moving scenario step.  View: {} Mode: {} Context: {}", view, mode, context);

        // Validation - must be editing new design in edit mode and component must be allowed to drop...
        if(view === ViewType.DESIGN_NEW_EDIT && mode === ViewMode.MODE_EDIT && context === DisplayContext.BASE_EDIT &&
            reorderDropAllowed(
                movingComponent,
                targetComponent)
        ){
            // The target component is the one in the list above which the drop will be made
            Meteor.call('scenario.reorderStep', movingComponent._id, targetComponent._id);
            return true;
        } else {
            return false;
        }
    };

    getSuggestedScenarioSteps(designId, currentStepId, currentInputText, stepContext, callback){

        //console.log("Getting matching steps for: " + currentInputText + " and current step id " + currentStepId);

        let potentialSteps = null;

        switch(stepContext){
            case StepContext.STEP_FEATURE:
                potentialSteps = FeatureBackgroundSteps.find(
                    {
                        _id: {$ne: currentStepId},
                        designId: designId,
                    }
                );
                break;
            case StepContext.STEP_SCENARIO:
                potentialSteps = ScenarioSteps.find(
                    {
                        _id: {$ne: currentStepId},
                        designId: designId,
                    }
                );
                break;
        }

        let matchingSteps = new Mongo.Collection(null);

        let alreadyMatched = null;

        potentialSteps.forEach((step) => {

            // Don't add steps we already have...  IMPORTANT - must not be reactive or causes infinite loop!
            alreadyMatched = matchingSteps.find({stepText: step.stepText}, {reactive: false});

            if(alreadyMatched.count() === 0) {

                let searchRegex = new RegExp(currentInputText, 'g');
                let matchArr = [];

                //console.log("Matching step: " + step.stepText);
                matchArr = searchRegex.exec(step.stepText);


                if(matchArr){
                    //console.log("Matched step: " + step.stepText);

                    matchingSteps.insert(
                        {
                            stepText: step.stepText
                        }
                    )
                }
            }
        });


        return({
            suggestedSteps: matchingSteps.find({}).fetch(),
            callback: callback
        })

    }

}

export default new ClientScenarioStepServices();