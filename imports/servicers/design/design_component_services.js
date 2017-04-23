
// Ultrawide Collections
import { DesignVersions }           from '../../collections/design/design_versions.js';
import { DesignVersionComponents }         from '../../collections/design/design_version_components.js';
import { WorkPackages }             from '../../collections/work/work_packages.js';
import { WorkPackageComponents }    from '../../collections/work/work_package_components.js';

// Ultrawide Services
import { ComponentType, ViewType, LogLevel } from '../../constants/constants.js';
import { DefaultComponentNames } from '../../constants/default_names.js';
import { getIdFromMap, log } from '../../common/utils.js';

import DesignServices           from './design_services.js';
import DesignComponentModules   from '../../service_modules/design/design_component_service_modules.js';

//======================================================================================================================
//
// Server Code for Design Components.
//
// Methods called directly by Server API
//
//======================================================================================================================

class DesignComponentServices{

    // Add a new design component
    addNewComponent(designVersionId, parentId, componentType, componentLevel, defaultName, defaultRawName, defaultRawText, isNew, view, workPackageId='NONE'){

        if(Meteor.isServer){
            // Get the parent reference id (if there is a parent)
            let parentRefId = 'NONE';
            let featureRefId = 'NONE';

            let parent = DesignVersionComponents.findOne({_id: parentId});

            if(parent){
                parentRefId = parent.componentReferenceId;

                // Get the Feature Reference ID.  This will be NONE for anything that is not under a Feature
                featureRefId = parent.componentFeatureReferenceIdNew;

            }

            // If adding from a Work Package set as dev added
            let devAdded = (view === ViewType.DEVELOP_BASE_WP || view === ViewType.DEVELOP_UPDATE_WP);

            // Get the design id - this is added to the components for easier access to data
            let designId = DesignVersions.findOne({_id: designVersionId}).designId;

            let designComponentId = DesignVersionComponents.insert(
                {
                    componentReferenceId:               'TEMP',             // Will update this after component created
                    designId:                           designId,
                    designVersionId:                    designVersionId,
                    componentType:                      componentType,
                    componentLevel:                     componentLevel,

                    componentParentIdOld:               parentId,
                    componentParentIdNew:               parentId,
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
                    isDevAdded:                         devAdded
                },

            );

            if(designComponentId){
                // Update the component reference to be the _id.  Note that this is not silly because the CR ID will
                // always be the _id of the component that was created first.  So for components added in a design update
                // it will be the design update component _id...
                DesignVersionComponents.update(
                    {_id: designComponentId},
                    { $set: {componentReferenceId: designComponentId}}
                );

                // Set the default index for a new component
                DesignComponentModules.setIndex(designComponentId, componentType, parentId);

                // If a Feature also update the Feature Ref Id to the new ID and set a default narrative
                if(componentType === ComponentType.FEATURE){
                    DesignVersionComponents.update(
                        {_id: designComponentId},
                        { $set:
                            {
                                componentFeatureReferenceIdOld: designComponentId,
                                componentFeatureReferenceIdNew: designComponentId,
                                componentNarrativeOld: DefaultComponentNames.NEW_NARRATIVE_TEXT,
                                componentNarrativeNew: DefaultComponentNames.NEW_NARRATIVE_TEXT,
                                componentNarrativeRawOld: DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_NARRATIVE_TEXT),
                                componentNarrativeRawNew: DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_NARRATIVE_TEXT)
                            }
                        }
                    );

                    // Make sure Design is no longer removable now that a feature added
                    DesignServices.setRemovable(designId);

                    // Update the WP before adding the Feature Aspects
                    DesignComponentModules.updateWorkPackagesWithNewItem(designVersionId, designComponentId);

                    // And for Features add the default Feature Aspects
                    // TODO - that could be user configurable!
                    DesignComponentModules.addDefaultFeatureAspects(designVersionId, designComponentId, defaultRawText, view);
                } else {
                    // Check for any WPs in this design version and add the components to them too
                    DesignComponentModules.updateWorkPackagesWithNewItem(designVersionId, designComponentId)
                }

                // When inserting a new design component its parent becomes non-removable
                if(parentId) {
                    DesignVersionComponents.update(
                        {_id: parentId},
                        {$set: {isRemovable: false}}
                    );
                }
            }

            return designComponentId;
        }

    };

    // Called when restoring data after a reset
    importComponent(designId, designVersionId, workPackageId, component){

        if(Meteor.isServer) {


            const designComponentId = DesignVersionComponents.insert(
                {
                    // Identity
                    componentReferenceId: component.componentReferenceId,
                    designId: designId,                               // Will be a new id for the restored data
                    designVersionId: designVersionId,                        // Ditto
                    componentType: component.componentType,
                    componentLevel: component.componentLevel,

                    componentParentIdOld: component.componentParentIdOld,
                    componentParentIdNew: component.componentParentIdNew,            // This will be wrong and fixed by restore process
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

            return designComponentId;
        }
    };

    // Resets parent ids after an import of data
    importRestoreParent(designComponentId, componentMap){

        if(Meteor.isServer) {
            const designComponent = DesignVersionComponents.findOne({_id: designComponentId});

            const oldOldParentId = designComponent.componentParentIdOld;
            const oldNewParentId = designComponent.componentParentIdNew;

            let newOldParentId = 'NONE';
            let newNewParentId = 'NONE';

            if (oldOldParentId !== 'NONE') {
                newOldParentId = getIdFromMap(componentMap, oldOldParentId);
            }

            if (oldNewParentId !== 'NONE') {
                newNewParentId = getIdFromMap(componentMap, oldNewParentId);
            }

            DesignVersionComponents.update(
                {_id: designComponentId},
                {
                    $set: {
                        componentParentIdOld: newOldParentId,
                        componentParentIdNew: newNewParentId
                    }
                }
            );
        }
    };

    moveDesignComponent(designComponentId, newParentId){

        if(Meteor.isServer) {

            // Get the unique persistent reference for the parent
            const newParent = DesignVersionComponents.findOne({_id: newParentId});
            const movingComponent = DesignVersionComponents.findOne({_id: designComponentId});
            const oldParentId = movingComponent.componentParentIdNew;
            const oldParentReferenceId = movingComponent.componentParentReferenceIdNew;
            const oldFeatureReferenceId = movingComponent.componentFeatureReferenceIdNew;

            // If a Design Section, make sure the level gets changed correctly
            let newLevel = movingComponent.componentLevel;

            if (movingComponent.componentType === ComponentType.DESIGN_SECTION) {
                newLevel = newParent.componentLevel + 1;
            }

            let updated = 0;

            if(movingComponent.componentType === ComponentType.FEATURE){

                // The Feature Reference does not change


                updated = DesignVersionComponents.update(
                    {_id: designComponentId},
                    {
                        $set: {
                            componentParentIdOld: oldParentId,
                            componentParentIdNew: newParentId,
                            componentParentReferenceIdOld: oldParentReferenceId,
                            componentParentReferenceIdNew: newParent.componentReferenceId,
                            componentLevel: newLevel
                        }
                    }
                );
            } else {
                // The Feature Reference is the feature reference of the new parent.  A Feature has its own reference as the Feature Reference
                updated = DesignVersionComponents.update(
                    {_id: designComponentId},
                    {
                        $set: {
                            componentParentIdOld: oldParentId,
                            componentParentIdNew: newParentId,
                            componentParentReferenceIdOld: oldParentReferenceId,
                            componentParentReferenceIdNew: newParent.componentReferenceId,
                            componentFeatureReferenceIdOld: oldFeatureReferenceId,
                            componentFeatureReferenceIdNew: newParent.componentFeatureReferenceIdNew,
                            componentLevel: newLevel
                        }
                    }
                );
            }

            if(updated > 0){
                // Make sure new Parent is now not removable as it must have a child
                DesignVersionComponents.update(
                    {_id: newParentId},
                    {
                        $set: {
                            isRemovable: false
                        }
                    }
                );

                // But the old parent may now be removable
                if (DesignComponentModules.hasNoChildren(oldParentId)) {
                    DesignVersionComponents.update(
                        {_id: oldParentId},
                        {$set: {isRemovable: true}}
                    );
                }

                // Make sure this component is also moved in any work packages
                DesignComponentModules.updateWorkPackageLocation(designComponentId, false);
            } else {
                throw new Meteor.Error('designComponent.moveDesignComponent.noComponent', 'Design Component did not exist', designComponentId)
            }

        }
    }


    // Save text for a design component
    updateComponentName(designComponentId, componentName, componentNameRaw){
        if(Meteor.isServer) {

            // No actual update or changes needed if no change to name
            const currentComponent = DesignVersionComponents.findOne({_id: designComponentId});
            const componentNameOld = currentComponent.componentNameNew;
            const componentNameRawOld = currentComponent.componentNameRawNew;


            if (componentName === componentNameOld) {
                return true;
            }

            // No longer "New" once name is set
            let updated = DesignVersionComponents.update(
                {_id: designComponentId},
                {
                    $set: {
                        componentNameOld: componentNameOld,
                        componentNameNew: componentName,
                        componentNameRawOld: componentNameRawOld,
                        componentNameRawNew: componentNameRaw,
                        isNew: false
                    }
                }
            );

            if(updated === 0){
                throw new Meteor.Error('designComponent.updateComponentName.noComponent', 'Design Component did not exist', designComponentId)
            }
        }
    };


    // Save the narrative for a feature component
    updateFeatureNarrative(featureId, plainText, rawText){
        if(Meteor.isServer) {

            const currentComponent = DesignVersionComponents.findOne({_id: featureId});
            const componentNarrativeOld = currentComponent.componentNarrativeNew;
            const componentNarrativeRawOld = currentComponent.componentNarrativeRawNew;

            let updated = DesignVersionComponents.update(
                {_id: featureId},
                {
                    $set: {
                        componentNarrativeOld: componentNarrativeOld,
                        componentNarrativeNew: plainText,
                        componentNarrativeRawOld: componentNarrativeRawOld,
                        componentNarrativeRawNew: rawText,
                        isNew: false
                    }
                }
            );

            if(updated === 0){
                throw new Meteor.Error('designComponent.updateFeatureNarrative.noComponent', 'Design Component did not exist', featureId)
            }
        }
    };

    removeDesignComponent(designComponentId, parentId){
        if(Meteor.isServer) {

            // Deletes from the base design in initial edit mode are real deletes
            const designComponent = DesignVersionComponents.findOne({_id: designComponentId});

            let removed = DesignVersionComponents.remove(
                {_id: designComponentId}
            );

            if(removed > 0){

                // When removing a design component its parent may become removable
                if (DesignComponentModules.hasNoChildren(parentId)) {
                    DesignVersionComponents.update(
                        {_id: parentId},
                        {$set: {isRemovable: true}}
                    )
                }

                // Remove component from any related work packages
                DesignComponentModules.removeWorkPackageItems(designComponent._id, designComponent.designVersionId);

                // If this happened to be the last Feature, Design is now removable
                if (designComponent.componentType === ComponentType.FEATURE) {
                    DesignServices.setRemovable(designComponent.designId);
                }

            } else {
                throw new Meteor.Error('designComponent.removeDesignComponent.noComponent', 'Design Component did not exist', designComponentId)
            }
        }
    };

    // Move the component to a new position in its local list
    reorderDesignComponent(componentId, targetComponentId){
        if(Meteor.isServer) {
            // The new position is always just above the target component

            const movingComponent = DesignVersionComponents.findOne({_id: componentId});
            const targetComponent = DesignVersionComponents.findOne({_id: targetComponentId});

            const oldIndex = movingComponent.componentIndexNew;

            const peerComponents = DesignVersionComponents.find(
                {
                    _id:                    {$ne: componentId},
                    componentType:          movingComponent.componentType,
                    componentParentIdNew:   movingComponent.componentParentIdNew
                },
                {sort: {componentIndexNew: -1}}
            );

            let indexBelow = targetComponent.componentIndexNew;
            log((msg) => console.log(msg), LogLevel.TRACE, "Index below = {}", indexBelow);

            let indexAbove = 0;                                 // The default if nothing exists above
            const listMaxArrayIndex = peerComponents.count() - 1;
            log((msg) => console.log(msg), LogLevel.TRACE, "List max = {}", listMaxArrayIndex);

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

            log((msg) => console.log(msg), LogLevel.TRACE, "Index above = {}", indexAbove);

            // The new index is half way between the above an below index - sort of Dewey Decimal system to avoid having to reindex everything every time
            const indexDiff = indexBelow - indexAbove;
            const newIndex = (indexBelow + indexAbove) / 2;

            log((msg) => console.log(msg), LogLevel.TRACE, "Setting new index for {} to {}", movingComponent.componentNameNew, newIndex);

            DesignVersionComponents.update(
                {_id: componentId},
                {
                    $set: {
                        componentIndexOld: oldIndex,
                        componentIndexNew: newIndex
                    }
                }
            );

            // Update any WPs with new ordering
            DesignComponentModules.updateWorkPackageLocation(componentId, true);


            // Over time the indexing differences may get too small to work any more so periodically reset the indexes for this list.
            if (indexDiff < 0.001) {
                log((msg) => console.log(msg), LogLevel.TRACE, "Index reset!");

                // Get the components in current order
                const resetComponents = DesignVersionComponents.find(
                    {
                        componentType: movingComponent.componentType,
                        componentParentIdNew: movingComponent.componentParentIdNew
                    },
                    {sort: {componentIndexNew: 1}}
                );

                let resetIndex = 100;

                // Reset them to 100, 200, 300 etc...
                resetComponents.forEach((component) => {
                    DesignVersionComponents.update(
                        {_id: component._id},
                        {
                            $set: {
                                componentIndexOld: resetIndex,
                                componentIndexNew: resetIndex
                            }
                        }
                    );

                    //DesignComponentModules.updateWorkPackageLocation(component._id, true);

                    resetIndex = resetIndex + 100;

                })
            }
        }

    };
}

export default new DesignComponentServices();