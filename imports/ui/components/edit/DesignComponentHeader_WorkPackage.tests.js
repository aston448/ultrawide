import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignComponentHeader } from './DesignComponentHeader.jsx';  // Non Redux wrapped

import { DesignVersionStatus, RoleType, ViewType, ViewMode, DisplayContext, ComponentType} from '../../../constants/constants.js'

import { DesignVersions } from '../../../collections/design/design_versions.js'

describe('JSX: DesignComponentHeader', () => {

    // Work Package Components -----------------------------------------------------------------------------------------

    function workPackageComponentHeaderTest(currentItem, mode, view, displayContext){

        const designItem = {};
        const updateItem = {};
        const isDragDropHovering = false;
        const onToggleOpen = () => {};
        const onSelectItem = () => {};
        const userContext = {designVersionId: 'ABC'};
        const testSummary = false;
        const testSummaryData = {};
        const isOpen = true;
        const testDataFlag = false;
        const viewOptions = {};

        return shallow(
            <DesignComponentHeader
                currentItem={currentItem}
                designItem={designItem}
                updateItem={updateItem}
                isDragDropHovering={isDragDropHovering}
                onToggleOpen={onToggleOpen}
                onSelectItem={onSelectItem}
                mode={mode}
                view={view}
                displayContext={displayContext}
                userContext={userContext}
                testSummary={testSummary}
                testSummaryData={testSummaryData}
                isOpen={isOpen}
                testDataFlag={testDataFlag}
            />
        );
    }

    describe('Each Work Package scope component has a toggle to open or close it', () => {

        it('an application scope item has open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.WORK_PACKAGE_BASE_EDIT;
            const displayContext = DisplayContext.WP_SCOPE;

            let item = workPackageComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a design section scope item has open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.WORK_PACKAGE_BASE_EDIT;
            const displayContext = DisplayContext.WP_SCOPE;

            let item = workPackageComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a feature scope item has open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.WORK_PACKAGE_BASE_EDIT;
            const displayContext = DisplayContext.WP_SCOPE;

            let item = workPackageComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a feature aspect scope item has open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.WORK_PACKAGE_BASE_EDIT;
            const displayContext = DisplayContext.WP_SCOPE;


            let item = workPackageComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });
    });

    describe('A Work Package Scenario scope component cannot be opened or closed', () => {

        it('a scenario scope item has no open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.WORK_PACKAGE_BASE_EDIT;
            const displayContext = DisplayContext.WP_SCOPE;

            let item = workPackageComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert.equal(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was visible!');

        });

    });

    describe('Each Work Package content component has a toggle to open or close it', () => {

        it('an application has open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.WORK_PACKAGE_BASE_EDIT;
            const displayContext = DisplayContext.WP_VIEW;

            let item = workPackageComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('an application has open-close option in view mode', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.WORK_PACKAGE_BASE_VIEW;
            const displayContext = DisplayContext.WP_VIEW;

            let item = workPackageComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a design section has open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.WORK_PACKAGE_BASE_EDIT;
            const displayContext = DisplayContext.WP_VIEW;

            let item = workPackageComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a design section has open-close option in view mode', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.WORK_PACKAGE_BASE_VIEW;
            const displayContext = DisplayContext.WP_VIEW;

            let item = workPackageComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a feature has open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.WORK_PACKAGE_BASE_EDIT;
            const displayContext = DisplayContext.WP_VIEW;


            let item = workPackageComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a feature has open-close option in view mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.WORK_PACKAGE_BASE_VIEW;
            const displayContext = DisplayContext.WP_VIEW;

            let item = workPackageComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a feature aspect has open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.WORK_PACKAGE_BASE_EDIT;
            const displayContext = DisplayContext.WP_VIEW;

            let item = workPackageComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });


        it('a feature aspect has open-close option in view mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.WORK_PACKAGE_BASE_VIEW;
            const displayContext = DisplayContext.WP_VIEW;

            let item = workPackageComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

    });

    describe('A Work Package Scenario content component cannot be opened or closed', () => {

        it('a scenario has no open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.WORK_PACKAGE_BASE_EDIT;
            const displayContext = DisplayContext.WP_VIEW;

            let item = workPackageComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert.equal(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was visible!');

        });

        it('a scenario has no open-close option in view mode', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.WORK_PACKAGE_BASE_VIEW;
            const displayContext = DisplayContext.WP_VIEW;

            let item = workPackageComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert.equal(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was visible!');

        });
    });

    function scopeCheckboxTest(componentType, viewType) {

        const currentItem = {componentType: componentType};
        const mode = ViewMode.MODE_EDIT;
        const view = viewType;
        const displayContext = DisplayContext.WP_SCOPE;

        let item = workPackageComponentHeaderTest(currentItem, mode, view, displayContext);

        chai.assert.equal(item.find('#scopeCheckBox').length, 1, 'Scope check box not present!');
    }

    describe('All Design Components can be toggled to be in Scope for a Work Package', () => {

        it('an application has a scope checkbox for an initial design work package', () => {

            scopeCheckboxTest(ComponentType.APPLICATION, ViewType.WORK_PACKAGE_BASE_EDIT);
        });

        it('an application has a scope checkbox for a design update work package', () => {

            scopeCheckboxTest(ComponentType.APPLICATION, ViewType.WORK_PACKAGE_UPDATE_EDIT);
        });

        it('a design section has a scope checkbox for an initial design work package', () => {

            scopeCheckboxTest(ComponentType.DESIGN_SECTION, ViewType.WORK_PACKAGE_BASE_EDIT);
        });

        it('a design section has a scope checkbox for a design update work package', () => {

            scopeCheckboxTest(ComponentType.DESIGN_SECTION, ViewType.WORK_PACKAGE_UPDATE_EDIT);
        });

        it('a feature has a scope checkbox for an initial design work package', () => {

            scopeCheckboxTest(ComponentType.FEATURE, ViewType.WORK_PACKAGE_BASE_EDIT);
        });

        it('a feature has a scope checkbox for a design update work package', () => {

            scopeCheckboxTest(ComponentType.FEATURE, ViewType.WORK_PACKAGE_UPDATE_EDIT);
        });

        it('a feature aspect has a scope checkbox for an initial design work package', () => {

            scopeCheckboxTest(ComponentType.FEATURE_ASPECT, ViewType.WORK_PACKAGE_BASE_EDIT);
        });

        it('a feature aspect has a scope checkbox for a design update work package', () => {

            scopeCheckboxTest(ComponentType.FEATURE_ASPECT, ViewType.WORK_PACKAGE_UPDATE_EDIT);
        });

        it('a scenario has a scope checkbox for an initial design work package', () => {

            scopeCheckboxTest(ComponentType.SCENARIO, ViewType.WORK_PACKAGE_BASE_EDIT);
        });

        it('a scenario has a scope checkbox for a design update work package', () => {

            scopeCheckboxTest(ComponentType.SCENARIO, ViewType.WORK_PACKAGE_UPDATE_EDIT);
        });
    });

    describe('All Design Components can be toggled to be out of Scope for a Work Package', () => {

        it('an application has a scope checkbox for an initial design work package', () => {

            scopeCheckboxTest(ComponentType.APPLICATION, ViewType.WORK_PACKAGE_BASE_EDIT);
        });

        it('an application has a scope checkbox for a design update work package', () => {

            scopeCheckboxTest(ComponentType.APPLICATION, ViewType.WORK_PACKAGE_UPDATE_EDIT);
        });

        it('a design section has a scope checkbox for an initial design work package', () => {

            scopeCheckboxTest(ComponentType.DESIGN_SECTION, ViewType.WORK_PACKAGE_BASE_EDIT);
        });

        it('a design section has a scope checkbox for a design update work package', () => {

            scopeCheckboxTest(ComponentType.DESIGN_SECTION, ViewType.WORK_PACKAGE_UPDATE_EDIT);
        });

        it('a feature has a scope checkbox for an initial design work package', () => {

            scopeCheckboxTest(ComponentType.FEATURE, ViewType.WORK_PACKAGE_BASE_EDIT);
        });

        it('a feature has a scope checkbox for a design update work package', () => {

            scopeCheckboxTest(ComponentType.FEATURE, ViewType.WORK_PACKAGE_UPDATE_EDIT);
        });

        it('a feature aspect has a scope checkbox for an initial design work package', () => {

            scopeCheckboxTest(ComponentType.FEATURE_ASPECT, ViewType.WORK_PACKAGE_BASE_EDIT);
        });

        it('a feature aspect has a scope checkbox for a design update work package', () => {

            scopeCheckboxTest(ComponentType.FEATURE_ASPECT, ViewType.WORK_PACKAGE_UPDATE_EDIT);
        });

        it('a scenario has a scope checkbox for an initial design work package', () => {

            scopeCheckboxTest(ComponentType.SCENARIO, ViewType.WORK_PACKAGE_BASE_EDIT);
        });

        it('a scenario has a scope checkbox for a design update work package', () => {

            scopeCheckboxTest(ComponentType.SCENARIO, ViewType.WORK_PACKAGE_UPDATE_EDIT);
        });
    });

    function scopeCheckboxNotPresentTest(componentType, viewType) {

        const currentItem = {componentType: componentType};
        const mode = ViewMode.MODE_VIEW;
        const view = viewType;
        const displayContext = DisplayContext.WP_VIEW;

        let item = workPackageComponentHeaderTest(currentItem, mode, view, displayContext);

        chai.assert.equal(item.find('#scopeCheckBox').length, 0, 'Scope check box present!');
    }

    describe('Design Components cannot be added to Initial Design Version Work Package Scope in View Only mode', () => {

        it('no scope checkbox in view mode for application', () => {

            scopeCheckboxNotPresentTest(ComponentType.APPLICATION, ViewType.WORK_PACKAGE_BASE_VIEW);
        });

        it('no scope checkbox in view mode for design section', () => {

            scopeCheckboxNotPresentTest(ComponentType.DESIGN_SECTION, ViewType.WORK_PACKAGE_BASE_VIEW);
        });

        it('no scope checkbox in view mode for feature', () => {

            scopeCheckboxNotPresentTest(ComponentType.FEATURE, ViewType.WORK_PACKAGE_BASE_VIEW);
        });

        it('no scope checkbox in view mode for feature aspect', () => {

            scopeCheckboxNotPresentTest(ComponentType.FEATURE_ASPECT, ViewType.WORK_PACKAGE_BASE_VIEW);
        });

        it('no scope checkbox in view mode for scenario', () => {

            scopeCheckboxNotPresentTest(ComponentType.SCENARIO, ViewType.WORK_PACKAGE_BASE_VIEW);
        });
    });

    describe('Design Components cannot be added to Design Update Work Package Scope in View Only mode', () => {

        it('no scope checkbox in view mode for application', () => {

            scopeCheckboxNotPresentTest(ComponentType.APPLICATION, ViewType.WORK_PACKAGE_UPDATE_VIEW);
        });

        it('no scope checkbox in view mode for design section', () => {

            scopeCheckboxNotPresentTest(ComponentType.DESIGN_SECTION, ViewType.WORK_PACKAGE_UPDATE_VIEW);
        });

        it('no scope checkbox in view mode for feature', () => {

            scopeCheckboxNotPresentTest(ComponentType.FEATURE, ViewType.WORK_PACKAGE_UPDATE_VIEW);
        });

        it('no scope checkbox in view mode for feature aspect', () => {

            scopeCheckboxNotPresentTest(ComponentType.FEATURE_ASPECT, ViewType.WORK_PACKAGE_UPDATE_VIEW);
        });

        it('no scope checkbox in view mode for scenario', () => {

            scopeCheckboxNotPresentTest(ComponentType.SCENARIO, ViewType.WORK_PACKAGE_UPDATE_VIEW);
        });
    });

    describe('Design Components cannot be removed from Initial Design Version Work Package Scope in View Only mode', () => {

        it('no scope checkbox in view mode for application', () => {

            scopeCheckboxNotPresentTest(ComponentType.APPLICATION, ViewType.WORK_PACKAGE_BASE_VIEW);
        });

        it('no scope checkbox in view mode for design section', () => {

            scopeCheckboxNotPresentTest(ComponentType.DESIGN_SECTION, ViewType.WORK_PACKAGE_BASE_VIEW);
        });

        it('no scope checkbox in view mode for feature', () => {

            scopeCheckboxNotPresentTest(ComponentType.FEATURE, ViewType.WORK_PACKAGE_BASE_VIEW);
        });

        it('no scope checkbox in view mode for feature aspect', () => {

            scopeCheckboxNotPresentTest(ComponentType.FEATURE_ASPECT, ViewType.WORK_PACKAGE_BASE_VIEW);
        });

        it('no scope checkbox in view mode for scenario', () => {

            scopeCheckboxNotPresentTest(ComponentType.SCENARIO, ViewType.WORK_PACKAGE_BASE_VIEW);
        });
    });

    describe('Design Components cannot be removed from Design Update Work Package Scope in View Only mode', () => {

        it('no scope checkbox in view mode for application', () => {

            scopeCheckboxNotPresentTest(ComponentType.APPLICATION, ViewType.WORK_PACKAGE_UPDATE_VIEW);
        });

        it('no scope checkbox in view mode for design section', () => {

            scopeCheckboxNotPresentTest(ComponentType.DESIGN_SECTION, ViewType.WORK_PACKAGE_UPDATE_VIEW);
        });

        it('no scope checkbox in view mode for feature', () => {

            scopeCheckboxNotPresentTest(ComponentType.FEATURE, ViewType.WORK_PACKAGE_UPDATE_VIEW);
        });

        it('no scope checkbox in view mode for feature aspect', () => {

            scopeCheckboxNotPresentTest(ComponentType.FEATURE_ASPECT, ViewType.WORK_PACKAGE_UPDATE_VIEW);
        });

        it('no scope checkbox in view mode for scenario', () => {

            scopeCheckboxNotPresentTest(ComponentType.SCENARIO, ViewType.WORK_PACKAGE_UPDATE_VIEW);
        });
    });
});

