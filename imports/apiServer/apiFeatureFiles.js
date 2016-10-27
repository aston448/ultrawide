
import { Meteor } from 'meteor/meteor';

import  FeatureFileServices     from '../servicers/feature_file_services.js';

// Meteor methods
Meteor.methods({

    'featureFiles.updateFileData'(userContext, filePath){
        FeatureFileServices.updateFileData(userContext, filePath);
    },

    'featureFiles.writeFeatureFile'(featureReferenceId, userContext, filePath){
        FeatureFileServices.writeFeatureFile(featureReferenceId, userContext, filePath);
    },


});
