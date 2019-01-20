import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignComponentHeader } from '../DesignComponentHeader.jsx';  // Non Redux wrapped

import { DesignVersionStatus, RoleType, ViewType, ViewMode, DisplayContext, ComponentType, UpdateMergeStatus, UpdateScopeType} from '../../../../constants/constants.js'

import { UI }           from "../../../../constants/ui_context_ids";
import { hashID }       from "../../../../common/utils";


describe('JSX: DesCompHdr DU', () => {

    // Design Components -----------------------------------------------------------------------------------------------

    function designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext){
        
        const wpItem = {};
        const isDragDropHovering = false;
        const onToggleOpen = () => {};
        const onSelectItem = () => {};
        const userContext = {designVersionId: 'ABC'};
        const testSummary = false;
        const testSummaryData = {};
        const isOpen = true;
        const testDataFlag = 0;
        const updateScopeItems = {};
        const workPackageScopeItems = {};
        const domainTermsVisible = true;
        const uiContextName = 'ComponentName';


        return shallow(
            <DesignComponentHeader
                currentItem={currentItem}
                updateItem={updateItem}
                wpItem={wpItem}
                uiContextName={uiContextName}
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
                updateScopeFlag={1}
                updateScopeItems={updateScopeItems}
                workPackageScopeFlag={1}
                workPackageScopeItems={workPackageScopeItems}
                domainTermsVisible={domainTermsVisible}
            />
        );

    }

    // Scope Components ------------------------------------------------------------------------------------------------

    // Open Close
    describe('Each Design Component in Design Update scope has a toggle to open or close it', () => {

        it('an application has open-close option in scope pane', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_SCOPE;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find('#openCloseIcon_ComponentName').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon_ComponentName').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a design section has open-close option in scope pane', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_SCOPE;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find('#openCloseIcon_ComponentName').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon_ComponentName').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a feature has open-close option in scope pane', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_SCOPE;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find('#openCloseIcon_ComponentName').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon_ComponentName').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a feature aspect has open-close option in scope pane', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_SCOPE;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find('#openCloseIcon_ComponentName').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon_ComponentName').props().className, 'invisible', 'Open-close option was invisible!');

        });
    });

    describe('A Scenario in Design Update scope does not have a toggle to open or close it', () => {

        it('a scenario has no open-close option in scope pane', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_SCOPE;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert.equal(item.find('#openCloseIcon_ComponentName').props().className, 'invisible', 'Open-close option was visible!');

        });
    });

    // Put in scope
    describe('A component in the Design Update Scope pane has a toggle that allows it to be put into Scope', () => {

        it('non scoped feature has an unchecked toggle', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_OUT_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_SCOPE;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Ensure box cleared
            item.setState({inScope: false});

            chai.assert.equal(item.find('#scopeCheckBox').length, 1, 'Scoping box not visible');
            chai.assert.equal(item.find('#scopeCheckBox').props().className, 'out-scope', 'Scoping box is checked');

        });

        it('non scoped feature aspect has an unchecked toggle', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_OUT_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_SCOPE;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Ensure box cleared
            item.setState({inScope: false});

            chai.assert.equal(item.find('#scopeCheckBox').length, 1, 'Scoping box not visible');
            chai.assert.equal(item.find('#scopeCheckBox').props().className, 'out-scope', 'Scoping box is checked');

        });

        it('non scoped scenario has an unchecked toggle', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_OUT_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_SCOPE;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Ensure box cleared
            item.setState({inScope: false});

            chai.assert.equal(item.find('#scopeCheckBox').length, 1, 'Scoping box not visible');
            chai.assert.equal(item.find('#scopeCheckBox').props().className, 'out-scope', 'Scoping box is checked');

        });
    });


    // Put out of scope
    describe('A component in the Design Update Scope pane has a toggle that allows it to be put out of scope', () => {

        it('scoped feature has a checked toggle', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_SCOPE;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Simulate checking the box
            item.setState({inScope: true});

            chai.assert.equal(item.find('#scopeCheckBox').length, 1, 'Scoping box not visible');
            chai.assert.equal(item.find('#scopeCheckBox').props().className, 'in-scope', 'Scoping box is not checked');

        });

        it('scoped feature aspect has a checked toggle', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_SCOPE;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Simulate checking the box
            item.setState({inScope: true});

            chai.assert.equal(item.find('#scopeCheckBox').length, 1, 'Scoping box not visible');
            chai.assert.equal(item.find('#scopeCheckBox').props().className, 'in-scope', 'Scoping box is not checked');

        });

        it('scoped scenario has a checked toggle', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_SCOPE;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

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
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find('#openCloseIcon_ComponentName').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon_ComponentName').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('an application has open-close option in view mode', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find('#openCloseIcon_ComponentName').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon_ComponentName').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a design section has open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find('#openCloseIcon_ComponentName').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon_ComponentName').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a design section has open-close option in view mode', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find('#openCloseIcon_ComponentName').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon_ComponentName').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a feature has open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find('#openCloseIcon_ComponentName').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon_ComponentName').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a feature has open-close option in view mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find('#openCloseIcon_ComponentName').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon_ComponentName').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a feature aspect has open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find('#openCloseIcon_ComponentName').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon_ComponentName').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a feature aspect has open-close option in view mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find('#openCloseIcon_ComponentName').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon_ComponentName').props().className, 'invisible', 'Open-close option was invisible!');

        });

    });

    describe('A Scenario in Design Update editor does not have a toggle to open or close it', () => {

        it('a scenario has no open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert.equal(item.find('#openCloseIcon_ComponentName').props().className, 'invisible', 'Open-close option was visible!');

        });

        it('a scenario has no open-close option in view mode', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert.equal(item.find('#openCloseIcon_ComponentName').props().className, 'invisible', 'Open-close option was visible!');

        });
    });

    describe('Each organisational Design Update Component has an option to edit its name', () => {

        it('application has edit option', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Has edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 1, 'Edit option not found!');
        });

        it('design section has edit option', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Has edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 1, 'Edit option not found!');
        });

        it('feature aspect has edit option when in scope', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Has edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 1, 'Edit option not found!');
        });
    });

    describe('Each in scope functional Design Update Component has an option to edit its name', () => {

         it('feature has edit option', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
             const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Has edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 1, 'Edit option not found!');
        });

        it('scenario has edit option', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Has edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 1, 'Edit option not found!');
        });
    });

    describe('A Design Update Component name being edited has an option to save the changes', () => {

        it('application has a save option when being edited', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Edit
            item.setState({editing: true});

            // Has save option
            chai.assert(item.find(hashID(UI.OPTION_SAVE, 'ComponentName')).length === 1, 'Save option not found!');
        });

        it('design section has a save option when being edited', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Edit
            item.setState({editing: true});

            // Has save option
            chai.assert(item.find(hashID(UI.OPTION_SAVE, 'ComponentName')).length === 1, 'Save option not found!');
        });

        it('in scope feature has a save option when being edited', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Edit
            item.setState({editing: true});

            // Has save option
            chai.assert(item.find(hashID(UI.OPTION_SAVE, 'ComponentName')).length === 1, 'Save option not found!');
        });

        it('in scope feature aspect has a save option when being edited', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Edit
            item.setState({editing: true});

            // Has save option
            chai.assert(item.find(hashID(UI.OPTION_SAVE, 'ComponentName')).length === 1, 'Save option not found!');
        });

        it('in scope scenario has a save option when being edited', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Edit
            item.setState({editing: true});

            // Has save option
            chai.assert(item.find(hashID(UI.OPTION_SAVE, 'ComponentName')).length === 1, 'Save option not found!');
        });
    });

    describe('A Design Update Component name being edited has an option to discard the changes', () => {

        it('application has undo option when being edited', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Edit
            item.setState({editing: true});

            // Has undo option
            chai.assert(item.find(hashID(UI.OPTION_UNDO, 'ComponentName')).length === 1, 'Undo option not found!');
        });

        it('design section has undo option when being edited', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Edit
            item.setState({editing: true});

            // Has undo option
            chai.assert(item.find(hashID(UI.OPTION_UNDO, 'ComponentName')).length === 1, 'Undo option not found!');
        });

        it('in scope feature has undo option when being edited', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Edit
            item.setState({editing: true});


            // Has undo option
            chai.assert(item.find(hashID(UI.OPTION_UNDO, 'ComponentName')).length === 1, 'Undo option not found!');
        });

        it('in scope feature aspect has undo option when being edited', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Edit
            item.setState({editing: true});

            // Has undo option
            chai.assert(item.find(hashID(UI.OPTION_UNDO, 'ComponentName')).length === 1, 'Undo option not found!');
        });

        it('in scope scenario has undo option when being edited', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Edit
            item.setState({editing: true});

            // Has undo option
            chai.assert(item.find(hashID(UI.OPTION_UNDO, 'ComponentName')).length === 1, 'Undo option not found!');
        });
    });

    describe('Design Update Component names can only be edited when in edit mode', () => {

        it('application has no edit option in view mode', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Has no edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 0, 'Has edit option');
        });

        it('application has no edit option when viewing', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Has no edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 0, 'Has edit option');
        });

        it('design section has no edit option in view mode', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Has no edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 0, 'Has edit option');
        });

        it('design section has no edit option when viewing', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Has no edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 0, 'Has edit option');
        });

        it('feature has no edit option in view mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Has no edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 0, 'Has edit option');
        });

        it('feature has no edit option when viewing', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Has no edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 0, 'Has edit option');
        });

        it('feature aspect has no edit option in view mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Has no edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 0, 'Has edit option');
        });

        it('feature aspect has no edit option when viewing', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Has no edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 0, 'Has edit option');
        });

        it('scenario has no edit option in view mode', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Has no edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 0, 'Has edit option');
        });

        it('scenario has no edit option when viewing', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Has no edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 0, 'Has edit option');
        });
    });

    describe('An existing Design Update Component has an option to remove it', () => {

        it('application has a remove option', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 1, 'Remove option not found!');
        });

        it('design section has a remove option', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 1, 'Remove option not found!');
        });

        it('in scope feature has a remove option', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 1, 'Remove option not found!');
        });

        it('in scope feature aspect has a remove option', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 1, 'Remove option not found!');
        });

        it('in scope scenario has a remove option', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 1, 'Remove option not found!');
        });
    });

    describe('A removed existing Design Update Component is visible but appears as struck through', () => {

        it('removed application is struck through', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Is struck through
            chai.assert(item.find('#editorReadOnly').props().className.includes('removed-item'), 'Item not struck through');
        });

        it('removed application is struck through when viewing', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Is struck through
            chai.assert(item.find('#editorReadOnly').props().className.includes('removed-item'), 'Item not struck through');
        });

        it('removed design section is struck through', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Is struck through
            chai.assert(item.find('#editorReadOnly').props().className.includes('removed-item'), 'Item not struck through');
        });

        it('removed design section is struck through when viewing', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Is struck through
            chai.assert(item.find('#editorReadOnly').props().className.includes('removed-item'), 'Item not struck through');
        });

        it('removed feature is struck through', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Is struck through
            chai.assert(item.find('#editorReadOnly').props().className.includes('removed-item'), 'Item not struck through');
        });

        it('removed feature is struck through when viewing', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Is struck through
            chai.assert(item.find('#editorReadOnly').props().className.includes('removed-item'), 'Item not struck through');
        });

        it('removed feature aspect is struck through', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Is struck through
            chai.assert(item.find('#editorReadOnly').props().className.includes('removed-item'), 'Item not struck through');
        });

        it('removed feature aspect is struck through when viewing', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Is struck through
            chai.assert(item.find('#editorReadOnly').props().className.includes('removed-item'), 'Item not struck through');
        });

        it('removed scenario is struck through', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Is struck through
            chai.assert(item.find('#editorReadOnly').props().className.includes('removed-item'), 'Item not struck through');
        });

        it('removed scenario is struck through when viewing', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            // Is struck through
            chai.assert(item.find('#editorReadOnly').props().className.includes('removed-item'), 'Item not struck through');
        });
    });

    describe('A existing Design Update Component can only be removed in a Design Update in edit mode', () => {

        it('application has no remove option in view mode', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 0, 'Has remove option');
        });

        it('application has no remove option when viewing', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 0, 'Has remove option');
        });

        it('design section has no remove option in view mode', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 0, 'Has remove option');
        });

        it('design section has no remove option when viewing', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 0, 'Has remove option');
        });

        it('feature has no remove option in view mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 0, 'Has remove option');
        });

        it('feature has no remove option when viewing', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 0, 'Has remove option');
        });

        it('feature aspect has no remove option in view mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 0, 'Has remove option');
        });

        it('feature aspect has no remove option when viewing', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 0, 'Has remove option');
        });

        it('scenario has no remove option in view mode', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 0, 'Has remove option');
        });

        it('scenario has no remove option when viewing', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 0, 'Has remove option');
        });
    });

    describe('A removed Design Update Component has an option to restore it', () => {

        it('application has a restore option', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_RESTORE, 'ComponentName')).length === 1, 'Restore option not found!');
        });

        it('design section has a restore option', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_RESTORE, 'ComponentName')).length === 1, 'Restore option not found!');
        });

        it('in scope feature has a restore option', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_RESTORE, 'ComponentName')).length === 1, 'Restore option not found!');
        });

        it('in scope feature aspect has a restore option', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_RESTORE, 'ComponentName')).length === 1, 'Restore option not found!');
        });

        it('in scope scenario has a restore option', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_RESTORE, 'ComponentName')).length === 1, 'Restore option not found!');
        });
    });


    describe('A Design Update Component can only be restored in edit mode', () => {

        it('application has no restore option in view mode', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_RESTORE, 'ComponentName')).length === 0, 'Has restore option');
        });

        it('application has no restore option when viewing', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_RESTORE, 'ComponentName')).length === 0, 'Has restore option');
        });

        it('design section has no restore option in view mode', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_RESTORE, 'ComponentName')).length === 0, 'Has restore option');
        });

        it('design section has no restore option when viewing', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_RESTORE, 'ComponentName')).length === 0, 'Has restore option');
        });

        it('feature has no restore option in view mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_RESTORE, 'ComponentName')).length === 0, 'Has restore option');
        });

        it('feature has no restore option when viewing', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_RESTORE, 'ComponentName')).length === 0, 'Has restore option');
        });

        it('feature aspect has no restore option in view mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_RESTORE, 'ComponentName')).length === 0, 'Has restore option');
        });

        it('feature aspect has no restore option when viewing', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_RESTORE, 'ComponentName')).length === 0, 'Has restore option');
        });

        it('scenario has no restore option in view mode', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_RESTORE, 'ComponentName')).length === 0, 'Has restore option');
        });

        it('scenario has no restore option when viewing', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false, isRemoved: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_RESTORE, 'ComponentName')).length === 0, 'Has restore option');
        });
    });

    describe('A new Design Update Component has the option to move it to a new location', () => {

        it('new application has a move option', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 1, 'Move option not found!');
        });

        it('new design section has a move option', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 1, 'Move option not found!');
        });

        it('new feature has a move option', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 1, 'Move option not found!');
        });

        it('new feature aspect has a move option', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 1, 'Move option not found!');
        });

        it('new scenario has a move option', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: true};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 1, 'Move option not found!');
        });
    });

    describe('There is no move option for an existing Design Update Component', () => {

        it('existing application has no move option', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Move option found!');
        });

        it('existing design section has no move option', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Move option found!');
        });

        it('existing feature has no move option', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Move option found!');
        });

        it('existing feature aspect has no move option', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Move option found!');
        });

        it('existing scenario has no move option', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Move option found!');
        });
    });

    describe('There is no move option for a new Design Update Component when in View Only mode', () => {

        it('new application has no move option for view only', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Move option found!');
        });

        it('new application has no move option when viewing', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Move option found!');
        });

        it('new design section has no move option for view only', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Move option found!');
        });

        it('new design section has no move option when viewing', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Move option found!');
        });

        it('new feature has no move option for view only', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Move option found!');
        });

        it('new feature has no move option for when viewing', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Move option found!');
        });

        it('new feature aspect has no move option for view only', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Move option found!');
        });

        it('new feature aspect has no move option when viewing', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Move option found!');
        });

        it('new scenario has no move option for view only', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Move option found!');
        });

        it('new scenario has no move option for when viewing', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: true};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Move option found!');
        });
    });

    describe('When a Feature is added to Design Update Scope it becomes editable in the Design Update editor', () => {

        it('is not editable when not in scope', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const updateItem = null;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 0, 'Edit option found!');
        });

        it('is not editable when in parent scope', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_PARENT_SCOPE, isNew: false};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 0, 'Edit option found!');
        });

        it('is editable when in scope', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 1, 'Edit option not found!');
        });
    });

    describe('When a Feature Aspect is added to Design Update Scope it becomes editable in the Design Update editor', () => {

        it('is not editable when not in scope', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = null;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 0, 'Edit option found!');
        });

        it('is not editable when in parent scope', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_PARENT_SCOPE, isNew: false};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 0, 'Edit option found!');
        });

        it('is editable when in scope', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 1, 'Edit option not found!');
        });
    });

    describe('When a Scenario is added to Design Update Scope it becomes editable in the Design Update editor', () => {

        it('is not editable when not in scope', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const updateItem = null;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 0, 'Edit option found!');
        });

        it('is editable when in scope', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const updateItem = {scopeType: UpdateScopeType.SCOPE_IN_SCOPE, isNew: false};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 1, 'Edit option not found!');
        });
    });

    describe('When a Design Component is removed from Design Update Scope it disappears from the Design Update editor', () => {

        it('application is not present if not in scope', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const updateItem = null;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find('#editorHeaderItem').length === 0, 'Application was found');
        });

        it('design section is not present if not in scope', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const updateItem = null;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find('#editorHeaderItem').length === 0, 'Section was found');
        });

        it('feature is not present if not in scope', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const updateItem = null;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find('#editorHeaderItem').length === 0, 'Feature was found');
        });

        it('feature aspect is not present if not in scope', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = null;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find('#editorHeaderItem').length === 0, 'Feature aspect was found');
        });

        it('scenario is not present if not in scope', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const updateItem = null;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;

            const item = designComponentHeaderTest(currentItem, updateItem, mode, view, displayContext);

            chai.assert(item.find('#editorHeaderItem').length === 0, 'Scenario was found');
        });
    });

});

