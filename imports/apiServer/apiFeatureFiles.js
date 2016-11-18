
import { Meteor } from 'meteor/meteor';

import  FeatureFileServices     from '../servicers/dev/feature_file_services.js';

// Meteor methods
Meteor.methods({

    'featureFiles.updateFileData'(userContext){
        FeatureFileServices.updateFileData(userContext);
    },

    'featureFiles.writeFeatureFile'(featureReferenceId, userContext){
        FeatureFileServices.writeFeatureFile(featureReferenceId, userContext);
    },


});
