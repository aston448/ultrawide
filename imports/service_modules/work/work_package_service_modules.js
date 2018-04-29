
// Ultrawide Services
import { WorkPackageType, ComponentType, WorkPackageScopeType, LogLevel } from '../../constants/constants.js';
import { log }        from '../../common/utils.js';

// Data Access
import { DesignComponentData }          from '../../data/design/design_component_db.js';
import { DesignUpdateComponentData }    from '../../data/design_update/design_update_component_db.js';
import { WorkPackageData }              from '../../data/work/work_package_db.js';
import { WorkPackageComponentData }    from '../../data/work/work_package_component_db.js';

//======================================================================================================================
//
// Server Modules for Work Package Items.
//
// Methods called from within main API methods
//
//======================================================================================================================

class WorkPackageModulesClass {

    addWorkPackageComponent(userContext, wpType, component, scopeType){

        // Check that this component is not already there...
        const wpComponent = WorkPackageComponentData.getWpComponentByComponentRef(userContext.workPackageId, component.componentReferenceId);

        if(!wpComponent) {

            let otherWp = null;

            // If component is Scenario and already exists in other WP for this DV, don't add it
            if (component.componentType === ComponentType.SCENARIO) {

                otherWp = WorkPackageComponentData.getOtherDvWpComponentInstance(userContext.designVersionId, component.componentReferenceId, userContext.workPackageId);
            }

            if (!otherWp) {

                //console.log("Adding component " + component.componentNameNew + " to scope");

                WorkPackageComponentData.insertNewWorkPackageComponent(
                    userContext.designVersionId,
                    userContext.designUpdateId,
                    userContext.workPackageId,
                    wpType,
                    component,
                    scopeType
                );

                // And, if Scenario mark the design item as in the WP
                if (component.componentType === ComponentType.SCENARIO && scopeType === WorkPackageScopeType.SCOPE_ACTIVE) {
                    this.markScenario(wpType, component, userContext);
                }
            }

        } else {

            //console.log("Updating component " + component.componentNameNew + " to scope " + scopeType);

            // Component was already there.  If we are trying to activate it update the scope

            // Could be that this item was previously added to an update, removed and then added again  So update other details to be sure all is correct
            WorkPackageComponentData.updateExistingWpComponent(wpComponent._id, component, scopeType);

            // And, if Scenario mark the design item as in the WP
            if (component.componentType === ComponentType.SCENARIO && scopeType === WorkPackageScopeType.SCOPE_ACTIVE) {
                this.markScenario(wpType, component, userContext);
            }

        }
    };

    markScenario(wpType, component, userContext){

        if(wpType === WorkPackageType.WP_BASE){

            DesignComponentData.setWorkPackageId(component._id, userContext.workPackageId);

        } else {
            // Design Update Component

            DesignUpdateComponentData.setWorkPackageId(component._id, userContext.workPackageId);

            // Also set the WP in the base design version component
            DesignComponentData.setDvComponentWorkPackageId(userContext.designVersionId, component.componentReferenceId, userContext.workPackageId);
        }
    }

    removeWorkPackageComponent(userContext, designComponent){

        const wpComponent = WorkPackageComponentData.getWpComponentByComponentRef(userContext.workPackageId, designComponent.componentReferenceId);

        if(wpComponent) {

            WorkPackageComponentData.removeComponent(wpComponent._id);

            // And clear Design Item if Scenario
            if(wpComponent.componentType === ComponentType.SCENARIO) {

                const wp = WorkPackageData.getWorkPackageById(userContext.workPackageId);

                if (wp.workPackageType === WorkPackageType.WP_BASE) {

                    DesignComponentData.setWorkPackageId(designComponent._id, 'NONE');

                } else {

                    DesignUpdateComponentData.setWorkPackageId(designComponent._id, 'NONE');

                    // Also clear the WP in the base design version
                    DesignComponentData.setDvComponentWorkPackageId(userContext.designVersionId, wpComponent.componentReferenceId, 'NONE');
                }
            }
        }
    }

    addComponentChildrenToWp(userContext, wpType, parentComponent){

        const children = this.getChildren(userContext, wpType, parentComponent.componentReferenceId);

        if(children.length > 0){

            children.forEach((child) => {

                // Add as active component
                this.addWorkPackageComponent(userContext, wpType, child, WorkPackageScopeType.SCOPE_ACTIVE);

                // And carry on down
                this.addComponentChildrenToWp(userContext, wpType, child);
            });
        }

    }

    removeComponentChildrenFromWp(userContext, wpType, parentComponent){

        const children = this.getChildren(userContext, wpType, parentComponent.componentReferenceId);

        if(children.length > 0){

            children.forEach((child) => {

                // Remove
                this.removeWorkPackageComponent(userContext, child);

                // And carry on down
                this.removeComponentChildrenFromWp(userContext, wpType, child);
            });
        }
    }

    addComponentParentsToWp(userContext, wpType, childComponent){

        const parent = this.getParent(userContext, wpType, childComponent);

        if(parent){

            // Add as parent component
            this.addWorkPackageComponent(userContext, wpType, parent, WorkPackageScopeType.SCOPE_PARENT);

            //console.log("Adding component " + parent.componentNameNew + " as parent scope");

            // And carry on up
            this.addComponentParentsToWp(userContext, wpType, parent)
        }
    }

    removeChildlessParentsFromWp(userContext, wpType, childComponent){

        const parent = this.getParent(userContext, wpType, childComponent);

        if(parent){

            // See if this item has any other children that are still in scope or parents of in-scope
            const children = this.getChildren(userContext, wpType, parent.componentReferenceId);

            let wpComponent = null;
            let wpChild = false;

            children.forEach((child) => {

                wpComponent = WorkPackageComponentData.getWpComponentByComponentRef(userContext.workPackageId, child.componentReferenceId);

                if(wpComponent){
                    // The fact of finding a component means that there is valid stuff here
                    wpChild = true;
                }
            });

            if(!wpChild){
                this.removeWorkPackageComponent(userContext, parent);

                // And carry on up
                this.removeChildlessParentsFromWp(userContext, wpType, parent);
            }
        }
    }

    getParent(userContext, wpType, childComponent){

        let parent = null;

        // Nothing to do if already at top of tree
        if(childComponent.componentParentReferenceIdNew === 'NONE'){
            return null;
        }

        switch(wpType){
            case WorkPackageType.WP_BASE:

                parent = DesignComponentData.getDesignComponentByRef(userContext.designVersionId, childComponent.componentParentReferenceIdNew);
                break;

            case WorkPackageType.WP_UPDATE:

                parent = DesignUpdateComponentData.getUpdateComponentByRef(userContext.designVersionId, userContext.designUpdateId, childComponent.componentParentReferenceIdNew);
                break;
        }

        return parent;
    }

    getChildren(userContext, wpType, parentComponentReferenceId){

        let children = [];

        switch(wpType){
            case WorkPackageType.WP_BASE:

                children = DesignComponentData.getChildComponents(userContext.designVersionId, parentComponentReferenceId);
                break;

            case WorkPackageType.WP_UPDATE:

                children = DesignUpdateComponentData.getScopedChildComponents(userContext.designVersionId, userContext.designUpdateId, parentComponentReferenceId);
                break;
        }

        return children;
    }

    addNewDesignComponentToWorkPackage(workPackage, component, componentParentId, designVersionId, designUpdateId){

        let parentComponent = null;

        if(workPackage.workPackageType === WorkPackageType.WP_BASE){
            parentComponent = DesignComponentData.getDesignComponentById(componentParentId);
        } else {
            parentComponent = DesignUpdateComponentData.getUpdateComponentById(componentParentId);
        }

        let wpParentComponent = WorkPackageComponentData.getWpComponentByComponentRef(workPackage._id, parentComponent.componentReferenceId);

        // Can only add to a scoped component
        if (wpParentComponent){

            if((wpParentComponent.scopeType === WorkPackageScopeType.SCOPE_ACTIVE || wpParentComponent.scopeType === WorkPackageScopeType.SCOPE_PARENT)){

                log((msg) => console.log(msg), LogLevel.DEBUG, '  Scope OK...');

                const wpComponent = WorkPackageComponentData.getWpComponentByComponentRef(workPackage._id, component.componentReferenceId);

                if(wpComponent){

                    log((msg) => console.log(msg), LogLevel.DEBUG, '  Update existing');
                    // Update and set as Active Scope
                    WorkPackageComponentData.updateExistingWpComponent(wpComponent._id, component, WorkPackageScopeType.SCOPE_ACTIVE);

                } else {

                    log((msg) => console.log(msg), LogLevel.DEBUG, '  Add new');
                    // Add new Active component
                    WorkPackageComponentData.insertNewWorkPackageComponent(designVersionId, designUpdateId, workPackage._id, workPackage.workPackageType, component, WorkPackageScopeType.SCOPE_ACTIVE);
                }

                // And make sure if a DU WP Scenario we update the DU Scenario WP ID
                if(workPackage.workPackageType === WorkPackageType.WP_UPDATE && component.componentType === ComponentType.SCENARIO){

                    log((msg) => console.log(msg), LogLevel.DEBUG, '  Set WP Id {}', workPackage._id);

                    DesignUpdateComponentData.setWorkPackageId(component._id, workPackage._id);
                }

            } else {
                log((msg) => console.log(msg), LogLevel.WARN, '  WP Parent {} is out of scope - should not have been able to add an item to it', wpParentComponent.componentNameNew);
            }
        } else {
            log((msg) => console.log(msg), LogLevel.WARN, '  Undefined WP Parent for parent {}', parentComponent.componentNameNew);
        }
    };

    updateDesignComponentLocationInWorkPackage(reorder, workPackage, component, componentParent){

        const wpComponent = WorkPackageComponentData.getWpComponentByComponentRef(workPackage._id, component.componentReferenceId);

        if(reorder){

            // Just a reordering job so can keep the WP scope as it is
            if(wpComponent) {
                WorkPackageComponentData.updateExistingWpComponent(wpComponent._id, component, wpComponent.scopeType);
            }

        } else {

            // Moved to a new section so descope from WP if new parent not active

            let wpParent = null;

            let scopeType = WorkPackageScopeType.SCOPE_NONE;

            if(componentParent){

                wpParent = WorkPackageComponentData.getWpComponentByComponentRef(workPackage._id, componentParent.componentReferenceId);

                // Scope type follows parent
                if(wpParent){
                    scopeType = wpParent.scopeType;
                }
            }

            if(wpComponent){
                WorkPackageComponentData.updateExistingWpComponent(wpComponent._id, component, scopeType);
            }
        }
    };

    removeDesignComponentFromWorkPackage(workPackage, designComponentRef){

        const wpComponent = WorkPackageComponentData.getWpComponentByComponentRef(workPackage._id, designComponentRef);

        if(wpComponent){
            WorkPackageComponentData.removeComponent(wpComponent._id);
        }
    };
}

export const WorkPackageModules = new WorkPackageModulesClass();
