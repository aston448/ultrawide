
import { Validation } from '../constants/validation_errors.js'

import DesignUpdateValidationApi      from '../apiValidation/apiDesignUpdateValidation.js';
import DesignUpdateSummaryServices    from '../servicers/design_update/design_update_summary_services.js';

//======================================================================================================================
//
// Meteor Validated Methods for Design Update Items
//
//======================================================================================================================

export const refreshDesignUpdateSummary = new ValidatedMethod({

    name: 'designUpdateSummary.refreshDesignUpdateSummary',

    validate: new SimpleSchema({
        userContext:     {type: Object, blackbox: true}
    }).validator(),

    run({userContext}){

        try {
            DesignUpdateSummaryServices.recreateDesignUpdateSummaryData(userContext);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
        }
    }

});


