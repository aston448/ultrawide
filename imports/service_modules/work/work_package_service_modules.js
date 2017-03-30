
// Ultrawide Collections
import { WorkPackages }                 from '../../collections/work/work_packages.js';
import { WorkPackageComponents }        from '../../collections/work/work_package_components.js';
import { DesignVersionComponents }      from '../../collections/design/design_version_components.js';
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

    addWorkPackageComponent(userContext, wpType, component, activeScope){

        // Check that this component is not already there...
        const wpComponent = WorkPackageComponents.findOne({
            workPackageId:  userContext.workPackageId,
            componentId:    component._id,
        });

        if(!wpComponent) {

            const parentScope = !activeScope;
            let otherWp = null;

            // If component is Scenario and already exists in other WP, don't add it
            if (component.componentType === ComponentType.SCENARIO) {

                otherWp = WorkPackageComponents.findOne({
                    componentId:    component._id,
                    workPackageId:  {$ne: userContext.workPackageId}
                });


            }

            if (!otherWp) {
                WorkPackageComponents.insert(
                    {
                        designVersionId:                userContext.designVersionId,
                        workPackageId:                  userContext.workPackageId,
                        workPackageType:                wpType,
                        componentId:                    component._id,
                        componentReferenceId:           component.componentReferenceId,
                        componentType:                  component.componentType,
                        componentParentReferenceId:     component.componentParentReferenceIdNew,
                        componentFeatureReferenceId:    component.componentFeatureReferenceIdNew,
                        componentIndex:                 component.componentIndexNew,
                        componentParent:                parentScope,
                        componentActive:                activeScope
                    }
                );

                // And, if Scenario mark the design item as in the WP
                if (component.componentType === ComponentType.SCENARIO) {
                    if(wpType === WorkPackageType.WP_BASE){
                        DesignVersionComponents.update(
                            {_id: component._id},
                            {
                                $set: {workPackageId: userContext.workPackageId}
                            }
                        );
                    } else {
                        DesignUpdateComponents.update(
                            {_id: component._id},
                            {
                                $set: {workPackageId: userContext.workPackageId}
                            }
                        );
                    }
                }
            }

        } else {

            // Component was already there.  If was a parent and we are trying to activate it update the scope
            if(wpComponent.componentParent && activeScope){

                // No need to add anything, just update it
                WorkPackageComponents.update(
                    {_id: wpComponent._id},
                    {
                        $set:{
                            componentParent:                false,
                            componentActive:                true
                        }
                    }
                );
            }
        }
    };

    removeWorkPackageComponent(userContext, designComponentId){

        const wpComponent = WorkPackageComponents.findOne({
            workPackageId:              userContext.workPackageId,
            componentId:                designComponentId
        });

        if(wpComponent) {

            WorkPackageComponents.remove({_id: wpComponent._id});

            // And clear Design Item if Scenario
            if(wpComponent.componentType === ComponentType.SCENARIO) {

                const wp = WorkPackages.findOne({_id: userContext.workPackageId});

                if (wp.workPackageType === WorkPackageType.WP_BASE) {
                    DesignVersionComponents.update(
                        {_id: designComponentId},
                        {
                            $set: {workPackageId: 'NONE'}
                        }
                    );
                } else {
                    DesignUpdateComponents.update(
                        {_id: designComponentId},
                        {
                            $set: {workPackageId: 'NONE'}
                        }
                    );
                }
            }
        }
    }

    addComponentChildrenToWp(userContext, wpType, parentComponent){

        const children = this.getChildren(userContext, wpType, parentComponent._id);

        if(children.length > 0){

            children.forEach((child) => {

                // Add as active component
                this.addWorkPackageComponent(userContext, wpType, child, true);

                // And carry on down
                this.addComponentChildrenToWp(userContext, wpType, child);
            });
        }

    }

    removeComponentChildrenFromWp(userContext, wpType, parentComponent){

        const children = this.getChildren(userContext, wpType, parentComponent._id);

        if(children.length > 0){

            children.forEach((child) => {

                // Remove
                this.removeWorkPackageComponent(userContext, child._id);

                // And carry on down
                this.removeComponentChildrenFromWp(userContext, wpType, child);
            });
        }
    }

    addComponentParentsToWp(userContext, wpType, childComponent){

        const parent = this.getParent(userContext, wpType, childComponent);

        if(parent){

            // Add as parent component
            this.addWorkPackageComponent(userContext, wpType, parent, false);

            // And carry on up
            this.addComponentParentsToWp(userContext, wpType, parent)
        }
    }

    removeChildlessParentsFromWp(userContext, wpType, childComponent){

        const parent = this.getParent(userContext, wpType, childComponent);

        if(parent){

            // See if this item has any other children that are still in scope
            const children = this.getChildren(userContext, wpType, parent._id);

            let wpComponent = null;
            let activeChild = false;

            children.forEach((child) => {

                wpComponent = WorkPackageComponents.findOne({
                    workPackageId:  userContext.workPackageId,
                    componentId:    child._id
                });

                if(wpComponent){
                    if(wpComponent.componentActive){
                        activeChild = true;
                    }
                }
            });

            if(!activeChild){
                this.removeWorkPackageComponent(userContext, parent._id);

                // And carry on up
                this.removeChildlessParentsFromWp(userContext, wpType, parent);
            }

        }

    }

    getParent(userContext, wpType, childComponent){

        let parent = null;

        // Nothing to do if already at top of tree
        if(childComponent.componentParentIdNew === 'NONE'){
            return null;
        }

        switch(wpType){
            case WorkPackageType.WP_BASE:
                parent = DesignVersionComponents.findOne({
                    designVersionId:    userContext.designVersionId,
                    _id:                childComponent.componentParentIdNew
                });
                break;
            case WorkPackageType.WP_UPDATE:
                parent = DesignUpdateComponents.findOne({
                    designVersionId:    userContext.designVersionId,
                    _id:                childComponent.componentParentIdNew
                });
                break;
        }

        return parent;
    }

    getChildren(userContext, wpType, parentComponentId){

        let children = [];

        switch(wpType){
            case WorkPackageType.WP_BASE:
                children = DesignVersionComponents.find({
                    designVersionId:        userContext.designVersionId,
                    componentParentIdNew:   parentComponentId
                }).fetch();
                break;
            case WorkPackageType.WP_UPDATE:
                children = DesignUpdateComponents.find({
                    designVersionId:        userContext.designVersionId,
                    designUpdateId:         userContext.designUpdateId,
                    componentParentIdNew:   parentComponentId
                }).fetch();
                break;
        }

        return children;
    }

    addNewDesignComponentToWorkPackage(workPackage, component, componentParentId, designVersionId){

        let wpActiveParentComponent = WorkPackageComponents.findOne({
            workPackageId: workPackage._id,
            componentId: componentParentId,
            componentActive: true
        });

        if (wpActiveParentComponent){

            let wpComponentId = WorkPackageComponents.insert(
                {
                    designVersionId:                designVersionId,
                    workPackageId:                  workPackage._id,
                    workPackageType:                workPackage.workPackageType,
                    componentId:                    component._id,
                    componentReferenceId:           component.componentReferenceId,
                    componentType:                  component.componentType,
                    componentParentReferenceId:     component.componentParentReferenceIdNew,
                    componentFeatureReferenceId:    component.componentFeatureReferenceIdNew,
                    componentIndex:                 component.componentIndexNew,
                    componentParent:                false,
                    componentActive:                true
                }
            );

        }
    };

    updateDesignComponentLocationInWorkPackage(reorder, workPackage, component, componentParent){

        if(reorder){
            // Just a reordering job so can keep the WP scope as it is
            WorkPackageComponents.update(
                {
                    workPackageId:                  workPackage._id,
                    componentId:                    component._id
                },
                {
                    $set:{
                        componentParentReferenceId:     component.componentParentReferenceIdNew,
                        componentFeatureReferenceId:    component.componentFeatureReferenceIdNew,
                        componentIndex:                 component.componentIndexNew,
                    }
                },
                {multi: true}
            );
        } else {
            // Moved to a new section so descope from WP if new parent not active

            let wpParent = null;
            let isActive = false;
            let isParent = false;

            if(componentParent){
                wpParent = WorkPackageComponents.findOne({
                    workPackageId:  workPackage._id,
                    componentId:    componentParent._id
                });

                if(wpParent){
                    isActive = wpParent.componentActive;
                    // Moved retains parent status is its parent is a parent and we have decided it isn't active
                    isParent = ((!isActive) && wpParent.componentParent);
                }
            }

            WorkPackageComponents.update(
                {
                    workPackageId:                  workPackage._id,
                    componentId:                    component._id
                },
                {
                    $set:{
                        componentParentReferenceId:         component.componentParentReferenceId,
                        componentFeatureReferenceId:        component.componentFeatureReferenceIdNew,
                        componentLevel:                     component.componentLevel,
                        componentIndex:                     component.componentIndexNew,
                        componentParent:                    isParent,      // Reset WP status
                        componentActive:                    isActive
                    }
                },
                {multi: true}
            );
        }
    };

    removeDesignComponentFromWorkPackage(workPackageId, designComponentId){

        WorkPackageComponents.remove(
            {
                workPackageId:  workPackageId,
                componentId:    designComponentId
            }
        );
    };
}

export default new WorkPackageModules();
