import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignComponentHeader } from './DesignComponentHeader.jsx';  // Non Redux wrapped

import { DesignVersionStatus, RoleType, ViewType, ViewMode, DisplayContext, ComponentType} from '../../../constants/constants.js'

import { DesignVersions } from '../../../collections/design/design_versions.js'

describe('JSX: DesignComponentHeader', () => {

    beforeEach((error) => {

        console.log(error);
    });

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

            chai.assert(item.find('#openClose').length === 0, 'Open-close option was found!');

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

            chai.assert(item.find('#openClose').length === 0, 'Open-close option was found!');

        });
    });
});
