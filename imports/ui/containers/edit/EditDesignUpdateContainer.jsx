// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import DesignEditorHeader           from '../../components/common/DesignEditorHeader.jsx';
import DesignEditorFooter           from '../../components/common/DesignEditorFooter.jsx';
import DesignComponentTarget        from '../../components/edit/DesignComponentTarget.jsx';
import DesignComponentAdd           from '../../components/common/DesignComponentAdd.jsx';
import DesignComponentTextContainer from './DesignComponentTextContainer.jsx';
import DomainDictionaryContainer    from './DomainDictionaryContainer.jsx';
import DesignUpdateSummaryContainer from '../summary/UpdateSummaryContainer.jsx';
import ScenarioFinder               from '../../components/search/ScenarioFinder.jsx';

// Ultrawide Services
import { ViewType, ViewMode, DisplayContext, LogLevel } from '../../../constants/constants.js';
import {AddActionIds}                       from "../../../constants/ui_context_ids.js";
import { log }                              from '../../../common/utils.js';

import ClientDesignUpdateComponentServices  from '../../../apiClient/apiClientDesignUpdateComponent.js';
import ClientDesignVersionServices          from '../../../apiClient/apiClientDesignVersion.js'
import ClientDataServices                   from '../../../apiClient/apiClientDataServices.js';
import ClientUserSettingsServices           from '../../../apiClient/apiClientUserSettings.js';

// Bootstrap
import {Grid, Row, Col, Tabs, Tab} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Update Editor Container. This contains a mix of the Base Design Version and th Design Update
//
// ---------------------------------------------------------------------------------------------------------------------

// Export for unit testing
export class UpdateApplicationsList extends Component {
    constructor(props) {
        super(props);

    }

    onAddApplication(view, mode, designVersionId, designUpdateId){

        // Add a new application to the design update
        ClientDesignUpdateComponentServices.addApplicationToDesignVersion(view, mode, designVersionId, designUpdateId);

    }

    getEditorClass(){
        return ClientUserSettingsServices.getWindowSizeClassForDesignEditor();
    }

    getDesignUpdateItem(application, displayContext, designUpdateId){
        switch(displayContext){
            case  DisplayContext.WORKING_VIEW:
                return ClientDesignVersionServices.getDesignUpdateItemForUpdatableVersion(application);
            case DisplayContext.UPDATE_SCOPE:
                // See if this item is in scope - i.e. in the DU
                return ClientDesignVersionServices.getDesignUpdateItemForUpdate(application, designUpdateId);
            default:
                return application;
        }
    }

    // A list of top level applications in the design version for the scope
    renderScopeApplications(baseApplications, displayContext, view, mode, userContext, testSummary) {
        return baseApplications.map((application) => {
            // All applications are shown
            return (
                <DesignComponentTarget
                    key={application._id}
                    currentItem={application}
                    updateItem={this.getDesignUpdateItem(application, displayContext, userContext.designUpdateId)}
                    wpItem={null}
                    displayContext={displayContext}
                    view={view}
                    mode={mode}
                    testSummary={testSummary}
                />
            );
        });
    }

    // A list of top level applications in the design update
    renderUpdateApplications(updateApplications, context, view, mode, testSummary) {
        return updateApplications.map((application) => {
            // All applications are shown even in update edit view even if not in scope so that new items can be added to them
            return (
                <DesignComponentTarget
                    key={application._id}
                    currentItem={application}
                    updateItem={application}
                    wpItem={null}
                    displayContext={context}
                    view={view}
                    mode={mode}
                    testSummary={testSummary}
                />
            );

        });
    }

    // A list of top level applications in the working design version
    renderWorkingVersionApplications(workingApplications, context, view, mode, testSummary) {
        //console.log("RENDER TARGET for  " + workingApplications.length + " apps ");
        return workingApplications.map((application) => {
            // All applications are shown even in update edit view even if not in scope so that new items can be added to them
            return (
                <DesignComponentTarget
                    key={application._id}
                    currentItem={application}
                    updateItem={null}
                    wpItem={null}
                    displayContext={context}
                    view={view}
                    mode={mode}
                    testSummary={testSummary}
                />
            );

        });
    }

    render() {

        const {baseApplications, updateApplications, workingApplications, userContext, view, mode, viewOptions} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Edit Design Update');

        // Items -------------------------------------------------------------------------------------------------------

        let addComponent = '';

        // Get correct window height
        const editorClass = this.getEditorClass();

        if (mode === ViewMode.MODE_EDIT) {
            // Editing so include the Add Application
            addComponent =
                <table>
                    <tbody>
                    <tr>
                        <td id="addApplication" className="control-table-data-app">
                            <DesignComponentAdd
                                uiContextId={AddActionIds.UI_CONTEXT_ADD_APPLICATION}
                                addText="Add Application"
                                onClick={ () => this.onAddApplication(view, mode, userContext.designVersionId, userContext.designUpdateId)}
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
        }

        // Scope for Design Update
        let updateScopeComponent =
            <div id="scopePane" className="design-editor-container">
                <DesignEditorHeader
                    displayContext={DisplayContext.UPDATE_SCOPE}
                />
                <div className={editorClass}>
                    {this.renderScopeApplications(baseApplications, DisplayContext.UPDATE_SCOPE, view, mode, userContext, viewOptions.testSummaryVisible)}
                </div>
                <DesignEditorFooter
                    displayContext={DisplayContext.UPDATE_SCOPE}
                    hasDesignSummary={false}
                />
            </div>;

        // Edit for Design Update
        let updateEditComponent = '';
        if(updateApplications) {
            updateEditComponent =
                <div id="editorPaneEdit" className="design-editor-container">
                    <DesignEditorHeader
                        displayContext={DisplayContext.UPDATE_EDIT}
                    />
                    <div className={editorClass}>
                        {this.renderUpdateApplications(updateApplications, DisplayContext.UPDATE_EDIT, view, mode, false)}
                        {addComponent}
                    </div>
                    <DesignEditorFooter
                        displayContext={DisplayContext.UPDATE_EDIT}
                        hasDesignSummary={false}
                    />
                </div>;
        } else {
            updateEditComponent =
                <div id="editorPaneEdit" className="design-editor-container">
                    <DesignEditorHeader
                        displayContext={DisplayContext.UPDATE_EDIT}
                    />
                    <div className={editorClass}>
                        {addComponent}
                    </div>
                    <DesignEditorFooter
                        displayContext={DisplayContext.UPDATE_EDIT}
                        hasDesignSummary={false}
                    />
                </div>;
        }

        // View Design Update Content
        let updateViewComponent =
            <div id="editorPaneView" className="design-editor-container">
                <DesignEditorHeader
                    displayContext={DisplayContext.UPDATE_VIEW}
                />
                <div className={editorClass}>
                    {this.renderUpdateApplications(updateApplications, DisplayContext.UPDATE_VIEW, view, mode, viewOptions.testSummaryVisible)}
                </div>
                <DesignEditorFooter
                    displayContext={DisplayContext.UPDATE_VIEW}
                    hasDesignSummary={false}
                />
            </div>;

        // View Working Design Version
        let workingVersionComponent =
            <div id="editorPaneWorking" className="design-editor-container">
                <DesignEditorHeader
                    displayContext={DisplayContext.WORKING_VIEW}
                />
                <div className={editorClass}>
                    {this.renderWorkingVersionApplications(workingApplications, DisplayContext.WORKING_VIEW, view, mode, false)}
                </div>
                <DesignEditorFooter
                    displayContext={DisplayContext.WORKING_VIEW}
                    hasDesignSummary={false}
                />
            </div>;

        // Text / Scenario Steps for Design Update - Editable
        let updateTextComponent =
            <div id="detailsPaneEdit">
                <DesignComponentTextContainer params={{
                    currentContext: userContext,
                    view: view,
                    displayContext: DisplayContext.UPDATE_EDIT
                }}/>
            </div>;

        // Text / Scenario Steps for Design Update - Read Only
        let updateViewTextComponent =
            <div id="detailsPaneView" >
                <DesignComponentTextContainer params={{
                    currentContext: userContext,
                    view: view,
                    displayContext: DisplayContext.UPDATE_VIEW
                }}/>
            </div>;

        // Domain Dictionary
        let domainDictionary =
            <div id="domainDictionary">
                <DomainDictionaryContainer params={{
                    designId: userContext.designId,
                    designVersionId: userContext.designVersionId
                }}/>
            </div>;

        // Design Update Summary
        let updateSummary =
            <div id="updateSummary">
                <DesignUpdateSummaryContainer params={{
                    userContext: userContext
                }}/>
            </div>;

        // The scenario finder here will locate stuff in the update scope
        const scenarioFinder =
            <ScenarioFinder
                displayContext={DisplayContext.UPDATE_SCOPE}
            />;

        // Layout ------------------------------------------------------------------------------------------------------
        let layout = '';

        // Start by assuming only 2 cols - scope and update
        let displayedItems = 0;
        let col1width = 6;
        let col2width = 6;
        let col3width = 6;
        let col4width = 6;
        let col5width = 6;
        let col6width = 6;


        // Create the layout depending on the current view...


        if(view === ViewType.DESIGN_UPDATE_EDIT && mode === ViewMode.MODE_EDIT){
            // Editable DU

            // Layout is SCOPE | UPDATE | TEXT (o) | DV PROGRESS (o) | SUMMARY (o)  | DICT (o)

            displayedItems = 2;

            if(viewOptions.updateShowAllAsTabs){

                if(viewOptions.testSummaryVisible){
                    col1width = 6;
                    col2width = 3;
                    col3width = 3;
                } else {
                    col1width = 4;
                    col2width = 4;
                    col3width = 4;
                }

                let col1 =
                    <Col id="scopeCol" md={col1width} className="close-col">
                        {updateScopeComponent}
                    </Col>;


                let col2 =
                    <Col id="editCol" md={col2width} className="close-col">
                        {updateEditComponent}
                    </Col>;


                let col3 =
                    <Col id="tabsCol" md={col3width} className="close-col">
                        <Tabs className="top-tabs" defaultActiveKey={1} id="updatable-view_tabs">
                            <Tab eventKey={1} title="DETAILS">{updateTextComponent}</Tab>
                            <Tab eventKey={2} title="WORKING VIEW">{workingVersionComponent}</Tab>
                            <Tab eventKey={3} title="SUMMARY">{updateSummary}</Tab>
                            <Tab eventKey={4} title="DICTIONARY">{domainDictionary}</Tab>
                            <Tab eventKey={5} title="FIND SCENARIO">{scenarioFinder}</Tab>
                        </Tabs>
                    </Col>;

                layout =
                    <Grid >
                        <Row>
                            {col1}
                            {col2}
                            {col3}
                        </Row>
                    </Grid>;
            } else {

                if (viewOptions.designDetailsVisible) {

                    // There are now 3 cols so change widths
                    col1width = 4;
                    col2width = 4;
                    col3width = 4;
                    col4width = 4;
                    col5width = 4;
                    col6width = 4;

                    displayedItems++;
                }

                if (viewOptions.updateProgressVisible) {

                    switch (displayedItems) {
                        case 2:
                            // There are now 3 cols so change widths
                            col1width = 4;
                            col2width = 4;
                            col3width = 4;
                            col4width = 4;
                            col5width = 4;
                            col6width = 4;
                            break;
                        case 3:
                            // There are now 4 cols so change widths
                            col1width = 3;
                            col2width = 3;
                            col3width = 3;
                            col4width = 3;
                            col5width = 3;
                            col6width = 3;
                            break;
                    }

                    displayedItems++;
                }

                if (viewOptions.updateSummaryVisible) {

                    switch (displayedItems) {
                        case 2:
                            // There are now 3 cols so change widths
                            col1width = 4;
                            col2width = 4;
                            col3width = 4;
                            col4width = 4;
                            col5width = 4;
                            col6width = 4;
                            break;
                        case 3:
                            // There are now 4 cols so change widths
                            col1width = 3;
                            col2width = 3;
                            col3width = 3;
                            col4width = 3;
                            col5width = 3;
                            col6width = 3;
                            break;
                        case 4:
                            // There are now 5 cols so change widths
                            col1width = 2;
                            col2width = 3;
                            col3width = 2;
                            col4width = 2;
                            col5width = 3;
                            col6width = 2;
                            break;
                    }
                    displayedItems++;
                }

                if (viewOptions.designDomainDictVisible) {

                    switch (displayedItems) {
                        case 2:
                            // There are now 3 cols so change widths
                            col1width = 4;
                            col2width = 4;
                            col3width = 4;
                            col4width = 4;
                            col5width = 4;
                            col6width = 4;
                            break;
                        case 3:
                            // There are now 4 cols so change widths
                            col1width = 3;
                            col2width = 3;
                            col3width = 3;
                            col4width = 3;
                            col5width = 3;
                            col6width = 3;

                            break;
                        case 4:
                            // There are now 5 cols so change widths
                            col1width = 2;
                            col2width = 3;
                            col3width = 2;
                            col4width = 2;
                            col5width = 3;
                            col6width = 2;

                            break;
                        case 5:
                            // There are now 6 cols so change widths
                            col1width = 2;
                            col2width = 2;
                            col3width = 2;
                            col4width = 2;
                            col5width = 2;
                            col6width = 2;
                    }
                    displayedItems++;
                }

                if (viewOptions.testSummaryVisible) {

                    switch (displayedItems) {
                        case 2:
                            col1width = 6;
                            col2width = 6;
                            col3width = 6;
                            col4width = 6;
                            col5width = 6;
                            col6width = 6;
                            break;
                        case 3:
                            col1width = 6;
                            col2width = 3;
                            col3width = 3;
                            col4width = 3;
                            col5width = 3;
                            col6width = 3;
                            break;
                        case 4:
                            col1width = 6;
                            col2width = 2;
                            col3width = 2;
                            col4width = 2;
                            col5width = 2;
                            col6width = 2;
                            break;
                        case 5:
                            col1width = 4;
                            col2width = 2;
                            col3width = 2;
                            col4width = 2;
                            col5width = 2;
                            col6width = 2;
                            break;
                        case 6:
                            col1width = 2;
                            col2width = 2;
                            col3width = 2;
                            col4width = 2;
                            col5width = 2;
                            col6width = 2;
                    }

                }

                let col1 =
                    <Col id="scopeCol" md={col1width} className="close-col">
                        {updateScopeComponent}
                    </Col>;


                let col2 =
                    <Col id="editCol" md={col2width} className="close-col">
                        {updateEditComponent}
                    </Col>;


                let col3 = '';
                if (viewOptions.designDetailsVisible) {
                    col3 =
                        <Col id="detailsCol" md={col3width} className="close-col">
                            {updateTextComponent}
                        </Col>;
                }

                let col4 = '';
                if (viewOptions.updateProgressVisible) {
                    col4 =
                        <Col id="workingCol" md={col4width} className="close-col">
                            {workingVersionComponent}
                        </Col>;
                }

                let col5 = '';
                if (viewOptions.updateSummaryVisible) {
                    col5 =
                        <Col id="summaryCol" md={col5width} className="close-col">
                            {updateSummary}
                        </Col>;
                }

                let col6 = '';
                if (viewOptions.designDomainDictVisible) {
                    col6 =
                        <Col id="dictCol" md={col6width} className="close-col">
                            {domainDictionary}
                        </Col>;
                }

                // Make up the layout based on the view options
                layout =
                    <Grid >
                        <Row>
                            {col1}
                            {col2}
                            {col3}
                            {col4}
                            {col5}
                            {col6}
                        </Row>
                    </Grid>;
            }

            return (
                <div>
                    {layout}
                </div>
            );


        } else {
            // Read Only or View DU

            // Layout is UPDATE | TEXT (o) | PROGRESS (o) | SUMMARY (o) | DICT (o)
            // or UPDATE + TEST SUMMARY | TEXT (o) | PROGRESS (o) | SUMMARY (o) | DICT (o)

            displayedItems = 1;

            if(viewOptions.updateShowAllAsTabs){

                col1width = 6;
                col2width = 6;

                let col1 =
                    <Col id="viewCol" md={col1width} className="close-col">
                        {updateViewComponent}
                    </Col>;


                let col2 =
                    <Col id="tabsCol" md={col2width} className="close-col">
                        <Tabs className="top-tabs" defaultActiveKey={1} id="updatable-view_tabs">
                            <Tab eventKey={1} title="DETAILS">{updateTextComponent}</Tab>
                            <Tab eventKey={2} title="WORKING VIEW">{workingVersionComponent}</Tab>
                            <Tab eventKey={3} title="SUMMARY">{updateSummary}</Tab>
                            <Tab eventKey={4} title="DICTIONARY">{domainDictionary}</Tab>
                        </Tabs>
                    </Col>;

                layout =
                    <Grid >
                        <Row>
                            {col1}
                            {col2}
                        </Row>
                    </Grid>;

            } else {

                if (viewOptions.designDetailsVisible) {

                    // There are now 2 cols so change widths
                    col1width = 6;
                    col2width = 6;
                    col3width = 6;
                    col4width = 6;
                    col5width = 6;

                    displayedItems++;
                }

                if (viewOptions.updateProgressVisible) {

                    switch (displayedItems) {
                        case 1:
                            // There are now 2 cols so change widths
                            col1width = 6;
                            col2width = 6;
                            col3width = 6;
                            col4width = 6;
                            col5width = 6;
                            break;
                        case 2:
                            // There are now 3 cols so change widths
                            col1width = 4;
                            col2width = 4;
                            col3width = 4;
                            col4width = 4;
                            col5width = 4;
                            break;
                    }

                    displayedItems++;
                }

                if (viewOptions.updateSummaryVisible) {

                    switch (displayedItems) {
                        case 1:
                            // There are now 2 cols so change widths
                            col1width = 6;
                            col2width = 6;
                            col3width = 6;
                            col4width = 6;
                            col5width = 6;
                            break;
                        case 2:
                            // There are now 3 cols so change widths
                            col1width = 4;
                            col2width = 4;
                            col3width = 4;
                            col4width = 4;
                            col5width = 4;
                            break;
                        case 3:
                            // There are now 4 cols so change widths
                            col1width = 3;
                            col2width = 3;
                            col3width = 3;
                            col4width = 3;
                            col5width = 3;
                            break;
                    }
                    displayedItems++;
                }

                if (viewOptions.designDomainDictVisible) {

                    switch (displayedItems) {
                        case 1:
                            // There are now 2 cols so change widths
                            col1width = 6;
                            col2width = 6;
                            col3width = 6;
                            col4width = 6;
                            col5width = 6;
                            break;
                        case 2:
                            // There are now 3 cols so change widths
                            col1width = 4;
                            col2width = 4;
                            col3width = 4;
                            col4width = 4;
                            col5width = 4;
                            break;
                        case 3:
                            // There are now 4 cols so change widths
                            col1width = 3;
                            col2width = 3;
                            col3width = 3;
                            col4width = 3;
                            col5width = 3;
                            break;
                        case 4:
                            // There are now 5 cols so change widths
                            col1width = 3;
                            col2width = 2;
                            col3width = 2;
                            col4width = 3;
                            col5width = 2;
                    }
                    displayedItems++;
                }

                if (viewOptions.testSummaryVisible) {
                    // Expand col 1
                    switch (displayedItems) {
                        case 1:
                            col1width = 12;
                            col2width = 0;
                            col3width = 0;
                            col4width = 0;
                            col5width = 0;
                            break;
                        case 2:
                            col1width = 8;
                            col2width = 4;
                            col3width = 4;
                            col4width = 4;
                            col5width = 4;
                            break;
                        case 3:
                            col1width = 6;
                            col2width = 3;
                            col3width = 3;
                            col4width = 3;
                            col5width = 3;
                            break;
                        case 4:
                            col1width = 6;
                            col2width = 2;
                            col3width = 2;
                            col4width = 2;
                            col5width = 2;
                            break;
                        case 5:
                            col1width = 4;
                            col2width = 2;
                            col3width = 2;
                            col4width = 2;
                            col5width = 2;
                    }
                }

                let col1 =
                    <Col id="viewCol" md={col1width} className="close-col">
                        {updateViewComponent}
                    </Col>;


                let col2 = '';
                if (viewOptions.designDetailsVisible) {
                    col2 =
                        <Col id="detailsCol" md={col2width} className="close-col">
                            {updateViewTextComponent}
                        </Col>;
                }

                let col3 = '';
                if (viewOptions.updateProgressVisible) {
                    col3 =
                        <Col id="workingCol" md={col3width} className="close-col">
                            {workingVersionComponent}
                        </Col>;
                }

                let col4 = '';
                if (viewOptions.updateSummaryVisible) {
                    col4 =
                        <Col id="summaryCol" md={col4width} className="close-col">
                            {updateSummary}
                        </Col>;
                }

                let col5 = '';
                if (viewOptions.designDomainDictVisible) {
                    col5 =
                        <Col id="dictCol" md={col5width} className="close-col">
                            {domainDictionary}
                        </Col>;
                }

                // Make up the layout based on the view options
                layout =
                    <Grid >
                        <Row>
                            {col1}
                            {col2}
                            {col3}
                            {col4}
                            {col5}
                        </Row>
                    </Grid>;
            }
            return (
                <div>
                    {layout}
                </div>
            );
        }

    }
}


UpdateApplicationsList.propTypes = {
    baseApplications:       PropTypes.array.isRequired,
    updateApplications:     PropTypes.array.isRequired,
    workingApplications:    PropTypes.array.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext:            state.currentUserItemContext,
        view:                   state.currentAppView,
        mode:                   state.currentViewMode,
        viewOptions:            state.currentUserViewOptions,
        testDataFlag:           state.testDataFlag,
        updateScopeFlag:        state.currentUpdateScopeFlag,
        workPackageScopeFlag:   state.currentWorkPackageScopeFlag,
        currentViewDataValue:   state.currentViewOptionsDataValue
    }
}

// Default export with REDUX
export default EditDesignUpdateContainer = createContainer(({params}) => {

    // The editor container will start by rendering a list of Applications in the Design Update
    return ClientDataServices.getEditorApplicationData(
        params.userContext,
        params.view
    );

}, connect(mapStateToProps)(UpdateApplicationsList));