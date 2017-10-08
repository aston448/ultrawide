
import { UserDesignUpdateSummary }          from '../../collections/summary/user_design_update_summary.js';

class UserDesignUpdateSummaryData{

    // INSERT ==========================================================================================================

    insertNewSummary(userId, item, summaryCategory, headerSummaryType, parentItem, featureName, itemHeaderName){

        return UserDesignUpdateSummary.insert({
            userId:                     userId,
            designVersionId:            item.designVersionId,
            designUpdateId:             item.designUpdateId,
            summaryCategory:            summaryCategory,
            summaryType:                headerSummaryType,
            itemType:                   parentItem.componentType,
            itemComponentReferenceId:   parentItem.componentReferenceId,
            itemName:                   parentItem.componentNameNew,
            itemFeatureName:            featureName,
            itemIndex:                  parentItem.componentIndexNew,
            headerComponentId:          parentItem._id,
            itemHeaderName:             itemHeaderName
        });
    }

    bulkInsertData(batchData){

        UserDesignUpdateSummary.batchInsert(batchData);
    }

    // SELECT ==========================================================================================================

    getUserUpdateSummary(userId, designUpdateId){

        return UserDesignUpdateSummary.find({
            userId:         userId,
            designUpdateId: designUpdateId
        }).fetch();
    }

    getHeaderItem(userId, designUpdateId, headerSummaryType, parentId){

        return UserDesignUpdateSummary.findOne({
            userId:             userId,
            designUpdateId:     designUpdateId,
            summaryType:        headerSummaryType,
            headerComponentId:  parentId
        });
    }

    getHeadersOfCategoryType(userId, designUpdateId, category, type){

        return UserDesignUpdateSummary.find({
            userId:             userId,
            designUpdateId:     designUpdateId,
            summaryCategory:    category,
            summaryType:        type
        }, {sort: {itemType: 1, itemHeaderName: 1, itemIndex: 1}}).fetch();
    }

    getHeadersOfType(userId, designUpdateId, type){

        return UserDesignUpdateSummary.find({
            userId:             userId,
            designUpdateId:     designUpdateId,
            summaryType:        type
        }, {sort: {itemType: 1, itemHeaderName: 1, itemIndex: 1}}).fetch();
    }

    getHeaderActions(headerId){

        return UserDesignUpdateSummary.find({
            itemHeaderId:       headerId
        }, {sort: {itemIndex: 1}}).fetch();
    }

    // UPDATE ==========================================================================================================

    // REMOVE ==========================================================================================================

    clearUserUpdateSummary(userId, designUpdateId){

        return UserDesignUpdateSummary.remove({
            userId:         userId,
            designUpdateId: designUpdateId
        });
    }
}

export default new UserDesignUpdateSummaryData();