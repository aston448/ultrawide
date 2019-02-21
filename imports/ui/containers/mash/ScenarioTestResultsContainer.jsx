// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import TestExpectationResult           from '../../components/mash/TestExpectationResult.jsx';

// Ultrawide Services
import {log} from "../../../common/utils";
import { DisplayContext, LogLevel }    from '../../../constants/constants.js';

import { ClientDataServices }                   from '../../../apiClient/apiClientDataServices.js';
import { TestResultsUiServices }                from "../../../ui_modules/test_results";

// Bootstrap

// REDUX services
import {connect} from 'react-redux';
import {UserTestData} from "../../../data/test_data/user_test_data_db";



// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design / Dev Integration Test Scenario Mash Container - List of Scenarios known in the Design
//
// ---------------------------------------------------------------------------------------------------------------------

class ScenarioTestResultsList extends Component {
    constructor(props) {
        super(props);

    }

    shouldComponentUpdate(nextProps, nextState){

        return true //TestResultsUiServices.shouldContainerUpdate(this.props, nextProps, 'UPDATE');
    };


    renderTestExpectationResults(results, scenarioName){

        return results.map((result) => {

            return (
                <TestExpectationResult
                    key={result._id}
                    testResult={result}
                    scenarioName={scenarioName}
                />
            );
       });

    };

    renderNoResults(){
        return (
            <div className="design-item-note">No Test Results</div>
        )
    }

    render() {

        const {scenarioTestResults, scenarioName} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Scenario Test Results');

        if(scenarioTestResults.length > 0){

            return (
                <div>
                    {this.renderTestExpectationResults(scenarioTestResults, scenarioName)}
                </div>
            );

        } else {
            return(
                <div>
                    {this.renderNoResults()}
                </div>
            )
        }


    }
}

ScenarioTestResultsList.propTypes = {
    scenarioTestResults:    PropTypes.array.isRequired,
    scenarioName:           PropTypes.string.isRequired
};


// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        currentUserRole:    state.currentUserRole,
        userContext:        state.currentUserItemContext,
        view:               state.currentAppView,
        userViewOptions:    state.currentUserViewOptions
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
ScenarioTestResultsList = connect(mapStateToProps)(ScenarioTestResultsList);


export default ScenarioTestResultsContainer = createContainer(({params}) => {

    const scenarioTestResults = UserTestData.getScenarioPermutationTestResults(
        params.userContext.userId,
        params.userContext.designVersionId,
        params.scenario.componentReferenceId
    );


    return{
        scenarioTestResults:    scenarioTestResults,
        scenarioName:           params.scenario.componentNameNew
    }


}, ScenarioTestResultsList);