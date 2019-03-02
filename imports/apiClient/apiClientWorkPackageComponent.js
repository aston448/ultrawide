// == IMPORTS ==========================================================================================================

// Ultrawide Services
import { WorkPackageType, ComponentType, MessageType, LogLevel } from '../constants/constants.js';
import { Validation }                       from '../constants/validation_errors.js';
import { WorkPackageComponentMessages }     from '../constants/message_texts.js';
import { log } from "../common/utils";

import { WorkPackageComponentValidationApi }    from '../apiValidation/apiWorkPackageComponentValidation.js';
import { ServerWorkPackageComponentApi }        from '../apiServer/apiWorkPackageComponent.js';

// Data Access
import { WorkPackageData }                      from '../data/work/work_package_db.js';
import { WorkPackageComponentData }            from '../data/work/work_package_component_db.js';
import { DesignComponentData }                  from '../data/design/design_component_db.js';
import { DesignUpdateComponentData }            from '../data/design_update/design_update_component_db.js';

// REDUX services
import store from '../redux/store'
import {
    setCurrentUserOpenWorkPackageItems, updateUserMessage, updateOpenItemsFlag, setWorkPackageScopeItems,
    setWorkPackageScopeFlag, setUpdateScopeItems, setCurrentView
} from '../redux/actions';
import {ViewType} from "../constants/constants";
import {DesignComponentModules} from "../service_modules/design/design_component_service_modules";


// =====================================================================================================================
// Client API for Work Package Components
//
// Calls validation for client and then, if required, server API to update server data
// =====================================================================================================================

class ClientWorkPackageComponentServicesClass {

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // User put an item in the scope view in or out of scope for a Work Package
    toggleInScope(view, displayContext, userContext, designComponent, newScope){

        // Client validation
        let result = WorkPackageComponentValidationApi.validateToggleInScope(view, displayContext, userContext, designComponent._id);

        if(result !== Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        const currentView = store.getState().currentAppView;

        log((msg) => console.log(msg), LogLevel.PERF, "Current view is {}", currentView);

        // Disable the scope pane while big updates are taking place...
        store.dispatch(setCurrentView(ViewType.WORK_PACKAGE_SCOPE_WAIT));

        store.dispatch(updateUserMessage({
            messageType: MessageType.INFO,
            messageText: 'Scoping WP Components...'
        }));

        // Real action call - server actions
        ServerWorkPackageComponentApi.toggleInScope(view, displayContext, userContext, designComponent._id, newScope, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                console.log('%o', err);
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                log((msg) => console.log(msg), LogLevel.PERF, 'Render scope management start...');

                // Calculate data used for managing scope rendering efficiently
                const wpItems = WorkPackageData.getAllWorkPackageComponents(userContext.workPackageId);

                let currentItems = [];
                let currentParents = [];
                let currentChildren = [];

                // Scoping a WP item puts all children in scope too so will need to redraw them
                if(userContext.designUpdateId === 'NONE') {

                    // Base design - get stuff from DV
                    currentParents =  DesignComponentModules.getAllDvComponentParents(designComponent); //DesignComponentData.getAllParents(designComponent, currentParents);
                    currentChildren = DesignComponentModules.getAllDvChildComponents(designComponent); //DesignComponentData.getAllChildren(designComponent, currentChildren);
                } else {

                    // Design Update
                    currentParents = DesignUpdateComponentData.getAllParents(designComponent, currentParents);
                    currentChildren = DesignUpdateComponentData.getAllChildren(designComponent, currentChildren);
                }

                // console.log('WP Current children = %o', currentChildren);

                wpItems.forEach((item) => {

                    const currentItem = {
                        ref: item.componentReferenceId,
                        scopeType: item.scopeType
                    };

                    currentItems.push(currentItem);

                });

                const scopeItems = store.getState().currentWorkPackageScopeItems;

                // Trigger update by changing flag
                const newFlag = scopeItems.flag + 1;

                store.dispatch(setWorkPackageScopeItems(
                    {
                        flag:               newFlag,
                        currentParents:     currentParents,
                        currentChildren:    currentChildren,
                        changingItemId:     designComponent._id,
                        current:            currentItems
                    }
                ));

                //store.dispatch(setWorkPackageScopeFlag(newFlag));

                log((msg) => console.log(msg), LogLevel.PERF, 'Render scope management end');

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

                // Back to normal
                store.dispatch(setCurrentView(currentView));
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

        //console.log("WP toggle: open = %s for %o", setOpen, wpComponent);

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

export const ClientWorkPackageComponentServices = new ClientWorkPackageComponentServicesClass();

