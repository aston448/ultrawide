import { Mongo } from 'meteor/mongo';
import { UpdateMergeStatus} from '../../constants/constants.js';

export const DesignVersionComponents = new Mongo.Collection('designVersionComponents');

let Schema = new SimpleSchema({
    // Identity
    componentReferenceId:           {type: String, index: 1},                           // A unique ID that persists across design versions
    designId:                       {type: String},                                     // Denormalisation for easy access of design id
    designVersionId:                {type: String},                                     // The design version this is a change to
    componentType:                  {type: String, index: 1},                           // App, Section, Feature, Feature Aspect, Scenario
    componentLevel:                 {type: Number, defaultValue: 0},                    // Level of nested section items

    // Location
    //componentParentIdOld:           {type: String},                                     // Position of item in design hierarchy
    //componentParentIdNew:           {type: String, index: 1},                           // Position of item in design hierarchy - after move
    componentParentReferenceIdOld:  {type: String, defaultValue: 'NONE'},               // A unique ID that persists across design versions
    componentParentReferenceIdNew:  {type: String, defaultValue: 'NONE', index: 1},     // A unique ID that persists across design versions - after move
    componentFeatureReferenceIdOld: {type: String, defaultValue: 'NONE'},               // If a component is part of a feature this is set
    componentFeatureReferenceIdNew: {type: String, defaultValue: 'NONE', index: 1},     // If a component is part of a feature this is set - after move
    componentIndexOld:              {type: Number, decimal: true, defaultValue: 100000},  // Used for ordering
    componentIndexNew:              {type: Number, decimal: true, defaultValue: 100000},  // Used for ordering

    // Data
    componentNameOld:               {type: String},                                     // Name - plain text - base version
    componentNameNew:               {type: String},                                     // Name - plain text - new version
    componentNameRawOld:            {type: Object, blackbox: true, optional: true},     // Name - rich text - base version
    componentNameRawNew:            {type: Object, blackbox: true, optional: true},     // Name - rich text - new version
    componentNarrativeOld:          {type: String, optional: true},                     // Narrative - plain text - base version
    componentNarrativeNew:          {type: String, optional: true},                     // Narrative - plain text - new version
    componentNarrativeRawOld:       {type: Object, blackbox: true, optional: true},     // Narrative - rich text - base version
    componentNarrativeRawNew:       {type: Object, blackbox: true, optional: true},     // Narrative - rich text - new version
    componentTextRawOld:            {type: Object, blackbox: true, optional: true},     // Descriptive text relating to this component - base version
    componentTextRawNew:            {type: Object, blackbox: true, optional: true},     // Descriptive text relating to this component - new version

    // Component State
    isNew:                          {type: Boolean, defaultValue: true},                // Flag to indicate a new item which should be editable by default
    workPackageId:                  {type: String, defaultValue: 'NONE', index: 1},     // For Scenarios, the Work Package containing the Scenario
    updateMergeStatus:              {type: String, defaultValue: UpdateMergeStatus.COMPONENT_BASE}, // Indicates how the component was changed from the previous version
    isDevUpdated:                   {type: Boolean, defaultValue: false},               // Flag to indicate an item (Scenario) that has been updated by a developer
    isDevAdded:                     {type: Boolean, defaultValue: false},               // Flag to indicate an item (Scenario) that has been added by a developer

    // Editing state (shared and persistent)
    isRemovable:                    {type: Boolean, defaultValue: true} ,               // Flag to indicate if current component can be deleted


});

//DesignVersionComponents.createIndex({componentReferenceId: 1});

DesignVersionComponents.attachSchema(Schema);


// Publish Design Updates wanted
if(Meteor.isServer){
    Meteor.publish('designVersionComponents', function designVersionComponentsPublication(designVersionId){
        return DesignVersionComponents.find({designVersionId: designVersionId});
    })
}
