// == IMPORTS ==========================================================================================================

// Ultrawide collections
import {DesignVersionComponents}        from '../collections/design/design_version_components.js';
import {DesignUpdateComponents}         from '../collections/design_update/design_update_components.js';
import {UserUnitTestMashData}           from '../collections/dev/user_unit_test_mash_data.js';
import {UserWorkPackageMashData}        from '../collections/dev/user_work_package_mash_data.js';

// Ultrawide Services
import { ComponentType, DisplayContext, MashTestStatus, LogLevel, MessageType} from '../constants/constants.js';
import { DesignComponentMessages } from '../constants/message_texts.js';
import { Validation } from '../constants/validation_errors.js';

import ServerDesignComponentApi      from '../apiServer/apiDesignComponent.js';
import DesignComponentValidationApi  from '../apiValidation/apiDesignComponentValidation.js';
import ClientUserContextServices     from '../apiClient/apiClientUserContext.js';

import {log} from '../common/utils.js';

// REDUX services
import store from '../redux/store'
import {setCurrentUserItemContext, setCurrentUserOpenDesignItems, updateDesignComponentName, updateUserMessage, updateOpenItemsFlag} from '../redux/actions'

// =====================================================================================================================
// Client API for Design Components
//
// Calls validation for client and then, if required, server API to update server data
// =====================================================================================================================
class ClientDesignComponentServices{

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // User saved a change to design component name --------------------------------------------------------------------
    updateComponentName(view, mode, designComponentId, newPlainText, newRawText){

        // Client validation
        let result = DesignComponentValidationApi.validateUpdateComponentName(view, mode, designComponentId, newPlainText);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call
        ServerDesignComponentApi.updateComponentName(view, mode, designComponentId, newPlainText, newRawText, (err, result) => {

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
                    messageType: MessageType.SUCCESS,
                    messageText: DesignComponentMessages.MSG_COMPONENT_NAME_UPDATED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User saved changes to Narrative in a Feature --------------------------------------------------------------------
    updateFeatureNarrative(view, mode, designComponentId, newPlainText, newRawText){

        // Client validation
        let result = DesignComponentValidationApi.validateUpdateFeatureNarrative(view, mode);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call
        ServerDesignComponentApi.updateFeatureNarrative(view, mode, designComponentId, newPlainText, newRawText, (err, result) => {

            if(err){
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Update Feature Narrative Actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.SUCCESS,
                    messageText: DesignComponentMessages.MSG_FEATURE_NARRATIVE_UPDATED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User clicked Add Application in the main Design Applications container ------------------------------------------
    addApplicationToDesignVersion(view, mode, designVersionId) {

        // Client validation
        let result = DesignComponentValidationApi.validateAddDesignComponent(view, mode, ComponentType.APPLICATION);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call
        ServerDesignComponentApi.addApplicationToDesignVersion(view, mode, designVersionId, (err, result) => {

            if(err){
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Add Application Actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.SUCCESS,
                    messageText: DesignComponentMessages.MSG_NEW_APPLICATION_ADDED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User clicked Add Design Section inside an Application component -------------------------------------------------
    addDesignSectionToApplication(view, mode, parentComponent){

        // Client validation
        let result = DesignComponentValidationApi.validateAddDesignComponent(view, mode, ComponentType.DESIGN_SECTION);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call
        ServerDesignComponentApi.addDesignSectionToApplication(
            view,
            mode,
            parentComponent.designVersionId,
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
                        messageType: MessageType.SUCCESS,
                        messageText: DesignComponentMessages.MSG_NEW_DESIGN_SECTION_ADDED
                    }));
                }
            }
        );

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User clicked Add Sub Section inside a Design Section ------------------------------------------------------------
    addSectionToDesignSection(view, mode, parentComponent){

        // Client validation
        let result = DesignComponentValidationApi.validateAddDesignComponent(view, mode, ComponentType.DESIGN_SECTION);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call
        ServerDesignComponentApi.addDesignSectionToDesignSection(
            view,
            mode,
            parentComponent.designVersionId,
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
                        messageType: MessageType.SUCCESS,
                        messageText: DesignComponentMessages.MSG_NEW_DESIGN_SECTION_ADDED
                    }));
                }
            }
        );

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User clicked Add Feature inside a Design Section ----------------------------------------------------------------
    addFeatureToDesignSection(view, mode, parentComponent){

        // Client validation
        let result = DesignComponentValidationApi.validateAddDesignComponent(view, mode, ComponentType.FEATURE);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call
        ServerDesignComponentApi.addFeatureToDesignSection(
            view,
            mode,
            parentComponent.designVersionId,
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
                        messageType: MessageType.SUCCESS,
                        messageText: DesignComponentMessages.MSG_NEW_FEATURE_ADDED
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
        let result = DesignComponentValidationApi.validateAddDesignComponent(view, mode, ComponentType.FEATURE_ASPECT);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call
        ServerDesignComponentApi.addFeatureAspectToFeature(
            view,
            mode,
            parentComponent.designVersionId,
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
                        messageType: MessageType.SUCCESS,
                        messageText: DesignComponentMessages.MSG_NEW_FEATURE_ASPECT_ADDED
                    }));
                }
            }
        );

        // Indicate that business validation passed
        return {success: true, message: ''};

    };

    // User clicked Add Scenario in either a Feature or Feature Aspect -------------------------------------------------
    addScenario(view, mode, parentComponent, workPackageId){

        // Client validation
        let result = DesignComponentValidationApi.validateAddDesignComponent(view, mode, ComponentType.SCENARIO);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call
        ServerDesignComponentApi.addScenario(
            view,
            mode,
            parentComponent.designVersionId,
            parentComponent._id,
            workPackageId,
            (err, result) => {

                if(err){
                    // Unexpected error as all expected errors already handled - show alert.
                    // Can't update screen here because of error
                    alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
                } else {
                    // Add Scenario Actions:

                    // Show action success on screen
                    store.dispatch(updateUserMessage({
                        messageType: MessageType.SUCCESS,
                        messageText: DesignComponentMessages.MSG_NEW_SCENARIO_ADDED
                    }));
                }
            }
        );

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User clicked Delete for a design component ----------------------------------------------------------------------
    removeDesignComponent(view, mode, designComponent, userContext){

        // Client validation
        let result = DesignComponentValidationApi.validateRemoveDesignComponent(view, mode, designComponent._id);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // There can now be no component selected...  Do this update first so errors not caused by server delay
        const context = {
            userId:                         userContext.userId,
            designId:                       userContext.designId,
            designVersionId:                userContext.designVersionId,
            designUpdateId:                 userContext.designUpdateId,
            workPackageId:                  userContext.workPackageId,
            designComponentId:              'NONE',
            designComponentType:            'NONE',
            featureReferenceId:             'NONE',
            featureAspectReferenceId:       'NONE',
            scenarioReferenceId:            'NONE',
            scenarioStepId:                 'NONE'
        };

        store.dispatch(setCurrentUserItemContext(context, true));

        // Real action call
        ServerDesignComponentApi.removeDesignComponent(
            view,
            mode,
            designComponent._id,
            designComponent.componentParentIdNew,
            (err, result) => {

                if(err){
                    // Unexpected error as all expected errors already handled - show alert.
                    // Can't update screen here because of error
                    alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
                } else {
                    // Remove Design Component Actions:


                    // Show action success on screen
                    store.dispatch(updateUserMessage({
                        messageType: MessageType.INFO,
                        messageText: DesignComponentMessages.MSG_DESIGN_COMPONENT_REMOVED
                    }));

                    // Reset the user context of other users where this Design Component is selected (if any)
                    ClientUserContextServices.resetContextsOnDesignComponentRemoval(designComponent._id)
                }
            }
        );

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User dragged a component to a new location in the design --------------------------------------------------------
    moveDesignComponent(view, mode, displayContext, movingComponentId, newParentComponentId){

        // Client validation
        let result = DesignComponentValidationApi.validateMoveDesignComponent(view, mode, displayContext, movingComponentId, newParentComponentId);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call
        ServerDesignComponentApi.moveDesignComponent(
            view,
            mode,
            displayContext,
            movingComponentId,
            newParentComponentId,
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
                        messageText: DesignComponentMessages.MSG_DESIGN_COMPONENT_MOVED
                    }));

                }
            }
        );

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User dragged a component to a new position in its current list --------------------------------------------------
    reorderDesignComponent(view, mode, displayContext, movingComponentId, targetComponentId){

        // Client validation
        let result = DesignComponentValidationApi.validateReorderDesignComponent(view, mode, displayContext, movingComponentId, targetComponentId);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call
        ServerDesignComponentApi.reorderDesignComponent(
            view,
            mode,
            displayContext,
            movingComponentId,
            targetComponentId,
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
                        messageText: DesignComponentMessages.MSG_DESIGN_COMPONENT_REORDERED
                    }));

                }
            }
        );

        // Indicate that business validation passed
        return {success: true, message: ''};
    };


    // LOCAL CLIENT ACTIONS ============================================================================================

    // User selected a design component --------------------------------------------------------------------------------
    setDesignComponent(newDesignComponentId, userContext, displayContext){
        //console.log("Selected component with id " + newDesignComponentId);

        if(newDesignComponentId !== userContext.designComponentId) {

            // See if any of the feature specific fields need setting
            let component = null;
            let componentFeatureRef = '';
            let componentParentRef = '';

            if(userContext.designUpdateId === 'NONE' || displayContext === DisplayContext.UPDATE_SCOPE){
                component = DesignVersionComponents.findOne({_id: newDesignComponentId});
                componentFeatureRef = component.componentFeatureReferenceIdNew;
                componentParentRef = component.componentParentReferenceIdNew;
            } else {
                component = DesignUpdateComponents.findOne({_id: newDesignComponentId});
                componentFeatureRef = component.componentFeatureReferenceIdNew;
                componentParentRef = component.componentParentReferenceIdNew;
            }

            let featureReferenceId = 'NONE';
            let featureAspectReferenceId = 'NONE';
            let scenarioReferenceId = 'NONE';

            switch(component.componentType){
                case ComponentType.FEATURE:
                    featureReferenceId = component.componentReferenceId;
                    break;
                case ComponentType.FEATURE_ASPECT:
                    featureAspectReferenceId = component.componentReferenceId;
                    featureReferenceId = componentFeatureRef;
                    break;
                case ComponentType.SCENARIO:
                    featureReferenceId = componentFeatureRef;
                    // If this Scenario is not directly under its feature then the parent is the Feature Aspect
                    if(componentParentRef !== componentFeatureRef){
                        featureAspectReferenceId = componentParentRef;
                    }
                    scenarioReferenceId = component.componentReferenceId;
                    break;
            }

            // Update context to new component
            const context = {
                userId:                         userContext.userId,
                designId:                       userContext.designId,
                designVersionId:                userContext.designVersionId,
                designUpdateId:                 userContext.designUpdateId,
                workPackageId:                  userContext.workPackageId,
                designComponentId:              newDesignComponentId,
                designComponentType:            component.componentType,
                featureReferenceId:             featureReferenceId,
                featureAspectReferenceId:       featureAspectReferenceId,
                scenarioReferenceId:            scenarioReferenceId,
                scenarioStepId:                 'NONE'
            };

            store.dispatch(setCurrentUserItemContext(context, true));

            // Clear user message when new component selected
            store.dispatch(updateUserMessage({
                messageType: MessageType.INFO,
                messageText: 'Design item selected'
            }));

            return context;
        }

        // Not an error - just indicates no change
        return userContext;
    };

    // User opened or closed a design component ------------------------------------------------------------------------
    setOpenClosed(designComponent, currentList, setOpen){

        if(designComponent.componentType === ComponentType.FEATURE){

            // Open or close the whole feature
            if(setOpen) {
                const featureComponents = DesignVersionComponents.find(
                    {
                        designVersionId: designComponent.designVersionId,
                        componentFeatureReferenceIdNew: designComponent.componentReferenceId,
                        componentType: {$ne:(ComponentType.SCENARIO)}
                    }
                );

                featureComponents.forEach((component) => {
                    store.dispatch(setCurrentUserOpenDesignItems(
                        currentList,
                        component._id,
                        setOpen
                    ));
                });

                store.dispatch((updateOpenItemsFlag(designComponent._id)));
            } else {

                store.dispatch(setCurrentUserOpenDesignItems(
                    currentList,
                    designComponent._id,
                    false
                ));

                store.dispatch((updateOpenItemsFlag(designComponent._id)));

                this.closeChildren(designComponent, currentList);

            }

        } else {

            if(setOpen){
                // Open - just open this item
                store.dispatch(setCurrentUserOpenDesignItems(
                    currentList,
                    designComponent._id,
                    setOpen
                ));

                store.dispatch((updateOpenItemsFlag(designComponent._id)));

            } else {
                // Close - close all children

                store.dispatch(setCurrentUserOpenDesignItems(
                    currentList,
                    designComponent._id,
                    false
                ));

                store.dispatch((updateOpenItemsFlag(designComponent._id)));

                this.closeChildren(designComponent, currentList);
            }

        }

        return store.getState().currentUserOpenDesignItems;
    };


    // Recursive function to close all children down to the bottom of the tree
    closeChildren(designComponent, currentList){

        // If component is open close it and move down to children
        let childComponents = DesignVersionComponents.find(
            {
                designVersionId: designComponent.designVersionId,
                componentParentReferenceIdNew: designComponent.componentReferenceId,
                componentType: {$ne: (ComponentType.SCENARIO)}
            }
        );

        if (childComponents.count() > 0) {
            childComponents.forEach((child) => {

                if (currentList.includes(child._id)) {

                    store.dispatch(setCurrentUserOpenDesignItems(
                        currentList,
                        child._id,
                        false
                    ));

                    // Recursively call for these children
                    this.closeChildren(child, currentList)
                }

            });

            return true;

        } else {
            return false;
        }
    };


    getNewAndOldRawText(newText, oldText){

        // let plainText = 'NEW: ' + newText + '\n' + 'OLD: ' + oldText;
        //
        // return {
        //     "entityMap" : {  },
        //     "blocks" : [
        //         { "key" : "5efv7", "text" : plainText,
        //             "type" : "unstyled",
        //             "depth" : 0,
        //             "inlineStyleRanges" : [
        //                 {
        //                     "offset" : 0,
        //                     "length" : 4,
        //                     "style" : "ITALIC"
        //                 }
        //             ],
        //             "entityRanges" : [ ],
        //             "data" : {  }
        //         }
        //     ]
        // };

        let newDisplayText = 'NEW: ' + newText;
        let oldDisplayText = 'OLD: ' + oldText;

        return {
            "entityMap" : {  },
            "blocks" : [
                { "key" : "5efv7", "text" : newDisplayText,
                    "type" : "unstyled",
                    "depth" : 0,
                    "inlineStyleRanges" : [
                        {
                            "offset" : 0,
                            "length" : 4,
                            "style" : "GREEN"
                        }
                    ],
                    "entityRanges" : [ ],
                    "data" : {  }
                },
                { "key" : "5efv8", "text" : oldDisplayText,
                    "type" : "unstyled",
                    "depth" : 0,
                    "inlineStyleRanges" : [
                        {
                            "offset" : 0,
                            "length" : 4,
                            "style" : "RED"
                        }
                    ],
                    "entityRanges" : [ ],
                    "data" : {  }
                }
            ]
        };

    }

}

export default new ClientDesignComponentServices();