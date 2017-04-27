import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignApplicationsList } from './EditDesignContainer.jsx';  // Non Redux wrapped

import { DesignVersionStatus, RoleType, ViewType, ViewMode } from '../../../constants/constants.js'

import { DesignVersions } from '../../../collections/design/design_versions.js'

describe('JSX: EditDesignContainer', () => {

    function testEditDesignContainer(mode, view, viewOptions){

        const baseApplications = [];
        const workingApplications = [];
        const designSummaryData = null;
        const userContext = {};
        const currentViewDataValue = false;

        return shallow(
            <DesignApplicationsList
                baseApplications={baseApplications}
                workingApplications={workingApplications}
                designSummaryData={designSummaryData}
                userContext={userContext}
                mode={mode}
                view={view}
                viewOptions={viewOptions}
                currentViewDataValue={currentViewDataValue}
            />
        );
    }

    describe('The Details pane may be shown for a Design Version', () => {

        it('is shown when Details selected', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;

            // No extra stuff selected
            const viewOptions = {
                designDetailsVisible:       true,
                designDomainDictVisible:    false,
                testSummaryVisible:   false,
            };

            const item = testEditDesignContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#column1').length, 1, 'Designs not found');
            chai.assert.equal(item.find('#column2').length, 1, 'Details not found');
        });
    });

    describe('The Details pane may be hidden for a Design Version', () => {

        it('is not shown when Details not selected', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;

            // No extra stuff selected
            const viewOptions = {
                designDetailsVisible:       false,
                designDomainDictVisible:    false,
                testSummaryVisible:   false,
            };

            const item = testEditDesignContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#column1').length, 1, 'Designs not found');
            chai.assert.equal(item.find('#column2').length, 0, 'Details is visible');
        });
    });

    describe('The Domain Dictionary may be shown for a Design Version', () => {

        it('is shown when Dictionary selected', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;

            // No extra stuff selected
            const viewOptions = {
                designDetailsVisible:       false,
                designDomainDictVisible:    true,
                testSummaryVisible:   false,
            };

            const item = testEditDesignContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#column1').length, 1, 'Designs not found');
            chai.assert.equal(item.find('#column3').length, 1, 'Dictionary not found');
        });
    });

    describe('The Domain Dictionary may be hidden for a Design Version', () => {

        it('is not shown when Dictionary not selected', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;

            // No extra stuff selected
            const viewOptions = {
                designDetailsVisible:       false,
                designDomainDictVisible:    false,
                testSummaryVisible:   false,
            };

            const item = testEditDesignContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#column1').length, 1, 'Designs not found');
            chai.assert.equal(item.find('#column3').length, 0, 'Domain Dictionary is visible');
        });
    });

    describe('The width of each Design Version pane changes to accommodate the number of panes displayed', () => {

        it('when Design only pane fills half the screen', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;

            // No extra stuff selected
            const viewOptions = {
                designDetailsVisible:       false,
                designDomainDictVisible:    false,
                testSummaryVisible:   false,
            };

            const item = testEditDesignContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#column1').length, 1, 'Designs not found');
            chai.assert.equal(item.find('#column2').length, 0, 'Details visible');
            chai.assert.equal(item.find('#column3').length, 0, 'Dictionary visible');

            chai.assert.equal(item.find('#column1').props().md, 6, 'Expecting width 6 for Design');
        });

        it('when Design only and Test Summary, Design+Summary fills whole screen', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;

            // No extra stuff selected but test summary on
            const viewOptions = {
                designDetailsVisible:       false,
                designDomainDictVisible:    false,
                testSummaryVisible:   true,
            };

            const item = testEditDesignContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#column1').length, 1, 'Designs not found');
            chai.assert.equal(item.find('#column2').length, 0, 'Details visible');
            chai.assert.equal(item.find('#column3').length, 0, 'Dictionary visible');

            chai.assert.equal(item.find('#column1').props().md, 12, 'Expecting width 12 for Design');
        });

        it('when Design and Details each fills half the screen', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;

            // Details selected
            const viewOptions = {
                designDetailsVisible:       true,
                designDomainDictVisible:    false,
                testSummaryVisible:   false,
            };

            const item = testEditDesignContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#column1').length, 1, 'Designs not found');
            chai.assert.equal(item.find('#column2').length, 1, 'Details not found');
            chai.assert.equal(item.find('#column3').length, 0, 'Dictionary visible');

            chai.assert.equal(item.find('#column1').props().md, 6, 'Expecting width 6 for Design');
            chai.assert.equal(item.find('#column2').props().md, 6, 'Expecting width 6 for Details');
        });

        it('when Design, Details and Dictionary each fills a third of the screen', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;

            // Details and Dictionaryselected
            const viewOptions = {
                designDetailsVisible:       true,
                designDomainDictVisible:    true,
                testSummaryVisible:   false,
            };

            const item = testEditDesignContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#column1').length, 1, 'Designs not found');
            chai.assert.equal(item.find('#column2').length, 1, 'Details not found');
            chai.assert.equal(item.find('#column3').length, 1, 'Dictionary not found');

            chai.assert.equal(item.find('#column1').props().md, 4, 'Expecting width 4 for Design');
            chai.assert.equal(item.find('#column2').props().md, 4, 'Expecting width 4 for Details');
            chai.assert.equal(item.find('#column3').props().md, 4, 'Expecting width 4 for Dictionary');
        });

        it('when Design, Details and Test Summary, Design+Summary is two thirds', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;

            // Details selected, test summary showing
            const viewOptions = {
                designDetailsVisible:       true,
                designDomainDictVisible:    false,
                testSummaryVisible:   true,
            };

            const item = testEditDesignContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#column1').length, 1, 'Designs not found');
            chai.assert.equal(item.find('#column2').length, 1, 'Details not found');
            chai.assert.equal(item.find('#column3').length, 0, 'Dictionary visible');

            chai.assert.equal(item.find('#column1').props().md, 8, 'Expecting width 8 for Design');
            chai.assert.equal(item.find('#column2').props().md, 4, 'Expecting width 4 for Details');
        });

        it('when Design, Dictionary and Test Summary, Design+Summary is two thirds', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;

            // Dictionary selected, test summary showing
            const viewOptions = {
                designDetailsVisible:       false,
                designDomainDictVisible:    true,
                testSummaryVisible:   true,
            };

            const item = testEditDesignContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#column1').length, 1, 'Designs not found');
            chai.assert.equal(item.find('#column2').length, 0, 'Details visible');
            chai.assert.equal(item.find('#column3').length, 1, 'Dictionary not found');

            chai.assert.equal(item.find('#column1').props().md, 8, 'Expecting width 8 for Design');
            chai.assert.equal(item.find('#column3').props().md, 4, 'Expecting width 4 for Dictionary');
        });

        it('when Design, Details, Dictionary and Test Summary, Design+Summary is half and others a quarter each', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;

            // Details, Dict and Test Summary selected
            const viewOptions = {
                designDetailsVisible:       true,
                designDomainDictVisible:    true,
                testSummaryVisible:   true,
            };

            const item = testEditDesignContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#column1').length, 1, 'Designs not found');
            chai.assert.equal(item.find('#column2').length, 1, 'Details not found');
            chai.assert.equal(item.find('#column3').length, 1, 'Dictionary not found');

            chai.assert.equal(item.find('#column1').props().md, 6, 'Expecting width 6 for Design');
            chai.assert.equal(item.find('#column2').props().md, 3, 'Expecting width 3 for Details');
            chai.assert.equal(item.find('#column3').props().md, 3, 'Expecting width 3 for Dictionary');
        });
    });

    describe('A Design Version has an option to add a new Application to it', () => {

        it('add application visible in edit mode', () => {

            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;

            // No extra stuff selected
            const viewOptions = {
                designDetailsVisible:       false,
                designDomainDictVisible:    false,
                testSummaryVisible:   false,
            };

            const item = testEditDesignContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#addApplication').length, 1, 'Add application not found');
        });

        it('add application not visible in view mode', () => {

            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW_EDIT;

            // No extra stuff selected
            const viewOptions = {
                designDetailsVisible:       false,
                designDomainDictVisible:    false,
                testSummaryVisible:   false,
            };

            const item = testEditDesignContainer(mode, view, viewOptions);

            chai.assert.equal(item.find('#addApplication').length, 0, 'Add application found');
        });
    });

});
