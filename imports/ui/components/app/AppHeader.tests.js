import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { AppHeader } from './AppHeader';  // Non Redux wrapped

import { DesignVersionStatus, RoleType, ViewType, ViewMode } from '../../../constants/constants.js'

import { DesignVersions } from '../../../collections/design/design_versions.js'

describe('JSX: AppHeader', () => {

    function testAppHeader(mode, view, userRole, userName){

        const userContext = {};
        const userViewOptions = {};
        const message = 'No message';
        const testDataFlag = false;
        const currentViewDataValue = false;

        return shallow(
            <AppHeader
                mode={mode}
                view={view}
                userRole={userRole}
                userName={userName}
                userContext={userContext}
                userViewOptions={userViewOptions}
                message={message}
                testDataFlag={testDataFlag}
                currentViewDataValue={currentViewDataValue}
            />
        );
    }

    // Design Version Editor -------------------------------------------------------------------------------------------

    describe('The Design Version editor has an option to switch to View Only mode', () => {

        it('has a view button not highlighted', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butView')).to.have.length(1);
            chai.assert.equal(item.find('#butView').props().bsStyle, 'default', 'Expecting NOT to be highlighted');
            chai.assert.equal(item.find('#butEdit').props().bsStyle, 'success', 'Expecting to be highlighted');

        });
    });

    describe('The Design Version editor has an option to switch to normal editing mode', () => {

        it('has an edit button not highlighted', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butEdit')).to.have.length(1);
            chai.assert.equal(item.find('#butView').props().bsStyle, 'success', 'Expecting to be highlighted');
            chai.assert.equal(item.find('#butEdit').props().bsStyle, 'default', 'Expecting NOT to be highlighted');
        });

    });

    describe('Only a Design Version being edited and in View Only mode may be switched back to edit mode', () => {

        it('a view only design has no edit button', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;
            const userRole = RoleType.DEVELOPER;
            const userName = 'gloria';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butEdit')).to.have.length(0);

        });
    });


    describe('When a Design Version is edited it is opened in edit mode with an option to view only', () => {

        it('has a view button', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butView')).to.have.length(1);

        });

        it('has a highlghted edit button', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';
            const userContext = {designId: 'AAA', designVersionId: 'BBB'};

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butEdit')).to.have.length(1);
            chai.assert.equal(item.find('#butEdit').props().bsStyle, 'success', 'Expecting to be highlighted');
        })

    });

    describe('When a non-editable Design Version is viewed it is opened View Only with no option to edit', () => {

        it('has no view button', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butView')).to.have.length(0);

        });

        it('has no edit button', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butEdit')).to.have.length(0);

        });

    });

    describe('When an editable Design Version is viewed by a Designer it is opened View Only with an option to edit', () => {

        it('has a highlighted view button', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butView')).to.have.length(1);
            chai.assert.equal(item.find('#butView').props().bsStyle, 'success', 'Expecting to be highlighted');

        });

        it('has an edit button not highlighted', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butEdit')).to.have.length(1);
            chai.assert.equal(item.find('#butEdit').props().bsStyle, 'default', 'Expecting not to be highlighted');

        });

    });

    describe('Only a Design Version being edited can be switched to View Only', () => {

        it('View Only design has no edit button', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;
            const userRole = RoleType.DEVELOPER;
            const userName = 'hugh';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butView')).to.have.length(0);

        });
    });

    describe('The Design Version editor has an option to show or hide the Details pane', () => {

        it('is available when editing a design', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butDetails')).to.have.length(1);
        });

        it('is available when viewing a design', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butDetails')).to.have.length(1);
        });
    });

    describe('The Design Version editor has an option to show or hide the Domain Dictionary', () => {

        it('is available when editing a design', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butDomainDict')).to.have.length(1);
        });

        it('is available when viewing a design', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;
            const userRole = RoleType.DEVELOPER;
            const userName = 'hugh';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butDomainDict')).to.have.length(1);
        });
    });

    describe('The Design Version editor has an option to show or hide the Test Summary', () => {

        it('is available when editing a design', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butTestSummary')).to.have.length(1);
        });

        it('is available when viewing a design', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;
            const userRole = RoleType.DEVELOPER;
            const userName = 'hugh';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butTestSummary')).to.have.length(1);
        });
    });

    describe('The Design Version editor does not have options to show or hide Developer test results', () => {

        it('test results not available when editing a design', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.assert.equal(item.find('#butAccTests').length, 0, 'Acceptance Tests visible');
            chai.assert.equal(item.find('#butIntTests').length, 0, 'Integration Tests visible');
            chai.assert.equal(item.find('#butUnitTests').length, 0, 'Unit Tests visible');
            chai.assert.equal(item.find('#butAccFiles').length, 0, 'Acceptance Files visible');
        });

        it('test results not available when viewing a design', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;
            const userRole = RoleType.DEVELOPER;
            const userName = 'hugh';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.assert.equal(item.find('#butAccTests').length, 0, 'Acceptance Tests visible');
            chai.assert.equal(item.find('#butIntTests').length, 0, 'Integration Tests visible');
            chai.assert.equal(item.find('#butUnitTests').length, 0, 'Unit Tests visible');
            chai.assert.equal(item.find('#butAccFiles').length, 0, 'Acceptance Files visible');
        });
    });

    // Design Update Editor --------------------------------------------------------------------------------------------

    describe('The Design Update editor has an option to switch to View Only mode', () => {

        it('has a view button not highlighted', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butView')).to.have.length(1);
            chai.assert.equal(item.find('#butView').props().bsStyle, 'default', 'Expecting NOT to be highlighted');
            chai.assert.equal(item.find('#butEdit').props().bsStyle, 'success', 'Expecting to be highlighted');
        });
    });

    describe('Only a Design Update being edited can be switched to View Only', () => {

        it('a view only design update has no view button', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butEdit')).to.have.length(0);
        });
    });

    describe('The Design Update editor has an option to switch to Edit mode', () => {

        it('has an edit button not highlighted when in view mode', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butEdit')).to.have.length(1);
            chai.assert.equal(item.find('#butView').props().bsStyle, 'success', 'Expecting to be highlighted');
            chai.assert.equal(item.find('#butEdit').props().bsStyle, 'default', 'Expecting NOT to be highlighted');
        });
    });

    describe('A Developer viewing a Design Update cannot switch it to be editable', () => {

        it('no edit button for developer when in view mode', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const userRole = RoleType.DEVELOPER;
            const userName = 'hugh';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butEdit')).to.have.length(0);
        });
    });

    describe('A Manager viewing a Design Update cannot switch it to be editable', () => {

        it('no edit button for manager when in view mode', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const userRole = RoleType.MANAGER;
            const userName = 'miles';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butEdit')).to.have.length(0);
        });
    });

    describe('The Design Update editor has an option to show or hide the Details pane', () => {

        it('is available when editing a design update', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butDetails')).to.have.length(1);
        });

        it('is available when viewing a design update', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butDetails')).to.have.length(1);
        });
    });

    describe('The Design Update editor has an option to show or hide the Domain Dictionary', () => {

        it('is available when editing a design update', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butDomainDict')).to.have.length(1);
        });

        it('is available when viewing a design update', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butDomainDict')).to.have.length(1);
        });
    });


    describe('The Design Update editor has an option to show or hide the Test Summary when in View Only mode', () => {

        it('is available when viewing a design update', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;
            const userRole = RoleType.DEVELOPER;
            const userName = 'hugh';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butTestSummary')).to.have.length(1);
        });

        it('is available for design update in edit mode with view only option', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butTestSummary')).to.have.length(1);
        });
    });

    describe('The Test Summary cannot be displayed in edit mode', () => {

        it('is not available when editing a design update', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';

            let item = testAppHeader(mode, view, userRole, userName);

            chai.expect(item.find('#butTestSummary')).to.have.length(0);
        });
    });
});
