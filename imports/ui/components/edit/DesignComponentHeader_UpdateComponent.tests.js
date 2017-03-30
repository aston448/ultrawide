import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignComponentHeader } from './DesignComponentHeader.jsx';  // Non Redux wrapped

import { DesignVersionStatus, RoleType, ViewType, ViewMode, DisplayContext, ComponentType, UpdateMergeStatus, UpdateScopeType} from '../../../constants/constants.js'

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

            const currentItem = {componentType: ComponentType.FEATURE, scopeType: UpdateScopeType.SCOPE_PARENT_SCOPE, isScopable: true};
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

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, scopeType: UpdateScopeType.SCOPE_PARENT_SCOPE, isScopable: true};
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

            const currentItem = {componentType: ComponentType.SCENARIO, scopeType: UpdateScopeType.SCOPE_PARENT_SCOPE, isScopable: true};
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

            const currentItem = {componentType: ComponentType.FEATURE, scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isScopable: true};
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

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isScopable: true};
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

            const currentItem = {componentType: ComponentType.SCENARIO, scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isScopable: true};
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

    describe('Each organisational Design Update Component has an option to edit its name', () => {

        it('application has edit option', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has edit option
            chai.assert(item.find('#actionEdit').length === 1, 'Edit option not found!');
        });

        it('design section has edit option', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has edit option
            chai.assert(item.find('#actionEdit').length === 1, 'Edit option not found!');
        });

        it('feature aspect has edit option when in scope', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has edit option
            chai.assert(item.find('#actionEdit').length === 1, 'Edit option not found!');
        });
    });

    describe('Each in scope functional Design Update Component has an option to edit its name', () => {

         it('feature has edit option', () => {

            const currentItem = {componentType: ComponentType.FEATURE, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has edit option
            chai.assert(item.find('#actionEdit').length === 1, 'Edit option not found!');
        });

        it('scenario has edit option', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has edit option
            chai.assert(item.find('#actionEdit').length === 1, 'Edit option not found!');
        });
    });

    describe('A Design Update Component name being edited has an option to save the changes', () => {

        it('application has a save option when being edited', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Edit
            item.setState({editable: true});

            // Has save option
            chai.assert(item.find('#actionSave').length === 1, 'Save option not found!');
        });

        it('design section has a save option when being edited', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Edit
            item.setState({editable: true});

            // Has save option
            chai.assert(item.find('#actionSave').length === 1, 'Save option not found!');
        });

        it('in scope feature has a save option when being edited', () => {

            const currentItem = {componentType: ComponentType.FEATURE, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Edit
            item.setState({editable: true});

            // Has save option
            chai.assert(item.find('#actionSave').length === 1, 'Save option not found!');
        });

        it('in scope feature aspect has a save option when being edited', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Edit
            item.setState({editable: true});

            // Has save option
            chai.assert(item.find('#actionSave').length === 1, 'Save option not found!');
        });

        it('in scope scenario has a save option when being edited', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Edit
            item.setState({editable: true});

            // Has save option
            chai.assert(item.find('#actionSave').length === 1, 'Save option not found!');
        });
    });

    describe('A Design Update Component name being edited has an option to discard the changes', () => {

        it('application has undo option when being edited', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Edit
            item.setState({editable: true});

            // Has undo option
            chai.assert(item.find('#actionUndo').length === 1, 'Undo option not found!');
        });

        it('design section has undo option when being edited', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Edit
            item.setState({editable: true});

            // Has undo option
            chai.assert(item.find('#actionUndo').length === 1, 'Undo option not found!');
        });

        it('in scope feature has undo option when being edited', () => {

            const currentItem = {componentType: ComponentType.FEATURE, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Edit
            item.setState({editable: true});

            // Has undo option
            chai.assert(item.find('#actionUndo').length === 1, 'Undo option not found!');
        });

        it('in scope feature aspect has undo option when being edited', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Edit
            item.setState({editable: true});

            // Has undo option
            chai.assert(item.find('#actionUndo').length === 1, 'Undo option not found!');
        });

        it('in scope scenario has undo option when being edited', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Edit
            item.setState({editable: true});

            // Has undo option
            chai.assert(item.find('#actionUndo').length === 1, 'Undo option not found!');
        });
    });

    describe('Design Update Component names can only be edited when in edit mode', () => {

        it('application has no edit option in view mode', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no edit option
            chai.assert(item.find('#actionEdit').length === 0, 'Has edit option');
        });

        it('application has no edit option when viewing', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no edit option
            chai.assert(item.find('#actionEdit').length === 0, 'Has edit option');
        });

        it('design section has no edit option in view mode', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no edit option
            chai.assert(item.find('#actionEdit').length === 0, 'Has edit option');
        });

        it('design section has no edit option when viewing', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no edit option
            chai.assert(item.find('#actionEdit').length === 0, 'Has edit option');
        });

        it('feature has no edit option in view mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no edit option
            chai.assert(item.find('#actionEdit').length === 0, 'Has edit option');
        });

        it('feature has no edit option when viewing', () => {

            const currentItem = {componentType: ComponentType.FEATURE, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no edit option
            chai.assert(item.find('#actionEdit').length === 0, 'Has edit option');
        });

        it('feature aspect has no edit option in view mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no edit option
            chai.assert(item.find('#actionEdit').length === 0, 'Has edit option');
        });

        it('feature aspect has no edit option when viewing', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no edit option
            chai.assert(item.find('#actionEdit').length === 0, 'Has edit option');
        });

        it('scenario has no edit option in view mode', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no edit option
            chai.assert(item.find('#actionEdit').length === 0, 'Has edit option');
        });

        it('scenario has no edit option when viewing', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no edit option
            chai.assert(item.find('#actionEdit').length === 0, 'Has edit option');
        });
    });

    describe('An existing Design Update Component has an option to remove it', () => {

        // Note: actionDelete is the same component for remove and restore - icon changes

        it('application has a remove option', () => {

            const currentItem = {componentType: ComponentType.APPLICATION, isNew: false};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 1, 'Remove option not found!');
            chai.assert.equal(item.find('#deleteIcon').props().glyph, 'remove', 'Remove icon not correct');
        });

        it('design section has a remove option', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION, isNew: false};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 1, 'Remove option not found!');
            chai.assert.equal(item.find('#deleteIcon').props().glyph, 'remove', 'Remove icon not correct');
        });

        it('in scope feature has a remove option', () => {

            const currentItem = {componentType: ComponentType.FEATURE, isNew: false, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 1, 'Remove option not found!');
            chai.assert.equal(item.find('#deleteIcon').props().glyph, 'remove', 'Remove icon not correct');
        });

        it('in scope feature aspect has a remove option', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, isNew: false, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 1, 'Remove option not found!');
            chai.assert.equal(item.find('#deleteIcon').props().glyph, 'remove', 'Remove icon not correct');
        });

        it('in scope scenario has a remove option', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, isNew: false, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 1, 'Remove option not found!');
            chai.assert.equal(item.find('#deleteIcon').props().glyph, 'remove', 'Remove icon not correct');
        });
    });

    describe('A removed existing Design Update Component is visible but appears as struck through', () => {

        it('removed application is struck through', () => {

            const currentItem = {componentType: ComponentType.APPLICATION, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Is struck through
            chai.assert(item.find('#editorReadOnly').props().className.endsWith('removed-item'), 'Item not struck through');
        });

        it('removed application is struck through when viewing', () => {

            const currentItem = {componentType: ComponentType.APPLICATION, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Is struck through
            chai.assert(item.find('#editorReadOnly').props().className.endsWith('removed-item'), 'Item not struck through');
        });

        it('removed design section is struck through', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Is struck through
            chai.assert(item.find('#editorReadOnly').props().className.endsWith('removed-item'), 'Item not struck through');
        });

        it('removed design section is struck through when viewing', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Is struck through
            chai.assert(item.find('#editorReadOnly').props().className.endsWith('removed-item'), 'Item not struck through');
        });

        it('removed feature is struck through', () => {

            const currentItem = {componentType: ComponentType.FEATURE, isNew: false, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isRemoved: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Is struck through
            chai.assert(item.find('#editorReadOnly').props().className.endsWith('removed-item'), 'Item not struck through');
        });

        it('removed feature is struck through when viewing', () => {

            const currentItem = {componentType: ComponentType.FEATURE, isNew: false, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isRemoved: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Is struck through
            chai.assert(item.find('#editorReadOnly').props().className.endsWith('removed-item'), 'Item not struck through');
        });

        it('removed feature aspect is struck through', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, isNew: false, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isRemoved: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Is struck through
            chai.assert(item.find('#editorReadOnly').props().className.endsWith('removed-item'), 'Item not struck through');
        });

        it('removed feature aspect is struck through when viewing', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, isNew: false, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isRemoved: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Is struck through
            chai.assert(item.find('#editorReadOnly').props().className.endsWith('removed-item'), 'Item not struck through');
        });

        it('removed scenario is struck through', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, isNew: false, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isRemoved: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Is struck through
            chai.assert(item.find('#editorReadOnly').props().className.endsWith('removed-item'), 'Item not struck through');
        });

        it('removed scenario is struck through when viewing', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, isNew: false, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isRemoved: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Is struck through
            chai.assert(item.find('#editorReadOnly').props().className.endsWith('removed-item'), 'Item not struck through');
        });
    });

    describe('A existing Design Update Component can only be removed in a Design Update in edit mode', () => {

        it('application has no remove option in view mode', () => {

            const currentItem = {componentType: ComponentType.APPLICATION, isNew: false};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 0, 'Has remove option');
        });

        it('application has no remove option when viewing', () => {

            const currentItem = {componentType: ComponentType.APPLICATION, isNew: false};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 0, 'Has remove option');
        });

        it('design section has no remove option in view mode', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION, isNew: false};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 0, 'Has remove option');
        });

        it('design section has no remove option when viewing', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION, isNew: false};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 0, 'Has remove option');
        });

        it('feature has no remove option in view mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE, isNew: false, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 0, 'Has remove option');
        });

        it('feature has no remove option when viewing', () => {

            const currentItem = {componentType: ComponentType.FEATURE, isNew: false, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 0, 'Has remove option');
        });

        it('feature aspect has no remove option in view mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, isNew: false, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 0, 'Has remove option');
        });

        it('feature aspect has no remove option when viewing', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, isNew: false, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 0, 'Has remove option');
        });

        it('scenario has no remove option in view mode', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, isNew: false, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 0, 'Has remove option');
        });

        it('scenario has no remove option when viewing', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, isNew: false, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 0, 'Has remove option');
        });
    });

    describe('A removed Design Update Component has an option to restore it', () => {

        // Note: actionDelete is the same component for remove and restore - icon changes

        it('application has a restore option', () => {

            const currentItem = {componentType: ComponentType.APPLICATION, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 1, 'Restore option not found!');
            chai.assert.equal(item.find('#deleteIcon').props().glyph, 'arrow-left', 'Restore icon not correct');
        });

        it('design section has a restore option', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 1, 'Restore option not found!');
            chai.assert.equal(item.find('#deleteIcon').props().glyph, 'arrow-left', 'Restore icon not correct');
        });

        it('in scope feature has a restore option', () => {

            const currentItem = {componentType: ComponentType.FEATURE, isNew: false, isRemoved: true, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 1, 'Restore option not found!');
            chai.assert.equal(item.find('#deleteIcon').props().glyph, 'arrow-left', 'Restore icon not correct');
        });

        it('in scope feature aspect has a restore option', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, isNew: false, isRemoved: true, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 1, 'Restore option not found!');
            chai.assert.equal(item.find('#deleteIcon').props().glyph, 'arrow-left', 'Restore icon not correct');
        });

        it('in scope scenario has a restore option', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, isNew: false, isRemoved: true, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 1, 'Restore option not found!');
            chai.assert.equal(item.find('#deleteIcon').props().glyph, 'arrow-left', 'Restore icon not correct');
        });
    });


    describe('A Design Update Component can only be restored in edit mode', () => {

        it('application has no restore option in view mode', () => {

            const currentItem = {componentType: ComponentType.APPLICATION, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 0, 'Has restore option');
        });

        it('application has no restore option when viewing', () => {

            const currentItem = {componentType: ComponentType.APPLICATION, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 0, 'Has restore option');
        });

        it('design section has no restore option in view mode', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 0, 'Has restore option');
        });

        it('design section has no restore option when viewing', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 0, 'Has restore option');
        });

        it('feature has no restore option in view mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE, isNew: false, isRemoved: true, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 0, 'Has restore option');
        });

        it('feature has no restore option when viewing', () => {

            const currentItem = {componentType: ComponentType.FEATURE, isNew: false, isRemoved: true, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 0, 'Has restore option');
        });

        it('feature aspect has no restore option in view mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, isNew: false, isRemoved: true, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 0, 'Has restore option');
        });

        it('feature aspect has no restore option when viewing', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, isNew: false, isRemoved: true, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 0, 'Has restore option');
        });

        it('scenario has no restore option in view mode', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, isNew: false, isRemoved: true, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 0, 'Has restore option');
        });

        it('scenario has no restore option when viewing', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, isNew: false, isRemoved: true, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionDelete').length === 0, 'Has restore option');
        });
    });

    describe('A new Design Update Component has the option to move it to a new location', () => {

        it('new application has a move option', () => {

            const currentItem = {componentType: ComponentType.APPLICATION, isNew: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionMove').length === 1, 'Move option not found!');
        });

        it('new design section has a move option', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION, isNew: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionMove').length === 1, 'Move option not found!');
        });

        it('new feature has a move option', () => {

            const currentItem = {componentType: ComponentType.FEATURE, isNew: true, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionMove').length === 1, 'Move option not found!');
        });

        it('new feature aspect has a move option', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, isNew: true, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionMove').length === 1, 'Move option not found!');
        });

        it('new scenario has a move option', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, isNew: true, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionMove').length === 1, 'Move option not found!');
        });
    });

    describe('There is no move option for an existing Design Update Component', () => {

        it('existing application has no move option', () => {

            const currentItem = {componentType: ComponentType.APPLICATION, isNew: false};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionMove').length === 0, 'Move option found!');
        });

        it('existing design section has no move option', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION, isNew: false};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionMove').length === 0, 'Move option found!');
        });

        it('existing feature has no move option', () => {

            const currentItem = {componentType: ComponentType.FEATURE, isNew: false, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionMove').length === 0, 'Move option found!');
        });

        it('existing feature aspect has no move option', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, isNew: false, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionMove').length === 0, 'Move option found!');
        });

        it('existing scenario has no move option', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, isNew: false, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionMove').length === 0, 'Move option found!');
        });
    });

    describe('There is no move option for a new Design Update Component when in View Only mode', () => {

        it('new application has no move option for view only', () => {

            const currentItem = {componentType: ComponentType.APPLICATION, isNew: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionMove').length === 0, 'Move option found!');
        });

        it('new application has no move option when viewing', () => {

            const currentItem = {componentType: ComponentType.APPLICATION, isNew: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionMove').length === 0, 'Move option found!');
        });

        it('new design section has no move option for view only', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION, isNew: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionMove').length === 0, 'Move option found!');
        });

        it('new design section has no move option when viewing', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION, isNew: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionMove').length === 0, 'Move option found!');
        });

        it('new feature has no move option for view only', () => {

            const currentItem = {componentType: ComponentType.FEATURE, isNew: true, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionMove').length === 0, 'Move option found!');
        });

        it('new feature has no move option for when viewing', () => {

            const currentItem = {componentType: ComponentType.FEATURE, isNew: true, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionMove').length === 0, 'Move option found!');
        });

        it('new feature aspect has no move option for view only', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, isNew: true, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionMove').length === 0, 'Move option found!');
        });

        it('new feature aspect has no move option when viewing', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, isNew: true, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionMove').length === 0, 'Move option found!');
        });

        it('new scenario has no move option for view only', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, isNew: true, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionMove').length === 0, 'Move option found!');
        });

        it('new scenario has no move option for when viewing', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, isNew: true, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionMove').length === 0, 'Move option found!');
        });
    });

    describe('When a Feature is added to Design Update Scope it becomes editable in the Design Update editor', () => {

        it('is not editable when not in scope', () => {

            const currentItem = {componentType: ComponentType.FEATURE, isNew: false, isScopable: true, scopeType: UpdateScopeType.SCOPE_PARENT_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionEdit').length === 0, 'Edit option found!');
        });

        it('is editable when in scope', () => {

            const currentItem = {componentType: ComponentType.FEATURE, isNew: false, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionEdit').length === 1, 'Edit option not found!');
        });
    });

    describe('When a Feature Aspect is added to Design Update Scope it becomes editable in the Design Update editor', () => {

        it('is not editable when not in scope', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, isNew: false, isScopable: true, scopeType: UpdateScopeType.SCOPE_PARENT_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionEdit').length === 0, 'Edit option found!');
        });

        it('is editable when in scope', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, isNew: false, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionEdit').length === 1, 'Edit option not found!');
        });
    });

    describe('When a Scenario is added to Design Update Scope it becomes editable in the Design Update editor', () => {

        it('is not editable when not in scope', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, isNew: false, isScopable: true, scopeType: UpdateScopeType.SCOPE_PARENT_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionEdit').length === 0, 'Edit option found!');
        });

        it('is editable when in scope', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, isNew: false, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#actionEdit').length === 1, 'Edit option not found!');
        });
    });

    describe('When a Design Component is removed from Design Update Scope it disappears from the Design Update editor', () => {

        it('application is always in scope', () => {

            const currentItem = {componentType: ComponentType.APPLICATION, isNew: false, isScopable: false, scopeType: UpdateScopeType.SCOPE_PARENT_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#editorHeaderItem').length === 1, 'Application not found');
        });

        it('design section is always in scope', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION, isNew: false, isScopable: false, scopeType: UpdateScopeType.SCOPE_PARENT_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#editorHeaderItem').length === 1, 'Section not found');
        });

        it('feature is not present if not in scope', () => {

            const currentItem = {componentType: ComponentType.FEATURE, isNew: false, isScopable: true, scopeType: UpdateScopeType.SCOPE_PARENT_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#editorHeaderItem').length === 0, 'Feature was found');
        });

        it('feature aspect is not present if not in scope', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, isNew: false, isScopable: true, scopeType: UpdateScopeType.SCOPE_PARENT_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#editorHeaderItem').length === 0, 'Feature aspect was found');
        });

        it('scenario is not present if not in scope', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, isNew: false, isScopable: true, scopeType: UpdateScopeType.SCOPE_PARENT_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#editorHeaderItem').length === 0, 'Scenario was found');
        });
    });

});

