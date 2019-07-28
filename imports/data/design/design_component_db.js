import { DesignVersionComponents }          from '../../collections/design/design_version_components.js';

import { DefaultComponentNames }            from '../../constants/default_names.js';
import { UpdateMergeStatus, ComponentType }                from '../../constants/constants.js';
import { DesignUpdateComponentData } from "../design_update/design_update_component_db";
import {UpdateScopeType} from "../../constants/constants";

class DesignComponentDataClass {

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
                    componentReferenceId:           component.componentReferenceId,
                    designId:                       designId,                               // Will be a new id for the restored data
                    designVersionId:                designVersionId,                        // Ditto
                    componentType:                  component.componentType,
                    componentLevel:                 component.componentLevel,

                    componentParentReferenceIdOld:  component.componentParentReferenceIdOld,
                    componentParentReferenceIdNew:  component.componentParentReferenceIdNew,
                    componentFeatureReferenceIdOld: component.componentFeatureReferenceIdOld,
                    componentFeatureReferenceIdNew: component.componentFeatureReferenceIdNew,
                    componentIndexOld:              component.componentIndexNew,
                    componentIndexNew:              component.componentIndexNew,

                    appRef:                         component.appRef,
                    s1Ref:                          component.s1Ref,
                    s2Ref:                          component.s2Ref,
                    s3Ref:                          component.s3Ref,
                    s4Ref:                          component.s4Ref,
                    featureRef:                     component.featureRef,
                    aspectRef:                      component.aspectRef,

                    // Data
                    componentNameOld:               component.componentNameOld,
                    componentNameNew:               component.componentNameNew,
                    componentNameRawOld:            component.componentNameRawOld,
                    componentNameRawNew:            component.componentNameRawNew,
                    componentNarrativeOld:          component.componentNarrativeOld,
                    componentNarrativeNew:          component.componentNarrativeNew,
                    componentNarrativeRawNew:       component.componentNarrativeRawNew,
                    componentTextRawOld:            component.componentTextRawOld,
                    componentTextRawNew:            component.componentTextRawNew,

                    // State (shared and persistent only)
                    isNew:                          component.isNew,
                    workPackageId:                  workPackageId,
                    updateMergeStatus:              component.updateMergeStatus,
                    isDevUpdated:                   component.isDevUpdated,
                    isDevAdded:                     component.isDevAdded,

                    isRemovable:                    component.isRemovable
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

    getScenarioByName(designVersionId, scenarioName){

        return DesignVersionComponents.findOne(
            {
                designVersionId: designVersionId,
                componentType: ComponentType.SCENARIO,
                componentNameNew: scenarioName
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

    getFeatureComponents(designVersionId, featureReferenceId){

        return DesignVersionComponents.find(
            {
                designVersionId:                designVersionId,
                componentFeatureReferenceIdNew: featureReferenceId,
                componentType:                  {$ne: ComponentType.FEATURE}
            }
        ).fetch();
    }

    getNonRemovedDvFeatures(designVersionId){

        return DesignVersionComponents.find({
            designVersionId:    designVersionId,
            componentType:      ComponentType.FEATURE,
            updateMergeStatus:  {$ne: UpdateMergeStatus.COMPONENT_REMOVED}
        }).fetch();
    }

    getNonRemovedDvScenarios(designVersionId){

        return DesignVersionComponents.find({
            designVersionId:    designVersionId,
            componentType:      ComponentType.SCENARIO,
            updateMergeStatus:  {$ne: UpdateMergeStatus.COMPONENT_REMOVED}
        }).fetch();
    }

    getNonRemovedFeatureScenarios(designVersionId, featureReferenceId){

        return DesignVersionComponents.find({
            designVersionId:                designVersionId,
            componentType:                  ComponentType.SCENARIO,
            componentFeatureReferenceIdNew: featureReferenceId,
            updateMergeStatus:              {$ne: UpdateMergeStatus.COMPONENT_REMOVED}
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

    getChildComponentsByIndex(designVersionId, componentReferenceId) {

        return DesignVersionComponents.find(
            {
                componentParentReferenceIdNew: componentReferenceId,
                designVersionId: designVersionId
            },
            {sort: {componentIndexNew: 1}}

        ).fetch();
    }

    getChildComponents(designVersionId, componentReferenceId) {

        return DesignVersionComponents.find(
            {
                componentParentReferenceIdNew: componentReferenceId,
                designVersionId: designVersionId
            }
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
                //updateMergeStatus:              {$ne: UpdateMergeStatus.COMPONENT_ADDED}
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

    getScenariosWithNoHierarchy(designVersionId){

        return DesignVersionComponents.find(
            {
                designVersionId:    designVersionId,
                componentType:      ComponentType.SCENARIO,
                aspectRef:          'NONE'
            }
        ).fetch();
    }

    getDvScenariosNotInWorkPackages(designVersionId){

        return DesignVersionComponents.find(
            {
                designVersionId:                designVersionId,
                workPackageId:                  'NONE',
                componentType:                  ComponentType.SCENARIO
            }
        ).fetch();
    }

    getDvScenariosInWorkPackage(designVersionId, workPackageId){

        return DesignVersionComponents.find(
            {
                designVersionId:                designVersionId,
                workPackageId:                  workPackageId,
                componentType:                  ComponentType.SCENARIO
            }
        ).fetch();
    }

    getAppParent(designVersionId, appRef){

        return DesignVersionComponents.findOne({
            designVersionId: designVersionId,
            componentReferenceId: appRef
        });
     }

    getS1Parent(designVersionId, s1Ref){

        return DesignVersionComponents.findOne({
            designVersionId: designVersionId,
            componentReferenceId: s1Ref
        });
    }

    getS2Parent(designVersionId, s2Ref){

        return DesignVersionComponents.findOne({
            designVersionId: designVersionId,
            componentReferenceId: s2Ref
        });
    }

    getS3Parent(designVersionId, s3Ref){

        return DesignVersionComponents.findOne({
            designVersionId: designVersionId,
            componentReferenceId: s3Ref
        });
    }

    getS4Parent(designVersionId, s4Ref){

        return DesignVersionComponents.findOne({
            designVersionId: designVersionId,
            componentReferenceId: s4Ref
        });
    }

    getFeatureParent(designVersionId, featureRef){

        return DesignVersionComponents.findOne({
            designVersionId: designVersionId,
            componentReferenceId: featureRef
        });
    }

    getAspectParent(designVersionId, aspectRef){

        return DesignVersionComponents.findOne({
            designVersionId: designVersionId,
            componentReferenceId: aspectRef
        });
    }

    getAppChildren(designVersionId, appRef){

        return DesignVersionComponents.find(
            {
                designVersionId:    designVersionId,
                appRef:             appRef
            }
        ).fetch();
    }

    getS1Children(designVersionId, s1Ref){

        return DesignVersionComponents.find(
            {
                designVersionId:    designVersionId,
                s1Ref:              s1Ref
            }
        ).fetch();
    }

    getS2Children(designVersionId, s2Ref){

        return DesignVersionComponents.find(
            {
                designVersionId:    designVersionId,
                s2Ref:              s2Ref
            }
        ).fetch();
    }

    getS3Children(designVersionId, s3Ref){

        return DesignVersionComponents.find(
            {
                designVersionId:    designVersionId,
                s3Ref:              s3Ref
            }
        ).fetch();
    }

    getS4Children(designVersionId, s4Ref){

        return DesignVersionComponents.find(
            {
                designVersionId:    designVersionId,
                s4Ref:              s4Ref
            }
        ).fetch();
    }

    getFeatureChildren(designVersionId, featureRef){

        return DesignVersionComponents.find(
            {
                designVersionId:    designVersionId,
                featureRef:         featureRef
            }
        ).fetch();
    }

    getAspectChildren(designVersionId, aspectRef){

        return DesignVersionComponents.find(
            {
                designVersionId:    designVersionId,
                aspectRef:          aspectRef
            }
        ).fetch();
    }

    getAllParents(designVersionComponent, parentsList){

        //console.log('Looking for parents with list %o ', parentsList);

        let newParentsList = parentsList;

        if(designVersionComponent.componentParentReferenceIdNew !== 'NONE'){

            let parentComponent = this.getDesignComponentByRef(designVersionComponent.designVersionId, designVersionComponent.componentParentReferenceIdNew);

            if(parentComponent) {

                newParentsList.push(parentComponent._id);

                this.getAllParents(parentComponent, newParentsList);

            } else {

                //console.log('Returning list 2 %o ', newParentsList);
                return newParentsList
            }
        } else {

            //console.log('Returning list 1 %o ', newParentsList);
            return newParentsList;
        }

        return newParentsList;
    }

    getAllChildren(parentComponent, childrenList){

        let newChildrenList = childrenList;

        if(parentComponent.componentType !== ComponentType.SCENARIO){

            let children = this.getChildComponents(parentComponent.designVersionId, parentComponent.componentReferenceId);

            children.forEach((child) => {

                newChildrenList.push(child._id);

                this.getAllChildren(child, newChildrenList);
            });

        } else {

            return newChildrenList;
        }

        return newChildrenList;
    }

    // UPDATE ==========================================================================================================

    setComponentHierarchyRefs(designComponentId, indexData){

        return DesignVersionComponents.update(
            {_id: designComponentId},
            {
                $set:{
                    appRef:         indexData.appRef,
                    s1Ref:          indexData.s1Ref,
                    s2Ref:          indexData.s2Ref,
                    s3Ref:          indexData.s3Ref,
                    s4Ref:          indexData.s4Ref,
                    featureRef:     indexData.featureRef,
                    aspectRef:      indexData.aspectRef,
                }
            }
        )
    }

    updateFeatureHierarchyRefs(featureId, indexData){

        return DesignVersionComponents.update(
            {
                _id:    featureId
            },
            {
                $set:{
                    appRef: indexData.appRef,
                    s1Ref:  indexData.s1Ref,
                    s2Ref:  indexData.s2Ref,
                    s3Ref:  indexData.s3Ref,
                    s4Ref:  indexData.s4Ref
                }
            }
        )
    }

    updateFeatureChildrenHierarchyRefs(designVersionId, featureRef, indexData){

        return DesignVersionComponents.update(
            {
                designVersionId:    designVersionId,
                featureRef:         featureRef
            },
            {
                $set:{
                    appRef:         indexData.appRef,
                    s1Ref:          indexData.s1Ref,
                    s2Ref:          indexData.s2Ref,
                    s3Ref:          indexData.s3Ref,
                    s4Ref:          indexData.s4Ref
                }
            },
            {multi: true}
        )
    }

    updateSectionHierarchyRefs(sectionId, indexData){

        return DesignVersionComponents.update(
            {
                _id:    sectionId
            },
            {
                $set:{
                    appRef: indexData.appRef,
                    s1Ref:  indexData.s1Ref,
                    s2Ref:  indexData.s2Ref,
                    s3Ref:  indexData.s3Ref,
                    s4Ref:  indexData.s4Ref
                }
            }
        )
    }

    updateSectionChildrenHierarchyRefs(designVersionId, sectionRef, indexData){

        DesignVersionComponents.update(
            {
                designVersionId:    designVersionId,
                s1Ref:              sectionRef

            },
            {
                $set:{
                    appRef: indexData.appRef,
                    s1Ref:  indexData.s1Ref,
                    s2Ref:  indexData.s2Ref,
                    s3Ref:  indexData.s3Ref,
                    s4Ref:  indexData.s4Ref
                }
            },
            {multi: true}
        );

        DesignVersionComponents.update(
            {
                designVersionId:    designVersionId,
                s2Ref:              sectionRef

            },
            {
                $set:{
                    appRef: indexData.appRef,
                    s1Ref:  indexData.s1Ref,
                    s2Ref:  indexData.s2Ref,
                    s3Ref:  indexData.s3Ref,
                    s4Ref:  indexData.s4Ref
                }
            },
            {multi: true}
        );

        DesignVersionComponents.update(
            {
                designVersionId:    designVersionId,
                s3Ref:              sectionRef

            },
            {
                $set:{
                    appRef: indexData.appRef,
                    s1Ref:  indexData.s1Ref,
                    s2Ref:  indexData.s2Ref,
                    s3Ref:  indexData.s3Ref,
                    s4Ref:  indexData.s4Ref
                }
            },
            {multi: true}
        );

        DesignVersionComponents.update(
            {
                designVersionId:    designVersionId,
                s4Ref:              sectionRef

            },
            {
                $set:{
                    appRef: indexData.appRef,
                    s1Ref:  indexData.s1Ref,
                    s2Ref:  indexData.s2Ref,
                    s3Ref:  indexData.s3Ref,
                    s4Ref:  indexData.s4Ref
                }
            },
            {multi: true}
        );
    }

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

    updateNewItemNameFromDesignUpdate(designComponentId, updateItem, updateMergeStatus){

        return DesignVersionComponents.update(
            {_id: designComponentId},
            {
                $set:{
                    componentNameOld:               updateItem.componentNameNew,
                    componentNameRawOld:            updateItem.componentNameRawNew,
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

export const DesignComponentData = new DesignComponentDataClass();