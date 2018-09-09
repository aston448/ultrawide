// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import { ClientTestIntegrationServices } from '../../../apiClient/apiClientTestIntegration.js';
import {FeatureTestSummaryStatus, ViewType, LogLevel}    from '../../../constants/constants.js';
import {log} from "../../../common/utils";

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

        let shouldUpdate = false;

        // Update if test data has changed
        if(nextProps.testSummaryData && this.props.testSummaryData) {
            if (
                nextProps.testSummaryData.featureScenarioCount !== this.props.testSummaryData.featureScenarioCount ||
                nextProps.testSummaryData.featureExpectedTestCount !== this.props.testSummaryData.featureExpectedTestCount ||
                nextProps.testSummaryData.featurePassingTestCount !== this.props.testSummaryData.featurePassingTestCount ||
                nextProps.testSummaryData.featureFailingTestCount !== this.props.testSummaryData.featureFailingTestCount ||
                nextProps.testSummaryData.featureMissingTestCount !== this.props.testSummaryData.featureMissingTestCount
            ) {
                shouldUpdate = true;
            }
        }

        //console.log('Feature Test Summary Should Update: ' + shouldUpdate);

        return shouldUpdate;
    }

    refreshSummary(userContext){

        // Update the feature test summary as well to match
        //ClientTestIntegrationServices.updateTestSummaryDataForFeature(userContext);
    }


    render() {

        const {testSummaryData, view, userContext} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Feature Test Summary');

        if(testSummaryData){

            let resultClassScenarios = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_HIGLIGHT_REQUIRED;
            let resultClassRequired = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_NO_HIGHLIGHT;
            let resultClassPass = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_NO_HIGHLIGHT;
            let resultClassFail = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_NO_HIGHLIGHT;
            let resultClassMissing = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_NO_HIGHLIGHT;
            let resultFeatureSummary = '';

            // Get data for view
            let scenarioCount = 0;
            let requiredCount = 0;
            let passCount = 0;
            let failCount = 0;
            let missingCount = 0;

            switch(view){
                case ViewType.DESIGN_PUBLISHED:
                case ViewType.DESIGN_UPDATABLE:
                case ViewType.DESIGN_UPDATE_EDIT:
                case ViewType.WORK_PACKAGE_BASE_EDIT:       // Scope pane
                    // Whole DV
                    scenarioCount = testSummaryData.featureScenarioCount;
                    requiredCount = testSummaryData.featureExpectedTestCount;
                    passCount = testSummaryData.featurePassingTestCount;
                    failCount = testSummaryData.featureFailingTestCount;
                    missingCount = testSummaryData.featureMissingTestCount;
                    break;
                case ViewType.DESIGN_UPDATE_VIEW:
                case ViewType.WORK_PACKAGE_UPDATE_EDIT:     // Scope pane
                    // DU Only
                    // scenarioCount = testSummaryData.duFeatureScenarioCount;
                    // requiredCount = testSummaryData.duFeatureExpectedTestCount;
                    // fulfilledCount = testSummaryData.duFeatureFulfilledTestCount;
                    // passCount = testSummaryData.duFeatureTestPassCount;
                    // failCount = testSummaryData.duFeatureTestFailCount;
                    // noTestCount = testSummaryData.duFeatureNoTestCount;
                    //console.log("  Pass count: " + passCount);
                    break;
                case ViewType.WORK_PACKAGE_BASE_VIEW:
                case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                case ViewType.DEVELOP_BASE_WP:
                case ViewType.DEVELOP_UPDATE_WP:
                    // WP Only
                    // scenarioCount = testSummaryData.wpFeatureScenarioCount;
                    // requiredCount = testSummaryData.wpFeatureExpectedTestCount;
                    // fulfilledCount = testSummaryData.wpFeatureFulfilledTestCount;
                    // passCount = testSummaryData.wpFeatureTestPassCount;
                    // failCount = testSummaryData.wpFeatureTestFailCount;
                    // noTestCount = testSummaryData.wpFeatureNoTestCount;
                    break;

            }

            // Any failures at all it's a fail
            //             if (testSummaryData.featureSummaryStatus === FeatureTestSummaryStatus.FEATURE_FAILING_TESTS) {
            //                 featureRowClass = 'scenario-test-row-fail'
            //             } else {
            //                 // No failures so any passes its a pass for now
            //                 if (testSummaryData.featureSummaryStatus === FeatureTestSummaryStatus.FEATURE_PASSING_TESTS) {
            //                     featureRowClass = 'scenario-test-row-pass'
            //                 }
            //             }

            //console.log("Pass count = " + passCount);

            let featureRowClass = 'scenario-test-row-untested';

            // If no Scenarios at all indicate design deficit
            if(missingCount === 0 && failCount === 0 && passCount === 0){
                resultFeatureSummary = 'feature-summary-no-scenarios';
            } else {
                // If any fails it's a FAIL
                if (failCount > 0) {
                    resultClassPass = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_NO_HIGHLIGHT;
                    resultClassFail = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_HIGHLIGHT_FAIL;
                    resultFeatureSummary = 'feature-summary-bad';
                    featureRowClass = 'scenario-test-row-fail'
                } else {
                    // Highlight passes if any and no fails
                    if (passCount > 0) {
                        resultClassPass = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_HIGHLIGHT_PASS;
                    } else {
                        // No passes or failures so highlight number of tests
                        resultClassMissing = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_HIGHLIGHT_NO_TEST;
                    }
                    if (missingCount > 0) {
                        if (passCount > 0) {
                            resultFeatureSummary = 'feature-summary-mmm';
                            featureRowClass = 'scenario-test-row-pass'
                        } else {
                            resultFeatureSummary = 'feature-summary-meh';
                        }
                    } else {
                        // All passes and no pending tests
                        if(requiredCount > 0) {
                            resultFeatureSummary = 'feature-summary-good';
                            featureRowClass = 'scenario-test-row-pass'
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

            const tooltipPasses = (
                <Tooltip id="modal-tooltip">
                    {'Required tests passing'}
                </Tooltip>
            );

            const tooltipFails = (
                <Tooltip id="modal-tooltip">
                    {'Required tests failing'}
                </Tooltip>
            );

            const tooltipMissing = (
                <Tooltip id="modal-tooltip">
                    {'Required tests missing'}
                </Tooltip>
            );

            return(
                <Grid className="close-grid">
                    <Row className={featureRowClass}>
                        {/*<Col md={2} className="close-col">*/}
                            {/*<OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipScenarios}>*/}
                                {/*<div className={resultClassScenarios}>*/}
                                    {/*<span className="summary-item">Scenarios:</span>*/}
                                    {/*<span className="summary-number">{scenarioCount}</span>*/}
                                {/*</div>*/}
                            {/*</OverlayTrigger>*/}
                        {/*</Col>*/}
                        <Col md={1} className="close-col">
                            <div className={resultFeatureSummary} onClick={() => this.refreshSummary(userContext)}>
                                <Glyphicon glyph="th"/>
                            </div>
                        </Col>
                        <Col md={5} className="close-col">
                            <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipRequired}>
                                <div className={resultClassRequired}>
                                    <span className="summary-item">Expected Tests:</span>
                                    <span className="summary-number">{requiredCount}</span>
                                </div>
                            </OverlayTrigger>
                        </Col>
                        <Col md={2} className="close-col">
                            <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipPasses}>
                                <div className={resultClassPass}>
                                    <span className="summary-item">Passing:</span>
                                    <span className="summary-number">{passCount}</span>
                                </div>
                            </OverlayTrigger>
                        </Col>
                        <Col md={2} className="close-col">
                            <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipFails}>
                                <div className={resultClassFail}>
                                    <span className="summary-item">Failing:</span>
                                    <span className="summary-number">{failCount}</span>
                                </div>
                            </OverlayTrigger>
                        </Col>
                        <Col md={2} className="close-col">
                            <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipMissing}>
                                <div className={resultClassMissing}>
                                    <span className="summary-item">Missing:</span>
                                    <span className="summary-number">{missingCount}</span>
                                </div>
                            </OverlayTrigger>
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
