// == IMPORTS ==========================================================================================================

// Meteor / React Services
import { Meteor } from 'meteor/meteor';

// Ultrawide Collections
import { DesignVersionComponents }      from '../collections/design/design_version_components.js';
import { DesignUpdateComponents }       from '../collections/design_update/design_update_components.js';

// Ultrawide Services
import { ComponentType, ViewType, ViewMode, DisplayContext, MessageType, MashStatus, LogLevel} from '../constants/constants.js';
import { mashMoveDropAllowed, log} from '../common/utils.js';

// REDUX
import store from '../redux/store'
import {updateUserMessage} from '../redux/actions'

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

    // User has dragged a mash Scenario Step into the FINAL step configuration
    relocateMashStep(view, mode, targetContext, movingComponent, targetComponent, userContext){

        // Need to update the mash data and, if step comes from Dev, add step to Design
        log((msg) => console.log(msg), LogLevel.TRACE, "Relocate Mash Step: View: {}, Mode: {}, DropContext: {} UserContext: {}", view, mode, targetContext, userContext);
        // Validation
        if((view === ViewType.DEVELOP_BASE_WP || view === ViewType.DEVELOP_UPDATE_WP) &&
            mode === ViewMode.MODE_EDIT
            && targetContext === DisplayContext.EDIT_STEP_LINKED &&
            mashMoveDropAllowed(targetContext)
        ){
            if(movingComponent.accMashStatus === MashStatus.MASH_NOT_IMPLEMENTED) {
                // A Design Item being added to the final config...
                log((msg) => console.log(msg), LogLevel.TRACE, "Updating {} to Linked", movingComponent.stepText);

                // In this case all we are doing is changing the status of the component to be linked
                // It will keep is position from the design
                Meteor.call('mash.updateMovedDesignStep', movingComponent._id);

                // And update the relevant feature file with the new step...
                Meteor.call('mash.exportFeatureConfiguration', userContext);

                return true;
            } else {
                // A Dev item being added to the Design
                log((msg) => console.log(msg), LogLevel.TRACE, "Adding Dev Step {} to Linked", movingComponent.stepText);

                // Add to the final config in the position dropped
                Meteor.call('mash.updateMovedDevStep', movingComponent._id, targetComponent._id, userContext);

                // Add also to the design
            }
        } else {
            return false;
        }


    }


    // User has chosen to export a Scenario in the design to the dev feature file
    exportFeatureScenario(view, scenarioReferenceId, userContext){

        // Validation - must be in Dev Work view and must be a feature in context
        if((view === ViewType.DEVELOP_BASE_WP || view === ViewType.DEVELOP_UPDATE_WP) && userContext.featureReferenceId != 'NONE'){

            // To do this we update the scenario and its steps as linked and then re-export the Feature
            Meteor.call('mash.exportScenario', scenarioReferenceId, userContext);

            return true;
        } else {
            return false;
        }
    };

    exportFeature(userContext){

        Meteor.call('mash.exportFeatureConfiguration', userContext);

    }

    exportFeatureUpdates(userContext){
        // Validation - A Feature must be in context
        if(userContext.featureReferenceId != 'NONE') {
            Meteor.call('mash.exportFeatureConfiguration', userContext);
            return true;
        } else {
            return false;
        }
    };

    exportIntegrationTests(userContext){
        //TODO - Integrate this properly
        if(userContext.designComponentType === ComponentType.FEATURE){
            Meteor.call('mash.exportIntegrationTests', userContext);
            return true;
        } else {
            store.dispatch(updateUserMessage({
                messageType: MessageType.ERROR,
                messageText: 'Select one Feature for this to work'
            }));
        }
    }

}

export default new ClientMashDataServices();

