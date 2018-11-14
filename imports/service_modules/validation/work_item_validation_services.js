
// Ultrawide Services
import { RoleType } from '../../constants/constants.js';
import { Validation, WorkItemValidationErrors } from '../../constants/validation_errors.js';

//======================================================================================================================
//
// Validation Services for Iterations.
//
// All services should make no data-access calls so as to be module testable
//
//======================================================================================================================

class WorkItemValidationServicesClass{

    validateAddNewIncrement(userRole){

        // Only a Manager can add Iterations
        if(userRole !== RoleType.MANAGER){

            return WorkItemValidationErrors.INCREMENT_INVALID_ROLE_ADD;
        }

        return Validation.VALID;
    };

    validateAddNewIteration(userRole){

        // Only a Manager can add Iterations
        if(userRole !== RoleType.MANAGER){

           return WorkItemValidationErrors.ITERATION_INVALID_ROLE_ADD;
        }

        return Validation.VALID;
    };

    validateRemoveWorkItem(userRole, itemChildCount){

        // Only a Manager can add Iterations
        if(userRole !== RoleType.MANAGER){

            return WorkItemValidationErrors.WORK_ITEM_INVALID_ROLE_REMOVE;
        }

        // Can't remove an iteration if it has children
        if(itemChildCount > 0){

            return WorkItemValidationErrors.WORK_ITEM_INVALID_REMOVE_CHILD;
        }

        return Validation.VALID;
    }

    validateSaveWorkItemDetails(userRole, otherWorkItems, newName){

        // Only a Manager can save Work Items
        if(userRole !== RoleType.MANAGER){

            return WorkItemValidationErrors.WORK_ITEM_INVALID_ROLE_UPDATE;
        }

        // Must have an unique name for the type
        otherWorkItems.forEach((item) => {
            if(item.wiName === newName){
                return WorkItemValidationErrors.WORK_ITEM_DUPLICATE_NAME;
            }
        });

        return Validation.VALID;
    }

    validateReorderWorkItem(userRole){

        // Key validation is done by Read D&D - see UTILS

        // Only a Manager can reorder items
        if(userRole !== RoleType.MANAGER){
            return WorkItemValidationErrors.WORK_ITEM_INVALID_ROLE_REORDER;
        }

        return Validation.VALID;
    }

    validateMoveWorkItem(userRole){

        // Key validation is done by Read D&D - see UTILS

        // Only a Manager can move items
        if(userRole !== RoleType.MANAGER){
            return WorkItemValidationErrors.WORK_ITEM_INVALID_ROLE_MOVE;
        }

        return Validation.VALID;
    }

}

export const WorkItemValidationServices = new WorkItemValidationServicesClass();
