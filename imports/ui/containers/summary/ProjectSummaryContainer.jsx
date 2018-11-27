// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Data
import {UserDvWorkSummaryData}          from "../../../data/summary/user_dv_work_summary_db";

// Ultrawide GUI Components
import ProjectBacklogContainer          from '../../containers/summary/ProjectBacklogContainer.jsx';
import FeatureSummaryContainer          from '../item/FeatureSummaryContainer.jsx';
import WorkItemListContainer            from '../../containers/work/WorkItemContainer.jsx';
import ProjectWorkSummaryItemContainer  from '../../containers/summary/ProjectWorkSummaryItemContainer.jsx'
import ProjectSummaryWorkItemDetail     from '../../components/summary/ProjectWorkSummaryItemDetail.jsx';

// Ultrawide Services
import {DisplayContext, HomePageTab, SummaryType, BacklogType, WorkItemType, LogLevel} from '../../../constants/constants.js';
import {log} from "../../../common/utils";

import { ClientDataServices }           from '../../../apiClient/apiClientDataServices.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';
import store from '../../../redux/store'
import {
    setCurrentUserBacklogItem, setCurrentUserSummaryItem
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
        };
    }

    onSummaryItemSelect(summaryId){

        store.dispatch(setCurrentUserSummaryItem(summaryId));
    }

    getSummaryItem(summaryId){
        return UserDvWorkSummaryData.getWorkItemSummaryDataById(summaryId);
    }


    render() {

        const {dvSummary, userContext, summaryId, backlogItem} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Project Summary');

        console.log('DV Summary = %o', dvSummary);

        const summaryItem = this.getSummaryItem(summaryId);

        let backlogContext = '';

        if(summaryItem) {
            switch (summaryItem.summaryType) {
                case SummaryType.SUMMARY_DV:
                    backlogContext = dvSummary.designVersionName;
                    break;
                case SummaryType.SUMMARY_DV_ASSIGNED:
                    backlogContext = dvSummary.designVersionName + ' (Work Assigned)';
                    break;
                case SummaryType.SUMMARY_DV_UNASSIGNED:
                    backlogContext = dvSummary.designVersionName + ' (Unassigned)';
                    break;
                case SummaryType.SUMMARY_IN:
                    backlogContext = 'Increment: ' + summaryItem.inName;
                    break;
                case SummaryType.SUMMARY_IT:
                    backlogContext = 'Iteration: ' + summaryItem.itName;
                    break;
                case SummaryType.SUMMARY_DU:
                    backlogContext = 'Design Update: ' + summaryItem.duName;
                    break;
                case SummaryType.SUMMARY_WP:
                    backlogContext = 'Work Package: ' + summaryItem.wpName;
                    break;
            }
        } else {
            backlogContext = dvSummary.designVersionName;
        }

        const summaryData = {
            summaryId: dvSummary.dvSummaryId,
            itemName: dvSummary.designVersionName,
            featureCount: dvSummary.dvFeatureCount,
            scenarioCount: dvSummary.dvScenarioCount,
            expectedTests: dvSummary.dvExpectedTestCount,
            passingTests: dvSummary.dvPassingTestCount,
            failingTests: dvSummary.dvFailingTestCount,
            missingTests: dvSummary.dvMissingTestCount,
            noExpectations: dvSummary.dvNoTestExpectationsCount,
            isUnassigned: false
        };

        let dvHeaderText = '';

        if(dvSummary.dvFeatureCount === 1){
            dvHeaderText = dvSummary.designVersionName + ' - ' + dvSummary.dvFeatureCount + ' Feature';
        } else {
            dvHeaderText = dvSummary.designVersionName + ' - ' + dvSummary.dvFeatureCount + ' Features'
        }

        const workItem = {
            _id:    dvSummary.summaryId,
            name:   dvSummary.designVersionName
        };

        const layout =
            <Grid>
                <Row>
                    <Col md={6}>
                        <div className="summary-dv-header"  onClick={() => this.onSummaryItemSelect(dvSummary.summaryId)}>
                            {dvSummary.designVersionName + ' - ' + dvSummary.dvFeatureCount + ' Features'}
                        </div>
                        <div className="summary-section-dv">
                            <ProjectSummaryWorkItemDetail
                                workItemType={WorkItemType.DESIGN_VERSION}
                                summaryData={summaryData}
                                workItem={workItem}
                            />
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="summary-dv-header"  onClick={() => this.onSummaryItemSelect(dvSummary.summaryId)}>
                            {'Design Version Backlogs for ' + backlogContext}
                        </div>
                        <div className="backlog-note">
                            Select a backlog to see a list of Features containing backlog items
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={6} className="close-col">
                        <Row>
                            <Col md={12}>
                                <div className="summary-section-header">
                                    Work Assigned for this Design Version
                                </div>
                                <div className="summary-section-dv">
                                    <ProjectWorkSummaryItemContainer params={{
                                        userContext: userContext,
                                        workItem: {},
                                        workItemType: WorkItemType.DV_ASSIGNED,
                                    }}/>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <div className="summary-section-header">
                                    Breakdown by Work Packages
                                </div>
                                <div className="summary-section-work">
                                    <WorkItemListContainer params={{
                                        workItemsParentRef: 'NONE',
                                        workItemType: WorkItemType.INCREMENT,
                                        userContext: userContext,
                                        displayContext: DisplayContext.WORK_ITEM_SUMMARY
                                    }}/>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <div className="summary-section-header">
                                    Work Not Yet Assigned
                                </div>
                                <div className="summary-section-unassigned">
                                    <ProjectWorkSummaryItemContainer params={{
                                        userContext: userContext,
                                        workItem: {},
                                        workItemType: WorkItemType.DV_UNASSIGNED
                                    }}/>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={6} className="close-col">
                        <Row>
                            <Col md={6} className="close-col">
                                <ProjectBacklogContainer
                                    params={{
                                        userContext: userContext,
                                        currentSummaryId: summaryId,
                                        backlogType: BacklogType.BACKLOG_WP_ASSIGN,
                                        displayContext: DisplayContext.DV_BACKLOG_WORK
                                    }}
                                />
                            </Col>
                            <Col md={6} className="close-col">
                                <ProjectBacklogContainer
                                    params={{
                                        userContext: userContext,
                                        currentSummaryId: summaryId,
                                        backlogType: BacklogType.BACKLOG_TEST_EXP,
                                        displayContext: DisplayContext.DV_BACKLOG_NO_EXP
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6} className="close-col">
                                <ProjectBacklogContainer
                                    params={{
                                        userContext: userContext,
                                        currentSummaryId: summaryId,
                                        backlogType: BacklogType.BACKLOG_TEST_MISSING,
                                        displayContext: DisplayContext.DV_BACKLOG_TEST_MISSING
                                    }}
                                />
                            </Col>
                            <Col md={6} className="close-col">
                                <ProjectBacklogContainer
                                    params={{
                                        userContext: userContext,
                                        currentSummaryId: summaryId,
                                        backlogType: BacklogType.BACKLOG_TEST_FAIL,
                                        displayContext: DisplayContext.DV_BACKLOG_TEST_FAIL
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <FeatureSummaryContainer params={{
                                userContext: userContext,
                                homePageTab: HomePageTab.TAB_SUMMARY,
                                displayContext: backlogItem
                            }}/>
                        </Row>
                    </Col>
                </Row>
            </Grid>;


        return(
            <div>{layout}</div>
        )
    }

}

ProjectSummary.propTypes = {
    dvSummary:  PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext:    state.currentUserItemContext,
        summaryId:      state.currentUserSummaryItem,
        backlogItem:    state.currentUserBacklogItem
    }
}

// Default export including REDUX
export default ProjectSummaryContainer = createContainer(({params}) => {

    const dvSummary = ClientDataServices.getDvSummaryData(params.userContext);

    return  {
        dvSummary: dvSummary
    }

}, connect(mapStateToProps)(ProjectSummary));