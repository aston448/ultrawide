
import { Meteor } from 'meteor/meteor';

import  MashDataServices     from '../servicers/mash_data_services.js';

// Meteor methods
Meteor.methods({

    'mash.loadUserFeatureFileData'(userContext){
        MashDataServices.loadUserFeatureFileData(userContext);
    },

    'mash.createFeatureMashData'(userContext){
        MashDataServices.createFeatureMashData(userContext);
    },

    'mash.createScenarioMashData'(userContext){
        MashDataServices.createScenarioMashData(userContext);
    },

    'mash.createScenarioStepMashData'(userContext){
        MashDataServices.createScenarioStepMashData(userContext);
    },

});

