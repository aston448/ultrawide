import {
    refreshDesignUpdateSummary
} from '../apiValidatedMethods/design_update_summary_methods.js'

// =====================================================================================================================
// Server API for Design Update Items
//
// Calls Meteor Validated Methods and returns asynchronous results to callback
// =====================================================================================================================
class ServerDesignUpdateSummaryApi {

     refreshDesignUpdateSummary(designUpdateId, callback) {

        refreshDesignUpdateSummary.call(
            {
                designUpdateId: designUpdateId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };
}
export default new ServerDesignUpdateSummaryApi();

