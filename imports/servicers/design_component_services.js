/**
 * Created by aston on 14/08/2016.
 */

import { DesignVersions } from '../collections/design/design_versions.js';
import { DesignComponents } from '../collections/design/design_components.js';

import { ComponentType, LogLevel } from '../constants/constants.js';

import  DesignServices     from './design_services.js';

import {getIdFromMap, log} from '../common/utils.js';

class DesignComponentServices{

    // Add a new design component
    addNewComponent(designVersionId, parentId, componentType, componentLevel, defaultName, defaultRawName, defaultRawText, defaultRawNarrative){

        // Get the parent reference id (if there is a parent)
        let parentRefId = 'NONE';
        let featureRefId = 'NONE';

        let parent = DesignComponents.findOne({_id: parentId});

        if(parent){
            parentRefId = parent.componentReferenceId;

            // Get the Feature Reference ID.  This will be NONE for anything that is not under a Feature
            featureRefId = parent.componentFeatureReferenceId;


        }

        // Get the design id - this is added to the components for easier access to data
        let designId = DesignVersions.findOne({_id: designVersionId}).designId;

        DesignComponents.insert(
            {
                componentReferenceId:           'TEMP',             // Will update this after component created
                designId:                       designId,
                designVersionId:                designVersionId,
                componentType:                  componentType,
                componentLevel:                 componentLevel,
                componentName:                  defaultName,
                componentNameRaw:               defaultRawName,
                componentParentId:              parentId,
                componentParentReferenceId:     parentRefId,
                componentFeatureReferenceId:    featureRefId,
                componentTextRaw:               defaultRawText,
                componentNarrativeRaw:          defaultRawNarrative
            },

            (error, result) => {
                if(error){
                    // Error handler
                    console.log("Insert Design Component - Error: " + error);
                } else {
                    console.log("Insert Design Component - Success: " + result);

                    // Update the component reference to be the _id.  Note that this is not silly because the CR ID will
                    // always be the _id of the component that was created first.  So for components added in a design update
                    // it will be the design update component _id...
                    DesignComponents.update(
                        {_id: result},
                        { $set: {componentReferenceId: result}}
                    );

                    // If a Feature also update the Feature Ref Id to the new ID
                    if(componentType === ComponentType.FEATURE){
                        DesignComponents.update(
                            {_id: result},
                            { $set: {componentFeatureReferenceId: result}}
                        );

                        // Make sure Design is no longer removable now that a feature added
                        DesignServices.setRemovable(designId);
                    }

                    // When inserting a new design component its parent becomes non-removable
                    if(parentId) {
                        DesignComponents.update(
                            {_id: parentId},
                            {$set: {isRemovable: false}}
                        );
                    }

                    // Set the default index for a new component
                    this.setIndex(result, componentType, parentId);


                }
            }
        );

    };

    // Called when restoring data after a reset
    importComponent(designId, designVersionId, component){

        // Fix missing feature refs
        let componentFeatureReferenceId = component.componentFeatureReferenceId;
        if (component.componentType === ComponentType.FEATURE && componentFeatureReferenceId === 'NONE'){
            componentFeatureReferenceId = component.componentReferenceId;
        }

        const designComponentId = DesignComponents.insert(
            {
                // Identity
                componentReferenceId:       component.componentReferenceId,
                designId:                   designId,                               // Will be a new id for the restored data
                designVersionId:            designVersionId,                        // Ditto
                componentType:              component.componentType,
                componentLevel:             component.componentLevel,
                componentParentId:          component.componentParentId,            // This will be wrong and fixed by restore process
                componentParentReferenceId: component.componentParentReferenceId,
                componentFeatureReferenceId:componentFeatureReferenceId,
                componentIndex:             component.componentIndex,

                // Data
                componentName:              component.componentName,
                componentNameRaw:           component.componentNameRaw,
                componentNarrative:         component.componentNarrative,
                componentNarrativeRaw:      component.componentNarrativeRaw,
                componentTextRaw:           component.componentTextRaw,

                // State (shared and persistent only)
                isRemovable:                component.isRemovable,
                isRemoved:                  component.isRemoved,
                isNew:                      component.isNew,
                lockingUser:                component.lockingUser,
                designUpdateId:             component.designUpdateId
            }
        );

        return designComponentId;

    };

    // Resets parent ids after an import of data
    importRestoreParent(designComponentId, componentMap){

        const designComponent = DesignComponents.findOne({_id: designComponentId});

        const oldParentId = designComponent.componentParentId;
        let newParentId = 'NONE';

        if(oldParentId != 'NONE'){
            newParentId = getIdFromMap(componentMap, oldParentId);
        }

        DesignComponents.update(
            {_id: designComponentId},
            {
                $set:{
                    componentParentId: newParentId
                }
            }
        )


    }

    moveComponent(designComponentId, newParentId){

        // Get the unique persistent reference for the parent
        const parent = DesignComponents.findOne({_id: newParentId});
        const oldParentId =  DesignComponents.findOne({_id: designComponentId}).componentParentId;

        DesignComponents.update(
            {_id: designComponentId},
            {
                $set:{
                    componentParentId:              newParentId,
                    componentParentReferenceId:     parent.componentReferenceId,
                    componentFeatureReferenceId:    parent.componentFeatureReferenceId
                }
            },

            (error, result) => {
                if(error) {
                    // Error handler
                    console.log("Error: " + error);
                } else {
                    console.log("Success: " + result);

                    // Make sure new Parent is now not removable as it must have a child
                    DesignComponents.update(
                        {_id: newParentId},
                        {
                            $set:{
                                isRemovable: false
                            }
                        }
                    );

                    // But the old parent may now be removable
                    if (this.hasNoChildren(oldParentId)){
                        DesignComponents.update(
                            {_id: oldParentId},
                            { $set: {isRemovable: true}}
                        );
                    }


                }
            }
        );


    }

    // Set any other components to no longer new
    setComponentsOld(designComponentId){
        DesignComponents.update(
            {
                _id:     {$ne: designComponentId},
                isNew:   true
            },
            {
                $set:{
                    isNew: false
                }
            },
            {multi: true},

            (error, result) => {
                if(error){
                    // Error handler
                    console.log("Error: " + error);
                } else {
                    console.log("Success: " + result);
                }
            }
        );
    }


    // Save text for a design component
    saveDesignComponentName(designComponentId, componentName, componentNameRaw){

        // No actual update or changes needed if no change to name
        let componentNameOld = DesignComponents.findOne({_id: designComponentId}).componentName;

        if(componentName === componentNameOld){
            return true;
        }

        DesignComponents.update(
            {_id: designComponentId},
            {
                $set:{
                    componentName:      componentName,
                    componentNameRaw:   componentNameRaw,
                    isNew:              false
                }
            },

            (error, result) => {
                if(error) {
                    // Error handler
                    console.log("Save Design Component Name Error: " + error);
                    return false;
                } else {
                    console.log("Save Design Component Name Success: " + result);
                    return true;
                }
            }
        );
    };


    // Save the narrative for a feature component
    saveNarrative(featureId, rawText, plainText){
        DesignComponents.update(
            {_id: featureId},
            {
                $set:{
                    componentNarrative:     plainText,
                    componentNarrativeRaw:  rawText,
                    isNew:                  false
                }
            },

            (error, result) => {
                if(error) {
                    // Error handler
                    console.log("Error: " + error);
                } else {
                    console.log("Success: " + result);
                }
            }
        );
    };

    deleteComponent(designComponentId, parentId){
        // Deletes from the base design in initial edit mode are real deletes
        const designComponent = DesignComponents.findOne({_id: designComponentId});

        DesignComponents.remove(
            {_id: designComponentId},
            (error, result) => {
                if(error) {
                    // Error handler
                    console.log("Error: " + error);
                } else {
                    console.log("Success: " + result);

                    // When removing a design component its parent may become removable
                    if (this.hasNoChildren(parentId)){
                        DesignComponents.update(
                            {_id: parentId},
                            { $set: {isRemovable: true}}
                        )
                    }
                }
            }

        );

        // If this happened to be the last Feature, Design is now removable
        if(designComponent.componentType === ComponentType.FEATURE) {
            DesignServices.setRemovable(designComponent.designId);
        }

    };

    hasNoChildren(designComponentId){
        return DesignComponents.find({componentParentId: designComponentId}).count() === 0;
    };

    setIndex(componentId, componentType, parentId){

        // Get the max index of OTHER components of this type under the same parent
        const peerComponents = DesignComponents.find({_id: {$ne: componentId}, componentType: componentType, componentParentId: parentId}, {sort:{componentIndex: -1}});

        // If no components then leave as default of 100
        if(peerComponents.count() > 0){
            console.log("Highest peer is " + peerComponents.fetch()[0].componentName);

            let newIndex = peerComponents.fetch()[0].componentIndex + 100;

            DesignComponents.update(
                {_id: componentId},
                {
                    $set:{
                        componentIndex: newIndex
                    }
                }
            );
        }
    }

    // Move the component to a new position in its local list
    reorderComponent(componentId, targetComponentId){
        // The new position is always just above the target component

        const movingComponent = DesignComponents.findOne({_id: componentId});
        const targetComponent = DesignComponents.findOne({_id: targetComponentId});

        const peerComponents = DesignComponents.find(
            {
                _id: {$ne: componentId},
                componentType: movingComponent.componentType,
                componentParentId: movingComponent.componentParentId
            },
            {sort:{componentIndex: -1}}
        );

        let indexBelow = targetComponent.componentIndex;
        log((msg) => console.log(msg), LogLevel.TRACE, "Index below = {}", indexBelow);

        let indexAbove = 0;                                 // The default if nothing exists above
        const listMaxArrayIndex = peerComponents.count() -1;
        log((msg) => console.log(msg), LogLevel.TRACE, "List max = {}", listMaxArrayIndex);

        const peerArray = peerComponents.fetch();

        // Go through the list of peers (ordered from bottom to top)
        let i = 0;
        while (i <= listMaxArrayIndex){
            if(peerArray[i].componentIndex === targetComponent.componentIndex){
                // OK, this is the target component so the next one in the list (if there is one) is the one that will be above the new position
                if(i < listMaxArrayIndex){
                    indexAbove = peerArray[i+1].componentIndex;
                }
                break;
            }
            i++;
        }

        log((msg) => console.log(msg), LogLevel.TRACE, "Index above = {}", indexAbove);

        // The new index is half way between the above an below index - sort of Dewey Decimal system to avoid having to reindex everything every time
        const indexDiff = indexBelow - indexAbove;
        const newIndex = (indexBelow + indexAbove) / 2;

        log((msg) => console.log(msg), LogLevel.TRACE, "Setting new index for {} to {}", movingComponent.componentName , newIndex);

        DesignComponents.update(
            {_id: componentId},
            {
                $set:{
                    componentIndex: newIndex
                }
            }
        );


        // Over time the indexing differences may get too small to work any more so periodically reset the indexes for this list.
        if(indexDiff < 0.001){
            log((msg) => console.log(msg), LogLevel.TRACE, "Index reset!");

            // Get the components in current order
            const resetComponents = DesignComponents.find(
                {
                    componentType: movingComponent.componentType,
                    componentParentId: movingComponent.componentParentId
                },
                {sort:{componentIndex: 1}}
            );

            let resetIndex = 100;

            // Reset them to 100, 200, 300 etc...
            resetComponents.forEach((component) => {
                DesignComponents.update(
                    {_id: component._id},
                    {
                        $set:{
                            componentIndex: resetIndex
                        }
                    }
                );

                resetIndex = resetIndex + 100;
            })
        }


    }
}

export default new DesignComponentServices();