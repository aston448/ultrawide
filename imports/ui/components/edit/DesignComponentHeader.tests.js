import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignComponentHeader } from './DesignComponentHeader.jsx';  // Non Redux wrapped

import { DesignVersionStatus, RoleType, ViewType, ViewMode, DisplayContext, ComponentType} from '../../../constants/constants.js'

import { DesignVersions } from '../../../collections/design/design_versions.js'

describe('JSX: DesignComponentHeader', () => {

    describe('Editing Features are not available when in View Only mode', () => {

        it('does not have an edit, delete or move option', () => {

            const currentItem = {};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;
            const displayContext = DisplayContext.BASE_VIEW;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};


            const item = shallow(
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

            // No edit option
            chai.assert(item.find('#actionEdit').length === 0, 'Edit option found!');

            // No delete option
            chai.assert(item.find('#actionDelete').length === 0, 'Delete option found!');

            // No move option
            chai.assert(item.find('#actionMove').length === 0, 'Move option found!');
        });

    });

    describe('All editing features are restored when View Only mode is cancelled', () => {

        it('has edit, delete and move options', () => {

            const currentItem = {};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};


            const item = shallow(
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

            // Has edit option
            chai.assert(item.find('#actionEdit').length === 1, 'Edit option not found');

            // Has delete option
            chai.assert(item.find('#actionDelete').length === 1, 'Delete option not found');

            // Has move option
            chai.assert(item.find('#actionMove').length === 1, 'Move option not found');
        });
    });


    describe('Each Design Component has a toggle to open or close it', () => {

        it('an application has open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('an application has open-close option in view mode', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;
            const displayContext = DisplayContext.BASE_VIEW;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a design section has open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a design section has open-close option in view mode', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;
            const displayContext = DisplayContext.BASE_VIEW;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a feature has open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a feature has open-close option in view mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;
            const displayContext = DisplayContext.BASE_VIEW;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a feature aspect has open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

        it('a feature aspect has open-close option in view mode', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;
            const displayContext = DisplayContext.BASE_VIEW;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            chai.assert(item.find('#openClose').length === 1, 'Open-close option not found');
            chai.assert.notEqual(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was invisible!');

        });

    });

    describe('A Scenario does not have a toggle to open or close it', () => {

        it('a scenario has no open-close option in edit mode', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            chai.assert.equal(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was visible!');

        });

        it('a scenario has no open-close option in view mode', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;
            const displayContext = DisplayContext.BASE_VIEW;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            chai.assert.equal(item.find('#openCloseIcon').props().className, 'invisible', 'Open-close option was visible!');

        });
    });

    describe('Each Design Component has an option to edit its name', () => {

        it('application has edit option', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has edit option
            chai.assert(item.find('#actionEdit').length === 1, 'Edit option not found!');
        });

        it('design section has edit option', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has edit option
            chai.assert(item.find('#actionEdit').length === 1, 'Edit option not found!');
        });

        it('feature has edit option', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has edit option
            chai.assert(item.find('#actionEdit').length === 1, 'Edit option not found!');
        });

        it('feature aspect has edit option', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has edit option
            chai.assert(item.find('#actionEdit').length === 1, 'Edit option not found!');
        });

        it('scenario has edit option', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has edit option
            chai.assert(item.find('#actionEdit').length === 1, 'Edit option not found!');
        });

    });

    describe('A Design Component name being edited has an option to save the changes', () => {

        it('application has a save option when being edited', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Edit
            item.setState({editable: true});

            // Has save option
            chai.assert(item.find('#actionSave').length === 1, 'Save option not found!');
        });

        it('design section has a save option when being edited', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Edit
            item.setState({editable: true});

            // Has save option
            chai.assert(item.find('#actionSave').length === 1, 'Save option not found!');
        });

        it('feature has a save option when being edited', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Edit
            item.setState({editable: true});

            // Has save option
            chai.assert(item.find('#actionSave').length === 1, 'Save option not found!');
        });

        it('feature aspect has a save option when being edited', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Edit
            item.setState({editable: true});

            // Has save option
            chai.assert(item.find('#actionSave').length === 1, 'Save option not found!');
        });

        it('scenario has a save option when being edited', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Edit
            item.setState({editable: true});

            // Has save option
            chai.assert(item.find('#actionSave').length === 1, 'Save option not found!');
        });
    });

    describe('A Design Component name being edited has an option to discard the changes', () => {

        it('application has undo option when being edited', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Edit
            item.setState({editable: true});

            // Has undo option
            chai.assert(item.find('#actionUndo').length === 1, 'Undo option not found!');
        });

        it('design section has undo option when being edited', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Edit
            item.setState({editable: true});

            // Has undo option
            chai.assert(item.find('#actionUndo').length === 1, 'Undo option not found!');
        });

        it('feature has undo option when being edited', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Edit
            item.setState({editable: true});

            // Has undo option
            chai.assert(item.find('#actionUndo').length === 1, 'Undo option not found!');
        });

        it('feature aspect has undo option when being edited', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Edit
            item.setState({editable: true});

            // Has undo option
            chai.assert(item.find('#actionUndo').length === 1, 'Undo option not found!');
        });

        it('scenario has undo option when being edited', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Edit
            item.setState({editable: true});

            // Has undo option
            chai.assert(item.find('#actionUndo').length === 1, 'Undo option not found!');
        });
    });


    describe('Design Component names can not be edited in View Only mode', () => {

        it('application has no edit option', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has no edit option
            chai.assert(item.find('#actionEdit').length === 0, 'Has edit option');
        });

        it('design section has no edit option', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has no edit option
            chai.assert(item.find('#actionEdit').length === 0, 'Has edit option');
        });

        it('feature has no edit option', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has no edit option
            chai.assert(item.find('#actionEdit').length === 0, 'Has edit option');
        });

        it('feature aspect has no edit option', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has no edit option
            chai.assert(item.find('#actionEdit').length === 0, 'Has edit option');
        });

        it('scenario has no edit option', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has no edit option
            chai.assert(item.find('#actionEdit').length === 0, 'Has edit option');
        });
    });

    describe('Each Design Component has a remove option', () => {

        it('application has remove option', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has delete option
            chai.assert(item.find('#actionDelete').length === 1, 'Remove option not found!');
        });

        it('design section has remove option', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has delete option
            chai.assert(item.find('#actionDelete').length === 1, 'Remove option not found!');
        });

        it('feature has remove option', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has delete option
            chai.assert(item.find('#actionDelete').length === 1, 'Remove option not found!');
        });

        it('feature aspect has remove option', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has delete option
            chai.assert(item.find('#actionDelete').length === 1, 'Remove option not found!');
        });

        it('scenario has remove option', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has delete option
            chai.assert(item.find('#actionDelete').length === 1, 'Remove option not found!');
        });


    });

    describe('Design Components can only be removed when in edit mode', () => {

        it('view only application has no remove option', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has no delete option
            chai.assert(item.find('#actionDelete').length === 0, 'Remove option found!');
        });

        it('view only design section has no remove option', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has no delete option
            chai.assert(item.find('#actionDelete').length === 0, 'Remove option found!');
        });

        it('view only feature has no remove option', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has no delete option
            chai.assert(item.find('#actionDelete').length === 0, 'Remove option found!');
        });

        it('view only feature aspect has no remove option', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has no delete option
            chai.assert(item.find('#actionDelete').length === 0, 'Remove option found!');
        });

        it('view only scenario has no remove option', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has no delete option
            chai.assert(item.find('#actionDelete').length === 0, 'Remove option found!');
        });
    });

    describe('A Design Component has an option to move that component to another location in the Design', () => {

        it('application has move option', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has move option
            chai.assert(item.find('#actionMove').length === 1, 'Move option not found!');
        });

        it('design section has move option', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has move option
            chai.assert(item.find('#actionMove').length === 1, 'Move option not found!');
        });

        it('feature has move option', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has move option
            chai.assert(item.find('#actionMove').length === 1, 'Move option not found!');
        });

        it('feature aspect has move option', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has move option
            chai.assert(item.find('#actionMove').length === 1, 'Move option not found!');
        });

        it('scenario has move option', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has move option
            chai.assert(item.find('#actionMove').length === 1, 'Move option not found!');
        });


    });

    describe('Design Components can only be moved when in edit mode', () => {

        it('view only application has no move option', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has no move option
            chai.assert(item.find('#actionMove').length === 0, 'Move option found!');
        });

        it('view only design section has no move option', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has no move option
            chai.assert(item.find('#actionMove').length === 0, 'Move option found!');
        });

        it('view only feature has no move option', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has no move option
            chai.assert(item.find('#actionMove').length === 0, 'Move option found!');
        });

        it('view only feature aspect has no move option', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has no move option
            chai.assert(item.find('#actionMove').length === 0, 'Move option found!');
        });

        it('view only scenario has no move option', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has no move option
            chai.assert(item.find('#actionMove').length === 0, 'Move option found!');
        });
    });

    describe('A Design Component has an option to move that component to another position within its parent component', () => {

        it('application has move option', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has move option
            chai.assert(item.find('#actionMove').length === 1, 'Move option not found!');
        });

        it('design section has move option', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has move option
            chai.assert(item.find('#actionMove').length === 1, 'Move option not found!');
        });

        it('feature has move option', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has move option
            chai.assert(item.find('#actionMove').length === 1, 'Move option not found!');
        });

        it('feature aspect has move option', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has move option
            chai.assert(item.find('#actionMove').length === 1, 'Move option not found!');
        });

        it('scenario has move option', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has move option
            chai.assert(item.find('#actionMove').length === 1, 'Move option not found!');
        });


    });

    describe('Design Components may only be reordered when in edit mode', () => {

        it('view only application has no move option', () => {

            const currentItem = {componentType: ComponentType.APPLICATION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has no move option
            chai.assert(item.find('#actionMove').length === 0, 'Move option found!');
        });

        it('view only design section has no move option', () => {

            const currentItem = {componentType: ComponentType.DESIGN_SECTION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has no move option
            chai.assert(item.find('#actionMove').length === 0, 'Move option found!');
        });

        it('view only feature has no move option', () => {

            const currentItem = {componentType: ComponentType.FEATURE};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has no move option
            chai.assert(item.find('#actionMove').length === 0, 'Move option found!');
        });

        it('view only feature aspect has no move option', () => {

            const currentItem = {componentType: ComponentType.FEATURE_ASPECT};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has no move option
            chai.assert(item.find('#actionMove').length === 0, 'Move option found!');
        });

        it('view only scenario has no move option', () => {

            const currentItem = {componentType: ComponentType.SCENARIO};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const onToggleOpen = () => {};
            const onSelectItem = () => {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC'};
            const testSummary = false;
            const testSummaryData = {};
            const isOpen = true;
            const testDataFlag = false;
            const viewOptions = {};

            const item = shallow(
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

            // Has no move option
            chai.assert(item.find('#actionMove').length === 0, 'Move option found!');
        });
    });


});
