// == IMPORTS ==========================================================================================================

// Ultrawide Services
import { WorkPackageType, ComponentType, MessageType } from '../constants/constants.js';
import { Validation }                       from '../constants/validation_errors.js';
import { WorkPackageComponentMessages }     from '../constants/message_texts.js';

import WorkPackageComponentValidationApi    from '../apiValidation/apiWorkPackageComponentValidation.js';
import ServerWorkPackageComponentApi        from '../apiServer/apiWorkPackageComponent.js';

// Data Access
import WorkPackageData                      from '../data/work/work_package_db.js';
import WorkPackageComponentData             from '../data/work/work_package_component_db.js';
import DesignComponentData                  from '../data/design/design_component_db.js';
import DesignUpdateComponentData            from '../data/design_update/design_update_component_db.js';

// REDUX services
import store from '../redux/store'
import {setCurrentUserOpenWorkPackageItems, updateUserMessage, updateOpenItemsFlag, setWorkPackageScopeItems, setWorkPackageScopeFlag } from '../redux/actions';

// =====================================================================================================================
// Client API for Work Package Components
//
// Calls validation for client and then, if required, server API to update server data
// =====================================================================================================================

class ClientWorkPackageComponentServices {

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // User put an item in the scope view in or out of scope for a Work Package
    toggleInScope(view, displayContext, userContext, designComponentId, newScope){

        // Client validation
        let result = WorkPackageComponentValidationApi.validateToggleInScope(view, displayContext, userContext, designComponentId);

        if(result !== Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerWorkPackageComponentApi.toggleInScope(view, displayContext, userContext, designComponentId, newScope, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Calculate data used for managing scope rendering efficiently
                const workPackage = WorkPackageData.getWorkPackageById(userContext.workPackageId);
                const wpItems = WorkPackageData.getAllWorkPackageComponents(userContext.workPackageId);

                let addedItems = [];
                let removedItems = [];
                let currentItems = [];
                let designItem = null;

                wpItems.forEach((item) => {
                    if(workPackage.workPackageType === WorkPackageType.WP_BASE) {

                        designItem = DesignComponentData.getDesignComponentByRef(workPackage.designVersionId, item.componentReferenceId);

                    } else {

                        designItem = DesignUpdateComponentData.getUpdateComponentByRef(workPackage.designVersionId, workPackage.designUpdateId, item.componentReferenceId);

                    }
                    if(designItem) {
                        currentItems.push(designItem.componentReferenceId);
                    }
                });

                const wpScopeItems = store.getState().currentWorkPackageScopeItems;

                if(!newScope) {

                    // Make a list of anything no longer in DB
                    wpScopeItems.current.forEach((item) => {
                        if(!(currentItems.includes(item))){
                            removedItems.push(item);
                        }
                    });
                }

                store.dispatch(setWorkPackageScopeItems(
                    {
                        current:    currentItems,
                        added:      addedItems,
                        removed:    removedItems
                    }
                ));

                // Trigger items to update
                const wpScopeFlag = store.getState().currentWorkPackageScopeFlag;
                store.dispatch(setWorkPackageScopeFlag(wpScopeFlag));

                // Show action success on screen
                if(newScope) {
                    store.dispatch(updateUserMessage({
                        messageType: MessageType.INFO,
                        messageText: WorkPackageComponentMessages.MSG_WP_COMPONENT_IN_SCOPE
                    }));
                } else {
                    store.dispatch(updateUserMessage({
                        messageType: MessageType.INFO,
                        messageText: WorkPackageComponentMessages.MSG_WP_COMPONENT_OUT_SCOPE
                    }));
                }
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };


    // LOCAL CLIENT ACTIONS ============================================================================================

    // Gets the full details of a Design or Design Update item that relates to a Work Package item
    getDesignItem(componentId, wpType){

        switch(wpType){
            case WorkPackageType.WP_BASE:
                return DesignComponentData.getDesignComponentById(componentId);

            case WorkPackageType.WP_UPDATE:
                return DesignUpdateComponentData.getUpdateComponentById(componentId);

            default:
                // Does not apply for non WP views as the current item IS the Design item.
                return null;
        }
    }

    getWorkPackageComponent(componentReferenceId, workPackageId){

        //console.log("looking for wp component for WP " + workPackageId + " and component " + componentId);

        return WorkPackageComponentData.getWpComponentByComponentRef(workPackageId, componentReferenceId);

    }

    // User opened or closed a WP component
    setOpenClosed(wpComponent, currentList, setOpen){

        //console.log("WP toggle: open = " + setOpen);

        // Note - the component passed in here is either a Design Version Component - for base WP or Design Update Component - for Update WP
        const userContext = store.getState().currentUserItemContext;

        if(wpComponent.componentType === ComponentType.FEATURE){

            // Open or close the whole feature
            if(setOpen) {

                // Open the Feature
                store.dispatch(setCurrentUserOpenWorkPackageItems(
                    currentList,
                    wpComponent._id,
                    setOpen
                ));

                // And its child Aspects
                let featureComponents = WorkPackageComponentData.getChildComponentsOfType(wpComponent.workPackageId, ComponentType.FEATURE_ASPECT, wpComponent.componentReferenceId);

                featureComponents.forEach((component) => {

                    store.dispatch(setCurrentUserOpenWorkPackageItems(
                        currentList,
                        component._id,
                        true
                    ));
                });

                store.dispatch((updateOpenItemsFlag(wpComponent._id)));

            } else {

                this.closeChildren(userContext, wpComponent, currentList);
                store.dispatch((updateOpenItemsFlag(wpComponent._id)));
            }

        } else {

            if(setOpen) {

                // Just open or close the item
                store.dispatch(setCurrentUserOpenWorkPackageItems(
                    currentList,
                    wpComponent._id,
                    setOpen
                ));

                store.dispatch((updateOpenItemsFlag(wpComponent._id)));

            } else {

                // Close all items below
                this.closeChildren(userContext, wpComponent, currentList);
                store.dispatch((updateOpenItemsFlag(wpComponent._id)));
            }
        }

        return store.getState().currentUserOpenWorkPackageItems;
    };

    // Recursive function to close all children down to the bottom of the tree
    closeChildren(userContext, wpComponent, currentList){

        store.dispatch(setCurrentUserOpenWorkPackageItems(
            currentList,
            wpComponent._id,
            false
        ));

        // Get children in WP - no need to close scenarios
        let childComponents = WorkPackageComponentData.getNonScenarioChildComponents(userContext.workPackageId, wpComponent.componentReferenceId);

        if(childComponents.length > 0){

            childComponents.forEach((child) => {

                // Recursively call for this child
                this.closeChildren(userContext, child, currentList)

            });

            return true;

        } else {
            return false;
        }
    };

}

export default new ClientWorkPackageComponentServices();

