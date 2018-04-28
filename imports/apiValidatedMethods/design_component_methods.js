
import { ComponentType } from '../constants/constants.js'
import { DefaultComponentNames, DefaultDetailsText } from '../constants/default_names.js';
import { Validation } from '../constants/validation_errors.js'

import DesignComponentValidationApi         from '../apiValidation/apiDesignComponentValidation.js';
import DesignComponentServices              from '../servicers/design/design_component_services.js';
import { DesignComponentModules }               from '../service_modules/design/design_component_service_modules.js';

//======================================================================================================================
//
// Meteor Validated Methods for Design Components
//
//======================================================================================================================

export const addApplicationToDesignVersion = new ValidatedMethod({

    name: 'designComponent.addApplicationToDesignVersion',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        designVersionId:    {type: String}
    }).validator(),

    run({view, mode, designVersionId}){

        // Server validation
        const result = DesignComponentValidationApi.validateAddDesignComponent(view, mode, ComponentType.APPLICATION);

        if (result !== Validation.VALID) {
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

    name: 'designComponent.addDesignSectionToApplication',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        designVersionId:    {type: String},
        parentRefId:        {type: String}
    }).validator(),

    run({view, mode, designVersionId, parentRefId}){

        // Server validation
        const result = DesignComponentValidationApi.validateAddDesignComponent(view, mode, ComponentType.DESIGN_SECTION);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designComponent.addDesignSectionToApplication.failValidation', result)
        }

        // Server action
        try {
            DesignComponentServices.addNewComponent(
                designVersionId,
                parentRefId,
                ComponentType.DESIGN_SECTION,
                1,                          // All sections added to the design version are level 1
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

    name: 'designComponent.addDesignSectionToDesignSection',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        designVersionId:    {type: String},
        parentRefId:        {type: String},
        parentLevel:        {type: Number}
    }).validator(),

    run({view, mode, designVersionId, parentRefId, parentLevel}){

        // Server validation
        const result = DesignComponentValidationApi.validateAddDesignComponent(view, mode, ComponentType.DESIGN_SECTION);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designComponent.addDesignSectionToDesignSection.failValidation', result)
        }

        // Server action
        try {
            DesignComponentServices.addNewComponent(
                designVersionId,
                parentRefId,
                ComponentType.DESIGN_SECTION,
                parentLevel + 1,
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

    name: 'designComponent.addFeatureToDesignSection',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        designVersionId:    {type: String},
        parentRefId:        {type: String}
    }).validator(),

    run({view, mode, designVersionId, parentRefId}){

        // Server validation
        const result = DesignComponentValidationApi.validateAddDesignComponent(view, mode, ComponentType.FEATURE);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designComponent.addFeatureToDesignSection.failValidation', result)
        }

        // Server action
        try {
            DesignComponentServices.addNewComponent(
                designVersionId,
                parentRefId,
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

    name: 'designComponent.addFeatureAspectToFeature',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        designVersionId:    {type: String},
        parentRefId:        {type: String},
        workPackageId:      {type: String}
    }).validator(),

    run({view, mode, designVersionId, parentRefId, workPackageId}){

        // Server validation
        const result = DesignComponentValidationApi.validateAddDesignComponent(view, mode, ComponentType.FEATURE_ASPECT);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designComponent.addFeatureAspectToFeature.failValidation', result)
        }

        // Server action
        try {
            DesignComponentServices.addNewComponent(
                designVersionId,
                parentRefId,
                ComponentType.FEATURE_ASPECT,
                0,
                DefaultComponentNames.NEW_FEATURE_ASPECT_NAME,
                DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_FEATURE_ASPECT_NAME),
                DesignComponentModules.getRawTextFor(DefaultDetailsText.NEW_FEATURE_ASPECT_DETAILS),
                true,
                view,
                workPackageId
            );
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
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
        parentRefId:        {type: String},
        workPackageId:      {type: String, optional: true},
    }).validator(),

    run({view, mode, designVersionId, parentRefId, workPackageId}){

        // Server validation
        const result = DesignComponentValidationApi.validateAddDesignComponent(view, mode, ComponentType.SCENARIO);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designComponent.addScenario.failValidation', result)
        }

        // Server action
        try {
            DesignComponentServices.addNewComponent(
                designVersionId,
                parentRefId,
                ComponentType.SCENARIO,
                0,
                DefaultComponentNames.NEW_SCENARIO_NAME,
                DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_SCENARIO_NAME),
                DesignComponentModules.getRawTextFor(DefaultDetailsText.NEW_SCENARIO_DETAILS),
                true,
                view,
                workPackageId
            );
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
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

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designComponent.updateComponentName.failValidation', result)
        }

        // Server action
        try {
            DesignComponentServices.updateComponentName(designComponentId, newPlainText, newRawText);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
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

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designComponent.updateFeatureNarrative.failValidation', result)
        }

        // Server action
        try {
            DesignComponentServices.updateFeatureNarrative(designComponentId, newPlainText, newRawText);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }

});

export const removeDesignComponent = new ValidatedMethod({

    name: 'designComponent.removeDesignComponent',

    validate: new SimpleSchema({
        view:               {type: String},
        mode:               {type: String},
        designComponentId:  {type: String}
    }).validator(),

    run({view, mode, designComponentId}){

        // Server validation
        const result = DesignComponentValidationApi.validateRemoveDesignComponent(view, mode, designComponentId);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designComponent.removeDesignComponent.failValidation', result)
        }

        // Server action
        try {
            DesignComponentServices.removeDesignComponent(designComponentId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
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

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designComponent.moveDesignComponent.failValidation', result)
        }

        // Server action
        try {
            DesignComponentServices.moveDesignComponent(movingComponentId, targetComponentId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
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

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designComponent.reorderDesignComponent.failValidation', result)
        }

        // Server action
        try {
            DesignComponentServices.reorderDesignComponent(movingComponentId, targetComponentId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const setScenarioTestExpectations = new ValidatedMethod({

    name: 'designComponent.setScenarioTestExpectations',

    validate: new SimpleSchema({
        userId:             {type: String},
        userRole:           {type: String},
        designComponentId:  {type: String},
        accExpectation:     {type: Boolean},
        intExpectation:     {type: Boolean},
        unitExpectation:    {type: Boolean}
    }).validator(),

    run({userId, userRole, designComponentId, accExpectation, intExpectation, unitExpectation}){

        // Server validation
        const result = DesignComponentValidationApi.validateSetScenarioTestExpectations(userRole);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designComponent.setScenarioTestExpectations.failValidation', result)
        }

        // Server action
        try {
            DesignComponentServices.setScenarioTestExpectations(userId, designComponentId, accExpectation, intExpectation, unitExpectation);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});
