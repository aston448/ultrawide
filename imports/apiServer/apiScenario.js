import { Meteor } from 'meteor/meteor';

import {ComponentType} from '../constants/constants.js'
import  ScenarioServices        from '../servicers/design/scenario_services.js';


// Meteor methods
Meteor.methods({

    'scenario.addNewFeatureBackgroundStep'(featureReferenceId, userItemContext, featureInScope){

        //console.log('Adding new Feature Background Step');
        ScenarioServices.addNewFeatureBackgroundStep(featureReferenceId, userItemContext, featureInScope)

    },

    'scenario.addNewScenarioStep'(scenarioReferenceId, userItemContext, scenarioInScope){

        //console.log('Adding new Scenario Step');
        ScenarioServices.addNewScenarioStep(scenarioReferenceId, userItemContext, scenarioInScope)

    },

    'scenario.updateScenarioStepText'(stepId, stepType, newPlainText, newRawText, stepContext){

        //console.log('Updating Scenario Step Text to ' + newPlainText);
        ScenarioServices.updateScenarioStepText(stepId, stepType, newPlainText, newRawText, stepContext)

    },

    'scenario.removeScenarioStep'(stepId, stepContext){

        //console.log('Removing step ' + stepId);
        ScenarioServices.removeScenarioStep(stepId, stepContext)

    },

    'scenario.logicalDeleteMashScenarioStep'(step, userContext){
        //console.log('Logically Deleting step ' + step.mashItemName);
        ScenarioServices.logicalDeleteMashScenarioStep(step, userContext)
    },

    // Move a step to a new position in its current scenario
    'scenario.reorderStep'(movingStepId, targetStepId){

        ScenarioServices.reorderStep(movingStepId, targetStepId);

    },


});
