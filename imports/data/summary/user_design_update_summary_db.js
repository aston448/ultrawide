
import { UserDesignUpdateSummary }          from '../../collections/summary/user_design_update_summary.js';

class UserDesignUpdateSummary{

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
            headerComponentId:          item.componentParentIdNew,
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

    // UPDATE ==========================================================================================================

    // REMOVE ==========================================================================================================

    clearUserUpdateSummary(userId, designUpdateId){

        return UserDesignUpdateSummary.remove({
            userId:         userId,
            designUpdateId: designUpdateId
        });
    }
}

export default new UserDesignUpdateSummary();