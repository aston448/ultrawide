// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';


// Ultrawide Collections


// Ultrawide GUI Components
import IntegrationTestFeatureMashItem               from './IntegrationTestFeatureMashItem.jsx';
import IntegrationTestFeatureAspectMashContainer    from '../../containers/dev/IntegrationTestFeatureAspectMashContainer.jsx';
import IntegrationTestScenarioMashContainer         from '../../containers/dev/IntegrationTestScenarioMashContainer.jsx';

// Ultrawide Services
import {RoleType, DisplayContext, MashStatus, ComponentType, LogLevel, FeatureTestSummaryStatus}    from '../../../constants/constants.js';
import {log} from '../../../common/utils.js';

import TextLookups                  from '../../../common/lookups.js';
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
// Feature Test Summary Container - Contains Test Results Summary for a Feature
//
// ---------------------------------------------------------------------------------------------------------------------

class TestSummary extends Component {
    constructor(props) {
        super(props);

    }

    shouldComponentUpdate(nextProps, nextState){
        return true;
    }


    render() {

        const {testSummaryData, userContext} = this.props;

        if(testSummaryData){

            let resultClassPass = 'test-summary-result ' + FeatureTestSummaryStatus.FEATURE_NO_HIGHLIGHT;
            let resultClassFail = 'test-summary-result ' + FeatureTestSummaryStatus.FEATURE_NO_HIGHLIGHT;
            let resultClassNotTested = 'test-summary-result ' + FeatureTestSummaryStatus.FEATURE_NO_HIGHLIGHT;

            // If any fails don't highlight passes
            if(testSummaryData.featureTestFailCount > 0){
                resultClassPass = 'test-summary-result ' + FeatureTestSummaryStatus.FEATURE_NO_HIGHLIGHT;
                resultClassFail = 'test-summary-result ' + FeatureTestSummaryStatus.FEATURE_HIGHLIGHT_FAIL;
            } else {
                // Highlight passes if any and no fails
                if(testSummaryData.featureTestPassCount > 0){
                    resultClassPass = 'test-summary-result ' + FeatureTestSummaryStatus.FEATURE_HIGHLIGHT_PASS;
                } else {
                    // No passes or failures so highlight number of tests
                    resultClassNotTested = 'test-summary-result ' + FeatureTestSummaryStatus.FEATURE_HIGHLIGHT_NO_TEST;
                }
            }

            return(
                <Grid className="close-grid">
                    <Row>
                        <Col md={4} className="close-col">
                            <span className={resultClassPass}>Passing Tests:</span>
                            <span className={resultClassPass}>{testSummaryData.featureTestPassCount}</span>
                        </Col>
                        <Col md={4} className="close-col">
                            <span className={resultClassFail}>Failing Tests:</span>
                            <span className={resultClassFail}>{testSummaryData.featureTestFailCount}</span>
                        </Col>
                        <Col md={4} className="close-col">
                            <span className={resultClassNotTested}>Not Tested:</span>
                            <span className={resultClassNotTested}>{testSummaryData.featureNoTestCount}</span>
                        </Col>
                    </Row>
                </Grid>
            )
        } else {
            return(
                <div className="test-summary-text feature-no-highlight">No Data</div>)
        }

    }
}

TestSummary.propTypes = {
    testSummaryData: PropTypes.object
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext:        state.currentUserItemContext
    }
}

export default TestSummary;
