import { DesignVersionComponents }          from '../../collections/design/design_version_components.js';

import { DefaultComponentNames }            from '../../constants/default_names.js';
import { UpdateMergeStatus, ComponentType }                from '../../constants/constants.js';

class DesignComponentData {

    // INSERT ==========================================================================================================

    insertNewComponent(designId, designVersionId, componentType, componentLevel, parentRefId, featureRefId, defaultName, defaultRawName, defaultRawText, isNew, workPackageId, isDevAdded){

        return DesignVersionComponents.insert(
            {
                componentReferenceId:               'TEMP',             // Will update this after component created
                designId:                           designId,
                designVersionId:                    designVersionId,
                componentType:                      componentType,
                componentLevel:                     componentLevel,

                componentParentReferenceIdOld:      parentRefId,
                componentParentReferenceIdNew:      parentRefId,
                componentFeatureReferenceIdOld:     featureRefId,
                componentFeatureReferenceIdNew:     featureRefId,

                componentNameOld:                   defaultName,
                componentNameNew:                   defaultName,
                componentNameRawOld:                defaultRawName,
                componentNameRawNew:                defaultRawName,
                componentTextRawOld:                defaultRawText,
                componentTextRawNew:                defaultRawText,

                isNew:                              isNew,
                workPackageId:                      workPackageId,  // For Scenarios only if added from a WP
                isDevAdded:                         isDevAdded
            },

        );
    }

    addUpdateComponentToDesignVersion(updateItem){

        return DesignVersionComponents.insert(
            {
                // Identity
                componentReferenceId:           updateItem.componentReferenceId,
                designId:                       updateItem.designId,
                designVersionId:                updateItem.designVersionId,
                componentType:                  updateItem.componentType,
                componentLevel:                 updateItem.componentLevel,

                componentParentReferenceIdOld:  updateItem.componentParentReferenceIdNew,
                componentParentReferenceIdNew:  updateItem.componentParentReferenceIdNew,
                componentFeatureReferenceIdOld: updateItem.componentFeatureReferenceIdNew,
                componentFeatureReferenceIdNew: updateItem.componentFeatureReferenceIdNew,
                componentIndexOld:              updateItem.componentIndexNew,
                componentIndexNew:              updateItem.componentIndexNew,

                // Data
                componentNameOld:               updateItem.componentNameNew,
                componentNameNew:               updateItem.componentNameNew,
                componentNameRawOld:            updateItem.componentNameRawNew,
                componentNameRawNew:            updateItem.componentNameRawNew,
                componentNarrativeOld:          updateItem.componentNarrativeNew,
                componentNarrativeNew:          updateItem.componentNarrativeNew,
                componentNarrativeRawOld:       updateItem.componentNarrativeRawNew,
                componentNarrativeRawNew:       updateItem.componentNarrativeRawNew,
                componentTextRawOld:            updateItem.componentTextRawNew,
                componentTextRawNew:            updateItem.componentTextRawNew,

                // Update State
                isNew:                          false,                              // Not new in terms of editing
                workPackageId:                  'NONE',
                updateMergeStatus:              UpdateMergeStatus.COMPONENT_ADDED,  // But is new in terms of the design version
                isDevUpdated:                   false,
                isDevAdded:                     false,

                isRemovable:                    updateItem.isRemovable,
            }
        );
    }

    // Called when restoring data after a reset
    importComponent(designId, designVersionId, workPackageId, component){

        if(Meteor.isServer) {

            return DesignVersionComponents.insert(
                {
                    // Identity
                    componentReferenceId: component.componentReferenceId,
                    designId: designId,                               // Will be a new id for the restored data
                    designVersionId: designVersionId,                        // Ditto
                    componentType: component.componentType,
                    componentLevel: component.componentLevel,

                    componentParentReferenceIdOld: component.componentParentReferenceIdOld,
                    componentParentReferenceIdNew: component.componentParentReferenceIdNew,
                    componentFeatureReferenceIdOld: component.componentFeatureReferenceIdOld,
                    componentFeatureReferenceIdNew: component.componentFeatureReferenceIdNew,
                    componentIndexOld: component.componentIndexNew,
                    componentIndexNew: component.componentIndexNew,

                    // Data
                    componentNameOld: component.componentNameOld,
                    componentNameNew: component.componentNameNew,
                    componentNameRawOld: component.componentNameRawOld,
                    componentNameRawNew: component.componentNameRawNew,
                    componentNarrativeOld: component.componentNarrativeOld,
                    componentNarrativeNew: component.componentNarrativeNew,
                    componentNarrativeRawNew: component.componentNarrativeRawNew,
                    componentTextRawOld: component.componentTextRawOld,
                    componentTextRawNew: component.componentTextRawNew,

                    // State (shared and persistent only)
                    isNew: component.isNew,
                    workPackageId: workPackageId,
                    updateMergeStatus: component.updateMergeStatus,
                    isDevUpdated: component.isDevUpdated,
                    isDevAdded: component.isDevAdded,

                    isRemovable: component.isRemovable,
                }
            );

        }
    };

    bulkInsert(batchData){
        DesignVersionComponents.batchInsert(batchData);
    }

    // SELECT ==========================================================================================================

    getDesignComponentById(designComponentId){
        return DesignVersionComponents.findOne({_id: designComponentId});
    }

    getDesignComponentByRef(designVersionId, designComponentRef){
        return DesignVersionComponents.findOne({designVersionId: designVersionId, componentReferenceId: designComponentRef});
    }

    // Get the ID of a component's parent in the correct Design Version
    getParentId(designVersionId, parentRefId){
        let parent = this.getDesignComponentByRef(designVersionId, parentRefId);

        if(parent){
            return parent._id;
        } else {
            return 'NONE';
        }
    }

    getFeatureByName(designVersionId, featureName){

        return DesignVersionComponents.findOne(
            {
                designVersionId: designVersionId,
                componentType: ComponentType.FEATURE,
                componentNameNew: featureName
            }
        );
    }

    getFeatureAspects(designVersionId, featureReferenceId){

        return DesignVersionComponents.find(
            {
                designVersionId:                designVersionId,
                componentType:                  ComponentType.FEATURE_ASPECT,
                componentFeatureReferenceIdNew: featureReferenceId
            },
            {sort: {componentIndexNew: 1}}
        ).fetch();
    }

    getNonRemovedDvScenarios(designVersionId){

        return DesignVersionComponents.find({
            designVersionId:    designVersionId,
            componentType:      ComponentType.SCENARIO,
            updateMergeStatus:  {$ne: UpdateMergeStatus.COMPONENT_REMOVED}
        }).fetch();
    }

    getPeerComponents(designVersionId, componentReferenceId, componentType, componentParentReferenceId){

        return DesignVersionComponents.find(
            {
                componentReferenceId:           {$ne: componentReferenceId},
                designVersionId:                designVersionId,
                componentType:                  componentType,
                componentParentReferenceIdNew:  componentParentReferenceId
            },
            {sort: {componentIndexNew: -1}}
        ).fetch();
    }

    getBasePeerComponents(designVersionId, componentReferenceId, componentType, componentParentReferenceId){

        return DesignVersionComponents.find(
            {
                componentReferenceId:           {$ne: componentReferenceId},
                designVersionId:                designVersionId,
                componentType:                  componentType,
                componentParentReferenceIdNew:  componentParentReferenceId,
                updateMergeStatus:              {$ne: UpdateMergeStatus.COMPONENT_ADDED}
            },
            {sort: {componentIndexNew: -1}}
        ).fetch();
    }

    getChildComponents(designVersionId, componentReferenceId) {

        return DesignVersionComponents.find(
            {
                componentParentReferenceIdNew: componentReferenceId,
                designVersionId: designVersionId
            },
            {sort: {componentIndexNew: 1}}

        ).fetch();
    }

    getChildComponentsOfType(designVersionId, componentType, componentParentReferenceId) {

        return DesignVersionComponents.find(
            {
                componentParentReferenceIdNew: componentParentReferenceId,
                designVersionId: designVersionId,
                componentType: componentType,
            },
            {sort: {componentIndexNew: 1}}
        ).fetch();
    }

    getNonRemovedChildComponentsOfType(designVersionId, childComponentType, componentParentReferenceId,){

        return DesignVersionComponents.find(
            {
                designVersionId:                designVersionId,
                componentType:                  childComponentType,
                componentParentReferenceIdNew:  componentParentReferenceId,
                updateMergeStatus:              {$ne: UpdateMergeStatus.COMPONENT_REMOVED}
            },
            {sort:{componentIndexNew: 1}}
        ).fetch();
    }

    getExistingChildComponentsOfType(designVersionId, childComponentType, parentRefId){

        return DesignVersionComponents.find(
            {
                designVersionId:                designVersionId,
                componentType:                  childComponentType,
                componentParentReferenceIdOld:  parentRefId,
                updateMergeStatus:              {$ne: UpdateMergeStatus.COMPONENT_ADDED}
            },
            {sort:{componentIndexOld: 1}}
        ).fetch();
    }


    getRegexMatchingScenarios(designVersionId, searchRegex){

        return DesignVersionComponents.find({
            designVersionId:    designVersionId,
            componentType:      ComponentType.SCENARIO,
            componentNameNew:   {$regex: searchRegex}
        }).fetch();
    }



    getChildCount(designVersionId, componentReferenceId){

        return DesignVersionComponents.find({
                componentParentReferenceIdNew: componentReferenceId,
                designVersionId: designVersionId
        }).count();
    }

    getChildFeatureCount(designVersionId, componentReferenceId){

        return DesignVersionComponents.find({
            designVersionId:                designVersionId,
            componentParentReferenceIdNew:  componentReferenceId,
            componentType:                  ComponentType.FEATURE
        }).count()
    }

    getNonScenarioFeatureComponents(designVersionId, featureRefId){

        return DesignVersionComponents.find(
            {
                designVersionId:                designVersionId,
                componentFeatureReferenceIdNew: featureRefId,
                componentType:                  {$ne:(ComponentType.SCENARIO)}
            }
        ).fetch();
    }

    getNonScenarioChildComponents(designVersionId, componentReferenceId){

        return DesignVersionComponents.find(
            {
                designVersionId:                designVersionId,
                componentParentReferenceIdNew:  componentReferenceId,
                componentType: {$ne: (ComponentType.SCENARIO)}
            }
        ).fetch();
    }


    // UPDATE ==========================================================================================================

    setComponentReference(designComponentId, componentReference){

        return DesignVersionComponents.update(
            {_id: designComponentId},
            { $set: {componentReferenceId: componentReference}}
        );
    }

    setFeatureReferences(designComponentId, defaultNarrative, defaultRawNarrative){

        return DesignVersionComponents.update(
            {_id: designComponentId},
            { $set:
                {
                    componentFeatureReferenceIdOld: designComponentId,
                    componentFeatureReferenceIdNew: designComponentId,
                    componentNarrativeOld: defaultNarrative,
                    componentNarrativeNew: defaultNarrative,
                    componentNarrativeRawOld: defaultRawNarrative,
                    componentNarrativeRawNew: defaultRawNarrative
                }
            }
        );
    }

    setRemovable(designComponentId, removable){

        DesignVersionComponents.update(
            {_id: designComponentId},
            {$set: {isRemovable: removable}}
        );
    }

    setUpdateMergeStatus(designComponentId, mergeStatus){

        return DesignVersionComponents.update(
            {_id: designComponentId},
            {
                $set:{ updateMergeStatus: mergeStatus}
            }
        );
    }

    setWorkPackageId(designComponentId, workPackageId){

        return DesignVersionComponents.update(
            {_id: designComponentId},
            {
                $set: {workPackageId: workPackageId}
            }
        );
    }

    removeWorkPackageIds(workPackageId){

        return DesignVersionComponents.update(
            {
                workPackageId: workPackageId
            },
            {
                $set: {workPackageId: 'NONE'}
            },
            {multi: true}
        );
    }

    setDvComponentWorkPackageId(designVersionId, componentReferenceId, workPackageId){

        // Sets the WP for a DV component in a specific design version - probably not the one in which the WP is
        DesignVersionComponents.update(
            {
                designVersionId: designVersionId,
                componentReferenceId: componentReferenceId
            },
            {
                $set: {workPackageId: workPackageId}
            }
        );
    }

    updateComponentName(designComponentId, componentNameOld, componentNameNew, componentNameRawOld, componentNameRawNew){

        return DesignVersionComponents.update(
            {_id: designComponentId},
            {
                $set: {
                    componentNameOld: componentNameOld,
                    componentNameNew: componentNameNew,
                    componentNameRawOld: componentNameRawOld,
                    componentNameRawNew: componentNameRawNew,
                    isNew: false
                }
            }
        );
    }

    updateFeatureNarrative(featureId, componentNarrativeOld, componentNarrativeNew, componentNarrativeRawOld, componentNarrativeRawNew){

        return DesignVersionComponents.update(
            {_id: featureId},
            {
                $set: {
                    componentNarrativeOld: componentNarrativeOld,
                    componentNarrativeNew: componentNarrativeNew,
                    componentNarrativeRawOld: componentNarrativeRawOld,
                    componentNarrativeRawNew: componentNarrativeRawNew,
                    isNew: false
                }
            }
        );
    }

    updateDetailsText(designComponentId, rawText){

        return DesignVersionComponents.update(
            {_id: designComponentId},
            {
                $set: {
                    componentTextRawNew: rawText
                }
            }
        );
    }

    updateAfterMove(designComponentId, newParentRefId, newFeatureReferenceId, newLevel){

        return DesignVersionComponents.update(
            {_id: designComponentId},
            {
                $set: {
                    componentParentReferenceIdNew: newParentRefId,
                    componentFeatureReferenceIdNew: newFeatureReferenceId,
                    componentLevel: newLevel
                }
            }
        );
    }

    moveInDesignVersionFromUpdate(designComponentId, updateItem, mergeStatus){

        return DesignVersionComponents.update(
            {_id: designComponentId},
            {
                $set:{
                    componentLevel:                 updateItem.componentLevel,
                    componentParentReferenceIdNew:  updateItem.componentParentReferenceIdNew,
                    componentFeatureReferenceIdNew: updateItem.componentFeatureReferenceIdNew,
                    componentIndexNew:              updateItem.componentIndexNew,
                    updateMergeStatus:              mergeStatus
                }
            }
        );
    }

    undoMoveInDesignVersionFromUpdate(designComponentId, updateItem, mergeStatus){
        return DesignVersionComponents.update(
            {_id: designComponentId},
            {
                $set:{
                    componentLevel:                 updateItem.componentLevel,
                    componentParentReferenceIdNew:  updateItem.componentParentReferenceIdOld,
                    componentFeatureReferenceIdNew: updateItem.componentFeatureReferenceIdOld,
                    componentIndexNew:              updateItem.componentIndexOld,
                    updateMergeStatus:              mergeStatus
                }
            }
        );
    }

    logicallyDeleteInDesignVersion(dvComponent){

        return DesignVersionComponents.update(
            {_id: dvComponent._id},
            {
                $set: {
                    updateMergeStatus: UpdateMergeStatus.COMPONENT_REMOVED,
                    componentNameNew: dvComponent.componentNameOld,
                    componentNameRawNew: dvComponent.componentNameRawOld
                }
            }
        );
    }

    updateNameFromDesignUpdate(designComponentId, updateItem, updateMergeStatus){

        return DesignVersionComponents.update(
            {_id: designComponentId},
            {
                $set:{
                    componentNameNew:               updateItem.componentNameNew,
                    componentNameRawNew:            updateItem.componentNameRawNew,
                    updateMergeStatus:              updateMergeStatus
                }
            }
        );
    }

    undoUpdateNameFromDesignUpdate(designComponentId, updateItem, updateMergeStatus){

        return DesignVersionComponents.update(
            {_id: designComponentId},
            {
                $set:{
                    componentNameNew:               updateItem.componentNameOld,
                    componentNameRawNew:            updateItem.componentNameRawOld,
                    updateMergeStatus:              updateMergeStatus
                }
            }
        );
    }

    updateDetailsFromDesignUpdate(designComponentId, updateItem, updateMergeStatus){

        return DesignVersionComponents.update(
            {_id: designComponentId},
            {
                $set:{
                    componentNarrativeNew:          updateItem.componentNarrativeNew,
                    componentNarrativeRawNew:       updateItem.componentNarrativeRawNew,
                    componentTextRawNew:            updateItem.componentTextRawNew,
                    updateMergeStatus:              updateMergeStatus
                }
            }
        );
    }

    undoUpdateDetailsFromDesignUpdate(designComponentId, updateItem, updateMergeStatus){

        return DesignVersionComponents.update(
            {_id: designComponentId},
            {
                $set:{
                    componentNarrativeNew:          updateItem.componentNarrativeOld,
                    componentNarrativeRawNew:       updateItem.componentNarrativeRawOld,
                    componentTextRawNew:            updateItem.componentTextRawOld,
                    updateMergeStatus:              updateMergeStatus
                }
            }
        );
    }

    updateIndex(componentId, oldIndex, newIndex){

        return DesignVersionComponents.update(
            {_id: componentId},
            {
                $set: {
                    componentIndexOld: oldIndex,
                    componentIndexNew: newIndex
                }
            }
        );
    }

    // REMOVE ==========================================================================================================

    removeComponent(designComponentId){

        return DesignVersionComponents.remove(
            {_id: designComponentId}
        );
    }


}

export default new DesignComponentData();