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
                        <Col md={10} className="close-col">
                            <div className={"result-scenario " + backgroundStyle}>
                                {scenarioName}
                            </div>
                        </Col>
                        <Col md={2} className="close-col">
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


export default ScenarioTestResultsHeaderContainer = createContainer(({params}) => {

    // Could be one result for each test type
    const scenarioTestResults = UserTestData.getScenarioLevelTestResults(
        params.userContext.userId,
        params.userContext.designVersionId,
        params.scenario.componentReferenceId
    );

    let scenarioTestResult = MashTestStatus.MASH_NO_TESTS;
    let passCount = 0;
    let failCount = 0;
    let missingCount = 0;

    scenarioTestResults.forEach((result) => {
        switch (result.testOutcome){
            case MashTestStatus.MASH_PASS:
                passCount++;
                break;
            case MashTestStatus.MASH_FAIL:
                failCount++;
                break;
            default:
                missingCount++;
                break;
        }
    });

    if(failCount > 0){
        scenarioTestResult = MashTestStatus.MASH_FAIL;
    } else {
        if(passCount > 0 && missingCount === 0){
            scenarioTestResult = MashTestStatus.MASH_PASS;
        } else {
            scenarioTestResult = MashTestStatus.MASH_INCOMPLETE;
        }
    }

    return{
        scenarioTestResult:     scenarioTestResult,
        scenarioName:           params.scenario.componentNameNew
    }


}, ScenarioTestResultsHeader);