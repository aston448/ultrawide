
// Ultrawide Collections
import { Designs }                  from '../../collections/design/designs.js';
import { DesignUpdates }            from '../../collections/design_update/design_updates.js';
import { DesignUpdateSummary }      from '../../collections/design_update/design_update_summary.js';
import { DesignVersionComponents }  from '../../collections/design/design_version_components.js';
import { DesignUpdateComponents }   from '../../collections/design_update/design_update_components.js';
import { UserDevTestSummaryData }   from '../../collections/dev/user_dev_test_summary_data.js';

// Ultrawide Services
import { ComponentType, DesignUpdateSummaryCategory, DesignUpdateSummaryType, DesignUpdateSummaryItem, UpdateScopeType, MashTestStatus, LogLevel } from '../../constants/constants.js';
import { log } from '../../common/utils.js';
import { DefaultItemNames }         from '../../constants/default_names.js';

import DesignUpdateModules          from '../../service_modules/design_update/design_update_service_modules.js';

//======================================================================================================================
//
// Server Code for Design Update Summary Items.
//
// Methods called directly by Server API
//
//======================================================================================================================

class DesignUpdateSummaryServices {

    // Add a new design update
    addNewDesignUpdateSummary(designVersionId, designUpdateId) {

        if (Meteor.isServer) {



        }
    };

    importDesignUpdateSummary(designVersionId, designUpdateId, designUpdateSummary) {

        if (Meteor.isServer) {

            let designUpdateSummaryId = DesignUpdateSummary.insert(
                {
                    designVersionId:            designVersionId,
                    designUpdateId:             designUpdateId,
                    summaryCategory:            designUpdateSummary.summaryCategory,
                    summaryType:                designUpdateSummary.summaryType,
                    itemType:                   designUpdateSummary.itemType,
                    itemComponentReferenceId:   designUpdateSummary.itemComponentReferenceId,
                    itemName:                   designUpdateSummary.itemName,
                    itemNameOld:                designUpdateSummary.itemNameOld,
                    itemFeatureName:            designUpdateSummary.itemFeatureName,
                    itemHeaderId:               designUpdateSummary.itemHeaderId,
                    headerComponentId:          designUpdateSummary.headerComponentId,
                    itemIndex:                  designUpdateSummary.itemIndex,
                    itemHeaderName:             designUpdateSummary.itemHeaderName,
                    scenarioTestStatus:         designUpdateSummary.scenarioTestStatus
                }
            );

            return designUpdateSummaryId;
        }
    };

    recreateDesignUpdateSummaryData(userContext){

        if (Meteor.isServer) {

            log((message) => console.log(message), LogLevel.DEBUG, 'In recreate design update summary for update id {}', userContext.designUpdateId);

            const designUpdate = DesignUpdates.findOne({_id: userContext.designUpdateId});

            // If a DU has just been deleted there is nothing to refresh
            if(!designUpdate){
                log((message) => console.log(message), LogLevel.DEBUG, 'No design update found');
                return;
            }

            log((message) => console.log(message), LogLevel.DEBUG, 'Data stale is {}', designUpdate.summaryDataStale);

            //const designVersionId = designUpdate.designVersionId;

            // No action unless data is stale
            if(designUpdate.summaryDataStale){

                // Clear the data for this update
                DesignUpdateSummary.remove({designUpdateId: userContext.designUpdateId});

                // Get all significant items in the update.  Anything added, removed or changed must be in scope.
                const updateItems = DesignUpdateComponents.find({
                    designUpdateId: userContext.designUpdateId,
                    scopeType: UpdateScopeType.SCOPE_IN_SCOPE
                });

                // Process new items
                updateItems.forEach((item) => {

                    let summaryCategory = '';
                    let parentItem = null;
                    let featureItem = null;
                    let headerId = 'NONE';
                    let testStatus = MashTestStatus.MASH_NOT_LINKED;

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

                    // Get its parent - look in the DV as may not be in the DU
                    parentItem = DesignVersionComponents.findOne({
                        designVersionId: item.designVersionId,
                        componentReferenceId: item.componentParentReferenceIdNew
                    });

                    log((message) => console.log(message), LogLevel.DEBUG, 'Parent item is {}', item.componentNameNew);

                    // If no parent must be a new Application so create a dummy project item as a placeholder
                    if(!parentItem){

                        const design = Designs.findOne({_id: item.designId});

                        console.log("Item " + item.componentType + " - " + item.componentNameNew + "has no parent. Design is " + design);
                        parentItem = {
                            componentType: ComponentType.DESIGN,
                            componentNameNew: design.designName,
                            componentIndexNew: 0,
                            componentReferenceId: item.componentReferenceId
                        }
                    } else {
                        log((message) => console.log(message), LogLevel.DEBUG, 'Parent item is {}', parentItem.componentNameNew);
                    }

                    featureItem = DesignUpdateComponents.findOne({
                        designUpdateId: userContext.designUpdateId,
                        componentReferenceId: item.componentFeatureReferenceIdNew
                    });

                    if(featureItem){
                        featureName = featureItem.componentNameNew;
                    }

                    let headerSummaryType = '';
                    let summaryType = '';
                    let recordChange = false;

                    // Determine the summary action --------------------------------------------------------------------

                    if(item.isNew){

                        // An added item...
                        headerSummaryType = DesignUpdateSummaryType.SUMMARY_ADD_TO;
                        summaryType = DesignUpdateSummaryType.SUMMARY_ADD;
                        recordChange = true;

                    } else {

                        // Not new...
                        if(item.isRemoved){

                            // A removed item...
                            headerSummaryType = DesignUpdateSummaryType.SUMMARY_REMOVE_FROM;
                            summaryType = DesignUpdateSummaryType.SUMMARY_REMOVE;
                            recordChange = true;

                        } else {

                            if(item.isChanged || item.isTextChanged){

                                // A modified item
                                headerSummaryType = DesignUpdateSummaryType.SUMMARY_CHANGE_IN;
                                summaryType = DesignUpdateSummaryType.SUMMARY_CHANGE;
                                recordChange = true;

                            } else {

                                if(item.isMoved){

                                    // A moved item
                                    headerSummaryType = DesignUpdateSummaryType.SUMMARY_MOVE_FROM;
                                    summaryType = DesignUpdateSummaryType.SUMMARY_MOVE;
                                    recordChange = true;

                                } else {

                                    // An in scope item that is none of the above - is a query only
                                    // IF it is a Scenario.  Otherwise ignore it as a scoped item to add other stuff to
                                    if (item.componentType === ComponentType.SCENARIO){
                                        headerSummaryType = DesignUpdateSummaryType.SUMMARY_QUERY_IN;
                                        summaryType = DesignUpdateSummaryType.SUMMARY_QUERY;
                                        recordChange = true;
                                    }
                                }
                            }
                        }
                    }

                    // If the item is a Scenario - get its test status
                    if(item.componentType === ComponentType.SCENARIO){

                        const testSummary = UserDevTestSummaryData.findOne({
                            designVersionId: item.designVersionId,
                            scenarioReferenceId: item.componentReferenceId
                        });

                        if(testSummary){

                            // Any fails its bad
                            if (
                                testSummary.accTestStatus === MashTestStatus.MASH_FAIL ||
                                testSummary.intTestStatus === MashTestStatus.MASH_FAIL ||
                                testSummary.unitTestFailCount > 0
                            ){
                                testStatus = MashTestStatus.MASH_FAIL;
                            } else {
                                // No fails so any passes is good
                                if (
                                    testSummary.accTestStatus === MashTestStatus.MASH_PASS ||
                                    testSummary.intTestStatus === MashTestStatus.MASH_PASS ||
                                    testSummary.unitTestPassCount > 0
                                ){
                                    testStatus = MashTestStatus.MASH_PASS;
                                }
                            }
                        } else {
                            testStatus = MashTestStatus.MASH_NOT_LINKED;
                        }
                    }

                    // Populate ----------------------------------------------------------------------------------------

                    // If we want to add this item
                    if(recordChange) {

                        // Add the action header item if not already existing
                        const actionHeader = DesignUpdateSummary.findOne({
                            designUpdateId: item.designUpdateId,
                            summaryType: headerSummaryType,
                            headerComponentId: item.componentParentIdNew
                        });


                        if (!actionHeader) {

                            // Get the name that will be prominent in the header so we can sort by it
                            let itemHeaderName = parentItem.componentNameNew;

                            if(parentItem.componentType === ComponentType.FEATURE_ASPECT){
                                itemHeaderName = featureName;
                            }
                            headerId = DesignUpdateSummary.insert({
                                designVersionId: item.designVersionId,
                                designUpdateId: item.designUpdateId,
                                summaryCategory: summaryCategory,
                                summaryType: headerSummaryType,
                                itemType: parentItem.componentType,
                                itemComponentReferenceId: parentItem.componentReferenceId,
                                itemName: parentItem.componentNameNew,
                                itemFeatureName: featureName,
                                itemIndex: parentItem.componentIndexNew,
                                headerComponentId: item.componentParentIdNew,
                                itemHeaderName: itemHeaderName
                            });
                        } else {
                            headerId = actionHeader._id;
                        }

                        let scenarioTestStatus = 'NONE';

                        if(item.componentType === ComponentType.SCENARIO){
                            scenarioTestStatus = testStatus;
                        }

                        log((message) => console.log(message), LogLevel.DEBUG, 'Adding ' + summaryType + ' item with test status ' + scenarioTestStatus);

                        // Add the item
                        DesignUpdateSummary.insert({
                            designVersionId: item.designVersionId,
                            designUpdateId: item.designUpdateId,
                            summaryCategory: summaryCategory,
                            summaryType: summaryType,
                            itemType: item.componentType,
                            itemComponentReferenceId: item.componentReferenceId,
                            itemName: item.componentNameNew,
                            itemNameOld: item.componentNameOld,
                            itemParentType: parentItem.componentType,
                            itemParentName: parentItem.componentNameNew,
                            itemFeatureName: featureName,
                            itemHeaderId: headerId,
                            itemIndex: item.componentIndexNew,
                            scenarioTestStatus: scenarioTestStatus
                        });
                    }
                });

                // No longer stale
                DesignUpdates.update({_id: userContext.designUpdateId}, {$set: {summaryDataStale: false}});
            }
        }
    }
}

export default new DesignUpdateSummaryServices();

