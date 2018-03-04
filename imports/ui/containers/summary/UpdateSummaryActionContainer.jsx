// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import UpdateSummaryAction          from '../../components/summary/UpdateSummaryAction.jsx';

// Ultrawide Services
import ClientDesignUpdateSummary    from '../../../apiClient/apiClientDesignUpdateSummary.js';
import {log} from "../../../common/utils";
import {LogLevel} from "../../../constants/constants";

// Bootstrap

// REDUX services

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Update Summary Action Container - lists of changes under a common item header
//
// ---------------------------------------------------------------------------------------------------------------------


// Export for unit tests
export class UpdateSummaryActionList extends Component {

    constructor(props) {
        super(props);

    }

    shouldComponentUpdate(nextProps, nextState){

        return true;
    }

    // A list of Actions under an Update Summary header

    renderActions(headerActions) {

        if(headerActions) {

            return headerActions.map((action) => {
                return(
                    <UpdateSummaryAction
                        key={action._id}
                        actionItem={action}
                    />
                )
            });
        } else {
            return(<div>No actions</div>);
        }
    }

    render() {

        const {headerActions} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Update Summary Action');

        // There must be actions or we would not have rendered a header...
        return(
            <div>
                {this.renderActions(headerActions)}
            </div>
        )
    }

}

UpdateSummaryActionList.propTypes = {
    headerActions:  PropTypes.array.isRequired
};

export default UpdateSummaryActionContainer = createContainer(({params}) => {

    let headerActions = [];

    if(params.userContext.workPackageId !== 'NONE'){
        // Just get actions relevant to current WP
        headerActions = ClientDesignUpdateSummary.getDesignUpdateSummaryHeaderActionsForWp(params.headerId, params.userContext.workPackageId);
        //console.log("Got " + headerActions.length + " header actions for WP");
    } else {
        // Get all Update actions
        headerActions = ClientDesignUpdateSummary.getDesignUpdateSummaryHeaderActions(params.headerId);
        //console.log("Got " + headerActions.length + " header actions for Update");
    }

    // console.log("Found " + headerActions.length + " actions for header " +params.headerId);
    return(
        {
            headerActions: headerActions
        }
    )

}, UpdateSummaryActionList);