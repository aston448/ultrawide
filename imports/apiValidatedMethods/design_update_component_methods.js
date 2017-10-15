
import { ComponentType } from '../constants/constants.js'
import { DefaultComponentNames, DefaultDetailsText } from '../constants/default_names.js';
import { Validation } from '../constants/validation_errors.js'

import DesignUpdateComponentValidationApi           from '../apiValidation/apiDesignUpdateComponentValidation.js';
import DesignUpdateComponentServices                from '../servicers/design_update/design_update_component_services.js';
import DesignComponentModules                       from '../service_modules/design/design_component_service_modules.js';

//======================================================================================================================
//
// Meteor Validated Methods for Design Update Components
//
//======================================================================================================================

export const addApplicationToDesignVersion = new ValidatedMethod({

    name: 'designUpdateComponent.addApplicationToDesignVersion',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        designVersionId:    {type: String},
        designUpdateId:     {type: String}
    }).validator(),

    run({view, mode, designVersionId, designUpdateId}){

        // Server validation
        const result = DesignUpdateComponentValidationApi.validateAddDesignUpdateComponent(view, mode, null, ComponentType.APPLICATION);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designUpdateComponent.addApplicationToDesignVersion.failValidation', result)
        }

        // Server action
        try {
            DesignUpdateComponentServices.addNewComponent(
                designVersionId,
                designUpdateId,
                'NONE',
                'NONE',
                ComponentType.APPLICATION,
                0,                          // Apps are at level 0
                DefaultComponentNames.NEW_APPLICATION_NAME,
                DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_APPLICATION_NAME),
                DesignComponentModules.getRawTextFor(DefaultDetailsText.NEW_APPLICATION_DETAILS),
                true,
                view
            );
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const addDesignSectionToApplication = new ValidatedMethod({

    name: 'designUpdateComponent.addDesignSectionToApplication',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        parentComponent:    {type: Object, blackbox: true}
    }).validator(),

    run({view, mode, parentComponent}){

        // Server validation
        const result = DesignUpdateComponentValidationApi.validateAddDesignUpdateComponent(view, mode, parentComponent, ComponentType.DESIGN_SECTION);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designUpdateComponent.addDesignSectionToApplication.failValidation', result)
        }

        // Server action
        try {
            DesignUpdateComponentServices.addNewComponent(
                parentComponent.designVersionId,
                parentComponent.designUpdateId,
                'NONE',
                parentComponent.componentReferenceId,
                ComponentType.DESIGN_SECTION,
                1,
                DefaultComponentNames.NEW_DESIGN_SECTION_NAME,
                DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_DESIGN_SECTION_NAME),
                DesignComponentModules.getRawTextFor(DefaultDetailsText.NEW_DESIGN_SECTION_DETAILS),
                true,
                view
            );
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const addDesignSectionToDesignSection = new ValidatedMethod({

    name: 'designUpdateComponent.addDesignSectionToDesignSection',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        parentComponent:    {type: Object, blackbox: true}
    }).validator(),

    run({view, mode, parentComponent}){

        // Server validation
        const result = DesignUpdateComponentValidationApi.validateAddDesignUpdateComponent(view, mode, parentComponent, ComponentType.DESIGN_SECTION);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designUpdateComponent.addDesignSectionToDesignSection.failValidation', result)
        }

        // Server action
        try {
            DesignUpdateComponentServices.addNewComponent(
                parentComponent.designVersionId,
                parentComponent.designUpdateId,
                'NONE',
                parentComponent.componentReferenceId,
                ComponentType.DESIGN_SECTION,
                parentComponent.componentLevel + 1,
                DefaultComponentNames.NEW_DESIGN_SECTION_NAME,
                DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_DESIGN_SECTION_NAME),
                DesignComponentModules.getRawTextFor(DefaultDetailsText.NEW_DESIGN_SECTION_DETAILS),
                true,
                view
            );
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const addFeatureToDesignSection = new ValidatedMethod({

    name: 'designUpdateComponent.addFeatureToDesignSection',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        parentComponent:    {type: Object, blackbox: true}
    }).validator(),

    run({view, mode, parentComponent}){

        // Server validation
        const result = DesignUpdateComponentValidationApi.validateAddDesignUpdateComponent(view, mode, parentComponent, ComponentType.FEATURE);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designUpdateComponent.addFeatureToDesignSection.failValidation', result)
        }

        // Server action
        try {
            DesignUpdateComponentServices.addNewComponent(
                parentComponent.designVersionId,
                parentComponent.designUpdateId,
                'NONE',
                parentComponent.componentReferenceId,
                ComponentType.FEATURE,
                0,
                DefaultComponentNames.NEW_FEATURE_NAME,
                DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_FEATURE_NAME),
                DesignComponentModules.getRawTextFor(DefaultDetailsText.NEW_FEATURE_DETAILS),
                true,
                view
            );
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const addFeatureAspectToFeature = new ValidatedMethod({

    name: 'designUpdateComponent.addFeatureAspectToFeature',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        parentComponent:    {type: Object, blackbox: true},
        workPackageId:      {type: String}
    }).validator(),

    run({view, mode, parentComponent, workPackageId}){

        // Server validation
        const result = DesignUpdateComponentValidationApi.validateAddDesignUpdateComponent(view, mode, parentComponent, ComponentType.FEATURE_ASPECT);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designUpdateComponent.addFeatureAspectToFeature.failValidation', result)
        }

        // Server action
        try {
            DesignUpdateComponentServices.addNewComponent(
                parentComponent.designVersionId,
                parentComponent.designUpdateId,
                workPackageId,
                parentComponent.componentReferenceId,
                ComponentType.FEATURE_ASPECT,
                0,
                DefaultComponentNames.NEW_FEATURE_ASPECT_NAME,
                DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_FEATURE_ASPECT_NAME),
                DesignComponentModules.getRawTextFor(DefaultDetailsText.NEW_FEATURE_ASPECT_DETAILS),
                true,
                view
            );
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const addScenario = new ValidatedMethod({

    // A scenario could be being added to either a Feature or a Feature Aspect

    name: 'designUpdateComponent.addScenario',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        parentComponent:    {type: Object, blackbox: true},
        workPackageId:      {type: String}
    }).validator(),

    run({view, mode, parentComponent, workPackageId}){

        // Server validation
        const result = DesignUpdateComponentValidationApi.validateAddDesignUpdateComponent(view, mode, parentComponent, ComponentType.SCENARIO);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designUpdateComponent.addScenario.failValidation', result)
        }

        // Server action
        try {
            DesignUpdateComponentServices.addNewComponent(
                parentComponent.designVersionId,
                parentComponent.designUpdateId,
                workPackageId,
                parentComponent.componentReferenceId,
                ComponentType.SCENARIO,
                0,
                DefaultComponentNames.NEW_SCENARIO_NAME,
                DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_SCENARIO_NAME),
                DesignComponentModules.getRawTextFor(DefaultDetailsText.NEW_SCENARIO_DETAILS),
                true,
                view
            );
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});


export const updateComponentName = new ValidatedMethod({

    name: 'designUpdateComponent.updateComponentName',

    validate: new SimpleSchema({
        view:                       {type: String},
        mode:                       {type: String},
        designUpdateComponentId:    {type: String},
        newPlainText:               {type: String},
        newRawText:                 {type: Object, blackbox: true},
    }).validator(),

    run({view, mode, designUpdateComponentId, newPlainText, newRawText}){

        // Server validation
        const result = DesignUpdateComponentValidationApi.validateUpdateDesignUpdateComponentName(view, mode, designUpdateComponentId, newPlainText);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designUpdateComponent.updateComponentName.failValidation', result)
        }

        // Server action
        try {
            DesignUpdateComponentServices.updateComponentName(designUpdateComponentId, newPlainText, newRawText);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }

});

export const updateFeatureNarrative = new ValidatedMethod({

    name: 'designUpdateComponent.updateFeatureNarrative',

    validate: new SimpleSchema({
        view:                       {type: String},
        mode:                       {type: String},
        designUpdateComponentId:    {type: String},
        newPlainText:               {type: String},
        newRawText:                 {type: Object, blackbox: true},
    }).validator(),

    run({view, mode, designUpdateComponentId, newPlainText, newRawText}){

        // Server validation
        const result = DesignUpdateComponentValidationApi.validateUpdateDesignUpdateFeatureNarrative(view, mode, designUpdateComponentId);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designUpdateComponent.updateFeatureNarrative.failValidation', result)
        }

        // Server action
        try {
            DesignUpdateComponentServices.updateFeatureNarrative(designUpdateComponentId, newPlainText, newRawText);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }

});

export const removeDesignComponent = new ValidatedMethod({

    name: 'designUpdateComponent.removeDesignComponent',

    validate: new SimpleSchema({
        view:                       {type: String},
        mode:                       {type: String},
        designUpdateComponentId:    {type: String},
        parentId:                   {type: String}
    }).validator(),

    run({view, mode, designUpdateComponentId, parentId}){

        // Server validation
        const result = DesignUpdateComponentValidationApi.validateRemoveDesignUpdateComponent(view, mode, designUpdateComponentId);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designUpdateComponent.removeDesignComponent.failValidation', result)
        }

        // Server action
        //try {
            DesignUpdateComponentServices.removeComponent(designUpdateComponentId, parentId);
        // } catch (e) {
        //     console.log(e.stack);
        //     throw new Meteor.Error(e.code, e.stack)
        // }
    }

});

export const restoreDesignComponent = new ValidatedMethod({

    name: 'designUpdateComponent.restoreDesignComponent',

    validate: new SimpleSchema({
        view:                       {type: String},
        mode:                       {type: String},
        designUpdateComponentId:    {type: String}
    }).validator(),

    run({view, mode, designUpdateComponentId,}){

        // Server validation
        const result = DesignUpdateComponentValidationApi.validateRestoreDesignUpdateComponent(view, mode, designUpdateComponentId);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designUpdateComponent.restoreDesignComponent.failValidation', result)
        }

        // Server action
        try {
            DesignUpdateComponentServices.restoreComponent(designUpdateComponentId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }

});

export const moveDesignComponent = new ValidatedMethod({

    name: 'designUpdateComponent.moveDesignComponent',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        displayContext:     {type: String},
        movingComponentId:  {type: String},
        targetComponentId:  {type: String}
    }).validator(),

    run({view, mode, displayContext, movingComponentId, targetComponentId}){

        // Server validation
        const result = DesignUpdateComponentValidationApi.validateMoveDesignUpdateComponent(view, mode, displayContext, movingComponentId, targetComponentId);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designUpdateComponent.moveDesignComponent.failValidation', result)
        }

        // Server action
        try {
            DesignUpdateComponentServices.moveComponent(movingComponentId, targetComponentId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const reorderDesignComponent = new ValidatedMethod({

    name: 'designUpdateComponent.reorderDesignComponent',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        displayContext:     {type: String},
        movingComponentId:  {type: String},
        targetComponentId:  {type: String}
    }).validator(),

    run({view, mode, displayContext, movingComponentId, targetComponentId}){

        // Server validation
        const result = DesignUpdateComponentValidationApi.validateReorderDesignUpdateComponent(view, mode, displayContext, movingComponentId, targetComponentId);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designUpdateComponent.reorderDesignComponent.failValidation', result)
        }

        // Server action
        try {
            DesignUpdateComponentServices.reorderComponent(movingComponentId, targetComponentId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const toggleScope = new ValidatedMethod({

    name: 'designUpdateComponent.toggleScope',

    validate: new SimpleSchema({
        view:                       {type: String},
        mode:                       {type: String},
        displayContext:             {type: String},
        baseComponentId:            {type: String},
        designUpdateId:             {type: String},
        updateComponent:            {type: Object, blackbox: true, optional: true},
        newScope:                   {type: Boolean}
    }).validator(),

    run({view, mode, displayContext, baseComponentId, designUpdateId, updateComponent, newScope}){

        // Server validation
        const result = DesignUpdateComponentValidationApi.validateToggleDesignUpdateComponentScope(view, mode, displayContext, baseComponentId, designUpdateId, updateComponent, newScope);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designUpdateComponent.toggleScope.failValidation', result)
        }

        // Server action
        // try {
            DesignUpdateComponentServices.toggleScope(baseComponentId, designUpdateId, newScope);
        // } catch (e) {
        //     console.log(e.stack);
        //     throw new Meteor.Error(e.code, e.stack)
        // }
    }

});

