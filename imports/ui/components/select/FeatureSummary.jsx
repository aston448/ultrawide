// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Services
import {log} from "../../../common/utils";
import { FeatureTestSummaryStatus, LogLevel } from '../../../constants/constants.js';

import ClientDesignComponentServices    from '../../../apiClient/apiClientDesignComponent.js';

// Bootstrap
import {Grid, Row, Col, Glyphicon, Tooltip, OverlayTrigger} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Feature Summary - A summary of a Feature in a Design Version or Base Work Package
//
// ---------------------------------------------------------------------------------------------------------------------

export class FeatureSummary extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    shouldComponentUpdate(nextProps, nextState){

        let shouldUpdate = false;

        if(
            nextProps.featureSummary.summaryStatus !== this.props.featureSummary.summaryStatus ||
            nextProps.featureSummary.expectedCount !== this.props.featureSummary.expectedCount ||
            nextProps.featureSummary.scenarioCount !== this.props.featureSummary.scenarioCount ||
            nextProps.featureSummary.fulfilledCount !== this.props.featureSummary.fulfilledCount
        ){
            shouldUpdate = true;
        }

        return shouldUpdate;
    }

    onGoToFeature(userRole, userContext, featureReferenceId){

        ClientDesignComponentServices.gotoFeature(featureReferenceId);

    };

    render() {
        const {featureSummary, userContext, userRole} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Feature Summary');

        if(featureSummary.hasTestData){

            let resultClassScenarios = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_HIGLIGHT_REQUIRED;
            let resultClassRequired = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_NO_HIGHLIGHT;
            let resultClassFulfilled = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_NO_HIGHLIGHT;
            let resultFeatureSummary = '';


            if(featureSummary.summaryStatus === FeatureTestSummaryStatus.FEATURE_FAILING_TESTS){
                resultFeatureSummary = 'feature-summary-bad';
                resultClassFulfilled = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_HIGHLIGHT_FAIL
            } else {
                if((featureSummary.expectedCount === featureSummary.fulfilledCount) && (featureSummary.expectedCount > 0)){
                    resultFeatureSummary = 'feature-summary-good';
                    resultClassRequired = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_HIGHLIGHT_PASS;
                    resultClassFulfilled = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_HIGHLIGHT_PASS;
                } else {
                    if(featureSummary.expectedCount > 0){
                        if(featureSummary.fulfilledCount > 0) {
                            resultFeatureSummary = 'feature-summary-mmm';
                        } else {
                            resultFeatureSummary = 'feature-summary-meh';
                        }
                    } else {
                        resultFeatureSummary = 'feature-summary-meh';
                    }
                }
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



            return(
                <Grid className="close-grid">
                    <Row className="feature-summary-row">
                        <Col md={8} className="close-col">
                            <div className="feature-small" onClick={() => this.onGoToFeature(userRole, userContext, featureSummary.featureRef)}>{featureSummary.featureName}</div>
                        </Col>
                        <Col md={1} className="close-col">
                            <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipScenarios}>
                                <div className={resultClassScenarios}>
                                    <span><Glyphicon glyph="th"/></span>
                                    <span className="summary-number">{featureSummary.scenarioCount}</span>
                                </div>
                            </OverlayTrigger>
                        </Col>
                        <Col md={1} className="close-col">
                            <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipRequired}>
                                <div className={resultClassRequired}>
                                    <span><Glyphicon glyph="question-sign"/></span>
                                    <span className="summary-number">{featureSummary.expectedCount}</span>
                                </div>
                            </OverlayTrigger>
                        </Col>
                        <Col md={1} className="close-col">
                            <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipFulfilled}>
                                <div className={resultClassFulfilled}>
                                    <span><Glyphicon glyph="ok-sign"/></span>
                                    <span className="summary-number">{featureSummary.fulfilledCount}</span>
                                </div>
                            </OverlayTrigger>
                        </Col>
                        <Col md={1} className="close-col">
                            <div className={resultFeatureSummary}><Glyphicon glyph="th"/></div>
                        </Col>
                    </Row>
                </Grid>
            )
        } else {
            return(
                <Grid className="close-grid">
                    <Row>
                        <Col md={8} className="close-col">
                            <div className="feature-small" onClick={() => this.onGoToFeature(userRole, userContext, featureSummary.featureRef)}>{featureSummary.featureName}</div>
                        </Col>
                        <Col md={4} className="close-col">
                            <span className="test-summary-text feature-no-highlight">No test data yet</span>
                        </Col>
                    </Row>
                </Grid>
            )
        }


        // let resultClassRequired = 'test-summary-result ' + FeatureTestSummaryStatus.FEATURE_HIGLIGHT_REQUIRED;
        // let resultClassPass = 'test-summary-result ' + FeatureTestSummaryStatus.FEATURE_NO_HIGHLIGHT;
        // let resultClassFail = 'test-summary-result ' + FeatureTestSummaryStatus.FEATURE_NO_HIGHLIGHT;
        // let resultClassNotTested = 'test-summary-result ' + FeatureTestSummaryStatus.FEATURE_NO_HIGHLIGHT;
        // let resultFeatureSummary = '';

        // if(featureSummary.hasTestData) {
        //     // If no Scenarios at all indicate design deficit
        //     if (featureSummary.noTestCount === 0 && featureSummary.testFailCount === 0 && featureSummary.testPassCount === 0) {
        //         resultFeatureSummary = 'feature-summary-no-scenarios';
        //     } else {
        //         // If any fails it's a FAIL
        //         if (featureSummary.testFailCount > 0) {
        //             resultClassPass = 'test-summary-result ' + FeatureTestSummaryStatus.FEATURE_NO_HIGHLIGHT;
        //             resultClassFail = 'test-summary-result ' + FeatureTestSummaryStatus.FEATURE_HIGHLIGHT_FAIL;
        //             resultFeatureSummary = 'feature-summary-bad';
        //         } else {
        //             // Highlight passes if any and no fails
        //             if (featureSummary.testPassCount > 0) {
        //                 resultClassPass = 'test-summary-result ' + FeatureTestSummaryStatus.FEATURE_HIGHLIGHT_PASS;
        //             } else {
        //                 // No passes or failures so highlight number of tests
        //                 resultClassNotTested = 'test-summary-result ' + FeatureTestSummaryStatus.FEATURE_HIGHLIGHT_NO_TEST;
        //             }
        //             if (featureSummary.noTestCount > 0) {
        //                 if (featureSummary.testPassCount > 0) {
        //                     resultFeatureSummary = 'feature-summary-mmm';
        //                 } else {
        //                     resultFeatureSummary = 'feature-summary-meh';
        //                 }
        //             } else {
        //                 // All passes and no pending tests
        //                 resultFeatureSummary = 'feature-summary-good';
        //             }
        //         }
        //     }
        //
        //     return (
        //
        //         <Grid className="close-grid">
        //             <Row className="feature-summary-row">
        //                 <Col md={8} className="close-col">
        //                     <div className="feature-small" onClick={() => this.onGoToFeature(userRole, userContext, featureSummary.featureRef)}>{featureSummary.featureName}</div>
        //                 </Col>
        //                 <Col md={1} className="close-col">
        //                     <span className={resultClassPass}><Glyphicon glyph="ok-circle"/></span>
        //                     <span className={resultClassPass}>{featureSummary.testPassCount}</span>
        //                 </Col>
        //                 <Col md={1} className="close-col">
        //                     <span className={resultClassFail}><Glyphicon glyph="remove-circle"/></span>
        //                     <span className={resultClassFail}>{featureSummary.testFailCount}</span>
        //                 </Col>
        //                 <Col md={1} className="close-col">
        //                     <span className={resultClassNotTested}><Glyphicon glyph="ban-circle"/></span>
        //                     <span className={resultClassNotTested}>{featureSummary.noTestCount}</span>
        //                 </Col>
        //                 <Col md={1} className="close-col">
        //                     <div className={resultFeatureSummary}><Glyphicon glyph="th"/></div>
        //                 </Col>
        //             </Row>
        //         </Grid>
        //     )
        //
        // } else {
        //
        //     return(
        //         <Grid className="close-grid">
        //             <Row className="feature-summary-row">
        //                 <Col md={7} className="close-col">
        //                     <div className="feature-small" onClick={() => this.onGoToFeature(userRole, userContext, featureSummary.featureRef)}>{featureSummary.featureName}</div>
        //                 </Col>
        //                 <Col md={5} className="close-col">
        //                     <span className="test-summary-text feature-no-highlight">No test data yet</span>
        //                 </Col>
        //             </Row>
        //         </Grid>
        //     )
        // }
    }
}

FeatureSummary.propTypes = {
    featureSummary: PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext,
        userRole: state.currentUserRole
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(FeatureSummary);



