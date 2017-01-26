
// Ultrawide Collections
import { DesignVersions }           from '../../collections/design/design_versions.js';
import { DesignComponents }         from '../../collections/design/design_components.js';
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
    addNewComponent(designVersionId, parentId, componentType, componentLevel, defaultName, defaultRawName, defaultRawText, isNew, view){

        if(Meteor.isServer){
            // Get the parent reference id (if there is a parent)
            let parentRefId = 'NONE';
            let featureRefId = 'NONE';

            let parent = DesignComponents.findOne({_id: parentId});

            if(parent){
                parentRefId = parent.componentReferenceId;

                // Get the Feature Reference ID.  This will be NONE for anything that is not under a Feature
                featureRefId = parent.componentFeatureReferenceId;

            }

            //console.log("Adding Scenario with view " + view);

            // If adding from a Work Package set as dev added
            let devAdded = (view === ViewType.DEVELOP_BASE_WP);

            //console.log("IsDevAdded = " + devAdded);

            // Get the design id - this is added to the components for easier access to data
            let designId = DesignVersions.findOne({_id: designVersionId}).designId;

            let designComponentId = DesignComponents.insert(
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
                    isNew:                          isNew,
                    isDevAdded:                     devAdded
                },

            );

            if(designComponentId){
                // Update the component reference to be the _id.  Note that this is not silly because the CR ID will
                // always be the _id of the component that was created first.  So for components added in a design update
                // it will be the design update component _id...
                DesignComponents.update(
                    {_id: designComponentId},
                    { $set: {componentReferenceId: designComponentId}}
                );

                // If a Feature also update the Feature Ref Id to the new ID and set a default narrative
                if(componentType === ComponentType.FEATURE){
                    DesignComponents.update(
                        {_id: designComponentId},
                        { $set:
                            {
                                componentFeatureReferenceId: designComponentId,
                                componentNarrative: DefaultComponentNames.NEW_NARRATIVE_TEXT,
                                componentNarrativeRaw: DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_NARRATIVE_TEXT)
                            }
                        }
                    );

                    // Make sure Design is no longer removable now that a feature added
                    DesignServices.setRemovable(designId);

                    // And for Features add the default Feature Aspects
                    // TODO - that could be user configurable!
                    DesignComponentModules.addDefaultFeatureAspects(designVersionId, designComponentId, defaultRawText);
                }

                // When inserting a new design component its parent becomes non-removable
                if(parentId) {
                    DesignComponents.update(
                        {_id: parentId},
                        {$set: {isRemovable: false}}
                    );
                }

                // Set the default index for a new component
                DesignComponentModules.setIndex(designComponentId, componentType, parentId);


                // Check for any WPs in this design version and add the components to them too
                DesignComponentModules.updateWorkPackages(designVersionId, designComponentId)
            }

            return designComponentId;
        }

    };

    // Called when restoring data after a reset
    importComponent(designId, designVersionId, component){

        if(Meteor.isServer) {
            // Fix missing feature refs
            let componentFeatureReferenceId = component.componentFeatureReferenceId;
            if (component.componentType === ComponentType.FEATURE && componentFeatureReferenceId === 'NONE') {
                componentFeatureReferenceId = component.componentReferenceId;
            }

            const designComponentId = DesignComponents.insert(
                {
                    // Identity
                    componentReferenceId: component.componentReferenceId,
                    designId: designId,                               // Will be a new id for the restored data
                    designVersionId: designVersionId,                        // Ditto
                    componentType: component.componentType,
                    componentLevel: component.componentLevel,
                    componentParentId: component.componentParentId,            // This will be wrong and fixed by restore process
                    componentParentReferenceId: component.componentParentReferenceId,
                    componentFeatureReferenceId: componentFeatureReferenceId,
                    componentIndex: component.componentIndex,

                    // Data
                    componentName: component.componentName,
                    componentNameRaw: component.componentNameRaw,
                    componentNarrative: component.componentNarrative,
                    componentNarrativeRaw: component.componentNarrativeRaw,
                    componentTextRaw: component.componentTextRaw,

                    // State (shared and persistent only)
                    isRemovable: component.isRemovable,
                    isRemoved: component.isRemoved,
                    isNew: component.isNew,
                    isDevUpdated: component.isDevUpdated,
                    isDevAdded: component.isDevAdded,
                    lockingUser: component.lockingUser,
                    designUpdateId: component.designUpdateId
                }
            );

            return designComponentId;
        }
    };

    // Resets parent ids after an import of data
    importRestoreParent(designComponentId, componentMap){

        if(Meteor.isServer) {
            const designComponent = DesignComponents.findOne({_id: designComponentId});

            const oldParentId = designComponent.componentParentId;
            let newParentId = 'NONE';

            if (oldParentId != 'NONE') {
                newParentId = getIdFromMap(componentMap, oldParentId);
            }

            DesignComponents.update(
                {_id: designComponentId},
                {
                    $set: {
                        componentParentId: newParentId
                    }
                }
            );
        }
    };

    moveDesignComponent(designComponentId, newParentId){

        if(Meteor.isServer) {
            // Get the unique persistent reference for the parent
            const newParent = DesignComponents.findOne({_id: newParentId});
            const movingComponent = DesignComponents.findOne({_id: designComponentId});
            const oldParentId = movingComponent.componentParentId;

            // If a Design Section, make sure the level gets changed correctly
            let newLevel = movingComponent.componentLevel;

            if (movingComponent.componentType === ComponentType.DESIGN_SECTION) {
                newLevel = newParent.componentLevel + 1;
            }

            let updated = DesignComponents.update(
                {_id: designComponentId},
                {
                    $set: {
                        componentParentId: newParentId,
                        componentParentReferenceId: newParent.componentReferenceId,
                        componentFeatureReferenceId: newParent.componentFeatureReferenceId,
                        componentLevel: newLevel
                    }
                }
            );

            if(updated > 0){
                // Make sure new Parent is now not removable as it must have a child
                DesignComponents.update(
                    {_id: newParentId},
                    {
                        $set: {
                            isRemovable: false
                        }
                    }
                );

                // But the old parent may now be removable
                if (DesignComponentModules.hasNoChildren(oldParentId)) {
                    DesignComponents.update(
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
            let componentNameOld = DesignComponents.findOne({_id: designComponentId}).componentName;

            if (componentName === componentNameOld) {
                return true;
            }

            let updated = DesignComponents.update(
                {_id: designComponentId},
                {
                    $set: {
                        componentName: componentName,
                        componentNameRaw: componentNameRaw,
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

            let updated = DesignComponents.update(
                {_id: featureId},
                {
                    $set: {
                        componentNarrative: plainText,
                        componentNarrativeRaw: rawText,
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
            const designComponent = DesignComponents.findOne({_id: designComponentId});

            let removed = DesignComponents.remove(
                {_id: designComponentId}
            );

            if(removed > 0){

                // When removing a design component its parent may become removable
                if (DesignComponentModules.hasNoChildren(parentId)) {
                    DesignComponents.update(
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

            const movingComponent = DesignComponents.findOne({_id: componentId});
            const targetComponent = DesignComponents.findOne({_id: targetComponentId});

            const peerComponents = DesignComponents.find(
                {
                    _id: {$ne: componentId},
                    componentType: movingComponent.componentType,
                    componentParentId: movingComponent.componentParentId
                },
                {sort: {componentIndex: -1}}
            );

            let indexBelow = targetComponent.componentIndex;
            log((msg) => console.log(msg), LogLevel.TRACE, "Index below = {}", indexBelow);

            let indexAbove = 0;                                 // The default if nothing exists above
            const listMaxArrayIndex = peerComponents.count() - 1;
            log((msg) => console.log(msg), LogLevel.TRACE, "List max = {}", listMaxArrayIndex);

            const peerArray = peerComponents.fetch();

            // Go through the list of peers (ordered from bottom to top)
            let i = 0;
            while (i <= listMaxArrayIndex) {
                if (peerArray[i].componentIndex === targetComponent.componentIndex) {
                    // OK, this is the target component so the next one in the list (if there is one) is the one that will be above the new position
                    if (i < listMaxArrayIndex) {
                        indexAbove = peerArray[i + 1].componentIndex;
                    }
                    break;
                }
                i++;
            }

            log((msg) => console.log(msg), LogLevel.TRACE, "Index above = {}", indexAbove);

            // The new index is half way between the above an below index - sort of Dewey Decimal system to avoid having to reindex everything every time
            const indexDiff = indexBelow - indexAbove;
            const newIndex = (indexBelow + indexAbove) / 2;

            log((msg) => console.log(msg), LogLevel.TRACE, "Setting new index for {} to {}", movingComponent.componentName, newIndex);

            DesignComponents.update(
                {_id: componentId},
                {
                    $set: {
                        componentIndex: newIndex
                    }
                }
            );

            // Update any WPs with new ordering
            DesignComponentModules.updateWorkPackageLocation(componentId, true);


            // Over time the indexing differences may get too small to work any more so periodically reset the indexes for this list.
            if (indexDiff < 0.001) {
                log((msg) => console.log(msg), LogLevel.TRACE, "Index reset!");

                // Get the components in current order
                const resetComponents = DesignComponents.find(
                    {
                        componentType: movingComponent.componentType,
                        componentParentId: movingComponent.componentParentId
                    },
                    {sort: {componentIndex: 1}}
                );

                let resetIndex = 100;

                // Reset them to 100, 200, 300 etc...
                resetComponents.forEach((component) => {
                    DesignComponents.update(
                        {_id: component._id},
                        {
                            $set: {
                                componentIndex: resetIndex
                            }
                        }
                    );

                    DesignComponentModules.updateWorkPackageLocation(component._id, true);

                    resetIndex = resetIndex + 100;

                })
            }
        }

    };
}

export default new DesignComponentServices();