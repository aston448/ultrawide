// == IMPORTS ==========================================================================================================

// Meteor / React Services
import { Meteor } from 'meteor/meteor';

// Ultrawide Collections
import { UserCurrentDevContext }    from '../collections/context/user_current_dev_context.js';
import { DesignComponents }         from '../collections/design/design_components.js';
import { DesignUpdateComponents }   from '../collections/design_update/design_update_components.js';
import { UserDesignDevMashData }    from '../collections/dev/user_design_dev_mash_data.js';

// Ultrawide Services
import { ComponentType, MashStatus, LogLevel} from '../constants/constants.js';
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

            Meteor.call('mash.createMashData', userContext);
            return true;

        } else {
            return false;
        }
    };

    updateTestData(userContext){
        // Get location data
        const devContext = UserCurrentDevContext.findOne({userId: userContext.userId});

        Meteor.call('mash.updateTestData', userContext, devContext.featureTestResultsLocation);
    };

    featureHasAspects(userContext){

        log((msg) => console.log(msg), LogLevel.DEBUG, "Checking for feature aspects for feature {}", userContext.designComponentId);

        if(userContext.designUpdateId === 'NONE'){
            return DesignComponents.find({componentParentId: userContext.designComponentId, componentType: ComponentType.FEATURE_ASPECT}).count() > 0;
        } else {
            return DesignUpdateComponents.find({componentParentIdNew: userContext.designComponentId, componentType: ComponentType.FEATURE_ASPECT}).count() > 0;
        }
    };

    featureHasUnknownScenarios(userContext){
        return UserDesignDevMashData.find({
            userId:                         userContext.userId,
            designVersionId:                userContext.designVersionId,
            designUpdateId:                 userContext.designUpdateId,
            workPackageId:                  userContext.workPackageId,
            mashComponentType:              ComponentType.SCENARIO,
            designFeatureReferenceId:       userContext.featureReferenceId,
            mashStatus:                     MashStatus.MASH_NOT_DESIGNED
        })
    }
}

export default new ClientMashDataServices();

