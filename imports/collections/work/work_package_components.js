
import { Mongo } from 'meteor/mongo';

import {WorkPackageScopeType} from '../../constants/constants.js';

// A Work Package Component is the key to a real design or design update component
// They do not provide data, just a marker for how the actual components are selected and displayed

export const WorkPackageComponents = new Mongo.Collection('workPackageComponents');

let Schema = new SimpleSchema({
    // Identity
    designVersionId:            {type: String},                                         // The Design Version for which this is a WP
    workPackageId:              {type: String},                                         // The WP containing this component
    workPackageType:            {type: String},                                         // Either Base Version Implementation or Design Update Implementation
    componentId:                {type: String},                                         // The local reference to the component in the DV / DU
    componentReferenceId:       {type: String},                                         // The unique reference to the component
    componentParentReferenceId: {type: String},                                         // The unique reference to the component parent
    componentFeatureReferenceId:{type: String, defaultValue: 'NONE'},                   // If a component is part of a feature this is set
    componentType:              {type: String},                                         // Application, Design Section, Feature etc.
    componentIndex:             {type: Number, decimal: true, defaultValue: 100000},    // Used for ordering

    // Status
    scopeType:                  {type: String, defaultValue: WorkPackageScopeType.SCOPE_NONE}  // Whether active or a parent in the WP
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

