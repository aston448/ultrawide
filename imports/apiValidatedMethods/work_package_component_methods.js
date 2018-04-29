
import { Validation } from '../constants/validation_errors.js'

import { WorkPackageComponentServices }         from '../servicers/work/work_package_component_services.js';
import { WorkPackageComponentValidationApi }    from '../apiValidation/apiWorkPackageComponentValidation.js';

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
        userContext:        {type: Object, blackbox: true},
        designComponentId:      {type: String},
        newScope:           {type: Boolean}
    }).validator(),

    run({view, displayContext, userContext, designComponentId, newScope}){

        // Server validation
        const result = WorkPackageComponentValidationApi.validateToggleInScope(view, displayContext, userContext, designComponentId);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('workPackageComponent.toggleInScope.failValidation', result)
        }

        // Server action
        try {
            WorkPackageComponentServices.toggleScope(designComponentId, view, userContext, newScope);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }

});

