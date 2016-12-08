
// Ultrawide Collections
import { DesignVersions }           from '../../collections/design/design_versions.js';
import { DesignUpdateComponents }   from '../../collections/design_update/design_update_components.js';

// Ultrawide services
import { ComponentType, LogLevel }  from '../../constants/constants.js';
import { DefaultComponentNames }    from '../../constants/default_names.js';
import { getIdFromMap, log }        from '../../common/utils.js';

import DesignServices               from '../design/design_services.js';
import DesignUpdateModules          from '../../service_modules/design_update/design_update_service_modules.js';
import DesignComponentModules       from '../../service_modules/design/design_component_service_modules.js';
import DesignUpdateComponentModules from '../../service_modules/design_update/design_update_component_service_modules.js';

//======================================================================================================================
//
// Server Code for Design Update Components.
//
// Methods called directly by Server API
//
//======================================================================================================================

class DesignUpdateComponentServices{

    // Add a new design update component to design update
    addNewComponent(designVersionId, designUpdateId, parentId, componentType, componentLevel, defaultName, defaultRawName, defaultRawText, isNew){

        if(Meteor.isServer) {
            // Get the parent reference id (if there is a parent)
            let parentRefId = 'NONE';
            let featureRefId = 'NONE';

            let parent = DesignUpdateComponents.findOne({_id: parentId});

            if (parent) {
                parentRefId = parent.componentReferenceId;

                // Get the Feature Reference ID.  This will be NONE for anything that is not under a Feature
                featureRefId = parent.componentFeatureReferenceIdNew;
            }

            // Get the design id - this is added to the components for easier access to data
            let designId = DesignVersions.findOne({_id: designVersionId}).designId;

            let newUpdateComponentId = DesignUpdateComponents.insert(
                {
                    componentReferenceId: 'TEMP',                 // Will update this after component created
                    designId: designId,
                    designVersionId: designVersionId,
                    designUpdateId: designUpdateId,
                    componentType: componentType,
                    componentLevel: componentLevel,
                    componentParentIdOld: parentId,
                    componentParentIdNew: parentId,               // Because this component may be moved later
                    componentParentReferenceIdOld: parentRefId,
                    componentParentReferenceIdNew: parentRefId,
                    componentFeatureReferenceIdOld: featureRefId,
                    componentFeatureReferenceIdNew: featureRefId,

                    // Data is all defaults to start with
                    componentNameOld: defaultName,
                    componentNameRawOld: defaultRawName,
                    componentNameNew: defaultName,
                    componentNameRawNew: defaultRawName,
                    componentTextRawOld: defaultRawText,
                    componentTextRawNew: defaultRawText,

                    // State is a new item
                    isNew: isNew,                   // New item added to design
                    isChanged: false,                  // For now - will go to true when name is edited
                    isTextChanged: false,                  // For now - will go to true when text is edited
                    isMoved: false,
                    isRemoved: false,

                    isInScope: DesignUpdateModules.isScopable(componentType),         // If scopable then this must be in scope...
                    isParentScope: false,
                    isScopable: DesignUpdateModules.isScopable(componentType)          // A Scopable item can be picked as part of a change
                }
            );

            if(newUpdateComponentId){

                // Update the component reference to be the _id.  Note that this is not silly because the CR ID will
                // always be the _id of the component that was created first.  So for components added in a design new edit
                // it will be the design component _id...
                DesignUpdateComponents.update(
                    {_id: newUpdateComponentId},
                    {$set: {componentReferenceId: newUpdateComponentId}}
                );

                // If a Feature also update the Feature Ref Id to the new ID + add the default narrative
                if (componentType === ComponentType.FEATURE) {
                    DesignUpdateComponents.update(
                        {_id: newUpdateComponentId},
                        {
                            $set: {
                                componentFeatureReferenceIdOld: newUpdateComponentId,
                                componentFeatureReferenceIdNew: newUpdateComponentId,
                                componentNarrativeOld: DefaultComponentNames.NEW_NARRATIVE_TEXT,
                                componentNarrativeNew: DefaultComponentNames.NEW_NARRATIVE_TEXT,
                                componentNarrativeRawOld: DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_NARRATIVE_TEXT),
                                componentNarrativeRawNew: DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_NARRATIVE_TEXT)
                            }
                        }
                    );

                    // Make sure Design is no longer removable now that a feature added
                    DesignServices.setRemovable(designId);

                    // And for Features add the default Feature Aspects
                    // TODO - that could be user configurable!
                    DesignUpdateComponentModules.addDefaultFeatureAspects(designVersionId, designUpdateId, newUpdateComponentId, '');
                }

                // When inserting a new design component its parent becomes non-removable
                if (parentId) {
                    DesignUpdateComponents.update(
                        {_id: parentId},
                        {
                            $set: {isRemovable: false}
                        }
                    );
                }

                // Set the starting index for a new component (at end of list)
                DesignUpdateComponentModules.setIndex(newUpdateComponentId, componentType, parentId);

                // Ensure that all parents of the component are now in ParentScope
                DesignUpdateComponentModules.updateParentScope(newUpdateComponentId, true);
            }
        }
    };

    importComponent(designId, designVersionId, designUpdateId, component){
        if(Meteor.isServer) {
            const designUpdateComponentId = DesignUpdateComponents.insert(
                {
                    // Identity
                    componentReferenceId: component.componentReferenceId,
                    designId: designId,                                           // Restored Design Id
                    designVersionId: designVersionId,                                    // Restored Design Version Id
                    designUpdateId: designUpdateId,                                     // Restored Design Update Id
                    componentType: component.componentType,
                    componentLevel: component.componentLevel,
                    componentParentIdOld: component.componentParentIdOld,                     // Will be wrong and corrected later
                    componentParentIdNew: component.componentParentIdNew,                     // Ditto
                    componentParentReferenceIdOld: component.componentParentReferenceIdOld,
                    componentParentReferenceIdNew: component.componentParentReferenceIdNew,
                    componentFeatureReferenceIdOld: component.componentFeatureReferenceIdOld,
                    componentFeatureReferenceIdNew: component.componentFeatureReferenceIdNew,
                    componentIndexOld: component.componentIndexOld,
                    componentIndexNew: component.componentIndexNew,

                    // Data
                    componentNameOld: component.componentNameOld,
                    componentNameNew: component.componentNameNew,
                    componentNameRawOld: component.componentNameRawOld,
                    componentNameRawNew: component.componentNameRawNew,
                    componentNarrativeOld: component.componentNarrativeOld,
                    componentNarrativeNew: component.componentNarrativeNew,
                    componentNarrativeRawOld: component.componentNarrativeRawOld,
                    componentNarrativeRawNew: component.componentNarrativeRawNew,
                    componentTextRawOld: component.componentTextRawOld,
                    componentTextRawNew: component.componentTextRawNew,

                    // Update State
                    isNew: component.isNew,
                    isChanged: component.isChanged,
                    isTextChanged: component.isTextChanged,
                    isMoved: component.isMoved,
                    isRemoved: component.isRemoved,

                    // Editing state (shared and persistent)
                    isRemovable: component.isRemovable,
                    isScopable: component.isScopable,
                    isInScope: component.isInScope,
                    isParentScope: component.isParentScope,
                    lockingUser: component.lockingUser
                }
            );

            return designUpdateComponentId;
        }
    };

    // Resets parent ids after an import of data
    importRestoreParent(designUpdateComponentId, componentMap){
        if(Meteor.isServer) {
            const designUpdateComponent = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

            const oldParentIdOld = designUpdateComponent.componentParentIdOld;
            const oldParentIdNew = designUpdateComponent.componentParentIdNew;

            // log(LogLevel.TRACE, "Restoring parent for DU component {} with previous old parent id {} and previous new parent id {}",
            //     designUpdateComponent.componentNameNew,
            //     oldParentIdOld,
            //     oldParentIdNew);

            let newParentIdOld = 'NONE';
            let newParentIdNew = 'NONE';

            if (oldParentIdOld != 'NONE') {
                newParentIdOld = getIdFromMap(componentMap, oldParentIdOld);
                log(LogLevel.TRACE, "New Parent Id Old is {}", newParentIdOld);
            }

            if (oldParentIdNew != 'NONE') {
                newParentIdNew = getIdFromMap(componentMap, oldParentIdNew);
                log(LogLevel.TRACE, "New Parent Id New is {}", newParentIdNew);
            }

            DesignUpdateComponents.update(
                {_id: designUpdateComponentId},
                {
                    $set: {
                        componentParentIdOld: newParentIdOld,
                        componentParentIdNew: newParentIdNew
                    }
                }
            );
        }
    }


    // Move a design update component to a new parent
    moveComponent(componentId, newParentId){

        if(Meteor.isServer) {
            const newParent = DesignUpdateComponents.findOne({_id: newParentId});
            const movingComponent = DesignUpdateComponents.findOne({_id: componentId});

            // Check for move back to old position
            const oldParentId = movingComponent.componentParentIdOld;

            // Not moved if the old parent is the same as the new one
            let isMoved = (oldParentId != newParentId);

            // If a Design Section, make sure the level gets changed correctly
            let newLevel = movingComponent.componentLevel;

            if (movingComponent.componentType === ComponentType.DESIGN_SECTION) {
                newLevel = newParent.componentLevel + 1;
            }

            let updatedComponents = DesignUpdateComponents.update(
                {_id: componentId},
                {
                    $set: {
                        componentParentIdNew: newParentId,
                        componentParentReferenceIdNew: newParent.componentReferenceId,
                        componentFeatureReferenceIdNew: newParent.componentFeatureReferenceIdNew,
                        componentLevel: newLevel,
                        isMoved: isMoved
                    }
                }
            );

            if(updatedComponents > 0){

                // Make sure new Parent is now not removable as it must have a child
                DesignUpdateComponents.update(
                    {_id: newParentId},
                    {
                        $set: {
                            isRemovable: false
                        }
                    }
                );

                // But the old parent may now be removable
                if (DesignUpdateComponentModules.hasNoChildren(oldParentId)) {
                    DesignUpdateComponents.update(
                        {_id: oldParentId},
                        {$set: {isRemovable: true}}
                    );
                }
            }
        }
    };

    // Move the component to a new position in its local list
    reorderComponent(componentId, targetComponentId){

        if(Meteor.isServer) {
            // The new position is always just above the target component

            const movingComponent = DesignUpdateComponents.findOne({_id: componentId});
            const targetComponent = DesignUpdateComponents.findOne({_id: targetComponentId});

            const peerComponents = DesignUpdateComponents.find(
                {
                    _id: {$ne: componentId},
                    componentType: movingComponent.componentType,
                    componentParentIdNew: movingComponent.componentParentIdNew
                },
                {sort: {componentIndexNew: -1}}
            );

            let indexBelow = targetComponent.componentIndexNew;
            //console.log("Index below = " + indexBelow);

            let indexAbove = 0;                                 // The default if nothing exists above
            const listMaxArrayIndex = peerComponents.count() - 1;
            //console.log("List max = " + listMaxArrayIndex);

            const peerArray = peerComponents.fetch();

            // Go through the list of peers (ordered from bottom to top)
            let i = 0;
            while (i <= listMaxArrayIndex) {
                if (peerArray[i].componentIndexNew === targetComponent.componentIndexNew) {
                    // OK, this is the target component so the next one in the list (if there is one) is the one that will be above the new position
                    if (i < listMaxArrayIndex) {
                        indexAbove = peerArray[i + 1].componentIndexNew;
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
                    $set: {
                        componentIndexNew: newIndex
                    }
                }
            );


            // Over time the indexing differences may get too small to work any more so periodically reset the indexes for this list.
            if (indexDiff < 0.001) {
                //console.log("Index reset!");

                // Get the components in current order
                const resetComponents = DesignUpdateComponents.find(
                    {
                        componentType: movingComponent.componentType,
                        componentParentIdNew: movingComponent.componentParentIdNew
                    },
                    {sort: {componentIndexNew: 1}}
                );

                let resetIndex = 100;

                // Reset them to 100, 200, 300 etc...
                resetComponents.forEach((component) => {
                    DesignUpdateComponents.update(
                        {_id: component._id},
                        {
                            $set: {
                                componentIndexNew: resetIndex
                            }
                        }
                    );

                    resetIndex = resetIndex + 100;
                })
            }

        }
    };



    // Store the scope state of a design update component
    toggleScope(designUpdateComponentId, newScope){

        if(Meteor.isServer) {
            let updatedComponents = DesignUpdateComponents.update(
                {_id: designUpdateComponentId},
                {
                    $set: {
                        isInScope: newScope
                    }
                }
            );

            if(updatedComponents > 0){
                // If setting in scope. make sure all parents have parent scope
                // If setting out of scope, remove parent scope from any parents that do not have in scope children
                DesignUpdateComponentModules.updateParentScope(designUpdateComponentId, newScope);
            }
        }
    }




    // Save text for a design update component
    updateComponentName(designUpdateComponentId, componentNewName, componentNewNameRaw){

        if(Meteor.isServer) {
            // Item only counts as logically changed if the new name is still different to that in the existing design version.
            // So it becomes not changed if reverted back to the original name after a change...

            let componentOldName = DesignUpdateComponents.findOne({_id: designUpdateComponentId}).componentNameOld;

            let changed = (componentNewName != componentOldName);

            // Update the new names for the update
            DesignUpdateComponents.update(
                {_id: designUpdateComponentId},
                {
                    $set: {
                        componentNameNew: componentNewName,
                        componentNameRawNew: componentNewNameRaw,
                        isChanged: changed
                    }
                }
            );
        }
    };


    // Save the narrative for a feature component
    updateFeatureNarrative(featureId, newNarrative, newRawNarrative){

        if(Meteor.isServer) {
            let componentOldNarrative = DesignUpdateComponents.findOne({_id: featureId}).componentNarrativeOld;

            //console.log("old narrative: " + componentOldNarrative + " New narrative: " + newNarrative);

            let changed = (newNarrative != componentOldNarrative);

            DesignUpdateComponents.update(
                {_id: featureId},
                {
                    $set: {
                        componentNarrativeNew: newNarrative,
                        componentNarrativeRawNew: newRawNarrative,
                        isChanged: changed
                    }
                }
            );
        }
    };


    removeComponent(designUpdateComponentId, parentId){

        if(Meteor.isServer) {
            // For a design update this is a logical delete it it was an existing item
            // If however it was new in the update, remove it completely

            let designUpdateComponent = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

            if (designUpdateComponent.isNew) {
                // Actually delete it
                let removedComponents = DesignUpdateComponents.remove(
                    {_id: designUpdateComponentId}
                );

                if(removedComponents > 0){

                    // When removing a design component its parent may become removable
                    if (DesignUpdateComponentModules.hasNoChildren(parentId)) {
                        DesignUpdateComponents.update(
                            {_id: parentId},
                            {$set: {isRemovable: true}}
                        )
                    }

                    // If this happened to be the last Feature, Design is now removable
                    if (designUpdateComponent.componentType === ComponentType.FEATURE) {
                        DesignServices.setRemovable(designUpdateComponent.designId);
                    }
                }


            } else {
                // Logically delete it
                let deletedComponents = DesignUpdateComponents.update(
                    {_id: designUpdateComponentId},
                    {
                        $set: {
                            isRemoved: true
                            // Keep isRemovable as is so that restore can work
                        }
                    }
                );

                if(deletedComponents > 0){

                    // When removing a design component its parent may become removable
                    if (DesignUpdateComponentModules.hasNoChildren(parentId)) {
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
        }
    };

    restoreComponent(designUpdateComponentId, parentId){

        if(Meteor.isServer) {
            // Undo a logical delete
            let restoredComponents = DesignUpdateComponents.update(
                {_id: designUpdateComponentId, isRemoved: true},
                {
                    $set: {
                        isRemoved: false,
                        isRemovable: true   // It can't have any children or it would not have been deletable
                    }
                }
            );

            if(restoredComponents > 0){

                // When restoring a design component its parent (if there is one) will become non-removable
                if (parentId != 'NONE') {
                    DesignUpdateComponents.update(
                        {_id: parentId},
                        {$set: {isRemovable: false}}
                    )
                }
            }
        }
    }


}

export default new DesignUpdateComponentServices();