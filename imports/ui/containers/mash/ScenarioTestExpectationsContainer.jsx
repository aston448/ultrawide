
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import TestExpectationItem from "../../components/mash/TestExpectationItem";

// Ultrawide Services
import {ClientDataServices} from "../../../apiClient/apiClientDataServices";

import { ItemType, TestType, LogLevel} from '../../../constants/constants.js';
import {log, getContextID} from "../../../common/utils";
import {UI} from "../../../constants/ui_context_ids";

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Scenario Test Expectations - Test Expectations screen for a Scenario
//
// ---------------------------------------------------------------------------------------------------------------------

export class ScenarioTestExpectations extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };

    }


    render() {
        const {scenario, scenarioUnitMashTestStatus, scenarioIntMashTestStatus, scenarioAccMashTestStatus} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Scenario Test Expectations');

        const layout =
            <Grid>
                <Row>
                    <Col md={4}>
                        <TestExpectationItem
                            testType={TestType.ACCEPTANCE}
                            itemType={ItemType.TEST_TYPE}
                            itemId={'ACC'}
                            itemParentId={'NONE'}
                            itemRef={scenario.componentReferenceId}
                            itemText={'Acceptance'}
                            itemStatus={scenarioAccMashTestStatus}
                            expandable={true}
                        />
                    </Col>
                    <Col md={4}>
                        <TestExpectationItem
                            testType={TestType.INTEGRATION}
                            itemType={ItemType.TEST_TYPE}
                            itemId={'INT'}
                            itemParentId={'NONE'}
                            itemRef={scenario.componentReferenceId}
                            itemText={'Integration'}
                            itemStatus={scenarioIntMashTestStatus}
                            expandable={true}
                        />
                    </Col>
                    <Col md={4}>
                        <TestExpectationItem
                            testType={TestType.UNIT}
                            itemType={ItemType.TEST_TYPE}
                            itemId={'UNIT'}
                            itemParentId={'NONE'}
                            itemRef={scenario.componentReferenceId}
                            itemText={'Unit'}
                            itemStatus={scenarioUnitMashTestStatus}
                            expandable={true}
                        />
                    </Col>
                </Row>
            </Grid>;


        return(
            <div>
                {layout}
            </div>
        );
    }
}

ScenarioTestExpectations.propTypes = {
    scenario:                   PropTypes.object.isRequired,
    scenarioUnitMashTestStatus: PropTypes.string.isRequired,
    scenarioIntMashTestStatus:  PropTypes.string.isRequired,
    scenarioAccMashTestStatus:  PropTypes.string.isRequired,
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:               state.currentUserRole,
        userContext:            state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
ScenarioTestExpectations = connect(mapStateToProps)(ScenarioTestExpectations);



export default ScenarioTestExpectationsContainer = createContainer(({params}) => {

    const testExpectationStatus = ClientDataServices.getTestTypeExpectationStatus(params.userContext, params.scenario.componentReferenceId);

    return{
        scenario: params.scenario,
        scenarioUnitMashTestStatus: testExpectationStatus.unitStatus,
        scenarioIntMashTestStatus:  testExpectationStatus.intStatus,
        scenarioAccMashTestStatus:  testExpectationStatus.accStatus,
    }

},ScenarioTestExpectations);