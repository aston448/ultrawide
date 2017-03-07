import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignComponent } from './DesignComponent.jsx';  // Non Redux wrapped

import { DesignVersionStatus, RoleType, ViewType, ViewMode, DisplayContext, ComponentType} from '../../../constants/constants.js'

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


            let item = shallow(
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
        });
    });

    describe('An Application has an option to add a new Design Section to it', () => {

        it('has the option in edit mode', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.APPLICATION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};
            const testSummary = false;
            const testSummaryData = {};
            const testDataFlag = false;
            const openDesignItems = ['componentId'];
            const openDesignUpdateItems = [];
            const openWorkPackageItems = [];

            let item = shallow(
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

            // Make sure item is open
            item.setState({open: true});

            chai.assert.equal(item.find('#addDesignSectionToApp').length, 1, 'Add design section not found');
        });

    });

    describe('A Design Section has an option to add a new Design Section to it as a sub section', () => {

        it('has the option in edit mode', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.DESIGN_SECTION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};
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

            // Make sure item is open
            item.setState({open: true});

            chai.assert.equal(item.find('#addDesignSectionToDesignSection').length, 1, 'Add design section not found');
        });
    });

    describe('A Feature has an option to add a new Feature Aspect to it', () => {

        it('has the option in edit mode', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.FEATURE};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};
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

            // Make sure item is open
            item.setState({open: true});

            chai.assert.equal(item.find('#addFeatureAspect').length, 1, 'Add feature aspect not found');
        });
    });

    describe('A Design Section has an option to add a new Feature to it', () => {

        it('has the option in edit mode', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.DESIGN_SECTION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};
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

            // Make sure item is open
            item.setState({open: true});

            chai.assert.equal(item.find('#addFeature').length, 1, 'Add feature not found');
        });
    });

    describe('A Feature Aspect has an option to add a new Scenario to it', () => {

        it('has the option in edit mode', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.FEATURE_ASPECT};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};
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

            // Make sure item is open
            item.setState({open: true});

            chai.assert.equal(item.find('#addScenario').length, 1, 'Add scenario not found');
        });
    });

    describe('Organisational components may not be added in View Only mode', () => {

        it('no option to add design section to application', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.APPLICATION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};
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

            // Make sure item is open
            item.setState({open: true});

            chai.assert.equal(item.find('#addDesignSectionToApp').length, 0, 'Add design section was found');
        });

        it('no option to add design section to design section', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.DESIGN_SECTION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};
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

            // Make sure item is open
            item.setState({open: true});

            chai.assert.equal(item.find('#addDesignSectionToDesignSection').length, 0, 'Add design section was found');
        });

        it('no option to add feature aspect to feature', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.FEATURE};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};
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

            // Make sure item is open
            item.setState({open: true});

            chai.assert.equal(item.find('#addFeatureAspect').length, 0, 'Add feature aspect was found');
        });
    });

    describe('Functional Design Components may not be added in View Only mode', () => {

        it('no option to add feature to design section', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.DESIGN_SECTION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};
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

            // Make sure item is open
            item.setState({open: true});

            chai.assert.equal(item.find('#addFeature').length, 0, 'Add feature was found');
        });

        it('no option to add scenario to feature aspect', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.FEATURE_ASPECT};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};
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

            // Make sure item is open
            item.setState({open: true});

            chai.assert.equal(item.find('#addScenario').length, 0, 'Add scenario was found');
        });
    });

    describe('When about to add a new organisational component the parent component is highlighted', () => {

        it('is highlighted when mouse over add control', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.APPLICATION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};
            const testSummary = false;
            const testSummaryData = {};
            const testDataFlag = false;
            const openDesignItems = ['componentId'];
            const openDesignUpdateItems = [];
            const openWorkPackageItems = [];

            let item = shallow(
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

            // Simulate mouse over
            item.setState({highlighted: true});

            // Component has highlighted style
            chai.assert.equal(item.find('#componentHeader').props().className, 'highlight', 'Header not highlighted');
        });

        it('is not highlighted when mouse not over add control', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.APPLICATION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};
            const testSummary = false;
            const testSummaryData = {};
            const testDataFlag = false;
            const openDesignItems = ['componentId'];
            const openDesignUpdateItems = [];
            const openWorkPackageItems = [];

            let item = shallow(
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

            // Simulate mouse not over
            item.setState({highlighted: false});

            // Component has highlighted style
            chai.assert.notEqual(item.find('#componentHeader').props().className, 'highlight', 'Header highlighted');
        });
    });

    describe('When about to add a new functional component the parent component is highlighted', () => {

        it('is highlighted when mouse over add control', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.DESIGN_SECTION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};
            const testSummary = false;
            const testSummaryData = {};
            const testDataFlag = false;
            const openDesignItems = ['componentId'];
            const openDesignUpdateItems = [];
            const openWorkPackageItems = [];

            let item = shallow(
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

            // Simulate mouse over
            item.setState({highlighted: true});

            // Component has highlighted style
            chai.assert.equal(item.find('#componentHeader').props().className, 'highlight', 'Header not highlighted');
        });

        it('is not highlighted when mouse not over add control', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.DESIGN_SECTION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};
            const testSummary = false;
            const testSummaryData = {};
            const testDataFlag = false;
            const openDesignItems = ['componentId'];
            const openDesignUpdateItems = [];
            const openWorkPackageItems = [];

            let item = shallow(
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

            // Simulate mouse not over
            item.setState({highlighted: false});

            // Component has highlighted style
            chai.assert.notEqual(item.find('#componentHeader').props().className, 'highlight', 'Header highlighted');
        });
    });

    describe('Valid target components for a Design Component move are highlighted', () => {

        it('is highlighted when target is application', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.APPLICATION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};
            const testSummary = false;
            const testSummaryData = {};
            const testDataFlag = false;
            const openDesignItems = ['componentId'];
            const openDesignUpdateItems = [];
            const openWorkPackageItems = [];

            let item = shallow(
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

            // Simulate mouse over
            item.setState({highlighted: true});

            // Component has highlighted style
            chai.assert.equal(item.find('#componentHeader').props().className, 'highlight', 'Header not highlighted');
        });

        it('is highlighted when target is design section', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.DESIGN_SECTION};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};
            const testSummary = false;
            const testSummaryData = {};
            const testDataFlag = false;
            const openDesignItems = ['componentId'];
            const openDesignUpdateItems = [];
            const openWorkPackageItems = [];

            let item = shallow(
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

            // Simulate mouse not over
            item.setState({highlighted: true});

            // Component has highlighted style
            chai.assert.equal(item.find('#componentHeader').props().className, 'highlight', 'Header not highlighted');
        });

        it('is highlighted when target is feature', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.FEATURE};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};
            const testSummary = false;
            const testSummaryData = {};
            const testDataFlag = false;
            const openDesignItems = ['componentId'];
            const openDesignUpdateItems = [];
            const openWorkPackageItems = [];

            let item = shallow(
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

            // Simulate mouse not over
            item.setState({highlighted: true});

            // Component has highlighted style
            chai.assert.equal(item.find('#componentHeader').props().className, 'highlight', 'Header not highlighted');
        });

        it('is highlighted when target is feature aspect', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.FEATURE_ASPECT};
            const designItem = {};
            const updateItem = {};
            const isDragDropHovering = false;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};
            const testSummary = false;
            const testSummaryData = {};
            const testDataFlag = false;
            const openDesignItems = ['componentId'];
            const openDesignUpdateItems = [];
            const openWorkPackageItems = [];

            let item = shallow(
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

            // Simulate mouse not over
            item.setState({highlighted: true});

            // Component has highlighted style
            chai.assert.equal(item.find('#componentHeader').props().className, 'highlight', 'Header not highlighted');
        });
    });


});

