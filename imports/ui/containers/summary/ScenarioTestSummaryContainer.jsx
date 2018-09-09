// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import ScenarioTestSummary from "../../components/summary/ScenarioTestSummary.jsx";

// Ultrawide Services
import { ClientDataServices }           from '../../../apiClient/apiClientDataServices.js';


import {log} from "../../../common/utils";
import {DisplayContext, LogLevel} from "../../../constants/constants";
import {connect} from "react-redux";



// Bootstrap

// REDUX services

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Scenario Test Summary Container - gets the data for a Scenario Test Summary
//
// ---------------------------------------------------------------------------------------------------------------------


// Export for unit tests
export class ScenarioTestSummaryOverlay extends Component {

    constructor(props) {
        super(props);

    }

    shouldComponentUpdate(nextProps, nextState){

        return true;
    }


    render() {

        const {summaryData, testExpectations, scenario} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Scenario Test Summary');

        return(
            <div>
                <ScenarioTestSummary
                    testSummaryData={summaryData}
                    scenarioTestExpectations={testExpectations}
                    scenario={scenario}
                />
            </div>
        )
    }

}

ScenarioTestSummaryOverlay.propTypes = {
    summaryData:  PropTypes.object,
    testExpectations: PropTypes.array,
    scenario: PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userViewOptions: state.currentUserViewOptions,
        view: state.currentAppView
    }
}


export default ScenarioTestSummaryContainer = createContainer(({params}) => {

    // Get the summary data for the Scenario
    const scenarioData =  ClientDataServices.getScenarioTestSummaryData(
        params.userContext,
        params.scenarioRefId
    );

    console.log('Scenario data is %o', scenarioData);

    return{
        summaryData:        scenarioData.summaryData,
        testExpectations:   scenarioData.testExpectations,
        scenario:           scenarioData.scenario
    }


}, connect(mapStateToProps)(ScenarioTestSummaryOverlay));