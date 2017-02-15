
import { Meteor } from 'meteor/meteor';

import  MashDataServices            from '../servicers/dev/mash_data_services.js';

// Meteor methods
Meteor.methods({

    'mash.loadUserFeatureFileData'(userContext){
        MashDataServices.loadUserFeatureFileData(userContext);
    },

    'mash.createMashData'(userContext){
        MashDataServices.createAccTestMashData(userContext);
    },

    'mash.populateWorkPackageMashData'(userContext){
        MashDataServices.populateWorkPackageMashData(userContext);
    },

    'mash.updateTestData'(userContext, userRole, viewOptions){
        MashDataServices.updateTestMashData(userContext, userRole, viewOptions, userRole);
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
    },

    'mash.exportIntegrationTests'(userContext){
        console.log('Exporting Integration Tests Data');
        MashDataServices.exportIntegrationTests(userContext);
    }

});

