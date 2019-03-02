
// Ultrawide Services
import { ComponentType, ViewType, LogLevel } from '../../constants/constants.js';
import { DefaultComponentNames } from '../../constants/default_names.js';
import { log } from '../../common/utils.js';

import { DesignServices }               from './design_services.js';
import { DesignComponentModules }       from '../../service_modules/design/design_component_service_modules.js';

// DB services
import { DesignVersionData }            from '../../data/design/design_version_db.js';
import { DesignComponentData }          from '../../data/design/design_component_db.js';

//======================================================================================================================
//
// Server Code for Design Components.
//
// Methods called directly by Server API
//
//======================================================================================================================

class DesignComponentServicesClass {

    populateHierarchyIndexData(designVersionId){

        log((msg) => console.log(msg), LogLevel.INFO, "Inserting hierarchy data for DV");

        const dvComponents = DesignVersionData.getAllComponents(designVersionId);

        dvComponents.forEach((component) => {

            DesignComponentModules.updateComponentHierarchyIndex(component);
        });

        log((msg) => console.log(msg), LogLevel.INFO, "Inserting hierarchy data DONE");
    }

    // Add a new design component
    addNewComponent(designVersionId, parentRefId, componentType, componentLevel, defaultName, defaultRawName, defaultRawText, isNew, view, workPackageId='NONE'){

        if(Meteor.isServer){
            // Get the parent reference id (if there is a parent)
            //let parentRefId = 'NONE';
            let featureRefId = 'NONE';

            let parent = DesignComponentData.getDesignComponentByRef(designVersionId, parentRefId);

            if(parent){
                // Get the Feature Reference ID.  This will be NONE for anything that is not under a Feature
                featureRefId = parent.componentFeatureReferenceIdNew;
            }

            // If adding from a Work Package set as dev added
            let devAdded = (view === ViewType.DEVELOP_BASE_WP);

            // Get the design id - this is added to the components for easier access to data
            let designVersion = DesignVersionData.getDesignVersionById(designVersionId);

            let designId = 'NONE';
            if (designVersion){
                designId = designVersion.designId;
            }

            let designComponentId = DesignComponentData.insertNewComponent(
                designId,
                designVersionId,
                componentType,
                componentLevel,
                parentRefId,
                featureRefId,
                defaultName,
                defaultRawName,
                defaultRawText,
                isNew,
                workPackageId,
                devAdded
            );

            if(designComponentId){
                // Update the component reference to be the _id.  Note that this is not silly because the CR ID will
                // always be the _id of the component that was created first.  So for components added in a design update
                // it will be the design update component _id...
                DesignComponentData.setComponentReference(designComponentId, designComponentId);

                // Set the default index for a new component
                DesignComponentModules.setIndex(designComponentId);

                // Set its hierarchy
                const component = DesignComponentData.getDesignComponentById(designComponentId);
                DesignComponentModules.updateComponentHierarchyIndex(component);

                // If a Feature also update the Feature Ref Id to the new ID and set a default narrative
                if(componentType === ComponentType.FEATURE){

                    DesignComponentData.setFeatureReferences(
                        designComponentId,
                        DefaultComponentNames.NEW_NARRATIVE_TEXT,
                        DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_NARRATIVE_TEXT)
                    );

                    // Make sure Design is no longer removable now that a feature added
                    DesignServices.setRemovable(designId);

                    // Update the WP before adding the Feature Aspects
                    DesignComponentModules.updateWorkPackagesWithNewItem(designVersionId, designComponentId);

                    // And for Features add the default Feature Aspects
                    // TODO - that could be user configurable!
                    DesignComponentModules.addDefaultFeatureAspects(designId, designVersionId, designComponentId, defaultRawText, view);

                } else {
                    // Check for any WPs in this design version and add the components to them too
                    DesignComponentModules.updateWorkPackagesWithNewItem(designVersionId, designComponentId)
                }

                // When inserting a new design component its parent becomes non-removable
                if(parent) {

                    DesignComponentData.setRemovable(parent._id, false);
                }
            }

            return designComponentId;
        }

    };

    moveDesignComponent(designComponentId, newParentId){

        if(Meteor.isServer) {

            // Get the unique persistent reference for the parent
            const newParent = DesignComponentData.getDesignComponentById(newParentId);
            const movingComponent = DesignComponentData.getDesignComponentById(designComponentId);
            const oldParent = DesignComponentData.getDesignComponentByRef(movingComponent.designVersionId, movingComponent.componentParentReferenceIdNew);

            const oldParentReferenceId = movingComponent.componentParentReferenceIdNew;

            // If a Design Section, make sure the level gets changed correctly
            let newLevel = movingComponent.componentLevel;

            if (movingComponent.componentType === ComponentType.DESIGN_SECTION) {
                newLevel = newParent.componentLevel + 1;
            }

            // If moving a feature it must keep its feature ref id - otherwise take on the parent feature ref
            let componentFeatureReferenceId = newParent.componentFeatureReferenceIdNew;
            if(movingComponent.componentType === ComponentType.FEATURE) {
                componentFeatureReferenceId = movingComponent.componentFeatureReferenceIdNew;
            }

            let updated = DesignComponentData.updateAfterMove(
                designComponentId,
                newParent.componentReferenceId,
                componentFeatureReferenceId,
                newLevel
            );

            if(updated > 0){

                // Make sure new Parent is now not removable as it must have a child
                DesignComponentData.setRemovable(newParentId, false);

                // But the old parent may now be removable
                if (oldParent && DesignComponentModules.hasNoChildren(oldParent._id)) {
                    DesignComponentData.setRemovable(oldParent._id, true);
                }

                // Make sure this component is also moved in any work packages
                DesignComponentModules.updateWorkPackageLocation(designComponentId, false);

            } else {
                throw new Meteor.Error('designComponent.moveDesignComponent.noComponent', 'Design Component did not exist', designComponentId)
            }

            // After a move like this is best to recalculate the entire hierarchy
            this.populateHierarchyIndexData(movingComponent.designVersionId);

        }
    }


    // Save text for a design component
    updateComponentName(designComponentId, componentName, componentNameRaw){
        if(Meteor.isServer) {

            // No actual update or changes needed if no change to name
            const currentComponent = DesignComponentData.getDesignComponentById(designComponentId);

            if(currentComponent) {

                const componentNameOld = currentComponent.componentNameNew;
                const componentNameRawOld = currentComponent.componentNameRawNew;


                if (componentName === componentNameOld) {
                    return true;
                }

                // No longer "New" once name is set
                let updated = DesignComponentData.updateComponentName(
                    designComponentId,
                    componentNameOld,
                    componentName,
                    componentNameRawOld,
                    componentNameRaw
                );

                if (updated === 0) {
                    throw new Meteor.Error('designComponent.updateComponentName.noUpdate', 'Design Component did not update', designComponentId)
                }
            } else {
                throw new Meteor.Error('designComponent.updateComponentName.noComponent', 'Design Component did not exist', designComponentId)
            }
        }
    };


    // Save the narrative for a feature component
    updateFeatureNarrative(featureId, plainText, rawText){
        if(Meteor.isServer) {

            const currentComponent = DesignComponentData.getDesignComponentById(featureId);

            if(currentComponent) {
                const componentNarrativeOld = currentComponent.componentNarrativeNew;
                const componentNarrativeRawOld = currentComponent.componentNarrativeRawNew;

                let updated = DesignComponentData.updateFeatureNarrative(
                    featureId,
                    componentNarrativeOld,
                    plainText,
                    componentNarrativeRawOld,
                    rawText
                );

                if (updated === 0) {
                    throw new Meteor.Error('designComponent.updateFeatureNarrative.noUpdate', 'Design Component did not update', featureId)
                }
            } else {
                throw new Meteor.Error('designComponent.updateFeatureNarrative.noComponent', 'Design Component did not exist', featureId)
            }
        }
    };

    removeDesignComponent(designComponentId){

        if(Meteor.isServer) {

            // Deletes from the base design in initial edit mode are real deletes
            const designComponent = DesignComponentData.getDesignComponentById(designComponentId);

            if(designComponent) {

                const parentId = DesignComponentData.getParentId(designComponent.designVersionId, designComponent.componentParentReferenceIdNew);

                let removed = DesignComponentData.removeComponent(designComponentId);

                if (removed > 0) {

                    // When removing a design component its parent may become removable
                    if(parentId !== 'NONE') {
                        if (DesignComponentModules.hasNoChildren(parentId)) {
                            DesignComponentData.setRemovable(parentId, true);
                        }
                    }

                    // Remove component from any related work packages
                    DesignComponentModules.removeWorkPackageItems(designComponent.componentReferenceId, designComponent.designVersionId);

                    // If this happened to be the last Feature, Design is now removable
                    if (designComponent.componentType === ComponentType.FEATURE) {
                        DesignServices.setRemovable(designComponent.designId);
                    }

                } else {
                    throw new Meteor.Error('designComponent.removeDesignComponent.noRemove', 'Design Component not removed', designComponentId)
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

            const movingComponent = DesignComponentData.getDesignComponentById(componentId);
            const targetComponent = DesignComponentData.getDesignComponentById(targetComponentId);

            if(movingComponent) {

                const oldIndex = movingComponent.componentIndexNew;

                const peerComponents = DesignComponentData.getPeerComponents(
                    movingComponent.designVersionId,
                    movingComponent.componentReferenceId,
                    movingComponent.componentType,
                    movingComponent.componentParentReferenceIdNew
                );

                let indexBelow = targetComponent.componentIndexNew;
                log((msg) => console.log(msg), LogLevel.TRACE, "Index below = {}", indexBelow);

                let indexAbove = 0;                                 // The default if nothing exists above
                const listMaxArrayIndex = peerComponents.length - 1;
                log((msg) => console.log(msg), LogLevel.TRACE, "List max = {}", listMaxArrayIndex);

                // Go through the list of peers (ordered from bottom to top)
                let i = 0;
                while (i <= listMaxArrayIndex) {
                    if (peerComponents[i].componentIndexNew === targetComponent.componentIndexNew) {
                        // OK, this is the target component so the next one in the list (if there is one) is the one that will be above the new position
                        if (i < listMaxArrayIndex) {
                            indexAbove = peerComponents[i + 1].componentIndexNew;
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

                DesignComponentData.updateIndex(componentId, oldIndex, newIndex);

                // Update any WPs with new ordering
                DesignComponentModules.updateWorkPackageLocation(componentId, true);

                // Over time the indexing differences may get too small to work any more so periodically reset the indexes for this list.
                if (indexDiff < 0.001) {
                    log((msg) => console.log(msg), LogLevel.TRACE, "Index reset!");

                    // Get the components in current order
                    const resetComponents = DesignComponentData.getChildComponentsOfType(
                        movingComponent.designVersionId,
                        movingComponent.componentType,
                        movingComponent.componentParentReferenceIdNew
                    );


                    let resetIndex = 100;

                    // Reset them to 100, 200, 300 etc...
                    resetComponents.forEach((component) => {

                        DesignComponentData.updateIndex(component._id, resetIndex, resetIndex);

                        resetIndex = resetIndex + 100;
                    });
                }
            }
        }

    };

}

export const DesignComponentServices = new DesignComponentServicesClass();