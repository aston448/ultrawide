// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import DesignComponentTarget        from '../../components/edit/DesignComponentTarget.jsx';
import DesignComponentAdd           from '../../components/common/DesignComponentAdd.jsx';
import DesignComponentTextContainer from './DesignComponentTextContainer.jsx';
import DomainDictionaryContainer    from './DomainDictionaryContainer.jsx';
import UpdateSummaryContainer       from '../../containers/select/UpdateSummaryContainer.jsx';

// Ultrawide Services
import { ComponentType, ViewType, ViewMode, DisplayContext } from '../../../constants/constants.js';
import ClientDesignComponentServices from '../../../apiClient/apiClientDesignComponent.js';
import ClientDesignUpdateComponentServices from '../../../apiClient/apiClientDesignUpdateComponent.js';
import ClientContainerServices from '../../../apiClient/apiClientContainerServices.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';
import {Panel} from 'react-bootstrap';

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


    // A list of top level applications in the design update
    renderUpdateApplications(updateApplications, context, view, mode, testSummary) {
        return updateApplications.map((application) => {
            // All applications are shown even in update edit view even if not in scope so that new items can be added to them
            return (
                <DesignComponentTarget
                    key={application._id}
                    currentItem={application}
                    designItem={application}
                    displayContext={context}
                    view={view}
                    mode={mode}
                    testSummary={testSummary}
                />
            );

        });
    }

    render() {

        const {updateApplications, userContext, view, mode, viewOptions} = this.props;

        // Items -------------------------------------------------------------------------------------------------------

        let addComponent = '';

        if (mode === ViewMode.MODE_EDIT) {
            // Editing so include the Add Application
            addComponent =
                <table>
                    <tbody>
                    <tr>
                        <td id="addApplication" className="control-table-data-app">
                            <DesignComponentAdd
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
            <Panel id="scopePane" header="Update Scope" className="panel-update panel-update-body">
                <Grid>
                    <Row>
                        <Col md={12} className="scroll-col">
                            {this.renderUpdateApplications(updateApplications, DisplayContext.UPDATE_SCOPE, view, mode, false)}
                        </Col>
                    </Row>
                </Grid>
            </Panel>;

        // Edit for Design Update
        let updateEditComponent =
            <Panel id="editorPaneEdit" header="Update Editor" className="panel-update panel-update-body">
                <Grid>
                    <Row>
                        <Col md={12} className="scroll-col">
                            {this.renderUpdateApplications(updateApplications, DisplayContext.UPDATE_EDIT, view, mode, false)}
                            {addComponent}
                        </Col>
                    </Row>
                </Grid>
            </Panel>;

        // View Design Update Content
        let updateViewComponent =
            <Panel id="editorPaneView" header="Design Update" className="panel-update panel-update-body">
                <Grid>
                    <Row>
                        <Col md={12} className="scroll-col">
                            {this.renderUpdateApplications(updateApplications, DisplayContext.UPDATE_VIEW, view, mode, viewOptions.updateTestSummaryVisible)}
                        </Col>
                    </Row>
                </Grid>
            </Panel>;

        // Text / Scenario Steps for Design Update - Editable
        let updateTextComponent =
            <Panel id="detailsPaneEdit" header="New and Old Text" className="panel-update panel-update-body">
                <DesignComponentTextContainer params={{
                    currentContext: userContext,
                    view: view,
                    displayContext: DisplayContext.UPDATE_EDIT
                }}/>
            </Panel>;

        // Text / Scenario Steps for Design Update - Read Only
        let updateViewTextComponent =
            <Panel id="detailsPaneView" header="New and Old Text" className="panel-update panel-update-body">
                <DesignComponentTextContainer params={{
                    currentContext: userContext,
                    view: view,
                    displayContext: DisplayContext.UPDATE_VIEW
                }}/>
            </Panel>;

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
                <UpdateSummaryContainer params={{
                    designUpdateId: userContext.designUpdateId
                }}/>
            </div>;

        // Layout ------------------------------------------------------------------------------------------------------
        let layout = '';

        // Create the layout depending on the current view...
        if(updateApplications) {

            if(view === ViewType.DESIGN_UPDATE_EDIT && mode === ViewMode.MODE_EDIT){
                // Editable DU

                // Layout is SCOPE | UPDATE | TEXT | SUMMARY or DICT

                // If dictionary visible, this replaces the base view
                let col4component = updateSummary;

                if (viewOptions.updateDomainDictVisible) {
                    col4component = domainDictionary;
                }

                if(viewOptions.updateDetailsVisible) {
                    layout =
                        <Grid>
                            <Row>
                                <Col id="scopeCol" md={3}>
                                    {updateScopeComponent}
                                </Col>
                                <Col id="designCol" md={3}>
                                    {updateEditComponent}
                                </Col>
                                <Col id="detailsCol" md={3}>
                                    {updateTextComponent}
                                </Col>
                                <Col id="dictSummCol" md={3}>
                                    {col4component}
                                </Col>
                            </Row>
                        </Grid>;
                } else {
                    layout =
                        <Grid>
                            <Row>
                                <Col id="scopeCol" md={4}>
                                    {updateScopeComponent}
                                </Col>
                                <Col id="designCol" md={4}>
                                    {updateEditComponent}
                                </Col>
                                <Col id="dictSummCol" md={4}>
                                    {col4component}
                                </Col>
                            </Row>
                        </Grid>;
                }

            } else {
                // Read Only DU

                // Layout is UPDATE | TEXT | SUMMARY or DICT
                // or UPDATE + TEST SUMMARY | UPDATE SUMMARY

                // If dictionary visible, this replaces the base view
                let col3component = updateSummary;

                if(viewOptions.updateDomainDictVisible){
                    col3component = domainDictionary;
                }

                // Adjust layout if Test Summary Visible
                if(viewOptions.updateTestSummaryVisible){
                    if(viewOptions.updateDetailsVisible) {
                        layout =
                            <Grid>
                                <Row>
                                    <Col id="designCol" md={6}>
                                        {updateViewComponent}
                                    </Col>
                                    <Col id="detailsCol" md={3}>
                                        {updateViewTextComponent}
                                    </Col>
                                    <Col id="dictSummCol" md={3}>
                                        {col3component}
                                    </Col>
                                </Row>
                            </Grid>;
                    } else {
                        layout =
                            <Grid>
                                <Row>
                                    <Col id="designCol" md={8}>
                                        {updateViewComponent}
                                    </Col>
                                    <Col id="dictSummCol" md={4}>
                                        {updateSummary}
                                    </Col>
                                </Row>
                            </Grid>;
                    }
                } else {
                    if(viewOptions.updateDetailsVisible) {
                        layout =
                            <Grid>
                                <Row>
                                    <Col id="designCol" md={4}>
                                        {updateViewComponent}
                                    </Col>
                                    <Col id="detailsCol" md={4}>
                                        {updateViewTextComponent}
                                    </Col>
                                    <Col id="dictSummCol" md={4}>
                                        {col3component}
                                    </Col>
                                </Row>
                            </Grid>;
                    } else {
                        layout =
                            <Grid>
                                <Row>
                                    <Col id="designCol" md={6}>
                                        {updateViewComponent}
                                    </Col>
                                    <Col id="dictSummCol" md={6}>
                                        {col3component}
                                    </Col>
                                </Row>
                            </Grid>;
                    }
                }
            }

            return (
                <div>
                    {layout}
                </div>
            );

        } else {
            // Just return the add new item (if there is one)
            return (
                <div>
                    {addComponent}
                </div>
            );
        }


    }
}


UpdateApplicationsList.propTypes = {
    updateApplications: PropTypes.array.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext:            state.currentUserItemContext,
        view:                   state.currentAppView,
        mode:                   state.currentViewMode,
        viewOptions:            state.currentUserViewOptions

    }
}

// Default export with REDUX
export default EditDesignUpdateContainer = createContainer(({params}) => {

    // The editor container will start by rendering a list of Applications in the Design Update
    return ClientContainerServices.getEditorApplicationData(
        params.userContext,
        params.view
    );

}, connect(mapStateToProps)(UpdateApplicationsList));