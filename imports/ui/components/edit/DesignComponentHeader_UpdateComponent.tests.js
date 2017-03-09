import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignComponentHeader } from './DesignComponentHeader.jsx';  // Non Redux wrapped

import { DesignVersionStatus, RoleType, ViewType, ViewMode, DisplayContext, ComponentType, UpdateMergeStatus} from '../../../constants/constants.js'

describe('JSX: DesignComponentHeader', () => {

    // Design Components -----------------------------------------------------------------------------------------------

    function designComponentHeaderTest(currentItem, mode, view, displayContext){

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

    // Scope Components ------------------------------------------------------------------------------------------------

    describe('Each Design Component in Design Update scope has a toggle to open or close it', () => {

        it('an application has open-close option in scope pane', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_SCOPE;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a design section has open-close option in scope pane', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_SCOPE;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a feature has open-close option in scope pane', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_SCOPE;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a feature aspect has open-close option in scope pane', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_SCOPE;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });
    });

    describe('A Scenario in Design Update scope does not have a toggle to open or close it', () => {

        it('a scenario has no open-close option in scope pane', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_SCOPE;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert.equal(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was visible!');

        });
    });

    // Editor Components -----------------------------------------------------------------------------------------------

    describe('Each Design Component in the Design Update editor has a toggle to open or close it', () => {

        it('an application has open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('an application has open-close option in view mode', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a design section has open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a design section has open-close option in view mode', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a feature has open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a feature has open-close option in view mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a feature aspect has open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a feature aspect has open-close option in view mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

    });

    describe('A Scenario in Design Update editor does not have a toggle to open or close it', () => {

        it('a scenario has no open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert.equal(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was visible!');

        });

        it('a scenario has no open-close option in view mode', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert.equal(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was visible!');

        });
    });


});

