
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class WpComponentVerifications{

    componentExistsForManagerCurrentWp(type, parentName, name){
        server.call('verifyWorkPackageComponents.componentExistsInCurrentWpCalled', type, parentName, name, 'miles',
            (function(error, result){
                return(error === null);
            })
        )
    };

    componentIsInScopeForManagerCurrentWp(type, parentName, name){
        server.call('verifyWorkPackageComponents.currentWpComponentIsInScope', type, parentName, name, 'miles',
            (function(error, result){
                return(error === null);
            })
        )
    }

    componentIsInParentScopeForManagerCurrentWp(type, parentName, name){
        server.call('verifyWorkPackageComponents.currentWpComponentIsInParentScope', type, parentName, name, 'miles',
            (function(error, result){
                return(error === null);
            })
        )
    }

    componentIsNotInScopeForManagerCurrentWp(type, parentName, name){
        server.call('verifyWorkPackageComponents.currentWpComponentIsNotInScope', type, parentName, name, 'miles',
            (function(error, result){
                return(error === null);
            })
        )
    }
}

export default new WpComponentVerifications();
