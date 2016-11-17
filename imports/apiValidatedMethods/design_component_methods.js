
import DesignComponentValidationApi         from '../apiValidation/apiDesignComponentValidation.js';
import DesignComponentServices              from '../servicers/design_component_services.js';
import ApplicationServices                  from '../servicers/application_services.js';
import DesignSectionServices                from '../servicers/design_section_services.js';
import FeatureServices                      from '../servicers/feature_services.js';
import ScenarioServices                     from '../servicers/scenario_services.js';

import { ComponentType } from '../constants/constants.js'
import { DefaultComponentNames } from '../constants/default_names.js';
import { Validation } from '../constants/validation_errors.js'

export const addApplicationToDesignVersion = new ValidatedMethod({

    name: 'designComponent.addApplicationToDesignVersion',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        designVersionId:    {type: String}
    }).validator(),

    run({view, mode, designVersionId}){

        // Server validation
        const result = DesignComponentValidationApi.validateAddDesignComponent(view, mode);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designComponent.addApplicationToDesignVersion.failValidation', result)
        }

        // Server action
        try {
            DesignComponentServices.addNewComponent(
                designVersionId,
                'NONE',
                ComponentType.APPLICATION,
                0,                          // Apps are at level 0
                DefaultComponentNames.NEW_APPLICATION_NAME,
                ApplicationServices.getDefaultRawName(),
                ApplicationServices.getDefaultRawText()
            );
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designComponent.addApplicationToDesignVersion.fail', e)
        }
    }
});

export const addDesignSectionToApplication = new ValidatedMethod({

    name: 'designComponent.addDesignSectionToApplication',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        designVersionId:    {type: String},
        parentId:           {type: String}
    }).validator(),

    run({view, mode, designVersionId, parentId}){

        // Server validation
        const result = DesignComponentValidationApi.validateAddDesignComponent(view, mode);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designComponent.addDesignSectionToApplication.failValidation', result)
        }

        // Server action
        try {
            DesignComponentServices.addNewComponent(
                designVersionId,
                parentId,
                ComponentType.DESIGN_SECTION,
                1,                          // All sections added to the design version are level 1
                DefaultComponentNames.NEW_DESIGN_SECTION_NAME,
                DesignSectionServices.getDefaultRawName(),
                DesignSectionServices.getDefaultRawText()
            );
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designComponent.addDesignSectionToApplication.fail', e)
        }
    }
});

export const addDesignSectionToDesignSection = new ValidatedMethod({

    name: 'designComponent.addDesignSectionToDesignSection',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        designVersionId:    {type: String},
        parentId:           {type: String},
        parentLevel:        {type: Number}
    }).validator(),

    run({view, mode, designVersionId, parentId, parentLevel}){

        // Server validation
        const result = DesignComponentValidationApi.validateAddDesignComponent(view, mode);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designComponent.addDesignSectionToDesignSection.failValidation', result)
        }

        // Server action
        try {
            DesignComponentServices.addNewComponent(
                designVersionId,
                parentId,
                ComponentType.DESIGN_SECTION,
                parentLevel + 1,
                DefaultComponentNames.NEW_DESIGN_SECTION_NAME,
                DesignSectionServices.getDefaultRawName(),
                DesignSectionServices.getDefaultRawText()
            );
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designComponent.addDesignSectionToDesignSection.fail', e)
        }
    }
});

export const addFeatureToDesignSection = new ValidatedMethod({

    name: 'designComponent.addFeatureToDesignSection',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        designVersionId:    {type: String},
        parentId:           {type: String}
    }).validator(),

    run({view, mode, designVersionId, parentId}){

        // Server validation
        const result = DesignComponentValidationApi.validateAddDesignComponent(view, mode);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designComponent.addFeatureToDesignSection.failValidation', result)
        }

        // Server action
        try {
            DesignComponentServices.addNewComponent(
                designVersionId,
                parentId,
                ComponentType.FEATURE,
                0,
                DefaultComponentNames.NEW_FEATURE_NAME,
                FeatureServices.getDefaultRawName(),
                FeatureServices.getDefaultRawText(),
                FeatureServices.getDefaultRawNarrative()
            );
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designComponent.addFeatureToDesignSection.fail', e)
        }
    }
});

export const addFeatureAspectToFeature = new ValidatedMethod({

    name: 'designComponent.addFeatureAspectToFeature',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        designVersionId:    {type: String},
        parentId:           {type: String}
    }).validator(),

    run({view, mode, designVersionId, parentId}){

        // Server validation
        const result = DesignComponentValidationApi.validateAddDesignComponent(view, mode);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designComponent.addFeatureAspectToFeature.failValidation', result)
        }

        // Server action
        try {
            DesignComponentServices.addNewComponent(
                designVersionId,
                parentId,
                ComponentType.FEATURE_ASPECT,
                0,
                DefaultComponentNames.NEW_FEATURE_ASPECT_NAME,
                FeatureServices.getDefaultRawAspectName(),
                FeatureServices.getDefaultRawText()
            );
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designComponent.addFeatureAspectToFeature.fail', e)
        }
    }
});

export const addScenario = new ValidatedMethod({

    // A scenario could be being added to either a Feature or a Feature Aspect

    name: 'designComponent.addScenario',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        designVersionId:    {type: String},
        parentId:           {type: String}
    }).validator(),

    run({view, mode, designVersionId, parentId}){

        // Server validation
        const result = DesignComponentValidationApi.validateAddDesignComponent(view, mode);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designComponent.addScenario.failValidation', result)
        }

        // Server action
        try {
            DesignComponentServices.addNewComponent(
                designVersionId,
                parentId,
                ComponentType.SCENARIO,
                0,
                DefaultComponentNames.NEW_SCENARIO_NAME,
                ScenarioServices.getDefaultRawName(),
                ScenarioServices.getDefaultRawText()
            );
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designComponent.addScenario.fail', e)
        }
    }
});


export const updateComponentName = new ValidatedMethod({

    name: 'designComponent.updateComponentName',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        designComponentId:  {type: String},
        newPlainText:       {type: String},
        newRawText:         {type: Object, blackbox: true},
    }).validator(),

    run({view, mode, designComponentId, newPlainText, newRawText}){

        // Server validation
        const result = DesignComponentValidationApi.validateUpdateComponentName(view, mode, designComponentId, newPlainText);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designComponent.updateComponentName.failValidation', result)
        }

        // Server action
        try {
            DesignComponentServices.updateComponentName(designComponentId, newPlainText, newRawText);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designComponent.updateComponentName.fail', e)
        }
    }

});

export const updateFeatureNarrative = new ValidatedMethod({

    name: 'designComponent.updateFeatureNarrative',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        designComponentId:  {type: String},
        newPlainText:       {type: String},
        newRawText:         {type: Object, blackbox: true},
    }).validator(),

    run({view, mode, designComponentId, newPlainText, newRawText}){

        // Server validation
        const result = DesignComponentValidationApi.validateUpdateFeatureNarrative(view, mode);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designComponent.updateFeatureNarrative.failValidation', result)
        }

        // Server action
        try {
            DesignComponentServices.updateFeatureNarrative(designComponentId, newPlainText, newRawText);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designComponent.updateFeatureNarrative.fail', e)
        }
    }

});

export const removeDesignComponent = new ValidatedMethod({

    name: 'designComponent.removeDesignComponent',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        designComponentId:  {type: String},
        parentId:           {type: String}
    }).validator(),

    run({view, mode, designComponentId, parentId}){

        // Server validation
        const result = DesignComponentValidationApi.validateRemoveDesignComponent(view, mode, designComponentId);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designComponent.removeDesignComponent.failValidation', result)
        }

        // Server action
        try {
            DesignComponentServices.removeDesignComponent(designComponentId, parentId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designComponent.removeDesignComponent.fail', e)
        }
    }

});

export const moveDesignComponent = new ValidatedMethod({

    name: 'designComponent.moveDesignComponent',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        displayContext:     {type: String},
        movingComponentId:  {type: String},
        targetComponentId:  {type: String}
    }).validator(),

    run({view, mode, displayContext, movingComponentId, targetComponentId}){

        // Server validation
        const result = DesignComponentValidationApi.validateMoveDesignComponent(view, mode, displayContext, movingComponentId, targetComponentId);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designComponent.moveDesignComponent.failValidation', result)
        }

        // Server action
        try {
            DesignComponentServices.moveDesignComponent(movingComponentId, targetComponentId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designComponent.moveDesignComponent.fail', e)
        }
    }
});

export const reorderDesignComponent = new ValidatedMethod({

    name: 'designComponent.reorderDesignComponent',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        displayContext:     {type: String},
        movingComponentId:  {type: String},
        targetComponentId:  {type: String}
    }).validator(),

    run({view, mode, displayContext, movingComponentId, targetComponentId}){

        // Server validation
        const result = DesignComponentValidationApi.validateReorderDesignComponent(view, mode, displayContext, movingComponentId, targetComponentId);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designComponent.reorderDesignComponent.failValidation', result)
        }

        // Server action
        try {
            DesignComponentServices.reorderDesignComponent(movingComponentId, targetComponentId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designComponent.reorderDesignComponent.fail', e)
        }
    }
});
