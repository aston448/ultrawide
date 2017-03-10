// == IMPORTS ==========================================================================================================

// Ultrawide collections
import {DesignUpdateComponents}             from '../collections/design_update/design_update_components.js';

// Ultrawide Services
import { ComponentType, MessageType}        from '../constants/constants.js';
import { DesignUpdateComponentMessages }    from '../constants/message_texts.js';
import { Validation }                       from '../constants/validation_errors.js';

import ServerDesignUpdateComponentApi       from '../apiServer/apiDesignUpdateComponent.js';
import DesignUpdateComponentValidationApi   from '../apiValidation/apiDesignUpdateComponentValidation.js';
import ClientDesignUpdateServices           from '../apiClient/apiClientDesignUpdateSummary.js';

// REDUX services
import store from '../redux/store'
import {updateDesignComponentName, setCurrentUserOpenDesignUpdateItems, updateUserMessage, updateOpenItemsFlag} from '../redux/actions'

// =====================================================================================================================
// Client API for Design Update Components
//
// Calls validation for client and then, if required, server API to update server data
// =====================================================================================================================
class ClientDesignUpdateComponentServices{

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // User saved a change to design component name --------------------------------------------------------------------
    updateComponentName(view, mode, designUpdateComponent, newPlainText, newRawText){

        // Client validation
        let result = DesignUpdateComponentValidationApi.validateUpdateDesignUpdateComponentName(view, mode, designUpdateComponent._id, newPlainText);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call
        ServerDesignUpdateComponentApi.updateComponentName(view, mode, designUpdateComponent._id, newPlainText, newRawText, (err, result) => {

            if(err){
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Update Component Name Actions:

                // Temp update for the redux state to the local new value - otherwise does not get changed in time
                // This allows the text area to immediately display any updates to current component name
                store.dispatch(updateDesignComponentName(newPlainText));

                this.refreshDesignUpdateSummary(designUpdateComponent);

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignUpdateComponentMessages.MSG_COMPONENT_NAME_UPDATED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User saved changes to Narrative in a Feature --------------------------------------------------------------------
    updateFeatureNarrative(view, mode, designUpdateComponentId, newPlainText, newRawText){

        // Client validation
        let result = DesignUpdateComponentValidationApi.validateUpdateDesignUpdateFeatureNarrative(view, mode, designUpdateComponentId);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
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
        return {success: true, message: ''};
    };

    // User clicked Add Application in the main Design Update Applications container -----------------------------------
    addApplicationToDesignVersion(view, mode, designVersionId, designUpdateId) {

        // Audit
        //const auditKey = ClientAuditServices.logUserAction('DU_ADD_APPLICATION');

        // Client validation
        let result = DesignUpdateComponentValidationApi.validateAddDesignUpdateComponent(view, mode, null, ComponentType.APPLICATION);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            //ClientAuditServices.updateUserAction(auditKey, 'FAIL', result);
            return {success: false, message: result};
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
                //ClientAuditServices.updateUserAction(auditKey, 'SUCCESS', DesignUpdateComponentMessages.MSG_NEW_APPLICATION_ADDED);
            }
        });

        // Allow tests to access results
        return {success: true, message: ''};
    };

    // User clicked Add Design Section inside an Application component -------------------------------------------------
    addDesignSectionToApplication(view, mode, parentComponent){

        // Client validation
        let result = DesignUpdateComponentValidationApi.validateAddDesignUpdateComponent(view, mode, parentComponent._id, ComponentType.DESIGN_SECTION);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
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
        return {success: true, message: ''};
    };

    // User clicked Add Sub Section inside a Design Section ------------------------------------------------------------
    addSectionToDesignSection(view, mode, parentComponent){

        // Audit
        // const auditKey = ClientAuditServices.logUserAction('DU_ADD_SECTION_TO_SECTION');

        // Client validation
        let result = DesignUpdateComponentValidationApi.validateAddDesignUpdateComponent(view, mode, parentComponent._id, ComponentType.DESIGN_SECTION);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            //ClientAuditServices.updateUserAction(auditKey, 'FAIL', result);
            return {success: false, message: result};
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
                    //ClientAuditServices.updateUserAction(auditKey, 'SUCCESS', DesignUpdateComponentMessages.MSG_NEW_DESIGN_SECTION_ADDED);
                }
            }
        );

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User clicked Add Feature inside a Design Section ----------------------------------------------------------------
    addFeatureToDesignSection(view, mode, parentComponent){

        // Client validation
        let result = DesignUpdateComponentValidationApi.validateAddDesignUpdateComponent(view, mode, parentComponent._id, ComponentType.FEATURE);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
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
                    this.refreshDesignUpdateSummary(parentComponent);

                    // Show action success on screen
                    store.dispatch(updateUserMessage({
                        messageType: MessageType.INFO,
                        messageText: DesignUpdateComponentMessages.MSG_NEW_FEATURE_ADDED
                    }));
                }
            }
        );

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User clicked Add Feature Aspect inside a Feature ----------------------------------------------------------------
    addFeatureAspectToFeature(view, mode, parentComponent){

        // Client validation
        let result = DesignUpdateComponentValidationApi.validateAddDesignUpdateComponent(view, mode, parentComponent._id, ComponentType.FEATURE_ASPECT);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
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
        return {success: true, message: ''};
    };

    // User clicked Add Scenario in either a Feature or Feature Aspect -------------------------------------------------
    addScenario(view, mode, parentComponent){

        // Client validation
        let result = DesignUpdateComponentValidationApi.validateAddDesignUpdateComponent(view, mode, parentComponent._id, ComponentType.SCENARIO);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
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
                    this.refreshDesignUpdateSummary(parentComponent);

                    // Show action success on screen
                    store.dispatch(updateUserMessage({
                        messageType: MessageType.INFO,
                        messageText: DesignUpdateComponentMessages.MSG_NEW_SCENARIO_ADDED
                    }));
                }
            }
        );

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User clicked Delete for a design component when editing a Design Update -----------------------------------------
    removeComponent(view, mode, designUpdateComponent){

        // Client validation
        let result = DesignUpdateComponentValidationApi.validateRemoveDesignUpdateComponent(view, mode, designUpdateComponent._id);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
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
                    this.refreshDesignUpdateSummary(designUpdateComponent);

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
        return {success: true, message: ''};
    };

    // User clicked Restore for a logically deleted design component when editing a Design Update ----------------------
    restoreComponent(view, mode, designUpdateComponent){

        // Client validation
        let result = DesignUpdateComponentValidationApi.validateRestoreDesignUpdateComponent(view, mode, designUpdateComponent._id);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
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
                    this.refreshDesignUpdateSummary(designUpdateComponent);

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
        return {success: true, message: ''};

    };

    // User put a scopable item in the scope view in or out of scope for a Design Update -------------------------------
    toggleInScope(view, mode, displayContext, designUpdateComponent, newScope){

        // Client validation
        let result = DesignUpdateComponentValidationApi.validateToggleDesignUpdateComponentScope(view, mode, displayContext, designUpdateComponent._id, newScope);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
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
        return {success: true, message: ''};
    };

    // User dragged a component to a new location in the design update -------------------------------------------------
    moveComponent(view, mode, displayContext, movingComponent, newParentComponent){

        // Client validation
        let result = DesignUpdateComponentValidationApi.validateMoveDesignUpdateComponent(view, mode, displayContext, movingComponent._id, newParentComponent._id);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
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
        return {success: true, message: ''};
    };

    // User dragged a component to a new position in its current list --------------------------------------------------
    reorderComponent(view, mode, displayContext, movingComponent, targetComponent){

        // Client validation
        let result = DesignUpdateComponentValidationApi.validateReorderDesignUpdateComponent(view, mode, displayContext, movingComponent._id, targetComponent._id);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
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
        return {success: true, message: ''};
    };

    // LOCAL CLIENT ACTIONS ============================================================================================

    // User opened or closed a design component
    setOpenClosed(designComponent, currentList, setOpen){

        if(designComponent.componentType === ComponentType.FEATURE){

            // Open or close the whole feature
            if(setOpen) {
                const featureComponents = DesignUpdateComponents.find(
                    {
                        designVersionId: designComponent.designVersionId,
                        designUpdateId: designComponent.designUpdateId,
                        componentFeatureReferenceIdNew: designComponent.componentReferenceId,
                        componentType: {$ne:(ComponentType.SCENARIO)}
                    }
                );

                featureComponents.forEach((component) => {
                    console.log("Setting component " + component.componentNameNew + " open to " + setOpen);
                    store.dispatch(setCurrentUserOpenDesignUpdateItems(
                        currentList,
                        component._id,
                        setOpen
                    ));
                });

                store.dispatch((updateOpenItemsFlag()));

            } else {

                // Close - close all children
                this.closeChildren(designComponent, currentList);

                store.dispatch((updateOpenItemsFlag()));
            }

        } else {
            if(setOpen){
                // Open - just open this item
                store.dispatch(setCurrentUserOpenDesignUpdateItems(
                    currentList,
                    designComponent._id,
                    setOpen
                ));

                store.dispatch((updateOpenItemsFlag()));
            } else {

                // Close - close all children
                this.closeChildren(designComponent, currentList);

                store.dispatch((updateOpenItemsFlag()));
            }

        }

        return store.getState().currentUserOpenDesignUpdateItems;
    };

    // Recursive function to close all children down to the bottom of the tree
    closeChildren(designComponent, currentList){

        store.dispatch(setCurrentUserOpenDesignUpdateItems(
            currentList,
            designComponent._id,
            false
        ));

        let childComponents = DesignUpdateComponents.find(
            {
                designVersionId: designComponent.designVersionId,
                designUpdateId: designComponent.designUpdateId,
                componentParentReferenceIdNew: designComponent.componentReferenceId,
                componentType: {$ne:(ComponentType.SCENARIO)}
            }
        );

        if(childComponents.count() > 0){
            childComponents.forEach((child) => {

                // Recursively call for these children
                this.closeChildren(child, currentList)
            });

            return true;

        } else {
            return false;
        }
    };

    // Call this after a change that might need the summary updating.  It wil only actually update if the data has been
    // marked as stale on the server...
    refreshDesignUpdateSummary(designUpdateComponent){

        ClientDesignUpdateServices.getDesignUpdateSummary(designUpdateComponent.designUpdateId);

    }

}

export default new ClientDesignUpdateComponentServices();