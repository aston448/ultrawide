
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
        const result = DesignUpdateComponentValidationApi.validateAddDesignUpdateComponent(view, mode, null);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designUpdateComponent.addApplicationToDesignVersion.failValidation', result)
        }

        // Server action
        try {
            DesignUpdateComponentServices.addNewComponent(
                designVersionId,
                designUpdateId,
                'NONE',
                ComponentType.APPLICATION,
                0,                          // Apps are at level 0
                DefaultComponentNames.NEW_APPLICATION_NAME,
                DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_APPLICATION_NAME),
                DesignComponentModules.getRawTextFor(DefaultDetailsText.NEW_APPLICATION_DETAILS),
                true
            );
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designUpdateComponent.addApplicationToDesignVersion.fail', e)
        }
    }
});

export const addDesignSectionToApplication = new ValidatedMethod({

    name: 'designUpdateComponent.addDesignSectionToApplication',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        designVersionId:    {type: String},
        designUpdateId:     {type: String},
        parentId:           {type: String}
    }).validator(),

    run({view, mode, designVersionId, designUpdateId, parentId}){

        // Server validation
        const result = DesignUpdateComponentValidationApi.validateAddDesignUpdateComponent(view, mode, parentId);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designUpdateComponent.addDesignSectionToApplication.failValidation', result)
        }

        // Server action
        try {
            DesignUpdateComponentServices.addNewComponent(
                designVersionId,
                designUpdateId,
                parentId,
                ComponentType.DESIGN_SECTION,
                1,
                DefaultComponentNames.NEW_DESIGN_SECTION_NAME,
                DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_DESIGN_SECTION_NAME),
                DesignComponentModules.getRawTextFor(DefaultDetailsText.NEW_DESIGN_SECTION_DETAILS),
                true
            );
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designUpdateComponent.addDesignSectionToApplication.fail', e)
        }
    }
});

export const addDesignSectionToDesignSection = new ValidatedMethod({

    name: 'designUpdateComponent.addDesignSectionToDesignSection',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        designVersionId:    {type: String},
        designUpdateId:     {type: String},
        parentId:           {type: String},
        parentLevel:        {type: Number}
    }).validator(),

    run({view, mode, designVersionId, designUpdateId, parentId, parentLevel}){

        // Server validation
        const result = DesignUpdateComponentValidationApi.validateAddDesignUpdateComponent(view, mode, parentId);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designUpdateComponent.addDesignSectionToDesignSection.failValidation', result)
        }

        // Server action
        try {
            DesignUpdateComponentServices.addNewComponent(
                designVersionId,
                designUpdateId,
                parentId,
                ComponentType.DESIGN_SECTION,
                parentLevel + 1,
                DefaultComponentNames.NEW_DESIGN_SECTION_NAME,
                DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_DESIGN_SECTION_NAME),
                DesignComponentModules.getRawTextFor(DefaultDetailsText.NEW_DESIGN_SECTION_DETAILS),
                true
            );
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designUpdateComponent.addDesignSectionToDesignSection.fail', e)
        }
    }
});

export const addFeatureToDesignSection = new ValidatedMethod({

    name: 'designUpdateComponent.addFeatureToDesignSection',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        designVersionId:    {type: String},
        designUpdateId:     {type: String},
        parentId:           {type: String}
    }).validator(),

    run({view, mode, designVersionId, designUpdateId, parentId}){

        // Server validation
        const result = DesignUpdateComponentValidationApi.validateAddDesignUpdateComponent(view, mode, parentId);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designUpdateComponent.addFeatureToDesignSection.failValidation', result)
        }

        // Server action
        try {
            DesignUpdateComponentServices.addNewComponent(
                designVersionId,
                designUpdateId,
                parentId,
                ComponentType.FEATURE,
                0,
                DefaultComponentNames.NEW_FEATURE_NAME,
                DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_FEATURE_NAME),
                DesignComponentModules.getRawTextFor(DefaultDetailsText.NEW_FEATURE_DETAILS),
                true
            );
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designUpdateComponent.addFeatureToDesignSection.fail', e)
        }
    }
});

export const addFeatureAspectToFeature = new ValidatedMethod({

    name: 'designUpdateComponent.addFeatureAspectToFeature',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        designVersionId:    {type: String},
        designUpdateId:     {type: String},
        parentId:           {type: String}
    }).validator(),

    run({view, mode, designVersionId, designUpdateId, parentId}){

        // Server validation
        const result = DesignUpdateComponentValidationApi.validateAddDesignUpdateComponent(view, mode, parentId);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designUpdateComponent.addFeatureAspectToFeature.failValidation', result)
        }

        // Server action
        try {
            DesignUpdateComponentServices.addNewComponent(
                designVersionId,
                designUpdateId,
                parentId,
                ComponentType.FEATURE_ASPECT,
                0,
                DefaultComponentNames.NEW_FEATURE_ASPECT_NAME,
                DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_FEATURE_ASPECT_NAME),
                DesignComponentModules.getRawTextFor(DefaultDetailsText.NEW_FEATURE_ASPECT_DETAILS),
                true
            );
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designUpdateComponent.addFeatureAspectToFeature.fail', e)
        }
    }
});

export const addScenario = new ValidatedMethod({

    // A scenario could be being added to either a Feature or a Feature Aspect

    name: 'designUpdateComponent.addScenario',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        designVersionId:    {type: String},
        designUpdateId:     {type: String},
        parentId:           {type: String}
    }).validator(),

    run({view, mode, designVersionId, designUpdateId, parentId}){

        // Server validation
        const result = DesignUpdateComponentValidationApi.validateAddDesignUpdateComponent(view, mode, parentId);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designUpdateComponent.addScenario.failValidation', result)
        }

        // Server action
        try {
            DesignUpdateComponentServices.addNewComponent(
                designVersionId,
                designUpdateId,
                parentId,
                ComponentType.SCENARIO,
                0,
                DefaultComponentNames.NEW_SCENARIO_NAME,
                DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_SCENARIO_NAME),
                DesignComponentModules.getRawTextFor(DefaultDetailsText.NEW_SCENARIO_DETAILS),
                true
            );
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designUpdateComponent.addScenario.fail', e)
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

        if (result != Validation.VALID) {
            throw new Meteor.Error('designUpdateComponent.updateComponentName.failValidation', result)
        }

        // Server action
        try {
            DesignUpdateComponentServices.updateComponentName(designUpdateComponentId, newPlainText, newRawText);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designUpdateComponent.updateComponentName.fail', e)
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

        if (result != Validation.VALID) {
            throw new Meteor.Error('designUpdateComponent.updateFeatureNarrative.failValidation', result)
        }

        // Server action
        try {
            DesignUpdateComponentServices.updateFeatureNarrative(designUpdateComponentId, newPlainText, newRawText);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designUpdateComponent.updateFeatureNarrative.fail', e)
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

        if (result != Validation.VALID) {
            throw new Meteor.Error('designUpdateComponent.removeDesignComponent.failValidation', result)
        }

        // Server action
        try {
            DesignUpdateComponentServices.removeComponent(designUpdateComponentId, parentId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designUpdateComponent.removeDesignComponent.fail', e)
        }
    }

});

export const restoreDesignComponent = new ValidatedMethod({

    name: 'designUpdateComponent.restoreDesignComponent',

    validate: new SimpleSchema({
        view:                       {type: String},
        mode:                       {type: String},
        designUpdateComponentId:    {type: String},
        parentId:                   {type: String}
    }).validator(),

    run({view, mode, designUpdateComponentId, parentId}){

        // Server validation
        const result = DesignUpdateComponentValidationApi.validateRestoreDesignUpdateComponent(view, mode, designUpdateComponentId);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designUpdateComponent.restoreDesignComponent.failValidation', result)
        }

        // Server action
        try {
            DesignUpdateComponentServices.restoreComponent(designUpdateComponentId, parentId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designUpdateComponent.restoreDesignComponent.fail', e)
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

        console.log("MOVE DESIGN UPDATE COMPONENT: " + result);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designUpdateComponent.moveDesignComponent.failValidation', result)
        }

        // Server action
        try {
            DesignUpdateComponentServices.moveComponent(movingComponentId, targetComponentId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designUpdateComponent.moveDesignComponent.fail', e)
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

        if (result != Validation.VALID) {
            throw new Meteor.Error('designUpdateComponent.reorderDesignComponent.failValidation', result)
        }

        // Server action
        try {
            DesignUpdateComponentServices.reorderComponent(movingComponentId, targetComponentId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designUpdateComponent.reorderDesignComponent.fail', e)
        }
    }
});

export const toggleScope = new ValidatedMethod({

    name: 'designUpdateComponent.toggleScope',

    validate: new SimpleSchema({
        view:                       {type: String},
        mode:                       {type: String},
        displayContext:             {type: String},
        designUpdateComponentId:    {type: String},
        newScope:                   {type: Boolean}
    }).validator(),

    run({view, mode, displayContext, designUpdateComponentId, newScope}){

        // Server validation
        const result = DesignUpdateComponentValidationApi.validateToggleDesignUpdateComponentScope(view, mode, displayContext, designUpdateComponentId, newScope);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designUpdateComponent.toggleScope.failValidation', result)
        }

        // Server action
        try {
            DesignUpdateComponentServices.toggleScope(designUpdateComponentId, newScope);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designUpdateComponent.toggleScope.fail', e)
        }
    }

});

