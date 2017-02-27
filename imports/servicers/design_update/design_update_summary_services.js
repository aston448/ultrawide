
// Ultrawide Collections
import { DesignUpdates }            from '../../collections/design_update/design_updates.js';
import { DesignUpdateSummaries }    from '../../collections/design_update/design_update_summaries.js';
import { DesignUpdateComponents }   from '../../collections/design_update/design_update_components.js';

// Ultrawide Services
import { ComponentType, DesignUpdateSummaryType, DesignUpdateSummaryItem } from '../../constants/constants.js';
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

            let designUpdateSummaryId = DesignUpdateSummaries.insert(
                {
                    designVersionId:            designVersionId,
                    designUpdateId:             designUpdateId,
                    summaryType:                designUpdateSummary.summaryType,
                    summaryComponentType:       designUpdateSummary.summaryComponentType,
                    itemType:                   designUpdateSummary.itemType,
                    itemName:                   designUpdateSummary.itemName,
                    itemNameOld:                designUpdateSummary.itemNameOld,
                    itemParentName:             designUpdateSummary.itemParentName,
                    itemFeatureName:            designUpdateSummary.itemFeatureName
                }
            );

            return designUpdateSummaryId;
        }
    };

    refreshDesignUpdateSummary(designUpdateId){

        if (Meteor.isServer) {

            console.log("Refreshing DU Summary for DU: " + designUpdateId);

            const designUpdate = DesignUpdates.findOne({_id: designUpdateId});
            const designVersionId = designUpdate.designVersionId;

            // No action unless data is stale
            if(designUpdate.summaryDataStale){

                DesignUpdateSummaries.remove({designUpdateId: designUpdateId});


                // Get Stuff Added or Removed---------------------------------------------------------------------------

                const newRemovedDesignComponents = DesignUpdateComponents.find({
                    designUpdateId: designUpdateId,
                    componentType: {$in:[ComponentType.FEATURE, ComponentType.SCENARIO]},
                    $or:[{isNew: true}, {isRemoved: true}]
                });

                let parentComponent = null;
                let itemFeature = null;
                let summaryType = '';
                let summaryComponentType = '';

                newRemovedDesignComponents.forEach((component) => {

                    switch (component.componentType) {
                        case ComponentType.FEATURE:
                            if (component.isNew) {
                                summaryType = DesignUpdateSummaryType.SUMMARY_ADD;
                            } else {
                                summaryType = DesignUpdateSummaryType.SUMMARY_REMOVE;
                            }
                            summaryComponentType = DesignUpdateSummaryItem.SUMMARY_FEATURE;
                            break;
                        case ComponentType.SCENARIO:
                            if (component.isNew) {
                                summaryType = DesignUpdateSummaryType.SUMMARY_ADD_TO;
                            } else {
                                summaryType = DesignUpdateSummaryType.SUMMARY_REMOVE_FROM;
                            }
                            summaryComponentType = DesignUpdateSummaryItem.SUMMARY_SCENARIO_IN_ASPECT;
                            break;

                    }

                    parentComponent = DesignUpdateComponents.findOne({_id: component.componentParentIdNew});

                    itemFeature = DesignUpdateComponents.findOne({
                        designUpdateId: designUpdateId,
                        componentReferenceId: component.componentFeatureReferenceIdNew
                    });

                    let parentName = 'NONE';
                    let featureName = 'NONE';

                    if(parentComponent){
                        parentName = parentComponent.componentNameNew;
                    }

                    if(itemFeature){
                       featureName = itemFeature.componentNameNew;
                    }

                    DesignUpdateSummaries.insert({
                        designVersionId:        designVersionId,
                        designUpdateId:         designUpdateId,
                        summaryType:            summaryType,
                        summaryComponentType:   summaryComponentType,
                        itemName:               component.componentNameNew,
                        itemNameOld:            component.componentNameNew,
                        itemType:               component.componentType,
                        itemParentName:         parentName,
                        itemFeatureName:        featureName
                    });
                });


                // Get changed stuff -------------------------------------------------------------------------------------------

                const changedDesignComponents = DesignUpdateComponents.find({
                    designUpdateId: designUpdateId,
                    componentType: {$in:[ComponentType.FEATURE, ComponentType.SCENARIO]},
                    isNew: false,
                    isRemoved: false,
                    isChanged: true});

                changedDesignComponents.forEach((component) => {

                    switch (component.componentType) {
                        case ComponentType.FEATURE:

                            summaryType = DesignUpdateSummaryType.SUMMARY_CHANGE;
                            summaryComponentType = DesignUpdateSummaryItem.SUMMARY_FEATURE;
                            break;

                        case ComponentType.SCENARIO:

                            summaryType = DesignUpdateSummaryType.SUMMARY_CHANGE_IN;
                            summaryComponentType = DesignUpdateSummaryItem.SUMMARY_SCENARIO_IN_ASPECT;
                            break;
                    }

                    parentComponent = DesignUpdateComponents.findOne({_id: component.componentParentIdNew});
                    itemFeature = DesignUpdateComponents.findOne({
                        designUpdateId: designUpdateId,
                        componentReferenceId: component.componentFeatureReferenceIdNew
                    });

                    let parentName = 'NONE';
                    let featureName = 'NONE';

                    if(parentComponent){
                        parentName = parentComponent.componentNameNew;
                    }

                    if(itemFeature){
                        featureName = itemFeature.componentNameNew;
                    }

                    DesignUpdateSummaries.insert({
                        designVersionId:        designVersionId,
                        designUpdateId:         designUpdateId,
                        summaryType:            summaryType,
                        summaryComponentType:   summaryComponentType,
                        itemName:               component.componentNameNew,
                        itemNameOld:            component.componentNameOld,
                        itemType:               component.componentType,
                        itemParentName:         parentName,
                        itemFeatureName:        featureName
                    });

                });


                // No longer stale
                DesignUpdates.update({_id: designUpdateId}, {$set: {summaryDataStale: false}});
            }

        }
    }


}

export default new DesignUpdateSummaryServices();

