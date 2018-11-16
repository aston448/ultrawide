// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import ProjectSummaryWorkItemDetail       from '../../components/summary/ProjectWorkSummaryItemDetail.jsx';


// Ultrawide Services
import {ClientDataServices}         from "../../../apiClient/apiClientDataServices";
import {ClientWorkItemServices}    from "../../../apiClient/apiClientWorkItem";

import {WorkItemType, ItemListType, LogLevel, RoleType, DisplayContext} from "../../../constants/constants";
import {AddActionIds} from "../../../constants/ui_context_ids";

// REDUX services
import {connect} from 'react-redux';
import {log} from "../../../common/utils";

// React component
export class ProjectWorkSummaryItem extends Component {

    render(){
        const {workItemType, summaryData, workItem, userContext, userRole} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Project Work Summary Item');

        return(
            <div>
               <ProjectSummaryWorkItemDetail
                   workItemType={workItemType}
                   summaryData={summaryData}
                   workItem={workItem}
               />
            </div>
        )
    }

}

ProjectWorkSummaryItem.propTypes = {
    workItemType:   PropTypes.string.isRequired,
    summaryData:    PropTypes.object.isRequired,
    workItem:       PropTypes.object
};

function mapStateToProps(state) {
    return {
        userContext:            state.currentUserItemContext,
        userRole:               state.currentUserRole
    }
}

export default ProjectWorkSummaryItemContainer = createContainer(({params}) => {

    const summaryData = ClientDataServices.getWorkItemSummaryData(
        params.userContext,
        params.workItem,
        params.workItemType
    );

    return{
        workItemType:   params.workItemType,
        summaryData:    summaryData,
        workItem:       params.workItem
    }

}, connect(mapStateToProps)(ProjectWorkSummaryItem));


