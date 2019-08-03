// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Data
import {UserTestData} from "../../../data/test_data/user_test_data_db";

// Ultrawide GUI Components


// Ultrawide Services
import {log} from "../../../common/utils";
import { LogLevel }    from '../../../constants/constants.js';
import {TextLookups} from "../../../common/lookups";

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';
import {MashTestStatus} from "../../../constants/constants";
import {ClientDataServices} from "../../../apiClient/apiClientDataServices";

// REDUX services


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Header for list of test results for a Scenario
//
// ---------------------------------------------------------------------------------------------------------------------

class ScenarioTestResultsHeader extends Component {
    constructor(props) {
        super(props);

    }


    render() {

        const {scenarioTestResult, scenarioName} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Scenario Test Results Header');

        let backgroundStyle = 'scenario-missing';

        switch(scenarioTestResult){
            case MashTestStatus.MASH_PASS:
                backgroundStyle = 'scenario-pass';
                break;
            case MashTestStatus.MASH_FAIL:
                backgroundStyle = 'scenario-fail';
                break;
            case MashTestStatus.MASH_INCOMPLETE:
                backgroundStyle = 'scenario-incomplete';
                break;
        }

        return(
            <div>
                <Grid>
                    <Row>
                        <Col md={11} className="close-col">
                            <div className={"result-scenario " + backgroundStyle}>
                                {scenarioName}
                            </div>
                        </Col>
                        <Col md={1} className="close-col">
                            <div className={"scenario-header-result " + scenarioTestResult + " " + backgroundStyle}>
                                {TextLookups.mashTestStatus(scenarioTestResult)}
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )


    }
}

ScenarioTestResultsHeader.propTypes = {
    scenarioTestResult:     PropTypes.string.isRequired,
    scenarioName:           PropTypes.string.isRequired
};

let ScenarioTestResultsHeaderContainer;
export default ScenarioTestResultsHeaderContainer = createContainer(({params}) => {

    return ClientDataServices.getScenarioOverallTestResult(params.userContext, params.scenario);

}, ScenarioTestResultsHeader);