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

    createFeatureMashData(userContext){

        log((msg) => console.log(msg), LogLevel.DEBUG, 'Creating feature mash data for user {} with Design {}, Design Version {} and Test Location {}',
            userContext.userId, userContext.designId, userContext.designVersionId, userContext.featureFilesLocation);

        if(userContext.designId != 'NONE' && userContext.designVersionId != 'NONE') {

            Meteor.call('mash.createFeatureMashData', userContext);
            return true;

        } else {
            return false;
        }
    }

}

export default new ClientMashDataServices();

