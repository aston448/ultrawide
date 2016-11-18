/**
 * Created by aston on 03/07/2016.
 */

import { Meteor } from 'meteor/meteor';

// Set up some dummy data
Meteor.startup(() => {
    if(Meteor.isServer){
        Meteor.call('fixtures.startup');
    }
});


