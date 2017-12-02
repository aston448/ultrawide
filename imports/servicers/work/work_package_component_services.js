
// Ultrawide Services
import { ViewType, WorkPackageType, WorkPackageScopeType }            from '../../constants/constants.js';

import WorkPackageModules           from '../../service_modules/work/work_package_service_modules.js';
import WorkPackageServices          from '../../servicers/work/work_package_services.js';

// Data Access
import DesignComponentData          from '../../data/design/design_component_db.js';
import DesignUpdateComponentData    from '../../data/design_update/design_update_component_db.js';

//======================================================================================================================
//
// Server Code for Work Package Components.
//
// Methods called directly by Server API
//
//======================================================================================================================

class WorkPackageComponentServices{

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

            if (designComponent) {

                if (newScope) {

                    // When a component is put in scope, all its parents come into scope as parents.
                    // Also, putting a component in scope adds all its children.
                    // Except for Scenarios if they are already in other WPs

                    //console.log("Adding component " + designComponent.componentNameNew + " to WP scope");

                    // Add any required parents as parent scope
                    WorkPackageModules.addComponentParentsToWp(userContext, wpType, designComponent);

                    // Add the component itself
                    WorkPackageModules.addWorkPackageComponent(userContext, wpType, designComponent, WorkPackageScopeType.SCOPE_ACTIVE);

                    // Add all valid children
                    WorkPackageModules.addComponentChildrenToWp(userContext, wpType, designComponent);



                } else {

                    // When a component is put out of scope...
                    // All children are taken out of scope.
                    // Any parent that no longer has children goes

                    WorkPackageModules.removeWorkPackageComponent(userContext, designComponent);

                    // And then all of its children
                    WorkPackageModules.removeComponentChildrenFromWp(userContext, wpType, designComponent);

                    // If the component's parent no longer has in scope children, descope it recursively upwards
                    WorkPackageModules.removeChildlessParentsFromWp(userContext, wpType, designComponent);

                }

                // As the WP scope has changed, recalculate the completeness
                WorkPackageServices.updateWorkPackageTestCompleteness(userContext, userContext.workPackageId);

            }
        }
    };

}

export default new WorkPackageComponentServices();

