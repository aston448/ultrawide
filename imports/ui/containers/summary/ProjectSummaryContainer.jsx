// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import ProjectBacklogItem           from '../../components/summary/BacklogItem.jsx';
import FeatureSummaryContainer      from '../item/FeatureSummaryContainer.jsx';

// Ultrawide Services
import {DisplayContext, HomePageTab, LogLevel} from '../../../constants/constants.js';
import {log} from "../../../common/utils";

import { ClientDataServices }           from '../../../apiClient/apiClientDataServices.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';
import store from '../../../redux/store'
import {
    setCurrentUserBacklogItem
} from '../../../redux/actions'


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Project Summary Data Container
//
// ---------------------------------------------------------------------------------------------------------------------


// Export for unit tests
export class ProjectSummary extends Component {

    constructor(props) {
        super(props);

        this.state = {
            displayContext: DisplayContext.PROJECT_SUMMARY_ALL
        };
    }

    onSummaryItemSelect(displayContext){

        //console.log('Setting display context to ' + displayContext);

        this.setState({displayContext: displayContext});

        store.dispatch(setCurrentUserBacklogItem(displayContext));
    }


    render() {

        const {designVersionName, dvTotalFeatureCount, dvTotalScenarioCount, dvExpectedTestCount, dvPassingTestCount, dvNoTestExpectationsCount, dvMissingTestCount, dvFailingTestCount, userContext} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Project Summary');

        const layout =
            <Grid>
                <Row>
                    <Col md={4}>
                        <div className="project-summary-header">{designVersionName}</div>
                    </Col>
                    <Col md={2}>
                        <div className="project-summary-features">{dvTotalFeatureCount + ' FEATURES'}</div>
                    </Col>
                    <Col md={2}>
                        <div className="project-summary-features">{dvTotalScenarioCount + ' SCENARIOS'}</div>
                    </Col>
                    <Col md={2}>
                        <div className="project-summary-tests">{dvExpectedTestCount + ' TESTS EXPECTED'}</div>
                    </Col>
                    <Col md={2}>
                        <div className="project-summary-tests">{dvPassingTestCount + ' TESTS PASSING'}</div>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <ProjectBacklogItem
                            displayContext={DisplayContext.DV_BACKLOG_DESIGN}
                            totalFeatureCount={dvTotalFeatureCount}
                            featureCount={0}
                            scenarioCount={0}
                            testCount={0}
                            selectionFunction={() => this.onSummaryItemSelect(DisplayContext.DV_BACKLOG_DESIGN)}
                        />
                        <ProjectBacklogItem
                            displayContext={DisplayContext.DV_BACKLOG_NO_EXP}
                            totalFeatureCount={dvTotalFeatureCount}
                            featureCount={0}
                            scenarioCount={dvNoTestExpectationsCount}
                            testCount={0}
                            selectionFunction={() => this.onSummaryItemSelect(DisplayContext.DV_BACKLOG_NO_EXP)}
                        />
                        <ProjectBacklogItem
                            displayContext={DisplayContext.DV_BACKLOG_TEST_MISSING}
                            totalFeatureCount={dvTotalFeatureCount}
                            featureCount={0}
                            scenarioCount={dvMissingTestCount}
                            testCount={0}
                            selectionFunction={() => this.onSummaryItemSelect(DisplayContext.DV_BACKLOG_TEST_MISSING)}
                        />
                        <ProjectBacklogItem
                            displayContext={DisplayContext.DV_BACKLOG_TEST_FAIL}
                            totalFeatureCount={dvTotalFeatureCount}
                            featureCount={0}
                            scenarioCount={dvFailingTestCount}
                            testCount={0}
                            selectionFunction={() => this.onSummaryItemSelect(DisplayContext.DV_BACKLOG_TEST_FAIL)}
                        />
                    </Col>
                    <Col md={8} >
                        <FeatureSummaryContainer params={{
                            userContext: userContext,
                            homePageTab: HomePageTab.TAB_SUMMARY,
                            displayContext: store.getState().currentUserBacklogItem
                        }}/>
                    </Col>
                </Row>
            </Grid>;


        return(
            <div>{layout}</div>
        )
    }

}

ProjectSummary.propTypes = {
    designVersionName: PropTypes.string.isRequired,
    dvTotalFeatureCount: PropTypes.number.isRequired,
    dvTotalScenarioCount: PropTypes.number.isRequired,
    dvExpectedTestCount: PropTypes.number.isRequired,
    dvPassingTestCount: PropTypes.number.isRequired,
    dvNoTestExpectationsCount: PropTypes.number.isRequired,
    dvMissingTestCount: PropTypes.number.isRequired,
    dvFailingTestCount: PropTypes.number.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext
    }
}

// Default export including REDUX
export default ProjectSummaryContainer = createContainer(({params}) => {

    const dvSummary = ClientDataServices.getDvSummaryData(params.userContext);

    //TODO access from new summary data
    return  {
        designVersionName: dvSummary.designVersionName,
        dvTotalFeatureCount: dvSummary.dvFeatureCount,
        dvTotalScenarioCount: dvSummary.dvScenarioCount,
        dvExpectedTestCount: dvSummary.dvExpectedTestCount,
        dvPassingTestCount: dvSummary.dvPassingTestCount,
        dvNoTestExpectationsCount: dvSummary.dvNoTestExpectationsCount,
        dvMissingTestCount: dvSummary.dvMissingTestCount,
        dvFailingTestCount: dvSummary.dvFailingTestCount,
    }

}, connect(mapStateToProps)(ProjectSummary));