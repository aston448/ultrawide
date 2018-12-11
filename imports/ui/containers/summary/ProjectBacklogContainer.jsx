// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import ProjectBacklogItem               from '../../components/summary/ProjectBacklogItem.jsx';
import FeatureSummaryContainer          from '../item/FeatureSummaryContainer.jsx';
import WorkItemListContainer            from '../../containers/work/WorkItemContainer.jsx';
import ProjectWorkSummaryItemContainer  from '../../containers/summary/ProjectWorkSummaryItemContainer.jsx'

// Ultrawide Services
import {DisplayContext, HomePageTab, LogLevel} from '../../../constants/constants.js';
import {log} from "../../../common/utils";

import { ClientDataServices }           from '../../../apiClient/apiClientDataServices.js';

// Bootstrap
import {Grid, Row, Col, Well} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';
import store from '../../../redux/store'
import {
    setCurrentUserBacklogItem
} from '../../../redux/actions'
import {SummaryType, WorkItemType} from "../../../constants/constants";
import {WorkItemData} from "../../../data/work/work_item_db";
import {UserDvWorkSummaryData} from "../../../data/summary/user_dv_work_summary_db";


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Project Summary Data Container
//
// ---------------------------------------------------------------------------------------------------------------------


// Export for unit tests
export class ProjectBacklog extends Component {

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

        const {backlogSummary, selectedItemSummary, displayContext, userContext} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Backlog Summary');

        // Backlog Summary is an Array of Features in the backlog
        let scenarioCount = 0;
        let testCount = 0;
        let featureCount = 0;
        let totalFeatureCount = 0;
        let noExpectationsCount = 0;
        let missingTestCount = 0;
        let failingTestCount = 0;

        // Default to whole DV if nothing selected
        let summaryType = SummaryType.SUMMARY_DV;

        if(selectedItemSummary){
            summaryType = selectedItemSummary.summaryType;
        }

        switch(displayContext){

            case DisplayContext.DV_BACKLOG_DESIGN:

                break;

            case DisplayContext.DV_BACKLOG_ANOMALY:

                backlogSummary.forEach((backlogItem) => {

                    if (summaryType === SummaryType.SUMMARY_DV) {
                        //  For the whole DV we count all Anomalies (Feature and Scenario)
                        scenarioCount += backlogItem.featureAnomalyCount;
                    } else {
                        // For subsets we only count anomalies related to Scenarios
                        scenarioCount += backlogItem.scenarioAnomalyCount;
                    }
                });

                break;

            case DisplayContext.DV_BACKLOG_WORK:
                break;

            case DisplayContext.DV_BACKLOG_NO_EXP:

                if(selectedItemSummary) {
                    scenarioCount = selectedItemSummary.noExpectationsCount;
                }
                break;

            case DisplayContext.DV_BACKLOG_TEST_MISSING:

                if(selectedItemSummary) {
                    testCount = selectedItemSummary.missingTestCount;
                }

                backlogSummary.forEach((backlogItem) => {
                    scenarioCount += backlogItem.scenarioCount;
                });

                break;

            case DisplayContext.DV_BACKLOG_TEST_FAIL:

                if(selectedItemSummary) {
                    testCount = selectedItemSummary.failingTestCount;
                }

                backlogSummary.forEach((backlogItem) => {
                    scenarioCount += backlogItem.scenarioCount;
                });

        }



        return(
            <div>
                <ProjectBacklogItem
                    displayContext={displayContext}
                    summaryType={summaryType}
                    totalFeatureCount={totalFeatureCount}
                    featureCount={backlogSummary.length}
                    scenarioCount={scenarioCount}
                    testCount={testCount}
                    selectionFunction={() => this.onSummaryItemSelect(displayContext)}
                />
            </div>
        )
    }

}

ProjectBacklog.propTypes = {
    backlogSummary:         PropTypes.array.isRequired,
    selectedItemSummary:    PropTypes.object,
    displayContext:         PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext,
        //summaryItem: state.currentUserSummaryItem
    }
}

// Default export including REDUX
export default ProjectBacklogContainer = createContainer(({params}) => {

    //console.log('Getting work item summary for id ' + params.currentSummaryId);

    let selectedItemSummary ={};

    // If no selection, default to the whole DV
    if(params.currentSummaryId === 'NONE'){
        selectedItemSummary = UserDvWorkSummaryData.getDesignVersionSummary(params.userContext.designVersionId)
    } else {
        selectedItemSummary = UserDvWorkSummaryData.getWorkItemSummaryDataById(params.currentSummaryId);
    }


    const backlogSummary = ClientDataServices.getBacklogSummaryData(
        params.userContext,
        selectedItemSummary,
        params.backlogType
    );

    return  {
        backlogSummary: backlogSummary,
        selectedItemSummary: selectedItemSummary,
        displayContext: params.displayContext
    }

}, connect(mapStateToProps)(ProjectBacklog));