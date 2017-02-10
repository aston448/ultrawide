/**
 * Scenario Step Data Store.  This is specification of the scenario by example
 */

import { Mongo} from 'meteor/mongo';

import {ComponentType} from '../../constants/constants.js';

export const ScenarioSteps = new Mongo.Collection('scenarioSteps');

let Schema = new SimpleSchema({
    // Identity
    stepReferenceId:            {type: String},                                     // A unique ID that persists across design updates
    componentType:              {type: String, defaultValue: ComponentType.SCENARIO_STEP},  // Provides a common identifier with other design components
    designId:                   {type: String},                                     // Denormalisation for easy access of design id
    designVersionId:            {type: String},                                     // Identifies the design version of this step
    designUpdateId:             {type: String, defaultValue: 'NONE'},               // Identifies the design update of this step (if any)
    scenarioReferenceId:        {type: String},                                     // Reference to the unchanging parent id across updates
    stepIndex:                  {type: Number, decimal: true, defaultValue: 100000},  // Used for ordering - big so always at bottom of list

    // Data
    stepType:                   {type: String},                                     // GIVEN, WHEN, THEN etc
    stepText:                   {type: String},                                     // Unique functional text - plain text
    stepFullName:               {type: String},                                     // Type + Text
    stepTextRaw:                {type: Object, blackbox: true, optional: true},     // Unique functional text - rich text

    // State
    devStatus:                  {type: String},                                     // Indicates how this step is linked to code
    updateFocus:                {type: Boolean, defaultValue: false},               // True for update scenario steps for an in-focus scenario
    isRemovable:                {type: Boolean, defaultValue: true},                // Flag to indicate if current component can be deleted
    isRemoved:                  {type: Boolean, defaultValue: false},               // Flag to indicate the current component is deleted
    isNew:                      {type: Boolean, defaultValue: true},                // Flag to indicate a new item which should be editable by default
    isChanged:                  {type: Boolean, defaultValue: true},                // Flag to indicate a new item which should be editable by default
});

ScenarioSteps.attachSchema(Schema);



// Publish Design Components
if(Meteor.isServer){

    Meteor.publish('scenarioSteps', function scenarioStepsPublication(designVersionId){
        return ScenarioSteps.find({designVersionId: designVersionId});
    })
}