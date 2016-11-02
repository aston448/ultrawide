
import { Meteor } from 'meteor/meteor';

import  MashDataServices     from '../servicers/mash_data_services.js';

// Meteor methods
Meteor.methods({

    'mash.loadUserFeatureFileData'(userContext, filePath){
        MashDataServices.loadUserFeatureFileData(userContext, filePath);
    },

    'mash.createMashData'(userContext){
        MashDataServices.createDesignDevMashData(userContext);
    },

    'mash.updateTestData'(userContext, resultsPath){
        MashDataServices.updateTestData(userContext, resultsPath);
    },

    'mash.updateMovedDesignStep'(designMashItemId){
        MashDataServices.updateMovedDesignStep(designMashItemId);
    },

    'mash.updateMovedDevStep'(devMashItemId, targetMashItemId, userContext){
        MashDataServices.updateMovedDevStep(devMashItemId, targetMashItemId, userContext);
    },

    'mash.exportScenario'(scenarioReferenceId, userContext){
        MashDataServices.exportScenario(scenarioReferenceId, userContext)
    },

    'mash.exportFeatureConfiguration'(userContext){
        MashDataServices.exportFeatureConfiguration(userContext);
    }

});

