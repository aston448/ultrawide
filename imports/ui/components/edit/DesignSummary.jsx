// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components

// Ultrawide Services
import { ItemType, RoleType } from '../../../constants/constants.js';
import ClientDesignServices from '../../../apiClient/apiClientDesign.js';
import ClientBackupServices from '../../../apiClient/apiClientBackup.js';

// Bootstrap
import {Button, ButtonGroup} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Summary Component - Contains summary of overall Design stats
//
// ---------------------------------------------------------------------------------------------------------------------

export class DesignSummary extends Component {
    constructor(props) {
        super(props);
    }



    render() {
        const {summaryData, userContext, userRole} = this.props;

        if(summaryData) {

            return (
                <div className="design-summary">
                    <span className="summary-title">Features: </span>
                    <span className="summary-data">{summaryData.featureCount}</span>
                    <span className="summary-title">Scenarios: </span>
                    <span className="summary-data">{summaryData.scenarioCount}</span>
                    <span className="summary-title">Scenarios Tested: </span>
                    <span className="summary-data">{summaryData.scenarioCount - summaryData.untestedScenarioCount}</span>
                    <span className="summary-title">Scenarios Untested: </span>
                    <span className="summary-data">{summaryData.untestedScenarioCount}</span>
                    {/*<span className="summary-title">Int Tests Passing: </span>*/}
                    {/*<span className="summary-data">{summaryData.intTestPassCount}</span>*/}
                    {/*<span className="summary-title">Int Tests Failing: </span>*/}
                    {/*<span className="summary-data">{summaryData.intTestFailCount}</span>*/}
                    {/*<span className="summary-title">Int Tests Pending: </span>*/}
                    {/*<span className="summary-data">{summaryData.intTestPendingCount}</span>*/}
                    {/*<span className="summary-title">Unit Tests Passing: </span>*/}
                    {/*<span className="summary-data">{summaryData.unitTestPassCount}</span>*/}
                    {/*<span className="summary-title">Unit Tests Failing: </span>*/}
                    {/*<span className="summary-data">{summaryData.unitTestFailCount}</span>*/}
                    {/*<span className="summary-title">Unit Tests Pending: </span>*/}
                    {/*<span className="summary-data">{summaryData.unitTestPendingCount}</span>*/}
                </div>
            )
        } else {
            return(<div></div>);
        }
    }
}

DesignSummary.propTypes = {
    summaryData: PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext,
        userRole: state.currentUserRole
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(DesignSummary);


