import { Mongo } from 'meteor/mongo';


export const DefaultFeatureAspects = new Mongo.Collection('defaultFeatureAspects');


let Schema = new SimpleSchema({
    designId:               {type: String},                                         // Default aspects apply to an entire design
    defaultAspectName:      {type: String, optional: true},
    defaultAspectNameRaw:   {type: Object, blackbox: true, optional: true},
    defaultAspectIncluded:  {type: Boolean, defaultValue: false},
    defaultAspectIndex:     {type: Number}
});

DefaultFeatureAspects.attachSchema(Schema);

// Publish Design Versions wanted
if(Meteor.isServer){
    Meteor.publish('defaultFeatureAspects', function defaultFeatureAspectsPublication(){
        return DefaultFeatureAspects.find({});
    })
}
