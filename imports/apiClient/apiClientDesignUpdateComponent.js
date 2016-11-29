// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide collections
import {DesignUpdateComponents} from '../collections/design_update/design_update_components.js';

// Ultrawide Services
import {ViewType, ViewMode, DisplayContext, ComponentType, MessageType} from '../constants/constants.js';
import { DesignUpdateComponentMessages } from '../constants/message_texts.js';
import { Validation } from '../constants/validation_errors.js';

import ServerDesignUpdateComponentApi      from '../apiServer/apiDesignUpdateComponent.js';
import DesignUpdateComponentValidationApi  from '../apiValidation/apiDesignUpdateComponentValidation.js';

//import {validateDesignUpdateComponentName, locationMoveDropAllowed, reorderDropAllowed} from '../common/utils.js';

// REDUX services
import store from '../redux/store'
import {updateDesignComponentName, setCurrentUserOpenDesignUpdateItems, updateUserMessage} from '../redux/actions'

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Client Design Update Component Services - Supports client calls for actions relating to a Design Update Component
//
// This class is the test entry point when not testing through the GUI.
// Most functions validate and return true / false according to business rules even if there is implicit validation in the GUI
// (E.g. buttons not being visible if action invalid)
//
// ---------------------------------------------------------------------------------------------------------------------

class ClientDesignUpdateComponentServices{

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // User saved a change to design component name --------------------------------------------------------------------
    updateComponentName(view, mode, designUpdateComponentId, newPlainText, newRawText){

        // Client validation
        let result = DesignUpdateComponentValidationApi.validateUpdateDesignUpdateComponentName(view, mode, designUpdateComponentId, newPlainText);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call
        ServerDesignUpdateComponentApi.updateComponentName(view, mode, designUpdateComponentId, newPlainText, newRawText, (err, result) => {

            if(err){
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Update Component Name Actions:

                // Temp update for the redux state to the local new value - otherwise does not get changed in time
                // This allows the text area to immediately display any updates to current component name
                store.dispatch(updateDesignComponentName(newPlainText));

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignUpdateComponentMessages.MSG_COMPONENT_NAME_UPDATED
                }));
            }
        });

        // Indicate that business validation passed
        return true;
    };

    // User saved changes to Narrative in a Feature --------------------------------------------------------------------
    updateFeatureNarrative(view, mode, designUpdateComponentId, newPlainText, newRawText){

        // Client validation
        let result = DesignUpdateComponentValidationApi.validateUpdateDesignUpdateFeatureNarrative(view, mode);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call
        ServerDesignUpdateComponentApi.updateFeatureNarrative(view, mode, designUpdateComponentId, newPlainText, newRawText, (err, result) => {

            if(err){
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Update Feature Narrative Actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignUpdateComponentMessages.MSG_FEATURE_NARRATIVE_UPDATED
                }));
            }
        });

        // Indicate that business validation passed
        return true;
    };

    // User clicked Add Application in the main Design Update Applications container -----------------------------------
    addApplicationToDesignVersion(view, mode, designVersionId, designUpdateId) {

        // Client validation
        let result = DesignUpdateComponentValidationApi.validateAddDesignUpdateComponent(view, mode);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call
        ServerDesignUpdateComponentApi.addApplicationToDesignVersion(view, mode, designVersionId, designUpdateId, (err, result) => {

            if(err){
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Add Application Actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignUpdateComponentMessages.MSG_NEW_APPLICATION_ADDED
                }));
            }
        });

        // Indicate that business validation passed
        return true;
    };

    // User clicked Add Design Section inside an Application component -------------------------------------------------
    addDesignSectionToApplication(view, mode, parentComponent){

        // Client validation
        let result = DesignUpdateComponentValidationApi.validateAddDesignUpdateComponent(view, mode);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call
        ServerDesignUpdateComponentApi.addDesignSectionToApplication(
            view,
            mode,
            parentComponent.designVersionId,
            parentComponent.designUpdateId,
            parentComponent._id,
            (err, result) => {

                if(err){
                    // Unexpected error as all expected errors already handled - show alert.
                    // Can't update screen here because of error
                    alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
                } else {
                    // Add Design Section Actions:

                    // Show action success on screen
                    store.dispatch(updateUserMessage({
                        messageType: MessageType.INFO,
                        messageText: DesignUpdateComponentMessages.MSG_NEW_DESIGN_SECTION_ADDED
                    }));
                }
            }
        );

        // Indicate that business validation passed
        return true;
    };

    // User clicked Add Sub Section inside a Design Section ------------------------------------------------------------
    addSectionToDesignSection(view, mode, parentComponent){

        // Client validation
        let result = DesignUpdateComponentValidationApi.validateAddDesignUpdateComponent(view, mode);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call
        ServerDesignUpdateComponentApi.addDesignSectionToDesignSection(
            view,
            mode,
            parentComponent.designVersionId,
            parentComponent.designUpdateId,
            parentComponent._id,
            parentComponent.componentLevel,
            (err, result) => {

                if(err){
                    // Unexpected error as all expected errors already handled - show alert.
                    // Can't update screen here because of error
                    alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
                } else {
                    // Add Design Section Actions:

                    // Show action success on screen
                    store.dispatch(updateUserMessage({
                        messageType: MessageType.INFO,
                        messageText: DesignUpdateComponentMessages.MSG_NEW_DESIGN_SECTION_ADDED
                    }));
                }
            }
        );

        // Indicate that business validation passed
        return true;
    };

    // User clicked Add Feature inside a Design Section ----------------------------------------------------------------
    addFeatureToDesignSection(view, mode, parentComponent){

        // Client validation
        let result = DesignUpdateComponentValidationApi.validateAddDesignUpdateComponent(view, mode);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call
        ServerDesignUpdateComponentApi.addFeatureToDesignSection(
            view,
            mode,
            parentComponent.designVersionId,
            parentComponent.designUpdateId,
            parentComponent._id,
            (err, result) => {

                if(err){
                    // Unexpected error as all expected errors already handled - show alert.
                    // Can't update screen here because of error
                    alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
                } else {
                    // Add Feature Actions:

                    // Show action success on screen
                    store.dispatch(updateUserMessage({
                        messageType: MessageType.INFO,
                        messageText: DesignUpdateComponentMessages.MSG_NEW_FEATURE_ADDED
                    }));
                }
            }
        );

        // Indicate that business validation passed
        return true;
    };

    // User clicked Add Feature Aspect inside a Feature ----------------------------------------------------------------
    addFeatureAspectToFeature(view, mode, parentComponent){

        // Client validation
        let result = DesignUpdateComponentValidationApi.validateAddDesignUpdateComponent(view, mode);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call
        ServerDesignUpdateComponentApi.addFeatureAspectToFeature(
            view,
            mode,
            parentComponent.designVersionId,
            parentComponent.designUpdateId,
            parentComponent._id,
            (err, result) => {

                if(err){
                    // Unexpected error as all expected errors already handled - show alert.
                    // Can't update screen here because of error
                    alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
                } else {
                    // Add Feature Aspect Actions:

                    // Show action success on screen
                    store.dispatch(updateUserMessage({
                        messageType: MessageType.INFO,
                        messageText: DesignUpdateComponentMessages.MSG_NEW_FEATURE_ASPECT_ADDED
                    }));
                }
            }
        );

        // Indicate that business validation passed
        return true;
    };

    // User clicked Add Scenario in either a Feature or Feature Aspect -------------------------------------------------
    addScenario(view, mode, parentComponent){

        // Client validation
        let result = DesignUpdateComponentValidationApi.validateAddDesignUpdateComponent(view, mode);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call
        ServerDesignUpdateComponentApi.addScenario(
            view,
            mode,
            parentComponent.designVersionId,
            parentComponent.designUpdateId,
            parentComponent._id,
            (err, result) => {

                if(err){
                    // Unexpected error as all expected errors already handled - show alert.
                    // Can't update screen here because of error
                    alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
                } else {
                    // Add Scenario Actions:

                    // Show action success on screen
                    store.dispatch(updateUserMessage({
                        messageType: MessageType.INFO,
                        messageText: DesignUpdateComponentMessages.MSG_NEW_SCENARIO_ADDED
                    }));
                }
            }
        );

        // Indicate that business validation passed
        return true;
    };

    // User clicked Delete for a design component when editing a Design Update -----------------------------------------
    logicallyDeleteComponent(view, mode, designUpdateComponent){

        // Client validation
        let result = DesignUpdateComponentValidationApi.validateRemoveDesignUpdateComponent(view, mode, designUpdateComponent._id);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call
        ServerDesignUpdateComponentApi.removeDesignComponent(
            view,
            mode,
            designUpdateComponent._id,
            designUpdateComponent.componentParentIdNew,
            (err, result) => {


                if(err){
                    // Unexpected error as all expected errors already handled - show alert.
                    // Can't update screen here because of error
                    alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
                } else {
                    // Remove Design Component Actions:

                    // No need to remove from user context as only a logical delete and still visible

                    // Show action success on screen
                    store.dispatch(updateUserMessage({
                        messageType: MessageType.INFO,
                        messageText: DesignUpdateComponentMessages.MSG_DESIGN_COMPONENT_REMOVED
                    }));
                }
            }
        );

        // Indicate that business validation passed
        return true;
    };

    // User clicked Restore for a logically deleted design component when editing a Design Update ----------------------
    restoreComponent(view, mode, designUpdateComponent){

        // Client validation
        let result = DesignUpdateComponentValidationApi.validateRestoreDesignUpdateComponent(view, mode, designUpdateComponent._id);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call
        ServerDesignUpdateComponentApi.restoreDesignComponent(
            view,
            mode,
            designUpdateComponent._id,
            designUpdateComponent.componentParentIdNew,
            (err, result) => {


                if(err){
                    // Unexpected error as all expected errors already handled - show alert.
                    // Can't update screen here because of error
                    alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
                } else {
                    // Remove Design Component Actions:

                    // No need to remove from user context as only a logical delete and still visible

                    // Show action success on screen
                    store.dispatch(updateUserMessage({
                        messageType: MessageType.INFO,
                        messageText: DesignUpdateComponentMessages.MSG_DESIGN_COMPONENT_RESTORED
                    }));
                }
            }
        );

        // Indicate that business validation passed
        return true;

    };

    // User put a scopable item in the scope view in or out of scope for a Design Update -------------------------------
    toggleInScope(view, mode, displayContext, designUpdateComponent, newScope){

        // Client validation
        let result = DesignUpdateComponentValidationApi.validateToggleDesignUpdateComponentScope(view, mode, displayContext, designUpdateComponent._id);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call
        ServerDesignUpdateComponentApi.toggleScope(view, mode, displayContext, designUpdateComponent._id, newScope, (err, result) => {

            if(err){
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Toggle Scope Actions:

                // Show action success on screen
                if(newScope) {
                    store.dispatch(updateUserMessage({
                        messageType: MessageType.INFO,
                        messageText: DesignUpdateComponentMessages.MSG_DESIGN_COMPONENT_IN_SCOPE
                    }));
                } else {
                    store.dispatch(updateUserMessage({
                        messageType: MessageType.INFO,
                        messageText: DesignUpdateComponentMessages.MSG_DESIGN_COMPONENT_OUT_SCOPE
                    }));
                }
            }
        });

        // Indicate that business validation passed
        return true;
    };

    // User dragged a component to a new location in the design update -------------------------------------------------
    moveComponent(view, mode, displayContext, movingComponent, newParentComponent){

        // Client validation
        let result = DesignUpdateComponentValidationApi.validateMoveDesignUpdateComponent(view, mode, displayContext, movingComponent._id, newParentComponent._id);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call
        ServerDesignUpdateComponentApi.moveDesignComponent(
            view,
            mode,
            displayContext,
            movingComponent._id,
            newParentComponent._id,
            (err, result) => {

                if(err){
                    // Unexpected error as all expected errors already handled - show alert.
                    // Can't update screen here because of error
                    alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
                } else {
                    // Move Component Actions:

                    // Show action success on screen
                    store.dispatch(updateUserMessage({
                        messageType: MessageType.INFO,
                        messageText: DesignUpdateComponentMessages.MSG_DESIGN_COMPONENT_MOVED
                    }));

                }
            }
        );

        // Indicate that business validation passed
        return true;
    };

    // User dragged a component to a new position in its current list --------------------------------------------------
    reorderComponent(view, mode, displayContext, movingComponent, targetComponent){

        // Client validation
        let result = DesignUpdateComponentValidationApi.validateReorderDesignUpdateComponent(view, mode, displayContext, movingComponent._id, targetComponent._id);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call
        ServerDesignUpdateComponentApi.reorderDesignComponent(
            view,
            mode,
            displayContext,
            movingComponent._id,
            targetComponent._id,
            (err, result) => {

                if(err){
                    // Unexpected error as all expected errors already handled - show alert.
                    // Can't update screen here because of error
                    alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
                } else {
                    // Reorder Component Actions:

                    // Show action success on screen
                    store.dispatch(updateUserMessage({
                        messageType: MessageType.INFO,
                        messageText: DesignUpdateComponentMessages.MSG_DESIGN_COMPONENT_REORDERED
                    }));

                }
            }
        );

        // Indicate that business validation passed
        return true;
    };

    // LOCAL CLIENT ACTIONS ============================================================================================

    // User opened or closed a design component
    setOpenClosed(designComponent, currentList, newState){

        if(designComponent.componentType === ComponentType.FEATURE){
            // Open or close the whole feature
            const featureComponents = DesignUpdateComponents.find(
                {
                    designVersionId: designComponent.designVersionId,
                    designUpdateId: designComponent.designUpdateId,
                    componentFeatureReferenceIdNew: designComponent.componentFeatureReferenceIdNew
                }
            );

            featureComponents.forEach((component) => {
                store.dispatch(setCurrentUserOpenDesignUpdateItems(
                    Meteor.userId(),
                    currentList,
                    component._id,
                    newState
                ));
            });

        } else {
            if(newState){
                // Open - just open this item
                store.dispatch(setCurrentUserOpenDesignUpdateItems(
                    Meteor.userId(),
                    currentList,
                    designComponent._id,
                    newState
                ));
            } else {
                // Close - close all children
                this.closeChildren(designComponent, currentList)
            }

        }

        return true;
    };

    // Recursive function to close all children down to the bottom of the tree
    closeChildren(designComponent, currentList){

        let childComponents = DesignUpdateComponents.find(
            {
                designVersionId: designComponent.designVersionId,
                designUpdateId: designComponent.designUpdateId,
                componentParentReferenceIdNew: designComponent.componentReferenceId
            }
        );

        if(childComponents.count() > 0){
            childComponents.forEach((child) => {

                store.dispatch(setCurrentUserOpenDesignUpdateItems(
                    Meteor.userId(),
                    currentList,
                    designComponent._id,
                    false
                ));

                // Recursively call for these children
                this.closeChildren(child, currentList)
            });

            return true;

        } else {
            return false;
        }
    };

}

export default new ClientDesignUpdateComponentServices();