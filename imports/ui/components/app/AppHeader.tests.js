import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { AppHeader } from './AppHeader';  // Non Redux wrapped

import { DesignVersionStatus, RoleType, ViewType, ViewMode } from '../../../constants/constants.js'
import { getBootstrapText, hasBootstrapClass } from '../../../common/utils.js';

import { DesignVersions } from '../../../collections/design/design_versions.js'

describe('JSX: AppHeader', () => {

    describe('The Design Version editor has an option to switch to View Only mode', () => {

        it('has a view button not highlighted', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';
            const userContext = {designId: 'AAA', designVersionId: 'BBB'};
            const userViewOptions = {};
            const message = 'No message';
            const testDataFlag = false;
            const currentViewDataValue = false;

            const item = shallow(
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

            chai.expect(item.find('#butView')).to.have.length(1);
            chai.expect(hasBootstrapClass(item.find('#butView').html(), 'btn-default')).to.be.true;
            chai.expect(hasBootstrapClass(item.find('#butEdit').html(), 'btn-success')).to.be.true;

        });
    });

    describe('The Design Version editor has an option to switch to normal editing mode', () => {

        it('has an edit button not highlighted', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';
            const userContext = {designId: 'AAA', designVersionId: 'BBB'};
            const userViewOptions = {};
            const message = 'No message';
            const testDataFlag = false;
            const currentViewDataValue = false;

            const item = shallow(
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

            chai.expect(item.find('#butEdit')).to.have.length(1);
            chai.expect(hasBootstrapClass(item.find('#butView').html(), 'btn-success')).to.be.true;
            chai.expect(hasBootstrapClass(item.find('#butEdit').html(), 'btn-default')).to.be.true;
        });

    });

    describe('Only a Design Version being edited and in View Only mode may be switched back to edit mode', () => {

        it('a view only design has no edit button', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;
            const userRole = RoleType.DEVELOPER;
            const userName = 'gloria';
            const userContext = {designId: 'AAA', designVersionId: 'BBB'};
            const userViewOptions = {};
            const message = 'No message';
            const testDataFlag = false;
            const currentViewDataValue = false;

            const item = shallow(
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

            chai.expect(item.find('#butEdit')).to.have.length(0);

        });
    });


    describe('When a Design Version is edited it is opened in edit mode with an option to view only', () => {

        it('has a view button', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';
            const userContext = {designId: 'AAA', designVersionId: 'BBB'};
            const userViewOptions = {};
            const message = 'No message';
            const testDataFlag = false;
            const currentViewDataValue = false;

            const item = shallow(
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

            chai.expect(item.find('#butView')).to.have.length(1);

        });

        it('has a highlghted edit button', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';
            const userContext = {designId: 'AAA', designVersionId: 'BBB'};
            const userViewOptions = {};
            const message = 'No message';
            const testDataFlag = false;
            const currentViewDataValue = false;

            const item = shallow(
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

            chai.expect(item.find('#butEdit')).to.have.length(1);
            chai.expect(hasBootstrapClass(item.find('#butEdit').html(), 'btn-success')).to.be.true;
        })

    });

    describe('When a non-editable Design Version is viewed it is opened View Only with no option to edit', () => {

        it('has no view button', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';
            const userContext = {designId: 'AAA', designVersionId: 'BBB'};
            const userViewOptions = {};
            const message = 'No message';
            const testDataFlag = false;
            const currentViewDataValue = false;

            const item = shallow(
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

            chai.expect(item.find('#butView')).to.have.length(0);

        });

        it('has no edit button', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';
            const userContext = {designId: 'AAA', designVersionId: 'BBB'};
            const userViewOptions = {};
            const message = 'No message';
            const testDataFlag = false;
            const currentViewDataValue = false;

            const item = shallow(
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

            chai.expect(item.find('#butEdit')).to.have.length(0);

        });

    });

    describe('When an editable Design Version is viewed by a Designer it is opened View Only with an option to edit', () => {

        it('has a highlighted view button', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';
            const userContext = {designId: 'AAA', designVersionId: 'BBB'};
            const userViewOptions = {};
            const message = 'No message';
            const testDataFlag = false;
            const currentViewDataValue = false;

            const item = shallow(
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

            chai.expect(item.find('#butView')).to.have.length(1);
            chai.expect(hasBootstrapClass(item.find('#butView').html(), 'btn-success')).to.be.true;

        });

        it('has an edit button not highlighted', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;
            const userRole = RoleType.DESIGNER;
            const userName = 'gloria';
            const userContext = {designId: 'AAA', designVersionId: 'BBB'};
            const userViewOptions = {};
            const message = 'No message';
            const testDataFlag = false;
            const currentViewDataValue = false;

            const item = shallow(
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

            chai.expect(item.find('#butEdit')).to.have.length(1);
            chai.expect(hasBootstrapClass(item.find('#butEdit').html(), 'btn-default')).to.be.true;

        });

    });

    describe('Only a Design Version being edited can be switched to View Only', () => {

        it('View Only design has no edit button', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;
            const userRole = RoleType.DEVELOPER;
            const userName = 'hugh';
            const userContext = {designId: 'AAA', designVersionId: 'BBB'};
            const userViewOptions = {};
            const message = 'No message';
            const testDataFlag = false;
            const currentViewDataValue = false;

            const item = shallow(
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

            chai.expect(item.find('#butView')).to.have.length(0);

        });
    })



});
