
import { toggleInScope } from '../apiValidatedMethods/work_package_component_methods.js'

// =====================================================================================================================
// Server API for Work Package Components
//
// Calls Meteor Validated Methods and returns asynchronous results to callback
// =====================================================================================================================
class ServerWorkPackageComponentApi {

    toggleInScope(view, displayContext, wpComponentId, newScope, callback){
        toggleInScope.call(
            {
                view: view,
                displayContext: displayContext,
                wpComponentId: wpComponentId,
                newScope: newScope
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };
}

export default new ServerWorkPackageComponentApi();
