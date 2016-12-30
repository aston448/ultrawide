// == IMPORTS ==========================================================================================================

// Ultrawide Collections
import {DesignComponents}       from '../collections/design/design_components.js';
import {DesignUpdateComponents} from '../collections/design_update/design_update_components.js'
import {WorkPackageComponents}  from '../collections/work/work_package_components.js'

// Ultrawide Services
import { WorkPackageType, ComponentType, MessageType } from '../constants/constants.js';
import { Validation } from '../constants/validation_errors.js';
import { WorkPackageComponentMessages } from '../constants/message_texts.js';

import WorkPackageComponentValidationApi from '../apiValidation/apiWorkPackageComponentValidation.js';
import ServerWorkPackageComponentApi     from '../apiServer/apiWorkPackageComponent.js';

// REDUX services
import store from '../redux/store'
import {setCurrentUserOpenWorkPackageItems, updateUserMessage} from '../redux/actions';

// =====================================================================================================================
// Client API for Work Package Components
//
// Calls validation for client and then, if required, server API to update server data
// =====================================================================================================================

class ClientWorkPackageComponentServices {

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // User put an item in the scope view in or out of scope for a Work Package
    toggleInScope(view, displayContext, wpComponentId, newScope){

        // Client validation
        let result = WorkPackageComponentValidationApi.validateToggleInScope(view, displayContext, wpComponentId);

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call - server actions
        ServerWorkPackageComponentApi.toggleInScope(view, displayContext, wpComponentId, newScope, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

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
        return true;
    };


    // LOCAL CLIENT ACTIONS ============================================================================================

    // Gets the full details of a Design or Design Update item that relates to a Work Package item
    getDesignItem(componentId, wpType){

        switch(wpType){
            case WorkPackageType.WP_BASE:
                return DesignComponents.findOne({_id: componentId});
            case WorkPackageType.WP_UPDATE:
                return DesignUpdateComponents.findOne({_id: componentId});
            default:
                // Does not apply for non WP views as the current item IS the Design item.
                return null;
        }
    }

    // User opened or closed a WP component
    setOpenClosed(wpComponent, currentList, newState){

        if(wpComponent.componentType === ComponentType.FEATURE){
            // Open or close the whole feature
            const featureComponents = WorkPackageComponents.find(
                {
                    workPackageId: wpComponent.workPackageId,
                    componentFeatureReferenceId: wpComponent.componentReferenceId
                }
            );

            featureComponents.forEach((component) => {

                if(!currentList.includes(component._id && newState))
                {
                    currentList.push(component._id);

                } else {

                    if(currentList.includes(component._id && !newState)){
                        currentList.pop(component._id)
                    }
                }
            });

            store.dispatch(setCurrentUserOpenWorkPackageItems(
                Meteor.userId(),
                currentList,
                null, null, true
            ));

        } else {

            if(newState) {
                // Just open or close the item
                store.dispatch(setCurrentUserOpenWorkPackageItems(
                    Meteor.userId(),
                    currentList,
                    wpComponent._id,
                    newState
                ));
            } else {
                // Close all items below
                this.closeChildren(wpComponent, currentList);
            }
        }

        return true;
    };

    // Recursive function to close all children down to the bottom of the tree
    closeChildren(wpComponent, currentList){

        let childComponents = DesignUpdateComponents.find(
            {
                workPackageId: wpComponent.workPackageId,
                componentParentReferenceId: wpComponent.componentReferenceId
            }
        );

        if(childComponents.count() > 0){
            childComponents.forEach((child) => {

                store.dispatch(setCurrentUserOpenWorkPackageItems(
                    Meteor.userId(),
                    currentList,
                    wpComponent._id,
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

export default new ClientWorkPackageComponentServices();

