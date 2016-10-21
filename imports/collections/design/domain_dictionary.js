import { Mongo } from 'meteor/mongo';

export const DomainDictionary = new Mongo.Collection('domainDictionary');

let Schema = new SimpleSchema({
    designId:               {type: String},                                     // Design to which this term belongs
    designVersionId:        {type: String},                                     // Design version to which this definition belongs
    domainTermOld:          {type: String},                                     // The Term (old version)
    domainTermNew:          {type: String},                                     // The Term (new version after change)
    domainTextRaw:          {type: Object, blackbox: true, optional: true},     // Definition text
    sortingName:            {type: String},                                     // A hidden name that is used to sort the dictionary - keeps new items at the bottom
    markInDesign:           {type: Boolean, defaultValue: true},                // Whether or not to highlight term in Design
    isNew:                  {type: Boolean, defaultValue: true},                // True for newly added terms until definition provided
    isChanged:              {type: Boolean, defaultValue: false}                // True for existing terms whose term name is changed (not the text)
});

DomainDictionary.attachSchema(Schema);

// Publish Domain Dictionary Items
if(Meteor.isServer){
    Meteor.publish('domainDictionary', function domainDictionaryPublication(){
        return DomainDictionary.find({});
    })
}

