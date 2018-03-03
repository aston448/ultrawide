// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import {log} from "../../../common/utils";
import {LogLevel} from "../../../constants/constants";

// Bootstrap

// REDUX services
import {connect} from 'react-redux';


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

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Design Summary');

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


