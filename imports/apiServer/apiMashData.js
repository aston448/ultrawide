
import { Meteor } from 'meteor/meteor';

import  MashDataServices            from '../servicers/dev/mash_data_services.js';
import  TestSummaryServices         from '../servicers/dev/test_summary_services.js';
import  IntegrationTestServices     from '../servicers/dev/integration_test_services.js';

// Meteor methods
Meteor.methods({

    // 'mash.updateTestSummary'(userContext){
    //     TestSummaryServices.refreshTestSummaryData(userContext, 'CHIMP_CUCUMBER', 'CHIMP_MOCHA', 'METEOR_MOCHA');
    // },
    //
    // 'mash.updateIntegrationTestData'(userContext){
    //     IntegrationTestServices.getIntegrationTestResults('CHIMP_MOCHA', userContext);
    // },

    'mash.loadUserFeatureFileData'(userContext, filePath){
        MashDataServices.loadUserFeatureFileData(userContext, filePath);
    },

    'mash.createMashData'(userContext){
        MashDataServices.createAccTestMashData(userContext);
    },

    'mash.populateWorkPackageMashData'(userContext){
        MashDataServices.populateWorkPackageMashData(userContext);
    },

    'mash.updateTestData'(userContext, viewOptions){
        MashDataServices.updateTestMashData(userContext, viewOptions);
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

