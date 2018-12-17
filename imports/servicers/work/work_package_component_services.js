
// Ultrawide Services
import { ViewType, WorkPackageType, WorkPackageScopeType, LogLevel }            from '../../constants/constants.js';
import { log } from "../../common/utils";

import { WorkPackageModules }           from '../../service_modules/work/work_package_service_modules.js';
import { WorkPackageServices }          from '../../servicers/work/work_package_services.js';

// Data Access
import { DesignComponentData }          from '../../data/design/design_component_db.js';
import { DesignVersionData}             from "../../data/design/design_version_db";
import { DesignUpdateComponentData }    from '../../data/design_update/design_update_component_db.js';
import {WorkPackageComponentData}       from "../../data/work/work_package_component_db";
import {UserAcceptanceTestResultData}   from "../../data/test_results/user_acceptance_test_result_db";

//======================================================================================================================
//
// Server Code for Work Package Components.
//
// Methods called directly by Server API
//
//======================================================================================================================

class WorkPackageComponentServicesClass{

    // Store the scope state of a WP component

    toggleScope(designComponentId, view, userContext, newScope){

        if(Meteor.isServer) {

            let designComponent = null;
            let wpType = '';

            switch(view){
                case ViewType.WORK_PACKAGE_BASE_EDIT:
                    designComponent = DesignComponentData.getDesignComponentById(designComponentId);
                    wpType = WorkPackageType.WP_BASE;
                    break;
                case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                    designComponent = DesignUpdateComponentData.getUpdateComponentById(designComponentId);
                    wpType = WorkPackageType.WP_UPDATE;
                    break;
            }

            log((msg) => console.log(msg), LogLevel.INFO, 'Toggling component {} WP scope to {}', designComponent.componentNameNew, newScope);

            if (designComponent) {

                // Get only relevant WP data for efficiency.
                let dvWorkPackageComponentsDb = new Mongo.Collection(null);
                let dvDesignComponentsDb = new Mongo.Collection(null);

                const dvWorkPackageComponents = WorkPackageComponentData.getCurrentDesignVersionComponents(userContext.designVersionId);
                dvWorkPackageComponentsDb.batchInsert(dvWorkPackageComponents);

                const dvDesignComponents = DesignVersionData.getAllComponents(userContext.designVersionId);
                dvDesignComponentsDb.batchInsert(dvDesignComponents);

                if (newScope) {

                    // When a component is put in scope, all its parents come into scope as parents.
                    // Also, putting a component in scope adds all its children.
                    // Except for Scenarios if they are already in other WPs

                    //console.log("Adding component " + designComponent.componentNameNew + " to WP scope");

                    // Build a list of stuff to add for one bulk update at the end...
                    let wpComponentList = [];

                    // Add any required parents as parent scope
                    wpComponentList = WorkPackageModules.addComponentParentsToWp(userContext, wpType, designComponent, wpComponentList, dvWorkPackageComponentsDb, dvDesignComponentsDb);

                    log((msg) => console.log(msg), LogLevel.INFO, '  Added {} parents to WP', wpComponentList.length);

                    // Add the component itself.
                    wpComponentList = WorkPackageModules.addWorkPackageComponent(userContext, wpType, designComponent, WorkPackageScopeType.SCOPE_ACTIVE, wpComponentList, dvWorkPackageComponentsDb);

                    log((msg) => console.log(msg), LogLevel.INFO, '  Added component to WP');

                    // Add all valid children
                    wpComponentList = WorkPackageModules.addComponentChildrenToWp(userContext, wpType, designComponent, wpComponentList, dvWorkPackageComponentsDb, dvDesignComponentsDb);

                    log((msg) => console.log(msg), LogLevel.INFO, '  Added component children to WP');

                    // Actual update of all items
                    WorkPackageComponentData.bulkInsertWpComponents(wpComponentList);

                    log((msg) => console.log(msg), LogLevel.INFO, '  Bulk insert of {} items complete', wpComponentList.length);

                } else {

                    // When a component is put out of scope...
                    // All children are taken out of scope.
                    // Any parent that no longer has children goes

                    let removedComponentsList = [];

                    removedComponentsList.push(designComponent.componentReferenceId);
                    WorkPackageModules.removeWorkPackageComponent(userContext, designComponent, dvWorkPackageComponentsDb, dvDesignComponentsDb, false);

                    log((msg) => console.log(msg), LogLevel.INFO, '  Removed component from WP');

                    // And then all of its children
                    removedComponentsList = WorkPackageModules.removeComponentChildrenFromWp(userContext, wpType, designComponent, dvWorkPackageComponentsDb, dvDesignComponentsDb, removedComponentsList);

                    // Remove all unwanted components
                    WorkPackageComponentData.bulkRemoveComponents(userContext.designVersionId, removedComponentsList);

                    log((msg) => console.log(msg), LogLevel.INFO, '  Removed component children from WP');

                    // If the component's parent no longer has in scope children, descope it recursively upwards
                    WorkPackageModules.removeChildlessParentsFromWp(userContext, wpType, designComponent, dvWorkPackageComponentsDb, dvDesignComponentsDb);

                    log((msg) => console.log(msg), LogLevel.INFO, '  Removed unneeded parents from WP');

                }

                // As the WP scope has changed, recalculate the completeness
                WorkPackageServices.updateWorkPackageTestCompleteness(userContext, userContext.workPackageId);

                log((msg) => console.log(msg), LogLevel.INFO, 'Updated Test Completeness');

            }
        }
    };

}

export const WorkPackageComponentServices = new WorkPackageComponentServicesClass();

