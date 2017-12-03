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
import DesignComponentAdd               from '../../components/common/DesignComponentAdd.jsx';
import DesignComponentTextContainer     from './DesignComponentTextContainer.jsx';
import DomainDictionaryContainer        from './DomainDictionaryContainer.jsx';
import MashSelectedItemContainer        from '../mash/MashSelectedItemContainer.jsx';
import ScenarioFinder                   from '../../components/search/ScenarioFinder.jsx';

// Ultrawide Services
import { ViewType, ViewMode, DisplayContext, RoleType, ComponentType } from '../../../constants/constants.js';

import ClientDesignComponentServices        from '../../../apiClient/apiClientDesignComponent.js';
import ClientDataServices              from '../../../apiClient/apiClientDataServices.js';
import ClientWorkPackageComponentServices   from '../../../apiClient/apiClientWorkPackageComponent.js';
import ClientDesignVersionServices          from '../../../apiClient/apiClientDesignVersion.js';
import ClientUserSettingsServices           from '../../../apiClient/apiClientUserSettings.js';

// Bootstrap
import {Grid, Row, Col, Tabs, Tab} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';
import {WorkPackageType} from "../../../constants/constants";


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Editor Container. Starts by rendering a list of Applications in the Design plus the text view and domain dictionary
//
// ---------------------------------------------------------------------------------------------------------------------

// Design Applications Container
// Export this for Unit Tests
export class DesignApplicationsList extends Component {
    constructor(props) {
        super(props);

    }

    onAddApplication(view, mode, designVersionId){

        // Add a new application to the design
        ClientDesignComponentServices.addApplicationToDesignVersion(view, mode, designVersionId);

    }

    getDesignItem(application, displayContext, userContext){
        // Design Item needed only in WP context (otherwise we already have it as the current item)
        if(displayContext === DisplayContext.WP_SCOPE || displayContext === DisplayContext.WP_VIEW || displayContext === DisplayContext.DEV_DESIGN) {
            if(userContext.designUpdateId === 'NONE'){
                return ClientWorkPackageComponentServices.getDesignItem(application._id, WorkPackageType.WP_BASE);
            } else {
                return ClientWorkPackageComponentServices.getDesignItem(application._id, WorkPackageType.WP_UPDATE);
            }
        } else {
            return application;
        }
    }

    getDesignVersionCurrentItem(userContext){
        return ClientDesignComponentServices.getCurrentItem(userContext);
    }

    getDesignUpdateItem(application, displayContext){
        if(displayContext === DisplayContext.WORKING_VIEW){
            return ClientDesignVersionServices.getDesignUpdateItemForUpdatableVersion(application);
        } else {
            return null;
        }
    }

    getEditorClass(){
        return ClientUserSettingsServices.getWindowSizeClassForDesignEditor();
    }

    // A list of top level applications in the design / design update
    renderApplications(applications, displayContext, userContext, view, mode, testSummary) {
        return applications.map((application) => {
            return (
                <DesignComponentTarget
                    key={application._id}
                    currentItem={application}
                    designItem={this.getDesignItem(application, displayContext, userContext)}
                    updateItem={this.getDesignUpdateItem(application, displayContext)}
                    displayContext={displayContext}
                    view={view}
                    mode={mode}
                    testSummary={testSummary}
                />
            );

        });
    }

    componentWillReceiveProps(newProps){
        //console.log("DESIGN CONTAINER: NEW PROPS")
    }


    render() {

        const {baseApplications, workingApplications, designSummaryData, userContext, userRole, view, mode, viewOptions} = this.props;

        let layout = '';

        let addComponent = '';
        let displayedItems = 1;

        // Get the correct display context
        let displayContext = DisplayContext.BASE_VIEW;
        switch(view){
            case ViewType.DESIGN_NEW:
                displayContext = DisplayContext.BASE_EDIT;
                break;
            case ViewType.DESIGN_PUBLISHED:
                displayContext = DisplayContext.BASE_VIEW;
                break;
            case ViewType.DESIGN_UPDATABLE:
                displayContext = DisplayContext.WORKING_VIEW;
                break;
        }

        // Items ------------------------------------------------------------------------------------------------------

        if (mode === ViewMode.MODE_EDIT) {
            // Editing so include the Add Application control
            addComponent =
                <table>
                    <tbody>
                    <tr>
                        <td id="addApplication" className="control-table-data-app">
                            <DesignComponentAdd
                                addText="Add Application"
                                onClick={ () => this.onAddApplication(view, mode, userContext.designVersionId)}
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
        }

        // Get correct window height
        const editorClass = this.getEditorClass();
        let applications = [];

        // Display working version if in the updatable version view
        if(view === ViewType.DESIGN_UPDATABLE){
            applications = workingApplications;
        } else {
           applications = baseApplications;
        }

        let designEditor =
            <div className="design-editor-container">
                <DesignEditorHeader
                    displayContext={displayContext}
                />
                <div className={editorClass}>
                    {this.renderApplications(applications, displayContext, userContext, view, mode, viewOptions.testSummaryVisible)}
                    {addComponent}
                </div>
                <DesignEditorFooter
                    hasDesignSummary={true}
                    displayContext={displayContext}
                    designSummaryData={designSummaryData}
                />
            </div>;

        const designDetails =
            <DesignComponentTextContainer params={{
                currentContext: userContext,
                view: view,
                displayContext: displayContext
            }}/>;

        const domainDictionary =
            <DomainDictionaryContainer params={{
                designId: userContext.designId,
                designVersionId: userContext.designVersionId
            }}/>;

        const scenarioFinder =
            <ScenarioFinder
                displayContext={DisplayContext.BASE_VIEW}
            />;

        let intTests = '';

        if(userContext.designComponentType !== 'NONE'){
            switch(userContext.designComponentType){
                case ComponentType.APPLICATION:
                case ComponentType.DESIGN_SECTION:
                    // Tests not displayed for these items
                    intTests =
                        <MashSelectedItemContainer params={{
                            childComponentType: 'NONE',
                            designItemId: 'NONE',
                            userContext: userContext,
                            view: view,
                            displayContext: DisplayContext.MASH_INT_TESTS
                        }}/>;
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

        let unitTests = '';

        if(userContext.designComponentType !== 'NONE'){
            switch(userContext.designComponentType){
                case ComponentType.APPLICATION:
                case ComponentType.DESIGN_SECTION:
                    // Tests not displayed for these items
                    unitTests =
                        <MashSelectedItemContainer params={{
                            childComponentType: 'NONE',
                            designItemId: 'NONE',
                            userContext: userContext,
                            view: view,
                            displayContext: DisplayContext.MASH_UNIT_TESTS
                        }}/>;
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

        // WHAT COMPONENTS ARE VISIBLE (Besides Design)

        // DESIGN (+summ) | DETAILS (o) | DICT (o) | INT TESTS (o) | UNIT TESTS (o)

        // Start by assuming only 2 cols
        let col1width = 6;
        let col2width = 6;
        let col3width = 6;
        let col4width = 6;
        let col5width = 6;

        if(viewOptions.designShowAllAsTabs){

            // Layout is 6 - 6

        } else {

            // Details
            if (viewOptions.designDetailsVisible) {

                displayedItems++;
            }

            // Domain Dictionary
            if (viewOptions.designDomainDictVisible) {

                if (displayedItems === 2) {
                    // There are now 3 cols so change widths
                    col1width = 4;
                    col2width = 4;
                    col3width = 4;
                    col5width = 4;
                }

                displayedItems++;
            }

            if (viewOptions.devIntTestsVisible) {

                switch (displayedItems) {
                    case 1:
                        // Now 2 items
                        col1width = 6;
                        col2width = 6;
                        col3width = 6;
                        col4width = 6;
                        col5width = 6;
                        break;
                    case 2:
                        // Now 3 items
                        col1width = 4;
                        col2width = 4;
                        col3width = 4;
                        col4width = 4;
                        col5width = 4;
                        break;
                    case 3:
                        // Now 4 items
                        col1width = 3;
                        col2width = 3;
                        col3width = 3;
                        col4width = 3;
                        col5width = 3;
                        break;
                }

                displayedItems++;
            }

            if (viewOptions.devUnitTestsVisible) {

                switch (displayedItems) {
                    case 1:
                        // Now 2 items
                        col1width = 6;
                        col2width = 6;
                        col3width = 6;
                        col4width = 6;
                        col5width = 6;
                        break;
                    case 2:
                        // Now 3 items
                        col1width = 4;
                        col2width = 4;
                        col3width = 4;
                        col4width = 4;
                        col5width = 4;
                        break;
                    case 3:
                        // Now 4 items
                        col1width = 3;
                        col2width = 3;
                        col3width = 3;
                        col4width = 3;
                        col5width = 3;
                        break;
                    case 4:
                        // Now 5 items
                        col1width = 3;
                        col2width = 3;
                        col3width = 2;
                        col4width = 2;
                        col5width = 2;
                        break;
                }

                displayedItems++;
            }

            // Test Summary - this actually just makes col 1 wider
            if (viewOptions.testSummaryVisible) {

                switch (displayedItems) {
                    case 1:
                        // Col 1 gets bigger
                        col1width = 12;
                        col2width = 0;
                        col3width = 0;
                        col4width = 0;
                        col5width = 0;
                        break;
                    case 2:
                        // Col 1 gets bigger
                        col1width = 8;
                        col2width = 4;
                        col3width = 4;
                        col4width = 4;
                        col5width = 4;
                        break;
                    case 3:
                        // Col 1 gets bigger
                        col1width = 6;
                        col2width = 3;
                        col3width = 3;
                        col4width = 3;
                        col5width = 3;
                        break;
                    case 4:
                        // Col 1 gets bigger
                        col1width = 6;
                        col2width = 2;
                        col3width = 2;
                        col4width = 2;
                        col5width = 2;
                        break;
                    case 5:
                        // Col 1 gets bigger
                        col1width = 4;
                        col2width = 2;
                        col3width = 2;
                        col4width = 2;
                        col5width = 2;
                        break;
                }
            }
        }

        // Layout ------------------------------------------------------------------------------------------------------

        // Create the layout depending on the current view...
        if(baseApplications) {

            let col1 =
                <Col id="column1" md={col1width} className="close-col">
                    {designEditor}
                </Col>;


            // Optional display columns
            if(viewOptions.designShowAllAsTabs){

                let col2 = '';
                switch(view){
                    case ViewType.DESIGN_NEW:
                    case ViewType.DESIGN_PUBLISHED:
                    case ViewType.DESIGN_UPDATABLE:
                        col2 =
                            <Col id="column2" md={col2width} className="close-col">
                                <Tabs className="top-tabs" defaultActiveKey={1} id="updatable-view_tabs">
                                    <Tab eventKey={1} title="DETAILS">{designDetails}</Tab>
                                    <Tab eventKey={2} title="DICTIONARY">{domainDictionary}</Tab>
                                    <Tab eventKey={3} title="INTEGRATION TESTS">{intTests}</Tab>
                                    <Tab eventKey={4} title="UNIT TESTS">{unitTests}</Tab>
                                    <Tab eventKey={5} title="FIND SCENARIO">{scenarioFinder}</Tab>
                                </Tabs>
                            </Col>;
                        break;
                }

                layout =
                    <Grid >
                        <Row>
                            {col1}
                            {col2}
                        </Row>
                    </Grid>;

            } else {
                let col2 = '';
                if (viewOptions.designDetailsVisible) {
                    col2 =
                        <Col id="column2" md={col2width} className="close-col">
                            {designDetails}
                        </Col>;
                }

                let col3 = '';
                if (viewOptions.designDomainDictVisible) {
                    col3 =
                        <Col id="column3" md={col3width} className="close-col">
                            {domainDictionary}
                        </Col>;
                }

                let col4 = '';
                if (viewOptions.devIntTestsVisible) {
                    col4 =
                        <Col id="column4" md={col4width} className="close-col">
                            {intTests}
                        </Col>;
                }

                let col5 = '';
                if (viewOptions.devUnitTestsVisible) {
                    col5 =
                        <Col id="column5" md={col5width} className="close-col">
                            {unitTests}
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


        } else {
            // No apps yet so just return the add new item (if there is one)
            return (
                <div>
                    {addComponent}
                </div>
            );
        }


    }
}


DesignApplicationsList.propTypes = {
    baseApplications: PropTypes.array.isRequired,
    workingApplications: PropTypes.array.isRequired,
    designSummaryData: PropTypes.object
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext:            state.currentUserItemContext,
        view:                   state.currentAppView,
        mode:                   state.currentViewMode,
        userRole:               state.currentUserRole,
        viewOptions:            state.currentUserViewOptions,
        currentViewDataValue:   state.currentViewOptionsDataValue
    }
}

// Export the full wrapped Redux Container as default
export default EditDesignContainer = createContainer(({params}) => {

    // The editor container will start by rendering a list of Applications in the design
    return ClientDataServices.getEditorApplicationData(
        params.userContext,
        params.view,
    );

}, connect(mapStateToProps)(DesignApplicationsList));