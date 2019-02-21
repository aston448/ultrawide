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
import {ItemListType} from "../../../constants/constants";
import {ClientUserSettingsServices} from "../../../apiClient/apiClientUserSettings";
import {UserTestData} from "../../../data/test_data/user_test_data_db";



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

        return UserTestData.getWorkItemSummaryDataById(summaryId);
        //return UserDvWorkSummaryData.getWorkItemSummaryDataById(summaryId);
    }

    getWindowSizeClass(){

        return ClientUserSettingsServices.getWindowSizeClassForWorkItems();
    }

    render() {

        const {dvSummary, userContext, summaryId, backlogItem} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Project Summary');

        //console.log('DV Summary = %o', dvSummary);

        const summaryItem = this.getSummaryItem(summaryId);

        const workScrollClass = this.getWindowSizeClass();

        let backlogContext = '';

        if(summaryItem) {
            switch (summaryItem.workItemType) {
                case WorkItemType.DESIGN_VERSION:
                case WorkItemType.DV_ASSIGNED:
                case WorkItemType.DV_UNASSIGNED:
                    backlogContext = summaryItem.workItemName;
                    break;

                case WorkItemType.INCREMENT:
                    backlogContext = 'Increment: ' + summaryItem.workItemName;
                    break;
                case WorkItemType.ITERATION:
                    backlogContext = 'Iteration: ' + summaryItem.workItemName;
                    break;
                case WorkItemType.DESIGN_UPDATE:
                    backlogContext = 'Design Update: ' + summaryItem.workItemName;
                    break;
                case WorkItemType.BASE_WORK_PACKAGE:
                case WorkItemType.UPDATE_WORK_PACKAGE:
                    backlogContext = 'Work Package: ' + summaryItem.workItemName;
                    break;
            }
        } else {
            backlogContext = dvSummary.workItemName;
        }

        let dvHeaderText = '';

        if(dvSummary.totalFeatures === 1){
            dvHeaderText = dvSummary.workItemName + ' - ' + dvSummary.totalFeatures + ' Feature';
        } else {
            dvHeaderText = dvSummary.workItemName + ' - ' + dvSummary.totalFeatures + ' Features'
        }

        const layout =
            <Grid>
                <Row>
                    <Col md={6} className="close-col">
                        <div className="summary-dv-header"  onClick={() => this.onSummaryItemSelect(dvSummary._id)}>
                            {dvHeaderText}
                        </div>
                        <div className="summary-section-dv">
                            <ProjectWorkSummaryItemContainer params={{
                                userContext: userContext,
                                workItem: {
                                    _id:    dvSummary.workItemId
                                },
                                workItemType: WorkItemType.DESIGN_VERSION,
                            }}/>
                        </div>
                    </Col>
                    <Col md={6} className="close-col">
                        <div className="summary-dv-header"  onClick={() => this.onSummaryItemSelect(dvSummary._id)}>
                            {'Design Version Backlogs for ' + backlogContext}
                        </div>
                        <div className="backlog-note">
                            Select a backlog to see a list of Features containing backlog items
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={6} className={workScrollClass}>
                        <Row>
                            <Col md={12} className="close-col">
                                <div className="summary-section-header">
                                    Work Assigned for this Design Version
                                </div>
                                <div className="summary-section-dv">
                                    <ProjectWorkSummaryItemContainer params={{
                                        userContext: userContext,
                                        workItem: {
                                            _id:    dvSummary.workItemId
                                        },
                                        workItemType: WorkItemType.DV_ASSIGNED,
                                    }}/>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12} className="close-col">
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
                            <Col md={12} className="close-col">
                                <div className="summary-section-header">
                                    Work Not Yet Assigned
                                </div>
                                <div className="summary-section-unassigned">
                                    <ProjectWorkSummaryItemContainer params={{
                                        userContext: userContext,
                                        workItem: {
                                            _id:    dvSummary.workItemId
                                        },
                                        workItemType: WorkItemType.DV_UNASSIGNED
                                    }}/>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={6} className="close-col scroll-col">
                        {/*<Row>*/}
                            {/*<ProjectBacklogContainer*/}
                                {/*params={{*/}
                                    {/*userContext: userContext,*/}
                                    {/*currentSummaryId: summaryId,*/}
                                    {/*backlogType: BacklogType.BACKLOG_DESIGN,*/}
                                {/*}}*/}
                            {/*/>*/}
                        {/*</Row>*/}
                        <Row>
                            <ProjectBacklogContainer
                                params={{
                                    userContext: userContext,
                                    currentSummaryId: summaryId,
                                    backlogType: BacklogType.BACKLOG_FEATURE_ANOMALY,
                                }}
                            />
                        </Row>
                        <Row>
                            <ProjectBacklogContainer
                                params={{
                                    userContext: userContext,
                                    currentSummaryId: summaryId,
                                    backlogType: BacklogType.BACKLOG_SCENARIO_ANOMALY,
                                }}
                            />
                        </Row>
                        <Row>
                            <ProjectBacklogContainer
                                params={{
                                    userContext: userContext,
                                    currentSummaryId: summaryId,
                                    backlogType: BacklogType.BACKLOG_WP_ASSIGN,
                                }}
                            />
                        </Row>
                        <Row>
                            <ProjectBacklogContainer
                                params={{
                                    userContext: userContext,
                                    currentSummaryId: summaryId,
                                    backlogType: BacklogType.BACKLOG_TEST_EXP,
                                }}
                            />
                        </Row>
                        <Row>
                            <ProjectBacklogContainer
                                params={{
                                    userContext: userContext,
                                    currentSummaryId: summaryId,
                                    backlogType: BacklogType.BACKLOG_TEST_MISSING,
                                }}
                            />
                        </Row>
                        <Row>
                            <ProjectBacklogContainer
                                params={{
                                    userContext: userContext,
                                    currentSummaryId: summaryId,
                                    backlogType: BacklogType.BACKLOG_TEST_FAIL,
                                }}
                            />
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

    const workItem = {
        _id:    params.userContext.designVersionId
    };

    const dvSummary = ClientDataServices.getWorkItemSummary(params.userContext, workItem, WorkItemType.DESIGN_VERSION);

    return  {
        dvSummary: dvSummary
    }

}, connect(mapStateToProps)(ProjectSummary));