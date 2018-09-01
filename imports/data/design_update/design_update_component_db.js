
import {DesignUpdateComponents}         from '../../collections/design_update/design_update_components.js';

import { ComponentType, UpdateScopeType }  from '../../constants/constants.js';


class DesignUpdateComponentDataClass {

    // INSERT ==========================================================================================================

    insertNewUpdateComponent(designId, designVersionId, designUpdateId, componentType, componentLevel, parentRefId, featureRefId, defaultName, defaultRawName, defaultRawText, isNew, isDefault, isChanged, devAdded, workPackageId, isScopable){

        return DesignUpdateComponents.insert(
            {
                componentReferenceId:           'TEMP',                 // Will update this after component created
                designId:                       designId,
                designVersionId:                designVersionId,
                designUpdateId:                 designUpdateId,
                componentType:                  componentType,
                componentLevel:                 componentLevel,
                componentParentReferenceIdOld:  parentRefId,
                componentParentReferenceIdNew:  parentRefId,
                componentFeatureReferenceIdOld: featureRefId,
                componentFeatureReferenceIdNew: featureRefId,
                componentIndexOld:              999999999,              // Temp - bottom of list
                componentIndexNew:              999999999,              // Temp - bottom of list

                // Data is all defaults to start with
                componentNameOld:               defaultName,
                componentNameRawOld:            defaultRawName,
                componentNameNew:               defaultName,
                componentNameRawNew:            defaultRawName,
                componentTextRawOld:            defaultRawText,
                componentTextRawNew:            defaultRawText,

                // State is a new item
                isNew:                          isNew,                  // New item added to design
                isDefault:                      isDefault,
                isChanged:                      isChanged,              // Usually false
                isNarrativeChanged:             false,
                isTextChanged:                  false,                  // For now - will go to true when text is edited
                isMoved:                        false,
                isRemoved:                      false,
                isDevAdded:                     devAdded,
                workPackageId:                  workPackageId,

                scopeType:                      UpdateScopeType.SCOPE_IN_SCOPE,                         // All new items are automatically in scope
                isScopable:                     isScopable                                              // A Scopable item can be picked as part of a change
            }
        );
    }

    insertNewUpdateComponentFromBase(designUpdateId, baseComponent, isScopable, scopeType){

        return DesignUpdateComponents.insert({
            componentReferenceId:           baseComponent.componentReferenceId,
            designId:                       baseComponent.designId,
            designVersionId:                baseComponent.designVersionId,
            designUpdateId:                 designUpdateId,
            componentType:                  baseComponent.componentType,
            componentLevel:                 baseComponent.componentLevel,
            componentParentReferenceIdOld:  baseComponent.componentParentReferenceIdNew,
            componentParentReferenceIdNew:  baseComponent.componentParentReferenceIdNew,
            componentFeatureReferenceIdOld: baseComponent.componentFeatureReferenceIdNew,
            componentFeatureReferenceIdNew: baseComponent.componentFeatureReferenceIdNew,
            componentIndexOld:              baseComponent.componentIndexNew,
            componentIndexNew:              baseComponent.componentIndexNew,

            // Data
            componentNameOld:               baseComponent.componentNameNew,
            componentNameNew:               baseComponent.componentNameNew,
            componentNameRawOld:            baseComponent.componentNameRawNew,
            componentNameRawNew:            baseComponent.componentNameRawNew,
            componentNarrativeOld:          baseComponent.componentNarrativeNew,
            componentNarrativeNew:          baseComponent.componentNarrativeNew,
            componentNarrativeRawOld:       baseComponent.componentNarrativeRawNew,
            componentNarrativeRawNew:       baseComponent.componentNarrativeRawNew,
            componentTextRawOld:            baseComponent.componentTextRawNew,
            componentTextRawNew:            baseComponent.componentTextRawNew,

            // Update State
            isNew:                          false,
            isDefault:                      false,
            isChanged:                      false,
            isNarrativeChanged:             false,
            isTextChanged:                  false,
            isMoved:                        false,
            isRemoved:                      false,
            isRemovedElsewhere:             false,
            isDevUpdated:                   false,
            isDevAdded:                     false,

            // Editing state (shared and persistent)
            isRemovable:                    true,           // Note all update items are removable when scoped
            isScopable:                     isScopable,
            scopeType:                      scopeType
        });
    }

    importComponent(designId, designVersionId, designUpdateId, workPackageId, component){

        DesignUpdateComponents.insert(
            {
                // Identity
                componentReferenceId:           component.componentReferenceId,
                designId:                       designId,                                           // Restored Design Id
                designVersionId:                designVersionId,                                    // Restored Design Version Id
                designUpdateId:                 designUpdateId,                                     // Restored Design Update Id
                componentType:                  component.componentType,
                componentLevel:                 component.componentLevel,
                componentParentReferenceIdOld:  component.componentParentReferenceIdOld,
                componentParentReferenceIdNew:  component.componentParentReferenceIdNew,
                componentFeatureReferenceIdOld: component.componentFeatureReferenceIdOld,
                componentFeatureReferenceIdNew: component.componentFeatureReferenceIdNew,
                componentIndexOld:              component.componentIndexOld,
                componentIndexNew:              component.componentIndexNew,

                // Data
                componentNameOld:               component.componentNameOld,
                componentNameNew:               component.componentNameNew,
                componentNameRawOld:            component.componentNameRawOld,
                componentNameRawNew:            component.componentNameRawNew,
                componentNarrativeOld:          component.componentNarrativeOld,
                componentNarrativeNew:          component.componentNarrativeNew,
                componentNarrativeRawOld:       component.componentNarrativeRawOld,
                componentNarrativeRawNew:       component.componentNarrativeRawNew,
                componentTextRawOld:            component.componentTextRawOld,
                componentTextRawNew:            component.componentTextRawNew,

                // Update State
                isNew:                          component.isNew,
                isDefault:                      component.isDefault,
                isChanged:                      component.isChanged,
                isNarrativeChanged:             component.isNarrativeChanged,
                isTextChanged:                  component.isTextChanged,
                isMoved:                        component.isMoved,
                isRemoved:                      component.isRemoved,
                isDevUpdated:                   component.isDevUpdated,
                isDevAdded:                     component.isDevAdded,
                workPackageId:                  workPackageId,

                // Editing state (shared and persistent)
                isRemovable:                    component.isRemovable,
                isScopable:                     component.isScopable,
                scopeType:                      component.scopeType,
                lockingUser:                    component.lockingUser
            }
        );
    }
    // SELECT ==========================================================================================================

    // Component -------------------------------------------------------------------------------------------------------
    getUpdateComponentById(componentId){

        return DesignUpdateComponents.findOne({
            _id: componentId
        });
    }


    getUpdateComponentByRef(designVersionId, designUpdateId, componentReferenceId){

        return DesignUpdateComponents.findOne({
            designVersionId:        designVersionId,
            designUpdateId:         designUpdateId,
            componentReferenceId:   componentReferenceId
        });
    }

    getCurrentContextComponents(designVersionId, designUpdateId){

        return DesignUpdateComponents.find({
            designVersionId:        designVersionId,
            designUpdateId:         designUpdateId
        }).fetch();
    }

    // Related Components ----------------------------------------------------------------------------------------------
    getExistingAspectsForFeature(designUpdateId, featureReferenceId){

        return DesignUpdateComponents.find({
            designUpdateId:                 designUpdateId,
            componentFeatureReferenceIdNew: featureReferenceId,
            componentType:                  ComponentType.FEATURE_ASPECT,
            isNew:                          false
        }).fetch();

    }

    getNonRemovedAspectsForFeature(designUpdateId, featureReferenceId){

        return DesignUpdateComponents.find(
            {
                designUpdateId:                 designUpdateId,
                componentType:                  ComponentType.FEATURE_ASPECT,
                componentFeatureReferenceIdNew: featureReferenceId,
                isRemoved:                      false
            },
            {sort: {componentIndexNew: 1}}
        ).fetch();
    }

    getFeatureByName(designVersionId, designUpdateId, featureName){

        return DesignUpdateComponents.findOne(
            {
                designVersionId: designVersionId,
                designUpdateId: designUpdateId,
                componentType: ComponentType.FEATURE,
                componentNameNew: featureName
            }
        );
    }

    getScopedChildComponents(designVersionId, designUpdateId, parentComponentReferenceId){

        // Ignores peer-scope components
        return DesignUpdateComponents.find(
            {
                designVersionId:                designVersionId,
                designUpdateId:                 designUpdateId,
                componentParentReferenceIdNew:  parentComponentReferenceId,
                scopeType:                      {$in:[UpdateScopeType.SCOPE_IN_SCOPE, UpdateScopeType.SCOPE_PARENT_SCOPE]}  // Ignore Peer Items
            },
            {
                sort: {componentIndexNew: 1}
            }).fetch();

    }

    getScopedChildComponentsOfType(designUpdateId, childComponentType, parentRefId){

        return DesignUpdateComponents.find(
            {
                designUpdateId:                 designUpdateId,
                componentParentReferenceIdNew:  parentRefId,
                componentType:                  childComponentType,
                scopeType:                      {$in: [UpdateScopeType.SCOPE_IN_SCOPE, UpdateScopeType.SCOPE_PARENT_SCOPE]}
            },
            {sort: {componentIndexNew: 1}}
        ).fetch();
    }

    getPeerComponents(designUpdateId, componentReferenceId, componentType, componentParentReferenceId){

        return DesignUpdateComponents.find(
            {
                designUpdateId: designUpdateId,
                componentReferenceId: {$ne: componentReferenceId},
                componentType: componentType,
                componentParentReferenceIdNew: componentParentReferenceId
            },
            {sort:{componentIndexNew: -1}}
        ).fetch();
    }

    getNewPeerComponents(designUpdateId, componentReferenceId, componentType, componentParentReferenceId){

        return DesignUpdateComponents.find(
            {
                designUpdateId: designUpdateId,
                componentReferenceId: {$ne: componentReferenceId},
                componentType: componentType,
                componentParentReferenceIdNew: componentParentReferenceId,
                isNew: true
            },
            {sort:{componentIndexNew: -1}}
        ).fetch();
    }

    getChildComponentsOfType(designUpdateId, componentType, componentParentReferenceId) {

        return DesignUpdateComponents.find(
            {
                componentParentReferenceIdNew: componentParentReferenceId,
                designUpdateId: designUpdateId,
                componentType: componentType,
            },
            {sort: {componentIndexNew: 1}}
        ).fetch();
    }

    getChildComponents(designUpdateId, componentParentReferenceId) {

        return DesignUpdateComponents.find(
            {
                componentParentReferenceIdNew: componentParentReferenceId,
                designUpdateId: designUpdateId
            }
        ).fetch();
    }

    getNonPeerScopeChildComponentsOfType(designUpdateId, childComponentType, parentRefId){

        return DesignUpdateComponents.find(
            {
                designUpdateId:                 designUpdateId,
                componentType:                  childComponentType,
                componentParentReferenceIdNew:  parentRefId,
                scopeType:                      {$ne: UpdateScopeType.SCOPE_PEER_SCOPE}
            },
            {sort:{componentIndexNew: 1}}
        ).fetch();
    }

    getNonRemovedChildComponentsOfType(designUpdateId, componentType, componentParentReferenceId){

        return DesignUpdateComponents.find(
            {
                designUpdateId:                 designUpdateId,
                componentType:                  componentType,
                componentParentReferenceIdNew:  componentParentReferenceId,
                isRemoved:                      false
            },
            {sort: {componentIndexNew: 1}}
        ).fetch();
    }

    getAllDuComponentInstancesInDv(designVersionId, componentReferenceId){

        return DesignUpdateComponents.find({
            designVersionId:        designVersionId,
            componentReferenceId:   componentReferenceId
        }).fetch();
    }

    getOtherDuComponentInstancesInDv(designVersionId, componentReferenceId, designUpdateComponentId){

        return DesignUpdateComponents.find({
            designVersionId:        designVersionId,
            componentReferenceId:   componentReferenceId,
            id:                     {$ne: designUpdateComponentId},
        }).fetch();
    }

    getChildFeatureCount(designVersionId, designUpdateId, componentReferenceId){

        return DesignUpdateComponents.find({
            designVersionId:                designVersionId,
            designUpdateId:                 designUpdateId,
            componentParentReferenceIdNew:  componentReferenceId,
            componentType:                  ComponentType.FEATURE
        }).count();
    }

    getNonScenarioFeatureComponents(designVersionId, designUpdateId, featureRefId){

        return DesignUpdateComponents.find(
            {
                designVersionId:                designVersionId,
                designUpdateId:                 designUpdateId,
                componentFeatureReferenceIdNew: featureRefId,
                componentType:                  {$ne:(ComponentType.SCENARIO)}
            }
        ).fetch();
    }

    getNonScenarioChildComponents(designVersionId, designUpdateId, componentReferenceId){

        return DesignUpdateComponents.find(
            {
                designVersionId:                designVersionId,
                designUpdateId:                 designUpdateId,
                componentParentReferenceIdNew:  componentReferenceId,
                componentType:                  {$ne:(ComponentType.SCENARIO)}
            }
        ).fetch();
    }

    getAllParents(designUpdateComponent, parentsList){

        //console.log('Looking for parents with list %o ', parentsList);

        let newParentsList = parentsList;

        if(designUpdateComponent.componentParentReferenceIdNew !== 'NONE'){

            let parentComponent = this.getUpdateComponentByRef(designUpdateComponent.designVersionId, designUpdateComponent.designUpdateId, designUpdateComponent.componentParentReferenceIdNew);

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

            let children = this.getChildComponents(parentComponent.designUpdateId, parentComponent.componentReferenceId);

            children.forEach((child) => {

                newChildrenList.push(child._id);

                this.getAllChildren(child, newChildrenList);
            });

        } else {

            return newChildrenList;
        }

        return newChildrenList;
    }

    // CHECKS ==========================================================================================================
    hasOtherRemovedInstancesInDesignVersion(designVersionId, designUpdateId, componentReferenceId){

        const removedInstances = DesignUpdateComponents.find({
            designVersionId:        designVersionId,
            componentReferenceId:   componentReferenceId,
            isRemoved:              true,
            designUpdateId:         {$ne: designUpdateId}
        }).count();

        return (removedInstances > 0);

    }

    hasNoChildren(designUpdateId, componentReferenceId){

        return DesignUpdateComponents.find({
            designUpdateId:                 designUpdateId,
            componentParentReferenceIdNew:  componentReferenceId
        }).count() === 0;
    }

    hasNoNonRemovedChildren(designUpdateId, componentReferenceId){

        return DesignUpdateComponents.find({
            designUpdateId:                 designUpdateId,
            componentParentReferenceIdNew:  componentReferenceId,
            isRemoved:                      false
        }).count() === 0;
    }

    // UPDATE ==========================================================================================================

    setComponentReferenceId(designUpdateComponentId){

        return DesignUpdateComponents.update(
            {_id: designUpdateComponentId},
            {$set: {componentReferenceId: designUpdateComponentId}}
        );
    }

    setWorkPackageId(designUpdateComponentId, workPackageId){

        return DesignUpdateComponents.update(
            {_id: designUpdateComponentId},
            {
                $set: {workPackageId: workPackageId}
            }
        );
    }

    removeWorkPackageIds(workPackageId){

        return DesignUpdateComponents.update(
            {
                workPackageId: workPackageId
            },
            {
                $set: {workPackageId: 'NONE'}
            },
            {multi: true}
        );
    }

    setIndex(designUpdateComponentId, oldIndex, newIndex){

        return DesignUpdateComponents.update(
            {_id: designUpdateComponentId},
            {
                $set:{
                    componentIndexOld: oldIndex,
                    componentIndexNew: newIndex
                }
            }
        );
    }

    setScope(designUpdateComponentId, scopeType){

        return DesignUpdateComponents.update(
            {_id: designUpdateComponentId},
            {
                $set:{
                    scopeType: scopeType
                }
            }
        );
    }

    setRemovable(designUpdateComponentId, removable){

        DesignUpdateComponents.update(
            {_id: designUpdateComponentId},
            {
                $set: {isRemovable: removable}
            }
        );
    }

    setLogicallyDeleted(designUpdateComponentId){

        return DesignUpdateComponents.update(
            {_id: designUpdateComponentId},
            {
                $set:{
                    isRemoved: true,
                    scopeType: UpdateScopeType.SCOPE_IN_SCOPE  // Automatically in scope when deleted
                }
            }
        );
    }

    logicallyDeleteComponent(designUpdateComponentId, componentNameOld, componentNameRawOld){

        return DesignUpdateComponents.update(
            {
                _id: designUpdateComponentId
            },
            {
                $set: {
                    isRemoved:              true,
                    isChanged:              false,
                    isNarrativeChanged:     false,
                    isTextChanged:          false,
                    componentNameNew:       componentNameOld,
                    componentNameRawNew:    componentNameRawOld,
                    scopeType:              UpdateScopeType.SCOPE_IN_SCOPE
                    // Keep isRemovable as is so that restore can work
                }
            }
        );
    }

    setOtherDvInstancesRemovedElsewhere(designUpdateComponentId, designUpdateId, designVersionId, componentReferenceId, isRemovedElsewhere){

        return DesignUpdateComponents.update(
            {
                _id:                    {$ne: designUpdateComponentId},
                designUpdateId:         {$ne: designUpdateId},
                designVersionId:        designVersionId,
                componentReferenceId:   componentReferenceId
            },
            {
                $set: {
                    isRemovedElsewhere: isRemovedElsewhere
                }
            },
            {multi: true}
        );
    }

    initialiseFeatureDetails(designUpdateComponentId, narrativeText, narrativeRawText){

        return DesignUpdateComponents.update(
            {_id: designUpdateComponentId},
            {
                $set: {
                    componentFeatureReferenceIdOld: designUpdateComponentId,
                    componentFeatureReferenceIdNew: designUpdateComponentId,
                    componentNarrativeOld: narrativeText,
                    componentNarrativeNew: narrativeText,
                    componentNarrativeRawOld: narrativeRawText,
                    componentNarrativeRawNew: narrativeRawText
                }
            }
        );
    }

    updateComponentName(designUpdateComponentId, componentNameOld, componentNameNew, componentNameRawOld, componentNameRawNew, isChanged){

        return DesignUpdateComponents.update(
            {_id: designUpdateComponentId},
            {
                $set: {
                    componentNameOld:       componentNameOld,
                    componentNameNew:       componentNameNew,
                    componentNameRawOld:    componentNameRawOld,
                    componentNameRawNew:    componentNameRawNew,
                    isChanged:              isChanged
                }
            }
        );
    }

    updateFeatureNarrative(designUpdateComponentId, componentNarrativeOld, componentNarrativeNew, componentNarrativeRawOld, componentNarrativeRawNew, isChanged){

        return DesignUpdateComponents.update(
            {_id: designUpdateComponentId},
            {
                $set: {
                    componentNarrativeOld: componentNarrativeOld,
                    componentNarrativeNew: componentNarrativeNew,
                    componentNarrativeRawOld: componentNarrativeRawOld,
                    componentNarrativeRawNew: componentNarrativeRawNew,
                    isNarrativeChanged: isChanged
                }
            }
        );
    }

    updateDetailsText(designUpdateComponentId, rawText){

        return DesignUpdateComponents.update(
            {_id: designUpdateComponentId},
            {
                $set: {
                    componentTextRawNew: rawText,
                    isTextChanged: true
                }
            }
        );
    }

    updateWithLatestDvComponentDetails(designUpdateComponentId, currentDesignVersionComponent){

        DesignUpdateComponents.update(
            {_id: designUpdateComponentId},
            {
                $set: {
                    componentLevel:                 currentDesignVersionComponent.componentLevel,
                    componentParentReferenceIdOld:  currentDesignVersionComponent.componentParentReferenceIdNew,
                    componentParentReferenceIdNew:  currentDesignVersionComponent.componentParentReferenceIdNew,
                    componentFeatureReferenceIdOld: currentDesignVersionComponent.componentFeatureReferenceIdNew,
                    componentFeatureReferenceIdNew: currentDesignVersionComponent.componentFeatureReferenceIdNew,
                    componentIndexOld:              currentDesignVersionComponent.componentIndexNew,
                    componentIndexNew:              currentDesignVersionComponent.componentIndexNew,
                    componentNameOld:               currentDesignVersionComponent.componentNameNew,
                    componentNameNew:               currentDesignVersionComponent.componentNameNew,
                    componentNameRawOld:            currentDesignVersionComponent.componentNameRawNew,
                    componentNameRawNew:            currentDesignVersionComponent.componentNameRawNew,
                    componentNarrativeOld:          currentDesignVersionComponent.componentNarrativeNew,
                    componentNarrativeNew:          currentDesignVersionComponent.componentNarrativeNew,
                    componentNarrativeRawOld:       currentDesignVersionComponent.componentNarrativeRawNew,
                    componentNarrativeRawNew:       currentDesignVersionComponent.componentNarrativeRawNew,
                    componentTextRawOld:            currentDesignVersionComponent.componentTextRawNew,
                    componentTextRawNew:            currentDesignVersionComponent.componentTextRawNew
                }
            }
        );
    }

    updateAfterMove(designUpdateComponentId, newParentRefId, newFeatureRefId, newLevel, isMoved){

        return DesignUpdateComponents.update(
            {_id: designUpdateComponentId},
            {
                $set: {
                    componentParentReferenceIdNew: newParentRefId,
                    componentFeatureReferenceIdNew: newFeatureRefId,
                    componentLevel: newLevel,
                    isMoved: isMoved
                }
            }
        );
    }

    bulkUpdateDesignVersion(designUpdateId, newDesignVersionId){

        return DesignUpdateComponents.update(
            {designUpdateId: designUpdateId},
            {
                $set:{
                    designVersionId: newDesignVersionId
                }
            },
            {multi: true}
        );
    }

    bulkInsert(batchData){
        DesignUpdateComponents.batchInsert(batchData);
    }

    // REMOVE ==========================================================================================================

    removeComponent(designUpdateComponentId){

        return DesignUpdateComponents.remove({_id: designUpdateComponentId});

    }

    removePeerComponents(designUpdateId, componentType, parentReferenceId){

        return DesignUpdateComponents.remove(
            {
                designUpdateId:                 designUpdateId,
                componentType:                  componentType,
                componentParentReferenceIdNew:  parentReferenceId,
                scopeType:                      UpdateScopeType.SCOPE_PEER_SCOPE
            }
        );
    }

    removeAllUpdateComponents(designUpdateId){

        return DesignUpdateComponents.remove(
            {designUpdateId: designUpdateId}
        );
    }
}

export const DesignUpdateComponentData = new DesignUpdateComponentDataClass();