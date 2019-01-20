

import {DesignVersions} from '../../../collections/design/design_versions.js';
import {DesignUpdates} from '../../../collections/design_update/design_updates.js';

import { WorkPackageComponentValidationServices } from '../work_package_component_validation_services.js';

import { RoleType, ViewType, ViewMode, DisplayContext, ComponentType, DesignVersionStatus, UpdateScopeType }     from '../../../constants/constants.js';
import { Validation, WorkPackageComponentValidationErrors }   from '../../../constants/validation_errors.js';


import { chai } from 'meteor/practicalmeteor:chai';


describe('VAL: WP Component', () => {


    describe('Only Design Components that are in Scope or parent Scope for a Design Update can be added to the Scope of a Design Update Work Package', function () {

        it('can add an in scope component', function(){

            const view = ViewType.WORK_PACKAGE_UPDATE_EDIT;
            const displayContext = DisplayContext.WP_SCOPE;
            const userContext = {
                designId:           'DDD',
                designVersionId:    'VVV',
                designUpdateId:     'UUU',
                workPackageId:      'WWW'
            };
            const updateComponent = {
                componentType:  ComponentType.SCENARIO,
                workPackageId:  'WWW',
                scopeType:      UpdateScopeType.SCOPE_IN_SCOPE
            };

            const expectation = Validation.VALID;

            const result = WorkPackageComponentValidationServices.validateToggleInScope(view, displayContext, userContext, updateComponent);

            chai.assert.equal(result, expectation, 'Expected in scope update component to be addable to WP');
        });

        it('can add a parent scope component', function(){

            const view = ViewType.WORK_PACKAGE_UPDATE_EDIT;
            const displayContext = DisplayContext.WP_SCOPE;
            const userContext = {
                designId:           'DDD',
                designVersionId:    'VVV',
                designUpdateId:     'UUU',
                workPackageId:      'WWW'
            };
            const updateComponent = {
                componentType:  ComponentType.DESIGN_SECTION,
                workPackageId:  'NONE',
                scopeType:      UpdateScopeType.SCOPE_PARENT_SCOPE
            };

            const expectation = Validation.VALID;

            const result = WorkPackageComponentValidationServices.validateToggleInScope(view, displayContext, userContext, updateComponent);

            chai.assert.equal(result, expectation, 'Expected parent scope update component to be addable to WP');
        });

        it('can not add an out scope component', function(){

            const view = ViewType.WORK_PACKAGE_UPDATE_EDIT;
            const displayContext = DisplayContext.WP_SCOPE;
            const userContext = {
                designId:           'DDD',
                designVersionId:    'VVV',
                designUpdateId:     'UUU',
                workPackageId:      'WWW'
            };
            const updateComponent = {
                componentType:  ComponentType.SCENARIO,
                workPackageId:  'NONE',
                scopeType:      UpdateScopeType.SCOPE_OUT_SCOPE
            };

            const expectation = WorkPackageComponentValidationErrors.WORK_PACKAGE_COMPONENT_NOT_SCOPABLE;

            const result = WorkPackageComponentValidationServices.validateToggleInScope(view, displayContext, userContext, updateComponent);

            chai.assert.equal(result, expectation, 'Expected out scope update component not to be addable to WP');

        });

        it('can not add a component not in update', function(){

            const view = ViewType.WORK_PACKAGE_UPDATE_EDIT;
            const displayContext = DisplayContext.WP_SCOPE;
            const userContext = {
                designId:           'DDD',
                designVersionId:    'VVV',
                designUpdateId:     'UUU',
                workPackageId:      'WWW'
            };
            const updateComponent = null

            const expectation = WorkPackageComponentValidationErrors.WORK_PACKAGE_COMPONENT_NOT_SCOPABLE;

            const result = WorkPackageComponentValidationServices.validateToggleInScope(view, displayContext, userContext, updateComponent);

            chai.assert.equal(result, expectation, 'Expected non-update component not to be addable to WP');

        });


    });

});
