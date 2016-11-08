// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';


// Ultrawide Collections


// Ultrawide GUI Components
import MashUnitTestResult         from '../../components/dev/MashUnitTestResult.jsx';

// Ultrawide Services
import {RoleType, ComponentType, DisplayContext}    from '../../../constants/constants.js';

import ClientContainerServices      from '../../../apiClient/apiClientContainerServices.js';
import UserContextServices          from '../../../apiClient/apiClientUserContext.js';
import ClientMashDataServices       from '../../../apiClient/apiClientMashData.js';

// Bootstrap
import {Panel} from 'react-bootstrap';
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Mash Unit Test Container - List of related unit test results for a Scenario
//
// ---------------------------------------------------------------------------------------------------------------------

class MashUnitTestList extends Component {
    constructor(props) {
        super(props);

    }


    renderTestResults(testResults){

        return testResults.map((testResult) => {

            return (
                <MashUnitTestResult
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
                <div>
                    {this.renderTestResults(testResults)}
                </div>
            )
        } else {
            return (
                <div className="unit-test-none">
                    No unit tests found for this scenario
                </div>
            )
        }

    }
}

MashUnitTestList.propTypes = {
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
MashUnitTestList = connect(mapStateToProps)(MashUnitTestList);


export default MashUnitTestContainer = createContainer(({params}) => {

    let testResults = ClientContainerServices.getMashScenarioUnitTestResults(params.scenario);

    console.log("Found " + testResults.length + " unit tests for scenario " + params.scenario.designScenarioReferenceId + " and user " + params.scenario.userId)

    return{
        testResults: testResults
    }


}, MashUnitTestList);