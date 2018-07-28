// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Services
import {log} from "../../../common/utils";
import { FeatureTestSummaryStatus, LogLevel } from '../../../constants/constants.js';

import { ClientDesignComponentServices }    from '../../../apiClient/apiClientDesignComponent.js';

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
            isSelectable: false
        };
    }

    shouldComponentUpdate(nextProps, nextState){

        let shouldUpdate = false;

        if(
            nextProps.featureSummary.summaryStatus !== this.props.featureSummary.summaryStatus ||
            nextProps.featureSummary.expectedCount !== this.props.featureSummary.expectedCount ||
            nextProps.featureSummary.scenarioCount !== this.props.featureSummary.scenarioCount ||
            nextProps.featureSummary.fulfilledCount !== this.props.featureSummary.fulfilledCount ||
            nextState.isSelectable !== this.state.isSelectable
        ){
            shouldUpdate = true;
        }

        return shouldUpdate;
    }

    setSelectable(){
        this.setState({isSelectable: true});
    }

    setUnselectable(){
        this.setState({isSelectable: false});
    }

    onGoToFeature(userRole, userContext, featureReferenceId){

        ClientDesignComponentServices.gotoFeature(featureReferenceId);

    };

    render() {
        const {featureSummary, userContext, userRole} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Feature Summary');

        let layout = '';

        if(featureSummary.hasTestData){

            let resultClassScenarios = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_HIGLIGHT_REQUIRED;
            let resultClassRequired = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_NO_HIGHLIGHT;
            let resultClassFulfilled = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_NO_HIGHLIGHT;
            let resultFeatureSummary = '';

            let testPassFailCount = 0;

            if(featureSummary.summaryStatus === FeatureTestSummaryStatus.FEATURE_FAILING_TESTS){
                resultFeatureSummary = 'feature-summary-bad';
                resultClassFulfilled = 'feature-test-summary-result ' + FeatureTestSummaryStatus.FEATURE_HIGHLIGHT_FAIL;
                testPassFailCount = featureSummary.failedCount;
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
                testPassFailCount = featureSummary.fulfilledCount;
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

            const tooltipFailed = (
                <Tooltip id="modal-tooltip">
                    {'Number of tests failing'}
                </Tooltip>
            );

            let passFailTooltip = tooltipFulfilled;
            let passFailIcon = 'ok-sign';

            if(featureSummary.summaryStatus === FeatureTestSummaryStatus.FEATURE_FAILING_TESTS){
                passFailTooltip = tooltipFailed;
                passFailIcon = 'remove-circle'
            }


            layout =
                <Grid onMouseEnter={ () => this.setSelectable()} onMouseLeave={ () => this.setUnselectable()} className="close-grid">
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
                            <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={passFailTooltip}>
                                <div className={resultClassFulfilled}>
                                    <span><Glyphicon glyph={passFailIcon}/></span>
                                    <span className="summary-number">{testPassFailCount}</span>
                                </div>
                            </OverlayTrigger>
                        </Col>
                        <Col md={1} className="close-col">
                            <div className={resultFeatureSummary}><Glyphicon glyph="th"/></div>
                        </Col>
                    </Row>
                </Grid>;

        } else {
            layout =
                <Grid onMouseEnter={ () => this.setSelectable()} onMouseLeave={ () => this.setUnselectable()} className="close-grid">
                    <Row>
                        <Col md={8} className="close-col">
                            <div className="feature-small" onClick={() => this.onGoToFeature(userRole, userContext, featureSummary.featureRef)}>{featureSummary.featureName}</div>
                        </Col>
                        <Col md={4} className="close-col">
                            <span className="test-summary-text feature-no-highlight">No test data yet</span>
                        </Col>
                    </Row>
                </Grid>;

        }

        let itemClass = 'feature-summary-non-selectable';

        if(this.state.isSelectable){
            itemClass = 'feature-summary-selectable';
        }

        return(
            <div className={itemClass}>
                {layout}
            </div>
        )
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



