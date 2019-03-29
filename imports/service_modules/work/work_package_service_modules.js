
// Ultrawide Services
import { WorkPackageType, ComponentType, WorkPackageScopeType, LogLevel } from '../../constants/constants.js';
import { log }        from '../../common/utils.js';

// Data Access
import { DesignComponentData }          from '../../data/design/design_component_db.js';
import { DesignUpdateComponentData }    from '../../data/design_update/design_update_component_db.js';
import { WorkPackageData }              from '../../data/work/work_package_db.js';
import { WorkPackageComponentData }    from '../../data/work/work_package_component_db.js';
import {DesignComponentModules} from "../design/design_component_service_modules";

//======================================================================================================================
//
// Server Modules for Work Package Items.
//
// Methods called from within main API methods
//
//======================================================================================================================

class WorkPackageModulesClass {

    addWorkPackageComponent(userContext, wpType, component, scopeType, wpComponentList){

        // Check that this component is not already there...
        //log((msg) => console.log(msg), LogLevel.INFO, '    Get WP Component...');
        const wpComponent = WorkPackageComponentData.getWpComponentByComponentRef(userContext.workPackageId, component.componentReferenceId);
        //log((msg) => console.log(msg), LogLevel.INFO, '    Got WP Component...');

        if(!wpComponent) {

            let otherWp = null;

            // If component is Scenario and already exists in other OPEN WP for this DV, don't add it
            if (component.componentType === ComponentType.SCENARIO) {

                //log((msg) => console.log(msg), LogLevel.INFO, '    Check other instance...');
                otherWp = WorkPackageComponentData.getOtherDvWpComponentInstance(userContext.designVersionId, component.componentReferenceId, userContext.workPackageId);

                //log((msg) => console.log(msg), LogLevel.INFO, '    Checked');
            }

            if (!otherWp) {

                //console.log("Adding component " + component.componentNameNew + " to scope");

                const newComponent =   {
                    designVersionId:                userContext.designVersionId,
                    designUpdateId:                 userContext.designUpdateId,
                    workPackageId:                  userContext.workPackageId,
                    workPackageType:                wpType,
                    componentReferenceId:           component.componentReferenceId,
                    componentType:                  component.componentType,
                    componentParentReferenceId:     component.componentParentReferenceIdNew,
                    componentFeatureReferenceId:    component.componentFeatureReferenceIdNew,
                    componentIndex:                 component.componentIndexNew,
                    scopeType:                      scopeType
                };

                wpComponentList.push(newComponent);

                // And, if Scenario mark the design item as in the WP
                if (component.componentType === ComponentType.SCENARIO && scopeType === WorkPackageScopeType.SCOPE_ACTIVE) {
                    //log((msg) => console.log(msg), LogLevel.INFO, '    Mark Scenario...');
                    this.markScenario(wpType, component, userContext);
                    //log((msg) => console.log(msg), LogLevel.INFO, '    Marked...');
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

        return wpComponentList;
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

    removeMigratedWpScenarios(workPackageId){

        const wpScenarios = WorkPackageData.getActiveScenarios(workPackageId);

        wpScenarios.forEach((wpScenario) => {

            // Get the DV Component
            const dvComponent = DesignComponentData.getDesignComponentByRef(wpScenario.designVersionId, wpScenario.componentReferenceId);

            if(dvComponent){
                if(dvComponent.workPackageId !== wpScenario.workPackageId){
                    // It's moved on so remove from this WP
                    WorkPackageComponentData.removeComponent(wpScenario._id);
                }
            }
        })
    }

    removeWorkPackageComponent(userContext, designComponent, doDelete){

        const wpComponent = WorkPackageComponentData.getWpComponentByComponentRef(userContext.workPackageId, designComponent.componentReferenceId);

        if(wpComponent) {

            //console.log('Removing component ' + wpComponent._id);
            if(doDelete){
                //console.log('Removing component ' + wpComponent._id);
                WorkPackageComponentData.removeComponent(wpComponent._id);
            }

            // Clear Design Item if Scenario
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

    addComponentChildrenToWp(userContext, wpType, parentComponent, componentsToAdd){

        let children = [];

        switch(parentComponent.componentType){

            case ComponentType.FEATURE:

                log((msg) => console.log(msg), LogLevel.PERF, '    Adding Feature Children');

                // When hitting the feature level, get all feature components
                children = this.getFeatureChildren(userContext, wpType, parentComponent.componentReferenceId);

                log((msg) => console.log(msg), LogLevel.PERF, '    Got Feature Children {}', children.length);

                children.forEach((child) => {

                    // Add as active component
                    componentsToAdd = this.addWorkPackageComponent(userContext, wpType, child, WorkPackageScopeType.SCOPE_ACTIVE, componentsToAdd);

                    // And that's it...
                });

                log((msg) => console.log(msg), LogLevel.PERF, '    Done Feature');
                break;

            default:

                // At any other level do the recursive thing
                log((msg) => console.log(msg), LogLevel.PERF, '    Adding Other Component Children');

                children = DesignComponentModules.getAllDvChildComponents(parentComponent);

                log((msg) => console.log(msg), LogLevel.PERF, '    Got Other Children {}', children.length);

                children.forEach((child) => {

                    // Add as active component
                    componentsToAdd = this.addWorkPackageComponent(userContext, wpType, child, WorkPackageScopeType.SCOPE_ACTIVE, componentsToAdd);

                });

                log((msg) => console.log(msg), LogLevel.PERF, '    Done Other');
        }

        return componentsToAdd;
    }

    removeComponentChildrenFromWp(userContext, wpType, parentComponent, removedComponentsList){

        const children = DesignComponentModules.getAllDvChildComponents(parentComponent);

        if(children.length > 0){

            children.forEach((child) => {

                // Set to Remove
                removedComponentsList.push(child.componentReferenceId);
                this.removeWorkPackageComponent(userContext, child, false);

             });
        }

        return removedComponentsList
    }

    addComponentParentsToWp(userContext, wpType, childComponent, componentsToAdd){

        if(wpType === WorkPackageType.WP_BASE){

            const dvParents = DesignComponentModules.getAllDvComponentParents(childComponent);

            dvParents.forEach((parent) => {
                componentsToAdd = this.addWorkPackageComponent(userContext, wpType, parent, WorkPackageScopeType.SCOPE_PARENT, componentsToAdd);
            });

        } else {

            const parent = this.getParent(userContext, wpType, childComponent);

            if(parent){

                // Add as parent component
                componentsToAdd = this.addWorkPackageComponent(userContext, wpType, parent, WorkPackageScopeType.SCOPE_PARENT, componentsToAdd);

                //console.log("Adding component " + parent.componentNameNew + " as parent scope");

                // And carry on up
                this.addComponentParentsToWp(userContext, wpType, parent, componentsToAdd)
            }

        }

        return componentsToAdd;
    }

    removeChildlessParentsFromWp(userContext, wpType, removedComponent){

        const parents = DesignComponentModules.getAllDvComponentParents(removedComponent);

        // See if any remaining WP Scenarios have this parent
        const wpScenarios = DesignComponentData.getDvScenariosInWorkPackage(userContext.designVersionId, userContext.workPackageId);

        parents.forEach((parent) => {

            log((msg) => console.log(msg), LogLevel.PERF, '    Processing Parent {}', parent.componentNameNew);

            let wpChild = false;

            wpScenarios.forEach((scenario) => {

                if (!wpChild) {

                    switch (parent.componentType) {

                        case ComponentType.APPLICATION:
                            if (scenario.appRef === parent.componentReferenceId) {
                                wpChild = true;
                            }
                            break;

                        case ComponentType.DESIGN_SECTION:

                            switch(parent.componentLevel){

                                case 1:
                                    if (scenario.s1Ref === parent.componentReferenceId) {
                                        wpChild = true;
                                    }
                                    break;

                                case 2:
                                    if (scenario.s2Ref === parent.componentReferenceId) {
                                        wpChild = true;
                                    }
                                    break;

                                case 3:
                                    if (scenario.s3Ref === parent.componentReferenceId) {
                                        wpChild = true;
                                    }
                                    break;

                                case 4:
                                    if (scenario.s4Ref === parent.componentReferenceId) {
                                        wpChild = true;
                                    }
                                    break;
                            }
                            break;

                        case ComponentType.FEATURE:
                            if (scenario.featureRef === parent.componentReferenceId) {
                                wpChild = true;
                            }
                            break;

                        case ComponentType.FEATURE_ASPECT:
                            if (scenario.aspectRef === parent.componentReferenceId) {
                                wpChild = true;
                            }
                            break;
                    }
                }
            });

            if(!wpChild){

                 this.removeWorkPackageComponent(userContext, parent, true);

                log((msg) => console.log(msg), LogLevel.PERF, '    Removed Component');

            }
        });
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

    getFeatureChildren(userContext, wpType, featureReferenceId){

        let children = [];

        switch(wpType){
            case WorkPackageType.WP_BASE:

                children = DesignComponentData.getFeatureComponents(userContext.designVersionId, featureReferenceId);
                break;

            case WorkPackageType.WP_UPDATE:

                //children = DesignUpdateComponentData.getScopedChildComponents(userContext.designVersionId, userContext.designUpdateId, parentComponentReferenceId);
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
