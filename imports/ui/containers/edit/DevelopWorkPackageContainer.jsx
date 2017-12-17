// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import DesignComponentTarget                from '../../components/edit/DesignComponentTarget.jsx';
import DesignComponentTextContainer         from '../../containers/edit/DesignComponentTextContainer.jsx';
//import DevFilesContainer                    from '../../containers/dev/DevFilesContainer.jsx';
import DomainDictionaryContainer            from '../../containers/edit/DomainDictionaryContainer.jsx';
import DesignEditorHeader                   from '../../components/common/DesignEditorHeader.jsx';
import DesignEditorFooter                   from '../../components/common/DesignEditorFooter.jsx';
import MashSelectedItemContainer            from '../../containers/mash/MashSelectedItemContainer.jsx';

// Ultrawide Services
import { ComponentType, ViewType, DisplayContext } from '../../../constants/constants.js';

import ClientWorkPackageComponentServices   from '../../../apiClient/apiClientWorkPackageComponent.js';
import ClientDataServices                   from '../../../apiClient/apiClientDataServices.js';
import ClientDesignVersionServices          from '../../../apiClient/apiClientDesignVersion.js';
import ClientUserSettingsServices           from '../../../apiClient/apiClientUserSettings.js';

// Bootstrap
import {Grid, Row, Col, Tabs, Tab} from 'react-bootstrap';
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

    getUpdateItem(application, designUpdateId){

        return ClientDesignVersionServices.getDesignUpdateItemForUpdate(application, designUpdateId);
    }

    getWpItem(application, workPackageId){

        return ClientWorkPackageComponentServices.getWorkPackageComponent(application.componentReferenceId, workPackageId);
    }

    getEditorClass(){

        return ClientUserSettingsServices.getWindowSizeClassForDesignEditor();
    }

    // A list of top level applications in the work package(s)
    renderApplications(wpApplications, view, mode, context, testSummary, userContext) {
        return wpApplications.map((application) => {
            return (
                <DesignComponentTarget
                    key={application._id}
                    currentItem={application}
                    updateItem={this.getUpdateItem(application, userContext.designUpdateId)}
                    wpItem={this.getWpItem(application, userContext.workPackageId)}
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
        let accTests = '';
        let domainDictionary = '';
        let displayedItems = 1;

        // Possible Layout is: DESIGN | DETAILS (opt) | ACCEPTANCE TESTS + FILES (opt) | INTEGRATION TESTS (opt) | MODULE TESTS (opt) | DOMAIN DICT (opt)

        // WHAT COMPONENTS ARE VISIBLE (Besides Design)

        // Start by assuming only 2 cols
        let col1width = 5;
        let col2width = 7;
        let col3width = 7;
        let col4width = 7;
        let col5width = 7;
        let col6width = 7;
        let col7width = 7;

        // Get correct window height
        const editorClass = this.getEditorClass();

        // Working Design
        let design =
            <div className="design-editor-container">
                <DesignEditorHeader
                    displayContext={DisplayContext.DEV_DESIGN}
                />
                <div className={editorClass}>
                    {this.renderApplications(wpApplications, view, mode, DisplayContext.DEV_DESIGN, viewOptions.testSummaryVisible, userContext)}
                </div>
                <DesignEditorFooter
                    displayContext={DisplayContext.DEV_DESIGN}
                    hasDesignSummary={false}
                />
            </div>;

        // Details Pane
        designDetails =
            <DesignComponentTextContainer params={{
                currentContext: userContext,
                view: view,
                displayContext: DisplayContext.EDIT_STEP_WP_DEV
            }}/>;

        // Acceptance Tests Pane
        if(userContext.designComponentType !== 'NONE'){
            switch(userContext.designComponentType){
                case ComponentType.APPLICATION:
                    accTests =
                        <MashSelectedItemContainer params={{
                            childComponentType: ComponentType.DESIGN_SECTION,
                            designItemId: 'NONE',
                            userContext: userContext,
                            view: view,
                            displayContext: DisplayContext.MASH_ACC_TESTS
                        }}/>;
                    break;
                case ComponentType.DESIGN_SECTION:
                    accTests =
                        <div>
                            <MashSelectedItemContainer params={{
                                childComponentType: ComponentType.FEATURE,
                                designItemId: 'NONE',
                                userContext: userContext,
                                view: view,
                                displayContext: DisplayContext.MASH_ACC_TESTS
                            }}/>
                            <MashSelectedItemContainer params={{
                                childComponentType: ComponentType.DESIGN_SECTION,
                                designItemId: 'NONE',
                                userContext: userContext,
                                view: view,
                                displayContext: DisplayContext.MASH_ACC_TESTS
                            }}/>
                        </div>;
                    break;
                case ComponentType.FEATURE:
                    accTests =
                        <MashSelectedItemContainer params={{
                            childComponentType: ComponentType.FEATURE_ASPECT,
                            designItemId: 'NONE',
                            userContext: userContext,
                            view: view,
                            displayContext: DisplayContext.MASH_ACC_TESTS
                        }}/>;
                    break;
                case ComponentType.FEATURE_ASPECT:
                    accTests =
                        <MashSelectedItemContainer params={{
                            childComponentType: ComponentType.SCENARIO,
                            designItemId: 'NONE',
                            userContext: userContext,
                            view: view,
                            displayContext: DisplayContext.MASH_ACC_TESTS
                        }}/>;
                    break;
                case ComponentType.SCENARIO:
                    accTests =
                        <MashSelectedItemContainer params={{
                            childComponentType: ComponentType.TEST,
                            designItemId: 'NONE',
                            userContext: userContext,
                            view: view,
                            displayContext: DisplayContext.MASH_ACC_TESTS
                        }}/>;

                    break;
            }
        } else {
            accTests =
                <MashSelectedItemContainer params={{
                    childComponentType: 'NONE',
                    designItemId: 'NONE',
                    userContext: userContext,
                    view: view,
                    displayContext: DisplayContext.MASH_ACC_TESTS
                }}/>;
        }


        // Integration Tests Pane
        if(userContext.designComponentType !== 'NONE'){
            switch(userContext.designComponentType){
                case ComponentType.APPLICATION:
                    intTests =
                        <MashSelectedItemContainer params={{
                            childComponentType: ComponentType.DESIGN_SECTION,
                            designItemId: 'NONE',
                            userContext: userContext,
                            view: view,
                            displayContext: DisplayContext.MASH_INT_TESTS
                        }}/>;
                    break;
                case ComponentType.DESIGN_SECTION:
                    intTests =
                        <div>
                            <MashSelectedItemContainer params={{
                                childComponentType: ComponentType.FEATURE,
                                designItemId: 'NONE',
                                userContext: userContext,
                                view: view,
                                displayContext: DisplayContext.MASH_INT_TESTS
                            }}/>
                            <MashSelectedItemContainer params={{
                                childComponentType: ComponentType.DESIGN_SECTION,
                                designItemId: 'NONE',
                                userContext: userContext,
                                view: view,
                                displayContext: DisplayContext.MASH_INT_TESTS
                            }}/>
                        </div>;
                    break;
                case ComponentType.FEATURE:
                    intTests =
                        <MashSelectedItemContainer params={{
                            childComponentType: ComponentType.FEATURE_ASPECT,
                            designItemId: 'NONE',
                            userContext: userContext,
                            view: view,
                            displayContext: DisplayContext.MASH_INT_TESTS
                        }}/>;
                    break;
                case ComponentType.FEATURE_ASPECT:
                    intTests =
                        <MashSelectedItemContainer params={{
                            childComponentType: ComponentType.SCENARIO,
                            designItemId: 'NONE',
                            userContext: userContext,
                            view: view,
                            displayContext: DisplayContext.MASH_INT_TESTS
                        }}/>;
                        break;
                case ComponentType.SCENARIO:
                    intTests =
                        <MashSelectedItemContainer params={{
                            childComponentType: ComponentType.TEST,
                            designItemId: 'NONE',
                            userContext: userContext,
                            view: view,
                            displayContext: DisplayContext.MASH_INT_TESTS
                        }}/>;

                    break;
            }
        } else {
            intTests =
                <MashSelectedItemContainer params={{
                    childComponentType: 'NONE',
                    designItemId: 'NONE',
                    userContext: userContext,
                    view: view,
                    displayContext: DisplayContext.MASH_INT_TESTS
                }}/>;
        }

        // Unit Tests Pane
        if(userContext.designComponentType !== 'NONE'){
            switch(userContext.designComponentType){
                case ComponentType.APPLICATION:
                    unitTests =
                        <MashSelectedItemContainer params={{
                            childComponentType: ComponentType.DESIGN_SECTION,
                            designItemId: 'NONE',
                            userContext: userContext,
                            view: view,
                            displayContext: DisplayContext.MASH_UNIT_TESTS
                        }}/>;
                    break;
                case ComponentType.DESIGN_SECTION:
                    unitTests =
                        <div>
                            <MashSelectedItemContainer params={{
                                childComponentType: ComponentType.FEATURE,
                                designItemId: 'NONE',
                                userContext: userContext,
                                view: view,
                                displayContext: DisplayContext.MASH_UNIT_TESTS
                            }}/>
                            <MashSelectedItemContainer params={{
                                childComponentType: ComponentType.DESIGN_SECTION,
                                designItemId: 'NONE',
                                userContext: userContext,
                                view: view,
                                displayContext: DisplayContext.MASH_UNIT_TESTS
                            }}/>
                        </div>;
                    break;
                case ComponentType.FEATURE:
                    unitTests =
                        <MashSelectedItemContainer params={{
                            childComponentType: ComponentType.FEATURE_ASPECT,
                            designItemId: 'NONE',
                            userContext: userContext,
                            view: view,
                            displayContext: DisplayContext.MASH_UNIT_TESTS
                        }}/>;
                    break;
                case ComponentType.FEATURE_ASPECT:
                    unitTests =
                        <MashSelectedItemContainer params={{
                            childComponentType: ComponentType.SCENARIO,
                            designItemId: 'NONE',
                            userContext: userContext,
                            view: view,
                            displayContext: DisplayContext.MASH_UNIT_TESTS
                        }}/>;
                        break;
                case ComponentType.SCENARIO:
                    unitTests =
                        <MashSelectedItemContainer params={{
                            childComponentType: ComponentType.TEST,
                            designItemId: 'NONE',
                            userContext: userContext,
                            view: view,
                            displayContext: DisplayContext.MASH_UNIT_TESTS
                        }}/>;

                    break;
            }
        } else {
            unitTests =
                <MashSelectedItemContainer params={{
                    childComponentType: 'NONE',
                    designItemId: 'NONE',
                    userContext: userContext,
                    view: view,
                    displayContext: DisplayContext.MASH_UNIT_TESTS
                }}/>;
        }

        domainDictionary =
            <DomainDictionaryContainer params={{
                designId: userContext.designId,
                designVersionId: userContext.designVersionId
            }}/>;


        // Layout ------------------------------------------------------------------------------------------------------

        if(viewOptions.workShowAllAsTabs){

            // Main design plus tabs column
            col1width = 6;
            col2width = 6;

        } else {

            // Details
            if (viewOptions.designDetailsVisible) {

                displayedItems++;
            }

            // Acceptance (Feature) Tests
            if (viewOptions.devAccTestsVisible) {

                switch (displayedItems) {
                    case 1:
                        // There are now 2 cols so change widths
                        col1width = 5;
                        col2width = 7;
                        col3width = 7;
                        col4width = 7;
                        col5width = 7;
                        col6width = 7;
                        col7width = 7;
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

            if (viewOptions.devFeatureFilesVisible) {

                switch (displayedItems) {
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
            if (viewOptions.devIntTestsVisible) {

                switch (displayedItems) {
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

            // Unt Tests
            if (viewOptions.devUnitTestsVisible) {

                switch (displayedItems) {
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
            if (viewOptions.testSummaryVisible) {

                switch (displayedItems) {
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
                        col1width = 7;
                        col2width = 5;
                        col3width = 5;
                        col4width = 5;
                        col5width = 5;
                        col6width = 5;
                        col7width = 5;
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
        }

        // Create the layout depending on the current view...
        if(wpApplications) {

            if(viewOptions.workShowAllAsTabs){

                let col1 =
                    <Col id="designCol" md={col1width} className="close-col">
                        {design}
                    </Col>;

                let col2 =
                    <Col id="tabsCol" md={col2width} className="close-col">
                        <Tabs className="top-tabs" defaultActiveKey={1} id="updatable-view_tabs">
                            <Tab eventKey={1} title="DETAILS">{designDetails}</Tab>
                            <Tab eventKey={2} title="ACCEPTANCE TESTS">{accTests}</Tab>
                            <Tab eventKey={3} title="INTEGRATION TESTS">{intTests}</Tab>
                            <Tab eventKey={4} title="UNIT TESTS">{unitTests}</Tab>
                            <Tab eventKey={5} title="DICTIONARY">{domainDictionary}</Tab>
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
                let col1 =
                    <Col md={col1width} className="close-col">
                        {design}
                    </Col>;

                let col2 = '';
                if (viewOptions.designDetailsVisible) {
                    col2 =
                        <Col md={col2width} className="close-col">
                            {designDetails}
                        </Col>;
                }

                let col3 = '';
                if (viewOptions.devAccTestsVisible) {
                    col3 =
                        <Col md={col3width} className="close-col">
                            {accTests}
                        </Col>;
                }

                let col4 = '';
                if (viewOptions.devFeatureFilesVisible) {
                    col4 =
                        <Col md={col4width} className="close-col">
                            {devFiles}
                        </Col>;
                }

                let col5 = '';
                if (viewOptions.devIntTestsVisible) {
                    col5 =
                        <Col md={col5width} className="close-col">
                            {intTests}
                        </Col>;
                }

                let col6 = '';
                if (viewOptions.devUnitTestsVisible) {
                    col6 =
                        <Col md={col6width} className="close-col">
                            {unitTests}
                        </Col>;
                }

                let col7 = '';
                if (viewOptions.devDomainDictVisible) {
                    col7 =
                        <Col md={col7width} className="close-col">
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


export default DevelopWorkPackageContainer = createContainer(({params}) => {

    // The editor container will start by rendering a list of Applications in the relevant work package
    return ClientDataServices.getEditorApplicationData(
        params.userContext,
        params.view
    );


}, DevApplicationsList);