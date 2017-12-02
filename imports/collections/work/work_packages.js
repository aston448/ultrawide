
import { Mongo } from 'meteor/mongo';

import {WorkPackageStatus, WorkPackageTestStatus} from '../../constants/constants.js';

// A Work Package is one or more Scenarios in a base Design Version or Design Update that can be assigned to a developer to implement

export const WorkPackages = new Mongo.Collection('workPackages');

let Schema = new SimpleSchema({
    designVersionId:            {type: String},                                                         // The Design Version this WP relates to
    designUpdateId:             {type: String, defaultValue: 'NONE'},                                   // The Design Update this WP relates to (if any)
    workPackageType:            {type: String},                                                         // Either Base Version Implementation or Design Update Implementation
    workPackageName:            {type: String},                                                         // Identifier of this work package
    workPackageRawText:         {type: Object, blackbox: true, optional: true},                         // Text descriptive of this package
    workPackageStatus:          {type: String, defaultValue: WorkPackageStatus.WP_NEW},                 // Indicates if this WP is adoptable yet or not and when it is in use or considered complete
    workPackageTestStatus:      {type: String, defaultValue: WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE},
    adoptingUserId:             {type: String, defaultValue: 'NONE'}
});

WorkPackages.attachSchema(Schema);

// Publish Work Packages wanted
if(Meteor.isServer){
    Meteor.publish('workPackages', function workPackagesPublication(){
        return WorkPackages.find({});
    })
}
