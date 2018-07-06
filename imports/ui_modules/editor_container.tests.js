
import {
    DesignVersionStatus, RoleType, ViewMode, ViewType,
    WorkPackageType
} from "../constants/constants";

import {hashID} from "../common/utils";

import { EditorContainerUiModules } from '../ui_modules/editor_container.js';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import {UITab} from "../constants/ui_context_ids";

describe('UI Mods: Editor Container', () => {

    const DEFAULT_DV_CONTEXT = {
        userId:                         'USER1',
        designId:                       'DESIGN1',
        designVersionId:                'DESIGN_VERSION1',
        designUpdateId:                 'NONE',
        workPackageId:                  'NONE',
        designComponentId:              'NONE',
        designComponentType:            'NONE',
        featureReferenceId:             'NONE',
        featureAspectReferenceId:       'NONE',
        scenarioReferenceId:            'NONE',
        scenarioStepId:                 'NONE',
    };

    const DEFAULT_DU_CONTEXT = {
        userId:                         'USER1',
        designId:                       'DESIGN1',
        designVersionId:                'DESIGN_VERSION1',
        designUpdateId:                 'DESIGN_UPDATE1',
        workPackageId:                  'NONE',
        designComponentId:              'NONE',
        designComponentType:            'NONE',
        featureReferenceId:             'NONE',
        featureAspectReferenceId:       'NONE',
        scenarioReferenceId:            'NONE',
        scenarioStepId:                 'NONE',
    };

    const DEFAULT_BASE_WP_CONTEXT = {
        userId:                         'USER1',
        designId:                       'DESIGN1',
        designVersionId:                'DESIGN_VERSION1',
        designUpdateId:                 'NONE',
        workPackageId:                  'WORK_PACKAGE1',
        designComponentId:              'NONE',
        designComponentType:            'NONE',
        featureReferenceId:             'NONE',
        featureAspectReferenceId:       'NONE',
        scenarioReferenceId:            'NONE',
        scenarioStepId:                 'NONE',
    };

    const DEFAULT_UPDATE_WP_CONTEXT = {
        userId:                         'USER1',
        designId:                       'DESIGN1',
        designVersionId:                'DESIGN_VERSION1',
        designUpdateId:                 'DESIGN_UPDATE1',
        workPackageId:                  'WORK_PACKAGE1',
        designComponentId:              'NONE',
        designComponentType:            'NONE',
        featureReferenceId:             'NONE',
        featureAspectReferenceId:       'NONE',
        scenarioReferenceId:            'NONE',
        scenarioStepId:                 'NONE',
    };

    function testLayout (view, mode, userRole, viewOptions, userContext){

        const baseApplications = [];
        const workingApplications = [];
        const updateApplications = [];
        const wpApplications = [];
        const designSummaryData = {};
        const editorClass = '';

        const editors = EditorContainerUiModules.getMainEditors(baseApplications, workingApplications, updateApplications, wpApplications, designSummaryData, userContext, userRole, view, mode, viewOptions, editorClass);
        const colWidths = EditorContainerUiModules.calculateColumnWidths(view, mode, viewOptions);
        const layout = EditorContainerUiModules.getLayout(view, mode, userRole, viewOptions, colWidths, editors, userContext);

        return shallow(layout);

    }

    function testTabsLayout (view, mode, userRole, viewOptions, userContext){

        const baseApplications = [];
        const workingApplications = [];
        const updateApplications = [];
        const wpApplications = [];
        const designSummaryData = {};
        const editorClass = '';

        const editors = EditorContainerUiModules.getMainEditors(baseApplications, workingApplications, updateApplications, wpApplications, designSummaryData, userContext, userRole, view, mode, viewOptions, editorClass);
        const tabLayout = EditorContainerUiModules.getTabsView(view, userRole, userContext, 4, 'column1', editors );

        return shallow(tabLayout);

    }

    function testColumnWidths(view, mode, viewOptions){

        return EditorContainerUiModules.calculateColumnWidths(view, mode, viewOptions);

    }

    function testAddComponent(view, mode, userContext){

        const component = EditorContainerUiModules.getAddComponent(view, mode, userContext);
        return shallow(component);
    }

    describe('LAYOUT DV', () => {

        // DESIGN VERSIONS ---------------------------------------------------------------------------------------------

        describe('The Details pane may be shown for a Design Version', () => {

            it('is shown when Details selected', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_PUBLISHED;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible: true,
                    designDomainDictVisible: false,
                    testSummaryVisible: false,
                    updateProgressVisible: false,
                    updateSummaryVisible: false,
                    devAccTestsVisible: false,
                    devIntTestsVisible: false,
                    devUnitTestsVisible: false,
                    devFeatureFilesVisible: false,
                    designShowAllAsTabs: false,
                    updateShowAllAsTabs: false,
                    workShowAllAsTabs: false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#column1').length, 1, 'Designs not found');
                chai.assert.equal(item.find('#column2').length, 1, 'Details not found');
                chai.assert.equal(item.find('#column3').length, 0, 'Unexpected column 3');
                chai.assert.equal(item.find('#column4').length, 0, 'Unexpected column 4');
                chai.assert.equal(item.find('#column5').length, 0, 'Unexpected column 5');
                chai.assert.equal(item.find('#column6').length, 0, 'Unexpected column 6');
            });
        });

        describe('The Details pane may be hidden for a Design Version', () => {

            it('is not shown when Details not selected', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_PUBLISHED;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible: false,
                    designDomainDictVisible: false,
                    testSummaryVisible: false,
                    updateProgressVisible: false,
                    updateSummaryVisible: false,
                    devAccTestsVisible: false,
                    devIntTestsVisible: false,
                    devUnitTestsVisible: false,
                    devFeatureFilesVisible: false,
                    designShowAllAsTabs: false,
                    updateShowAllAsTabs: false,
                    workShowAllAsTabs: false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#column1').length, 1, 'Designs not found');
                chai.assert.equal(item.find('#column2').length, 0, 'Details are visible');
                chai.assert.equal(item.find('#column3').length, 0, 'Unexpected column 3');
                chai.assert.equal(item.find('#column4').length, 0, 'Unexpected column 4');
                chai.assert.equal(item.find('#column5').length, 0, 'Unexpected column 5');
                chai.assert.equal(item.find('#column6').length, 0, 'Unexpected column 6');
            });
        });

        describe('The Domain Dictionary may be shown for a Design Version', () => {

            it('is shown when Dictionary selected', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_PUBLISHED;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible: false,
                    designDomainDictVisible: true,
                    testSummaryVisible: false,
                    updateProgressVisible: false,
                    updateSummaryVisible: false,
                    devAccTestsVisible: false,
                    devIntTestsVisible: false,
                    devUnitTestsVisible: false,
                    devFeatureFilesVisible: false,
                    designShowAllAsTabs: false,
                    updateShowAllAsTabs: false,
                    workShowAllAsTabs: false,
                };


                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#column1').length, 1, 'Designs not found');
                chai.assert.equal(item.find('#column2').length, 0, 'Unexpected column 2');
                chai.assert.equal(item.find('#column3').length, 1, 'Dictionary not found');
                chai.assert.equal(item.find('#column4').length, 0, 'Unexpected column 4');
                chai.assert.equal(item.find('#column5').length, 0, 'Unexpected column 5');
                chai.assert.equal(item.find('#column6').length, 0, 'Unexpected column 6');
            });
        });

        describe('The Domain Dictionary may be hidden for a Design Version', () => {

            it('is not shown when Dictionary not selected', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_PUBLISHED;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible: false,
                    designDomainDictVisible: false,
                    testSummaryVisible: false,
                    updateProgressVisible: false,
                    updateSummaryVisible: false,
                    devAccTestsVisible: false,
                    devIntTestsVisible: false,
                    devUnitTestsVisible: false,
                    devFeatureFilesVisible: false,
                    designShowAllAsTabs: false,
                    updateShowAllAsTabs: false,
                    workShowAllAsTabs: false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#column1').length, 1, 'Designs not found');
                chai.assert.equal(item.find('#column2').length, 0, 'Unexpected column 2');
                chai.assert.equal(item.find('#column3').length, 0, 'Dictionary is visible');
                chai.assert.equal(item.find('#column4').length, 0, 'Unexpected column 4');
                chai.assert.equal(item.find('#column5').length, 0, 'Unexpected column 5');
                chai.assert.equal(item.find('#column6').length, 0, 'Unexpected column 6');
            });
        });

        describe('All panes may be displayed as tabs for the Design version editor', () => {

            it('all tabs shown when option selected', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_PUBLISHED;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible: false,
                    designDomainDictVisible: false,
                    testSummaryVisible: false,
                    updateProgressVisible: false,
                    updateSummaryVisible: false,
                    devAccTestsVisible: false,
                    devIntTestsVisible: false,
                    devUnitTestsVisible: false,
                    devFeatureFilesVisible: false,
                    designShowAllAsTabs: true,
                    updateShowAllAsTabs: false,
                    workShowAllAsTabs: false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#column1').length, 1, 'Designs not found');
                chai.assert.equal(item.find('#column2').length, 1, 'Tabs column not found');
                chai.assert.equal(item.find('#column3').length, 0, 'Unexpected column 3');
                chai.assert.equal(item.find('#column4').length, 0, 'Unexpected column 4');
                chai.assert.equal(item.find('#column5').length, 0, 'Unexpected column 5');
                chai.assert.equal(item.find('#column6').length, 0, 'Unexpected column 6');

                chai.assert.equal(item.find('#all-tabs').length, 1, 'Tabs not found');
            });

            it('all tabs not shown when option not selected', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_PUBLISHED;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible: false,
                    designDomainDictVisible: false,
                    testSummaryVisible: false,
                    updateProgressVisible: false,
                    updateSummaryVisible: false,
                    devAccTestsVisible: false,
                    devIntTestsVisible: false,
                    devUnitTestsVisible: false,
                    devFeatureFilesVisible: false,
                    designShowAllAsTabs: false,
                    updateShowAllAsTabs: false,
                    workShowAllAsTabs: false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#column1').length, 1, 'Designs not found');
                chai.assert.equal(item.find('#column2').length, 0, 'Unexpected column 2');
                chai.assert.equal(item.find('#column3').length, 0, 'Unexpected column 3');
                chai.assert.equal(item.find('#column4').length, 0, 'Unexpected column 4');
                chai.assert.equal(item.find('#column5').length, 0, 'Unexpected column 5');
                chai.assert.equal(item.find('#column6').length, 0, 'Unexpected column 6');

                chai.assert.equal(item.find('#all-tabs').length, 0, 'Tabs were found');
            });
        });

        describe('The Design pane is always showing and cannot be hidden', () => {

            it('is not shown when Dictionary not selected', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_PUBLISHED;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible: false,
                    designDomainDictVisible: false,
                    testSummaryVisible: false,
                    updateProgressVisible: false,
                    updateSummaryVisible: false,
                    devAccTestsVisible: false,
                    devIntTestsVisible: false,
                    devUnitTestsVisible: false,
                    devFeatureFilesVisible: false,
                    designShowAllAsTabs: false,
                    updateShowAllAsTabs: false,
                    workShowAllAsTabs: false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#column1').length, 1, 'Designs not found');
                chai.assert.equal(item.find('#column2').length, 0, 'Unexpected column 2');
                chai.assert.equal(item.find('#column3').length, 0, 'Unexpected column 3');
                chai.assert.equal(item.find('#column4').length, 0, 'Unexpected column 4');
                chai.assert.equal(item.find('#column5').length, 0, 'Unexpected column 5');
                chai.assert.equal(item.find('#column6').length, 0, 'Unexpected column 6');

                chai.assert.equal(item.find('#all-tabs').length, 0, 'Tabs were found');
            });
        });


        describe('The width of each Design Version pane changes to accommodate the number of panes displayed', () => {

            it('when Design only pane fills half the screen', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_PUBLISHED;

                const viewOptions = {
                    designDetailsVisible: false,
                    designDomainDictVisible: false,
                    testSummaryVisible: false,
                    updateProgressVisible: false,
                    updateSummaryVisible: false,
                    devAccTestsVisible: false,
                    devIntTestsVisible: false,
                    devUnitTestsVisible: false,
                    devFeatureFilesVisible: false,
                    designShowAllAsTabs: false,
                    updateShowAllAsTabs: false,
                    workShowAllAsTabs: false,
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 6, 'Expecting width 6 for Design');
            });

            it('when Design only and Test Summary, Design+Summary fills whole screen', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_PUBLISHED;

                const viewOptions = {
                    designDetailsVisible: false,
                    designDomainDictVisible: false,
                    testSummaryVisible: true,
                    updateProgressVisible: false,
                    updateSummaryVisible: false,
                    devAccTestsVisible: false,
                    devIntTestsVisible: false,
                    devUnitTestsVisible: false,
                    devFeatureFilesVisible: false,
                    designShowAllAsTabs: false,
                    updateShowAllAsTabs: false,
                    workShowAllAsTabs: false,
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 12, 'Expecting width 12 for Design');
            });

            it('when Design and Details each fills half the screen', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_PUBLISHED;

                const viewOptions = {
                    designDetailsVisible: true,
                    designDomainDictVisible: false,
                    testSummaryVisible: false,
                    updateProgressVisible: false,
                    updateSummaryVisible: false,
                    devAccTestsVisible: false,
                    devIntTestsVisible: false,
                    devUnitTestsVisible: false,
                    devFeatureFilesVisible: false,
                    designShowAllAsTabs: false,
                    updateShowAllAsTabs: false,
                    workShowAllAsTabs: false,
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 6, 'Expecting width 6 for Design');
                chai.assert.equal(widths.col2width, 6, 'Expecting width 6 for Details');
            });

            it('when Design, Details and Dictionary each fills a third of the screen', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_PUBLISHED;

                const viewOptions = {
                    designDetailsVisible: true,
                    designDomainDictVisible: true,
                    testSummaryVisible: false,
                    updateProgressVisible: false,
                    updateSummaryVisible: false,
                    devAccTestsVisible: false,
                    devIntTestsVisible: false,
                    devUnitTestsVisible: false,
                    devFeatureFilesVisible: false,
                    designShowAllAsTabs: false,
                    updateShowAllAsTabs: false,
                    workShowAllAsTabs: false,
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 4, 'Expecting width 4 for Design');
                chai.assert.equal(widths.col2width, 4, 'Expecting width 4 for Details');
                chai.assert.equal(widths.col3width, 4, 'Expecting width 4 for Dictionary');
            });

            it('when Design, Details and Test Summary, Design+Summary is two thirds', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_PUBLISHED;

                const viewOptions = {
                    designDetailsVisible: true,
                    designDomainDictVisible: false,
                    testSummaryVisible: true,
                    updateProgressVisible: false,
                    updateSummaryVisible: false,
                    devAccTestsVisible: false,
                    devIntTestsVisible: false,
                    devUnitTestsVisible: false,
                    devFeatureFilesVisible: false,
                    designShowAllAsTabs: false,
                    updateShowAllAsTabs: false,
                    workShowAllAsTabs: false,
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 8, 'Expecting width 8 for Design');
                chai.assert.equal(widths.col2width, 4, 'Expecting width 4 for Details');
            });

            it('when Design, Dictionary and Test Summary, Design+Summary is two thirds', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_PUBLISHED;

                const viewOptions = {
                    designDetailsVisible: false,
                    designDomainDictVisible: true,
                    testSummaryVisible: true,
                    updateProgressVisible: false,
                    updateSummaryVisible: false,
                    devAccTestsVisible: false,
                    devIntTestsVisible: false,
                    devUnitTestsVisible: false,
                    devFeatureFilesVisible: false,
                    designShowAllAsTabs: false,
                    updateShowAllAsTabs: false,
                    workShowAllAsTabs: false,
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 8, 'Expecting width 8 for Design');
                chai.assert.equal(widths.col3width, 4, 'Expecting width 4 for Dictionary');
            });

            it('when Design, Details, Dictionary and Test Summary, Design+Summary is half and others a quarter each', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_PUBLISHED;

                const viewOptions = {
                    designDetailsVisible: true,
                    designDomainDictVisible: true,
                    testSummaryVisible: true,
                    updateProgressVisible: false,
                    updateSummaryVisible: false,
                    devAccTestsVisible: false,
                    devIntTestsVisible: false,
                    devUnitTestsVisible: false,
                    devFeatureFilesVisible: false,
                    designShowAllAsTabs: false,
                    updateShowAllAsTabs: false,
                    workShowAllAsTabs: false,
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 6, 'Expecting width 6 for Design');
                chai.assert.equal(widths.col2width, 3, 'Expecting width 3 for Details');
                chai.assert.equal(widths.col3width, 3, 'Expecting width 3 for Dictionary');
            });
        });

    });

    describe('LAYOUT DU', () => {

        // DESIGN UPDATES ----------------------------------------------------------------------------------------------

        describe('The Details pane may be shown for a Design Update', () => {

            it('is shown view only in view', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_VIEW;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible:       true,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateProgressVisible:      false,
                    updateSummaryVisible:       false,
                    devAccTestsVisible:         false,
                    devIntTestsVisible:         false,
                    devUnitTestsVisible:        false,
                    devFeatureFilesVisible:     false,
                    designShowAllAsTabs:        false,
                    updateShowAllAsTabs:        false,
                    workShowAllAsTabs:          false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#scopeCol').length, 0, 'Scope is visible');
                chai.assert.equal(item.find('#editCol').length, 0, 'Edit pane is visible');
                chai.assert.equal(item.find('#viewCol').length, 1, 'View pane is not visible');
                chai.assert.equal(item.find('#detailsCol').length, 1, 'Details pane is not visible');
                chai.assert.equal(item.find('#workingCol').length, 0, 'Working View is visible');
                chai.assert.equal(item.find('#summaryCol').length, 0, 'Update Summary is visible');
                chai.assert.equal(item.find('#dictCol').length, 0, 'Dictionary is visible');
                chai.assert.equal(item.find('#tabsCol').length, 0, 'Tabs are visible');

            });

            it('is shown editable in edit', () => {

                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_UPDATE_EDIT;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible:       true,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateProgressVisible:      false,
                    updateSummaryVisible:       false,
                    devAccTestsVisible:         false,
                    devIntTestsVisible:         false,
                    devUnitTestsVisible:        false,
                    devFeatureFilesVisible:     false,
                    designShowAllAsTabs:        false,
                    updateShowAllAsTabs:        false,
                    workShowAllAsTabs:          false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#scopeCol').length, 1, 'Scope is not visible');
                chai.assert.equal(item.find('#editCol').length, 1, 'Edit pane is not visible');
                chai.assert.equal(item.find('#viewCol').length, 0, 'View pane is visible');
                chai.assert.equal(item.find('#detailsCol').length, 1, 'Details pane is not visible');
                chai.assert.equal(item.find('#workingCol').length, 0, 'Working View is visible');
                chai.assert.equal(item.find('#summaryCol').length, 0, 'Update Summary is visible');
                chai.assert.equal(item.find('#dictCol').length, 0, 'Dictionary is visible');
                chai.assert.equal(item.find('#tabsCol').length, 0, 'Tabs are visible');
            });

            it('is shown view only in edit with view mode', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_EDIT;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible:       true,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateProgressVisible:      false,
                    updateSummaryVisible:       false,
                    devAccTestsVisible:         false,
                    devIntTestsVisible:         false,
                    devUnitTestsVisible:        false,
                    devFeatureFilesVisible:     false,
                    designShowAllAsTabs:        false,
                    updateShowAllAsTabs:        false,
                    workShowAllAsTabs:          false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#scopeCol').length, 0, 'Scope is visible');
                chai.assert.equal(item.find('#editCol').length, 0, 'Edit pane is visible');
                chai.assert.equal(item.find('#viewCol').length, 1, 'View pane is not visible');
                chai.assert.equal(item.find('#detailsCol').length, 1, 'Details pane is not visible');
                chai.assert.equal(item.find('#workingCol').length, 0, 'Working View is visible');
                chai.assert.equal(item.find('#summaryCol').length, 0, 'Update Summary is visible');
                chai.assert.equal(item.find('#dictCol').length, 0, 'Dictionary is visible');
                chai.assert.equal(item.find('#tabsCol').length, 0, 'Tabs are visible');
            });
        });

        describe('The Details pane may be hidden for a Design Update', () => {

            it('is not shown in view', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_VIEW;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible:       false,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateProgressVisible:      false,
                    updateSummaryVisible:       false,
                    devAccTestsVisible:         false,
                    devIntTestsVisible:         false,
                    devUnitTestsVisible:        false,
                    devFeatureFilesVisible:     false,
                    designShowAllAsTabs:        false,
                    updateShowAllAsTabs:        false,
                    workShowAllAsTabs:          false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#scopeCol').length, 0, 'Scope is visible');
                chai.assert.equal(item.find('#editCol').length, 0, 'Edit pane is visible');
                chai.assert.equal(item.find('#viewCol').length, 1, 'View pane is not visible');
                chai.assert.equal(item.find('#detailsCol').length, 0, 'Details pane is visible');
                chai.assert.equal(item.find('#workingCol').length, 0, 'Working View is visible');
                chai.assert.equal(item.find('#summaryCol').length, 0, 'Update Summary is visible');
                chai.assert.equal(item.find('#dictCol').length, 0, 'Dictionary is visible');
                chai.assert.equal(item.find('#tabsCol').length, 0, 'Tabs are visible');

            });

            it('is not shown in edit', () => {

                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_UPDATE_EDIT;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible:       false,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateProgressVisible:      false,
                    updateSummaryVisible:       false,
                    devAccTestsVisible:         false,
                    devIntTestsVisible:         false,
                    devUnitTestsVisible:        false,
                    devFeatureFilesVisible:     false,
                    designShowAllAsTabs:        false,
                    updateShowAllAsTabs:        false,
                    workShowAllAsTabs:          false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#scopeCol').length, 1, 'Scope is not visible');
                chai.assert.equal(item.find('#editCol').length, 1, 'Edit pane is not visible');
                chai.assert.equal(item.find('#viewCol').length, 0, 'View pane is visible');
                chai.assert.equal(item.find('#detailsCol').length, 0, 'Details pane is visible');
                chai.assert.equal(item.find('#workingCol').length, 0, 'Working View is visible');
                chai.assert.equal(item.find('#summaryCol').length, 0, 'Update Summary is visible');
                chai.assert.equal(item.find('#dictCol').length, 0, 'Dictionary is visible');
                chai.assert.equal(item.find('#tabsCol').length, 0, 'Tabs are visible');
            });

            it('is not shown in edit with view mode', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_EDIT;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible:       false,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateProgressVisible:      false,
                    updateSummaryVisible:       false,
                    devAccTestsVisible:         false,
                    devIntTestsVisible:         false,
                    devUnitTestsVisible:        false,
                    devFeatureFilesVisible:     false,
                    designShowAllAsTabs:        false,
                    updateShowAllAsTabs:        false,
                    workShowAllAsTabs:          false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#scopeCol').length, 0, 'Scope is visible');
                chai.assert.equal(item.find('#editCol').length, 0, 'Edit pane is visible');
                chai.assert.equal(item.find('#viewCol').length, 1, 'View pane is not visible');
                chai.assert.equal(item.find('#detailsCol').length, 0, 'Details pane is visible');
                chai.assert.equal(item.find('#workingCol').length, 0, 'Working View is visible');
                chai.assert.equal(item.find('#summaryCol').length, 0, 'Update Summary is visible');
                chai.assert.equal(item.find('#dictCol').length, 0, 'Dictionary is visible');
                chai.assert.equal(item.find('#tabsCol').length, 0, 'Tabs are visible');
            });
        });

        describe('The Domain Dictionary pane may be shown for a Design Update', () => {

            it('is shown in view', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_VIEW;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible:       false,
                    designDomainDictVisible:    true,
                    testSummaryVisible:         false,
                    updateProgressVisible:      false,
                    updateSummaryVisible:       false,
                    devAccTestsVisible:         false,
                    devIntTestsVisible:         false,
                    devUnitTestsVisible:        false,
                    devFeatureFilesVisible:     false,
                    designShowAllAsTabs:        false,
                    updateShowAllAsTabs:        false,
                    workShowAllAsTabs:          false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#scopeCol').length, 0, 'Scope is visible');
                chai.assert.equal(item.find('#editCol').length, 0, 'Edit pane is visible');
                chai.assert.equal(item.find('#viewCol').length, 1, 'View pane is not visible');
                chai.assert.equal(item.find('#detailsCol').length, 0, 'Details pane is visible');
                chai.assert.equal(item.find('#workingCol').length, 0, 'Working View is visible');
                chai.assert.equal(item.find('#summaryCol').length, 0, 'Update Summary is visible');
                chai.assert.equal(item.find('#dictCol').length, 1, 'Dictionary is not visible');
                chai.assert.equal(item.find('#tabsCol').length, 0, 'Tabs are visible');

            });

            it('is shown in edit', () => {

                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_UPDATE_EDIT;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible:       false,
                    designDomainDictVisible:    true,
                    testSummaryVisible:         false,
                    updateProgressVisible:      false,
                    updateSummaryVisible:       false,
                    devAccTestsVisible:         false,
                    devIntTestsVisible:         false,
                    devUnitTestsVisible:        false,
                    devFeatureFilesVisible:     false,
                    designShowAllAsTabs:        false,
                    updateShowAllAsTabs:        false,
                    workShowAllAsTabs:          false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#scopeCol').length, 1, 'Scope is not visible');
                chai.assert.equal(item.find('#editCol').length, 1, 'Edit pane is not visible');
                chai.assert.equal(item.find('#viewCol').length, 0, 'View pane is visible');
                chai.assert.equal(item.find('#detailsCol').length, 0, 'Details pane is visible');
                chai.assert.equal(item.find('#workingCol').length, 0, 'Working View is visible');
                chai.assert.equal(item.find('#summaryCol').length, 0, 'Update Summary is visible');
                chai.assert.equal(item.find('#dictCol').length, 1, 'Dictionary is not visible');
                chai.assert.equal(item.find('#tabsCol').length, 0, 'Tabs are visible');
            });

            it('is shown in edit with view mode', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_EDIT;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible:       false,
                    designDomainDictVisible:    true,
                    testSummaryVisible:         false,
                    updateProgressVisible:      false,
                    updateSummaryVisible:       false,
                    devAccTestsVisible:         false,
                    devIntTestsVisible:         false,
                    devUnitTestsVisible:        false,
                    devFeatureFilesVisible:     false,
                    designShowAllAsTabs:        false,
                    updateShowAllAsTabs:        false,
                    workShowAllAsTabs:          false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#scopeCol').length, 0, 'Scope is visible');
                chai.assert.equal(item.find('#editCol').length, 0, 'Edit pane is visible');
                chai.assert.equal(item.find('#viewCol').length, 1, 'View pane is not visible');
                chai.assert.equal(item.find('#detailsCol').length, 0, 'Details pane is visible');
                chai.assert.equal(item.find('#workingCol').length, 0, 'Working View is visible');
                chai.assert.equal(item.find('#summaryCol').length, 0, 'Update Summary is visible');
                chai.assert.equal(item.find('#dictCol').length, 1, 'Dictionary is not visible');
                chai.assert.equal(item.find('#tabsCol').length, 0, 'Tabs are visible');
            });
        });

        describe('The Domain Dictionary pane may be hidden for a Design Update', () => {

            it('is not shown in view', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_VIEW;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible:       false,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateProgressVisible:      false,
                    updateSummaryVisible:       false,
                    devAccTestsVisible:         false,
                    devIntTestsVisible:         false,
                    devUnitTestsVisible:        false,
                    devFeatureFilesVisible:     false,
                    designShowAllAsTabs:        false,
                    updateShowAllAsTabs:        false,
                    workShowAllAsTabs:          false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#scopeCol').length, 0, 'Scope is visible');
                chai.assert.equal(item.find('#editCol').length, 0, 'Edit pane is visible');
                chai.assert.equal(item.find('#viewCol').length, 1, 'View pane is not visible');
                chai.assert.equal(item.find('#detailsCol').length, 0, 'Details pane is visible');
                chai.assert.equal(item.find('#workingCol').length, 0, 'Working View is visible');
                chai.assert.equal(item.find('#summaryCol').length, 0, 'Update Summary is visible');
                chai.assert.equal(item.find('#dictCol').length, 0, 'Dictionary is visible');
                chai.assert.equal(item.find('#tabsCol').length, 0, 'Tabs are visible');
            });

            it('is not shown in edit', () => {

                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_UPDATE_EDIT;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible:       false,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateProgressVisible:      false,
                    updateSummaryVisible:       false,
                    devAccTestsVisible:         false,
                    devIntTestsVisible:         false,
                    devUnitTestsVisible:        false,
                    devFeatureFilesVisible:     false,
                    designShowAllAsTabs:        false,
                    updateShowAllAsTabs:        false,
                    workShowAllAsTabs:          false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#scopeCol').length, 1, 'Scope is not visible');
                chai.assert.equal(item.find('#editCol').length, 1, 'Edit pane is not visible');
                chai.assert.equal(item.find('#viewCol').length, 0, 'View pane is visible');
                chai.assert.equal(item.find('#detailsCol').length, 0, 'Details pane is visible');
                chai.assert.equal(item.find('#workingCol').length, 0, 'Working View is visible');
                chai.assert.equal(item.find('#summaryCol').length, 0, 'Update Summary is visible');
                chai.assert.equal(item.find('#dictCol').length, 0, 'Dictionary is visible');
                chai.assert.equal(item.find('#tabsCol').length, 0, 'Tabs are visible');
            });

            it('is not shown in edit with view mode', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_EDIT;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible:       false,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateProgressVisible:      false,
                    updateSummaryVisible:       false,
                    devAccTestsVisible:         false,
                    devIntTestsVisible:         false,
                    devUnitTestsVisible:        false,
                    devFeatureFilesVisible:     false,
                    designShowAllAsTabs:        false,
                    updateShowAllAsTabs:        false,
                    workShowAllAsTabs:          false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#scopeCol').length, 0, 'Scope is visible');
                chai.assert.equal(item.find('#editCol').length, 0, 'Edit pane is visible');
                chai.assert.equal(item.find('#viewCol').length, 1, 'View pane is not visible');
                chai.assert.equal(item.find('#detailsCol').length, 0, 'Details pane is visible');
                chai.assert.equal(item.find('#workingCol').length, 0, 'Working View is visible');
                chai.assert.equal(item.find('#summaryCol').length, 0, 'Update Summary is visible');
                chai.assert.equal(item.find('#dictCol').length, 0, 'Dictionary is visible');
                chai.assert.equal(item.find('#tabsCol').length, 0, 'Tabs are visible');
            });
        });

        describe('The Design Update Summary pane may be shown for a Design Update', () => {

            it('is shown in view', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_VIEW;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible:       false,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateProgressVisible:      false,
                    updateSummaryVisible:       true,
                    devAccTestsVisible:         false,
                    devIntTestsVisible:         false,
                    devUnitTestsVisible:        false,
                    devFeatureFilesVisible:     false,
                    designShowAllAsTabs:        false,
                    updateShowAllAsTabs:        false,
                    workShowAllAsTabs:          false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#scopeCol').length, 0, 'Scope is visible');
                chai.assert.equal(item.find('#editCol').length, 0, 'Edit pane is visible');
                chai.assert.equal(item.find('#viewCol').length, 1, 'View pane is not visible');
                chai.assert.equal(item.find('#detailsCol').length, 0, 'Details pane is visible');
                chai.assert.equal(item.find('#workingCol').length, 0, 'Working View is visible');
                chai.assert.equal(item.find('#summaryCol').length, 1, 'Update Summary is not visible');
                chai.assert.equal(item.find('#dictCol').length, 0, 'Dictionary is visible');
                chai.assert.equal(item.find('#tabsCol').length, 0, 'Tabs are visible');
            });

            it('is shown in edit', () => {

                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_UPDATE_EDIT;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible:       false,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateProgressVisible:      false,
                    updateSummaryVisible:       true,
                    devAccTestsVisible:         false,
                    devIntTestsVisible:         false,
                    devUnitTestsVisible:        false,
                    devFeatureFilesVisible:     false,
                    designShowAllAsTabs:        false,
                    updateShowAllAsTabs:        false,
                    workShowAllAsTabs:          false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#scopeCol').length, 1, 'Scope is not visible');
                chai.assert.equal(item.find('#editCol').length, 1, 'Edit pane is not visible');
                chai.assert.equal(item.find('#viewCol').length, 0, 'View pane is visible');
                chai.assert.equal(item.find('#detailsCol').length, 0, 'Details pane is visible');
                chai.assert.equal(item.find('#workingCol').length, 0, 'Working View is visible');
                chai.assert.equal(item.find('#summaryCol').length, 1, 'Update Summary is not visible');
                chai.assert.equal(item.find('#dictCol').length, 0, 'Dictionary is visible');
                chai.assert.equal(item.find('#tabsCol').length, 0, 'Tabs are visible');
            });

            it('is shown in edit with view mode', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_EDIT;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible:       false,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateProgressVisible:      false,
                    updateSummaryVisible:       true,
                    devAccTestsVisible:         false,
                    devIntTestsVisible:         false,
                    devUnitTestsVisible:        false,
                    devFeatureFilesVisible:     false,
                    designShowAllAsTabs:        false,
                    updateShowAllAsTabs:        false,
                    workShowAllAsTabs:          false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#scopeCol').length, 0, 'Scope is visible');
                chai.assert.equal(item.find('#editCol').length, 0, 'Edit pane is visible');
                chai.assert.equal(item.find('#viewCol').length, 1, 'View pane is not visible');
                chai.assert.equal(item.find('#detailsCol').length, 0, 'Details pane is visible');
                chai.assert.equal(item.find('#workingCol').length, 0, 'Working View is visible');
                chai.assert.equal(item.find('#summaryCol').length, 1, 'Update Summary is not visible');
                chai.assert.equal(item.find('#dictCol').length, 0, 'Dictionary is visible');
                chai.assert.equal(item.find('#tabsCol').length, 0, 'Tabs are visible');
            });
        });

        describe('The Design Update Summary pane may be hidden for a Design Update', () => {

            it('is not shown in view', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_VIEW;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible:       false,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateProgressVisible:      false,
                    updateSummaryVisible:       false,
                    devAccTestsVisible:         false,
                    devIntTestsVisible:         false,
                    devUnitTestsVisible:        false,
                    devFeatureFilesVisible:     false,
                    designShowAllAsTabs:        false,
                    updateShowAllAsTabs:        false,
                    workShowAllAsTabs:          false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#scopeCol').length, 0, 'Scope is visible');
                chai.assert.equal(item.find('#editCol').length, 0, 'Edit pane is visible');
                chai.assert.equal(item.find('#viewCol').length, 1, 'View pane is not visible');
                chai.assert.equal(item.find('#detailsCol').length, 0, 'Details pane is visible');
                chai.assert.equal(item.find('#workingCol').length, 0, 'Working View is visible');
                chai.assert.equal(item.find('#summaryCol').length, 0, 'Update Summary is visible');
                chai.assert.equal(item.find('#dictCol').length, 0, 'Dictionary is visible');
                chai.assert.equal(item.find('#tabsCol').length, 0, 'Tabs are visible');
            });

            it('is not shown in edit', () => {

                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_UPDATE_EDIT;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible:       false,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateProgressVisible:      false,
                    updateSummaryVisible:       false,
                    devAccTestsVisible:         false,
                    devIntTestsVisible:         false,
                    devUnitTestsVisible:        false,
                    devFeatureFilesVisible:     false,
                    designShowAllAsTabs:        false,
                    updateShowAllAsTabs:        false,
                    workShowAllAsTabs:          false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#scopeCol').length, 1, 'Scope is not visible');
                chai.assert.equal(item.find('#editCol').length, 1, 'Edit pane is not visible');
                chai.assert.equal(item.find('#viewCol').length, 0, 'View pane is visible');
                chai.assert.equal(item.find('#detailsCol').length, 0, 'Details pane is visible');
                chai.assert.equal(item.find('#workingCol').length, 0, 'Working View is visible');
                chai.assert.equal(item.find('#summaryCol').length, 0, 'Update Summary is visible');
                chai.assert.equal(item.find('#dictCol').length, 0, 'Dictionary is visible');
                chai.assert.equal(item.find('#tabsCol').length, 0, 'Tabs are visible');
            });

            it('is not shown in edit with view mode', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_EDIT;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible:       false,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateProgressVisible:      false,
                    updateSummaryVisible:       false,
                    devAccTestsVisible:         false,
                    devIntTestsVisible:         false,
                    devUnitTestsVisible:        false,
                    devFeatureFilesVisible:     false,
                    designShowAllAsTabs:        false,
                    updateShowAllAsTabs:        false,
                    workShowAllAsTabs:          false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#scopeCol').length, 0, 'Scope is visible');
                chai.assert.equal(item.find('#editCol').length, 0, 'Edit pane is visible');
                chai.assert.equal(item.find('#viewCol').length, 1, 'View pane is not visible');
                chai.assert.equal(item.find('#detailsCol').length, 0, 'Details pane is visible');
                chai.assert.equal(item.find('#workingCol').length, 0, 'Working View is visible');
                chai.assert.equal(item.find('#summaryCol').length, 0, 'Update Summary is visible');
                chai.assert.equal(item.find('#dictCol').length, 0, 'Dictionary is visible');
                chai.assert.equal(item.find('#tabsCol').length, 0, 'Tabs are visible');
            });
        });

        describe('The working Design Version pane may be shown for a Design Update', () => {

            it('is shown in view', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_VIEW;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible:       false,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateProgressVisible:      true,
                    updateSummaryVisible:       false,
                    devAccTestsVisible:         false,
                    devIntTestsVisible:         false,
                    devUnitTestsVisible:        false,
                    devFeatureFilesVisible:     false,
                    designShowAllAsTabs:        false,
                    updateShowAllAsTabs:        false,
                    workShowAllAsTabs:          false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#scopeCol').length, 0, 'Scope is visible');
                chai.assert.equal(item.find('#editCol').length, 0, 'Edit pane is visible');
                chai.assert.equal(item.find('#viewCol').length, 1, 'View pane is not visible');
                chai.assert.equal(item.find('#detailsCol').length, 0, 'Details pane is visible');
                chai.assert.equal(item.find('#workingCol').length, 1, 'Working View is not visible');
                chai.assert.equal(item.find('#summaryCol').length, 0, 'Update Summary is visible');
                chai.assert.equal(item.find('#dictCol').length, 0, 'Dictionary is visible');
                chai.assert.equal(item.find('#tabsCol').length, 0, 'Tabs are visible');
            });

            it('is shown in edit', () => {

                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_UPDATE_EDIT;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible:       false,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateProgressVisible:      true,
                    updateSummaryVisible:       false,
                    devAccTestsVisible:         false,
                    devIntTestsVisible:         false,
                    devUnitTestsVisible:        false,
                    devFeatureFilesVisible:     false,
                    designShowAllAsTabs:        false,
                    updateShowAllAsTabs:        false,
                    workShowAllAsTabs:          false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#scopeCol').length, 1, 'Scope is not visible');
                chai.assert.equal(item.find('#editCol').length, 1, 'Edit pane is not visible');
                chai.assert.equal(item.find('#viewCol').length, 0, 'View pane is visible');
                chai.assert.equal(item.find('#detailsCol').length, 0, 'Details pane is visible');
                chai.assert.equal(item.find('#workingCol').length, 1, 'Working View is not visible');
                chai.assert.equal(item.find('#summaryCol').length, 0, 'Update Summary is visible');
                chai.assert.equal(item.find('#dictCol').length, 0, 'Dictionary is visible');
                chai.assert.equal(item.find('#tabsCol').length, 0, 'Tabs are visible');
            });

            it('is shown in edit with view mode', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_EDIT;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible:       false,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateProgressVisible:      true,
                    updateSummaryVisible:       false,
                    devAccTestsVisible:         false,
                    devIntTestsVisible:         false,
                    devUnitTestsVisible:        false,
                    devFeatureFilesVisible:     false,
                    designShowAllAsTabs:        false,
                    updateShowAllAsTabs:        false,
                    workShowAllAsTabs:          false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#scopeCol').length, 0, 'Scope is visible');
                chai.assert.equal(item.find('#editCol').length, 0, 'Edit pane is visible');
                chai.assert.equal(item.find('#viewCol').length, 1, 'View pane is not visible');
                chai.assert.equal(item.find('#detailsCol').length, 0, 'Details pane is visible');
                chai.assert.equal(item.find('#workingCol').length, 1, 'Working View is not visible');
                chai.assert.equal(item.find('#summaryCol').length, 0, 'Update Summary is visible');
                chai.assert.equal(item.find('#dictCol').length, 0, 'Dictionary is visible');
                chai.assert.equal(item.find('#tabsCol').length, 0, 'Tabs are visible');
            });
        });

        describe('The working Design Version pane may be hidden for a Design Update', () => {

            it('is not shown in view', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_VIEW;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible:       false,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateProgressVisible:      false,
                    updateSummaryVisible:       false,
                    devAccTestsVisible:         false,
                    devIntTestsVisible:         false,
                    devUnitTestsVisible:        false,
                    devFeatureFilesVisible:     false,
                    designShowAllAsTabs:        false,
                    updateShowAllAsTabs:        false,
                    workShowAllAsTabs:          false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#scopeCol').length, 0, 'Scope is visible');
                chai.assert.equal(item.find('#editCol').length, 0, 'Edit pane is visible');
                chai.assert.equal(item.find('#viewCol').length, 1, 'View pane is not visible');
                chai.assert.equal(item.find('#detailsCol').length, 0, 'Details pane is visible');
                chai.assert.equal(item.find('#workingCol').length, 0, 'Working View is visible');
                chai.assert.equal(item.find('#summaryCol').length, 0, 'Update Summary is visible');
                chai.assert.equal(item.find('#dictCol').length, 0, 'Dictionary is visible');
                chai.assert.equal(item.find('#tabsCol').length, 0, 'Tabs are visible');
            });

            it('is not shown in edit', () => {

                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_UPDATE_EDIT;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible:       false,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateProgressVisible:      false,
                    updateSummaryVisible:       false,
                    devAccTestsVisible:         false,
                    devIntTestsVisible:         false,
                    devUnitTestsVisible:        false,
                    devFeatureFilesVisible:     false,
                    designShowAllAsTabs:        false,
                    updateShowAllAsTabs:        false,
                    workShowAllAsTabs:          false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#scopeCol').length, 1, 'Scope is not visible');
                chai.assert.equal(item.find('#editCol').length, 1, 'Edit pane is not visible');
                chai.assert.equal(item.find('#viewCol').length, 0, 'View pane is visible');
                chai.assert.equal(item.find('#detailsCol').length, 0, 'Details pane is visible');
                chai.assert.equal(item.find('#workingCol').length, 0, 'Working View is visible');
                chai.assert.equal(item.find('#summaryCol').length, 0, 'Update Summary is visible');
                chai.assert.equal(item.find('#dictCol').length, 0, 'Dictionary is visible');
                chai.assert.equal(item.find('#tabsCol').length, 0, 'Tabs are visible');
            });

            it('is not shown in edit with view mode', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_EDIT;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    designDetailsVisible:       false,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateProgressVisible:      false,
                    updateSummaryVisible:       false,
                    devAccTestsVisible:         false,
                    devIntTestsVisible:         false,
                    devUnitTestsVisible:        false,
                    devFeatureFilesVisible:     false,
                    designShowAllAsTabs:        false,
                    updateShowAllAsTabs:        false,
                    workShowAllAsTabs:          false,
                };

                const item = testLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#scopeCol').length, 0, 'Scope is visible');
                chai.assert.equal(item.find('#editCol').length, 0, 'Edit pane is visible');
                chai.assert.equal(item.find('#viewCol').length, 1, 'View pane is not visible');
                chai.assert.equal(item.find('#detailsCol').length, 0, 'Details pane is visible');
                chai.assert.equal(item.find('#workingCol').length, 0, 'Working View is visible');
                chai.assert.equal(item.find('#summaryCol').length, 0, 'Update Summary is visible');
                chai.assert.equal(item.find('#dictCol').length, 0, 'Dictionary is visible');
                chai.assert.equal(item.find('#tabsCol').length, 0, 'Tabs are visible');
            });
        });

        describe('The width of each Design Update pane changes to accommodate the number of panes displayed', () => {

            // View mode ---------------------------------------------------------------------------------------------------

            // Layout is UPDATE | TEXT (o) | PROGRESS (o) | SUMMARY (o) | DICT (o)
            // or UPDATE + TEST SUMMARY | TEXT (o) | PROGRESS (o) | SUMMARY (o) | DICT (o)

            it('view: VIEW:  6 ', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_VIEW;

                const viewOptions = {
                    designDetailsVisible:       false,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateSummaryVisible:       false,
                    updateProgressVisible:      false
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 6, 'Expecting width 6 for Update view');
            });

            it('view: VIEW + TEST SUMM:  12 ', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_VIEW;

                const viewOptions = {
                    designDetailsVisible:       false,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         true,
                    updateSummaryVisible:       false,
                    updateProgressVisible:      false
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 12, 'Expecting width 12 for Update view with test summary');
            });

            it('view: VIEW | DETAILS:  6 | 6 ', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_VIEW;

                const viewOptions = {
                    designDetailsVisible:       true,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateSummaryVisible:       false,
                    updateProgressVisible:      false
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 6, 'Expecting width 6 for Update view');
                chai.assert.equal(widths.col2width, 6, 'Expecting width 6 for Update details');
            });

            it('view: VIEW + TEST SUMM | DETAILS:  8 | 4 ', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_VIEW;

                const viewOptions = {
                    designDetailsVisible:       true,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         true,
                    updateSummaryVisible:       false,
                    updateProgressVisible:      false
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 8, 'Expecting width 8 for Update view');
                chai.assert.equal(widths.col2width, 4, 'Expecting width 4 for Update details');
            });

            it('view: VIEW | DETAILS | WORKING :  4 | 4 | 4 ', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_VIEW;

                const viewOptions = {
                    designDetailsVisible:       true,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateSummaryVisible:       false,
                    updateProgressVisible:      true
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 4, 'Expecting width 4 for Update view');
                chai.assert.equal(widths.col2width, 4, 'Expecting width 4 for Update details');
                chai.assert.equal(widths.col3width, 4, 'Expecting width 4 for Update progress');
            });

            it('view: VIEW + TEST SUMM | DETAILS | WORKING:  6 | 3 | 3 ', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_VIEW;

                const viewOptions = {
                    designDetailsVisible:       true,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         true,
                    updateSummaryVisible:       false,
                    updateProgressVisible:      true
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 6, 'Expecting width 6 for Update view with test summ');
                chai.assert.equal(widths.col2width, 3, 'Expecting width 3 for Update details with test summ');
                chai.assert.equal(widths.col3width, 3, 'Expecting width 3 for Update progress with test summ');
            });

            it('view: VIEW | DETAILS | WORKING | SUMMARY :  3 | 3 | 3 | 3 ', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_VIEW;

                const viewOptions = {
                    designDetailsVisible:       true,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateSummaryVisible:       true,
                    updateProgressVisible:      true
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 3, 'Expecting width 3 for Update view');
                chai.assert.equal(widths.col2width, 3, 'Expecting width 3 for Update details');
                chai.assert.equal(widths.col3width, 3, 'Expecting width 3 for Update progress');
                chai.assert.equal(widths.col4width, 3, 'Expecting width 3 for Update summary');
            });

            it('view: VIEW + TEST SUMM | DETAILS | WORKING | SUMMARY:  6 | 2 | 2 | 2', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_VIEW;

                const viewOptions = {
                    designDetailsVisible:       true,
                    designDomainDictVisible:    false,
                    testSummaryVisible:   true,
                    updateSummaryVisible:       true,
                    updateProgressVisible:      true
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 6, 'Expecting width 6 for Update view with test summ');
                chai.assert.equal(widths.col2width, 2, 'Expecting width 2 for Update details with test summ');
                chai.assert.equal(widths.col3width, 2, 'Expecting width 2 for Update progress with test summ');
                chai.assert.equal(widths.col4width, 2, 'Expecting width 2 for Update summary with test summ');
            });

            it('view: VIEW | DETAILS | WORKING | SUMMARY | DICT :  3 | 2 | 2 | 3 | 2', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_VIEW;

                const viewOptions = {
                    designDetailsVisible:       true,
                    designDomainDictVisible:    true,
                    testSummaryVisible:         false,
                    updateSummaryVisible:       true,
                    updateProgressVisible:      true
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 3, 'Expecting width 3 for Update view');
                chai.assert.equal(widths.col2width, 2, 'Expecting width 2 for Update details');
                chai.assert.equal(widths.col3width, 2, 'Expecting width 2 for Update progress');
                chai.assert.equal(widths.col4width, 3, 'Expecting width 3 for Update summary');
                chai.assert.equal(widths.col5width, 2, 'Expecting width 2 for Update dictionary');
            });

            it('view: VIEW + TEST SUMM | DETAILS | WORKING | SUMMARY | DICT :  4 | 2 | 2 | 2 | 2', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_VIEW;

                const viewOptions = {
                    designDetailsVisible:       true,
                    designDomainDictVisible:    true,
                    testSummaryVisible:   true,
                    updateSummaryVisible:       true,
                    updateProgressVisible:      true
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 4, 'Expecting width 4 for Update view with test summ');
                chai.assert.equal(widths.col2width, 2, 'Expecting width 2 for Update details with test summ');
                chai.assert.equal(widths.col3width, 2, 'Expecting width 2 for Update progress with test summ');
                chai.assert.equal(widths.col4width, 2, 'Expecting width 2 for Update summary with test summ');
                chai.assert.equal(widths.col5width, 2, 'Expecting width 2 for Update dictionary with test summ');
            });

            // Edit mode ---------------------------------------------------------------------------------------------------

            // Layout is SCOPE | UPDATE | TEXT (o) | DV PROGRESS (o) | SUMMARY (o)  | DICT (o)

            it('edit: SCOPE | EDIT:  6 | 6', () => {

                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_UPDATE_EDIT;

                const viewOptions = {
                    designDetailsVisible:       false,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateSummaryVisible:       false,
                    updateProgressVisible:      false
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 6, 'Expecting width 6 for Update scope');
                chai.assert.equal(widths.col2width, 6, 'Expecting width 6 for Update editor');
            });

            it('edit: SCOPE + TEST SUMM | EDIT:  7 | 5 ', () => {

                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_UPDATE_EDIT;

                const viewOptions = {
                    designDetailsVisible:       false,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         true,
                    updateSummaryVisible:       false,
                    updateProgressVisible:      false
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 7, 'Expecting width 7 for Update scope with test summ');
                chai.assert.equal(widths.col2width, 5, 'Expecting width 5 for Update editor with test summ');
            });

            it('edit: SCOPE | EDIT | DETAILS:  4 | 4 | 4', () => {

                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_UPDATE_EDIT;

                const viewOptions = {
                    designDetailsVisible:       true,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateSummaryVisible:       false,
                    updateProgressVisible:      false
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 4, 'Expecting width 4 for Update scope');
                chai.assert.equal(widths.col2width, 4, 'Expecting width 4 for Update editor');
                chai.assert.equal(widths.col3width, 4, 'Expecting width 4 for Update details');
            });

            it('edit: VIEW + TEST SUMM | EDIT | DETAILS:  6 | 3 | 3', () => {

                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_UPDATE_EDIT;

                const viewOptions = {
                    designDetailsVisible:       true,
                    designDomainDictVisible:    false,
                    testSummaryVisible:   true,
                    updateSummaryVisible:       false,
                    updateProgressVisible:      false
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 6, 'Expecting width 6 for Update scope with test summ');
                chai.assert.equal(widths.col2width, 3, 'Expecting width 3 for Update editor with test summ');
                chai.assert.equal(widths.col3width, 3, 'Expecting width 3 for Update details with test summ');
            });

            it('edit: SCOPE | EDIT | DETAILS | WORKING:  3 | 3 | 3 | 3', () => {

                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_UPDATE_EDIT;

                const viewOptions = {
                    designDetailsVisible:       true,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateSummaryVisible:       false,
                    updateProgressVisible:      true
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 3, 'Expecting width 3 for Update scope');
                chai.assert.equal(widths.col2width, 3, 'Expecting width 3 for Update editor');
                chai.assert.equal(widths.col3width, 3, 'Expecting width 3 for Update details');
                chai.assert.equal(widths.col4width, 3, 'Expecting width 3 for Update progress');
            });

            it('edit: VIEW + TEST SUMM | EDIT | DETAILS | WORKING:  6 | 2 | 2 | 2', () => {

                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_UPDATE_EDIT;

                const viewOptions = {
                    designDetailsVisible:       true,
                    designDomainDictVisible:    false,
                    testSummaryVisible:   true,
                    updateSummaryVisible:       false,
                    updateProgressVisible:      true
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 6, 'Expecting width 6 for Update scope with test summ');
                chai.assert.equal(widths.col2width, 2, 'Expecting width 2 for Update editor with test summ');
                chai.assert.equal(widths.col3width, 2, 'Expecting width 2 for Update details with test summ');
                chai.assert.equal(widths.col4width, 2, 'Expecting width 2 for Update progress with test summ');
            });

            it('edit: SCOPE | EDIT | DETAILS | WORKING | SUMMARY:  2 | 3 | 2 | 2 | 3', () => {

                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_UPDATE_EDIT;

                const viewOptions = {
                    designDetailsVisible:       true,
                    designDomainDictVisible:    false,
                    testSummaryVisible:   false,
                    updateSummaryVisible:       true,
                    updateProgressVisible:      true
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 2, 'Expecting width 2 for Update scope');
                chai.assert.equal(widths.col2width, 3, 'Expecting width 3 for Update editor');
                chai.assert.equal(widths.col3width, 2, 'Expecting width 2 for Update details');
                chai.assert.equal(widths.col4width, 2, 'Expecting width 2 for Update progress');
                chai.assert.equal(widths.col5width, 3, 'Expecting width 3 for Update summary');
            });

            it('edit: VIEW + TEST SUMM | EDIT | DETAILS | WORKING | SUMMARY:  4 | 2 | 2 | 2 | 2', () => {

                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_UPDATE_EDIT;

                const viewOptions = {
                    designDetailsVisible:       true,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         true,
                    updateSummaryVisible:       true,
                    updateProgressVisible:      true
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 4, 'Expecting width 4 for Update scope with test summ');
                chai.assert.equal(widths.col2width, 2, 'Expecting width 2 for Update editor with test summ');
                chai.assert.equal(widths.col3width, 2, 'Expecting width 2 for Update details with test summ');
                chai.assert.equal(widths.col4width, 2, 'Expecting width 2 for Update progress with test summ');
                chai.assert.equal(widths.col5width, 2, 'Expecting width 2 for Update summary with test summ');
            });

            it('edit: SCOPE | EDIT | DETAILS | WORKING | SUMMARY | DICT:  2 | 2 | 2 | 2 | 2 | 2', () => {

                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_UPDATE_EDIT;

                const viewOptions = {
                    designDetailsVisible:       true,
                    designDomainDictVisible:    true,
                    testSummaryVisible:         false,
                    updateSummaryVisible:       true,
                    updateProgressVisible:      true
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 2, 'Expecting width 2 for Update scope');
                chai.assert.equal(widths.col2width, 2, 'Expecting width 2 for Update editor');
                chai.assert.equal(widths.col3width, 2, 'Expecting width 2 for Update details');
                chai.assert.equal(widths.col4width, 2, 'Expecting width 2 for Update progress');
                chai.assert.equal(widths.col5width, 2, 'Expecting width 2 for Update summary');
                chai.assert.equal(widths.col6width, 2, 'Expecting width 2 for Update dictionary');
            });

            it('edit: VIEW + TEST SUMM | EDIT | DETAILS | WORKING | SUMMARY | DICT:  2 | 2 | 2 | 2 | 2 | 2', () => {

                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_UPDATE_EDIT;

                const viewOptions = {
                    designDetailsVisible:       true,
                    designDomainDictVisible:    true,
                    testSummaryVisible:         true,
                    updateSummaryVisible:       true,
                    updateProgressVisible:      true
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 2, 'Expecting width 2 for Update scope with test summ');
                chai.assert.equal(widths.col2width, 2, 'Expecting width 2 for Update editor with test summ');
                chai.assert.equal(widths.col3width, 2, 'Expecting width 2 for Update details with test summ');
                chai.assert.equal(widths.col4width, 2, 'Expecting width 2 for Update progress with test summ');
                chai.assert.equal(widths.col5width, 2, 'Expecting width 2 for Update summary with test summ');
                chai.assert.equal(widths.col6width, 2, 'Expecting width 2 for Update dictionary with test summ');
            });

            it('edit: All As Tabs: 4 | 4 | 4', () => {

                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_UPDATE_EDIT;

                const viewOptions = {
                    designDetailsVisible:       false,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         false,
                    updateSummaryVisible:       false,
                    updateProgressVisible:      false,
                    updateShowAllAsTabs:        true
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 4, 'Expecting width 4 for Update scope');
                chai.assert.equal(widths.col2width, 4, 'Expecting width 4 for Update editor');
                chai.assert.equal(widths.col3width, 4, 'Expecting width 4 for Update tabs col');
            });

            it('edit: All As Tabs with Test Summary: 6 | 3 | 3', () => {

                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_UPDATE_EDIT;

                const viewOptions = {
                    designDetailsVisible:       false,
                    designDomainDictVisible:    false,
                    testSummaryVisible:         true,
                    updateSummaryVisible:       false,
                    updateProgressVisible:      false,
                    updateShowAllAsTabs:        true
                };

                const widths = testColumnWidths(view, mode, viewOptions);

                chai.assert.equal(widths.col1width, 6, 'Expecting width 6 for Update scope with test summ');
                chai.assert.equal(widths.col2width, 3, 'Expecting width 3 for Update editor with test summ');
                chai.assert.equal(widths.col3width, 3, 'Expecting width 3 for Update tabs col with test summ');
            });

        });

    });


    describe('ADD COMPONENTS', () => {

        describe('A Design Version has an option to add a new Application to it', () => {

            it('add application visible in edit mode', () => {

                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_NEW;

                const item = testAddComponent(view, mode, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#addApplication').length, 1, 'Add application not found');
            });

            it('add application not visible in view mode', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_NEW;

                const item = testAddComponent(view, mode, DEFAULT_DV_CONTEXT);

                chai.assert.equal(item.find('#addApplication').length, 0, 'Add application found');
            });
        });

        describe('There is an option to add a new Application in the Design Update editor', () => {

            it('has an add application in edit mode', () => {

                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_UPDATE_EDIT;

                const item = testAddComponent(view, mode, DEFAULT_DU_CONTEXT);

                chai.assert.equal(item.find('#addApplication').length, 1, 'Add application not found');
            });

            it('has no add application in view mode', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_EDIT;

                const item = testAddComponent(view, mode, DEFAULT_DU_CONTEXT);

                chai.assert.equal(item.find('#addApplication').length, 0, 'Add application found');
            });

            it('has no add application when viewing', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_VIEW;

                const item = testAddComponent(view, mode, DEFAULT_DU_CONTEXT);

                chai.assert.equal(item.find('#addApplication').length, 0, 'Add application found');
            });
        });
    });

    describe('UC 440', () => {

        describe('There is a Find Scenario option when editing or viewing a Design Version', () => {

            it('has a find scenario tab when viewing new', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_NEW;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    testSummaryVisible:         false,
                    designShowAllAsTabs:        true
                };

                const html = testTabsLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(html.find(hashID(UITab.TAB_SCENARIO_SEARCH, '')).length, 1, 'Search tab not found');
            });

            it('has a find scenario tab when editing new', () => {

                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_NEW;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    testSummaryVisible:         false,
                    designShowAllAsTabs:        true
                };

                const html = testTabsLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(html.find(hashID(UITab.TAB_SCENARIO_SEARCH, '')).length, 1, 'Search tab not found');
            });

            it('has a find scenario tab when viewing published', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_PUBLISHED;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    testSummaryVisible:         false,
                    designShowAllAsTabs:        true
                };

                const html = testTabsLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(html.find(hashID(UITab.TAB_SCENARIO_SEARCH, '')).length, 1, 'Search tab not found');
            });

            it('has a find scenario tab when editing published', () => {

                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_PUBLISHED;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    testSummaryVisible:         false,
                    designShowAllAsTabs:        true
                };

                const html = testTabsLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(html.find(hashID(UITab.TAB_SCENARIO_SEARCH, '')).length, 1, 'Search tab not found');
            });

            it('has a find scenario tab when viewing updatable', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATABLE;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    testSummaryVisible:         false,
                    designShowAllAsTabs:        true
                };

                const html = testTabsLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(html.find(hashID(UITab.TAB_SCENARIO_SEARCH, '')).length, 1, 'Search tab not found');
            });

            it('has a find scenario tab when editing updatable', () => {

                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_UPDATABLE;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    testSummaryVisible:         false,
                    designShowAllAsTabs:        true
                };

                const html = testTabsLayout(view, mode, userRole, viewOptions, DEFAULT_DV_CONTEXT);

                chai.assert.equal(html.find(hashID(UITab.TAB_SCENARIO_SEARCH, '')).length, 1, 'Search tab not found');
            });
        });

        describe('There is a Find Scenario option when editing a Design Update', () => {

            it('has a find scenario tab when view update', () => {

                const mode = ViewMode.MODE_VIEW;
                const view = ViewType.DESIGN_UPDATE_VIEW;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    testSummaryVisible:         false,
                    updateShowAllAsTabs:        true
                };

                const html = testTabsLayout(view, mode, userRole, viewOptions, DEFAULT_DU_CONTEXT);

                chai.assert.equal(html.find(hashID(UITab.TAB_SCENARIO_SEARCH, '')).length, 1, 'Search tab not found');
            });

            it('has a find scenario tab when editing update', () => {

                const mode = ViewMode.MODE_EDIT;
                const view = ViewType.DESIGN_UPDATE_EDIT;
                const userRole = RoleType.DESIGNER;

                const viewOptions = {
                    testSummaryVisible:         false,
                    updateShowAllAsTabs:        true
                };

                const html = testTabsLayout(view, mode, userRole, viewOptions, DEFAULT_DU_CONTEXT);

                chai.assert.equal(html.find(hashID(UITab.TAB_SCENARIO_SEARCH, '')).length, 1, 'Search tab not found');
            });
        });
    });
});