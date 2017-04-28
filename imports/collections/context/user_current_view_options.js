


export const UserCurrentViewOptions = new Mongo.Collection('userCurrentViewOptions');

// Stores the display options for the major screens

let Schema = new SimpleSchema({
    userId:                     {type: String},                             // Meteor user id
    // All screens
    designDetailsVisible:       {type: Boolean, defaultValue: false},        // The details pane
    designDomainDictVisible:    {type: Boolean, defaultValue: false},        // Domain Dictionary pane
    testSummaryVisible:         {type: Boolean, defaultValue: false},       // Test Summary add-on
    // Design Updates specific
    updateProgressVisible:      {type: Boolean, defaultValue: false},       // The merged version pane
    updateSummaryVisible:       {type: Boolean, defaultValue: false},        // Update Summary pane
    // Test Specific
    devAccTestsVisible:         {type: Boolean, defaultValue: false},        // Acceptance Tests view
    devIntTestsVisible:         {type: Boolean, defaultValue: false},        // Integration Tests view
    devUnitTestsVisible:        {type: Boolean, defaultValue: false},       // Unit Tests view
    devFeatureFilesVisible:     {type: Boolean, defaultValue: false},        // Feature Files view
    // Tabs or Panes
    designShowAllAsTabs:        {type: Boolean, defaultValue: false},       // Show all available in Design screen as tabs
    updateShowAllAsTabs:        {type: Boolean, defaultValue: false},       // Show all available in Update screen as tabs
    workShowAllAsTabs:          {type: Boolean, defaultValue: false},       // Show all available in Work Package screen as tabs
});

UserCurrentViewOptions.attachSchema(Schema);

// Publish
if(Meteor.isServer){
    Meteor.publish('userCurrentViewOptions', function userCurrentViewOptionsPublication(){
        return UserCurrentViewOptions.find({});
    })
}
