import {DesignVersions} from '../../collections/design/design_versions.js';
import {DesignUpdates} from '../../collections/design_update/design_updates.js';

import DesignComponentValidationServices from '../../service_modules/validation/design_component_validation_services.js';

import { RoleType, ViewType, ViewMode, ComponentType, DesignVersionStatus }     from '../../constants/constants.js';
import { Validation, DesignComponentValidationErrors }   from '../../constants/validation_errors.js';

import { chai } from 'meteor/practicalmeteor:chai';


describe('VAL: Design Component', () => {

    describe('Organisational components may not be added in View Only mode', () => {

        it('an application cannot be added when view mode', () => {

            const view = ViewType.DESIGN_NEW;
            const mode = ViewMode.MODE_VIEW;
            const componentType = ComponentType.APPLICATION;
            const expectation = DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MODE_ADD;

            const result = DesignComponentValidationServices.validateAddDesignComponent(view, mode, componentType);

            chai.assert.equal(result, expectation);
        });

        it('an application cannot be added when viewing', () => {

            const view = ViewType.DESIGN_PUBLISHED;
            const mode = ViewMode.MODE_VIEW;
            const componentType = ComponentType.APPLICATION;
            const expectation = DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_VIEW_ADD;

            const result = DesignComponentValidationServices.validateAddDesignComponent(view, mode, componentType);

            chai.assert.equal(result, expectation);
        });

        it('a design section cannot be added when view mode', () => {

            const view = ViewType.DESIGN_NEW;
            const mode = ViewMode.MODE_VIEW;
            const componentType = ComponentType.DESIGN_SECTION;
            const expectation = DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MODE_ADD;

            const result = DesignComponentValidationServices.validateAddDesignComponent(view, mode, componentType);

            chai.assert.equal(result, expectation);
        });

        it('a design section cannot be added when viewing', () => {

            const view = ViewType.DESIGN_PUBLISHED;
            const mode = ViewMode.MODE_VIEW;
            const componentType = ComponentType.DESIGN_SECTION;
            const expectation = DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_VIEW_ADD;

            const result = DesignComponentValidationServices.validateAddDesignComponent(view, mode, componentType);

            chai.assert.equal(result, expectation);
        });

        it('a feature aspect cannot be added when view mode', () => {

            const view = ViewType.DESIGN_NEW;
            const mode = ViewMode.MODE_VIEW;
            const componentType = ComponentType.FEATURE_ASPECT;
            const expectation = DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MODE_ADD;

            const result = DesignComponentValidationServices.validateAddDesignComponent(view, mode, componentType);

            chai.assert.equal(result, expectation);
        });

        it('a feature aspect cannot be added when viewing', () => {

            const view = ViewType.DESIGN_PUBLISHED;
            const mode = ViewMode.MODE_VIEW;
            const componentType = ComponentType.FEATURE_ASPECT;
            const expectation = DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_VIEW_ADD;

            const result = DesignComponentValidationServices.validateAddDesignComponent(view, mode, componentType);

            chai.assert.equal(result, expectation);
        });
    });

    describe('Functional Design Components may not be added in View Only mode', () => {

        it('a feature cannot be added when view mode', () => {

            const view = ViewType.DESIGN_NEW;
            const mode = ViewMode.MODE_VIEW;
            const componentType = ComponentType.FEATURE;
            const expectation = DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MODE_ADD;

            const result = DesignComponentValidationServices.validateAddDesignComponent(view, mode, componentType);

            chai.assert.equal(result, expectation);
        });

        it('a feature cannot be added when viewing', () => {

            const view = ViewType.DESIGN_PUBLISHED;
            const mode = ViewMode.MODE_VIEW;
            const componentType = ComponentType.FEATURE;
            const expectation = DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_VIEW_ADD;

            const result = DesignComponentValidationServices.validateAddDesignComponent(view, mode, componentType);

            chai.assert.equal(result, expectation);
        });

        it('a scenario cannot be added when view mode', () => {

            const view = ViewType.DESIGN_NEW;
            const mode = ViewMode.MODE_VIEW;
            const componentType = ComponentType.SCENARIO;
            const expectation = DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MODE_ADD;

            const result = DesignComponentValidationServices.validateAddDesignComponent(view, mode, componentType);

            chai.assert.equal(result, expectation);
        });

        it('a scenario cannot be added when viewing', () => {

            const view = ViewType.DESIGN_PUBLISHED;
            const mode = ViewMode.MODE_VIEW;
            const componentType = ComponentType.SCENARIO;
            const expectation = DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_VIEW_ADD;

            const result = DesignComponentValidationServices.validateAddDesignComponent(view, mode, componentType);

            chai.assert.equal(result, expectation);
        });
    });

    describe('Design Components may not be removed in View Only mode', () => {

        it('an application cannot be removed in view only mode', () => {

            const view = ViewType.DESIGN_NEW;
            const mode = ViewMode.MODE_VIEW;
            const component = {
                componentType:  ComponentType.APPLICATION,
                isRemovable:    true,
                isDevAdded:     false
            };
            const expectation = DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MODE_REMOVE;

            const result = DesignComponentValidationServices.validateRemoveDesignComponent(view, mode, component);

            chai.assert.equal(result, expectation);
        });

        it('a design section cannot be removed in view only mode', () => {

            const view = ViewType.DESIGN_NEW;
            const mode = ViewMode.MODE_VIEW;
            const component = {
                componentType:  ComponentType.DESIGN_SECTION,
                isRemovable:    true,
                isDevAdded:     false
            };
            const expectation = DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MODE_REMOVE;

            const result = DesignComponentValidationServices.validateRemoveDesignComponent(view, mode, component);

            chai.assert.equal(result, expectation);
        });

        it('a feature cannot be removed in view only mode', () => {

            const view = ViewType.DESIGN_NEW;
            const mode = ViewMode.MODE_VIEW;
            const component = {
                componentType:  ComponentType.FEATURE,
                isRemovable:    true,
                isDevAdded:     false
            };
            const expectation = DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MODE_REMOVE;

            const result = DesignComponentValidationServices.validateRemoveDesignComponent(view, mode, component);

            chai.assert.equal(result, expectation);
        });

        it('a feature aspect cannot be removed in view only mode', () => {

            const view = ViewType.DESIGN_NEW;
            const mode = ViewMode.MODE_VIEW;
            const component = {
                componentType:  ComponentType.FEATURE_ASPECT,
                isRemovable:    true,
                isDevAdded:     false
            };
            const expectation = DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MODE_REMOVE;

            const result = DesignComponentValidationServices.validateRemoveDesignComponent(view, mode, component);

            chai.assert.equal(result, expectation);
        });

        it('a scenario cannot be removed in view only mode', () => {

            const view = ViewType.DESIGN_NEW;
            const mode = ViewMode.MODE_VIEW;
            const component = {
                componentType:  ComponentType.SCENARIO,
                isRemovable:    true,
                isDevAdded:     false
            };
            const expectation = DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MODE_REMOVE;

            const result = DesignComponentValidationServices.validateRemoveDesignComponent(view, mode, component);

            chai.assert.equal(result, expectation);
        });
    });
});

