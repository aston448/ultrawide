
import { toggleInScope } from '../apiValidatedMethods/work_package_component_methods.js'

// =====================================================================================================================
// Server API for Work Package Components
//
// Calls Meteor Validated Methods and returns asynchronous results to callback
// =====================================================================================================================
class ServerWorkPackageComponentApiClass {

    toggleInScope(view, displayContext, userContext, designComponentId, newScope, callback){
        toggleInScope.call(
            {
                view: view,
                displayContext: displayContext,
                userContext: userContext,
                designComponentId: designComponentId,
                newScope: newScope
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };
}

export const ServerWorkPackageComponentApi = new ServerWorkPackageComponentApiClass();
