// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import DesignEditorHeader               from '../../components/common/DesignEditorHeader.jsx';
import DesignEditorFooter               from '../../components/common/DesignEditorFooter.jsx';
import DesignComponentTarget            from '../../components/edit/DesignComponentTarget.jsx';
import DesignComponentTextContainer     from './DesignComponentTextContainer.jsx';
import DomainDictionaryContainer        from './DomainDictionaryContainer.jsx';

// Ultrawide Services
import { ViewType, DisplayContext, LogLevel } from '../../../constants/constants.js';
import { log } from '../../../common/utils.js'

import ClientDataServices              from '../../../apiClient/apiClientDataServices.js';
import { ClientWorkPackageComponentServices }   from '../../../apiClient/apiClientWorkPackageComponent.js';
import ClientDesignVersionServices          from '../../../apiClient/apiClientDesignVersion.js';
import ClientUserSettingsServices           from '../../../apiClient/apiClientUserSettings.js';

// Bootstrap
import {Grid, Row, Col, Tabs, Tab} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Work Package Editor.  Manager sets the scope of a Work Package frm the Base Design Version or Design Update
//
// ---------------------------------------------------------------------------------------------------------------------

// WP Applications Container
class WorkPackageApplicationsList extends Component {
    constructor(props) {
        super(props);

    }


    getWpItem(currentItem, workPackageId){
        return ClientWorkPackageComponentServices.getWorkPackageComponent(currentItem.componentReferenceId, workPackageId);
    }

    getUpdateItem(application, designUpdateId){
        if(designUpdateId !== 'NONE') {
            return ClientDesignVersionServices.getDesignUpdateItemForUpdate(application, designUpdateId);
        } else {
            return null;
        }
    }

    getEditorClass(){
        return ClientUserSettingsServices.getWindowSizeClassForDesignEditor();
    }

    // A list of top level applications in the work package potential scope
    renderScopeApplications(wpScopeApplications, displayContext, view, mode, userContext, testSummary) {

        return wpScopeApplications.map((application) => {
            return (
                <DesignComponentTarget
                    key={application._id}
                    currentItem={application}
                    updateItem={this.getUpdateItem(application, userContext.designUpdateId)}
                    wpItem={this.getWpItem(application, userContext.workPackageId)}
                    displayContext={displayContext}
                    view={view}
                    mode={mode}
                    testSummary={testSummary}
                    testSummaryData={null}
                />
            );
        });
    }

    // A list of top level applications in the work package view
    renderViewApplications(wpViewApplications, displayContext, view, mode, userContext, testSummary) {

        if(wpViewApplications.length > 0) {

            return wpViewApplications.map((application) => {

                return (
                    <DesignComponentTarget
                        key={application._id}
                        currentItem={application}
                        updateItem={this.getUpdateItem(application, userContext.designUpdateId)}
                        wpItem={this.getWpItem(application, userContext.workPackageId)}
                        displayContext={displayContext}
                        view={view}
                        mode={mode}
                        testSummary={testSummary}
                        testSummaryData={null}
                    />
                );
            });
        }
    }

    render() {

        const {scopeApplications, wpApplications, userContext, viewOptions, currentItemName, view, mode} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Edit Work Package');

        let layout = '';

        // Get correct window height
        const editorClass = this.getEditorClass();

        let testSummaryAvailableForView = false;

        if(view === ViewType.WORK_PACKAGE_BASE_VIEW || view === ViewType.WORK_PACKAGE_UPDATE_VIEW){
            testSummaryAvailableForView = true;
        }

        // Scope for Work Package
        let wpScopeComponent =
            <div className="design-editor-container">
                <DesignEditorHeader
                    displayContext={DisplayContext.WP_SCOPE}
                />
                <div className={editorClass}>
                    {this.renderScopeApplications(scopeApplications, DisplayContext.WP_SCOPE, view, mode, userContext, viewOptions.testSummaryVisible)}
                </div>
                <DesignEditorFooter
                    displayContext={DisplayContext.WP_SCOPE}
                    hasDesignSummary={false}
                />
            </div>;

        // Actual View of the WP
        let wpViewComponent =
            <div className="design-editor-container">
                <DesignEditorHeader
                    displayContext={DisplayContext.WP_VIEW}
                />
                <div className={editorClass}>
                    {this.renderViewApplications(wpApplications, DisplayContext.WP_VIEW, view, mode, userContext, (viewOptions.testSummaryVisible && testSummaryAvailableForView))}
                </div>
                <DesignEditorFooter
                    displayContext={DisplayContext.WP_VIEW}
                    hasDesignSummary={false}
                />
            </div>;

        let domainDictionary =
            <DomainDictionaryContainer params={{
                designId: userContext.designId,
                designVersionId: userContext.designVersionId
            }}/>;

        let wpTextComponentView =
            <DesignComponentTextContainer params={{
                currentContext: userContext,
                view: view,
                displayContext: DisplayContext.WP_VIEW
            }}/>;


        // Layout ------------------------------------------------------------------------------------------------------

        // Initial assumption is only 2 cols showing

        let col1width = 6;
        let col2width = 6;
        let col3width = 6;
        let col4width = 6;



        let displayedItems = 2;

        switch(view){
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:

                // Layout is WP + opt Test Summary | TEXT | opt DICT |
                // WHAT OPTIONAL COMPONENTS ARE VISIBLE (Besides Scope and WP)

                // Start by assuming only 2 cols
                col1width = 6;
                col2width = 6;
                col3width = 6;

                // Details

                // Domain Dictionary
                if(viewOptions.designDomainDictVisible) {

                        // There are now 3 cols
                        col1width = 4;
                        col2width = 4;
                        col3width = 4;

                        displayedItems++;
                }

                // Test Summary - this actually just makes col 1 wider
                if(viewOptions.testSummaryVisible){

                    switch(displayedItems){
                        case 1:
                            col1width = 12;
                            col2width = 0;
                            col3width = 0;
                            break;
                        case 2:
                            col1width = 7;
                            col2width = 5;
                            col3width = 5;
                            break;
                        case 3:
                            col1width = 6;
                            col2width = 3;
                            col3width = 3;
                            break;
                    }
                }

                // Create the layout depending on the current view...

                // Col 1 - Content
                let col1 =
                    <Col md={col1width} className="close-col">
                        {wpViewComponent}
                    </Col>;

                // Col 2 - Details
                let col2 =
                    <Col md={col2width} className="close-col">
                        {wpTextComponentView}
                    </Col>;


                // Col 3 - Domain Dictionary - Optional
                let col3 = '';
                if(viewOptions.designDomainDictVisible){
                    col3 =
                        <Col md={col3width}>
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
                        </Row>
                    </Grid>;

                return (
                    <div>
                        {layout}
                    </div>
                );

                break;

            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:

                // Create the layout
                if(scopeApplications) {
                    // Layout is SCOPE | WP | opt TEXT | opt DICT

                    // WHAT OPTIONAL COMPONENTS ARE VISIBLE (Besides Scope and WP)

                    // Start by assuming only 2 cols
                    col1width = 6;
                    col2width = 6;
                    col3width = 6;
                    col4width = 6;

                    if(viewOptions.workShowAllAsTabs){

                        col1width = 4;
                        col2width = 4;
                        col3width = 4;

                        // Col 1 - Scope
                        let col1 =
                            <Col md={col1width} className="close-col">
                                {wpScopeComponent}
                            </Col>;

                        // Col 2 - Content
                        let col2 =
                            <Col md={col2width} className="close-col">
                                {wpViewComponent}
                            </Col>;

                        // Col 3 - Tabs
                        let col3 =
                            <Col id="column2" md={col2width} className="close-col">
                                <Tabs className="top-tabs" defaultActiveKey={1} id="updatable-view_tabs">
                                    <Tab eventKey={1} title="DETAILS">{wpTextComponentView}</Tab>
                                    <Tab eventKey={2} title="DICTIONARY">{domainDictionary}</Tab>
                                </Tabs>
                            </Col>;

                        // Make up the layout based on the view options
                        layout =
                            <Grid >
                                <Row>
                                    {col1}
                                    {col2}
                                    {col3}
                                </Row>
                            </Grid>;

                    } else {

                        // Details
                        if (viewOptions.designDetailsVisible) {

                            // Now 3 cols
                            col1width = 4;
                            col2width = 4;
                            col3width = 4;
                            col4width = 4;

                            displayedItems++;
                        }

                        // Domain Dictionary
                        if (viewOptions.designDomainDictVisible) {

                            switch (displayedItems) {
                                case 2:
                                    // There are now 3 cols
                                    col1width = 4;
                                    col2width = 4;
                                    col3width = 4;
                                    col4width = 4;
                                    break;
                                case 3:
                                    // There are now 4 cols
                                    col1width = 3;
                                    col2width = 3;
                                    col3width = 3;
                                    col4width = 3;
                                    break;
                            }
                        }

                        // Create the layout depending on the current view...

                        // Col 1 - Scope
                        let col1 =
                            <Col md={col1width} className="close-col">
                                {wpScopeComponent}
                            </Col>;

                        // Col 2 - Content
                        let col2 =
                            <Col md={col2width} className="close-col">
                                {wpViewComponent}
                            </Col>;

                        // Col 3 - Details - Optional
                        let col3 = '';
                        if (viewOptions.designDetailsVisible) {
                            col3 =
                                <Col md={col3width} className="close-col">
                                    {wpTextComponentView}
                                </Col>;
                        }

                        // Col 4 - Domain Dictionary - Optional
                        let col4 = '';
                        if (viewOptions.designDomainDictVisible) {
                            col4 =
                                <Col md={col4width} className="close-col">
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
                                </Row>
                            </Grid>;
                    }
                    return (
                        <div>
                            {layout}
                        </div>
                    );

                } else {
                    return (
                        <div>
                            No Data
                        </div>
                    );
                }
                break;

            default:
                log((msg) => console.log(msg), LogLevel.ERROR, "Unexpected View Type: {}", view);
        }


    }
}

WorkPackageApplicationsList.propTypes = {
    scopeApplications:  PropTypes.array.isRequired,
    wpApplications:     PropTypes.array.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext,
        viewOptions: state.currentUserViewOptions,
        currentItemName: state.currentDesignComponentName,
        view: state.currentAppView,
        mode: state.currentViewMode,
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
WorkPackageApplicationsList = connect(mapStateToProps)(WorkPackageApplicationsList);


export default EditWorkPackageContainer = createContainer(({params}) => {

    // The editor container will start by rendering a list of Applications in the design
    return ClientDataServices.getEditorApplicationData(
        params.userContext,
        params.view
    );

}, WorkPackageApplicationsList);