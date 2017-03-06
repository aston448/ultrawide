import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignComponent } from './DesignComponent.jsx';  // Non Redux wrapped

import { DesignVersionStatus, RoleType, ViewType, ViewMode, DisplayContext} from '../../../constants/constants.js'

import { DesignVersions } from '../../../collections/design/design_versions.js'

describe('JSX: DesignComponent', () => {

    describe('A selected Design Component is highlighted', () => {

        it('is highlighted if selected', () => {

            const currentItem = {_id: 'componentId'};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;
            const displayContext = DisplayContext.BASE_VIEW;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};  // Context has current item id
            const testSummary = false;
            const testSummaryData = {};
            const testDataFlag = false;
            const openDesignItems = [];
            const openDesignUpdateItems = [];
            const openWorkPackageItems = [];


            const item = shallow(
                <DesignComponent
                    currentItem={currentItem}
                    designItem={designItem}
                    updateItem={updateItem}
                    isDragDropHovering={isDragDropHovering}
                    displayContext={displayContext}
                    testSummary={testSummary}
                    testSummaryData={testSummaryData}
                    mode={mode}
                    view={view}
                    userContext={userContext}
                    openDesignItems={openDesignItems}
                    openDesignUpdateItems={openDesignUpdateItems}
                    openWorkPackageItems={openWorkPackageItems}
                    testDataFlag={testDataFlag}
                />
            );

            // Component has active style
            chai.assert.equal(item.find('#designComponent').props().className, 'design-component dc-active', 'Expected component to be active');

        });

        it('another component is not highlighted', () => {

            const currentItem = {_id: 'componentId'};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;
            const displayContext = DisplayContext.BASE_VIEW;
            const userContext = {designVersionId: 'ABC', designComponentId: 'anotherComponentId'};  // Context has different item id
            const testSummary = false;
            const testSummaryData = {};
            const testDataFlag = false;
            const openDesignItems = [];
            const openDesignUpdateItems = [];
            const openWorkPackageItems = [];

            const item = shallow(
                <DesignComponent
                    currentItem={currentItem}
                    designItem={designItem}
                    updateItem={updateItem}
                    isDragDropHovering={isDragDropHovering}
                    displayContext={displayContext}
                    testSummary={testSummary}
                    testSummaryData={testSummaryData}
                    mode={mode}
                    view={view}
                    userContext={userContext}
                    openDesignItems={openDesignItems}
                    openDesignUpdateItems={openDesignUpdateItems}
                    openWorkPackageItems={openWorkPackageItems}
                    testDataFlag={testDataFlag}
                />
            );

            // Component has active style
            chai.assert.equal(item.find('#designComponent').props().className, 'design-component', 'Expected component NOT to be active');
        });

    });

    describe('Only one Design Component may be selected at any one time', () => {

        it('can only have one item matching the user context item', () => {

            const currentItem1 = {_id: 'component1Id'};
            const currentItem2 = {_id: 'component2Id'};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;
            const displayContext = DisplayContext.BASE_VIEW;
            const userContext = {designVersionId: 'ABC', designComponentId: 'component1Id'}; // Item 1 is in user context
            const testSummary = false;
            const testSummaryData = {};
            const testDataFlag = false;
            const openDesignItems = [];
            const openDesignUpdateItems = [];
            const openWorkPackageItems = [];

            const item1 = shallow(
                <DesignComponent
                    currentItem={currentItem1}
                    designItem={designItem}
                    updateItem={updateItem}
                    isDragDropHovering={isDragDropHovering}
                    displayContext={displayContext}
                    testSummary={testSummary}
                    testSummaryData={testSummaryData}
                    mode={mode}
                    view={view}
                    userContext={userContext}
                    openDesignItems={openDesignItems}
                    openDesignUpdateItems={openDesignUpdateItems}
                    openWorkPackageItems={openWorkPackageItems}
                    testDataFlag={testDataFlag}
                />
            );

            const item2 = shallow(
                <DesignComponent
                    currentItem={currentItem2}
                    designItem={designItem}
                    updateItem={updateItem}
                    isDragDropHovering={isDragDropHovering}
                    displayContext={displayContext}
                    testSummary={testSummary}
                    testSummaryData={testSummaryData}
                    mode={mode}
                    view={view}
                    userContext={userContext}
                    openDesignItems={openDesignItems}
                    openDesignUpdateItems={openDesignUpdateItems}
                    openWorkPackageItems={openWorkPackageItems}
                    testDataFlag={testDataFlag}
                />
            );

            chai.assert.equal(item1.find('#designComponent').props().className, 'design-component dc-active', 'Expected component to be active');
            chai.assert.equal(item2.find('#designComponent').props().className, 'design-component', 'Expected component NOT to be active');
        })
    })


});

