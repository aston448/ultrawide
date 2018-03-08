
// Ultrawide Services
import { ComponentType, DesignUpdateSummaryCategory, DesignUpdateSummaryType, UpdateScopeType, MashTestStatus, LogLevel } from '../../constants/constants.js';
import { log } from '../../common/utils.js';

// Data Access
import DesignData                   from '../../data/design/design_db.js';
import DesignUpdateData             from '../../data/design_update/design_update_db.js';
import DesignUpdateComponentData    from '../../data/design_update/design_update_component_db.js';
import UserDvMashScenarioData       from '../../data/mash/user_dv_mash_scenario_db.js'
import UserUpdateSummaryData        from '../../data/summary/user_design_update_summary_db.js';

//======================================================================================================================
//
// Server Code for Design Update Summary Items.
//
// Methods called directly by Server API
//
//======================================================================================================================

class DesignUpdateSummaryServices {

    recreateDesignUpdateSummaryData(userContext, forceUpdate){

        if (Meteor.isServer) {

            log((message) => console.log(message), LogLevel.DEBUG, 'In recreate design update summary for update id {} and force update = {}', userContext.designUpdateId, forceUpdate);

            const designUpdate = DesignUpdateData.getDesignUpdateById(userContext.designUpdateId);

            // If a DU has just been deleted there is nothing to refresh
            if(!designUpdate){
                log((message) => console.log(message), LogLevel.DEBUG, 'No design update found');
                return;
            }

            log((message) => console.log(message), LogLevel.DEBUG, 'Data stale is {}', designUpdate.summaryDataStale);

            const summaryData = UserUpdateSummaryData.getUserUpdateSummary(userContext.userId, userContext.designUpdateId);

            log((message) => console.log(message), LogLevel.DEBUG, 'Data length is {}', summaryData.length);

            // No action unless data is definitely changed, stale or no data
            if(forceUpdate || designUpdate.summaryDataStale || summaryData.length === 0){

                // Clear the data for this user update
                UserUpdateSummaryData.clearUserUpdateSummary(userContext.userId, userContext.designUpdateId);

                // Get all significant items in the update.  Anything added, removed or changed must be in scope.
                const updateItems = DesignUpdateData.getInScopeComponents(userContext.designUpdateId);

                let batchData = [];

                // Process new items
                updateItems.forEach((item) => {

                    let summaryCategory = '';
                    let parentItem = null;
                    let featureItem = null;
                    let headerId = 'NONE';
                    let testStatus = MashTestStatus.MASH_NOT_LINKED;
                    let ignoreItem = false;

                    log((message) => console.log(message), LogLevel.DEBUG, 'Processing update item {}', item.componentNameNew);

                    let featureName = 'NONE';

                    // Determine the category for the change
                    switch(item.componentType){
                        case ComponentType.APPLICATION:
                        case ComponentType.DESIGN_SECTION:
                        case ComponentType.FEATURE_ASPECT:
                            summaryCategory = DesignUpdateSummaryCategory.SUMMARY_UPDATE_ORGANISATIONAL;
                            break;
                        case ComponentType.FEATURE:
                        case ComponentType.SCENARIO:
                            summaryCategory = DesignUpdateSummaryCategory.SUMMARY_UPDATE_FUNCTIONAL;
                    }

                    // Get its parent
                    parentItem = DesignUpdateComponentData.getUpdateComponentByRef(
                        userContext.designVersionId,
                        item.designUpdateId,
                        item.componentParentReferenceIdNew
                    );

                    log((message) => console.log(message), LogLevel.DEBUG, 'Parent item is {}', item.componentNameNew);

                    // If no parent must be a new Application so create a dummy project item as a placeholder
                    if(!parentItem){

                        if(item.componentType !== ComponentType.APPLICATION){
                            // Anything that is not an Application and has no parent is not fully formed yet so skip this update
                            // Its likely that two updates have both triggered a refresh of the data
                            ignoreItem = true;
                        } else {
                            const design = DesignData.getDesignById(item.designId);

                            //console.log("Item " + item.componentType + " - " + item.componentNameNew + "has no parent. Design is " + design);
                            parentItem = {
                                componentType: ComponentType.DESIGN,
                                componentNameNew: design.designName,
                                componentIndexNew: 0,
                                componentReferenceId: item.componentReferenceId
                            }
                        }
                    } else {
                        log((message) => console.log(message), LogLevel.DEBUG, 'Parent item is {}', parentItem.componentNameNew);
                    }

                    if(!ignoreItem) {

                        featureItem = DesignUpdateComponentData.getUpdateComponentByRef(
                            userContext.designVersionId,
                            userContext.designUpdateId,
                            item.componentFeatureReferenceIdNew
                        );

                        if (featureItem) {
                            featureName = featureItem.componentNameNew;
                        }

                        let headerSummaryType = '';
                        let summaryType = '';
                        let recordChange = false;

                        // Determine the summary action --------------------------------------------------------------------

                        if (item.isNew && !item.isDefault) {

                            // An added item...
                            headerSummaryType = DesignUpdateSummaryType.SUMMARY_ADD_TO;
                            summaryType = DesignUpdateSummaryType.SUMMARY_ADD;
                            recordChange = true;

                        } else {

                            // Not new...
                            if (item.isRemoved) {

                                // A removed item...
                                headerSummaryType = DesignUpdateSummaryType.SUMMARY_REMOVE_FROM;
                                summaryType = DesignUpdateSummaryType.SUMMARY_REMOVE;
                                recordChange = true;

                            } else {

                                if (item.isChanged || item.isTextChanged || item.isNarrativeChanged) {

                                    // A modified item
                                    headerSummaryType = DesignUpdateSummaryType.SUMMARY_CHANGE_IN;

                                    if(!item.isChanged && (item.isTextChanged || item.isNarrativeChanged)){
                                        summaryType = DesignUpdateSummaryType.SUMMARY_DETAILS_CHANGE;
                                    } else {
                                        // Legacy code hack - older features were marked as changed if just the narrative had changed
                                        if(featureItem){
                                            if(featureItem.componentNameNew === featureItem.componentNameOld){
                                                summaryType = DesignUpdateSummaryType.SUMMARY_DETAILS_CHANGE;
                                            } else {
                                                summaryType = DesignUpdateSummaryType.SUMMARY_CHANGE;
                                            }
                                        } else {
                                            summaryType = DesignUpdateSummaryType.SUMMARY_CHANGE;
                                        }

                                    }

                                    recordChange = true;

                                } else {

                                    if (item.isMoved) {

                                        // A moved item
                                        headerSummaryType = DesignUpdateSummaryType.SUMMARY_MOVE_FROM;
                                        summaryType = DesignUpdateSummaryType.SUMMARY_MOVE;
                                        recordChange = true;

                                    } else {

                                        // An in scope item that is none of the above - is a query only
                                        // IF it is a Scenario.  Otherwise ignore it as a scoped item to add other stuff to
                                        if (item.componentType === ComponentType.SCENARIO) {
                                            headerSummaryType = DesignUpdateSummaryType.SUMMARY_QUERY_IN;
                                            summaryType = DesignUpdateSummaryType.SUMMARY_QUERY;
                                            recordChange = true;
                                        }
                                    }
                                }
                            }
                        }

                        // If the item is a Scenario - get its test status
                        if (item.componentType === ComponentType.SCENARIO) {

                            const mashScenario = UserDvMashScenarioData.getScenario(userContext, item.componentReferenceId);

                            if (mashScenario) {

                                // Any fails its bad
                                if (
                                    mashScenario.accMashTestStatus === MashTestStatus.MASH_FAIL ||
                                    mashScenario.intMashTestStatus === MashTestStatus.MASH_FAIL ||
                                    mashScenario.unitFailCount > 0
                                ) {
                                    testStatus = MashTestStatus.MASH_FAIL;
                                } else {
                                    // No fails so any passes is good
                                    if (
                                        mashScenario.accMashTestStatus === MashTestStatus.MASH_PASS ||
                                        mashScenario.intMashTestStatus === MashTestStatus.MASH_PASS ||
                                        mashScenario.unitPassCount > 0
                                    ) {
                                        testStatus = MashTestStatus.MASH_PASS;
                                    }
                                }
                            } else {
                                testStatus = MashTestStatus.MASH_NOT_LINKED;
                            }
                        }

                        // Populate ----------------------------------------------------------------------------------------

                        // If we want to add this item
                        if (recordChange ) {

                            // Add the action header item if not already existing
                            let actionHeader = null;

                            if(parentItem) {

                                actionHeader = UserUpdateSummaryData.getHeaderItem(
                                    userContext.userId,
                                    item.designUpdateId,
                                    headerSummaryType,
                                    parentItem._id
                                );
                            }

                            if (!actionHeader) {

                                // Get the name that will be prominent in the header so we can sort by it
                                let itemHeaderName = parentItem.componentNameNew;

                                if (parentItem.componentType === ComponentType.FEATURE_ASPECT) {
                                    itemHeaderName = featureName;
                                }

                                headerId = UserUpdateSummaryData.insertNewSummary(
                                    userContext.userId,
                                    item,
                                    summaryCategory,
                                    headerSummaryType,
                                    parentItem,
                                    featureName,
                                    itemHeaderName
                                );

                            } else {

                                headerId = actionHeader._id;
                            }

                            let scenarioTestStatus = 'NONE';

                            if (item.componentType === ComponentType.SCENARIO) {
                                scenarioTestStatus = testStatus;
                            }

                            log((message) => console.log(message), LogLevel.DEBUG, 'Adding {} item {} with test status {}', summaryType, item.componentNameNew, scenarioTestStatus);

                            // Add the item
                            batchData.push({
                                userId:                     userContext.userId,
                                designVersionId:            item.designVersionId,
                                designUpdateId:             item.designUpdateId,
                                summaryCategory:            summaryCategory,
                                summaryType:                summaryType,
                                itemType:                   item.componentType,
                                itemComponentReferenceId:   item.componentReferenceId,
                                itemName:                   item.componentNameNew,
                                itemNameOld:                item.componentNameOld,
                                itemParentType:             parentItem.componentType,
                                itemParentName:             parentItem.componentNameNew,
                                itemFeatureName:            featureName,
                                itemHeaderId:               headerId,
                                itemIndex:                  item.componentIndexNew,
                                scenarioTestStatus:         scenarioTestStatus
                            });
                        }
                    }
                });

                // Bulk insert the body data for efficiency
                if(batchData.length > 0) {
                    UserUpdateSummaryData.bulkInsertData(batchData);
                }

                // No longer stale
                DesignUpdateData.setSummaryDataStale(userContext.designUpdateId, false);
            }
        }
    }
}

export default new DesignUpdateSummaryServices();

