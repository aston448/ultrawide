// == IMPORTS ==========================================================================================================

// Ultrawide collections
import {DesignComponents}           from '../collections/design/design_components.js';
import {DesignUpdateComponents}     from '../collections/design_update/design_update_components.js';
import {UserUnitTestMashData}        from '../collections/dev/user_unit_test_mash_data.js';
import {UserWorkPackageMashData}    from '../collections/dev/user_work_package_mash_data.js';
//import {UserAccTestMashData}        from '../collections/dev/user_acc_test_mash_data.js';

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
import {setCurrentUserItemContext, setCurrentUserOpenDesignItems, updateDesignComponentName, updateUserMessage} from '../redux/actions'

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

        if(result != Validation.VALID){
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
                    messageType: MessageType.INFO,
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
                    messageType: MessageType.INFO,
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
                    messageType: MessageType.INFO,
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
                        messageType: MessageType.INFO,
                        messageText: DesignComponentMessages.MSG_NEW_DESIGN_SECTION_ADDED
                    }));
                }
            }
        );

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User clicked Add Sub Section inside a Design Section ------------------------------------------------------------
    addDesignSectionToDesignSection(view, mode, parentComponent){

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
                        messageType: MessageType.INFO,
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
                        messageType: MessageType.INFO,
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
                        messageType: MessageType.INFO,
                        messageText: DesignComponentMessages.MSG_NEW_FEATURE_ASPECT_ADDED
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
        let result = DesignComponentValidationApi.validateAddDesignComponent(view, mode, ComponentType.SCENARIO);

        if(result != Validation.VALID){
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
            scenarioStepId:                 'NONE',
            featureFilesLocation:           userContext.featureFilesLocation,
            acceptanceTestResultsLocation:  userContext.acceptanceTestResultsLocation,
            integrationTestResultsLocation: userContext.integrationTestResultsLocation,
            unitTestResultsLocation:      userContext.unitTestResultsLocation
        };

        store.dispatch(setCurrentUserItemContext(context, true));

        // Real action call
        ServerDesignComponentApi.removeDesignComponent(
            view,
            mode,
            designComponent._id,
            designComponent.componentParentId,
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

        if(newDesignComponentId != userContext.designComponentId) {

            // See if any of the feature specific fields need setting
            let component = null;
            let componentFeatureRef = '';
            let componentParentRef = '';

            if(userContext.designUpdateId === 'NONE' || displayContext === DisplayContext.BASE_VIEW){
                component = DesignComponents.findOne({_id: newDesignComponentId});
                componentFeatureRef = component.componentFeatureReferenceId;
                componentParentRef = component.componentParentReferenceId;
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
                    if(componentParentRef != componentFeatureRef){
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
                scenarioStepId:                 'NONE',
                featureFilesLocation:           userContext.featureFilesLocation,
                acceptanceTestResultsLocation:  userContext.acceptanceTestResultsLocation,
                integrationTestResultsLocation: userContext.integrationTestResultsLocation,
                unitTestResultsLocation:        userContext.unitTestResultsLocation
            };

            store.dispatch(setCurrentUserItemContext(context, true));

            return context;
        }

        // Not an error - just indicates no change
        return userContext;
    };

    // User opened or closed a design component ------------------------------------------------------------------------
    setOpenClosed(designComponent, currentList, newState){

        if(designComponent.componentType === ComponentType.FEATURE){
            // Open or close the whole feature

            const featureComponents = DesignComponents.find(
                {
                    designVersionId: designComponent.designVersionId,
                    componentFeatureReferenceId: designComponent.componentFeatureReferenceId
                }
            );

            featureComponents.forEach((component) => {
                store.dispatch(setCurrentUserOpenDesignItems(
                    Meteor.userId(),
                    currentList,
                    component._id,
                    newState
                ));
            });

        } else {

            if(newState){
                // Open - just open this item
                store.dispatch(setCurrentUserOpenDesignItems(
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

        return {success: true, message: ''};
    };


    // Recursive function to close all children down to the bottom of the tree
    closeChildren(designComponent, currentList){

        // If component is open close it and move down to children
        if(currentList.includes(designComponent._id)) {

            let childComponents = DesignComponents.find(
                {
                    designVersionId: designComponent.designVersionId,
                    componentParentReferenceId: designComponent.componentReferenceId
                }
            );

            if(childComponents.count() > 0){
                childComponents.forEach((child) => {



                        store.dispatch(setCurrentUserOpenDesignItems(
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
        } else {
            return false;
        }

    };

    // User chose to refresh implementation progress data --------------------------------------------------------------
    // getProgressData(designComponent, userContext){
    //
    //     switch(designComponent.componentType){
    //         case ComponentType.FEATURE:
    //             // Get number of Scenarios defined
    //             const scenarioCount = DesignComponents.find({
    //                 designVersionId:                designComponent.designVersionId,
    //                 componentType:                  ComponentType.SCENARIO,
    //                 componentFeatureReferenceId:    designComponent.componentReferenceId
    //             }).count();
    //
    //             // Get number of passing tests
    //             const passingUnitTestsCount = UserUnitTestMashData.find({
    //                 userId:                         userContext.userId,
    //                 designFeatureReferenceId:       designComponent.componentReferenceId,
    //                 testOutcome:                    MashTestStatus.MASH_PASS
    //             }).count();
    //
    //             const passingIntegrationTestsCount = UserWorkPackageMashData.find({
    //                 userId:                         userContext.userId,
    //                 designVersionId:                designComponent.designVersionId,
    //                 designFeatureReferenceId:       designComponent.componentReferenceId,
    //                 intMashTestStatus:                 MashTestStatus.MASH_PASS
    //             }).count();
    //
    //             const passingAcceptanceTestsCount = UserAccTestMashData.find({
    //                 userId:                         userContext.userId,
    //                 designVersionId:                designComponent.designVersionId,
    //                 designFeatureReferenceId:       designComponent.componentReferenceId,
    //                 mashTestStatus:                 MashTestStatus.MASH_PASS
    //             }).count();
    //
    //             // Get number of failing tests
    //             const failingUnitTestsCount = UserUnitTestMashData.find({
    //                 userId:                         userContext.userId,
    //                 designFeatureReferenceId:       designComponent.componentReferenceId,
    //                 testOutcome:                    MashTestStatus.MASH_FAIL
    //             }).count();
    //
    //             const failingIntegrationTestsCount = UserWorkPackageMashData.find({
    //                 userId:                         userContext.userId,
    //                 designVersionId:                designComponent.designVersionId,
    //                 designFeatureReferenceId:       designComponent.componentReferenceId,
    //                 intMashTestStatus:                 MashTestStatus.MASH_FAIL
    //             }).count();
    //
    //             const failingAcceptanceTestsCount = UserAccTestMashData.find({
    //                 userId:                         userContext.userId,
    //                 designVersionId:                designComponent.designVersionId,
    //                 designFeatureReferenceId:       designComponent.componentReferenceId,
    //                 mashTestStatus:                 MashTestStatus.MASH_FAIL
    //             }).count();
    //
    //
    //             log((msg) => console.log(msg), LogLevel.TRACE, "Progress for {}.  Pass: {} Fail: {} ", designComponent.componentName, passingUnitTestsCount + passingAcceptanceTestsCount + passingAcceptanceTestsCount, failingUnitTestsCount + failingIntegrationTestsCount + failingAcceptanceTestsCount);
    //
    //             return({
    //                 featureCount:       0,
    //                 scenarioCount:      scenarioCount,
    //                 passingTestsCount:  passingUnitTestsCount + passingIntegrationTestsCount + passingAcceptanceTestsCount,
    //                 failingTestsCount:  failingUnitTestsCount + failingIntegrationTestsCount + failingAcceptanceTestsCount
    //             });
    //         case ComponentType.DESIGN_SECTION:
    //             // TODO - make this nesting compatible - currently only supports one level
    //             // Get number of Features defined
    //             const featureCount = DesignComponents.find({
    //                 designVersionId:                designComponent.designVersionId,
    //                 componentType:                  ComponentType.FEATURE,
    //                 componentParentReferenceId:     designComponent.componentReferenceId
    //             }).count();
    //
    //
    //             return({
    //                 featureCount:       featureCount,
    //                 scenarioCount:      0,
    //                 passingTestsCount:  0,
    //                 failingTestsCount:  0
    //             });
    //
    //         default:
    //
    //             return({
    //                 featureCount:       0,
    //                 scenarioCount:      0,
    //                 passingTestsCount:  0,
    //                 failingTestsCount:  0
    //             });
    //     }
    //
    // };

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