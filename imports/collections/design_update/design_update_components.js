/**
 * Created by aston on 13/09/2016.
 */

import { Mongo } from 'meteor/mongo';

import { UpdateScopeType } from '../../constants/constants.js';

export const DesignUpdateComponents = new Mongo.Collection('designUpdateComponents');

let Schema = new SimpleSchema({
    // Identity
    componentReferenceId:           {type: String, index: 1},                           // A unique ID that persists across design updates
    designId:                       {type: String},                                     // Denormalisation for easy access of design id
    designVersionId:                {type: String},                                     // The design version this is a change to
    designUpdateId:                 {type: String},                                     // The id of the update this relates to
    componentType:                  {type: String},                                     // Feature, Scenario, Scenario Step etc
    componentLevel:                 {type: Number, defaultValue: 0},                    // Level of nested section items
    componentParentReferenceIdOld:  {type: String, defaultValue: 'NONE'},               // A unique ID that persists across design updates
    componentParentReferenceIdNew:  {type: String, defaultValue: 'NONE', index: 1},     // A unique ID that persists across design updates - after move
    componentFeatureReferenceIdOld: {type: String, defaultValue: 'NONE'},               // If a component is part of a feature this is set
    componentFeatureReferenceIdNew: {type: String, defaultValue: 'NONE', index: 1},     // If a component is part of a feature this is set - after move
    componentIndexOld:              {type: Number, decimal: true, defaultValue: 1000000},  // Used for ordering
    componentIndexNew:              {type: Number, decimal: true, defaultValue: 1000000},  // Used for ordering

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

    // Update State
    isNew:                          {type: Boolean, defaultValue: true},                // New item added
    isChanged:                      {type: Boolean, defaultValue: false},               // Significant detail changed in this update - i.e. the name
    isTextChanged:                  {type: Boolean, defaultValue: false},               // Text notes changed in this update
    isMoved:                        {type: Boolean, defaultValue: false},               // Item moved in this update
    isRemoved:                      {type: Boolean, defaultValue: false} ,              // Removed in this update
    isRemovedElsewhere:             {type: Boolean, defaultValue: false} ,              // Removed in a parallel update
    isDevUpdated:                   {type: Boolean, defaultValue: false},               // Flag to indicate an item (Scenario) that has been updated by a developer
    isDevAdded:                     {type: Boolean, defaultValue: false},               // Flag to indicate an item (Scenario) that has been added by a developer
    workPackageId:                  {type: String, defaultValue: 'NONE'},               // For Scenarios, the Work Package containing the Scenario

    // Editing state (shared and persistent)
    isRemovable:                    {type: Boolean, defaultValue: true} ,               // Flag to indicate if current component can be deleted
    isScopable:                     {type: Boolean},                                    // Indicates that a component can have scope set for it and whether we think changes are significant
    scopeType:                      {type: String, defaultValue: UpdateScopeType.SCOPE_OUT_SCOPE},  // Indicates if item is in full, parent or peer scope in an update
    lockingUser:                    {type: String, defaultValue: 'NONE'},               // Indicates if a component is locked for edit by a user


});

DesignUpdateComponents.attachSchema(Schema);

// Publish Design Updates wanted
if(Meteor.isServer){
    Meteor.publish('designUpdateComponents', function designUpdateComponentsPublication(designVersionId){
        return DesignUpdateComponents.find({designVersionId: designVersionId});
    })
}