// == IMPORTS ==========================================================================================================

// Ultrawide Services
import { ComponentType, DisplayContext, ViewType, LogLevel, MessageType, DesignVersionStatus} from '../constants/constants.js';
import { DesignComponentMessages } from '../constants/message_texts.js';
import { Validation } from '../constants/validation_errors.js';

import ServerDesignComponentApi      from '../apiServer/apiDesignComponent.js';
import DesignComponentValidationApi  from '../apiValidation/apiDesignComponentValidation.js';
import ClientUserContextServices     from '../apiClient/apiClientUserContext.js';
import ClientWorkPackageServices     from '../apiClient/apiClientWorkPackage.js';
import ServerWorkPackageApi          from '../apiServer/apiWorkPackage.js';

import {log} from '../common/utils.js';

// Data Access
import DesignVersionData                from '../data/design/design_version_db.js';
import WorkPackageData                  from '../data/work/work_package_db.js';
import DesignComponentData              from '../data/design/design_component_db.js';
import DesignUpdateComponentData        from '../data/design_update/design_update_component_db.js';

// REDUX services
import store from '../redux/store'
import {setCurrentUserItemContext, setCurrentUserOpenDesignItems, updateDesignComponentName, updateUserMessage, updateOpenItemsFlag, setCurrentView} from '../redux/actions'
import apiWorkPackage from "../apiServer/apiWorkPackage";

// =====================================================================================================================
// Client API for Design Components
//
// Calls validation for client and then, if required, server API to update server data
// =====================================================================================================================
class ClientDesignComponentServices{

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // User saved a change to design component name --------------------------------------------------------------------
    updateComponentName(view, mode, designComponentId, newPlainText, newRawText){

        const designVersionComponent = DesignComponentData.getDesignComponentById(designComponentId);
        const wasNew = designVersionComponent.isNew;

        // See if it really did change
        if(designVersionComponent.componentNameNew === newPlainText){
            return {success: true, message: ''};
        }

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

        // If it was a new component, open it on first naming
        if(wasNew && designVersionComponent.componentType !== ComponentType.SCENARIO){
            const existingOpenItems = store.getState().currentUserOpenDesignItems;
            store.dispatch(setCurrentUserOpenDesignItems(existingOpenItems, designComponentId, true))
        }

        // Indicate that business validation passed
        return {success: true, message: ''};
    };



    // User saved changes to Narrative in a Feature --------------------------------------------------------------------
    updateFeatureNarrative(view, mode, designComponentId, newPlainText, newRawText){

        // Client validation
        let result = DesignComponentValidationApi.validateUpdateFeatureNarrative(view, mode);

        if(result !== Validation.VALID){
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

        if(result !== Validation.VALID){
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

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call
        ServerDesignComponentApi.addDesignSectionToApplication(
            view,
            mode,
            parentComponent.designVersionId,
            parentComponent.componentReferenceId,
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

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call
        ServerDesignComponentApi.addDesignSectionToDesignSection(
            view,
            mode,
            parentComponent.designVersionId,
            parentComponent.componentReferenceId,
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

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call
        ServerDesignComponentApi.addFeatureToDesignSection(
            view,
            mode,
            parentComponent.designVersionId,
            parentComponent.componentReferenceId,
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
    addFeatureAspectToFeature(view, mode, parentComponent, workPackageId){

        // Client validation
        let result = DesignComponentValidationApi.validateAddDesignComponent(view, mode, ComponentType.FEATURE_ASPECT);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call
        ServerDesignComponentApi.addFeatureAspectToFeature(
            view,
            mode,
            parentComponent.designVersionId,
            parentComponent.componentReferenceId,
            workPackageId,
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

        const userContext = store.getState().currentUserItemContext;

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
            parentComponent.componentReferenceId,
            workPackageId,
            (err, result) => {

                if(err){
                    // Unexpected error as all expected errors already handled - show alert.
                    // Can't update screen here because of error
                    alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
                } else {
                    // Add Scenario Actions:

                    // Update WP Completeness if in a WP
                    if(workPackageId !== 'NONE') {
                        ServerWorkPackageApi.updateWorkPackageTestCompleteness(userContext, workPackageId, (err, result) => {
                            if(err){
                                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
                            }
                        });
                    }

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

        if(result !== Validation.VALID){
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
            (err, result) => {

                if(err){
                    // Unexpected error as all expected errors already handled - show alert.
                    // Can't update screen here because of error
                    alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
                } else {
                    // Remove Design Component Actions:

                    // Update WP Completeness if a Scenario in a WP
                    if(userContext.workPackageId !== 'NONE' && designComponent.componentType === ComponentType.SCENARIO) {
                        ServerWorkPackageApi.updateWorkPackageTestCompleteness(userContext, userContext.workPackageId, (err, result) => {
                            if(err){
                                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
                            }
                        });
                    }

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

        if(result !== Validation.VALID){
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

        if(result !== Validation.VALID){
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

            if(userContext.designUpdateId === 'NONE' ||
                displayContext === DisplayContext.UPDATE_SCOPE ||
                displayContext === DisplayContext.WORKING_VIEW ||
                displayContext === DisplayContext.BASE_EDIT
            ){
                component = DesignComponentData.getDesignComponentById(newDesignComponentId);
                componentFeatureRef = component.componentFeatureReferenceIdNew;
                componentParentRef = component.componentParentReferenceIdNew;
            } else {
                component = DesignUpdateComponentData.getUpdateComponentById(newDesignComponentId);
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

    // User has clicked on the WP icon for a Scenario in the DV working view
    gotoWorkPackage(workPackageId){

        const wp = WorkPackageData.getWorkPackageById(workPackageId);

        const currentUserContext = store.getState().currentUserItemContext;

        // Set the context to indicate the DV or DU that contains the WP
        const newContext = {
            userId:                         currentUserContext.userId,
            designId:                       currentUserContext.designId,
            designVersionId:                currentUserContext.designVersionId,
            designUpdateId:                 wp.designUpdateId,
            workPackageId:                  'NONE',
            designComponentId:              'NONE',
            designComponentType:            'NONE',
            featureReferenceId:             'NONE',
            featureAspectReferenceId:       'NONE',
            scenarioReferenceId:            'NONE',
            scenarioStepId:                 'NONE'
        };

        store.dispatch(setCurrentUserItemContext(newContext, true));

        // And switch to the selection view
        store.dispatch(setCurrentView(ViewType.SELECT));

        // And select the WP wanted
        ClientWorkPackageServices.setWorkPackage(newContext, workPackageId)

    }

    gotoFeature(featureReferenceId){

        const userContext = store.getState().currentUserItemContext;
        const dv = DesignVersionData.getDesignVersionById(userContext.designVersionId);
        const feature = DesignComponentData.getDesignComponentByRef(userContext.designVersionId, featureReferenceId);

        // Set the Feature as current component
        const newContext = {
            userId:                         userContext.userId,
            designId:                       userContext.designId,
            designVersionId:                userContext.designVersionId,
            designUpdateId:                 'NONE',
            workPackageId:                  'NONE',
            designComponentId:              feature._id,
            designComponentType:            ComponentType.FEATURE,
            featureReferenceId:             featureReferenceId,
            featureAspectReferenceId:       'NONE',
            scenarioReferenceId:            'NONE',
            scenarioStepId:                 'NONE'
        };

        store.dispatch(setCurrentUserItemContext(newContext, true));

        // And switch to the design version view
        if(dv.designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE || dv.designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE_COMPLETE){
            store.dispatch(setCurrentView(ViewType.DESIGN_UPDATABLE));
        } else {
            store.dispatch(setCurrentView(ViewType.DESIGN_PUBLISHED));
        }

        // Open it and its parents

        // Close all items to start with

        let openList = [];

        store.dispatch(setCurrentUserOpenDesignItems(
            openList,
            null,
            false
        ));

        // Open the selected feature

        store.dispatch(setCurrentUserOpenDesignItems(
            openList,
            feature._id,
            true
        ));

        // Also open the feature aspects
        const featureComponents = DesignComponentData.getNonScenarioFeatureComponents(userContext.designVersionId, featureReferenceId);

        featureComponents.forEach((component) => {
            store.dispatch(setCurrentUserOpenDesignItems(
                openList,
                component._id,
                true
            ));
        });

        // Recursively open up to top
        const newList = store.getState().currentUserOpenDesignItems;

        // And move on up
        this.openParent(feature._id, newList);

    }

    // User opened or closed a design component ------------------------------------------------------------------------
    setOpenClosed(designComponent, currentList, setOpen){

        if(designComponent.componentType === ComponentType.FEATURE){

            // Open or close the whole feature
            if(setOpen) {
                // No need to get scenarios as they can't be opened
                const featureComponents = DesignComponentData.getNonScenarioFeatureComponents(designComponent.designVersionId, designComponent.componentReferenceId);

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
        let childComponents = DesignComponentData.getNonScenarioChildComponents(designComponent.designVersionId, designComponent.componentReferenceId);

        if (childComponents.length > 0) {
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

    openSearchResultScenario(scenarioId, userContext, displayContext){

        // Close all items to start with

        let openList = [];

        store.dispatch(setCurrentUserOpenDesignItems(
            openList,
            null,
            false
        ));

        // Open the selected item and set it as current

        store.dispatch(setCurrentUserOpenDesignItems(
            openList,
            scenarioId,
            true
        ));

        this.setDesignComponent(scenarioId, userContext, displayContext);

        // Recursively open up to top
        const newList = store.getState().currentUserOpenDesignItems;

        // And move on up
        this.openParent(scenarioId, newList);
    }

    openParent(componentId, currentList){

        const component = DesignComponentData.getDesignComponentById(componentId);

        if(component.componentParentReferenceIdNew !== 'NONE'){

            // Get Parent
            const parent = DesignComponentData.getDesignComponentByRef(component.designVersionId, component.componentParentReferenceIdNew);
            // Open the parent
            store.dispatch(setCurrentUserOpenDesignItems(
                currentList,
                parent._id,
                true
            ));

            const newList = store.getState().currentUserOpenDesignItems;

            // And move on up
            this.openParent(parent._id, newList);
        }
    }

    getCurrentItem(userContext){

        return DesignComponentData.getDesignComponentById(userContext.designComponentId);
    }

    getNewAndOldRawText(newText, oldText){

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