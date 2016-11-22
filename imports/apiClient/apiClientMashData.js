// == IMPORTS ==========================================================================================================

// Meteor / React Services
import { Meteor } from 'meteor/meteor';

// Ultrawide Collections
import { UserCurrentDevContext }    from '../collections/context/user_current_dev_context.js';
import { DesignComponents }         from '../collections/design/design_components.js';
import { DesignUpdateComponents }   from '../collections/design_update/design_update_components.js';
import { UserAccTestMashData }    from '../collections/dev/user_acc_test_mash_data.js';

// Ultrawide Services
import { ComponentType, ViewType, ViewMode, DisplayContext, MessageType, MashStatus, LogLevel} from '../constants/constants.js';
import { mashMoveDropAllowed, log} from '../common/utils.js';

// REDUX
import store from '../redux/store'
import {setCurrentUserItemContext, updateProgressData, updateUserMessage} from '../redux/actions'

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

    // When calling this, ensure that data has been subscribed to
    updateMashData(viewOptions, userContext, currentProgressDataValue){
        // Get the latest DEV data for the Mash
        this.createDevMashData(userContext);

        // Get the latest test results
        this.updateTestData(viewOptions, userContext);

        store.dispatch(updateProgressData(!currentProgressDataValue));
    }

    createDevMashData(userContext){

        log((msg) => console.log(msg), LogLevel.DEBUG, 'Creating user dev mash data for user {} with Design {}, Design Version {} Work Package {} and Test Location {}',
            userContext.userId, userContext.designId, userContext.designVersionId, userContext.workPackageId, userContext.featureFilesLocation);

        if(userContext.designId != 'NONE' && userContext.designVersionId != 'NONE' && userContext.featureFilesLocation != 'NONE') {

            Meteor.call('mash.loadUserFeatureFileData', userContext, userContext.featureFilesLocation);

            Meteor.call('mash.createMashData', userContext);
            return true;

        } else {
            return false;
        }
    };

    // User has dragged a mash Scenario Step into the FINAL step configuration
    relocateMashStep(view, mode, targetContext, movingComponent, targetComponent, userContext){

        // Need to update the mash data and, if step comes from Dev, add step to Design
        log((msg) => console.log(msg), LogLevel.DEBUG, "Relocate Mash Step: View: {}, Mode: {}, DropContext: {} UserContext: {}", view, mode, targetContext, userContext);
        // Validation
        if((view === ViewType.DEVELOP_BASE_WP || view === ViewType.DEVELOP_UPDATE_WP) &&
            mode === ViewMode.MODE_EDIT
            && targetContext === DisplayContext.EDIT_STEP_LINKED &&
            mashMoveDropAllowed(targetContext)
        ){
            if(movingComponent.mashStatus === MashStatus.MASH_NOT_IMPLEMENTED) {
                // A Design Item being added to the final config...
                log((msg) => console.log(msg), LogLevel.DEBUG, "Updating {} to Linked", movingComponent.stepText);

                // In this case all we are doing is changing the status of the component to be linked
                // It will keep is position from the design
                Meteor.call('mash.updateMovedDesignStep', movingComponent._id);

                // And update the relevant feature file with the new step...

                return true;
            } else {
                // A Dev item being added to the Design
                log((msg) => console.log(msg), LogLevel.DEBUG, "Adding Dev Step {} to Linked", movingComponent.stepText);

                // Add to the final config in the position dropped
                Meteor.call('mash.updateMovedDevStep', movingComponent._id, targetComponent._id, userContext);

                // Add also to the design
            }
        } else {
            return false;
        }


    }

    updateTestData(viewOptions, userContext){
        Meteor.call('mash.updateTestData', viewOptions, userContext);
    };

    featureHasAspects(userContext, featureComponentId){

        log((msg) => console.log(msg), LogLevel.DEBUG, "Checking for feature aspects for feature {}", featureComponentId);

        if(userContext.designUpdateId === 'NONE'){
            return DesignComponents.find({componentParentId: featureComponentId, componentType: ComponentType.FEATURE_ASPECT}).count() > 0;
        } else {
            return DesignUpdateComponents.find({componentParentIdNew: featureComponentId, componentType: ComponentType.FEATURE_ASPECT}).count() > 0;
        }
    };

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

    exportFeature(mashItem, userContext){

        // Get the actual Feature Component Id
        let component = null;

        if(userContext.designUpdateId === 'NONE'){
            component = DesignComponents.findOne({
                designId: userContext.designId,
                designVersionId: userContext.designVersionId,
                componentType: ComponentType.FEATURE,
                componentReferenceId: mashItem.designComponentReferenceId
            });
        } else {
            component  = DesignUpdateComponents.findOne({
                designId: userContext.designId,
                designVersionId: userContext.designVersionId,
                designUpdateId: userContext.designUpdateId,
                componentType: ComponentType.FEATURE,
                componentReferenceId: mashItem.designComponentReferenceId
            });
        }

        if(component) {

            log((msg) => console.log(msg), LogLevel.DEBUG, "Exporting feature ", (userContext.designUpdateId === 'NONE') ? component.componentName : component.componentNameNew);

            // For this function we update the user context first to the feature being exported
            const context = {
                userId:                         userContext.userId,
                designId:                       userContext.designId,
                designVersionId:                userContext.designVersionId,
                designUpdateId:                 userContext.designUpdateId,
                workPackageId:                  userContext.workPackageId,
                designComponentId:              component._id,
                designComponentType:            ComponentType.FEATURE,
                featureReferenceId:             mashItem.designFeatureReferenceId,
                featureAspectReferenceId:       'NONE',
                scenarioReferenceId:            'NONE',
                scenarioStepId:                 'NONE',
                featureFilesLocation:           userContext.featureFilesLocation,
                acceptanceTestResultsLocation:  userContext.acceptanceTestResultsLocation,
                integrationTestResultsLocation: userContext.integrationTestResultsLocation,
                moduleTestResultsLocation:      userContext.moduleTestResultsLocation
            };

            store.dispatch(setCurrentUserItemContext(context, true));

            // And now we export the feature with the new context
            Meteor.call('mash.exportFeatureConfiguration', context);

            return true;
        } else {
            log((msg) => console.log(msg), LogLevel.DEBUG, "Cant export - cant find Feature for reference id {} ", mashItem.designComponentReferenceId);
            return false;
        }
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

    featureHasUnknownScenarios(userContext){
        return UserAccTestMashData.find({
            userId:                         userContext.userId,
            designVersionId:                userContext.designVersionId,
            designUpdateId:                 userContext.designUpdateId,
            workPackageId:                  userContext.workPackageId,
            mashComponentType:              ComponentType.SCENARIO,
            designFeatureReferenceId:       userContext.featureReferenceId,
            mashStatus:                     MashStatus.MASH_NOT_DESIGNED
        }).fetch().length > 0;
    };

    // Returns true if mash item Feature has a Dev feature file
    featureIsImplemented(mashItemId){

        const mashItem = UserAccTestMashData.findOne({_id: mashItemId});

        // There must be a parent Feature
        const parentFeature = UserAccTestMashData.findOne({
            userId: mashItem.userId,
            designVersionId:                mashItem.designVersionId,
            designUpdateId:                 mashItem.designUpdateId,
            workPackageId:                  mashItem.workPackageId,
            designComponentReferenceId:     mashItem.designFeatureReferenceId,
            mashComponentType:              ComponentType.FEATURE
        });

        // And if there is a Feature File it wil be linked
        return(parentFeature.mashStatus === MashStatus.MASH_LINKED);

    };
}

export default new ClientMashDataServices();

