
import { Mongo } from 'meteor/mongo';

import {WorkPackageScopeType, WorkPackageReviewType} from '../../constants/constants.js';

// A Work Package Component is the key to a real design or design update component
// They do not provide data, just a marker for how the actual components are selected and displayed

export const WorkPackageComponents = new Mongo.Collection('workPackageComponents');

let Schema = new SimpleSchema({
    // Identity
    designVersionId:            {type: String},                                         // The Design Version for which this is a WP
    designUpdateId:             {type: String, defaultValue: 'NONE'},                   // The Design Update for which this is a WP (if any)
    workPackageId:              {type: String, index: 1},                               // The WP containing this component
    workPackageType:            {type: String},                                         // Either Base Version Implementation or Design Update Implementation
    componentReferenceId:       {type: String, index: 1},                               // The unique reference to the component
    componentParentReferenceId: {type: String, index: 1},                               // The unique reference to the component parent
    componentFeatureReferenceId:{type: String, defaultValue: 'NONE', index: 1},         // If a component is part of a feature this is set
    componentType:              {type: String, index: 1},                               // Application, Design Section, Feature etc.
    componentIndex:             {type: Number, decimal: true, defaultValue: 100000},    // Used for ordering

    // Status
    scopeType:                  {type: String, defaultValue: WorkPackageScopeType.SCOPE_NONE},  // Whether active or a parent in the WP
    reviewStatus:               {type: String, defaultValue: WorkPackageReviewType.REVIEW_NONE}
});

WorkPackageComponents.attachSchema(Schema);

// Publish Work Package Components wanted
if(Meteor.isServer){
    Meteor.publish('workPackageComponents', function workPackageComponentsPublication(designVersionId){
        return WorkPackageComponents.find({
            designVersionId: designVersionId
        });
    })
}

