
// Ultrawide Collections
import { WorkPackageComponents }    from '../../collections/work/work_package_components.js';

// Ultrawide Services
import { ComponentType }            from '../../constants/constants.js';

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
    toggleScope(wpComponentId, newScope){

        if(Meteor.isServer) {

            const wpComponent = WorkPackageComponents.findOne({_id: wpComponentId});

            if (wpComponent) {
                let startingComponentRef = wpComponent.componentReferenceId;
                let parentRefId = wpComponent.componentParentReferenceId;
                let currentWpComponent = wpComponent;
                const currentWorkPackage = wpComponent.workPackageId;

                if (newScope) {
                    // When a component is put in scope, all its parents come into scope as parents.
                    // Also, putting a component in scope adds all its children.
                    // Only Features and Scenarios are actively in scope - rest are just parent scope.

                    // Mark current component as in scope
                    switch (currentWpComponent.componentType) {
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
                    WorkPackageModules.scopeChildren(currentWorkPackage, startingComponentRef);

                } else {
                    // When a component is put out of scope...
                    // All children are taken out of scope.
                    // Any parent that no longer has children goes

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
                    WorkPackageModules.deScopeChildren(currentWorkPackage, startingComponentRef);

                }
            }
        }
    };

}

export default new WorkPackageComponentServices();

