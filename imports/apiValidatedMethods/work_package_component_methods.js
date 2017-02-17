
import { Validation } from '../constants/validation_errors.js'

import WorkPackageComponentServices         from '../servicers/work/work_package_component_services.js';
import WorkPackageComponentValidationApi    from '../apiValidation/apiWorkPackageComponentValidation.js';

//======================================================================================================================
//
// Meteor Validated Methods for Work Package Components
//
//======================================================================================================================

export const toggleInScope = new ValidatedMethod({

    name: 'workPackageComponent.toggleInScope',

    validate: new SimpleSchema({
        view:               {type: String},
        displayContext:     {type: String},
        wpComponentId:      {type: String},
        newScope:           {type: Boolean}
    }).validator(),

    run({view, displayContext, wpComponentId, newScope}){

        // Server validation
        const result = WorkPackageComponentValidationApi.validateToggleInScope(view, displayContext, wpComponentId);

        if (result != Validation.VALID) {
            throw new Meteor.Error('workPackageComponent.toggleInScope.failValidation', result)
        }

        // Server action
        try {
            WorkPackageComponentServices.toggleScope(wpComponentId, newScope);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
        }
    }

});

