
// Ultrawide Collections
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

        WorkPackageComponents.remove({
            workPackageId:              userContext.workPackageId,
            componentId:                designComponentId
        });
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
}

export default new WorkPackageModules();
