import { Mongo } from 'meteor/mongo';
import { DesignAnomalyStatus } from '../../constants/constants.js';
import {DefaultRawContent} from "../../constants/default_names";

export const DesignAnomalies = new Mongo.Collection('designAnomalies');

let Schema = new SimpleSchema({
    designVersionId:                {type: String},
    featureReferenceId:             {type: String},
    scenarioReferenceId:            {type: String, defaultValue: 'NONE'},
    designAnomalyName:              {type: String},
    designAnomalyRawText:           {type: Object, blackbox: true, defaultValue: DefaultRawContent},
    designAnomalyLink:              {type: String, defaultValue: 'NONE'},
    designAnomalyStatus:            {type: String, defaultValue: DesignAnomalyStatus.ANOMALY_NEW},
    assignedUserId:                 {type: String, defaultValue: 'NONE'},
});

DesignAnomalies.attachSchema(Schema);

// Publish Design Versions wanted
if(Meteor.isServer){
    Meteor.publish('designAnomalies', function designAnomaliesPublication(designVersionId){
        return DesignAnomalies.find({designVersionId: designVersionId});
    })
}
