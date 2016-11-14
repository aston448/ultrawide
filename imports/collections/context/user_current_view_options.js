


export const UserCurrentViewOptions = new Mongo.Collection('userCurrentViewOptions');

// Stores the display options for the major screens

let Schema = new SimpleSchema({
    userId:                     {type: String},                             // Meteor user id
    // Base Design Screen - Design always visible
    designDetailsVisible:       {type: Boolean, defaultValue: true},        // The details pane
    designAccTestsVisible:      {type: Boolean, defaultValue: false},       // Acceptance Tests view
    designUnitTestsVisible:     {type: Boolean, defaultValue: false},       // Unit Tests view
    designDomainDictVisible:    {type: Boolean, defaultValue: true},       // Domain Dictionary pane
    // Design Update Screen - Scope and Design always visible
    updateDetailsVisible:       {type: Boolean, defaultValue: true},        // The details pane
    updateAccTestsVisible:      {type: Boolean, defaultValue: false},       // Acceptance Tests view
    updateUnitTestsVisible:     {type: Boolean, defaultValue: false},       // Unit Tests view
    updateDomainDictVisible:    {type: Boolean, defaultValue: false},       // Domain Dictionary pane
    // Work package editor - Scope and Design always visible
    wpDetailsVisible:           {type: Boolean, defaultValue: true},        // The details pane
    wpDomainDictVisible:        {type: Boolean, defaultValue: false},       // Domain Dictionary pane
    // Developer Screen - Design always visible
    devDetailsVisible:          {type: Boolean, defaultValue: false},       // The details pane
    devAccTestsVisible:         {type: Boolean, defaultValue: true},        // Acceptance Tests view
    devUnitTestsVisible:        {type: Boolean, defaultValue: false},       // Unit Tests view
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
