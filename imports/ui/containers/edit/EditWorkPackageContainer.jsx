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
import { ComponentType, ViewType, ViewMode, DisplayContext, LogLevel } from '../../../constants/constants.js';
import ClientContainerServices from '../../../apiClient/apiClientContainerServices.js';
import ClientWorkPackageComponentServices from '../../../apiClient/apiClientWorkPackageComponent.js';
import { log } from '../../../common/utils.js'
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
        return ClientWorkPackageComponentServices.getDesignItem(application.componentId, application.workPackageType)
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
                    testSummary={false}
                    testSummaryData={null}
                />
            );
        });
    }

    // A list of top level applications in the work package view
    renderViewApplications(wpViewApplications, context, view, mode, testSummary) {
        return wpViewApplications.map((application) => {
            return (
                <DesignComponentTarget
                    key={application._id}
                    currentItem={application}
                    designItem={this.getDesignItem(application)}
                    displayContext={context}
                    view={view}
                    mode={mode}
                    testSummary={testSummary}
                    testSummaryData={null}
                />
            );
        });
    }

    render() {

        const {wpScopeApplications, wpViewApplications, userContext, viewOptions, currentItemName, view, mode} = this.props;

        //console.log("WP Container. View = " + view + ". Test Summary =  " + viewOptions.devTestSummaryVisible);

        let layout = '';

        // Scope for Work Package
        let wpScopeComponent =
            <Panel header="Work Package Scope" className="panel-update panel-update-body">
                <Grid>
                    <Row>
                        <Col md={12} className="scroll-col">
                            {this.renderScopeApplications(wpScopeApplications, DisplayContext.WP_SCOPE, view, mode)}
                        </Col>
                    </Row>
                </Grid>
            </Panel>;

        // Actual View of the WP
        let wpViewComponent =
            <Panel header="Work Package Content" className="panel-update panel-update-body">
                <Grid>
                    <Row>
                        <Col md={12} className="scroll-col">
                            {this.renderViewApplications(wpViewApplications, DisplayContext.WP_VIEW, view, mode, viewOptions.devTestSummaryVisible)}
                        </Col>
                    </Row>
                </Grid>

            </Panel>;

        // Initial assumption is only 2 cols showing

        let col1width = 6;
        let col2width = 6;
        let col3width = 6;

        let wpTextComponent = '';
        let domainDictionary = '';

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
                let wpTextHeader = '';

                switch(view){
                    case ViewType.WORK_PACKAGE_BASE_VIEW:
                        wpTextHeader = 'Text';
                        break;
                    case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                        wpTextHeader = 'New and Old Text';
                        break;
                }

                if(userContext.designComponentId === 'NONE'){
                    wpTextComponent =
                        <Panel header="Design Component Details" className="panel-update panel-update-body">
                            <div className="design-item-note">Select a Design Component</div>
                        </Panel>
                } else {
                    wpTextComponent =
                        <Panel header={wpTextHeader} className="panel-update panel-update-body">
                            <DesignComponentTextContainer params={{
                                currentContext: userContext,
                                view: view,
                                displayContext: DisplayContext.WP_VIEW
                            }}/>
                        </Panel>;
                }


                // Domain Dictionary
                if(viewOptions.wpDomainDictVisible) {
                    domainDictionary =
                        <DomainDictionaryContainer params={{
                            designId: userContext.designId,
                            designVersionId: userContext.designVersionId
                        }}/>;

                        // There are now 3 cols
                        col1width = 4;
                        col2width = 4;
                        col3width = 4;

                        displayedItems++;
                }

                // Test Summary - this actually just makes col 1 wider
                if(viewOptions.devTestSummaryVisible){

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
                    <Col md={col1width}>
                        {wpViewComponent}
                    </Col>;

                // Col 2 - Details
                let col2 =
                    <Col md={col2width} className="scroll-col">
                        {wpTextComponent}
                    </Col>;


                // Col 3 - Domain Dictionary - Optional
                let col3 = '';
                if(viewOptions.wpDomainDictVisible){
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
                if(wpScopeApplications) {
                    // Layout is SCOPE | WP | TEXT | opt DICT

                    // WHAT OPTIONAL COMPONENTS ARE VISIBLE (Besides Scope and WP)

                    // Start by assuming only 2 cols
                    col1width = 6;
                    col2width = 6;
                    col3width = 6;
                    col4width = 6;

                    // Details
                    if(viewOptions.wpDetailsVisible){
                        let wpTextHeader = '';

                        switch(view){
                            case ViewType.WORK_PACKAGE_BASE_EDIT:
                                wpTextHeader = 'Text';
                                break;
                            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                                wpTextHeader = 'New and Old Text';
                                break;
                        }

                        if(userContext.designComponentId === 'NONE'){
                            wpTextComponent =
                                <Panel header="Design Component Details" className="panel-update panel-update-body">
                                    <div className="design-item-note">Select a Design Component</div>
                                </Panel>
                        } else {
                            wpTextComponent =
                                <Panel header={wpTextHeader} className="panel-update panel-update-body">
                                    <DesignComponentTextContainer params={{
                                        currentContext: userContext,
                                        view: view,
                                        displayContext: DisplayContext.WP_VIEW
                                    }}/>
                                </Panel>;
                        }
                        // Now 3 cols
                        col1width = 4;
                        col2width = 4;
                        col3width = 4;
                        col4width = 4;

                        displayedItems++;
                    }

                    // Domain Dictionary
                    if(viewOptions.wpDomainDictVisible) {
                        domainDictionary =
                            <DomainDictionaryContainer params={{
                                designId: userContext.designId,
                                designVersionId: userContext.designVersionId
                            }}/>;

                        switch(displayedItems){
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
                        <Col md={col1width}>
                            {wpScopeComponent}
                        </Col>;

                    // Col 2 - Content
                    let col2 =
                        <Col md={col2width}>
                            {wpViewComponent}
                        </Col>;

                    // Col 3 - Details - Optional
                    let col3 = '';
                    if(viewOptions.wpDetailsVisible){
                        col3 =
                            <Col md={col3width} className="scroll-col">
                                {wpTextComponent}
                            </Col>;
                    }

                    // Col 4 - Domain Dictionary - Optional
                    let col4 = '';
                    if(viewOptions.wpDomainDictVisible){
                        col4 =
                            <Col md={col4width}>
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
    wpScopeApplications: PropTypes.array.isRequired,
    wpViewApplications: PropTypes.array.isRequired
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
    return ClientContainerServices.getEditorApplicationData(
        params.view,
        params.designVersionId,
        params.designUpdateId,
        params.workPackageId
    );

}, WorkPackageApplicationsList);