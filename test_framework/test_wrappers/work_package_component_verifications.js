
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class WpComponentVerifications{

    // This means a component is available to add to the WP scope (unless it has already been added to another WP)
    componentIsAvailableForManagerCurrentWp(type, parentName, name){
        server.call('verifyWorkPackageComponents.componentExistsInCurrentWpCalled', type, parentName, name, 'miles',
            (function(error, result){
                return(error === null);
            })
        )
    };

    // This means the component is not available to add to the WP scope - probably because it is not in an Update scope
    componentIsNotAvailableForManagerCurrentWp(type, parentName, name){
        server.call('verifyWorkPackageComponents.componentDoesNotExistInCurrentWpCalled', type, parentName, name, 'miles',
            (function(error, result){
                return(error === null);
            })
        )
    };

    // This means component is a Feature or Scenario in the WP scope
    componentIsInScopeForManagerCurrentWp(type, parentName, name){
        server.call('verifyWorkPackageComponents.currentWpComponentIsInScope', type, parentName, name, 'miles',
            (function(error, result){
                return(error === null);
            })
        )
    }

    // This means component is a parent of a Feature or Scenario component that is in the WP scope
    componentIsInParentScopeForManagerCurrentWp(type, parentName, name){
        server.call('verifyWorkPackageComponents.currentWpComponentIsInParentScope', type, parentName, name, 'miles',
            (function(error, result){
                return(error === null);
            })
        )
    }

    // This means it could be added to the WP but hasn't been
    componentIsNotInScopeForManagerCurrentWp(type, parentName, name){
        server.call('verifyWorkPackageComponents.currentWpComponentIsNotInScope', type, parentName, name, 'miles',
            (function(error, result){
                return(error === null);
            })
        )
    }


    managerSelectedComponentIsAboveComponent_WithParent_Called_(targetType, targetParentName, targetName){
        server.call('verifyWorkPackageComponents.currentWpComponentIsAboveComponent', targetType, targetParentName, targetName, 'miles',
            (function(error, result){
                return(error === null);
            })
        );
    }

    managerSelectedFeatureNarrativeIs(narrativeText){
        server.call('verifyWorkPackageComponents.currentWpFeatureNarrativeIs', narrativeText, 'miles',
            (function(error, result){
                return(error === null);
            })
        );
    }

    componentIsInDeveloperCurrentWp(componentType, parentName, componentName){
        server.call('verifyWorkPackageComponents.componentExistsInCurrentWpCalled', componentType, parentName, componentName, 'hugh',
            (function(error, result){
                return(error === null);
            })
        )
    }
}

export default new WpComponentVerifications();
