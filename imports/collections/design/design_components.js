/**
 *
 * A Design Component is a sub section of a design.  It can be functional (e.g. Feature) or organisational (e.g. Design Section)
 * Components are:
 *      DESIGN_SECTION
 *      FEATURE
 *      FEATURE_ASPECT
 *      SCENARIO
 */

import { Mongo } from 'meteor/mongo';

export const DesignComponents = new Mongo.Collection('designComponents');

let Schema = new SimpleSchema({
    // Identity
    componentReferenceId:       {type: String},                                     // A unique ID that persists across design updates
    designId:                   {type: String},                                     // Denormalisation for easy access of design id
    designVersionId:            {type: String},                                     // Identifies the design and version of this component
    componentType:              {type: String},                                     // Type of component for internal reference
    componentLevel:             {type: Number, defaultValue: 0},                    // Level indicator for nested sections
    componentParentId:          {type: String},                                     // Position of item in design hierarchy
    componentParentReferenceId: {type: String},                                     // Reference to the unchanging parent id across updates
    componentFeatureReferenceId:{type: String, defaultValue: 'NONE'},               // If a component is part of a feature this is set
    componentIndex:             {type: Number, decimal: true, defaultValue: 100000},  // Used for ordering

    // Data
    componentName:              {type: String},                                     // Unique functional name of the component - plain text
    componentNameRaw:           {type: Object, blackbox: true, optional: true},     // Unique functional name of the component - rich text
    componentNarrative:         {type: String, optional: true},                     // Narrative - plain text - base version
    componentNarrativeRaw:      {type: Object, blackbox: true, optional: true},     // Narrative - rich text - base version
    componentTextRaw:           {type: Object, blackbox: true, optional: true},     // Descriptive text relating to this component

    // State (shared and persistent only)
    isRemovable:                {type: Boolean, defaultValue: true} ,               // Flag to indicate if current component can be deleted
    isRemoved:                  {type: Boolean, defaultValue: false} ,              // Flag to indicate the current component is deleted
    isNew:                      {type: Boolean, defaultValue: true},                // Flag to indicate a new item which should be editable by default
    lockingUser:                {type: String, defaultValue: 'NONE'},               // Indicates if a component is locked for edit by a user
    designUpdateId:             {type: String, optional: true}                      // For scenarios only, set when component is in an update as can only be in one
});

DesignComponents.attachSchema(Schema);

// Publish Design Components
if(Meteor.isServer){
    Meteor.publish('designComponents', function designComponentsPublication(){
        return DesignComponents.find({});
    })
}