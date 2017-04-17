// == IMPORTS ==========================================================================================================

// Ultrawide Collections
import {DesignVersionComponents}    from '../collections/design/design_version_components.js';
import {DesignUpdateComponents}     from '../collections/design_update/design_update_components.js'
import { WorkPackages }             from '../collections/work/work_packages.js';
import {WorkPackageComponents}      from '../collections/work/work_package_components.js'

// Ultrawide Services
import { WorkPackageType, ComponentType, MessageType } from '../constants/constants.js';
import { Validation } from '../constants/validation_errors.js';
import { WorkPackageComponentMessages } from '../constants/message_texts.js';

import WorkPackageComponentValidationApi from '../apiValidation/apiWorkPackageComponentValidation.js';
import ServerWorkPackageComponentApi     from '../apiServer/apiWorkPackageComponent.js';

// REDUX services
import store from '../redux/store'
import {setCurrentUserOpenWorkPackageItems, updateUserMessage, updateOpenItemsFlag, setWorkPackageScopeItems, setWorkPackageScopeFlag, updateTestDataFlag} from '../redux/actions';

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
                const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});
                const wpItems = WorkPackageComponents.find({workPackageId: userContext.workPackageId});

                let addedItems = [];
                let removedItems = [];
                let currentItems = [];
                let designItem = null;

                wpItems.forEach((item) => {
                    if(workPackage.workPackageType === WorkPackageType.WP_BASE) {
                        designItem = DesignVersionComponents.findOne({
                            designVersionId: workPackage.designVersionId,
                            componentReferenceId: item.componentReferenceId
                        });
                    } else {
                        designItem = DesignUpdateComponents.findOne({
                            designUpdateId: workPackage.designUpdateId,
                            componentReferenceId: item.componentReferenceId
                        });
                    }
                    if(designItem) {
                        currentItems.push(designItem._id);
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
                return DesignVersionComponents.findOne({_id: componentId});
            case WorkPackageType.WP_UPDATE:
                return DesignUpdateComponents.findOne({_id: componentId});
            default:
                // Does not apply for non WP views as the current item IS the Design item.
                return null;
        }
    }

    getWorkPackageComponent(componentId, workPackageId){

        //console.log("looking for wp component for WP " + workPackageId + " and component " + componentId);

        return WorkPackageComponents.findOne({workPackageId: workPackageId, componentId: componentId});
    }

    // User opened or closed a WP component
    setOpenClosed(wpType, wpComponent, currentList, setOpen){

        if(wpComponent.componentType === ComponentType.FEATURE){

            // Open or close the whole feature
            if(setOpen) {

                let featureComponents = [];

                switch(wpType){
                    case WorkPackageType.WP_BASE:

                        featureComponents = DesignVersionComponents.find(
                            {
                                designVersionId: wpComponent.designVersionId,
                                componentFeatureReferenceIdNew: wpComponent.componentReferenceId,
                                componentType: {$ne:(ComponentType.SCENARIO)}
                            }
                        ).fetch();
                        break;

                    case WorkPackageType.WP_UPDATE:

                        featureComponents = DesignUpdateComponents.find(
                            {
                                designVersionId: wpComponent.designVersionId,
                                designUpdateId: wpComponent.designUpdateId,
                                componentFeatureReferenceIdNew: wpComponent.componentReferenceId,
                                componentType: {$ne:(ComponentType.SCENARIO)}
                            }
                        ).fetch();
                        break;
                }

                featureComponents.forEach((component) => {

                    store.dispatch(setCurrentUserOpenWorkPackageItems(
                        currentList,
                        component._id,
                        true
                    ));

                });

                store.dispatch((updateOpenItemsFlag(wpComponent._id)));

            } else {

                this.closeChildren(wpComponent, currentList);
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
                this.closeChildren(wpComponent, currentList);
                store.dispatch((updateOpenItemsFlag(wpComponent._id)));
            }
        }

        return store.getState().currentUserOpenWorkPackageItems;
    };

    // Recursive function to close all children down to the bottom of the tree
    closeChildren(wpComponent, currentList){

        store.dispatch(setCurrentUserOpenWorkPackageItems(
            currentList,
            wpComponent._id,
            false
        ));

        let childComponents = DesignUpdateComponents.find(
            {
                workPackageId: wpComponent.workPackageId,
                componentParentReferenceIdNew: wpComponent.componentReferenceId
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

}

export default new ClientWorkPackageComponentServices();

