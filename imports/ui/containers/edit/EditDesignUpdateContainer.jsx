// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import DesignComponentTarget from '../../components/edit/DesignComponentTarget.jsx';
import DesignComponentAdd from '../../components/common/DesignComponentAdd.jsx';
import DesignComponentTextContainer from './DesignComponentTextContainer.jsx';
import DomainDictionaryContainer from './DomainDictionaryContainer.jsx';

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

class UpdateApplicationsList extends Component {
    constructor(props) {
        super(props);

    }

    onAddApplication(view, mode, designVersionId, designUpdateId){

        // Add a new application to the design update
        ClientDesignUpdateComponentServices.addApplicationToDesignVersion(view, mode, designVersionId, designUpdateId);

    }


    // A list of top level applications in the design update
    renderUpdateApplications(updateApplications, context, view, mode) {
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
                    testSummary={false}
                />
            );

        });
    }

    // A depiction of the base Design Version
    renderBaseApplications(baseApplications, context, view, mode) {
        return baseApplications.map((application) => {
            return (
                <DesignComponentTarget
                    key={application._id}
                    currentItem={application}
                    designItem={application}
                    displayContext={context}
                    view={view}
                    mode={mode}
                    testSummary={false}
                />
            );
        });
    }

    render() {

        const {updateApplications, baseApplications, currentUserItemContext, currentItemName, view, mode, domainDictionaryVisible} = this.props;

        let layout = '';

        //console.log("Rendering applications list with view mode " + mode + " and current item name " + currentItemName);

        let addComponent = '';

        if (mode === ViewMode.MODE_EDIT) {
            // Editing so include the Add Application
            addComponent =
                <table>
                    <tbody>
                    <tr>
                        <td className="control-table-data-app">
                            <DesignComponentAdd
                                addText="Add Application"
                                onClick={ () => this.onAddApplication(view, mode, currentUserItemContext.designVersionId, currentUserItemContext.designUpdateId)}
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
        }

        // Domain Dictionary
        let domainDictionary =
            <DomainDictionaryContainer params={{
                designId: currentUserItemContext.designId,
                designVersionId: currentUserItemContext.designVersionId
            }}/>;

        // Create the layout depending on the current view...
        if(updateApplications) {
            switch (view) {
                case ViewType.DESIGN_UPDATE_EDIT:
                    // Layout is SCOPE | UPDATE | TEXT | BASE or DICT

                    // Scope for Design Update
                    let updateScopeComponent =
                        <Panel header="Update Scope" className="panel-update panel-update-body">
                            {this.renderUpdateApplications(updateApplications, DisplayContext.UPDATE_SCOPE, view, mode)}
                        </Panel>;

                    // Edit for Design Update
                    let updateEditComponent =
                        <Panel header="Update Editor" className="panel-update panel-update-body">
                            {this.renderUpdateApplications(updateApplications, DisplayContext.UPDATE_EDIT, view, mode)}
                            {addComponent}
                        </Panel>;

                    // Text / Scenario Steps for Design Update
                    let updateTextComponent =
                        <Panel header="New and Old Text" className="panel-update panel-update-body">
                            <DesignComponentTextContainer params={{
                                currentContext: currentUserItemContext,
                                view: view,
                                displayContext: DisplayContext.UPDATE_EDIT
                            }}/>
                        </Panel>;

                    // Base Design for Design Update
                    let updateBaseComponent =
                        <Panel header="Base Design Version" className="panel-update panel-update-body">
                            {this.renderBaseApplications(baseApplications, DisplayContext.BASE_VIEW, view, mode)}
                        </Panel>;

                    // If dictionary visible, this replaces the base view
                    let col4component = updateBaseComponent;

                    if(domainDictionaryVisible){
                        col4component = domainDictionary;
                    }

                    layout =
                        <Grid>
                            <Row>
                                <Col md={3} className="scroll-col">
                                    {updateScopeComponent}
                                </Col>
                                <Col md={3} className="scroll-col">
                                    {updateEditComponent}
                                </Col>
                                <Col md={3}>
                                    {updateTextComponent}
                                </Col>
                                <Col md={3} className="scroll-col">
                                    {col4component}
                                </Col>
                            </Row>
                        </Grid>;
                    break;

                case ViewType.DESIGN_UPDATE_VIEW:
                    // Layout is UPDATE | TEXT | BASE or DICT

                    // Update components
                    let updateViewComponent =
                        <Panel header="Design Update" className="panel-update panel-update-body">
                            {this.renderUpdateApplications(updateApplications, DisplayContext.UPDATE_VIEW, view, mode)}
                        </Panel>;

                    // Text / Scenario Steps for Design Update
                    let updateViewTextComponent =
                        <Panel header="New and Old Text" className="panel-update panel-update-body">
                            <DesignComponentTextContainer params={{
                                currentContext: currentUserItemContext,
                                view: view,
                                displayContext: DisplayContext.UPDATE_VIEW
                            }}/>
                        </Panel>;

                    // Base Design for Design Update
                    let updateViewBaseComponent =
                        <Panel header="Base Design Version" className="panel-update panel-update-body">
                            {this.renderBaseApplications(baseApplications, DisplayContext.BASE_VIEW, view, mode)}
                        </Panel>;

                    // If dictionary visible, this replaces the base view
                    let col3component = updateViewBaseComponent;

                    if(domainDictionaryVisible){
                        col3component = domainDictionary;
                    }

                    layout =
                        <Grid>
                            <Row>
                                <Col md={4}>
                                    {updateViewComponent}
                                </Col>
                                <Col md={4}>
                                    {updateViewTextComponent}
                                </Col>
                                <Col md={4}>
                                    {col3component}
                                </Col>
                            </Row>
                        </Grid>;
                    break;
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
    updateApplications: PropTypes.array.isRequired,
    baseApplications: PropTypes.array.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        currentUserItemContext: state.currentUserItemContext,
        currentItemName: state.currentDesignComponentName,
        view: state.currentAppView,
        mode: state.currentViewMode,
        domainDictionaryVisible: state.domainDictionaryVisible
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
UpdateApplicationsList = connect(mapStateToProps)(UpdateApplicationsList);


export default EditDesignUpdateContainer = createContainer(({params}) => {

    // The editor container will start by rendering a list of Applications in the Design Update
    return ClientContainerServices.getEditorApplicationData(
        params.view,
        params.designVersionId,
        params.designUpdateId,
        null                        // No work package
    );


}, UpdateApplicationsList);