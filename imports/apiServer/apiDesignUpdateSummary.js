import {
    refreshDesignUpdateSummary
} from '../apiValidatedMethods/design_update_summary_methods.js'

// =====================================================================================================================
// Server API for Design Update Items
//
// Calls Meteor Validated Methods and returns asynchronous results to callback
// =====================================================================================================================
class ServerDesignUpdateSummaryApiClass {

     refreshDesignUpdateSummary(userContext, forceUpdate, callback) {

        refreshDesignUpdateSummary.call(
            {
                userContext:    userContext,
                forceUpdate:    forceUpdate
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };
}
export const ServerDesignUpdateSummaryApi = new ServerDesignUpdateSummaryApiClass();

