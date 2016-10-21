

import { WorkPackages } from '../collections/work/work_packages.js';
import { WorkPackageComponents } from '../collections/work/work_package_components.js';
import { DesignComponents } from '../collections/design/design_components.js';
import { DesignUpdateComponents } from '../collections/design_update/design_update_components.js';

import { WorkPackageStatus, WorkPackageType, ComponentType } from '../constants/constants.js';

class WorkPackageServices{

    // Add a new Work Package
    addNewWorkPackage(designVersionId, designUpdateId, wpType, populateWp){


        const workPackageId = WorkPackages.insert(
            {
                designVersionId:            designVersionId,            // The design version this is work for
                designUpdateId:             designUpdateId,             // Defaults if not Update WP
                workPackageType:            wpType,                     // Either Base Version Implementation or Design Update Implementation
                workPackageName:            'New Work Package',         // Identifier of this work package
                workPackageStatus:          WorkPackageStatus.WP_NEW,

            },

            (error, result) => {
                if(error){
                    // Error handler
                    console.log("Insert WP - Error: " + error);
                } else {
                    console.log("Insert WP - Success: " + result);

                    // Now populate the work package components
                    if(populateWp) {
                        this.populateWorkPackageComponents(result, designVersionId, designUpdateId, wpType);
                    }
                }
            }
        );

        return workPackageId;
    };

    // Populate WP with components from related Design Version ot Design Update
    populateWorkPackageComponents(workPackageId, designVersionId, designUpdateId, wpType){

        switch(wpType){
            case WorkPackageType.WP_BASE:
                // Potential components are all those in base design version

                let dvComponents = DesignComponents.find({designVersionId: designVersionId});

                dvComponents.forEach((component) => {

                    WorkPackageComponents.insert(
                        {
                            workPackageId:                  workPackageId,
                            workPackageType:                wpType,
                            componentId:                    component._id,
                            componentReferenceId:           component.componentReferenceId,
                            componentType:                  component.componentType,
                            componentParentReferenceId:     component.componentParentReferenceId,
                            componentFeatureReferenceId:    component.componentFeatureReferenceId,
                            componentLevel:                 component.componentLevel,
                            componentIndex:                 component.componentIndex,
                            componentParent:                false,
                            componentActive:                false       // Start by assuming nothing in scope
                        }
                    )

                });

                break;
            case WorkPackageType.WP_UPDATE:
                // Potential components are those in scope or parent scope in the Design Update

                let duComponents = DesignUpdateComponents.find(
                    {
                        designVersionId: designVersionId,
                        designUpdateId: designUpdateId,
                        $or:[{isInScope: true}, {isParentScope: true}]
                    }
                );

                duComponents.forEach((component) => {

                    WorkPackageComponents.insert(
                        {
                            workPackageId:                  workPackageId,
                            workPackageType:                wpType,
                            componentId:                    component._id,
                            componentReferenceId:           component.componentReferenceId,
                            componentType:                  component.componentType,
                            componentParentReferenceId:     component.componentParentReferenceIdNew,
                            componentFeatureReferenceId:    component.componentFeatureReferenceIdNew,
                            componentLevel:                 component.componentLevel,
                            componentIndex:                 component.componentIndexNew,
                            componentParent:                false,
                            componentActive:                false       // Start by assuming nothing in scope
                        }
                    )

                });


        }
    }

    // Called when data is restored
    importComponent(workPackageId, designComponentId, wpComponent){

        const wpComponentId = WorkPackageComponents.insert(
            {
                // Identity
                workPackageId:              workPackageId,
                workPackageType:            wpComponent.workPackageType,
                componentId:                designComponentId,
                componentReferenceId:       wpComponent.componentReferenceId,
                componentParentReferenceId: wpComponent.componentParentReferenceId,
                componentFeatureReferenceId:wpComponent.componentFeatureReferenceId,
                componentType:              wpComponent.componentType,
                componentLevel:             wpComponent.componentLevel,
                componentIndex:             wpComponent.componentIndex,

                // Status
                componentParent:            wpComponent.componentParent,
                componentActive:            wpComponent.componentActive
            }
        );

        return wpComponentId;
    }

    publishWorkPackage(workPackageId){

        WorkPackages.update(
            {_id: workPackageId},
            {
                $set: {
                    workPackageStatus: WorkPackageStatus.WP_AVAILABLE
                }
            }
        );
    };

    updateWorkPackageName(workPackageId, newName){

        WorkPackages.update(
            {_id: workPackageId},
            {
                $set: {
                    workPackageName: newName
                }
            }
        );

    };


    removeWorkPackage(workPackageId){

        // Delete all components in the work package
        WorkPackageComponents.remove(
            {workPackageId: workPackageId},
            (error, result) => {
                if(error){
                    console.log("Error deleting WP components " + error);
                } else {
                    // OK so delete the WP itself
                    WorkPackages.remove({_id: workPackageId});
                }
            }
        );
    };


    // Store the scope state of a WP component
    toggleScope(wpComponent, newScope){

        if(wpComponent) {
            if(Meteor.isServer){
                console.log("SERVER: Toggling scope for component ref: " + wpComponent._id + " to " + newScope);
            } else {
                console.log("CLIENT: Toggling scope for component ref: " + wpComponent._id + " to " + newScope);
            }

            let startingComponentRef = wpComponent.componentReferenceId;
            let parentRefId = wpComponent.componentParentReferenceId;
            let currentWpComponent = wpComponent;
            const currentWorkPackage = wpComponent.workPackageId

            if (newScope) {
                // When a component is put in scope, all its parents come into scope as parents.
                // Also, putting a component in scope adds all its children.
                // Only Features and Scenarios are actively in scope - rest are just parent scope.

                // Mark current component as in scope
                switch(currentWpComponent.componentType){
                    case ComponentType.FEATURE:
                    case ComponentType.SCENARIO:
                        // Features and Scenarios are active items in a WP
                        WorkPackageComponents.update(
                            {_id: currentWpComponent._id},
                            {
                                $set: {
                                    componentParent: true,
                                    componentActive: true
                                }
                            }
                        );
                        break;
                    default:
                        // Other items are just parents
                        WorkPackageComponents.update(
                            {_id: currentWpComponent._id},
                            {
                                $set: {
                                    componentParent: true
                                }
                            }
                        );
                        break;
                }

                // Mark up all parents...  However these are all just parents even if a Feature as Feature was not explicitly selected
                while (parentRefId != 'NONE') {

                    // Get the parent WP component
                    currentWpComponent = WorkPackageComponents.findOne(
                        {
                            workPackageId: currentWorkPackage,
                            componentReferenceId: parentRefId
                        }
                    );

                    // Mark as a parent
                    WorkPackageComponents.update(
                        {_id: currentWpComponent._id},
                        {
                            $set: {
                                componentParent: true
                            }
                        }
                    );

                    // And then move up to the next parent
                    parentRefId = currentWpComponent.componentParentReferenceId;

                }

                // Mark up all children below the selected item...
                this.scopeChildren(currentWorkPackage, startingComponentRef);

            } else {
                // When a component is put out of scope...
                // All children are taken out of scope.
                // Ny parent that no longer haschildren goes

                // Descope the component
                WorkPackageComponents.update(
                    {_id: currentWpComponent._id},
                    {
                        $set: {
                            componentParent: false,
                            componentActive: false
                        }
                    }
                );

                // And then all of its children
                this.deScopeChildren(currentWorkPackage, startingComponentRef);

            }
        }
    };

    // Recursive function to mark all children down to the bottom of the tree
    scopeChildren(workPackageId, parentComponentRef){

        let childComponents = WorkPackageComponents.find(
            {
                workPackageId: workPackageId,
                componentParentReferenceId: parentComponentRef
            }
        );

        if(childComponents.count() > 0){
            childComponents.forEach((child) => {

                console.log("Setting child WP component " + child._id + " in scope.");

                if(child.componentType === ComponentType.FEATURE || child.componentType === ComponentType.SCENARIO){
                    // Features and Scenarios go Active
                    WorkPackageComponents.update(
                        {_id: child._id},
                        {
                            $set:{
                                componentActive: true,
                                componentParent: true
                            }
                        }
                    );
                } else {
                    // Other stuff is just in scope as a parent only
                    WorkPackageComponents.update(
                        {_id: child._id},
                        {
                            $set:{
                                componentParent: true
                            }
                        }
                    );
                }

                // Recursively call for these children
                this.scopeChildren(workPackageId, child.componentReferenceId)


            });

            return true;

        } else {
            return false;
        }
    };

    // Recursive function to mark all children down to the bottom of the tree
    deScopeChildren(workPackageId, parentComponentRef){

        let childComponents = WorkPackageComponents.find(
            {
                workPackageId: workPackageId,
                componentParentReferenceId: parentComponentRef
            }
        );

        if(childComponents.count() > 0){
            childComponents.forEach((child) => {

                WorkPackageComponents.update(
                    {_id: child._id},
                    {
                        $set:{
                            componentActive: false,
                            componentParent: false
                        }
                    }
                );

                // Recursively call for these children
                this.deScopeChildren(workPackageId, child.componentReferenceId)

            });

            return true;

        } else {
            return false;
        }
    };

}

export default new WorkPackageServices();
