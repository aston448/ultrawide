import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignComponent } from './DesignComponent.jsx';  // Non Redux wrapped

import { DesignVersionStatus, RoleType, ViewType, ViewMode, DisplayContext, ComponentType, UpdateScopeType} from '../../../constants/constants.js'

import { UI, AddActionIds }           from "../../../constants/ui_context_ids";
import { hashID }                    from "../../../common/utils";


describe('JSX: DesignComponent', () => {

    function testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext){
        
        const isDragDropHovering = false;
        const testSummary = false;
        const testSummaryData = {};
        const testDataFlag = 0;
        const openDesignItems = [];
        const openDesignUpdateItems = [];
        const openWorkPackageItems = [];
        const uiItemId = 'ComponentName';
        const uiParentId = 'ParentName';

        return shallow(
            <DesignComponent
                currentItem={currentItem}
                updateItem={updateItem}
                wpItem={wpItem}
                uiItemId={uiItemId}
                uiParentId={uiParentId}
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
                openItemsFlag={{flag: true, item: null}}
            />
        );
    }

    // Design Components -----------------------------------------------------------------------------------------------

    describe('A selected Design Component is highlighted', () => {

        it('is highlighted if selected', () => {

            const currentItem = {_id: 'componentId'};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED;
            const displayContext = DisplayContext.BASE_VIEW;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};  // Context has current item id

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Component has active style
            chai.assert.equal(item.find(hashID(UI.DESIGN_COMPONENT, 'ComponentName')).props().className, 'design-component dc-active', 'Expected component to be active');

        });

        it('another component is not highlighted', () => {

            const currentItem = {_id: 'componentId'};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED;
            const displayContext = DisplayContext.BASE_VIEW;
            const userContext = {designVersionId: 'ABC', designComponentId: 'anotherComponentId'};  // Context has different item id

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Component has active style
            chai.assert.equal(item.find(hashID(UI.DESIGN_COMPONENT, 'ComponentName')).props().className, 'design-component', 'Expected component NOT to be active');
        });

    });

    describe('Only one Design Component may be selected at any one time', () => {

        it('can only have one item matching the user context item', () => {

            const currentItem1 = {_id: 'component1Id'};
            const currentItem2 = {_id: 'component2Id'};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED;
            const displayContext = DisplayContext.BASE_VIEW;
            const userContext = {designVersionId: 'ABC', designComponentId: 'component1Id'}; // Item 1 is in user context

            let item1 = testDesignComponent(currentItem1, updateItem, wpItem, mode, view, displayContext, userContext);
            let item2 = testDesignComponent(currentItem2, updateItem, wpItem, mode, view, displayContext, userContext);

            chai.assert.equal(item1.find(hashID(UI.DESIGN_COMPONENT, 'ComponentName')).props().className, 'design-component dc-active', 'Expected component to be active');
            chai.assert.equal(item2.find(hashID(UI.DESIGN_COMPONENT, 'ComponentName')).props().className, 'design-component', 'Expected component NOT to be active');
        });
    });

    describe('An Application has an option to add a new Design Section to it', () => {

        it('has the option in edit mode', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.APPLICATION};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Make sure item is open
            item.setState({open: true});

            const itemId = '#' + AddActionIds.UI_CONTEXT_ADD_DESIGN_SECTION_TO + 'ComponentName_SHALLOW';

            chai.assert.equal(item.find(itemId).length, 1, 'Add design section not found for ' + itemId);
        });

    });

    describe('A Design Section has an option to add a new Design Section to it as a sub section', () => {

        it('has the option in edit mode', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Make sure item is open
            item.setState({open: true});

            const itemId = '#' + AddActionIds.UI_CONTEXT_ADD_DESIGN_SECTION_TO + 'ParentName_ComponentName_SHALLOW';

            chai.assert.equal(item.find(itemId).length, 1, 'Add design section not found');
        });
    });

    describe('A Feature has an option to add a new Feature Aspect to it', () => {

        it('has the option in edit mode', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.FEATURE};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Make sure item is open
            item.setState({open: true});

            const itemId = '#' + AddActionIds.UI_CONTEXT_ADD_FEATURE_ASPECT_TO + 'ComponentName_SHALLOW';

            chai.assert.equal(item.find(itemId).length, 1, 'Add feature aspect not found');
        });
    });

    describe('A Design Section has an option to add a new Feature to it', () => {

        it('has the option in edit mode', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Make sure item is open
            item.setState({open: true});

            const itemId = '#' + AddActionIds.UI_CONTEXT_ADD_FEATURE_TO + 'ParentName_ComponentName_SHALLOW';

            chai.assert.equal(item.find(itemId).length, 1, 'Add feature not found');
        });
    });

    describe('A Feature Aspect has an option to add a new Scenario to it', () => {

        it('has the option in edit mode', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Make sure item is open
            item.setState({open: true});

            const itemId = '#' + AddActionIds.UI_CONTEXT_ADD_SCENARIO_TO + 'ParentName_ComponentName_SHALLOW';

            chai.assert.equal(item.find(itemId).length, 1, 'Add scenario not found');
        });
    });

    describe('There is no option to add organisational Design Components in View Only mode', () => {

        it('no option to add design section to application', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.APPLICATION};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Make sure item is open
            item.setState({open: true});

            const itemId = '#' + AddActionIds.UI_CONTEXT_ADD_DESIGN_SECTION_TO + 'ComponentName_SHALLOW';

            chai.assert.equal(item.find(itemId).length, 0, 'Add design section was found');
        });

        it('no option to add design section to design section', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Make sure item is open
            item.setState({open: true});

            const itemId = '#' + AddActionIds.UI_CONTEXT_ADD_DESIGN_SECTION_TO + 'ParentName_ComponentName_SHALLOW';

            chai.assert.equal(item.find(itemId).length, 0, 'Add design section was found');
        });

        it('no option to add feature aspect to feature', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.FEATURE};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Make sure item is open
            item.setState({open: true});

            const itemId = '#' + AddActionIds.UI_CONTEXT_ADD_FEATURE_ASPECT_TO + 'ComponentName_SHALLOW';

            chai.assert.equal(item.find(itemId).length, 0, 'Add feature aspect was found');
        });
    });

    describe('There is no option to add functional Design Components in View Only mode', () => {

        it('no option to add feature to design section', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Make sure item is open
            item.setState({open: true});

            const itemId = '#' + AddActionIds.UI_CONTEXT_ADD_FEATURE_TO + 'ParentName_ComponentName_SHALLOW';

            chai.assert.equal(item.find(itemId).length, 0, 'Add feature was found');
        });

        it('no option to add scenario to feature aspect', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Make sure item is open
            item.setState({open: true});

            const itemId = '#' + AddActionIds.UI_CONTEXT_ADD_SCENARIO_TO + 'ParentName_ComponentName_SHALLOW';

            chai.assert.equal(item.find(itemId).length, 0, 'Add scenario was found');
        });
    });

    describe('When about to add a new organisational component the parent component is highlighted', () => {

        it('is highlighted when mouse over add control', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.APPLICATION};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Simulate mouse over
            item.setState({highlighted: true});

            // Component has highlighted style
            chai.assert.equal(item.find('#componentHeader').props().className, 'highlight', 'Header not highlighted');
        });

        it('is not highlighted when mouse not over add control', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.APPLICATION};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Simulate mouse not over
            item.setState({highlighted: false});

            // Component has highlighted style
            chai.assert.notEqual(item.find('#componentHeader').props().className, 'highlight', 'Header highlighted');
        });
    });

    describe('When about to add a new functional component the parent component is highlighted', () => {

        it('is highlighted when mouse over add control', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Simulate mouse over
            item.setState({highlighted: true});

            // Component has highlighted style
            chai.assert.equal(item.find('#componentHeader').props().className, 'highlight', 'Header not highlighted');
        });

        it('is not highlighted when mouse not over add control', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);
            // Simulate mouse not over
            item.setState({highlighted: false});

            // Component has highlighted style
            chai.assert.notEqual(item.find('#componentHeader').props().className, 'highlight', 'Header highlighted');
        });
    });

    describe('Valid target components for a Design Component move are highlighted', () => {

        it('is highlighted when target is application', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.APPLICATION};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Simulate mouse over
            item.setState({highlighted: true});

            // Component has highlighted style
            chai.assert.equal(item.find('#componentHeader').props().className, 'highlight', 'Header not highlighted');
        });

        it('is highlighted when target is design section', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Simulate mouse not over
            item.setState({highlighted: true});

            // Component has highlighted style
            chai.assert.equal(item.find('#componentHeader').props().className, 'highlight', 'Header not highlighted');
        });

        it('is highlighted when target is feature', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.FEATURE};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Simulate mouse not over
            item.setState({highlighted: true});

            // Component has highlighted style
            chai.assert.equal(item.find('#componentHeader').props().className, 'highlight', 'Header not highlighted');
        });

        it('is highlighted when target is feature aspect', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.FEATURE_ASPECT};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;
            const displayContext = DisplayContext.BASE_EDIT;
            const userContext = {designVersionId: 'ABC', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Simulate mouse not over
            item.setState({highlighted: true});

            // Component has highlighted style
            chai.assert.equal(item.find('#componentHeader').props().className, 'highlight', 'Header not highlighted');
        });
    });

    // Work Package Components -----------------------------------------------------------------------------------------

    describe('A selected Work Package component is highlighted', () => {

        it('is highlighted if selected', () => {

            const currentItem = {_id: 'designComponentId'};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.WORK_PACKAGE_BASE_VIEW;
            const displayContext = DisplayContext.WP_VIEW;
            const userContext = {designVersionId: 'ABC', designComponentId: 'designComponentId'};  // Context has current item id

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Component has active style
            chai.assert.equal(item.find(hashID(UI.DESIGN_COMPONENT, 'ComponentName')).props().className, 'design-component dc-active', 'Expected component to be active');

        });

        it('another component is not highlighted', () => {

            const currentItem = {_id: 'designComponentId'};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.WORK_PACKAGE_BASE_VIEW;
            const displayContext = DisplayContext.WP_VIEW;
            const userContext = {designVersionId: 'ABC', designComponentId: 'anotherComponentId'};  // Context has different item id

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Component has active style
            chai.assert.equal(item.find(hashID(UI.DESIGN_COMPONENT, 'ComponentName')).props().className, 'design-component', 'Expected component NOT to be active');
        });

    });

    // Design Update Components ----------------------------------------------------------------------------------------

    describe('A Design Update component is highlighted when it is selected', () => {

        it('is highlighted if selected', () => {

            const currentItem = {_id: 'updateComponentId'};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF', designComponentId: 'updateComponentId'};  // Context has current item id

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Component has active style
            chai.assert.equal(item.find(hashID(UI.DESIGN_COMPONENT, 'ComponentName')).props().className, 'design-component dc-active', 'Expected component to be active');

        });

        it('another component is not highlighted', () => {

            const currentItem = {_id: 'updateComponentId'};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.WORK_PACKAGE_BASE_VIEW;
            const displayContext = DisplayContext.WP_VIEW;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF', designComponentId: 'anotherComponentId'};  // Context has different item id

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Component has active style
            chai.assert.equal(item.find(hashID(UI.DESIGN_COMPONENT, 'ComponentName')).props().className, 'design-component', 'Expected component NOT to be active');
        });
    });

    describe('An Application component in the Design Update editor has an Add Design Section option', () => {

        it('has the option in edit mode', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.APPLICATION};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Make sure item is open
            item.setState({open: true});

            const itemId = '#' + AddActionIds.UI_CONTEXT_ADD_DESIGN_SECTION_TO + 'ComponentName_SHALLOW';

            chai.assert.equal(item.find(itemId).length, 1, 'Add design section not found');
        });

    });

    describe('A Design Section component in the Design Update editor has an Add Design Section option', () => {

        it('has the option in edit mode', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Make sure item is open
            item.setState({open: true});

            const itemId = '#' + AddActionIds.UI_CONTEXT_ADD_DESIGN_SECTION_TO + 'ParentName_ComponentName_SHALLOW';

            chai.assert.equal(item.find(itemId).length, 1, 'Add design section not found');
        });
    });

    describe('An in scope Feature in the Design Update editor has an Add Feature Aspect option', () => {

        it('has the option in edit mode', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.FEATURE, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Make sure item is open
            item.setState({open: true});

            const itemId = '#' + AddActionIds.UI_CONTEXT_ADD_FEATURE_ASPECT_TO + 'ComponentName_SHALLOW';

            chai.assert.equal(item.find(itemId).length, 1, 'Add feature aspect not found');
        });

        it('no option if not in scope', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.FEATURE, isScopable: true, scopeType: UpdateScopeType.SCOPE_PARENT_SCOPE};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Make sure item is open
            item.setState({open: true});

            const itemId = '#' + AddActionIds.UI_CONTEXT_ADD_FEATURE_ASPECT_TO + 'ComponentName_SHALLOW';

            chai.assert.equal(item.find(itemId).length, 0, 'Add feature aspect found');
        });
    });

    describe('There are no options to add organisational Design Update Components in View Only mode', () => {

        // NOTE - Application covered in EditDesignUpdateContainer test

        it('no option for add section to application in view mode', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.APPLICATION};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Make sure item is open
            item.setState({open: true});

            const itemId = '#' + AddActionIds.UI_CONTEXT_ADD_DESIGN_SECTION_TO + 'ComponentName_SHALLOW';

            chai.assert.equal(item.find(itemId).length, 0, 'Add design section found');
        });

        it('no option for add section to application when viewing', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.APPLICATION};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Make sure item is open
            item.setState({open: true});

            const itemId = '#' + AddActionIds.UI_CONTEXT_ADD_DESIGN_SECTION_TO + 'ComponentName_SHALLOW';

            chai.assert.equal(item.find(itemId).length, 0, 'Add design section found');
        });

        it('no option to add section to section in view mode', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Make sure item is open
            item.setState({open: true});

            const itemId = '#' + AddActionIds.UI_CONTEXT_ADD_DESIGN_SECTION_TO + 'ParentName_ComponentName_SHALLOW';

            chai.assert.equal(item.find(itemId).length, 0, 'Add design section found');
        });

        it('no option to add section to section when viewing', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Make sure item is open
            item.setState({open: true});

            const itemId = '#' + AddActionIds.UI_CONTEXT_ADD_DESIGN_SECTION_TO + 'ParentName_ComponentName_SHALLOW';

            chai.assert.equal(item.find(itemId).length, 0, 'Add design section found');
        });

        it('no option to add aspect to in scope feature in view mode', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.FEATURE, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Make sure item is open
            item.setState({open: true});

            const itemId = '#' + AddActionIds.UI_CONTEXT_ADD_FEATURE_ASPECT_TO + 'ComponentName_SHALLOW';

            chai.assert.equal(item.find(itemId).length, 0, 'Add feature aspect found');
        });

        it('no option to add aspect to in scope feature when viewing', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.FEATURE, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Make sure item is open
            item.setState({open: true});

            const itemId = '#' + AddActionIds.UI_CONTEXT_ADD_FEATURE_ASPECT_TO + 'ComponentName_SHALLOW';

            chai.assert.equal(item.find(itemId).length, 0, 'Add feature aspect found');
        });
    });

    describe('A Design Section component in the Design Update editor has an Add Feature option', () => {

        it('has the option in edit mode', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Make sure item is open
            item.setState({open: true});

            const itemId = '#' + AddActionIds.UI_CONTEXT_ADD_FEATURE_TO + 'ParentName_ComponentName_SHALLOW';

            chai.assert.equal(item.find(itemId).length, 1, 'Add feature not found');
        });
    });

    describe('An in scope Feature Aspect in the Design Update editor has an Add Scenario option', () => {

        it('has the option in edit mode', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.FEATURE_ASPECT, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Make sure item is open
            item.setState({open: true});

            const itemId = '#' + AddActionIds.UI_CONTEXT_ADD_SCENARIO_TO + 'ParentName_ComponentName_SHALLOW';

            chai.assert.equal(item.find(itemId).length, 1, 'Add scenario not found');
        });

        it('no option if not in scope', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.FEATURE_ASPECT, isScopable: true, scopeType: UpdateScopeType.SCOPE_PARENT_SCOPE};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Make sure item is open
            item.setState({open: true});

            const itemId = '#' + AddActionIds.UI_CONTEXT_ADD_SCENARIO_TO + 'ParentName_ComponentName_SHALLOW';

            chai.assert.equal(item.find(itemId).length, 0, 'Add scenario found');
        });
    });

    describe('A functional Design Update Component can only be added in edit mode', () => {

        it('no option for add feature to section in view mode', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Make sure item is open
            item.setState({open: true});

            const itemId = '#' + AddActionIds.UI_CONTEXT_ADD_FEATURE_TO + 'ParentName_ComponentName_SHALLOW';

            chai.assert.equal(item.find(itemId).length, 0, 'Add feature found');
        });

        it('no option for add feature to section when viewing', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.DESIGN_SECTION};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Make sure item is open
            item.setState({open: true});

            const itemId = '#' + AddActionIds.UI_CONTEXT_ADD_FEATURE_TO + 'ParentName_ComponentName_SHALLOW';

            chai.assert.equal(item.find(itemId).length, 0, 'Add feature found');
        });

        it('no option to add scenario to feature aspect in view mode', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.FEATURE_ASPECT, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Make sure item is open
            item.setState({open: true});

            const itemId = '#' + AddActionIds.UI_CONTEXT_ADD_SCENARIO_TO + 'ParentName_ComponentName_SHALLOW';

            chai.assert.equal(item.find(itemId).length, 0, 'Add scenario found');
        });

        it('no option to add scenario to feature aspect when viewing', () => {

            const currentItem = {_id: 'componentId', componentType: ComponentType.FEATURE_ASPECT, isScopable: true, scopeType: UpdateScopeType.SCOPE_IN_SCOPE};
            const updateItem = {};
            const wpItem = {};
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF', designComponentId: 'componentId'};

            let item = testDesignComponent(currentItem, updateItem, wpItem, mode, view, displayContext, userContext);

            // Make sure item is open
            item.setState({open: true});

            const itemId = '#' + AddActionIds.UI_CONTEXT_ADD_SCENARIO_TO + 'ParentName_ComponentName_SHALLOW';

            chai.assert.equal(item.find(itemId).length, 0, 'Add scenario found');
        });
    });
});

