
// Ultrawide Collections
import { WorkPackageComponents }        from '../../collections/work/work_package_components.js';
import { DesignComponents }             from '../../collections/design/design_components.js';
import { DesignUpdateComponents }       from '../../collections/design_update/design_update_components.js';

// Ultrawide Services
import { WorkPackageType, ComponentType } from '../../constants/constants.js';

//======================================================================================================================
//
// Server Modules for Work Package Items.
//
// Methods called from within main API methods
//
//======================================================================================================================

class WorkPackageModules {

    // Populate WP with components from related Design Version ot Design Update
    populateWorkPackageComponents(workPackageId, designVersionId, designUpdateId, wpType){

        switch(wpType){
            case WorkPackageType.WP_BASE:
                // Potential components are all those in base design version

                let dvComponents = DesignComponents.find({designVersionId: designVersionId});

                dvComponents.forEach((component) => {

                    WorkPackageComponents.insert(
                        {
                            designVersionId:                designVersionId,
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
                    );
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
                            designVersionId:                designVersionId,
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

                switch (child.componentType){

                    case ComponentType.FEATURE:
                        // Features are set as active items
                        WorkPackageComponents.update(
                            {_id: child._id},
                            {
                                $set:{
                                    componentActive: true,
                                    componentParent: true
                                }
                            }
                        );
                        break;

                    case ComponentType.SCENARIO:
                        // Only set if not in scope in a parallel work package
                        let alreadyScopedScenario = WorkPackageComponents.find({
                            _id:                    {$ne: child._id},            // Not same WP item
                            designVersionId:        child.designVersionId,       // Same Base Design Version
                            componentReferenceId:   child.componentReferenceId,  // Same component
                            componentActive:        true                         // Already in scope
                        }).count() > 0;

                        if(!alreadyScopedScenario){
                            WorkPackageComponents.update(
                                {_id: child._id},
                                {
                                    $set:{
                                        componentActive: true,
                                        componentParent: true
                                    }
                                }
                            );
                        }
                        break;

                    default:
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

                // Recursively call for these children - if not a Scenario which is the bottom of the tree
                if(child.componentType != ComponentType.SCENARIO) {
                    this.scopeChildren(workPackageId, child.componentReferenceId)
                }

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
                if(child.componentType != ComponentType.SCENARIO) {
                    this.deScopeChildren(workPackageId, child.componentReferenceId)
                }
            });

            return true;

        } else {
            return false;
        }
    };


}

export default new WorkPackageModules();
