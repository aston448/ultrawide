
import { DesignVersions } from '../collections/design/design_versions.js';
import { DesignUpdates } from '../collections/design_update/design_updates.js';
import { DesignUpdateComponents } from '../collections/design_update/design_update_components.js';
import { DesignComponents } from '../collections/design/design_components.js';

import DesignUpdateComponentServices from './design_update_component_services.js';

import { DesignUpdateStatus, DesignUpdateMergeAction, ComponentType } from '../constants/constants.js';

class DesignUpdateServices{

    // Add a new design update
    addNewDesignUpdate(designVersionId, populateUpdate){

        // First Add a new Update record
        const designUpdateId = DesignUpdates.insert(
            {
                designVersionId:            designVersionId,                                // The design version this is a change to
                updateName:                 'New Design Update',                            // Identifier of this update - e.g. CR123
                updateVersion:              '0.1',                                          // Update version number if required
                updateStatus:               DesignUpdateStatus.UPDATE_NEW
            },

            (error, result) => {
                if(error){
                    // Error handler
                    console.log("Insert Design Update - Error: " + error);
                } else {
                    console.log("Insert Design Update - Success: " + result);

                    if(populateUpdate) {
                        this.populateDesignUpdate(designVersionId, result);
                    }

                }
            }
        );

        return designUpdateId;
    };

    // Copy the current base design version to a new update.  Initially the "new" values are the same as the current ones.
    populateDesignUpdate(designVersionId, designUpdateId){

        // Here we want to copy the design version components to this update
        let versionComponents = DesignComponents.find({designVersionId: designVersionId});
        let componentsToUpdate = versionComponents.count();
        let componentsUpdated = 0;
        let designId = DesignVersions.findOne({_id: designVersionId}).designId;

        console.log("Inserting " + versionComponents.count() + " into Design Update Components");

        versionComponents.forEach((component) => {

            DesignUpdateComponents.insert(
                {
                    componentReferenceId:           component.componentReferenceId,                     // Keeps the same reference from original design
                    designId:                       designId,                                           // Denormalised for easy access
                    designVersionId:                designVersionId,                                    // The design version this is a change to
                    designUpdateId:                 designUpdateId,                                     // This update
                    componentType:                  component.componentType,
                    componentLevel:                 component.componentLevel,
                    componentIndexOld:              component.componentIndex,
                    componentIndexNew:              component.componentIndex,
                    componentParentIdOld:           component.componentParentId,                        // Parent IDs will be wrong and are fixed afterwards
                    componentParentIdNew:           component.componentParentId,
                    componentParentReferenceIdOld:  component.componentParentReferenceId,
                    componentParentReferenceIdNew:  component.componentParentReferenceId,
                    componentFeatureReferenceIdOld: component.componentFeatureReferenceId,
                    componentFeatureReferenceIdNew: component.componentFeatureReferenceId,

                    componentNameOld:               component.componentName,
                    componentNameNew:               component.componentName,
                    componentNameRawOld:            component.componentNameRaw,
                    componentNameRawNew:            component.componentNameRaw,
                    componentNarrativeRawOld:       component.componentNarrativeRaw,
                    componentNarrativeRawNew:       component.componentNarrativeRaw,
                    componentTextRawOld:            component.componentTextRaw,
                    componentTextRawNew:            component.componentTextRaw,

                    isNew:                          false,
                    isChanged:                      false,
                    isTextChanged:                  false,
                    isMoved:                        false,
                    isRemoved:                      false,

                    isInScope:                      false,
                    isParentScope:                  false,
                    isScopable:                     this.isScopable(component.componentType)             // A Scopable item can be picked as part of a change
                },
                (error, result) => {
                    if(error){
                        // Error handler
                        console.log("Insert Design Update - Error: " + error);
                    } else {
                        componentsUpdated++;

                        if(componentsUpdated == componentsToUpdate){
                            console.log("Insert Design Update - complete: " + componentsUpdated);

                            // Now update the parent ids as necessary to match the new PKs (_ids) on this data
                            this.fixParentIds(designVersionId, designUpdateId);

                            // Set only items with no children as removable
                            this.setRemovable(designVersionId, designUpdateId);
                        }
                    }
                }
            );
        }


        );

    };


    // Change the old design parent ids to the ids for the new design update
    fixParentIds(designVersionId, designUpdateId){
        console.log("Insert Design Update Components - Callback: ");

        //The correct parent id for the update will be the id of the component that has the reference id relating to the parent reference id
        let updateComponents = DesignUpdateComponents.find({designVersionId: designVersionId, designUpdateId: designUpdateId});

        updateComponents.forEach((component) => {

            // Get the id of the new component IN THIS DESIGN UPDATE that has the parent reference id as its unchanging reference id
            let parent = DesignUpdateComponents.findOne(
                {
                    designVersionId: designVersionId,
                    designUpdateId: designUpdateId,
                    componentReferenceId: component.componentParentReferenceIdNew
                }
            );

            let parentId = 'NONE';
            if(parent){
                parentId = parent._id;
            }

            DesignUpdateComponents.update(
                { _id: component._id},
                {
                    $set:{
                        componentParentIdOld: parentId,
                        componentParentIdNew: parentId
                    }
                }
            );

        });
    };


    // Set any component that has a child as non-removable
    setRemovable(designVersionId, designUpdateId){

        let updateComponents = DesignUpdateComponents.find({designVersionId: designVersionId, designUpdateId: designUpdateId});

        updateComponents.forEach((component) => {

            // Get the id of the new component that has the parent reference id as its unchanging reference id
            let removable = DesignUpdateComponentServices.hasNoChildren(component._id);

            DesignUpdateComponents.update(
                { _id: component._id},
                {
                    $set:{
                        isRemovable: removable
                    }
                }
            );

        });
    };

    // This function defines which item types are scopable - i.e. we can base changes on them
    isScopable(itemType){

        switch(itemType){
            case ComponentType.FEATURE:
            case ComponentType.FEATURE_ASPECT:
            case ComponentType.SCENARIO:
                return true;
                break;
            default:
                return false;
                break;
        }
    };

    publishUpdate(designUpdateId){

        DesignUpdates.update(
            {_id: designUpdateId},
            {
                $set: {
                    updateStatus: DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction: DesignUpdateMergeAction.MERGE_INCLUDE    // By default include this update for the next DV
                }
            }
        );
    };

    updateDesignUpdateName(designUpdateId, newName){

        DesignUpdates.update(
            {_id: designUpdateId},
            {
                $set: {
                    updateName: newName
                }
            }
        );

    };

    updateDesignUpdateVersion(designUpdateId, newVersion){

        DesignUpdates.update(
            {_id: designUpdateId},
            {
                $set: {
                    updateVersion: newVersion
                }
            }
        );

    };

    removeUpdate(designUpdateId){

        // Delete all components in the design update
        DesignUpdateComponents.remove(
            {designUpdateId: designUpdateId},
            (error, result) => {
                if(error){
                    console.log("Error deleting DU components " + error);
                } else {
                    // OK so delete the update itself
                    DesignUpdates.remove({_id: designUpdateId});
                }
            }
        );
    };
}

export default new DesignUpdateServices();