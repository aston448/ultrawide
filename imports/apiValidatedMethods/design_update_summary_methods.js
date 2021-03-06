
import { Validation } from '../constants/validation_errors.js'

import DesignUpdateValidationApi      from '../apiValidation/apiDesignUpdateValidation.js';
import DesignUpdateSummaryServices    from '../servicers/summary/design_update_summary_services.js';

//======================================================================================================================
//
// Meteor Validated Methods for Design Update Items
//
//======================================================================================================================

export const refreshDesignUpdateSummary = new ValidatedMethod({

    name: 'designUpdateSummary.refreshDesignUpdateSummary',

    validate: new SimpleSchema({
        userContext:    {type: Object, blackbox: true},
        forceUpdate:    {type: Boolean}
    }).validator(),

    run({userContext, forceUpdate}){

        try {
            DesignUpdateSummaryServices.recreateDesignUpdateSummaryData(userContext, forceUpdate);
        } catch (e) {
            console.error(e);
            throw new Meteor.Error(e.error, e.details)
        }
    }

});


