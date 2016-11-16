import { Meteor } from 'meteor/meteor';

import { Designs }                  from '../../imports/collections/design/designs.js';

import  ClientDesignServices    from '../../imports/apiClient/apiClientDesign.js'

Meteor.methods({

    'testDesigns.addNewDesign'(role){
        ClientDesignServices.addNewDesign(role);
    },

    'testDesigns.updateDesignName'(role, existingName, newName){

        const design = Designs.findOne({designName: existingName});

        ClientDesignServices.saveDesignName(role, design._id, newName);

    }

});