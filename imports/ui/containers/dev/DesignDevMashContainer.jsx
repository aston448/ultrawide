// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';


// Ultrawide Collections


// Ultrawide GUI Components
import DesignDevMashItem            from '../../components/dev/DesignDevMashItem.jsx';
import MashFeatureAspectContainer   from '../../containers/dev/MashFeatureAspectContainer.jsx';
import MashScenarioStepContainer    from '../../containers/dev/MashScenarioStepContainer.jsx';

// Ultrawide Services
import {RoleType, DisplayContext, MashStatus, ComponentType}    from '../../../constants/constants.js';

import ClientContainerServices      from '../../../apiClient/apiClientContainerServices.js';
import UserContextServices          from '../../../apiClient/apiClientUserContext.js';
import ClientMashDataServices       from '../../../apiClient/apiClientMashData.js';

// Bootstrap
import {Panel} from 'react-bootstrap';
import {InputGroup} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design / Dev Mash Container - Contains picture of the currently selected design Feature / Feature Aspect / Scenario as related to dev testing files
//
// ---------------------------------------------------------------------------------------------------------------------

class DesignItemMashList extends Component {
    constructor(props) {
        super(props);

    }


    renderDesignItemMash(mashData){

        console.log("Rendering mash list of length " + mashData.length);

        return mashData.map((mashItem) => {
            if(mashItem) {
                return (
                    <DesignDevMashItem
                        key={mashItem._id}
                        mashItem={mashItem}
                    />
                );
            }
        });
    }

    // Renders stuff in the current context that is in Dev but not in the Design
    renderUnknownDesignItemMash(mashData){

        let unknownMashData = [];

        mashData.forEach((mashItem) => {

            if(mashItem.mashStatus === MashStatus.MASH_NOT_DESIGNED){
                unknownMashData.push(mashItem);
            }
        });

        console.log("Rendering unknown mash list of length " + unknownMashData.length);

        return unknownMashData.map((mashItem) => {
            if(mashItem) {
                return (
                    <DesignDevMashItem
                        key={mashItem._id}
                        mashItem={mashItem}
                    />
                );
            }
        });
    }

    // Render any Unit Test results relevant to Scenarios in this Feature
    renderFeatureUnitTestsMash(unitTestMashData){

    }

    render() {

        const {designMashItemData, currentUserRole, userContext, view} = this.props;

        console.log("Rendering mash container with user context component type " + userContext.designComponentType);

        let panelHeader = '';
        let secondPanelHeader = '';
        let unitTestsHeader = '';
        let unLinkedUnitTestsHeader = '';
        let itemHeader = '';
        let secondPanel = <div></div>;
        let unitTestsPanel = <div></div>;
        let unlinkedUnitTestsPanel = <div></div>;

        const nameData = UserContextServices.getContextNameData(userContext);

        switch(userContext.designComponentType){
            case ComponentType.APPLICATION:
                panelHeader = 'Features in ' + nameData.application;
                itemHeader = 'Feature';
                break;
            case ComponentType.DESIGN_SECTION:
                panelHeader = 'Features in ' + nameData.designSection;
                itemHeader = 'Feature';
                break;
            case ComponentType.FEATURE:
                panelHeader = 'ACCEPTANCE TEST results for Scenarios in ' + nameData.feature;
                secondPanelHeader = 'Scenarios in ' + nameData.feature + ' NOT in Design';
                unitTestsHeader = 'UNIT TEST results for Scenarios in ' + nameData.feature;
                unlinkedUnitTestsHeader = 'UNIT TESTs not linked to Scenarios - consider changing Suite name?';
                itemHeader = 'Scenario';

                if(ClientMashDataServices.featureHasUnknownScenarios(userContext)){
                    secondPanel =
                        <Panel className="panel-text panel-text-body" header={secondPanelHeader}>
                            <InputGroup>
                                <Grid className="close-grid">
                                    <Row>
                                        <Col md={8} className="close-col">
                                            {itemHeader}
                                        </Col>
                                        <Col md={2} className="close-col">
                                            Status
                                        </Col>
                                        <Col md={2} className="close-col">
                                            Test
                                        </Col>
                                    </Row>
                                </Grid>
                                <InputGroup.Addon className="invisible">
                                    <div><Glyphicon glyph="star"/></div>
                                </InputGroup.Addon>
                            </InputGroup>
                            {this.renderUnknownDesignItemMash(designMashItemData)}
                        </Panel>;
                }

                unitTestsPanel =
                    <Panel className="panel-text panel-text-body" header={unitTestsHeader}>
                        <MashFeatureAspectContainer params={{
                            userContext:    userContext,
                            displayContext: DisplayContext.VIEW_UNIT_MASH,
                            view:           view
                        }}/>
                    </Panel>;

                unlinkedUnitTestsPanel =
                        <Panel className="panel-text panel-text-body" header={unLinkedUnitTestsHeader}>
                            <MashUnitTestContainer params={{
                                userContext:    userContext,
                                displayContext: DisplayContext.VIEW_UNIT_UNLINKED,
                                view:           view
                            }}/>
                        </Panel>;

                break;
            case ComponentType.FEATURE_ASPECT:
                panelHeader = nameData.featureAspect + ' scenarios for ' + nameData.feature;
                itemHeader = 'Scenario';
                break;
            case ComponentType.SCENARIO:
                panelHeader = 'Steps in ' + nameData.scenario;
                itemHeader = 'Step';
                break;
        }


        let mainPanel = 'Select a design item';

        if(designMashItemData || userContext.designComponentType === ComponentType.SCENARIO) {
            switch(userContext.designComponentType){
                case ComponentType.APPLICATION:
                case ComponentType.DESIGN_SECTION:
                case ComponentType.FEATURE_ASPECT:
                    mainPanel =
                        <Panel className="panel-text panel-text-body" header={panelHeader}>
                            <InputGroup>
                                <Grid className="close-grid">
                                    <Row>
                                        <Col md={8} className="close-col">
                                            {itemHeader}
                                        </Col>
                                        <Col md={2} className="close-col">
                                            Status
                                        </Col>
                                        <Col md={2} className="close-col">
                                            Test
                                        </Col>
                                    </Row>
                                </Grid>
                                <InputGroup.Addon className="invisible">
                                    <div><Glyphicon glyph="star"/></div>
                                </InputGroup.Addon>
                            </InputGroup>
                            {this.renderDesignItemMash(designMashItemData)}
                        </Panel>;
                    break;
                case ComponentType.FEATURE:
                    // Here we divide in to feature aspects (if any)
                    if(ClientMashDataServices.featureHasAspects(userContext)){
                        mainPanel =
                            <div>
                                <Grid>
                                    <Row>
                                        <Col md={6} className="scroll-col">
                                            <Panel className="panel-text panel-text-body" header={panelHeader}>
                                                <InputGroup>
                                                    <Grid className="close-grid">
                                                        <Row>
                                                            <Col md={8} className="close-col">
                                                                {itemHeader}
                                                            </Col>
                                                            <Col md={2} className="close-col">
                                                                Status
                                                            </Col>
                                                            <Col md={2} className="close-col">
                                                                Test
                                                            </Col>
                                                        </Row>
                                                    </Grid>
                                                    <InputGroup.Addon className="invisible">
                                                        <div><Glyphicon glyph="star"/></div>
                                                    </InputGroup.Addon>
                                                </InputGroup>
                                                <MashFeatureAspectContainer params={{
                                                    userContext:    userContext,
                                                    displayContext: DisplayContext.VIEW_ACCEPTANCE_MASH,
                                                    view:           view
                                                }}/>
                                            </Panel>
                                            {secondPanel}
                                        </Col>
                                        <Col md={6} className="scroll-col">
                                            {unitTestsPanel}
                                        </Col>
                                    </Row>
                                </Grid>
                            </div>
                    } else {
                        // Just render the scenarios
                        mainPanel =
                            <Panel className="panel-text panel-text-body" header={panelHeader}>
                                <InputGroup>
                                    <Grid className="close-grid">
                                        <Row>
                                            <Col md={8} className="close-col">
                                                {itemHeader}
                                            </Col>
                                            <Col md={2} className="close-col">
                                                Status
                                            </Col>
                                            <Col md={2} className="close-col">
                                                Test
                                            </Col>
                                        </Row>
                                    </Grid>
                                    <InputGroup.Addon className="invisible">
                                        <div><Glyphicon glyph="star"/></div>
                                    </InputGroup.Addon>
                                </InputGroup>
                                {this.renderDesignItemMash(designMashItemData)}
                            </Panel>;
                    }
                    break;
                case ComponentType.SCENARIO:
                    // Render the step editor
                    mainPanel =
                        <Panel className="panel-text panel-text-body" header={panelHeader}>
                            <MashScenarioStepContainer params={{
                                userContext: userContext
                            }}/>
                        </Panel>;
            }
        }

        return(
            <div>
                {mainPanel}
            </div>
        );

    }
}

DesignItemMashList.propTypes = {
    designMashItemData: PropTypes.array
};


// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        currentUserRole:    state.currentUserRole,
        userContext:        state.currentUserItemContext,
        view:               state.currentAppView
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
DesignItemMashList = connect(mapStateToProps)(DesignItemMashList);


export default DesignDevMashContainer = createContainer(({params}) => {


    let designMashItemData = ClientContainerServices.getDesignMashData(params.userContext);

    return{
        designMashItemData
    }


}, DesignItemMashList);