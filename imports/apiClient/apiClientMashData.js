// == IMPORTS ==========================================================================================================

// Meteor / React Services
import { Meteor } from 'meteor/meteor';

// Ultrawide Collections

// Ultrawide Services
import { ViewType, ViewMode, DisplayContext, LogLevel} from '../constants/constants.js';
import { log} from '../common/utils.js';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Client Mash Data Services - calls to calculate and update Design-Dev mash data
//
// This class is the test entry point when not testing through the GUI.
// Most functions validate and return true / false according to business rules even if there is implicit validation in the GUI
// (E.g. buttons not being visible if action invalid)
//
// ---------------------------------------------------------------------------------------------------------------------

class ClientMashDataServices {

    createDevMashData(userContext){

        log((msg) => console.log(msg), LogLevel.DEBUG, 'Creating user dev mash data for user {} with Design {}, Design Version {} Work Package {} and Test Location {}',
            userContext.userId, userContext.designId, userContext.designVersionId, userContext.workPackageId, userContext.featureFilesLocation);

        if(userContext.designId != 'NONE' && userContext.designVersionId != 'NONE') {

            Meteor.call('mash.loadUserFeatureFileData', userContext);

            Meteor.call('mash.createFeatureMashData', userContext);

            Meteor.call('mash.createScenarioMashData', userContext);
            return true;

        } else {
            return false;
        }
    };

    updateTestData(userContext){
        Meteor.call('mash.updateTestData', userContext);
    }

}

export default new ClientMashDataServices();

