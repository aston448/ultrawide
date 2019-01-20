import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignComponentHeader } from '../DesignComponentHeader.jsx';  // Non Redux wrapped

import { DesignVersionStatus, RoleType, ViewType, ViewMode, DisplayContext, ComponentType, UpdateMergeStatus} from '../../../../constants/constants.js'

import { UI }           from "../../../../constants/ui_context_ids";
import { hashID }       from "../../../../common/utils";

describe('JSX: DesCompHdr DC', () => {

    // Design Components -----------------------------------------------------------------------------------------------

    function designComponentHeaderTest(currentItem, mode, view, displayContext, testSummary = false){

        const wpItem = {};
        const updateItem = {};
        const isDragDropHovering = false;
        const onToggleOpen = () => {};
        const onSelectItem = () => {};
        const userContext = {designVersionId: 'ABC'};
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

    describe('Editing Features are not available when in View Only mode', () => {

        it('does not have an edit option', () => {

            const currentItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED;
            const displayContext = DisplayContext.BASE_VIEW;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // No edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 0, 'Edit option found!');
        });

        it('does not have delete option', () => {

            const currentItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED;
            const displayContext = DisplayContext.BASE_VIEW;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // No delete option
            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 0, 'Delete option found!');
        });

        it('does not have move option', () => {

            const currentItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED;
            const displayContext = DisplayContext.BASE_VIEW;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // No move option
            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Move option found!');
        });

    });

    describe('There is no option to remove a Design Component in View Only mode', () => {

        it('does not have delete option', () => {

            const currentItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED;
            const displayContext = DisplayContext.BASE_VIEW;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // No delete option
            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 0, 'Delete option found!');
        });
    });

    describe('There is no move option for a Design Component in View Only mode', () => {

        it('does not have move option', () => {

            const currentItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED;
            const displayContext = DisplayContext.BASE_VIEW;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // No move option
            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Move option found!');
        });
    });

    describe('There is no reorder option for a Design Component in View Only mode', () => {

        it('does not have move option', () => {

            const currentItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED;
            const displayContext = DisplayContext.BASE_VIEW;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // No move option
            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Reorder option found!');
        });
    });

    describe('All editing features are restored when View Only mode is cancelled', () => {

        it('has edit option', () => {

            const currentItem = {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 1, 'Edit option not found');
        });

        it('has delete option', () => {

            const currentItem = {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has delete option
            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 1, 'Delete option not found');
        });

        it('has move option', () => {

            const currentItem = {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has move option
            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 1, 'Move option not found');
        });
    });


    describe('Each parent Design Component has a toggle to open or close it', () => {

        it('an application has open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openCloseIcon_ComponentName').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon_ComponentName').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('an application has open-close option in view mode', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED;
            const displayContext = DisplayContext.BASE_VIEW;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openCloseIcon_ComponentName').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon_ComponentName').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a design section has open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openCloseIcon_ComponentName').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon_ComponentName').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a design section has open-close option in view mode', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED;
            const displayContext = DisplayContext.BASE_VIEW;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openCloseIcon_ComponentName').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon_ComponentName').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a feature has open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openCloseIcon_ComponentName').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon_ComponentName').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a feature has open-close option in view mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED;
            const displayContext = DisplayContext.BASE_VIEW;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openCloseIcon_ComponentName').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon_ComponentName').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a feature aspect has open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openCloseIcon_ComponentName').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon_ComponentName').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a feature aspect has open-close option in view mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED;
            const displayContext = DisplayContext.BASE_VIEW;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert(item.find('#openCloseIcon_ComponentName').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon_ComponentName').props().className, 'invisible', 'Open-close option was invisible!');

        });

    });

    describe('A Scenario does not have a toggle to open or close it', () => {

        it('a scenario has no open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert.equal(item.find('#openCloseIcon_ComponentName').props().className, 'invisible', 'Open-close option was visible!');

        });

        it('a scenario has no open-close option in view mode', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED;
            const displayContext = DisplayContext.BASE_VIEW;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            chai.assert.equal(item.find('#openCloseIcon_ComponentName').props().className, 'invisible', 'Open-close option was visible!');

        });
    });

    describe('Each Design Component has an option to edit its name', () => {

        it('application has edit option', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 1, 'Edit option not found!');
        });

        it('design section has edit option', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 1, 'Edit option not found!');
        });

        it('feature has edit option', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 1, 'Edit option not found!');
        });

        it('feature aspect has edit option', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 1, 'Edit option not found!');
        });

        it('scenario has edit option', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 1, 'Edit option not found!');
        });

    });

    describe('There is no option to edit a Design Component name in View Only mode', () => {

        it('application has no edit option', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 0, 'Edit option found!');
        });

        it('design section has no edit option', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 0, 'Edit option found!');
        });

        it('feature has no edit option', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 0, 'Edit option found!');
        });

        it('feature aspect has no edit option', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 0, 'Edit option found!');
        });

        it('scenario has no edit option', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            const item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 0, 'Edit option found!');
        });
    });

    describe('A Design Component name being edited has an option to save the changes', () => {

        it('application has a save option when being edited', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Edit
            item.setState({editing: true});

            // Has save option
            chai.assert(item.find(hashID(UI.OPTION_SAVE, 'ComponentName')).length === 1, 'Save option not found!');
        });

        it('design section has a save option when being edited', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Edit
            item.setState({editing: true});

            // Has save option
            chai.assert(item.find(hashID(UI.OPTION_SAVE, 'ComponentName')).length === 1, 'Save option not found!');
        });

        it('feature has a save option when being edited', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Edit
            item.setState({editing: true});

            // Has save option
            chai.assert(item.find(hashID(UI.OPTION_SAVE, 'ComponentName')).length === 1, 'Save option not found!');
        });

        it('feature aspect has a save option when being edited', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Edit
            item.setState({editing: true});

            // Has save option
            chai.assert(item.find(hashID(UI.OPTION_SAVE, 'ComponentName')).length === 1, 'Save option not found!');
        });

        it('scenario has a save option when being edited', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Edit
            item.setState({editing: true});

            // Has save option
            chai.assert(item.find(hashID(UI.OPTION_SAVE, 'ComponentName')).length === 1, 'Save option not found!');
        });
    });

    describe('A Design Component name being edited has an option to discard the changes', () => {

        it('application has undo option when being edited', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Edit
            item.setState({editing: true});

            // Has undo option
            chai.assert(item.find(hashID(UI.OPTION_UNDO, 'ComponentName')).length === 1, 'Undo option not found!');
        });

        it('design section has undo option when being edited', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Edit
            item.setState({editing: true});

            // Has undo option
            chai.assert(item.find(hashID(UI.OPTION_UNDO, 'ComponentName')).length === 1, 'Undo option not found!');
        });

        it('feature has undo option when being edited', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Edit
            item.setState({editing: true});

            // Has undo option
            chai.assert(item.find(hashID(UI.OPTION_UNDO, 'ComponentName')).length === 1, 'Undo option not found!');
        });

        it('feature aspect has undo option when being edited', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Edit
            item.setState({editing: true});

            // Has undo option
            chai.assert(item.find(hashID(UI.OPTION_UNDO, 'ComponentName')).length === 1, 'Undo option not found!');
        });

        it('scenario has undo option when being edited', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Edit
            item.setState({editing: true});

            // Has undo option
            chai.assert(item.find(hashID(UI.OPTION_UNDO, 'ComponentName')).length === 1, 'Undo option not found!');
        });
    });


    describe('Design Component names can not be edited in View Only mode', () => {

        it('application has no edit option', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 0, 'Has edit option');
        });

        it('design section has no edit option', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 0, 'Has edit option');
        });

        it('feature has no edit option', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 0, 'Has edit option');
        });

        it('feature aspect has no edit option', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 0, 'Has edit option');
        });

        it('scenario has no edit option', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no edit option
            chai.assert(item.find(hashID(UI.OPTION_EDIT, 'ComponentName')).length === 0, 'Has edit option');
        });
    });

    describe('Each Design Component has a remove option', () => {

        it('application has remove option', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has delete option
            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 1, 'Remove option not found!');
        });

        it('design section has remove option', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has delete option
            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 1, 'Remove option not found!');
        });

        it('feature has remove option', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has delete option
            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 1, 'Remove option not found!');
        });

        it('feature aspect has remove option', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has delete option
            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 1, 'Remove option not found!');
        });

        it('scenario has remove option', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has delete option
            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 1, 'Remove option not found!');
        });


    });

    describe('Design Components can only be removed when in edit mode', () => {

        it('view only application has no remove option', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no delete option
            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 0, 'Remove option found!');
        });

        it('view only design section has no remove option', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no delete option
            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 0, 'Remove option found!');
        });

        it('view only feature has no remove option', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no delete option
            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 0, 'Remove option found!');
        });

        it('view only feature aspect has no remove option', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no delete option
            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 0, 'Remove option found!');
        });

        it('view only scenario has no remove option', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no delete option
            chai.assert(item.find(hashID(UI.OPTION_REMOVE, 'ComponentName')).length === 0, 'Remove option found!');
        });
    });

    describe('A Design Component has an option to move that component to another location in the Design', () => {

        it('application has move option', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has move option
            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 1, 'Move option not found!');
        });

        it('design section has move option', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has move option
            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 1, 'Move option not found!');
        });

        it('feature has move option', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has move option
            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 1, 'Move option not found!');
        });

        it('feature aspect has move option', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has move option
            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 1, 'Move option not found!');
        });

        it('scenario has move option', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has move option
            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 1, 'Move option not found!');
        });


    });

    describe('Design Components can only be moved when in edit mode', () => {

        it('view only application has no move option', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no move option
            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Move option found!');
        });

        it('view only design section has no move option', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no move option
            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Move option found!');
        });

        it('view only feature has no move option', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no move option
            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Move option found!');
        });

        it('view only feature aspect has no move option', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no move option
            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Move option found!');
        });

        it('view only scenario has no move option', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no move option
            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Move option found!');
        });
    });

    describe('A Design Component has an option to move that component to another position within its parent component', () => {

        it('application has move option', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has move option
            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 1, 'Move option not found!');
        });

        it('design section has move option', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has move option
            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 1, 'Move option not found!');
        });

        it('feature has move option', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has move option
            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 1, 'Move option not found!');
        });

        it('feature aspect has move option', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has move option
            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 1, 'Move option not found!');
        });

        it('scenario has move option', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has move option
            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 1, 'Move option not found!');
        });
    });

    describe('Design Components may only be reordered when in edit mode', () => {

        it('view only application has no move option', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no move option
            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Move option found!');
        });

        it('view only design section has no move option', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no move option
            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Move option found!');
        });

        it('view only feature has no move option', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no move option
            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Move option found!');
        });

        it('view only feature aspect has no move option', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no move option
            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Move option found!');
        });

        it('view only scenario has no move option', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext);

            // Has no move option
            chai.assert(item.find(hashID(UI.OPTION_MOVE, 'ComponentName')).length === 0, 'Move option found!');
        });
    });

    // Test Summary ----------------------------------------------------------------------------------------------------
    describe('The Test Summary may be shown for a Design Version', () => {

        it('shows a feature test summary for a feature in edit mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext, true);


            chai.assert(item.find('#featureTestSummary').length === 1, 'Feature test summary not found!');
        });

        it('shows a feature test summary for a feature in view only mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext, true);


            chai.assert(item.find('#featureTestSummary').length === 1, 'Feature test summary not found!');
        });

        it('shows a feature test summary for a feature when viewing', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED;
            const displayContext = DisplayContext.BASE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext, true);

            chai.assert(item.find('#featureTestSummary').length === 1, 'Feature test summary not found!');
        });

        it('shows a scenario test summary for a scenario in edit mode', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext, true);


            chai.assert(item.find('#scenarioTestSummary').length === 1, 'Scenario test summary not found!');
        });

        it('shows a scenario test summary for a scenario in view only mode', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext, true);


            chai.assert(item.find('#scenarioTestSummary').length === 1, 'Scenario test summary not found!');
        });

        it('shows a scenario test summary for a scenario when viewing', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED;
            const displayContext = DisplayContext.BASE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext, true);

            chai.assert(item.find('#scenarioTestSummary').length === 1, 'Scenario test summary not found!');
        });
    });

    describe('The Test Summary may be hidden for a Design Version', () => {

        it('no feature test summary for a feature in edit mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext, false);


            chai.assert(item.find('#featureTestSummary').length === 0, 'Feature test summary found!');
        });

        it('no feature test summary for a feature in view only mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext, false);


            chai.assert(item.find('#featureTestSummary').length === 0, 'Feature test summary found!');
        });

        it('no feature test summary for a feature when viewing', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED;
            const displayContext = DisplayContext.BASE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext, false);

            chai.assert(item.find('#featureTestSummary').length === 0, 'Feature test summary found!');
        });

        it('no scenario test summary for a scenario in edit mode', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext, false);


            chai.assert(item.find('#scenarioTestSummary').length === 0, 'Scenario test summary found!');
        });

        it('no scenario test summary for a scenario in view only mode', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext, false);


            chai.assert(item.find('#scenarioTestSummary').length === 0, 'Scenario test summary found!');
        });

        it('no scenario test summary for a scenario when viewing', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED;
            const displayContext = DisplayContext.BASE_VIEW;

            let item = designComponentHeaderTest(currentItem, mode, view, displayContext, false);

            chai.assert(item.find('#scenarioTestSummary').length === 0, 'Scenario test summary found!');
        });
    });

    // Design Version Progress Components ------------------------------------------------------------------------------

    function designComponentHeaderVersionUpdateViewTest(currentItem, updateItem){

        const wpItem= {};
        const isDragDropHovering = false;
        const onToggleOpen = () => {};
        const onSelectItem = () => {};
        const userContext = {designVersionId: 'ABC'};
        const testSummary = false;
        const testSummaryData = {};
        const isOpen = true;
        const testDataFlag = 1;
        const viewOptions = {};
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
                mode={ViewMode.MODE_VIEW}
                view={ViewType.DESIGN_UPDATABLE}
                displayContext={DisplayContext.WORKING_VIEW}
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

    describe('A Design Component added in a Design Update has a status of Added', () => {

        it('added application is marked as added', () => {

            const currentItem = {componentType: ComponentType.APPLICATION, updateMergeStatus: UpdateMergeStatus.COMPONENT_ADDED, workPackageId: 'NONE'};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Has a status icon
            chai.assert(item.find('#updateStatusIcon').length === 1, 'Update status icon not found!');
            chai.assert.equal(item.find('#updateStatusIcon').props().className, 'update-merge-status component-added', 'Update status not added');
        });

        it('added design section is marked as added', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION, updateMergeStatus: UpdateMergeStatus.COMPONENT_ADDED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Has a status icon
            chai.assert(item.find('#updateStatusIcon').length === 1, 'Update status icon not found!');
            chai.assert.equal(item.find('#updateStatusIcon').props().className, 'update-merge-status component-added', 'Update status not added');
        });

        it('added feature is marked as added', () => {

            const currentItem = {componentType: ComponentType.FEATURE, updateMergeStatus: UpdateMergeStatus.COMPONENT_ADDED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Has a status icon
            chai.assert(item.find('#updateStatusIcon').length === 1, 'Update status icon not found!');
            chai.assert.equal(item.find('#updateStatusIcon').props().className, 'update-merge-status component-added', 'Update status not added');
        });

        it('added feature aspect is marked as added', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, updateMergeStatus: UpdateMergeStatus.COMPONENT_ADDED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Has a status icon
            chai.assert(item.find('#updateStatusIcon').length === 1, 'Update status icon not found!');
            chai.assert.equal(item.find('#updateStatusIcon').props().className, 'update-merge-status component-added', 'Update status not added');
        });

        it('added scenario is marked as added', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, updateMergeStatus: UpdateMergeStatus.COMPONENT_ADDED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Has a status icon
            chai.assert(item.find('#updateStatusIcon').length === 1, 'Update status icon not found!');
            chai.assert.equal(item.find('#updateStatusIcon').props().className, 'update-merge-status component-added', 'Update status not added');
        });
    });

    describe('A Design Component whose name is modified in a Design Update has a status of Modified', () => {

        it('modified application is marked as modified', () => {

            const currentItem = {componentType: ComponentType.APPLICATION, updateMergeStatus: UpdateMergeStatus.COMPONENT_MODIFIED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Has a status icon
            chai.assert(item.find('#updateStatusIcon').length === 1, 'Update status icon not found!');
            chai.assert.equal(item.find('#updateStatusIcon').props().className, 'update-merge-status component-modified', 'Update status not modified');
        });

        it('modified design section is marked as modified', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION, updateMergeStatus: UpdateMergeStatus.COMPONENT_MODIFIED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Has a status icon
            chai.assert(item.find('#updateStatusIcon').length === 1, 'Update status icon not found!');
            chai.assert.equal(item.find('#updateStatusIcon').props().className, 'update-merge-status component-modified', 'Update status not modified');
        });

        it('modified feature is marked as modified', () => {

            const currentItem = {componentType: ComponentType.FEATURE, updateMergeStatus: UpdateMergeStatus.COMPONENT_MODIFIED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Has a status icon
            chai.assert(item.find('#updateStatusIcon').length === 1, 'Update status icon not found!');
            chai.assert.equal(item.find('#updateStatusIcon').props().className, 'update-merge-status component-modified', 'Update status not modified');
        });

        it('modified feature aspect is marked as modified', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, updateMergeStatus: UpdateMergeStatus.COMPONENT_MODIFIED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Has a status icon
            chai.assert(item.find('#updateStatusIcon').length === 1, 'Update status icon not found!');
            chai.assert.equal(item.find('#updateStatusIcon').props().className, 'update-merge-status component-modified', 'Update status not modified');
        });

        it('modified scenario is marked as modified', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, updateMergeStatus: UpdateMergeStatus.COMPONENT_MODIFIED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Has a status icon
            chai.assert(item.find('#updateStatusIcon').length === 1, 'Update status icon not found!');
            chai.assert.equal(item.find('#updateStatusIcon').props().className, 'update-merge-status component-modified', 'Update status not modified');
        });
    });

    describe('A Design Component whose text is modified in a Design Update has a status of Text Changed', () => {

        it('text modified application is marked as text modified', () => {

            const currentItem = {componentType: ComponentType.APPLICATION, updateMergeStatus: UpdateMergeStatus.COMPONENT_DETAILS_MODIFIED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Has a status icon
            chai.assert(item.find('#updateStatusIcon').length === 1, 'Update status icon not found!');
            chai.assert.equal(item.find('#updateStatusIcon').props().className,  'update-merge-status component-details-modified', 'Update status not details-modified');
        });

        it('text modified design section is marked as text modified', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION, updateMergeStatus: UpdateMergeStatus.COMPONENT_DETAILS_MODIFIED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Has a status icon
            chai.assert(item.find('#updateStatusIcon').length === 1, 'Update status icon not found!');
            chai.assert.equal(item.find('#updateStatusIcon').props().className,  'update-merge-status component-details-modified', 'Update status not details-modified');
        });

        it('text modified feature is marked as text modified', () => {

            const currentItem = {componentType: ComponentType.FEATURE, updateMergeStatus: UpdateMergeStatus.COMPONENT_DETAILS_MODIFIED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Has a status icon
            chai.assert(item.find('#updateStatusIcon').length === 1, 'Update status icon not found!');
            chai.assert.equal(item.find('#updateStatusIcon').props().className,  'update-merge-status component-details-modified', 'Update status not details-modified');
        });


        it('text modified scenario is marked as text modified', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, updateMergeStatus: UpdateMergeStatus.COMPONENT_DETAILS_MODIFIED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Has a status icon
            chai.assert(item.find('#updateStatusIcon').length === 1, 'Update status icon not found!');
            chai.assert.equal(item.find('#updateStatusIcon').props().className,  'update-merge-status component-details-modified', 'Update status not details-modified');
        });
    });

    describe('A Design Component removed in a Design Update has a status of Removed', () => {

        it('removed application is marked as removed', () => {

            const currentItem = {componentType: ComponentType.APPLICATION, updateMergeStatus: UpdateMergeStatus.COMPONENT_REMOVED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Has a status icon
            chai.assert(item.find('#updateStatusIcon').length === 1, 'Update status icon not found!');
            chai.assert.equal(item.find('#updateStatusIcon').props().className, 'update-merge-status component-removed', 'Update status not removed');
        });

        it('removed design section is marked as removed', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION, updateMergeStatus: UpdateMergeStatus.COMPONENT_REMOVED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Has a status icon
            chai.assert(item.find('#updateStatusIcon').length === 1, 'Update status icon not found!');
            chai.assert.equal(item.find('#updateStatusIcon').props().className, 'update-merge-status component-removed', 'Update status not removed');
        });

        it('removed feature is marked as removed', () => {

            const currentItem = {componentType: ComponentType.FEATURE, updateMergeStatus: UpdateMergeStatus.COMPONENT_REMOVED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Has a status icon
            chai.assert(item.find('#updateStatusIcon').length === 1, 'Update status icon not found!');
            chai.assert.equal(item.find('#updateStatusIcon').props().className, 'update-merge-status component-removed', 'Update status not removed');
        });

        it('removed feature aspect is marked as removed', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, updateMergeStatus: UpdateMergeStatus.COMPONENT_REMOVED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Has a status icon
            chai.assert(item.find('#updateStatusIcon').length === 1, 'Update status icon not found!');
            chai.assert.equal(item.find('#updateStatusIcon').props().className, 'update-merge-status component-removed', 'Update status not removed');
        });

        it('removed scenario is marked as removed', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, updateMergeStatus: UpdateMergeStatus.COMPONENT_REMOVED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Has a status icon
            chai.assert(item.find('#updateStatusIcon').length === 1, 'Update status icon not found!');
            chai.assert.equal(item.find('#updateStatusIcon').props().className, 'update-merge-status component-removed', 'Update status not removed');
        });
    });

    describe('A Design Component moved in an Documentation Update has a status of Moved', () => {

        it('moved application is marked as moved', () => {

            const currentItem = {componentType: ComponentType.APPLICATION, updateMergeStatus: UpdateMergeStatus.COMPONENT_MOVED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Has a status icon
            chai.assert(item.find('#updateStatusIcon').length === 1, 'Update status icon not found!');
            chai.assert.equal(item.find('#updateStatusIcon').props().className, 'update-merge-status component-moved', 'Update status not moved');
        });

        it('moved design section is marked as moved', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION, updateMergeStatus: UpdateMergeStatus.COMPONENT_MOVED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Has a status icon
            chai.assert(item.find('#updateStatusIcon').length === 1, 'Update status icon not found!');
            chai.assert.equal(item.find('#updateStatusIcon').props().className, 'update-merge-status component-moved', 'Update status not moved');
        });

        it('moved feature is marked as moved', () => {

            const currentItem = {componentType: ComponentType.FEATURE, updateMergeStatus: UpdateMergeStatus.COMPONENT_MOVED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Has a status icon
            chai.assert(item.find('#updateStatusIcon').length === 1, 'Update status icon not found!');
            chai.assert.equal(item.find('#updateStatusIcon').props().className, 'update-merge-status component-moved', 'Update status not moved');
        });

        it('moved feature aspect is marked as moved', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, updateMergeStatus: UpdateMergeStatus.COMPONENT_MOVED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Has a status icon
            chai.assert(item.find('#updateStatusIcon').length === 1, 'Update status icon not found!');
            chai.assert.equal(item.find('#updateStatusIcon').props().className, 'update-merge-status component-moved', 'Update status not moved');
        });

        it('moved scenario is marked as moved', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, updateMergeStatus: UpdateMergeStatus.COMPONENT_MOVED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Has a status icon
            chai.assert(item.find('#updateStatusIcon').length === 1, 'Update status icon not found!');
            chai.assert.equal(item.find('#updateStatusIcon').props().className, 'update-merge-status component-moved', 'Update status not moved');
        });
    });

    // describe('For Design Components whose name has changed, the new and old names are shown', () => {
    //
    //     it('shows old and new text for changed application', () => {
    //
    //         const currentItem = {componentType: ComponentType.APPLICATION, componentNameNew: 'ApplicationOld', updateMergeStatus: UpdateMergeStatus.COMPONENT_MODIFIED};
    //         const updateItem = {componentNameOld: 'ApplicationOld', componentNameNew: 'ApplicationNew'};
    //
    //         let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);
    //
    //         // Has a status icon
    //         chai.assert(item.find('#updateStatusIcon').length === 1, 'Update status icon not found!');
    //         chai.assert.equal(item.find('#updateStatusIcon').props().className, 'update-merge-status component-modified', 'Update status not modified');
    //         chai.assert.equal(item.state().name, 'NEW: ApplicationNew\nOLD: ApplicationOld', 'New and old text not shown')
    //     });
    // });

    describe('Removed Design Components are shown as struck through', () => {


        it('removed application is struck through', () => {

            const currentItem = {componentType: ComponentType.APPLICATION, updateMergeStatus: UpdateMergeStatus.COMPONENT_REMOVED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Check that strike through has been added to item class
            chai.assert(item.find('#editorReadOnly').props().className.includes('removed-item'), 'Update status not struck through');
        });

        it('removed design section is struck through', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION, updateMergeStatus: UpdateMergeStatus.COMPONENT_REMOVED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Check that strike through has been added to item class
            chai.assert(item.find('#editorReadOnly').props().className.includes('removed-item'), 'Update status not struck through');
        });

        it('removed feature is struck through', () => {

            const currentItem = {componentType: ComponentType.FEATURE, updateMergeStatus: UpdateMergeStatus.COMPONENT_REMOVED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Check that strike through has been added to item class
            chai.assert(item.find('#editorReadOnly').props().className.includes('removed-item'), 'Update status not struck through');
        });

        it('removed feature aspect is struck through', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT, updateMergeStatus: UpdateMergeStatus.COMPONENT_REMOVED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Check that strike through has been added to item class
            chai.assert(item.find('#editorReadOnly').props().className.includes('removed-item'), 'Update status not struck through');
        });

        it('removed scenario is struck through', () => {

            const currentItem = {componentType: ComponentType.SCENARIO, updateMergeStatus: UpdateMergeStatus.COMPONENT_REMOVED};
            const updateItem = {};

            let item = designComponentHeaderVersionUpdateViewTest(currentItem, updateItem);

            // Check that strike through has been added to item class
            chai.assert(item.find('#editorReadOnly').props().className.includes('removed-item'), 'Update status not struck through');
        });
    });
});
