import { Meteor } from 'meteor/meteor';

import { Designs }                  from '../../imports/collections/design/designs.js';

Meteor.methods({

    'check.newDesignExists'(){

        let designs = Designs.find({}).count();

        let design = Designs.findOne({
            designName: 'New Design',

        });

        if(!((designs == 1) && design)){
            return false;
        }

        return true;
    },


});
