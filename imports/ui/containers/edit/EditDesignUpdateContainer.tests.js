import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { UpdateApplicationsList } from './EditDesignUpdateContainer';  // Non Redux wrapped

import { DesignVersionStatus, RoleType, ViewType, ViewMode } from '../../../constants/constants.js'

import { DesignVersions } from '../../../collections/design/design_versions.js'

describe('JSX: EditDesignUpdateContainer', () => {

    function testEditDesignUpdateContainer(mode, view, viewOptions){

        const updateApplications = [];
        const userContext = {};
        const currentViewDataValue = false;

        return shallow(
            <UpdateApplicationsList
                updateApplications={updateApplications}
                userContext={userContext}
                mode={mode}
                view={view}
                viewOptions={viewOptions}
            />
        );
    }

    describe('The Details pane may be shown for a Design Update', () => {

        it('is shown view only in view', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting UPDATE VIEW | DETAILS VIEW | UPDATE SUMMARY
            chai.assert.equal(item.find('#scopePane').length, 0, 'Scope is visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 0, 'Edit pane is visible');
            chai.assert.equal(item.find('#editorPaneView').length, 1, 'Update view is not visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 1, 'Details view is not visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 1, 'Update summary is not visible');
        });

        it('is shown editable in edit', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting SCOPE | UPDATE EDIT | DETAILS EDIT | UPDATE SUMMARY
            chai.assert.equal(item.find('#scopePane').length, 1, 'Scope is not visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 1, 'Edit pane is not visible');
            chai.assert.equal(item.find('#editorPaneView').length, 0, 'Update view is visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 1, 'Details Edit pane is not visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 1, 'Update summary is not visible');
        });

        it('is shown view only in edit with view mode', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting UPDATE VIEW | DETAILS VIEW | UPDATE SUMMARY
            chai.assert.equal(item.find('#scopePane').length, 0, 'Scope is visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 0, 'Edit pane is visible');
            chai.assert.equal(item.find('#editorPaneView').length, 1, 'Update view is not visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 1, 'Details view is not visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 1, 'Update summary is not visible');
        });
    });

    describe('The Details pane may be hidden for a Design Update', () => {

        it('is not shown in view', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting UPDATE VIEW | UPDATE SUMMARY
            chai.assert.equal(item.find('#scopePane').length, 0, 'Scope is visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 0, 'Edit pane is visible');
            chai.assert.equal(item.find('#editorPaneView').length, 1, 'Update view is not visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 1, 'Update summary is not visible');
        });

        it('is not shown in edit', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting SCOPE | UPDATE EDIT | DETAILS EDIT | UPDATE SUMMARY
            chai.assert.equal(item.find('#scopePane').length, 1, 'Scope is not visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 1, 'Edit pane is not visible');
            chai.assert.equal(item.find('#editorPaneView').length, 0, 'Update view is visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 1, 'Update summary is not visible');
        });

        it('is not shown in edit with view mode', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting UPDATE VIEW | DETAILS VIEW | UPDATE SUMMARY
            chai.assert.equal(item.find('#scopePane').length, 0, 'Scope is visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 0, 'Edit pane is visible');
            chai.assert.equal(item.find('#editorPaneView').length, 1, 'Update view is not visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 1, 'Update summary is not visible');
        });
    });

    describe('The Domain Dictionary pane may be shown for a Design Update', () => {

        it('is shown in view', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    true,
                updateTestSummaryVisible:   false,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting UPDATE VIEW | DOMAIN DICTIONARY
            chai.assert.equal(item.find('#scopePane').length, 0, 'Scope is visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 0, 'Edit pane is visible');
            chai.assert.equal(item.find('#editorPaneView').length, 1, 'Update view is not visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 1, 'Domain Dictionary is not visible');
            chai.assert.equal(item.find('#updateSummary').length, 0, 'Update summary is visible');
        });

        it('is shown in edit', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    true,
                updateTestSummaryVisible:   false,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting SCOPE | UPDATE EDIT | DOMAIN DICTIONARY
            chai.assert.equal(item.find('#scopePane').length, 1, 'Scope is not visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 1, 'Edit pane is not visible');
            chai.assert.equal(item.find('#editorPaneView').length, 0, 'Update view is visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 1, 'Domain Dictionary is not visible');
            chai.assert.equal(item.find('#updateSummary').length, 0, 'Update summary is visible');
        });

        it('is shown in edit with view mode', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    true,
                updateTestSummaryVisible:   false,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting UPDATE VIEW | DOMAIN DICTIONARY
            chai.assert.equal(item.find('#scopePane').length, 0, 'Scope is visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 0, 'Edit pane is visible');
            chai.assert.equal(item.find('#editorPaneView').length, 1, 'Update view is not visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 1, 'Domain Dictionary is not visible');
            chai.assert.equal(item.find('#updateSummary').length, 0, 'Update summary is visible');
        });
    });

    describe('The Domain Dictionary pane may be hidden for a Design Update', () => {

        it('is not shown in view', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting UPDATE VIEW | UPDATE SUMMARY
            chai.assert.equal(item.find('#scopePane').length, 0, 'Scope is visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 0, 'Edit pane is visible');
            chai.assert.equal(item.find('#editorPaneView').length, 1, 'Update view is not visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 1, 'Update summary is not visible');
        });

        it('is not shown in edit', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting SCOPE | UPDATE EDIT | UPDATE SUMMARY
            chai.assert.equal(item.find('#scopePane').length, 1, 'Scope is not visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 1, 'Edit pane is not visible');
            chai.assert.equal(item.find('#editorPaneView').length, 0, 'Update view is visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 1, 'Update summary is not visible');
        });

        it('is not shown in edit with view mode', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting UPDATE VIEW | UPDATE SUMMARY
            chai.assert.equal(item.find('#scopePane').length, 0, 'Scope is visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 0, 'Edit pane is visible');
            chai.assert.equal(item.find('#editorPaneView').length, 1, 'Update view is not visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 1, 'Update summary is not visible');
        });
    });

    describe('When the Domain Dictionary is hidden the Design Update Summary is visible', () => {

        it('summary shown if dictionary hidden in view', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting UPDATE VIEW | DETAILS VIEW | UPDATE SUMMARY
            chai.assert.equal(item.find('#scopePane').length, 0, 'Scope is visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 0, 'Edit pane is visible');
            chai.assert.equal(item.find('#editorPaneView').length, 1, 'Update view is not visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 1, 'Details view is not visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 1, 'Update summary is not visible');
        });

        it('summary shown if dictionary hidden in edit', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting SCOPE | UPDATE EDIT | DETAILS EDIT | UPDATE SUMMARY
            chai.assert.equal(item.find('#scopePane').length, 1, 'Scope is not visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 1, 'Edit pane is not visible');
            chai.assert.equal(item.find('#editorPaneView').length, 0, 'Update view is visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 1, 'Details Edit pane is not visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 1, 'Update summary is not visible');
        });
    });

    describe('When the Domain Dictionary is showing the Design Update Summary is hidden', () => {

        it('summary not shown if dictionary visible in view', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    true,
                updateTestSummaryVisible:   false,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting UPDATE VIEW | DETAILS VIEW | DICTIONARY
            chai.assert.equal(item.find('#scopePane').length, 0, 'Scope is visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 0, 'Edit pane is visible');
            chai.assert.equal(item.find('#editorPaneView').length, 1, 'Update view is not visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 1, 'Details view is not visible');
            chai.assert.equal(item.find('#domainDictionary').length, 1, 'Domain Dictionary is not visible');
            chai.assert.equal(item.find('#updateSummary').length, 0, 'Update summary is visible');
        });

        it('summary not shown if dictionary visible in edit', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    true,
                updateTestSummaryVisible:   false,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting SCOPE | UPDATE EDIT | DETAILS EDIT | DICTIONARY
            chai.assert.equal(item.find('#scopePane').length, 1, 'Scope is not visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 1, 'Edit pane is not visible');
            chai.assert.equal(item.find('#editorPaneView').length, 0, 'Update view is visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 1, 'Details Edit pane is not visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 1, 'Domain Dictionary is not visible');
            chai.assert.equal(item.find('#updateSummary').length, 0, 'Update summary is visible');
        });
    });

    describe('The width of each Design Update pane changes to accommodate the number of panes displayed', () => {

        it('in view with no details, design takes up half the screen', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#designCol').length, 1, 'Design not found');
            chai.assert.equal(item.find('#dictSummCol').length, 1, 'Summary not found');

            chai.assert.equal(item.find('#designCol').props().md, 6, 'Expecting width 6 for Design');
            chai.assert.equal(item.find('#dictSummCol').props().md, 6, 'Expecting width 6 for Summary');
        });

        it('in view with details, design takes up a third of the screen', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#designCol').length, 1, 'Design not found');
            chai.assert.equal(item.find('#detailsCol').length, 1, 'Details not found');
            chai.assert.equal(item.find('#dictSummCol').length, 1, 'Summary not found');

            chai.assert.equal(item.find('#designCol').props().md, 4, 'Expecting width 4 for Design');
            chai.assert.equal(item.find('#detailsCol').props().md, 4, 'Expecting width 4 for Details');
            chai.assert.equal(item.find('#dictSummCol').props().md, 4, 'Expecting width 4 for Summary');
        });

        it('in edit with no details, scope and design take up a third of the screen each', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#scopeCol').length, 1, 'Scope not found');
            chai.assert.equal(item.find('#designCol').length, 1, 'Design not found');
            chai.assert.equal(item.find('#dictSummCol').length, 1, 'Summary not found');

            chai.assert.equal(item.find('#scopeCol').props().md, 4, 'Expecting width 4 for Design');
            chai.assert.equal(item.find('#designCol').props().md, 4, 'Expecting width 4 for Design');
            chai.assert.equal(item.find('#dictSummCol').props().md, 4, 'Expecting width 4 for Summary');
        });

        it('in edit with details scope, design and details take up a quarter of the screen each', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#scopeCol').length, 1, 'Scope not found');
            chai.assert.equal(item.find('#designCol').length, 1, 'Design not found');
            chai.assert.equal(item.find('#detailsCol').length, 1, 'Details not found');
            chai.assert.equal(item.find('#dictSummCol').length, 1, 'Summary not found');

            chai.assert.equal(item.find('#scopeCol').props().md, 3, 'Expecting width 3 for Design');
            chai.assert.equal(item.find('#designCol').props().md, 3, 'Expecting width 3 for Design');
            chai.assert.equal(item.find('#detailsCol').props().md, 3, 'Expecting width 3 for Details');
            chai.assert.equal(item.find('#dictSummCol').props().md, 3, 'Expecting width 3 for Summary');
        });

        it('in view with test summary, design takes up two thirds of screen', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   true,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#designCol').length, 1, 'Design not found');
            chai.assert.equal(item.find('#dictSummCol').length, 1, 'Summary not found');

            chai.assert.equal(item.find('#designCol').props().md, 8, 'Expecting width 4 for Design');
            chai.assert.equal(item.find('#dictSummCol').props().md, 4, 'Expecting width 4 for Summary');
        });

        it('in view with test summary and details, design takes up half of screen', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   true,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#designCol').length, 1, 'Design not found');
            chai.assert.equal(item.find('#detailsCol').length, 1, 'Details not found');
            chai.assert.equal(item.find('#dictSummCol').length, 1, 'Summary not found');

            chai.assert.equal(item.find('#designCol').props().md, 6, 'Expecting width 4 for Design');
            chai.assert.equal(item.find('#detailsCol').props().md, 3, 'Expecting width 4 for Details');
            chai.assert.equal(item.find('#dictSummCol').props().md, 3, 'Expecting width 4 for Summary');
        });
    });

    describe('There is an option to add a new Application in the Design Update editor', () => {

        it('has an add application in edit mode', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#addApplication').length, 1, 'Add Application not found');
        });

        it('has no add application in view mode', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#addApplication').length, 0, 'Add Application found');
        });

        it('has no add application when viewing', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#addApplication').length, 0, 'Add Application found');
        });
    });
});

