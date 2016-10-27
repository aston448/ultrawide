
import { Meteor } from 'meteor/meteor';

import  MashDataServices     from '../servicers/mash_data_services.js';

// Meteor methods
Meteor.methods({

    'mash.loadUserFeatureFileData'(userContext, filePath){
        MashDataServices.loadUserFeatureFileData(userContext, filePath);
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

    'mash.updateTestData'(userContext, resultsPath){
        MashDataServices.updateTestData(userContext, resultsPath);
    }

});

