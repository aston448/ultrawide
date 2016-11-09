
import DesignValidationApi      from '../apiValidation/apiDesignValidation.js';
import DesignServices           from '../servicers/design_services.js';


export const addDesign = new ValidatedMethod({

    name: 'design.addDesign',

    validate: new SimpleSchema({
        userRole: {type: String}
    }).validator(),

    run({userRole}){

        const result = DesignValidationApi.validateAddDesign(userRole);

        console.log("Add design validation result: " + result);

        if (result != 'VALID') {
            throw new Meteor.Error('design.addDesign.failValidation', result)
        }

        console.log("Adding Design");

        try {
            DesignServices.addDesign(true);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('design.addDesign.fail', e)
        }
    }

});

export const removeDesign = new ValidatedMethod({

    name: 'design.removeDesign',

    validate: new SimpleSchema({
        userRole: {type: String},
        designId: {type: String}
    }).validator(),

    run({userRole, designId}){

        const result = DesignValidationApi.validateRemoveDesign(userRole, designId);

        console.log("Remove design validation result: " + result);

        if (result != 'VALID') {
            throw new Meteor.Error('design.removeDesign.failValidation', result)
        }

        console.log("Removing Design");

        try {
            DesignServices.removeDesign(designId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('design.removeDesign.fail', e)
        }
    }

});
