// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import ProjectBacklogItem               from '../../components/summary/ProjectBacklogItem.jsx';

// Ultrawide Services
import {LogLevel} from '../../../constants/constants.js';
import {log} from "../../../common/utils";

import { ClientDataServices }           from '../../../apiClient/apiClientDataServices.js';

// Bootstrap

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
export class ProjectBacklog extends Component {

    constructor(props) {
        super(props);

        this.state = {
            backlogType: 'NONE'
        };
    }

    onBacklogItemSelect(backlogType){

        //console.log('Setting display context to ' + displayContext);

        this.setState({backlogType: backlogType});

        store.dispatch(setCurrentUserBacklogItem(backlogType));
    }


    render() {

        const {backlogFeatures, backlogItemTotal, backlogType, workItemType} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Backlog Summary');


        return(
            <div>
                <ProjectBacklogItem
                    backlogType={backlogType}
                    workItemType={workItemType}
                    backlogFeatures={backlogFeatures}
                    backlogItemTotal={backlogItemTotal}
                    selectionFunction={() => this.onBacklogItemSelect(backlogType)}
                />
            </div>
        )
    }

}

ProjectBacklog.propTypes = {
    backlogFeatures:        PropTypes.object.isRequired,
    backlogItemTotal:       PropTypes.number.isRequired,
    backlogType:            PropTypes.string.isRequired,
    workItemType:           PropTypes.string.isRequired,
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

    // Get a list of Features with the backlog totals against them.
    const backlogData = ClientDataServices.getBacklogData(
        params.userContext,
        params.currentSummaryId,
        params.backlogType
    );

    return  {
        backlogFeatures: backlogData.backlogFeatures,
        backlogItemTotal: backlogData.backlogItemTotal,
        backlogType: params.backlogType,
        workItemType: backlogData.workItemType
    }

}, connect(mapStateToProps)(ProjectBacklog));