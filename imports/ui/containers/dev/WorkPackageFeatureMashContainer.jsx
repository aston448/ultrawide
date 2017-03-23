// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';


// Ultrawide Collections


// Ultrawide GUI Components
import WorkPackageFeatureMashItem               from '../../components/dev/WorkPackageFeatureMashItem.jsx';
import WorkPackageFeatureAspectMashContainer    from './WorkPackageFeatureAspectMashContainer.jsx';
import WorkPackageTestScenarioMashContainer     from './WorkPackageScenarioMashContainer.jsx';
import AcceptanceTestsScenarioMashItem          from '../../components/dev/AcceptanceTestScenarioMashItem.jsx';
import DetailsViewHeader    from '../../components/common/DetailsViewHeader.jsx';
import DetailsViewFooter    from '../../components/common/DetailsViewFooter.jsx';

// Ultrawide Services
import {DetailsViewType, RoleType, DisplayContext, UserDevFeatureStatus, MashStatus, ComponentType, LogLevel}    from '../../../constants/constants.js';
import {log} from '../../../common/utils.js';
import TextLookups from '../../../common/lookups.js';

import ClientContainerServices          from '../../../apiClient/apiClientContainerServices.js';
import ClientUserContextServices        from '../../../apiClient/apiClientUserContext.js';
import ClientMashDataServices           from '../../../apiClient/apiClientMashData.js';
import ClientTestIntegrationServices    from '../../../apiClient/apiClientTestIntegration.js';


// Bootstrap
import {Panel} from 'react-bootstrap';
import {InputGroup} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';
import {Grid, Row, Col} from 'react-bootstrap';
import {ButtonGroup, ButtonToolbar, Button, } from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design / Dev Integration Test Mash Container - Contains picture of the currently selected design Feature / Feature
// Aspect / Scenario as related to Dev Integration Testing
// Renders list of Features if an Application or DesignSection is currently selected
//
// ---------------------------------------------------------------------------------------------------------------------

class WorkPackageFeatureMashList extends Component {
    constructor(props) {
        super(props);

    }

    shouldComponentUpdate(nextProps, nextState){
        return true;
    }

    onExportFeatureFile(userContext){
        ClientMashDataServices.exportFeature(userContext);
    }

    onExportIntegrationTests(userContext, userRole){
        ClientTestIntegrationServices.exportIntegrationTestFile(userContext, userRole);
    }

    getEditorClass(){
        return ClientUserContextServices.getWindowSizeClass();
    }

    renderFeatures(mashData, displayContext){

        //console.log("Rendering mash list of length " + mashData.length);

        return mashData.map((mashItem) => {
            if(mashItem) {
                return (
                    <WorkPackageFeatureMashItem
                        key={mashItem._id}
                        mashItem={mashItem}
                        displayContext={displayContext}
                    />
                );
            }
        });
    };

    renderNonDesignScenarios(nonDesignScenarioData, displayContext){
        return nonDesignScenarioData.map((mashItem) => {
            if(mashItem) {
                return (
                    <AcceptanceTestsScenarioMashItem
                        key={mashItem._id}
                        mashItem={mashItem}
                        displayContext={displayContext}
                    />
                );
            }
        });
    }


    render() {

        const {designMashItemData, nonDesignScenarioData, existingFeatureFile, view, mode, displayContext, userContext, userRole, userViewOptions, testDataStale} = this.props;

        let panelHeader = '';
        let secondPanelHeader = '';
        let detailsType = '';
        let menuVisible = false;

        let itemHeader = '';
        let secondPanel = <div></div>;

        const nameData = ClientUserContextServices.getContextNameData(userContext);

        switch(displayContext){
            case DisplayContext.MASH_INT_TESTS:
                detailsType = DetailsViewType.VIEW_INT_TESTS;
                break;
            case DisplayContext.MASH_UNIT_TESTS:
                detailsType = DetailsViewType.VIEW_UNIT_TESTS;
                break;
        }

        switch(userContext.designComponentType){
            case ComponentType.APPLICATION:
                panelHeader = TextLookups.mashTestTypes(displayContext) + ' tests for ' + nameData.application;
                break;
            case ComponentType.DESIGN_SECTION:
                panelHeader = TextLookups.mashTestTypes(displayContext) + ' tests in ' + nameData.designSection;
                break;
            case ComponentType.FEATURE:
                switch(displayContext){
                    case DisplayContext.MASH_ACC_TESTS:

                        // Button is to export a new file or update the existing one
                        let exportText = 'Export Feature File';
                        if(existingFeatureFile){
                            //if(existingFeatureFile.featureStatus === UserDevFeatureStatus.FEATURE_IN_WP) {
                                exportText = 'Update Feature File';
                            //}
                        }
                        panelHeader =
                            <Grid className="close-grid">
                                <Row>
                                    <Col md={8} className="close-col">
                                        <div className="panel-grid-header">{TextLookups.mashTestTypes(displayContext) + ' tests for ' + nameData.feature}</div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="pull-right">
                                            <Button bsSize="xs" bsStyle="info" onClick={ () => this.onExportFeatureFile(userContext)}>{exportText}</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Grid>;

                        if(nonDesignScenarioData.length > 0){
                            secondPanelHeader = 'Scenarios in ' + nameData.feature + ' test NOT in Design';
                        }
                        break;
                    case DisplayContext.MASH_INT_TESTS:
                        panelHeader = TextLookups.mashTestTypes(displayContext) + ' tests for ' + nameData.feature;
                        // Allow feature export to int test file
                        menuVisible = true;
                        break;
                    case DisplayContext.MASH_UNIT_TESTS:
                        panelHeader = TextLookups.mashTestTypes(displayContext) + ' tests for ' + nameData.feature;
                        break;
                }

                break;
            case ComponentType.FEATURE_ASPECT:
                panelHeader = nameData.featureAspect + ' ' + TextLookups.mashTestTypes(displayContext) + ' tests for ' + nameData.feature;
                itemHeader = 'Scenario';
                break;
            case ComponentType.SCENARIO:
                panelHeader = TextLookups.mashTestTypes(displayContext) + ' test for ' + nameData.scenario;
                break;
        }


        let mainPanel = <div></div>;

        if(designMashItemData.length > 0 && !testDataStale) {
            switch(userContext.designComponentType){
                case ComponentType.APPLICATION:
                case ComponentType.DESIGN_SECTION:
                    mainPanel =
                        <div>
                            {this.renderFeatures(designMashItemData, displayContext)}
                        </div>;
                    break;
                case ComponentType.FEATURE:

                    mainPanel =
                       <WorkPackageFeatureAspectMashContainer params={{
                           userContext:     userContext,
                           featureMash:     null,
                           displayContext:  displayContext
                        }}/>;


                    // For Acceptance tests we also show non-designed Scenarios
                    if(displayContext === DisplayContext.MASH_ACC_TESTS && nonDesignScenarioData.length > 0){
                        secondPanel =
                            <Panel className="panel-text panel-text-body" header={secondPanelHeader}>
                                {this.renderNonDesignScenarios(nonDesignScenarioData, displayContext)}
                            </Panel>;
                    }

                    break;
                case ComponentType.FEATURE_ASPECT:
                    mainPanel =
                        <WorkPackageScenarioMashContainer params={{
                            userContext:    userContext,
                            parentMash:     null,
                            displayContext:  displayContext
                        }}/>;
                    break;
                case ComponentType.SCENARIO:
                    switch(displayContext){
                        case DisplayContext.MASH_ACC_TESTS:
                            // Render the step editor
                            mainPanel =
                                <MashScenarioStepContainer params={{
                                    userContext: userContext
                                }}/>;
                            break;
                        case DisplayContext.MASH_INT_TESTS:
                            // Just show the scenario result
                            mainPanel =
                                <WorkPackageScenarioMashContainer params={{
                                    userContext:    userContext,
                                    parentMash:     null,
                                    displayContext:  displayContext
                                }}/>;

                            break;
                        case DisplayContext.MASH_UNIT_TESTS:
                            // Show the module tests for the Scenario
                            mainPanel =
                                <WorkPackageScenarioMashContainer params={{
                                    userContext:    userContext,
                                    parentMash:     null,
                                    displayContext:  displayContext
                                }}/>;
                            break;
                    }


            }
        } else {

            if(testDataStale){

                // Reloading data
                mainPanel =
                    <div className="design-item-note">Loading test data...</div>;

            } else {

                // No data for some reason
                if (userContext.designComponentId === 'NONE') {
                    mainPanel = <div className="design-item-note">Select a Design item</div>;
                } else {
                    mainPanel =
                        <div className="design-item-note">No data for this item - try refreshing test data</div>;
                }
            }

        }

        // Get correct window height
        const editorClass = this.getEditorClass();

        return(

            <div className="design-editor-container">
                <DetailsViewHeader
                    detailsType={detailsType}
                    isClosable={true}
                    titleText={panelHeader}
                />
                <div className={editorClass}>
                    {mainPanel}
                    {secondPanel}
                </div>
                <DetailsViewFooter
                    detailsType={detailsType}
                    actionsVisible={menuVisible}
                />
            </div>
        );

    }
}

WorkPackageFeatureMashList.propTypes = {
    designMashItemData: PropTypes.array.isRequired,
    nonDesignScenarioData: PropTypes.array,
    existingFeatureFile: PropTypes.object,
    displayContext: PropTypes.string.isRequired
};


// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        view:               state.currentAppView,
        mode:               state.currentViewMode,
        userContext:        state.currentUserItemContext,
        userRole:           state.currentUserRole,
        testDataStale:      state.testDataStale,
        userViewOptions:    state.currentUserViewOptions
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
WorkPackageFeatureMashList = connect(mapStateToProps)(WorkPackageFeatureMashList);


export default WorkPackageFeatureMashContainer = createContainer(({params}) => {


    let designMashItemData = ClientContainerServices.getWorkPackageMashData(params.userContext, null);
    let nonDesignScenarioData = ClientContainerServices.getNonDesignAcceptanceScenarioData(params.userContext);
    let existingFeatureFile = ClientContainerServices.checkForExistingFeatureFile(params.userContext);

    log((msg) => console.log(msg), LogLevel.DEBUG, "Integration design mash data returned {} features", designMashItemData.length);

    return{
        designMashItemData: designMashItemData,
        nonDesignScenarioData: nonDesignScenarioData,
        existingFeatureFile: existingFeatureFile,
        displayContext: params.displayContext,
    }


}, WorkPackageFeatureMashList);