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
import ClientContainerServices from '../../../apiClient/apiClientContainerServices.js';
import ClientWorkPackageServices from '../../../apiClient/apiClientWorkPackage.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';
import {Panel} from 'react-bootstrap';

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

    getDesignItem(application){
        return ClientWorkPackageServices.getDesignItem(application.componentId, application.workPackageType)
    }


    // A list of top level applications in the work package potential scope
    renderScopeApplications(wpScopeApplications, context, view, mode) {
        return wpScopeApplications.map((application) => {
            return (
                <DesignComponentTarget
                    key={application._id}
                    currentItem={application}
                    designItem={this.getDesignItem(application)}
                    displayContext={context}
                    view={view}
                    mode={mode}
                />
            );
        });
    }

    // A list of top level applications in the work package view
    renderViewApplications(wpViewApplications, context, view, mode) {
        return wpViewApplications.map((application) => {
            return (
                <DesignComponentTarget
                    key={application._id}
                    currentItem={application}
                    designItem={this.getDesignItem(application)}
                    displayContext={context}
                    view={view}
                    mode={mode}
                />
            );
        });
    }

    render() {

        const {wpScopeApplications, wpViewApplications, currentUserItemContext, currentItemName, view, mode, domainDictionaryVisible} = this.props;

        let layout = '';

        // Create the layout
        if(wpScopeApplications) {
            // Layout is SCOPE | WP | TEXT | opt DICT

            // Scope for Work Package
            let wpScopeComponent =
                <Panel header="Work Package Scope" className="panel-update panel-update-body">
                    {this.renderScopeApplications(wpScopeApplications, DisplayContext.WP_SCOPE, view, mode)}
                </Panel>;

            // Actual View of the WP
            let wpViewComponent =
                <Panel header="Work Package Content" className="panel-update panel-update-body">
                    {this.renderViewApplications(wpViewApplications, DisplayContext.WP_VIEW, view, mode)}
                </Panel>;

            // Design Component Text / Scenario Steps
            let wpTextHeader = '';

            switch(view){
                case ViewType.WORK_PACKAGE_BASE_EDIT:
                    wpTextHeader = 'Text';
                    break;
                case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                    wpTextHeader = 'New and Old Text';
                    break;
            }

            let wpTextComponent = <div></div>
                //TODO - Fix this - something broken here
                // <Panel header={wpTextHeader}   className="panel-update panel-update-body">
                //     <DesignComponentTextContainer params={{
                //         currentContext: currentUserItemContext,
                //         mode: ViewMode.MODE_VIEW,
                //         view: view,
                //         displayContext: DisplayContext.WP_VIEW
                //     }}/>
                // </Panel>;

            // Domain Dictionary
            let domainDictionary =
                <DomainDictionaryContainer params={{
                    designId: currentUserItemContext.designId,
                    designVersionId: currentUserItemContext.designVersionId
                }}/>;

            if(domainDictionaryVisible) {
                layout =
                    <Grid>
                        <Row>
                            <Col md={3}>
                                {wpScopeComponent}
                            </Col>
                            <Col md={3}>
                                {wpViewComponent}
                            </Col>
                            <Col md={3}>
                                {wpTextComponent}
                            </Col>
                            <Col md={3}>
                                {domainDictionary}
                            </Col>
                        </Row>
                    </Grid>;
            } else {
                layout =
                    <Grid>
                        <Row>
                            <Col md={4}>
                                {wpScopeComponent}
                            </Col>
                            <Col md={4}>
                                {wpViewComponent}
                            </Col>
                            <Col md={4}>
                                {wpTextComponent}
                            </Col>
                        </Row>
                    </Grid>;
            }

            // Return the Application List
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


    }
}


WorkPackageApplicationsList.propTypes = {
    wpScopeApplications: PropTypes.array.isRequired,
    wpViewApplications: PropTypes.array.isRequired
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
WorkPackageApplicationsList = connect(mapStateToProps)(WorkPackageApplicationsList);


export default EditWorkPackageContainer = createContainer(({params}) => {

    // The editor container will start by rendering a list of Applications in the design
    return ClientContainerServices.getEditorApplicationData(
        params.view,
        params.designVersionId,
        params.designUpdateId,
        params.workPackageId
    );

}, WorkPackageApplicationsList);