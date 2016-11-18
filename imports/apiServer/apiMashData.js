
import { Meteor } from 'meteor/meteor';

import  MashDataServices            from '../servicers/dev/mash_data_services.js';
import  IntegrationTestServices     from '../servicers/dev/integration_test_services.js';

// Meteor methods
Meteor.methods({

    'mash.loadUserFeatureFileData'(userContext, filePath){
        MashDataServices.loadUserFeatureFileData(userContext, filePath);
    },

    'mash.createMashData'(userContext){
        MashDataServices.createAccTestMashData(userContext);
        IntegrationTestServices.getIntegrationTestResults('CHIMP_MOCHA', userContext);
    },

    'mash.updateTestData'(viewOptions, userContext){
        MashDataServices.updateTestData(viewOptions, userContext);
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

