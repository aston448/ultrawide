// == IMPORTS ==========================================================================================================

// Meteor / React Services
import { Meteor } from 'meteor/meteor';

// Ultrawide Collections
import { UserCurrentDevContext }    from '../collections/context/user_current_dev_context.js';
import { DesignComponents }         from '../collections/design/design_components.js';
import { DesignUpdateComponents }   from '../collections/design_update/design_update_components.js';

// Ultrawide Services
import { ComponentType, LogLevel} from '../constants/constants.js';
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

        // Get location data
        const devContext = UserCurrentDevContext.findOne({userId: userContext.userId});

        log((msg) => console.log(msg), LogLevel.DEBUG, 'Creating user dev mash data for user {} with Design {}, Design Version {} Work Package {} and Test Location {}',
            userContext.userId, userContext.designId, userContext.designVersionId, userContext.workPackageId, devContext.featureFilesLocation);

        if(userContext.designId != 'NONE' && userContext.designVersionId != 'NONE' && devContext.featureFilesLocation != 'NONE') {

            Meteor.call('mash.loadUserFeatureFileData', userContext, devContext.featureFilesLocation);

            Meteor.call('mash.createFeatureMashData', userContext);

            Meteor.call('mash.createScenarioMashData', userContext);
            return true;

        } else {
            return false;
        }
    };

    updateTestData(userContext){
        // Get location data
        const devContext = UserCurrentDevContext.findOne({userId: userContext.userId});

        Meteor.call('mash.updateTestData', userContext, devContext.featureTestResultsLocation);
    }

    featureHasAspects(featureId, designUpdateId){

        if(designUpdateId === 'NONE'){
            return DesignComponents.find({componentParentId: featureId, componentType: ComponentType.FEATURE_ASPECT}).count() > 0;
        } else {
            return DesignUpdateComponents.find({componentParentIdNew: featureId, componentType: ComponentType.FEATURE_ASPECT}).count() > 0;
        }
    }
}

export default new ClientMashDataServices();

