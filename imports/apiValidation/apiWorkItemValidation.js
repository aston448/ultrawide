
// Ultrawide Services
import { WorkItemValidationServices }          from '../service_modules/validation/work_item_validation_services.js';

// Data Access
import { WorkItemData }                         from '../data/work/work_item_db.js'

//======================================================================================================================
//
// Validation API for Increments, Iterations and their Work Items
//
//======================================================================================================================

class WorkItemValidationApiClass{

    validateAddNewIncrement(userRole){

        return WorkItemValidationServices.validateAddNewIncrement(userRole);

    };

    validateAddNewIteration(userRole){

        return WorkItemValidationServices.validateAddNewIteration(userRole);

    };

    validateRemoveWorkItem(workItemId, userRole){

        const workItem = WorkItemData.getWorkItemById(workItemId);
        const iterationChildCount = WorkItemData.getWorkItemChildCount(workItem);

        return WorkItemValidationServices.validateRemoveWorkItem(userRole, iterationChildCount);
    };

    validateSaveWorkItemDetails(workItem, newName, userRole){

        // Get other Increment / Iteration work items to prevent duplicate names
        const otherItems = WorkItemData.getOtherWorkItemsOfType(workItem.designVersionId, workItem._id, workItem.wiType);

        return WorkItemValidationServices.validateSaveWorkItemDetails(userRole, otherItems, newName)

    };

    validateReorderWorkItem(userRole){

        return WorkItemValidationServices.validateReorderWorkItem(userRole);
    }

    validateMoveWorkItem(userRole){

        return WorkItemValidationServices.validateMoveWorkItem(userRole);
    }




}
export const WorkItemValidationApi = new WorkItemValidationApiClass();
