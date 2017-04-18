import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { UpdateApplicationsList } from './EditDesignUpdateContainer';  // Non Redux wrapped

import { DesignVersionStatus, RoleType, ViewType, ViewMode } from '../../../constants/constants.js'

import { DesignVersions } from '../../../collections/design/design_versions.js'

describe('JSX: EditDesignUpdateContainer', () => {

    function testEditDesignUpdateContainer(mode, view, viewOptions){

        const baseApplications = [];
        const updateApplications = [];
        const workingApplications = [];
        const userContext = {};
        const currentViewDataValue = false;

        return shallow(
            <UpdateApplicationsList
                baseApplications={baseApplications}
                updateApplications={updateApplications}
                workingApplications={workingApplications}
                userContext={userContext}
                mode={mode}
                view={view}
                viewOptions={viewOptions}
                testDataFlag={0}
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
                updateSummaryVisible:       false,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting UPDATE VIEW | DETAILS VIEW | UPDATE SUMMARY
            chai.assert.equal(item.find('#scopePane').length, 0, 'Scope is visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 0, 'Edit pane is visible');
            chai.assert.equal(item.find('#editorPaneView').length, 1, 'Update view is not visible');
            chai.assert.equal(item.find('#editorPaneWorking').length, 0, 'Working view is visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 1, 'Details view is not visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 0, 'Update summary is visible');
        });

        it('is shown editable in edit', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       false,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting SCOPE | UPDATE EDIT | WORKING VERSION | DETAILS EDIT | UPDATE SUMMARY
            chai.assert.equal(item.find('#scopePane').length, 1, 'Scope is not visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 1, 'Edit pane is not visible');
            chai.assert.equal(item.find('#editorPaneView').length, 0, 'Update view is visible');
            chai.assert.equal(item.find('#editorPaneWorking').length, 0, 'Working view is visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 1, 'Details Edit pane is not visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 0, 'Update summary is visible');
        });

        it('is shown view only in edit with view mode', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       false,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting UPDATE VIEW | DETAILS VIEW | UPDATE SUMMARY
            chai.assert.equal(item.find('#scopePane').length, 0, 'Scope is visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 0, 'Edit pane is visible');
            chai.assert.equal(item.find('#editorPaneView').length, 1, 'Update view is not visible');
            chai.assert.equal(item.find('#editorPaneWorking').length, 0, 'Working view is visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 1, 'Details view is not visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 0, 'Update summary is visible');
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
                updateSummaryVisible:       false,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting UPDATE VIEW | UPDATE SUMMARY
            chai.assert.equal(item.find('#scopePane').length, 0, 'Scope is visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 0, 'Edit pane is visible');
            chai.assert.equal(item.find('#editorPaneView').length, 1, 'Update view is not visible');
            chai.assert.equal(item.find('#editorPaneWorking').length, 0, 'Working view is visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 0, 'Update summary is visible');
        });

        it('is not shown in edit', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       false,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting SCOPE | UPDATE EDIT | WORKING VERSION | DETAILS EDIT | UPDATE SUMMARY
            chai.assert.equal(item.find('#scopePane').length, 1, 'Scope is not visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 1, 'Edit pane is not visible');
            chai.assert.equal(item.find('#editorPaneView').length, 0, 'Update view is visible');
            chai.assert.equal(item.find('#editorPaneWorking').length, 0, 'Working view is visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 0, 'Update summary is visible');
        });

        it('is not shown in edit with view mode', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       false,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting UPDATE VIEW | DETAILS VIEW | UPDATE SUMMARY
            chai.assert.equal(item.find('#scopePane').length, 0, 'Scope is visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 0, 'Edit pane is visible');
            chai.assert.equal(item.find('#editorPaneView').length, 1, 'Update view is not visible');
            chai.assert.equal(item.find('#editorPaneWorking').length, 0, 'Working view is visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 0, 'Update summary is visible');
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
                updateSummaryVisible:       false,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting UPDATE VIEW | DOMAIN DICTIONARY
            chai.assert.equal(item.find('#scopePane').length, 0, 'Scope is visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 0, 'Edit pane is visible');
            chai.assert.equal(item.find('#editorPaneView').length, 1, 'Update view is not visible');
            chai.assert.equal(item.find('#editorPaneWorking').length, 0, 'Working view is visible');
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
                updateSummaryVisible:       false,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting SCOPE | UPDATE EDIT | WORKING VERSION | DOMAIN DICTIONARY
            chai.assert.equal(item.find('#scopePane').length, 1, 'Scope is not visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 1, 'Edit pane is not visible');
            chai.assert.equal(item.find('#editorPaneView').length, 0, 'Update view is visible');
            chai.assert.equal(item.find('#editorPaneWorking').length, 0, 'Working view is visible');
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
                updateSummaryVisible:       false,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting UPDATE VIEW | DOMAIN DICTIONARY
            chai.assert.equal(item.find('#scopePane').length, 0, 'Scope is visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 0, 'Edit pane is visible');
            chai.assert.equal(item.find('#editorPaneView').length, 1, 'Update view is visible');
            chai.assert.equal(item.find('#editorPaneWorking').length, 0, 'Working view is not visible');
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
                updateSummaryVisible:       false,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting UPDATE VIEW | UPDATE SUMMARY
            chai.assert.equal(item.find('#scopePane').length, 0, 'Scope is visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 0, 'Edit pane is visible');
            chai.assert.equal(item.find('#editorPaneView').length, 1, 'Update view is not visible');
            chai.assert.equal(item.find('#editorPaneWorking').length, 0, 'Working view is visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 0, 'Update summary is visible');
        });

        it('is not shown in edit', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       false,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting SCOPE | UPDATE EDIT | WORKING VERSION | UPDATE SUMMARY
            chai.assert.equal(item.find('#scopePane').length, 1, 'Scope is not visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 1, 'Edit pane is not visible');
            chai.assert.equal(item.find('#editorPaneView').length, 0, 'Update view is visible');
            chai.assert.equal(item.find('#editorPaneWorking').length, 0, 'Working view is visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 0, 'Update summary is visible');
        });

        it('is not shown in edit with view mode', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       false,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting UPDATE VIEW | UPDATE SUMMARY
            chai.assert.equal(item.find('#scopePane').length, 0, 'Scope is visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 0, 'Edit pane is visible');
            chai.assert.equal(item.find('#editorPaneView').length, 1, 'Update view is not visible');
            chai.assert.equal(item.find('#editorPaneWorking').length, 0, 'Working view is visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 0, 'Update summary is visible');
        });
    });

    describe('The Design Update Summary pane may be shown for a Design Update', () => {

        it('is shown in view', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       true,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting UPDATE VIEW | DOMAIN DICTIONARY
            chai.assert.equal(item.find('#scopePane').length, 0, 'Scope is visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 0, 'Edit pane is visible');
            chai.assert.equal(item.find('#editorPaneView').length, 1, 'Update view is not visible');
            chai.assert.equal(item.find('#editorPaneWorking').length, 0, 'Working view is visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 1, 'Update summary is not visible');
        });

        it('is shown in edit', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       true,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting SCOPE | UPDATE EDIT | WORKING VERSION | DOMAIN DICTIONARY
            chai.assert.equal(item.find('#scopePane').length, 1, 'Scope is not visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 1, 'Edit pane is not visible');
            chai.assert.equal(item.find('#editorPaneView').length, 0, 'Update view is visible');
            chai.assert.equal(item.find('#editorPaneWorking').length, 0, 'Working view is visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 1, 'Update summary is not visible');
        });

        it('is shown in edit with view mode', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       true,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting UPDATE VIEW | DOMAIN DICTIONARY
            chai.assert.equal(item.find('#scopePane').length, 0, 'Scope is visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 0, 'Edit pane is visible');
            chai.assert.equal(item.find('#editorPaneView').length, 1, 'Update view is visible');
            chai.assert.equal(item.find('#editorPaneWorking').length, 0, 'Working view is not visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 1, 'Update summary is not visible');
        });
    });

    describe('The Design Update Summary pane may be hidden for a Design Update', () => {

        it('is not shown in view', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       false,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting UPDATE VIEW | UPDATE SUMMARY
            chai.assert.equal(item.find('#scopePane').length, 0, 'Scope is visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 0, 'Edit pane is visible');
            chai.assert.equal(item.find('#editorPaneView').length, 1, 'Update view is not visible');
            chai.assert.equal(item.find('#editorPaneWorking').length, 0, 'Working view is visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 0, 'Update summary is visible');
        });

        it('is not shown in edit', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       false,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting SCOPE | UPDATE EDIT | WORKING VERSION | UPDATE SUMMARY
            chai.assert.equal(item.find('#scopePane').length, 1, 'Scope is not visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 1, 'Edit pane is not visible');
            chai.assert.equal(item.find('#editorPaneView').length, 0, 'Update view is visible');
            chai.assert.equal(item.find('#editorPaneWorking').length, 0, 'Working view is visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 0, 'Update summary is visible');
        });

        it('is not shown in edit with view mode', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       false,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting UPDATE VIEW | UPDATE SUMMARY
            chai.assert.equal(item.find('#scopePane').length, 0, 'Scope is visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 0, 'Edit pane is visible');
            chai.assert.equal(item.find('#editorPaneView').length, 1, 'Update view is not visible');
            chai.assert.equal(item.find('#editorPaneWorking').length, 0, 'Working view is visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 0, 'Update summary is visible');
        });
    });

    describe('The working Design Version pane may be shown for a Design Update', () => {

        it('is shown in view', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       false,
                updateProgressVisible:      true
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting UPDATE VIEW | DOMAIN DICTIONARY
            chai.assert.equal(item.find('#scopePane').length, 0, 'Scope is visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 0, 'Edit pane is visible');
            chai.assert.equal(item.find('#editorPaneView').length, 1, 'Update view is not visible');
            chai.assert.equal(item.find('#editorPaneWorking').length, 1, 'Working view is not visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 0, 'Update summary is visible');
        });

        it('is shown in edit', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       false,
                updateProgressVisible:      true
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting SCOPE | UPDATE EDIT | WORKING VERSION | DOMAIN DICTIONARY
            chai.assert.equal(item.find('#scopePane').length, 1, 'Scope is not visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 1, 'Edit pane is not visible');
            chai.assert.equal(item.find('#editorPaneView').length, 0, 'Update view is visible');
            chai.assert.equal(item.find('#editorPaneWorking').length, 1, 'Working view is not visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 0, 'Update summary is visible');
        });

        it('is shown in edit with view mode', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       false,
                updateProgressVisible:      true
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting UPDATE VIEW | DOMAIN DICTIONARY
            chai.assert.equal(item.find('#scopePane').length, 0, 'Scope is visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 0, 'Edit pane is visible');
            chai.assert.equal(item.find('#editorPaneView').length, 1, 'Update view is visible');
            chai.assert.equal(item.find('#editorPaneWorking').length, 1, 'Working view is not visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 0, 'Update summary is visible');
        });
    });

    describe('The working Design Version pane may be hidden for a Design Update', () => {

        it('is not shown in view', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       false,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting UPDATE VIEW | UPDATE SUMMARY
            chai.assert.equal(item.find('#scopePane').length, 0, 'Scope is visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 0, 'Edit pane is visible');
            chai.assert.equal(item.find('#editorPaneView').length, 1, 'Update view is not visible');
            chai.assert.equal(item.find('#editorPaneWorking').length, 0, 'Working view is visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 0, 'Update summary is visible');
        });

        it('is not shown in edit', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       false,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting SCOPE | UPDATE EDIT | WORKING VERSION | UPDATE SUMMARY
            chai.assert.equal(item.find('#scopePane').length, 1, 'Scope is not visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 1, 'Edit pane is not visible');
            chai.assert.equal(item.find('#editorPaneView').length, 0, 'Update view is visible');
            chai.assert.equal(item.find('#editorPaneWorking').length, 0, 'Working view is visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 0, 'Update summary is visible');
        });

        it('is not shown in edit with view mode', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       false,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            // Expecting UPDATE VIEW | UPDATE SUMMARY
            chai.assert.equal(item.find('#scopePane').length, 0, 'Scope is visible');
            chai.assert.equal(item.find('#editorPaneEdit').length, 0, 'Edit pane is visible');
            chai.assert.equal(item.find('#editorPaneView').length, 1, 'Update view is not visible');
            chai.assert.equal(item.find('#editorPaneWorking').length, 0, 'Working view is visible');
            chai.assert.equal(item.find('#detailsPaneEdit').length, 0, 'Details Edit pane is visible');
            chai.assert.equal(item.find('#detailsPaneView').length, 0, 'Details view is visible');
            chai.assert.equal(item.find('#domainDictionary').length, 0, 'Domain Dictionary is visible');
            chai.assert.equal(item.find('#updateSummary').length, 0, 'Update summary is visible');
        });
    });

    // describe('The Test Summary may be displayed on the Scope pane for a Design Update', function(){
    //
    //     it('is displayed in edit mode', function(){
    //
    //         const mode = ViewMode.MODE_EDIT;
    //         const view = ViewType.DESIGN_UPDATE_EDIT;
    //
    //         // No extra stuff selected
    //         const viewOptions = {
    //             updateDetailsVisible:       false,
    //             updateDomainDictVisible:    false,
    //             updateTestSummaryVisible:   true,
    //             updateSummaryVisible:       false,
    //             updateProgressVisible:      false
    //         };
    //
    //         const item = testEditDesignUpdateContainer(mode, view, viewOptions);
    //
    //         const targets = item.find('DesignComponentTarget');
    //         let testSummary = false;
    //         targets.forEach((target) => {
    //             if(target.props.testSummary){
    //                 testSummary = true;
    //             }
    //         });
    //
    //         chai.assert.isTrue(testSummary, 'Expected test summary to be true');
    //     });
    //
    //     it('is displayed in edit with view mode', function(){
    //
    //         const mode = ViewMode.MODE_VIEW;
    //         const view = ViewType.DESIGN_UPDATE_EDIT;
    //
    //         // No extra stuff selected
    //         const viewOptions = {
    //             updateDetailsVisible:       false,
    //             updateDomainDictVisible:    false,
    //             updateTestSummaryVisible:   true,
    //             updateSummaryVisible:       false,
    //             updateProgressVisible:      false
    //         };
    //
    //         const item = testEditDesignUpdateContainer(mode, view, viewOptions);
    //
    //         const targets = item.find('DropTarget(DesignComponentTarget)');
    //         console.log("found " + targets.length + " targets")
    //         let testSummary = false;
    //         targets.forEach((target) => {
    //             if(target.props.testSummary){
    //                 testSummary = true;
    //             }
    //         });
    //
    //         chai.assert.isTrue(testSummary, 'Expected test summary to be true');
    //     });
    //
    //     it('is displayed in view', function(){
    //
    //         const mode = ViewMode.MODE_VIEW;
    //         const view = ViewType.DESIGN_UPDATE_VIEW;
    //
    //         // No extra stuff selected
    //         const viewOptions = {
    //             updateDetailsVisible:       false,
    //             updateDomainDictVisible:    false,
    //             updateTestSummaryVisible:   true,
    //             updateSummaryVisible:       false,
    //             updateProgressVisible:      false
    //         };
    //
    //         const item = testEditDesignUpdateContainer(mode, view, viewOptions);
    //
    //         const targets = item.find('DesignComponentTarget');
    //         let testSummary = false;
    //         targets.forEach((target) => {
    //             if(target.props.testSummary){
    //                 testSummary = true;
    //             }
    //         });
    //
    //         chai.assert.isTrue(testSummary, 'Expected test summary to be true');
    //     });
    // });

    describe('The width of each Design Update pane changes to accommodate the number of panes displayed', () => {

        // View mode ---------------------------------------------------------------------------------------------------

        it('view: VIEW:  6 ', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       false,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#viewCol').length, 1, 'Update view not found');

            chai.assert.equal(item.find('#viewCol').props().md, 6, 'Expecting width 6 for Update view');
        });

        it('view: VIEW + TEST SUMM:  12 ', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   true,
                updateSummaryVisible:       false,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#viewCol').length, 1, 'Update view not found');

            chai.assert.equal(item.find('#viewCol').props().md, 12, 'Expecting width 12 for Update view with test summary');
        });

        it('view: VIEW | DETAILS:  6 | 6 ', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       false,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#viewCol').length, 1, 'Update view not found');
            chai.assert.equal(item.find('#detailsCol').length, 1, 'Update details not found');

            chai.assert.equal(item.find('#viewCol').props().md, 6, 'Expecting width 6 for Update view');
            chai.assert.equal(item.find('#detailsCol').props().md, 6, 'Expecting width 6 for Update details');
        });

        it('view: VIEW + TEST SUMM | DETAILS:  8 | 4 ', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   true,
                updateSummaryVisible:       false,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#viewCol').length, 1, 'Update view not found');
            chai.assert.equal(item.find('#detailsCol').length, 1, 'Update details not found');

            chai.assert.equal(item.find('#viewCol').props().md, 8, 'Expecting width 6 for Update view with test summary');
            chai.assert.equal(item.find('#detailsCol').props().md, 4, 'Expecting width 6 for Update details');
        });

        it('view: VIEW | DETAILS | WORKING :  4 | 4 | 4 ', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       false,
                updateProgressVisible:      true
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#viewCol').length, 1, 'Update view not found');
            chai.assert.equal(item.find('#detailsCol').length, 1, 'Update details not found');
            chai.assert.equal(item.find('#workingCol').length, 1, 'Update working view not found');

            chai.assert.equal(item.find('#viewCol').props().md, 4, 'Expecting width 4 for Update view');
            chai.assert.equal(item.find('#detailsCol').props().md, 4, 'Expecting width 4 for Update details');
            chai.assert.equal(item.find('#workingCol').props().md, 4, 'Expecting width 4 for Update working view');
        });

        it('view: VIEW + TEST SUMM | DETAILS | WORKING:  6 | 3 | 3 ', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   true,
                updateSummaryVisible:       false,
                updateProgressVisible:      true
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#viewCol').length, 1, 'Update view not found');
            chai.assert.equal(item.find('#detailsCol').length, 1, 'Update details not found');
            chai.assert.equal(item.find('#workingCol').length, 1, 'Update working view not found');

            chai.assert.equal(item.find('#viewCol').props().md, 6, 'Expecting width 6 for Update view with test summary');
            chai.assert.equal(item.find('#detailsCol').props().md, 3, 'Expecting width 3 for Update details');
            chai.assert.equal(item.find('#workingCol').props().md, 3, 'Expecting width 3 for Update working view');
        });

        it('view: VIEW | DETAILS | WORKING | SUMMARY :  3 | 3 | 3 | 3 ', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       true,
                updateProgressVisible:      true
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#viewCol').length, 1, 'Update view not found');
            chai.assert.equal(item.find('#detailsCol').length, 1, 'Update details not found');
            chai.assert.equal(item.find('#workingCol').length, 1, 'Update working view not found');
            chai.assert.equal(item.find('#summaryCol').length, 1, 'Update summary not found');

            chai.assert.equal(item.find('#viewCol').props().md, 3, 'Expecting width 3 for Update view');
            chai.assert.equal(item.find('#detailsCol').props().md, 3, 'Expecting width 3 for Update details');
            chai.assert.equal(item.find('#workingCol').props().md, 3, 'Expecting width 3 for Update working view');
            chai.assert.equal(item.find('#summaryCol').props().md, 3, 'Expecting width 3 for Update summary');
        });

        it('view: VIEW + TEST SUMM | DETAILS | WORKING | SUMMARY:  6 | 2 | 2 | 2', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   true,
                updateSummaryVisible:       true,
                updateProgressVisible:      true
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#viewCol').length, 1, 'Update view not found');
            chai.assert.equal(item.find('#detailsCol').length, 1, 'Update details not found');
            chai.assert.equal(item.find('#workingCol').length, 1, 'Update working view not found');
            chai.assert.equal(item.find('#summaryCol').length, 1, 'Update summary not found');

            chai.assert.equal(item.find('#viewCol').props().md, 6, 'Expecting width 6 for Update view with test summary');
            chai.assert.equal(item.find('#detailsCol').props().md, 2, 'Expecting width 2 for Update details');
            chai.assert.equal(item.find('#workingCol').props().md, 2, 'Expecting width 2 for Update working view');
            chai.assert.equal(item.find('#summaryCol').props().md, 2, 'Expecting width 2 for Update summary view');
        });

        it('view: VIEW | DETAILS | WORKING | SUMMARY | DICT :  3 | 2 | 2 | 3 | 2', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    true,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       true,
                updateProgressVisible:      true
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#viewCol').length, 1, 'Update view not found');
            chai.assert.equal(item.find('#detailsCol').length, 1, 'Update details not found');
            chai.assert.equal(item.find('#workingCol').length, 1, 'Update working view not found');
            chai.assert.equal(item.find('#summaryCol').length, 1, 'Update summary not found');
            chai.assert.equal(item.find('#dictCol').length, 1, 'Domain Dictionary not found');

            chai.assert.equal(item.find('#viewCol').props().md, 3, 'Expecting width 3 for Update view');
            chai.assert.equal(item.find('#detailsCol').props().md, 2, 'Expecting width 2 for Update details');
            chai.assert.equal(item.find('#workingCol').props().md, 2, 'Expecting width 2 for Update working view');
            chai.assert.equal(item.find('#summaryCol').props().md, 3, 'Expecting width 3 for Update summary view');
            chai.assert.equal(item.find('#dictCol').props().md, 2, 'Expecting width 2 for Domain Dictionary view');
        });

        it('view: VIEW + TEST SUMM | DETAILS | WORKING | SUMMARY | DICT :  4 | 2 | 2 | 2 | 2', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    true,
                updateTestSummaryVisible:   true,
                updateSummaryVisible:       true,
                updateProgressVisible:      true
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#viewCol').length, 1, 'Update view not found');
            chai.assert.equal(item.find('#detailsCol').length, 1, 'Update details not found');
            chai.assert.equal(item.find('#workingCol').length, 1, 'Update working view not found');
            chai.assert.equal(item.find('#summaryCol').length, 1, 'Update summary not found');
            chai.assert.equal(item.find('#dictCol').length, 1, 'Domain Dictionary not found');

            chai.assert.equal(item.find('#viewCol').props().md, 4, 'Expecting width 4 for Update view with test summary');
            chai.assert.equal(item.find('#detailsCol').props().md, 2, 'Expecting width 2 for Update details');
            chai.assert.equal(item.find('#workingCol').props().md, 2, 'Expecting width 2 for Update working view');
            chai.assert.equal(item.find('#summaryCol').props().md, 2, 'Expecting width 2 for Update working view');
            chai.assert.equal(item.find('#dictCol').props().md, 2, 'Expecting width 2 for Domain Dictionary view');
        });

        // Edit mode ---------------------------------------------------------------------------------------------------

        it('edit: SCOPE | EDIT:  6 | 6', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       false,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#scopeCol').length, 1, 'Update scope not found');
            chai.assert.equal(item.find('#editCol').length, 1, 'Update edit not found');

            chai.assert.equal(item.find('#scopeCol').props().md, 6, 'Expecting width 6 for Update scope');
            chai.assert.equal(item.find('#editCol').props().md, 6, 'Expecting width 6 for Update edit');
        });

        it('edit: SCOPE + TEST SUMM | EDIT:  6 | 6 ', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       false,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#scopeCol').length, 1, 'Update scope not found');
            chai.assert.equal(item.find('#editCol').length, 1, 'Update edit not found');

            chai.assert.equal(item.find('#scopeCol').props().md, 6, 'Expecting width 6 for Update scope with test summary');
            chai.assert.equal(item.find('#editCol').props().md, 6, 'Expecting width 6 for Update edit');
        });

        it('edit: SCOPE | EDIT | DETAILS:  4 | 4 | 4', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       false,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#scopeCol').length, 1, 'Update scope not found');
            chai.assert.equal(item.find('#editCol').length, 1, 'Update edit not found');
            chai.assert.equal(item.find('#detailsCol').length, 1, 'Update details not found');

            chai.assert.equal(item.find('#scopeCol').props().md, 4, 'Expecting width 4 for Update scope');
            chai.assert.equal(item.find('#editCol').props().md, 4, 'Expecting width 4 for Update edit');
            chai.assert.equal(item.find('#detailsCol').props().md, 4, 'Expecting width 4 for Update details');
        });

        it('edit: VIEW + TEST SUMM | EDIT | DETAILS:  6 | 3 | 3', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   true,
                updateSummaryVisible:       false,
                updateProgressVisible:      false
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#scopeCol').length, 1, 'Update scope not found');
            chai.assert.equal(item.find('#editCol').length, 1, 'Update edit not found');
            chai.assert.equal(item.find('#detailsCol').length, 1, 'Update details not found');

            chai.assert.equal(item.find('#scopeCol').props().md, 6, 'Expecting width 6 for Update scope with test summary');
            chai.assert.equal(item.find('#editCol').props().md, 3, 'Expecting width 3 for Update edit');
            chai.assert.equal(item.find('#detailsCol').props().md, 3, 'Expecting width 3 for Update details');
        });

        it('edit: SCOPE | EDIT | DETAILS | WORKING:  3 | 3 | 3 | 3', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       false,
                updateProgressVisible:      true
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#scopeCol').length, 1, 'Update scope not found');
            chai.assert.equal(item.find('#editCol').length, 1, 'Update edit not found');
            chai.assert.equal(item.find('#detailsCol').length, 1, 'Update details not found');
            chai.assert.equal(item.find('#workingCol').length, 1, 'Update working view not found');

            chai.assert.equal(item.find('#scopeCol').props().md, 3, 'Expecting width 3 for Update scope');
            chai.assert.equal(item.find('#editCol').props().md, 3, 'Expecting width 3 for Update edit');
            chai.assert.equal(item.find('#detailsCol').props().md, 3, 'Expecting width 3 for Update details');
            chai.assert.equal(item.find('#workingCol').props().md, 3, 'Expecting width 3 for Update working view');
        });

        it('edit: VIEW + TEST SUMM | EDIT | DETAILS | WORKING:  6 | 2 | 2 | 2', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   true,
                updateSummaryVisible:       false,
                updateProgressVisible:      true
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#scopeCol').length, 1, 'Update scope not found');
            chai.assert.equal(item.find('#editCol').length, 1, 'Update edit not found');
            chai.assert.equal(item.find('#detailsCol').length, 1, 'Update details not found');
            chai.assert.equal(item.find('#workingCol').length, 1, 'Update working view not found');

            chai.assert.equal(item.find('#scopeCol').props().md, 6, 'Expecting width 6 for Update scope with test summary');
            chai.assert.equal(item.find('#editCol').props().md, 2, 'Expecting width 2 for Update edit');
            chai.assert.equal(item.find('#detailsCol').props().md, 2, 'Expecting width 2 for Update details');
            chai.assert.equal(item.find('#workingCol').props().md, 2, 'Expecting width 2 for Update working view');
        });

        it('edit: SCOPE | EDIT | DETAILS | WORKING | SUMMARY:  2 | 3 | 2 | 2 | 3', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       true,
                updateProgressVisible:      true
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#scopeCol').length, 1, 'Update scope not found');
            chai.assert.equal(item.find('#editCol').length, 1, 'Update edit not found');
            chai.assert.equal(item.find('#detailsCol').length, 1, 'Update details not found');
            chai.assert.equal(item.find('#workingCol').length, 1, 'Update working view not found');
            chai.assert.equal(item.find('#summaryCol').length, 1, 'Update summary not found');

            chai.assert.equal(item.find('#scopeCol').props().md, 2, 'Expecting width 2 for Update scope');
            chai.assert.equal(item.find('#editCol').props().md, 3, 'Expecting width 3 for Update edit');
            chai.assert.equal(item.find('#detailsCol').props().md, 2, 'Expecting width 2 for Update details');
            chai.assert.equal(item.find('#workingCol').props().md, 2, 'Expecting width 2 for Update working view');
            chai.assert.equal(item.find('#summaryCol').props().md, 3, 'Expecting width 3 for Update summary view');
        });

        it('edit: VIEW + TEST SUMM | EDIT | DETAILS | WORKING | SUMMARY:  4 | 2 | 2 | 2 | 2', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   true,
                updateSummaryVisible:       true,
                updateProgressVisible:      true
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#scopeCol').length, 1, 'Update scope not found');
            chai.assert.equal(item.find('#editCol').length, 1, 'Update edit not found');
            chai.assert.equal(item.find('#detailsCol').length, 1, 'Update details not found');
            chai.assert.equal(item.find('#workingCol').length, 1, 'Update working view not found');
            chai.assert.equal(item.find('#summaryCol').length, 1, 'Update summary not found');

            chai.assert.equal(item.find('#scopeCol').props().md, 4, 'Expecting width 4 for Update scope with test summary');
            chai.assert.equal(item.find('#editCol').props().md, 2, 'Expecting width 2 for Update edit');
            chai.assert.equal(item.find('#detailsCol').props().md, 2, 'Expecting width 2 for Update details');
            chai.assert.equal(item.find('#workingCol').props().md, 2, 'Expecting width 2 for Update working view');
            chai.assert.equal(item.find('#summaryCol').props().md, 2, 'Expecting width 2 for Update summary view');
        });

        it('edit: SCOPE | EDIT | DETAILS | WORKING | SUMMARY | DICT:  2 | 2 | 2 | 2 | 2 | 2', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    true,
                updateTestSummaryVisible:   false,
                updateSummaryVisible:       true,
                updateProgressVisible:      true
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#scopeCol').length, 1, 'Update scope not found');
            chai.assert.equal(item.find('#editCol').length, 1, 'Update edit not found');
            chai.assert.equal(item.find('#detailsCol').length, 1, 'Update details not found');
            chai.assert.equal(item.find('#workingCol').length, 1, 'Update working view not found');
            chai.assert.equal(item.find('#summaryCol').length, 1, 'Update summary not found');
            chai.assert.equal(item.find('#dictCol').length, 1, 'Domain Dictionary not found');

            chai.assert.equal(item.find('#scopeCol').props().md, 2, 'Expecting width 2 for Update scope');
            chai.assert.equal(item.find('#editCol').props().md, 2, 'Expecting width 2 for Update edit');
            chai.assert.equal(item.find('#detailsCol').props().md, 2, 'Expecting width 2 for Update details');
            chai.assert.equal(item.find('#workingCol').props().md, 2, 'Expecting width 2 for Update working view');
            chai.assert.equal(item.find('#summaryCol').props().md, 2, 'Expecting width 2 for Update summary view');
            chai.assert.equal(item.find('#dictCol').props().md, 2, 'Expecting width 2 for Domain Dictionary view');
        });

        it('edit: VIEW + TEST SUMM | EDIT | DETAILS | WORKING | SUMMARY | DICT:  2 | 2 | 2 | 2 | 2 | 2', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            const viewOptions = {
                updateDetailsVisible:       true,
                updateDomainDictVisible:    true,
                updateTestSummaryVisible:   true,
                updateSummaryVisible:       true,
                updateProgressVisible:      true
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#scopeCol').length, 1, 'Update scope not found');
            chai.assert.equal(item.find('#editCol').length, 1, 'Update edit not found');
            chai.assert.equal(item.find('#detailsCol').length, 1, 'Update details not found');
            chai.assert.equal(item.find('#workingCol').length, 1, 'Update working view not found');
            chai.assert.equal(item.find('#summaryCol').length, 1, 'Update summary not found');
            chai.assert.equal(item.find('#dictCol').length, 1, 'Domain Dictionary not found');

            chai.assert.equal(item.find('#scopeCol').props().md, 2, 'Expecting width 2 for Update scope');
            chai.assert.equal(item.find('#editCol').props().md, 2, 'Expecting width 2 for Update edit');
            chai.assert.equal(item.find('#detailsCol').props().md, 2, 'Expecting width 2 for Update details');
            chai.assert.equal(item.find('#workingCol').props().md, 2, 'Expecting width 2 for Update working view');
            chai.assert.equal(item.find('#summaryCol').props().md, 2, 'Expecting width 2 for Update summary view');
            chai.assert.equal(item.find('#dictCol').props().md, 2, 'Expecting width 2 for Domain Dictionary view');
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

    describe('A Design Update Summary is shown when a Design Update is edited or viewed', () => {

        it('is visible in edit mode when no dictionary', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#updateSummary').length, 1, 'Update Summary not found');
        });

        it('is visible in view mode when no dictionary', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#updateSummary').length, 1, 'Update Summary not found');
        });

        it('is visible when viewing with no dictionary', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            // No extra stuff selected
            const viewOptions = {
                updateDetailsVisible:       false,
                updateDomainDictVisible:    false,
                updateTestSummaryVisible:   false,
            };

            const item = testEditDesignUpdateContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#updateSummary').length, 1, 'Update Summary not found');
        });
    })

});

