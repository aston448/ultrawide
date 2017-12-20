import React from 'react';


import { shallow, mount} from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import ItemContainer            from '../../components/common/ItemContainer.jsx'
import { DesignEditorHeader }   from '../../components/common/DesignEditorHeader';          // Non Redux
import { DesignVersion }        from '../../components/select/DesignVersion.jsx';   // Non Redux

import { ViewMode, ViewType, DisplayContext, RoleType, ItemType} from '../../../constants/constants.js'

import { Designs } from '../../../collections/design/designs.js'



describe('JSX: DesignEditorHeader', () => {

    function testDesignEditorHeader(view, mode, displayContext, userRole){

        const userContext = {designId: 'NONE', designVersionId: 'NONE', designUpdateId: 'NONE', workPackageId: 'NONE'};  // Prevent name data func from tanking
        const userViewOptions = {};

        return shallow(
            <DesignEditorHeader
                displayContext={displayContext}
                view={view}
                mode={mode}
                userContext={userContext}
                userRole={userRole}
                userViewOptions={userViewOptions}
            />
        );
    }

    // Design Version Editing ------------------------------------------------------------------------------------------

    describe('The Design Version editor has an option to switch to View Only mode', () => {

        it('has a view button not highlighted when editing', () => {

            const view = ViewType.DESIGN_NEW;
            const mode = ViewMode.MODE_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userRole = RoleType.DESIGNER;

            let item = testDesignEditorHeader(view, mode, displayContext, userRole);

            chai.assert.equal(item.find('#optionView').length, 1, 'View Option not found');
            chai.assert.equal(item.find('#optionEdit').length, 1, 'Edit Option not found');
            chai.assert.equal(item.find('#optionView').props().className, 'view-toggle-inactive', 'Expecting View NOT to be highlighted');
            chai.assert.equal(item.find('#optionEdit').props().className, 'view-toggle-active', 'Expecting Edit to be highlighted');
        });

        it('has a view button highlighted when view only', () => {

            const view = ViewType.DESIGN_NEW;
            const mode = ViewMode.MODE_VIEW;
            const displayContext = DisplayContext.BASE_EDIT;
            const userRole = RoleType.DESIGNER;

            let item = testDesignEditorHeader(view, mode, displayContext, userRole);

            chai.assert.equal(item.find('#optionView').length, 1, 'View Option not found');
            chai.assert.equal(item.find('#optionEdit').length, 1, 'Edit Option not found');
            chai.assert.equal(item.find('#optionView').props().className, 'view-toggle-active', 'Expecting View to be highlighted');
            chai.assert.equal(item.find('#optionEdit').props().className, 'view-toggle-inactive', 'Expecting Edit NOT to be highlighted');
        });
    });

    describe('The Design Version editor has an option to switch to normal editing mode', () => {

        it('has an edit button not highlighted when view only', () => {

            const view = ViewType.DESIGN_NEW;
            const mode = ViewMode.MODE_VIEW;
            const displayContext = DisplayContext.BASE_EDIT;
            const userRole = RoleType.DESIGNER;

            let item = testDesignEditorHeader(view, mode, displayContext, userRole);

            chai.assert.equal(item.find('#optionView').length, 1, 'View Option not found');
            chai.assert.equal(item.find('#optionEdit').length, 1, 'Edit Option not found');
            chai.assert.equal(item.find('#optionView').props().className, 'view-toggle-active', 'Expecting View to be highlighted');
            chai.assert.equal(item.find('#optionEdit').props().className, 'view-toggle-inactive', 'Expecting Edit NOT to be highlighted');
        });

        it('has an edit button highlighted when editing', () => {

            const view = ViewType.DESIGN_NEW;
            const mode = ViewMode.MODE_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userRole = RoleType.DESIGNER;

            let item = testDesignEditorHeader(view, mode, displayContext, userRole);

            chai.assert.equal(item.find('#optionView').length, 1, 'View Option not found');
            chai.assert.equal(item.find('#optionEdit').length, 1, 'Edit Option not found');
            chai.assert.equal(item.find('#optionView').props().className, 'view-toggle-inactive', 'Expecting View NOT to be highlighted');
            chai.assert.equal(item.find('#optionEdit').props().className, 'view-toggle-active', 'Expecting Edit to be highlighted');
        });

    });

    describe('There is no option to switch to editing mode when a Design Version is being viewed', () => {

        it('a view only design has no edit button', () => {

            const view = ViewType.DESIGN_PUBLISHED;
            const mode = ViewMode.MODE_VIEW;
            const displayContext = DisplayContext.BASE_VIEW;
            const userRole = RoleType.DESIGNER;

            let item = testDesignEditorHeader(view, mode, displayContext, userRole);

            chai.assert.equal(item.find('#optionView').length, 0, 'View Option was found');
            chai.assert.equal(item.find('#optionEdit').length, 0, 'Edit Option was found');
        });
    });


    describe('When a Design Version is edited it is opened in edit mode with an option to view only', () => {

        it('has a view button', () => {

            const view = ViewType.DESIGN_NEW;
            const mode = ViewMode.MODE_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userRole = RoleType.DESIGNER;

            let item = testDesignEditorHeader(view, mode, displayContext, userRole);

            chai.assert.equal(item.find('#optionView').length, 1, 'View Option not found');
            chai.assert.equal(item.find('#optionView').props().className, 'view-toggle-inactive', 'Expecting View NOT to be highlighted');
        });

        it('has a highlighted edit button', () => {

            const view = ViewType.DESIGN_NEW;
            const mode = ViewMode.MODE_EDIT;
            const displayContext = DisplayContext.BASE_EDIT;
            const userRole = RoleType.DESIGNER;

            let item = testDesignEditorHeader(view, mode, displayContext, userRole);

            chai.assert.equal(item.find('#optionEdit').length, 1, 'Edit Option not found');
            chai.assert.equal(item.find('#optionEdit').props().className, 'view-toggle-active', 'Expecting Edit to be highlighted');
        })

    });

    describe('When a non-editable Design Version is viewed it is opened View Only with no option to edit', () => {

        it('has no view button', () => {

            const view = ViewType.DESIGN_PUBLISHED;
            const mode = ViewMode.MODE_VIEW;
            const displayContext = DisplayContext.BASE_VIEW;
            const userRole = RoleType.MANAGER;

            let item = testDesignEditorHeader(view, mode, displayContext, userRole);

            chai.assert.equal(item.find('#optionView').length, 0, 'View Option was found');
        });

        it('has no edit button', () => {

            const view = ViewType.DESIGN_PUBLISHED;
            const mode = ViewMode.MODE_VIEW;
            const displayContext = DisplayContext.BASE_VIEW;
            const userRole = RoleType.MANAGER;

            let item = testDesignEditorHeader(view, mode, displayContext, userRole);

            chai.assert.equal(item.find('#optionEdit').length, 0, 'Edit Option was found');
        });

    });

    describe('When an editable Design Version is viewed by a Designer it is opened View Only with an option to edit', () => {

        it('has a highlighted view button', () => {

            const view = ViewType.DESIGN_NEW;
            const mode = ViewMode.MODE_VIEW;
            const displayContext = DisplayContext.BASE_EDIT;
            const userRole = RoleType.DESIGNER;

            let item = testDesignEditorHeader(view, mode, displayContext, userRole);

            chai.assert.equal(item.find('#optionView').length, 1, 'View Option not found');
            chai.assert.equal(item.find('#optionView').props().className, 'view-toggle-active', 'Expecting View to be highlighted');
        });

        it('has an edit button not highlighted', () => {

            const view = ViewType.DESIGN_NEW;
            const mode = ViewMode.MODE_VIEW;
            const displayContext = DisplayContext.BASE_EDIT;
            const userRole = RoleType.DESIGNER;

            let item = testDesignEditorHeader(view, mode, displayContext, userRole);

            chai.assert.equal(item.find('#optionEdit').length, 1, 'Edit Option not found');
            chai.assert.equal(item.find('#optionEdit').props().className, 'view-toggle-inactive', 'Expecting Edit NOT to be highlighted');
        });

    });

    describe('There is no option to switch to View Only when a Design Version is being viewed', () => {

        it('View Only design has no view button', () => {

            const view = ViewType.DESIGN_PUBLISHED;
            const mode = ViewMode.MODE_VIEW;
            const displayContext = DisplayContext.BASE_VIEW;
            const userRole = RoleType.DESIGNER;

            let item = testDesignEditorHeader(view, mode, displayContext, userRole);

            chai.assert.equal(item.find('#optionView').length, 0, 'View Option was found');
        });
    });

    // Design Update Editing -------------------------------------------------------------------------------------------

    describe('The Design Update editor has an option to switch to View Only mode', () => {

        it('has a view button not highlighted', () => {

            const view = ViewType.DESIGN_UPDATE_EDIT;
            const mode = ViewMode.MODE_EDIT;
            const displayContext = DisplayContext.UPDATE_EDIT;
            const userRole = RoleType.DESIGNER;

            let item = testDesignEditorHeader(view, mode, displayContext, userRole);

            chai.assert.equal(item.find('#optionView').length, 1, 'View Option not found');
            chai.assert.equal(item.find('#optionView').props().className, 'view-toggle-inactive', 'Expecting View NOT to be highlighted');
        });
    });

    describe('Only a Design Update being edited can be switched to View Only', () => {

        it('a view only design update has no view button', () => {

            const view = ViewType.DESIGN_UPDATE_VIEW;
            const mode = ViewMode.MODE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;
            const userRole = RoleType.DESIGNER;

            let item = testDesignEditorHeader(view, mode, displayContext, userRole);

            chai.assert.equal(item.find('#optionView').length, 0, 'View Option was found');
        });
    });

    describe('The Design Update editor has an option to switch to Edit mode', () => {

        it('has an edit button not highlighted when in view mode', () => {

            const view = ViewType.DESIGN_UPDATE_EDIT;
            const mode = ViewMode.MODE_VIEW;
            const displayContext = DisplayContext.UPDATE_EDIT;
            const userRole = RoleType.DESIGNER;

            let item = testDesignEditorHeader(view, mode, displayContext, userRole);

            chai.assert.equal(item.find('#optionEdit').length, 1, 'Edit Option not found');
            chai.assert.equal(item.find('#optionEdit').props().className, 'view-toggle-inactive', 'Expecting Edit NOT to be highlighted');
        });
    });

    describe('A Developer viewing a Design Update cannot switch it to be editable', () => {

        it('no edit button for developer when in view mode', () => {

            const view = ViewType.DESIGN_UPDATE_VIEW;
            const mode = ViewMode.MODE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;
            const userRole = RoleType.DEVELOPER;

            let item = testDesignEditorHeader(view, mode, displayContext, userRole);

            chai.assert.equal(item.find('#optionEdit').length, 0, 'Edit Option was found');
        });
    });

    describe('A Manager viewing a Design Update cannot switch it to be editable', () => {

        it('no edit button for manager when in view mode', () => {

            const view = ViewType.DESIGN_UPDATE_VIEW;
            const mode = ViewMode.MODE_VIEW;
            const displayContext = DisplayContext.UPDATE_VIEW;
            const userRole = RoleType.MANAGER;

            let item = testDesignEditorHeader(view, mode, displayContext, userRole);

            chai.assert.equal(item.find('#optionEdit').length, 0, 'Edit Option was found');
        });
    });

});
