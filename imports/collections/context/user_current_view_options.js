


export const UserCurrentViewOptions = new Mongo.Collection('userCurrentViewOptions');

// Stores the display options for the major screens

let Schema = new SimpleSchema({
    userId:                     {type: String},                             // Meteor user id
    // Base Design Screen - Design always visible
    designDetailsVisible:       {type: Boolean, defaultValue: true},        // The details pane
    designTestSummaryVisible:   {type: Boolean, defaultValue: false},       // Test Summary add-on
    designDomainDictVisible:    {type: Boolean, defaultValue: true},        // Domain Dictionary pane
    // Design Update Screen - Scope and Design always visible
    updateDetailsVisible:       {type: Boolean, defaultValue: true},        // The details pane
    updateTestSummaryVisible:   {type: Boolean, defaultValue: false},       // Test Summary add-on
    updateDomainDictVisible:    {type: Boolean, defaultValue: false},       // Domain Dictionary pane
    // Work package editor - Scope and Design always visible
    wpDetailsVisible:           {type: Boolean, defaultValue: true},        // The details pane
    wpDomainDictVisible:        {type: Boolean, defaultValue: false},       // Domain Dictionary pane
    // Developer Screen - Design always visible
    devDetailsVisible:          {type: Boolean, defaultValue: false},       // The details pane
    devAccTestsVisible:         {type: Boolean, defaultValue: true},        // Acceptance Tests view
    devIntTestsVisible:         {type: Boolean, defaultValue: true},        // Integration Tests view
    devModTestsVisible:         {type: Boolean, defaultValue: false},       // Unit Tests view
    devTestSummaryVisible:      {type: Boolean, defaultValue: false},       // Test Summary add-on
    devFeatureFilesVisible:     {type: Boolean, defaultValue: true},        // Feature Files view
    devDomainDictVisible:       {type: Boolean, defaultValue: false},       // Domain Dictionary pane

});

UserCurrentViewOptions.attachSchema(Schema);

// Publish
if(Meteor.isServer){
    Meteor.publish('userCurrentViewOptions', function userCurrentViewOptionsPublication(){
        return UserCurrentViewOptions.find({});
    })
}
