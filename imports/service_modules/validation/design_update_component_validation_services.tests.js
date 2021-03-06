import {DesignVersions} from '../../collections/design/design_versions.js';
import {DesignUpdates} from '../../collections/design_update/design_updates.js';

import DesignUpdateComponentValidationServices from '../../service_modules/validation/design_update_component_validation_services.js';

import { RoleType, ViewType, ViewMode, ComponentType, UpdateMergeStatus, UpdateScopeType }     from '../../constants/constants.js';
import { Validation, DesignUpdateComponentValidationErrors }   from '../../constants/validation_errors.js';

import { chai } from 'meteor/practicalmeteor:chai';


describe('VAL: Update Component', () => {

    // Add Component ---------------------------------------------------------------------------------------------------
    describe('An organisational Design Update Component can only be added in edit mode', () => {

        it('an application can be added in edit mode', () => {

            const view = ViewType.DESIGN_UPDATE_EDIT;
            const mode = ViewMode.MODE_EDIT;
            const componentType = ComponentType.APPLICATION;
            const parentComponent = null;
            const expectation = Validation.VALID;

            const result = DesignUpdateComponentValidationServices.validateAddDesignUpdateComponent(view, mode, componentType, parentComponent);

            chai.assert.equal(result, expectation);
        });

        it('an application cannot be added in view mode', () => {

            const view = ViewType.DESIGN_UPDATE_EDIT;
            const mode = ViewMode.MODE_VIEW;
            const componentType = ComponentType.APPLICATION;
            const parentComponent = null;
            const expectation = DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_MODE_ADD;

            const result = DesignUpdateComponentValidationServices.validateAddDesignUpdateComponent(view, mode, componentType, parentComponent);

            chai.assert.equal(result, expectation);
        });

        it('a design section can be added in edit mode', () => {

            const view = ViewType.DESIGN_UPDATE_EDIT;
            const mode = ViewMode.MODE_EDIT;
            const componentType = ComponentType.DESIGN_SECTION;
            const parentComponent = {componentType: ComponentType.APPLICATION, scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isRemoved: false};
            const expectation = Validation.VALID;

            const result = DesignUpdateComponentValidationServices.validateAddDesignUpdateComponent(view, mode, componentType, parentComponent);

            chai.assert.equal(result, expectation);
        });

        it('a design section cannot be added in view mode', () => {

            const view = ViewType.DESIGN_UPDATE_EDIT;
            const mode = ViewMode.MODE_VIEW;
            const componentType = ComponentType.DESIGN_SECTION;
            const parentComponent = {componentType: ComponentType.APPLICATION, scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isRemoved: false};
            const expectation = DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_MODE_ADD;

            const result = DesignUpdateComponentValidationServices.validateAddDesignUpdateComponent(view, mode, componentType, parentComponent);

            chai.assert.equal(result, expectation);
        });

        it('a feature aspect can be added in edit mode if feature in scope', () => {

            const view = ViewType.DESIGN_UPDATE_EDIT;
            const mode = ViewMode.MODE_EDIT;
            const componentType = ComponentType.DESIGN_SECTION;
            const parentComponent = {componentType: ComponentType.FEATURE, scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isRemoved: false};
            const expectation = Validation.VALID;

            const result = DesignUpdateComponentValidationServices.validateAddDesignUpdateComponent(view, mode, componentType, parentComponent);

            chai.assert.equal(result, expectation);
        });

        it('a feature aspect cannot be added in view mode', () => {

            const view = ViewType.DESIGN_UPDATE_EDIT;
            const mode = ViewMode.MODE_VIEW;
            const componentType = ComponentType.DESIGN_SECTION;
            const parentComponent = {componentType: ComponentType.FEATURE, scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isRemoved: false};
            const expectation = DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_MODE_ADD;

            const result = DesignUpdateComponentValidationServices.validateAddDesignUpdateComponent(view, mode, componentType, parentComponent);

            chai.assert.equal(result, expectation);
        });

    });

    describe('A Design Component name may not be edited if that Design Component has been removed in the Design Update', () => {

        it('cannot be edited if already removed', () => {

            const view = ViewType.DESIGN_UPDATE_EDIT;
            const mode = ViewMode.MODE_EDIT;
            const newName = 'Removed';
            const updateComponent = {
                componentType: ComponentType.SCENARIO,
                scopeType: UpdateScopeType.SCOPE_IN_SCOPE,
                isRemoved: true,
                isRemoveElsewhere: false
            };
            const existingUpdateComponents = [];
            const existingDvComponents = [];
            const dvComponent = {
                updateMergeStatus: UpdateMergeStatus.COMPONENT_MODIFIED
            };

            const expectation = DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_EDIT_REMOVED;

            const result = DesignUpdateComponentValidationServices.validateUpdateDesignUpdateComponentName(view, mode, updateComponent, newName, existingUpdateComponents, existingDvComponents, dvComponent);

            chai.assert.equal(result, expectation);
        })
    })

});
