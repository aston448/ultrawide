
// Ultrawide Collections
import { WorkPackageComponents }        from '../../collections/work/work_package_components.js';
import { DesignVersionComponents }      from '../../collections/design/design_version_components.js';
import { DesignUpdateComponents }       from '../../collections/design_update/design_update_components.js';
// Ultrawide Services
import { ComponentType, ViewType, WorkPackageType, WorkPackageScopeType }            from '../../constants/constants.js';

import  WorkPackageModules          from '../../service_modules/work/work_package_service_modules.js';

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
                    designComponent = DesignVersionComponents.findOne({_id: designComponentId});
                    wpType = WorkPackageType.WP_BASE;
                    break;
                case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                    designComponent = DesignUpdateComponents.findOne({_id: designComponentId});
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

                    WorkPackageModules.removeWorkPackageComponent(userContext, designComponentId);

                    // And then all of its children
                    WorkPackageModules.removeComponentChildrenFromWp(userContext, wpType, designComponent);

                    // If the component's parent no longer has in scope children, descope it recursively upwards
                    WorkPackageModules.removeChildlessParentsFromWp(userContext, wpType, designComponent);

                }
            }
        }
    };

}

export default new WorkPackageComponentServices();

