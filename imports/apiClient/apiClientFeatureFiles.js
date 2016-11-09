// == IMPORTS ==========================================================================================================

// Meteor / React Services
import { Meteor } from 'meteor/meteor';

// Ultrawide Collections
import { UserCurrentDevContext }    from '../collections/context/user_current_dev_context.js';

// Ultrawide Services
import { ViewType, ViewMode, DisplayContext, LogLevel} from '../constants/constants.js';
import {reorderDropAllowed, log} from '../common/utils.js';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Client Scenario Steps Services - Supports client calls for actions relating to Scenario Steps
//
// This class is the test entry point when not testing through the GUI.
// Most functions validate and return true / false according to business rules even if there is implicit validation in the GUI
// (E.g. buttons not being visible if action invalid)
//
// ---------------------------------------------------------------------------------------------------------------------

class ClientFeatureFileServices {

    writeFeatureFile(featureReferenceId, userContext){


        if(featureReferenceId && userContext.featureFilesLocation != 'NONE') {

            log((msg) => console.log(msg), LogLevel.DEBUG, 'Exporting feature file to {}', userContext.featureFilesLocation);

            Meteor.call('featureFiles.writeFeatureFile', featureReferenceId, userContext);
            return true;

        } else {
            return false;
        }
    }

}

export default new ClientFeatureFileServices();
