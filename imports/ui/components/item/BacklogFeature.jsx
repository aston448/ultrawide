// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Services
import {log} from "../../../common/utils";
import { BacklogType, LogLevel } from '../../../constants/constants.js';

import { ClientDesignComponentServices }    from '../../../apiClient/apiClientDesignComponent.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';



// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Backlog Feature - Summary of Feature in a specific backlog list
//
// ---------------------------------------------------------------------------------------------------------------------

export class BacklogFeature extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSelectable: false
        };
    }

    // shouldComponentUpdate(nextProps, nextState){
    //
    //     let shouldUpdate = false;
    //
    //     if(
    //         nextProps.displayContext !== this.props.displayContext ||
    //         nextProps.featureSummary.featureTestStatus !== this.props.featureSummary.featureTestStatus ||
    //         nextProps.featureSummary.featureExpectedTestCount !== this.props.featureSummary.featureExpectedTestCount ||
    //         nextProps.featureSummary.featureScenarioCount !== this.props.featureSummary.featureScenarioCount ||
    //         nextProps.featureSummary.featurePassingTestCount !== this.props.featureSummary.featurePassingTestCount ||
    //         nextProps.featureSummary.featureFailingTestCount !== this.props.featureSummary.featureFailingTestCount ||
    //         nextState.isSelectable !== this.state.isSelectable
    //     ){
    //         shouldUpdate = true;
    //     }
    //
    //     return shouldUpdate;
    // }

    setSelectable(){
        this.setState({isSelectable: true});
    }

    setUnselectable(){
        this.setState({isSelectable: false});
    }

    onGoToFeature(featureReferenceId){

        ClientDesignComponentServices.gotoFeature(featureReferenceId);

    };

    render() {
        const {featureSummary, backlogContext} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Feature Summary');


        let messageText = 'No summary data yet';

        if(featureSummary){

            switch(backlogContext){
                case BacklogType.BACKLOG_DESIGN:

                    messageText = 'This Feature has no Scenarios defined as yet...';
                    break;

                case BacklogType.BACKLOG_TEST_EXP:

                    if(featureSummary.count === 1){
                        messageText = 'One Scenario has no test expectations';
                    } else {
                        messageText = featureSummary.count + ' Scenarios have no test expectations';
                    }
                    break;

                case BacklogType.BACKLOG_TEST_MISSING:

                    if(featureSummary.count === 1){
                        messageText = 'One test is missing';
                    } else {
                        messageText = featureSummary.count + ' tests are missing';
                    }
                    break;

                case BacklogType.BACKLOG_TEST_FAIL:

                    if(featureSummary.count === 1){
                        messageText = 'One test is failing';
                    } else {
                        messageText = featureSummary.count + ' tests are failing';
                    }
                    break;

                case BacklogType.BACKLOG_SCENARIO_ANOMALY:

                    if(featureSummary.count === 1){
                        messageText = 'One Scenario Design Anomaly is outstanding';
                    } else {
                        messageText = featureSummary.count + ' Scenario Design Anomalies are outstanding';
                    }
                    break;

                case BacklogType.BACKLOG_FEATURE_ANOMALY:

                    if(featureSummary.count === 1){
                        messageText = 'One design anomaly is outstanding';
                    } else {
                        messageText = featureSummary.count + ' design anomalies are outstanding';
                    }
                    break;

                case BacklogType.BACKLOG_WP_ASSIGN:

                    if(featureSummary.count === 1){
                        messageText = 'One Scenario is not in a Work Package';
                    } else {
                        messageText = featureSummary.count + ' Scenarios are not in Work Packages';
                    }
                    break;
            }

        }

        const layout =
            <Grid onMouseEnter={ () => this.setSelectable()} onMouseLeave={ () => this.setUnselectable()} className="close-grid">
                <Row className="feature-summary-row">
                    <Col md={8} className="close-col">
                        <div className="feature-small" onClick={() => this.onGoToFeature(featureSummary.id)}>{featureSummary.name}</div>
                    </Col>
                    <Col md={4} className="close-col">
                        <div>
                            {messageText}
                        </div>
                    </Col>
                </Row>
            </Grid>;

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

BacklogFeature.propTypes = {
    featureSummary: PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        backlogContext: state.currentUserBacklogItem
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(BacklogFeature);



