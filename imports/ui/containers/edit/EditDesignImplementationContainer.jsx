// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import DesignComponentTarget                from '../../components/edit/DesignComponentTarget.jsx';
import DesignComponentTextContainer         from '../edit/DesignComponentTextContainer.jsx';
import DesignDevFeatureMashContainer        from '../dev/DesignDevFeatureMashContainer.jsx';
import DevFilesContainer                    from '../dev/DevFilesContainer.jsx';
import DesignDevUnitMashContainer           from '../dev/DesignDevUnitMashContainer.jsx';
import WorkPackageFeatureMashContainer      from '../dev/WorkPackageFeatureMashContainer.jsx';
import DomainDictionaryContainer            from './DomainDictionaryContainer.jsx';


// Ultrawide Services
import { ComponentType, ViewType, ViewMode, DisplayContext } from '../../../constants/constants.js';
import ClientWorkPackageComponentServices from '../../../apiClient/apiClientWorkPackageComponent.js';
import ClientContainerServices from '../../../apiClient/apiClientContainerServices.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';
import {Panel} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design implememtation Editor Container. This contains the part of the design being worked on and its implementation progress
//
// ---------------------------------------------------------------------------------------------------------------------

class DevApplicationsList extends Component {
    constructor(props) {
        super(props);

    }

    getDesignItem(application){
        return ClientWorkPackageComponentServices.getDesignItem(application.componentId, application.workPackageType)
    }

    // A list of top level applications in the work package(s)
    renderApplications(wpApplications, view, mode, context, testSummary) {
        return wpApplications.map((application) => {
            return (
                <DesignComponentTarget
                    key={application._id}
                    currentItem={application}
                    designItem={this.getDesignItem(application)}
                    displayContext={context}
                    view={view}
                    mode={mode}
                    testSummary={testSummary}
                />
            );

        });
    }


    render() {

        const {wpApplications, featureFiles, userContext, currentItemName, view, mode, viewOptions} = this.props;

        let layout = '';

        // Get the correct display context
        let displayContext = DisplayContext.BASE_VIEW;
        switch(view){
            case ViewType.DEVELOP_BASE_WP:
                displayContext = DisplayContext.BASE_VIEW;
                break;
            case ViewType.DEVELOP_UPDATE_WP:
                displayContext = DisplayContext.UPDATE_VIEW;
                break;
        }

        let designDetails = '';
        let featureTests = '';
        let devFiles = '';
        let unitTests = '';
        let intTests = '';
        let domainDictionary = '';
        let displayedItems = 1;

        // Possible Layout is: DESIGN | DETAILS (opt) | ACCEPTANCE TESTS + FILES (opt) | INTEGRATION TESTS (opt) | MODULE TESTS (opt) | DOMAIN DICT (opt)

        // WHAT COMPONENTS ARE VISIBLE (Besides Design)

        // Start by assuming only 2 cols
        let col1width = 6;
        let col2width = 6;
        let col3width = 6;
        let col4width = 6;
        let col5width = 6;
        let col6width = 6;
        let col7width = 6;

        // console.log("View Options Dev Details: " + viewOptions.devDetailsVisible);
        // console.log("View Options Dev Acc: " + viewOptions.devAccTestsVisible);
        // console.log("View Options Dev Int: " + viewOptions.devIntTestsVisible);
        // console.log("View Options Dev Mod: " + viewOptions.devModTestsVisible);
        // console.log("View Options Dev Dict: " + viewOptions.devDomainDictVisible);

        // Working Design
        let design =
            <Panel header="Design Functionality in this Work Package" className="panel-update panel-update-body">
                {this.renderApplications(wpApplications, view, mode, DisplayContext.DEV_DESIGN, viewOptions.devTestSummaryVisible)}
            </Panel>;

        // Details
        if(viewOptions.devDetailsVisible){
            designDetails =
                <DesignComponentTextContainer params={{
                    currentContext: userContext,
                    currentItemName: currentItemName,
                    mode: mode,
                    view: view,
                    displayContext: DisplayContext.EDIT_STEP_WP_DEV
                }}/>;

            displayedItems++;
        }

        // Acceptance (Feature) Tests
        if(viewOptions.devAccTestsVisible){
            featureTests =
                <Panel header="Acceptance Test Implementation" className="panel-update panel-update-body">
                    <WorkPackageFeatureMashContainer params={{
                        userContext: userContext,
                        displayContext: DisplayContext.MASH_ACC_TESTS
                    }}/>
                </Panel>;

            switch(displayedItems){
                case 1:
                    // There are now 2 cols so change widths
                    col1width = 6;
                    col2width = 6;
                    col3width = 6;
                    col4width = 6;
                    col5width = 6;
                    col6width = 6;
                    col7width = 6;
                    break;
                case 2:
                    // There are now 3 cols so change widths
                    col1width = 4;
                    col2width = 4;
                    col3width = 4;
                    col4width = 4;
                    col5width = 4;
                    col6width = 4;
                    col7width = 4;
                    break;
            }

            displayedItems++;

        }

        if(viewOptions.devFeatureFilesVisible){

            devFiles =
                <Panel header="Build Feature Files" className="panel-update panel-update-body">
                    <DevFilesContainer params={{
                        userContext: userContext
                    }}/>
                </Panel>;

            switch(displayedItems){
                case 2:
                    // There are now 3 cols so change widths
                    col1width = 4;
                    col2width = 4;
                    col3width = 4;
                    col4width = 4;
                    col5width = 4;
                    col6width = 4;
                    col7width = 4;
                    break;
                case 3:
                    // There are now 4 cols so change widths
                    col1width = 3;
                    col2width = 3;
                    col3width = 3;
                    col4width = 3;
                    col5width = 3;
                    col6width = 3;
                    col7width = 3;
                    break;
            }

            displayedItems++;
        }

        // Integration Tests
        if(viewOptions.devIntTestsVisible){

            intTests =
                <Panel header="Integration Test Implementation" className="panel-update panel-update-body">
                    <WorkPackageFeatureMashContainer params={{
                        userContext: userContext,
                        displayContext: DisplayContext.MASH_INT_TESTS
                    }}/>
                </Panel>;

            switch(displayedItems){
                case 2:
                    // There are now 3 cols so change widths
                    col1width = 4;
                    col2width = 4;
                    col3width = 4;
                    col4width = 4;
                    col5width = 4;
                    col6width = 4;
                    col7width = 4;
                    break;
                case 3:
                    // There are now 4 cols so change widths
                    col1width = 3;
                    col2width = 3;
                    col3width = 3;
                    col4width = 3;
                    col5width = 3;
                    col6width = 3;
                    col7width = 3;
                    break;
                case 4:
                    // There are now 5 cols so change widths
                    col1width = 3;
                    col2width = 2;
                    col3width = 2;
                    col4width = 2;
                    col5width = 3;
                    col6width = 3;
                    col7width = 3;
                    break;
            }
            displayedItems++;
        }

        // Module Tests
        if(viewOptions.devModTestsVisible){

            unitTests =
                <Panel header="Module Test Implementation" className="panel-update panel-update-body">
                    <WorkPackageFeatureMashContainer params={{
                        userContext: userContext,
                        displayContext: DisplayContext.MASH_MOD_TESTS
                    }}/>
                </Panel>;

            switch(displayedItems){
                case 2:
                    // There are now 3 cols so change widths
                    col1width = 4;
                    col2width = 4;
                    col3width = 4;
                    col4width = 4;
                    col5width = 4;
                    col6width = 4;
                    col7width = 4;
                    break;
                case 3:
                    // There are now 4 cols so change widths
                    col1width = 3;
                    col2width = 3;
                    col3width = 3;
                    col4width = 3;
                    col5width = 3;
                    col6width = 3;
                    col7width = 3;
                    break;
                case 4:
                    // There are now 5 cols so change widths
                    col1width = 3;
                    col2width = 2;
                    col3width = 2;
                    col4width = 2;
                    col5width = 3;
                    col6width = 3;
                    col7width = 3;
                    break;
                case 5:
                    // There are now 6 cols so change widths
                    col1width = 2;
                    col2width = 2;
                    col3width = 2;
                    col4width = 2;
                    col5width = 2;
                    col6width = 2;
                    col7width = 2;
            }
            displayedItems++;
        }

        // Domain Dictionary
        if(viewOptions.devDomainDictVisible) {
            domainDictionary =
                <DomainDictionaryContainer params={{
                    designId: userContext.designId,
                    designVersionId: userContext.designVersionId
                }}/>;

            switch(displayedItems){
                case 2:
                    // There are now 3 cols so change widths
                    col1width = 4;
                    col2width = 4;
                    col3width = 4;
                    col4width = 4;
                    col5width = 4;
                    col6width = 4;
                    col7width = 4;
                    break;
                case 3:
                    // There are now 4 cols so change widths
                    col1width = 3;
                    col2width = 3;
                    col3width = 3;
                    col4width = 3;
                    col5width = 3;
                    col6width = 3;
                    col7width = 3;
                    break;
                case 4:
                    // There are now 5 cols so change widths
                    col1width = 4;
                    col2width = 2;
                    col3width = 2;
                    col4width = 2;
                    col5width = 2;
                    col6width = 2;
                    col7width = 2;
                    break;
                case 5:
                    // There are now 6 cols so change widths
                    col1width = 2;
                    col2width = 2;
                    col3width = 2;
                    col4width = 2;
                    col5width = 2;
                    col6width = 2;
                    col7width = 2;
                    break;
                case 6:
                    // There are now 7 cols so change widths
                    col1width = 2;
                    col2width = 2;
                    col3width = 2;
                    col4width = 2;
                    col5width = 2;
                    col6width = 1;
                    col7width = 1;
                    break;
            }
            displayedItems++;
        }

        // Test Summary - this actually just makes col 1 wider
        if(viewOptions.devTestSummaryVisible){

            switch(displayedItems){
                case 1:
                    col1width = 12;
                    col2width = 0;
                    col3width = 0;
                    col4width = 0;
                    col5width = 0;
                    col6width = 0;
                    col7width = 0;
                    break;
                case 2:
                    col1width = 8;
                    col2width = 4;
                    col3width = 4;
                    col4width = 4;
                    col5width = 4;
                    col6width = 4;
                    col7width = 4;
                    break;
                case 3:
                    col1width = 6;
                    col2width = 3;
                    col3width = 3;
                    col4width = 3;
                    col5width = 3;
                    col6width = 3;
                    col7width = 3;
                    break;
                case 4:
                    col1width = 6;
                    col2width = 2;
                    col3width = 2;
                    col4width = 2;
                    col5width = 2;
                    col6width = 2;
                    col7width = 2;
                    break;
                case 5:
                    col1width = 4;
                    col2width = 2;
                    col3width = 2;
                    col4width = 2;
                    col5width = 2;
                    col6width = 2;
                    col7width = 2;
                    break;
                case 6:
                    col1width = 7;
                    col2width = 1;
                    col3width = 1;
                    col4width = 1;
                    col5width = 1;
                    col6width = 1;
                    col7width = 1;
                    break;
                case 7:
                    col1width = 6;
                    col2width = 1;
                    col3width = 1;
                    col4width = 1;
                    col5width = 1;
                    col6width = 1;
                    col7width = 1;
                    break;
            }
        }

        // Create the layout depending on the current view...
        if(wpApplications) {

            let col1 =
                <Col md={col1width} className="scroll-col">
                    {design}
                </Col>;

            let col2 = '';
            if(viewOptions.devDetailsVisible){
                col2 =
                    <Col md={col2width} className="scroll-col">
                        {designDetails}
                    </Col>;
            }

            let col3 = '';
            if(viewOptions.devAccTestsVisible){
                col3 =
                    <Col md={col3width} className="scroll-col">
                        {featureTests}
                    </Col>;
            }

            let col4 = '';
            if(viewOptions.devFeatureFilesVisible){
                col4 =
                    <Col md={col4width} className="scroll-col">
                        {devFiles}
                    </Col>;
            }

            let col5 = '';
            if(viewOptions.devIntTestsVisible){
                col5 =
                    <Col md={col5width} className="scroll-col">
                        {intTests}
                    </Col>;
            }

            let col6 = '';
            if(viewOptions.devModTestsVisible){
                col6 =
                    <Col md={col6width} className="scroll-col">
                        {unitTests}
                    </Col>;
            }

            let col7 = '';
            if(viewOptions.devDomainDictVisible){
                col7 =
                    <Col md={col7width} className="scroll-col">
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
                        {col7}
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


    }
}


DevApplicationsList.propTypes = {
    wpApplications: PropTypes.array.isRequired,
    featureFiles:   PropTypes.array.isRequired,
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext:        state.currentUserItemContext,
        currentItemName:    state.currentDesignComponentName,
        view:               state.currentAppView,
        mode:               state.currentViewMode,
        viewOptions:        state.currentUserViewOptions
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
DevApplicationsList = connect(mapStateToProps)(DevApplicationsList);


export default EditDesignImplementationContainer = createContainer(({params}) => {

    // The editor container will start by rendering a list of Applications in the relevant work package
    return ClientContainerServices.getEditorApplicationData(
        params.view,
        params.designVersionId,
        params.designUpdateId,
        params.workPackageId
    );


}, DevApplicationsList);