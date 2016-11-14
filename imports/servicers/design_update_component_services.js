/**
 * Created by aston on 15/09/2016.
 */

import { DesignVersions } from '../collections/design/design_versions.js';
import { DesignUpdateComponents } from '../collections/design_update/design_update_components.js';
import { DesignComponents } from '../collections/design/design_components.js';

import { ComponentType, LogLevel } from '../constants/constants.js';

import  DesignServices              from './design_services.js';
import  DesignUpdateServices        from './design_update_services.js';

import {getIdFromMap, log} from '../common/utils.js';

class DesignUpdateComponentServices{

    // Add a new design update component to design update
    addNewComponent(designVersionId, designUpdateId, parentId, componentType, componentLevel, defaultName, defaultRawName, defaultRawText, defaultNarrative, defaultRawNarrative){

        // Get the parent reference id (if there is a parent)
        let parentRefId = 'NONE';
        let featureRefId = 'NONE';

        let parent = DesignUpdateComponents.findOne({_id: parentId});

        if(parent){
            parentRefId = parent.componentReferenceId;

            // Get the Feature Reference ID.  This will be NONE for anything that is not under a Feature
            featureRefId = parent.componentFeatureReferenceIdNew;
        }

        // Get the design id - this is added to the components for easier access to data
        let designId = DesignVersions.findOne({_id: designVersionId}).designId;

        DesignUpdateComponents.insert(
            {
                componentReferenceId:           'TEMP',                 // Will update this after component created
                designId:                       designId,
                designVersionId:                designVersionId,
                designUpdateId:                 designUpdateId,
                componentType:                  componentType,
                componentLevel:                 componentLevel,
                componentParentIdOld:           parentId,
                componentParentIdNew:           parentId,               // Because this component may be moved later
                componentParentReferenceIdOld:  parentRefId,
                componentParentReferenceIdNew:  parentRefId,
                componentFeatureReferenceIdOld: featureRefId,
                componentFeatureReferenceIdNew: featureRefId,

                // Data is all defaults to start with
                componentNameOld:               defaultName,
                componentNameRawOld:            defaultRawName,
                componentNameNew:               defaultName,
                componentNameRawNew:            defaultRawName,
                componentNarrativeOld:          defaultNarrative,
                componentNarrativeNew:          defaultNarrative,
                componentNarrativeRawOld:       defaultRawNarrative,
                componentNarrativeRawNew:       defaultRawNarrative,
                componentTextRawOld:            defaultRawText,
                componentTextRawNew:            defaultRawText,

                // State is a new item
                isNew:                          true,                   // New item added to design
                isChanged:                      false,                  // For now - will go to true when name is edited
                isTextChanged:                  false,                  // For now - will go to true when text is edited
                isMoved:                        false,
                isRemoved:                      false,

                isInScope:                      DesignUpdateServices.isScopable(componentType),         // If scopable then this must be in scope...
                isParentScope:                  false,
                isScopable:                     DesignUpdateServices.isScopable(componentType)          // A Scopable item can be picked as part of a change

            },

            (error, result) => {
                if(error){
                    // Error handler
                    console.log("Insert Design Update Component - Error: " + error);
                } else {
                    console.log("Insert Design Update Component - Success: " + result);

                    // Update the component reference to be the _id.  Note that this is not silly because the CR ID will
                    // always be the _id of the component that was created first.  So for components added in a design new edit
                    // it will be the design component _id...
                    DesignUpdateComponents.update(
                        {_id: result},
                        { $set: {componentReferenceId: result}}
                    );

                    // If a Feature also update the Feature Ref Id to the new ID
                    if(componentType === ComponentType.FEATURE){
                        DesignUpdateComponents.update(
                            {_id: result},
                            {
                                $set: {
                                    componentFeatureReferenceIdOld: result,
                                    componentFeatureReferenceIdNew: result
                                }
                            }
                        );

                        // Make sure Design is no longer removable now that a feature added
                        DesignServices.setRemovable(designId);
                    }

                    // When inserting a new design component its parent becomes non-removable
                    if(parentId) {
                        DesignUpdateComponents.update(
                            {_id: parentId},
                            {
                                $set: {isRemovable: false}
                            },

                            (error, result) => {
                                if(error) {
                                    // Error handler
                                    console.log("Update non-removable - Error: " + error);
                                } else {
                                    console.log("Update non-removable - Success for: " + parentId);
                                }
                            }
                        );
                    }

                    // Set the starting index for a new component (at end of list)
                    this.setIndex(result, componentType, parentId);

                    // Ensure that all parents of the component are now in ParentScope
                    this.updateParentScope(result, true);
                }
            }
        );

    };

    importComponent(designId, designVersionId, designUpdateId, component){

        const designUpdateComponentId = DesignUpdateComponents.insert(
            {
                // Identity
                componentReferenceId:           component.componentReferenceId,
                designId:                       designId,                                           // Restored Design Id
                designVersionId:                designVersionId,                                    // Restored Design Version Id
                designUpdateId:                 designUpdateId,                                     // Restored Design Update Id
                componentType:                  component.componentType,
                componentLevel:                 component.componentLevel,
                componentParentIdOld:           component.componentParentIdOld,                     // Will be wrong and corrected later
                componentParentIdNew:           component.componentParentIdNew,                     // Ditto
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
                isChanged:                      component.isChanged,
                isTextChanged:                  component.isTextChanged,
                isMoved:                        component.isMoved,
                isRemoved:                      component.isRemoved,

                // Editing state (shared and persistent)
                isRemovable:                    component.isRemovable,
                isScopable:                     component.isScopable,
                isInScope:                      component.isInScope,
                isParentScope:                  component.isParentScope,
                lockingUser:                    component.lockingUser
            }
        );

        return designUpdateComponentId;
    };

    // Resets parent ids after an import of data
    importRestoreParent(designUpdateComponentId, componentMap){

        const designUpdateComponent = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

        const oldParentIdOld = designUpdateComponent.componentParentIdOld;
        const oldParentIdNew = designUpdateComponent.componentParentIdNew;

        // log(LogLevel.TRACE, "Restoring parent for DU component {} with previous old parent id {} and previous new parent id {}",
        //     designUpdateComponent.componentNameNew,
        //     oldParentIdOld,
        //     oldParentIdNew);

        let newParentIdOld = 'NONE';
        let newParentIdNew = 'NONE';

        if(oldParentIdOld != 'NONE') {
            newParentIdOld = getIdFromMap(componentMap, oldParentIdOld);
            log(LogLevel.TRACE, "New Parent Id Old is {}", newParentIdOld);
        }

        if(oldParentIdNew!= 'NONE') {
            newParentIdNew = getIdFromMap(componentMap, oldParentIdNew);
            log(LogLevel.TRACE, "New Parent Id New is {}", newParentIdNew);
        }

        DesignUpdateComponents.update(
            {_id: designUpdateComponentId},
            {
                $set:{
                    componentParentIdOld: newParentIdOld,
                    componentParentIdNew: newParentIdNew
                }
            }
        );

    }


    // Move a design update component to a new parent
    moveComponent(designUpdateComponentId, newParentId){

        const newParent = DesignUpdateComponents.findOne({_id: newParentId});
        const movingComponent = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

        // Check for move back to old position
        const oldParentId = movingComponent.componentParentIdOld;

        // Not moved if the old parent is the same as the new one
        let isMoved = (oldParentId != newParentId);

        // If a Design Section, make sure the level gets changed correctly
        let newLevel = movingComponent.componentLevel;

        if(movingComponent.componentType === ComponentType.DESIGN_SECTION){
            newLevel = newParent.componentLevel + 1;
        }

        DesignUpdateComponents.update(
            {_id: designUpdateComponentId},
            {
                $set:{
                    componentParentIdNew:           newParentId,
                    componentParentReferenceIdNew:  newParent.componentReferenceId,
                    componentFeatureReferenceIdNew: newParent.componentFeatureReferenceIdNew,
                    componentLevel:                 newLevel,
                    isMoved:                        isMoved
                }
            },

            (error, result) => {
                if(error) {
                    // Error handler
                    console.log("Design Update Move - Error: " + error);
                } else {
                    console.log("Design Update Move - Success: " + result);

                    // Make sure new Parent is now not removable as it must have a child
                    DesignUpdateComponents.update(
                        {_id: newParentId},
                        {
                            $set:{
                                isRemovable: false
                            }
                        }
                    );

                    // But the old parent may now be removable
                    if (this.hasNoChildren(oldParentId)){
                        DesignUpdateComponents.update(
                            {_id: oldParentId},
                            { $set: {isRemovable: true}}
                        );
                    }
                }
            }
        );
    }

    // Move the component to a new position in its local list
    reorderComponent(componentId, targetComponentId){
        // The new position is always just above the target component

        const movingComponent = DesignUpdateComponents.findOne({_id: componentId});
        const targetComponent = DesignUpdateComponents.findOne({_id: targetComponentId});

        const peerComponents = DesignUpdateComponents.find(
            {
                _id: {$ne: componentId},
                componentType: movingComponent.componentType,
                componentParentIdNew: movingComponent.componentParentIdNew
            },
            {sort:{componentIndexNew: -1}}
        );

        let indexBelow = targetComponent.componentIndexNew;
        //console.log("Index below = " + indexBelow);

        let indexAbove = 0;                                 // The default if nothing exists above
        const listMaxArrayIndex = peerComponents.count() -1;
        //console.log("List max = " + listMaxArrayIndex);

        const peerArray = peerComponents.fetch();

        // Go through the list of peers (ordered from bottom to top)
        let i = 0;
        while (i <= listMaxArrayIndex){
            if(peerArray[i].componentIndexNew === targetComponent.componentIndexNew){
                // OK, this is the target component so the next one in the list (if there is one) is the one that will be above the new position
                if(i < listMaxArrayIndex){
                    indexAbove = peerArray[i+1].componentIndexNew;
                }
                break;
            }
            i++;
        }

        //console.log("Index above = " + indexAbove);

        // The new index is half way between the above an below index - sort of Dewey Decimal system to avoid having to reindex everything every time
        const indexDiff = indexBelow - indexAbove;
        const newIndex = (indexBelow + indexAbove) / 2;

        //console.log("Setting new index for " + movingComponent.componentName + " to " + newIndex);

        DesignUpdateComponents.update(
            {_id: componentId},
            {
                $set:{
                    componentIndexNew: newIndex
                }
            }
        );


        // Over time the indexing differences may get too small to work any more so periodically reset the indexes for this list.
        if(indexDiff < 0.001){
            console.log("Index reset!");

            // Get the components in current order
            const resetComponents = DesignUpdateComponents.find(
                {
                    componentType: movingComponent.componentType,
                    componentParentIdNew: movingComponent.componentParentIdNew
                },
                {sort:{componentIndexNew: 1}}
            );

            let resetIndex = 100;

            // Reset them to 100, 200, 300 etc...
            resetComponents.forEach((component) => {
                DesignUpdateComponents.update(
                    {_id: component._id},
                    {
                        $set:{
                            componentIndexNew: resetIndex
                        }
                    }
                );

                resetIndex = resetIndex + 100;
            })
        }


    }

    setIndex(componentId, componentType, parentId){

        // Get the max index of OTHER components of this type under the same parent
        const peerComponents = DesignUpdateComponents.find({_id: {$ne: componentId}, componentType: componentType, componentParentIdNew: parentId}, {sort:{componentIndexNew: -1}});

        // If no components then leave as default of 100
        if(peerComponents.count() > 0){
            console.log("Highest peer is " + peerComponents.fetch()[0].componentNameOld);

            let newIndex = peerComponents.fetch()[0].componentIndexOld + 100;

            DesignUpdateComponents.update(
                {_id: componentId},
                {
                    $set:{
                        componentIndexOld: newIndex,
                        componentIndexNew: newIndex
                    }
                }
            );
        }
    }

    // Store the scope state of a design update component
    toggleScope(designUpdateComponentId, newScope){

        DesignUpdateComponents.update(
            { _id: designUpdateComponentId},
            {
                $set:{
                    isInScope: newScope
                }
            },

            (error, result) => {
                if (error){

                } else {
                    // If setting in scope. make sure all parents have parent scope
                    // If setting out of scope, remove parent scope from any parents that do not have in scope children
                    this.updateParentScope(designUpdateComponentId, newScope);
                }
            }
        );

    }

    updateParentScope(designUpdateComponentId, newScope){

        if(newScope){
            // Setting this component in scope
            // Set all parents to be in Parent Scope (unless already in scope themselves)

            let parentAddId = DesignUpdateComponents.findOne({_id: designUpdateComponentId}).componentParentIdNew;

            let applicationAdd = false;

            // Applications at the top level are created with parent id = 'NONE';
            while(!applicationAdd){

                DesignUpdateComponents.update(
                    {_id: parentAddId, isInScope: false},
                    {
                        $set:{
                            isParentScope: true
                        }
                    }
                );


                // If we have just updated an Application its time to stop
                applicationAdd = (parentAddId === 'NONE');

                // Get next parent if continuing
                if(!applicationAdd) {
                    parentAddId = DesignUpdateComponents.findOne({_id: parentAddId}).componentParentIdNew;
                }
            }
        } else {
            // Setting this component out of scope:

            // That does not mean children of it are out of scope...

            let descopedItem = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

            // Remove all parents from parent scope if they no longer have a child in scope

            // Are there any other in scope or parent scope components that have the same parent id as the descoped item.  If so we don't descope the parent
            let inScopeChildren = DesignUpdateComponents.find({componentParentIdNew: descopedItem.componentParentIdNew, $or:[{isInScope: true}, {isParentScope: true}]}).count();
            let continueLooking = true;

            while(inScopeChildren == 0 && continueLooking){

                DesignUpdateComponents.update(
                    {_id: descopedItem.componentParentIdNew},
                    {
                        $set:{
                            isParentScope: false
                        }
                    }
                );

                // Stop looking if we have reached the Application level
                continueLooking = (descopedItem.componentType != ComponentType.APPLICATION);

                // Get next parent if continuing
                if(continueLooking) {
                    // Move descoped item up to the parent that has just been descoped
                    descopedItem = DesignUpdateComponents.findOne({_id: descopedItem.componentParentIdNew});
                    // And see if its parent has any in scope children
                    inScopeChildren = DesignUpdateComponents.find({componentParentIdNew: descopedItem.componentParentIdNew, isInScope: true}).count();
                }
            }
        }
    };


    // Save text for a design update component
    saveDesignComponentName(designUpdateComponentId, componentNewName, componentNewNameRaw){

        // Item only counts as logically changed if the new name is still different to that in the existing design version.
        // So it becomes not changed if reverted back to the original name after a change...

        let componentOldName = DesignUpdateComponents.findOne({_id: designUpdateComponentId}).componentNameOld;

        let changed = (componentNewName != componentOldName);

        // Update the new names for the update
        DesignUpdateComponents.update(
            {_id: designUpdateComponentId},
            {
                $set:{
                    componentNameNew: componentNewName,
                    componentNameRawNew: componentNewNameRaw,
                    isChanged: changed
                }
            },

            (error, result) => {
                if(error) {
                    // Error handler
                    console.log("Save Design Update Component Name Error: " + error);
                    return false;
                } else {
                    console.log("Save Design Update Component Name Success: " + result);
                    return true;
                }
            }
        );
    };


    // Save the narrative for a feature component
    saveNarrative(featureId, newRawNarrative, newNarrative){

        let componentOldNarrative = DesignUpdateComponents.findOne({_id: featureId}).componentNarrativeOld;

        console.log("old narrative: " + componentOldNarrative + " New narrative: " + newNarrative);

        let changed = (newNarrative != componentOldNarrative);

        DesignUpdateComponents.update(
            {_id: featureId},
            {
                $set:{
                    componentNarrativeNew:  newNarrative,
                    componentNarrativeRawNew: newRawNarrative,
                    isChanged: changed
                }
            },

            (error, result) => {
                if(error) {
                    // Error handler
                    console.log("Save Design Update Narrative Error: " + error);
                } else {
                    console.log("Save Design Update Narrative Success: " + result);
                }
            }
        );
    };


    deleteComponent(designUpdateComponentId, parentId){

        // For a design update this is a logical delete it it was an existing item
        // If however it was new in the update, remove it completely

        let designUpdateComponent = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

        if(designUpdateComponent.isNew){
            // Actually delete it
            DesignUpdateComponents.remove(
                {_id: designUpdateComponentId},
                (error, result) => {
                    if (error) {
                        // Error handler
                        console.log("Remove Design Update Component Error: " + error);
                    } else {
                        console.log("Remove Design Update Component Success: " + result);

                        // When removing a design component its parent may become removable
                        if (this.hasNoChildren(parentId)) {
                            DesignUpdateComponents.update(
                                {_id: parentId},
                                {$set: {isRemovable: true}}
                            )
                        }
                    }
                }
            );

            // If this happened to be the last Feature, Design is now removable
            if(designUpdateComponent.componentType === ComponentType.FEATURE) {
                DesignServices.setRemovable(designUpdateComponent.designId);
            }
        } else {
            // Logically delete it
            DesignUpdateComponents.update(
                {_id: designUpdateComponentId},
                {
                    $set: {
                        isRemoved: true
                        // Keep isRemovable as is so that restore can work
                    }
                },
                (error, result) => {
                    if (error) {
                        // Error handler
                        console.log("Logical Delete Design Update Component Error: " + error);
                    } else {
                        console.log("Logical Delete Design Update Component Success: " + result);

                        // When removing a design component its parent may become removable
                        if (this.hasNoChildren(parentId)) {
                            DesignUpdateComponents.update(
                                {_id: parentId},
                                {$set: {isRemovable: true}}
                            );
                        }

                        // But if you logically delete the parent then a removed child is no longer restorable so mark it as not removable
                        DesignUpdateComponents.update(
                            {componentParentIdNew: designUpdateComponentId, isRemoved: true},
                            {$set: {isRemovable: false}}
                        );
                    }
                }
            );
        }
    };

    restoreComponent(designUpdateComponentId, parentId){

        // Undo a logical delete
        DesignUpdateComponents.update(
            {_id: designUpdateComponentId, isRemoved: true},
            {
                $set: {
                    isRemoved: false,
                    isRemovable: true   // It can't have any children or it would not have been deletable
                }
            },
            (error, result) => {
                if (error) {
                    // Error handler
                    console.log("Logical Restore Design Update Component Error: " + error);
                } else {
                    console.log("Logical Restore Design Update Component Success: " + result);

                    // When restoring a design component its parent (if there is one) will become non-removable
                    if(parentId != 'NONE') {
                        DesignUpdateComponents.update(
                            {_id: parentId},
                            {$set: {isRemovable: false}}
                        )
                    }
                }
            }
        );

    }

    hasNoChildren(designUpdateComponentId){
        // Children are those with their parent id = this item and not logically deleted
        return DesignUpdateComponents.find({componentParentIdNew: designUpdateComponentId, isRemoved: false}).count() === 0;
    };

    // Check to see if parent is not logically deleted
    isDeleted(designUpdateComponentParentId){

        console.log("checking to see if " + designUpdateComponentParentId + " is removed...");

        // OK if there actually is no parent
        if(designUpdateComponentParentId === 'NONE'){
            return false;
        }

        console.log("Not top level...")

        // Otherwise OK if parent is not removed
        return parent = DesignUpdateComponents.findOne({_id: designUpdateComponentParentId}).isRemoved;

    }



}

export default new DesignUpdateComponentServices();