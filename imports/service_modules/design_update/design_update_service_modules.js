
// Ultrawide Services
import { ComponentType, DesignUpdateMergeAction, LogLevel } from '../../constants/constants.js';

import DesignVersionModules         from '../../service_modules/design/design_version_service_modules.js';

// Data Access
import DesignUpdateData             from '../../data/design_update/design_update_db.js';
import DesignUpdateComponentData    from '../../data/design_update/design_update_component_db.js';
//======================================================================================================================
//
// Server Modules for Design Update Items.
//
// Methods called from within main API methods
//
//======================================================================================================================

class DesignUpdateModules{

    // // Copy the current base design version to a new update.  Initially the "new" values are the same as the current ones.
    // populateDesignUpdate(baseDesignVersionId, designVersionId, designUpdateId){
    //
    //     // Here we want to copy the BASE, not the CURRENT design version components to this update.  This means that parallel updates
    //     // are NOT included so all updates start from the same base. This is a good thing as otherwise updates get mingled as they are created.
    //     // Validation is in place to prevent contradictory changes.
    //
    //     let versionComponents = DesignVersionComponents.find({designVersionId: baseDesignVersionId});
    //     let designId = DesignVersions.findOne({_id: baseDesignVersionId}).designId;
    //
    //     versionComponents.forEach((component) => {
    //
    //         // Updates are not mingled BUT where a component has been removed in another update we will mark it as removed
    //         // (though not actually set it as removed in this update) so that it is clear as to why this component is not accessible to further updates
    //         const isRemovedElsewhere = this.componentIsRemovedInOtherUpdate(component, designVersionId);
    //
    //         DesignUpdateComponents.insert(
    //             {
    //                 componentReferenceId:           component.componentReferenceId,                     // Keeps the same reference from original design
    //                 designId:                       designId,                                           // Denormalised for easy access
    //                 designVersionId:                designVersionId,                                    // The design version this is a change to
    //                 designUpdateId:                 designUpdateId,                                     // This update
    //                 componentType:                  component.componentType,
    //                 componentLevel:                 component.componentLevel,
    //                 componentIndexOld:              component.componentIndexNew,
    //                 componentIndexNew:              component.componentIndexNew,
    //                 componentParentIdOld:           component.componentParentIdNew,                        // Parent IDs will be wrong and are fixed afterwards
    //                 componentParentIdNew:           component.componentParentIdNew,
    //                 componentParentReferenceIdOld:  component.componentParentReferenceIdNew,
    //                 componentParentReferenceIdNew:  component.componentParentReferenceIdNew,
    //                 componentFeatureReferenceIdOld: component.componentFeatureReferenceIdNew,
    //                 componentFeatureReferenceIdNew: component.componentFeatureReferenceIdNew,
    //
    //                 componentNameOld:               component.componentNameNew,
    //                 componentNameNew:               component.componentNameNew,
    //                 componentNameRawOld:            component.componentNameRawNew,
    //                 componentNameRawNew:            component.componentNameRawNew,
    //                 componentNarrativeOld:          component.componentNarrativeNew,
    //                 componentNarrativeNew:          component.componentNarrativeNew,
    //                 componentNarrativeRawOld:       component.componentNarrativeRawNew,
    //                 componentNarrativeRawNew:       component.componentNarrativeRawNew,
    //                 componentTextRawOld:            component.componentTextRawNew,
    //                 componentTextRawNew:            component.componentTextRawNew,
    //
    //                 isNew:                          false,
    //                 isChanged:                      false,
    //                 isTextChanged:                  false,
    //                 isMoved:                        false,
    //                 isRemoved:                      false,
    //                 isRemovedElsewhere:             isRemovedElsewhere,
    //
    //                 isInScope:                      false,
    //                 isParentScope:                  false,
    //                 isScopable:                     this.isScopable(component.componentType)             // A Scopable item can be picked as part of a change
    //             }
    //         );
    //     });
    //
    //     // Now update the parent ids as necessary to match the new PKs (_ids) on this data
    //     this.fixParentIds(designVersionId, designUpdateId);
    //
    //     // NOTE: All items populated here remain REMOVABLE as they are logically deleted when removed and we allow bulk deletes
    //
    // };


    // Change the old design parent ids to the ids for the new design update
    // fixParentIds(designVersionId, designUpdateId){
    //     //console.log("Insert Design Update Components - Callback: ");
    //
    //     //The correct parent id for the update will be the id of the component that has the reference id relating to the parent reference id
    //     let updateComponents = DesignUpdateComponents.find({designVersionId: designVersionId, designUpdateId: designUpdateId});
    //
    //     updateComponents.forEach((component) => {
    //
    //         // Get the id of the new component IN THIS DESIGN UPDATE that has the parent reference id as its unchanging reference id
    //         let parent = DesignUpdateComponents.findOne(
    //             {
    //                 designVersionId: designVersionId,
    //                 designUpdateId: designUpdateId,
    //                 componentReferenceId: component.componentParentReferenceIdNew
    //             }
    //         );
    //
    //         let parentId = 'NONE';
    //         if(parent){
    //             parentId = parent._id;
    //         }
    //
    //         DesignUpdateComponents.update(
    //             { _id: component._id},
    //             {
    //                 $set:{
    //                     componentParentIdOld: parentId,
    //                     componentParentIdNew: parentId
    //                 }
    //             }
    //         );
    //     });
    // };

    componentIsRemovedInOtherUpdate(component, currentDesignVersionId){

        // Is there a parallel update where the same component is removed
        return DesignUpdateComponentData.hasOtherRemovedInstancesInDesignVersion(currentDesignVersionId, component.designUpdateId, component.componentReferenceId);
    };

    removeMergedUpdateFromDesignVersion(designUpdateId){

        const update = DesignUpdateData.getDesignUpdateById(designUpdateId);

        if(update.updateMergeAction === DesignUpdateMergeAction.MERGE_INCLUDE){

            DesignVersionModules.unmergeDesignUpdate(designUpdateId);
        }
    };

    addUpdateToDesignVersion(designUpdateId){

        const update = DesignUpdateData.getDesignUpdateById(designUpdateId);

        if(update.updateMergeAction === DesignUpdateMergeAction.MERGE_INCLUDE){

            DesignVersionModules.mergeDesignUpdate(designUpdateId);
        }
    };


    // // Set any component that has a child as non-removable
    // setRemovable(designVersionId, designUpdateId){
    //
    //     let updateComponents = DesignUpdateComponents.find({designVersionId: designVersionId, designUpdateId: designUpdateId});
    //
    //     updateComponents.forEach((component) => {
    //
    //         // Get the id of the new component that has the parent reference id as its unchanging reference id
    //         let removable = DesignUpdateComponentModules.hasNoChildren(component._id);
    //
    //         DesignUpdateComponents.update(
    //             { _id: component._id},
    //             {
    //                 $set:{
    //                     isRemovable: removable
    //                 }
    //             }
    //         );
    //
    //     });
    // };

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

}

export default new DesignUpdateModules();
