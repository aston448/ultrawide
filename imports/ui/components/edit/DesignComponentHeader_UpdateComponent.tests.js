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

    // Open Close
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

    // Put in scope
    describe('A Feature in the Design Update Scope pane has a toggle that allows it to be put in scope', () => {

        it('non scoped feature has an unchecked toggle', () => {

            const currentItem = {componentType: ComponentType.FEATURE, isInScope: false, isScopable: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_SCOPE;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Ensure box cleared
            item.setState({inScope: false});

            chai.assert.equal(item.find('#scopeCheckBox').length, 1, 'Scoping box not visible');
            chai.assert.equal(item.find('#scopeCheckBox').props().className, 'out-scope', 'Scoping box is checked');

        });
    });

    describe('A Feature Aspect in the Design Update Scope pane has a toggle that allows it to be put in scope', () => {

        it('non scoped feature aspect has an unchecked toggle', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, isInScope: false, isScopable: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_SCOPE;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Ensure box cleared
            item.setState({inScope: false});

            chai.assert.equal(item.find('#scopeCheckBox').length, 1, 'Scoping box not visible');
            chai.assert.equal(item.find('#scopeCheckBox').props().className, 'out-scope', 'Scoping box is checked');

        });
    });

    describe('A Scenario in the Design Update Scope pane has a toggle that allows it to be put in scope', () => {

        it('non scoped scenario has an unchecked toggle', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, isInScope: false, isScopable: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_SCOPE;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Ensure box cleared
            item.setState({inScope: false});

            chai.assert.equal(item.find('#scopeCheckBox').length, 1, 'Scoping box not visible');
            chai.assert.equal(item.find('#scopeCheckBox').props().className, 'out-scope', 'Scoping box is checked');

        });
    });

    // Put out of scope
    describe('A Feature in the Design Update Scope pane has a toggle that allows it to be put out of scope', () => {

        it('non scoped feature has an unchecked toggle', () => {

            const currentItem = {componentType: ComponentType.FEATURE, isInScope: true, isScopable: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_SCOPE;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Simulate checking the box
            item.setState({inScope: true});

            chai.assert.equal(item.find('#scopeCheckBox').length, 1, 'Scoping box not visible');
            chai.assert.equal(item.find('#scopeCheckBox').props().className, 'in-scope', 'Scoping box is not checked');

        });
    });

    describe('A Feature Aspect in the Design Update Scope pane has a toggle that allows it to be put out of scope', () => {

        it('non scoped feature aspect has an unchecked toggle', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, isInScope: true, isScopable: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_SCOPE;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Simulate checking the box
            item.setState({inScope: true});

            chai.assert.equal(item.find('#scopeCheckBox').length, 1, 'Scoping box not visible');
            chai.assert.equal(item.find('#scopeCheckBox').props().className, 'in-scope', 'Scoping box is not checked');

        });
    });

    describe('A Scenario in the Design Update Scope pane has a toggle that allows it to be put out of scope', () => {

        it('non scoped scenario has an unchecked toggle', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, isInScope: true, isScopable: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_SCOPE;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Simulate checking the box
            item.setState({inScope: true});

            chai.assert.equal(item.find('#scopeCheckBox').length, 1, 'Scoping box not visible');
            chai.assert.equal(item.find('#scopeCheckBox').props().className, 'in-scope', 'Scoping box is not checked');

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

