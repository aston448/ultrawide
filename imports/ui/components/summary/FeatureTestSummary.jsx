// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import ClientTestIntegrationServices from '../../../apiClient/apiClientTestIntegration.js';
import {FeatureTestSummaryStatus, ViewType}    from '../../../constants/constants.js';

// Bootstrap
import {Glyphicon, Tooltip, OverlayTrigger} from 'react-bootstrap';
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Feature Test Summary Container - Contains Test Results Summary for a Feature
//
// ---------------------------------------------------------------------------------------------------------------------

export class FeatureTestSummary extends Component {
    constructor(props) {
        super(props);

    }

    shouldComponentUpdate(nextProps, nextState){
        return true;
    }

    refreshSummary(userContext){

        // Update the feature test summary as well to match
        ClientTestIntegrationServices.updateTestSummaryDataForFeature(userContext);
    }


    render() {

        const {testSummaryData, view, userContext} = this.props;

        //console.log("Rendering Feature Test Summary data with view = " + view + " and summary data = " + testSummaryData);

        if(testSummaryData){

            let resultClassScenarios = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_HIGLIGHT_REQUIRED;
            let resultClassRequired = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_NO_HIGHLIGHT;
            let resultClassFulfilled = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_NO_HIGHLIGHT;
            let resultClassPass = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_NO_HIGHLIGHT;
            let resultClassFail = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_NO_HIGHLIGHT;
            let resultClassNotTested = 'test-summary-result ' + FeatureTestSummaryStatus.FEATURE_NO_HIGHLIGHT;
            let resultFeatureSummary = '';

            // Get data for view
            let scenarioCount = 0;
            let requiredCount = 0;
            let fulfilledCount = 0;
            let passCount = 0;
            let failCount = 0;
            let noTestCount = 0;

            switch(view){
                case ViewType.DESIGN_PUBLISHED:
                case ViewType.DESIGN_UPDATABLE:
                case ViewType.DESIGN_UPDATE_EDIT:
                case ViewType.WORK_PACKAGE_BASE_EDIT:       // Scope pane
                    // Whole DV
                    scenarioCount = testSummaryData.featureScenarioCount;
                    requiredCount = testSummaryData.featureExpectedTestCount;
                    fulfilledCount = testSummaryData.featureFulfilledTestCount;
                    passCount = testSummaryData.featureTestPassCount;
                    failCount = testSummaryData.featureTestFailCount;
                    noTestCount = testSummaryData.featureNoTestCount;
                    break;
                case ViewType.DESIGN_UPDATE_VIEW:
                case ViewType.WORK_PACKAGE_UPDATE_EDIT:     // Scope pane
                    // DU Only
                    scenarioCount = testSummaryData.duFeatureScenarioCount;
                    requiredCount = testSummaryData.duFeatureExpectedTestCount;
                    fulfilledCount = testSummaryData.duFeatureFulfilledTestCount;
                    passCount = testSummaryData.duFeatureTestPassCount;
                    failCount = testSummaryData.duFeatureTestFailCount;
                    noTestCount = testSummaryData.duFeatureNoTestCount;
                    //console.log("  Pass count: " + passCount);
                    break;
                case ViewType.WORK_PACKAGE_BASE_VIEW:
                case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                case ViewType.DEVELOP_BASE_WP:
                case ViewType.DEVELOP_UPDATE_WP:
                    // WP Only
                    scenarioCount = testSummaryData.wpFeatureScenarioCount;
                    requiredCount = testSummaryData.wpFeatureExpectedTestCount;
                    fulfilledCount = testSummaryData.wpFeatureFulfilledTestCount;
                    passCount = testSummaryData.wpFeatureTestPassCount;
                    failCount = testSummaryData.wpFeatureTestFailCount;
                    noTestCount = testSummaryData.wpFeatureNoTestCount;
                    break;

            }

            //console.log("Pass count = " + passCount);

            // If no Scenarios at all indicate design deficit
            if(noTestCount === 0 && failCount === 0 && passCount === 0){
                resultFeatureSummary = 'feature-summary-no-scenarios';
            } else {
                // If any fails it's a FAIL
                if (failCount > 0) {
                    resultClassPass = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_NO_HIGHLIGHT;
                    resultClassFail = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_HIGHLIGHT_FAIL;
                    resultFeatureSummary = 'feature-summary-bad';
                } else {
                    // Highlight passes if any and no fails
                    if (passCount > 0) {
                        resultClassPass = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_HIGHLIGHT_PASS;
                        if((requiredCount === fulfilledCount) && (requiredCount > 0)){
                            resultClassFulfilled= 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_HIGHLIGHT_PASS;
                        }
                    } else {
                        // No passes or failures so highlight number of tests
                        resultClassNotTested = 'test-summary-result ' + FeatureTestSummaryStatus.FEATURE_HIGHLIGHT_NO_TEST;
                    }
                    if (noTestCount > 0) {
                        if (passCount > 0) {
                            resultFeatureSummary = 'feature-summary-mmm';
                        } else {
                            resultFeatureSummary = 'feature-summary-meh';
                        }
                    } else {
                        // All passes and no pending tests
                        if((requiredCount === fulfilledCount) && (requiredCount > 0)) {
                            resultFeatureSummary = 'feature-summary-good';
                        } else {
                            resultFeatureSummary = 'feature-summary-mmm';
                        }
                    }
                }
            }

            // Only show requirements as active if some tests are required
            if(requiredCount > 0){
                resultClassRequired = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_HIGLIGHT_REQUIRED;
            }

            const tooltipDelay = 1000;

            const tooltipScenarios = (
                <Tooltip id="modal-tooltip">
                    {'Total Scenarios in Feature'}
                </Tooltip>
            );

            const tooltipRequired = (
                <Tooltip id="modal-tooltip">
                    {'Number of tests required'}
                </Tooltip>
            );

            const tooltipFulfilled = (
                <Tooltip id="modal-tooltip">
                    {'Number of required tests passing'}
                </Tooltip>
            );

            const tooltipPasses = (
                <Tooltip id="modal-tooltip">
                    {'Total pass count'}
                </Tooltip>
            );

            const tooltipFails = (
                <Tooltip id="modal-tooltip">
                    {'Total fail count'}
                </Tooltip>
            );

            return(
                <Grid className="close-grid">
                    <Row>
                        <Col md={2} className="close-col">
                            <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipScenarios}>
                                <div className={resultClassScenarios}>
                                    <span><Glyphicon glyph="th"/></span>
                                    <span className="summary-number">{scenarioCount}</span>
                                </div>
                            </OverlayTrigger>
                        </Col>
                        <Col md={2} className="close-col">
                            <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipRequired}>
                                <div className={resultClassRequired}>
                                    <span><Glyphicon glyph="question-sign"/></span>
                                    <span className="summary-number">{requiredCount}</span>
                                </div>
                            </OverlayTrigger>
                        </Col>
                        <Col md={2} className="close-col">
                            <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipFulfilled}>
                                <div className={resultClassFulfilled}>
                                    <span><Glyphicon glyph="ok-sign"/></span>
                                    <span className="summary-number">{fulfilledCount}</span>
                                </div>
                            </OverlayTrigger>
                        </Col>
                        <Col md={1} className="close-col">

                        </Col>
                        <Col md={2} className="close-col">
                            <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipPasses}>
                                <div className={resultClassPass}>
                                    <span><Glyphicon glyph="ok-circle"/></span>
                                    <span className="summary-number">{passCount}</span>
                                </div>
                            </OverlayTrigger>
                        </Col>
                        <Col md={2} className="close-col">
                            <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipFails}>
                                <div className={resultClassFail}>
                                    <span><Glyphicon glyph="remove-circle"/></span>
                                    <span className="summary-number">{failCount}</span>
                                </div>
                            </OverlayTrigger>
                        </Col>
                        <Col md={1} className="close-col">
                            <div className={resultFeatureSummary} onClick={() => this.refreshSummary(userContext)}><Glyphicon glyph="refresh"/></div>
                        </Col>
                    </Row>
                </Grid>
            )
        } else {
            return(
                <Grid className="close-grid">
                    <Row>
                        <Col md={12} className="close-col">
                            <span className="test-summary-text feature-no-highlight">No data yet</span>
                        </Col>
                    </Row>
                </Grid>
            )
        }

    }
}

FeatureTestSummary.propTypes = {
    testSummaryData: PropTypes.object

};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        view:               state.currentAppView,
        userContext:        state.currentUserItemContext
    }
}

export default connect(mapStateToProps)(FeatureTestSummary);
