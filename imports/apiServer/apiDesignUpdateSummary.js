import {
    refreshDesignUpdateSummary
} from '../apiValidatedMethods/design_update_summary_methods.js'

// =====================================================================================================================
// Server API for Design Update Items
//
// Calls Meteor Validated Methods and returns asynchronous results to callback
// =====================================================================================================================
class ServerDesignUpdateSummaryApi {

     refreshDesignUpdateSummary(userContext, callback) {

        refreshDesignUpdateSummary.call(
            {
                userContext: userContext
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };
}
export default new ServerDesignUpdateSummaryApi();

