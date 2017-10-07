// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import ScenarioTestResult           from '../../components/mash/ScenarioTestResult.jsx';

// Ultrawide Services
import {DisplayContext, TestType} from '../../../constants/constants.js';

import ClientContainerServices      from '../../../apiClient/apiClientDataServices.js';

// Bootstrap

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Mash Unit Test Container - List of related unit test results for a Scenario
//
// ---------------------------------------------------------------------------------------------------------------------

class MashScenarioTestList extends Component {
    constructor(props) {
        super(props);

    }


    renderTestResults(testResults){

        return testResults.map((testResult) => {

            return (
                <ScenarioTestResult
                    key={testResult._id}
                    testResult={testResult}
                />
            );

        });
    }

    render() {

        const {testResults} = this.props;

        if(testResults.length > 0) {
            return (
                <div className="mash-unit-scenario-results">
                    {this.renderTestResults(testResults)}
                </div>
            )
        } else {
            return (
                <div className="unit-test-none">
                    No unit tests found
                </div>
            )
        }

    }
}

MashScenarioTestList.propTypes = {
    testResults: PropTypes.array.isRequired
};


// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        currentUserRole: state.currentUserRole,
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
MashScenarioTestList = connect(mapStateToProps)(MashScenarioTestList);


export default MashScenarioTestContainer = createContainer(({params}) => {

    let testResults = [];

    switch(params.displayContext){
        case DisplayContext.MASH_UNIT_TESTS:
            testResults = ClientContainerServices.getMashScenarioTestResults(params.userContext, params.scenario, TestType.UNIT);
            break;

        case DisplayContext.MASH_INT_TESTS:
            testResults = ClientContainerServices.getMashScenarioTestResults(params.userContext, params.scenario, TestType.INTEGRATION);
            break;

    }

    return{
        testResults: testResults
    }


}, MashScenarioTestList);