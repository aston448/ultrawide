
// Ultrawide Collections
import { WorkPackageComponents }        from '../../collections/work/work_package_components.js';
import { DesignVersionComponents }             from '../../collections/design/design_version_components.js';
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

                let dvComponents = DesignVersionComponents.find({designVersionId: designVersionId});

                dvComponents.forEach((component) => {

                    WorkPackageComponents.insert(
                        {
                            designVersionId:                designVersionId,
                            workPackageId:                  workPackageId,
                            workPackageType:                wpType,
                            componentId:                    component._id,
                            componentReferenceId:           component.componentReferenceId,
                            componentType:                  component.componentType,
                            componentParentReferenceId:     component.componentParentReferenceIdNew,
                            componentFeatureReferenceIdNew:    component.componentFeatureReferenceIdNew,
                            componentLevel:                 component.componentLevel,
                            componentIndex:                 component.componentIndexNew,
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
                            componentFeatureReferenceIdNew:    component.componentFeatureReferenceIdNew,
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

                    case ComponentType.FEATURE_ASPECT:

                        // For Feature Aspects we don't want to scope if no in-scope Scenarios will end up in the aspect

                        //console.log("Scoping Feature Aspect");

                        // Get the Scenarios in the WP
                        let aspectWpScenarios = WorkPackageComponents.find({
                            componentParentReferenceId: child.componentReferenceId,
                            componentType:              ComponentType.SCENARIO,
                            workPackageId:              child.workPackageId
                        }).fetch();

                        //console.log("Found " + aspectWpScenarios.length + " child Scenarios");

                        let includedScenarioCount = 0;

                        // Need to find one or more of these scenarios that is not scoped in a parallel WP
                        aspectWpScenarios.forEach((scenario) => {

                            let notAlreadyScopedScenario = WorkPackageComponents.find({
                                    _id:                    {$ne: scenario._id},            // Not same WP item
                                    designVersionId:        scenario.designVersionId,       // Same Base Design Version
                                    componentReferenceId:   scenario.componentReferenceId,  // Same component
                                    componentActive:        true                            // Already in scope
                                }).count() === 0;

                            //console.log("Scenario " + scenario._id + " not already scoped = " + notAlreadyScopedScenario);

                            if(notAlreadyScopedScenario){
                                includedScenarioCount++;
                            }
                        });

                        // Set as a parent item if any included scenarios exist
                        if(includedScenarioCount > 0){
                            WorkPackageComponents.update(
                                {_id: child._id},
                                {
                                    $set:{
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

    checkDescopeParents(workPackageId, componentRef){

        // Get the current component
        const component = WorkPackageComponents.findOne({
            workPackageId: workPackageId,
            componentReferenceId: componentRef
        });

        // If it has a parent...
        if(component.componentParentReferenceId != 'NONE'){

            // Get parent
            const parentComponent = WorkPackageComponents.findOne({
                workPackageId: workPackageId,
                componentReferenceId: component.componentParentReferenceId
            });

            // Get all children of the parent (i.e. siblings of component)
            const parentChildren = WorkPackageComponents.find({
                componentParentReferenceId: parentComponent.componentReferenceId,
                workPackageId:              workPackageId
            }).fetch();

            let hasInScopeChildren = false;

            // See if any of them are scoped
            parentChildren.forEach((child) => {
                if(child.componentActive || child.componentParent){
                    hasInScopeChildren = true;
                }
            });

            // If not make sure parent is descoped
            if(!hasInScopeChildren){
                WorkPackageComponents.update(
                    {_id: parentComponent._id},
                    {
                        $set:{
                            componentActive: false,
                            componentParent: false
                        }
                    }
                );

                // And then move on up
                this.checkDescopeParents(workPackageId, parentComponent.componentReferenceId);
            }

        }

    }


}

export default new WorkPackageModules();
