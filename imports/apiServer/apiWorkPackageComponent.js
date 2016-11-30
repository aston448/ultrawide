
import { toggleInScope } from '../apiValidatedMethods/work_package_component_methods.js'

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
