

import {
    addNewIncrement,
    addNewIteration,
    removeWorkItem,
    saveWorkItemDetails,
    reorderWorkItem,
    moveWorkItem

} from '../apiValidatedMethods/work_item_methods.js'


class ServerWorkItemApiClass {

    addNewIncrement(designVersionId, userRole, callback){

        addNewIncrement.call(
            {
                designVersionId:        designVersionId,
                userRole:               userRole
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    addNewIteration(designVersionId, parentRefId, userRole, callback){

        addNewIteration.call(
            {
                designVersionId:        designVersionId,
                parentRefId:            parentRefId,
                userRole:               userRole
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    removeWorkItem(workItemId, userRole, callback){

        removeWorkItem.call(
            {
                workItemId:             workItemId,
                userRole:               userRole
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    saveWorkItemDetails(workItem, newName, newLink, userRole, callback){

        saveWorkItemDetails.call(
            {
                workItem:               workItem,
                newName:                newName,
                newLink:                newLink,
                userRole:               userRole
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    reorderWorkItem(movingWorkItem, targetWorkItem, userRole, callback){

        reorderWorkItem.call(
            {
                movingWorkItem:         movingWorkItem,
                targetWorkItem:         targetWorkItem,
                userRole:               userRole
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    moveWorkItem(movingWorkItem, targetParentItem, userRole, callback){

        moveWorkItem.call(
            {
                movingWorkItem:         movingWorkItem,
                targetParentItem:       targetParentItem,
                userRole:               userRole
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

}

export const ServerWorkItemApi = new ServerWorkItemApiClass();