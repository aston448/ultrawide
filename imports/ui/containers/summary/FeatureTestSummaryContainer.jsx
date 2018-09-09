// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import FeatureTestSummary from "../../components/summary/FeatureTestSummary";

// Ultrawide Services
import { ClientDataServices }           from '../../../apiClient/apiClientDataServices.js';


import {log} from "../../../common/utils";
import {DisplayContext, LogLevel} from "../../../constants/constants";
import {connect} from "react-redux";



// Bootstrap

// REDUX services

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Feature Test Summary Container - gets the data for a Feature Test Summary
//
// ---------------------------------------------------------------------------------------------------------------------


// Export for unit tests
export class FeatureTestSummaryOverlay extends Component {

    constructor(props) {
        super(props);

    }

    shouldComponentUpdate(nextProps, nextState){

        return true;
    }


    render() {

        const {featureSummaryData} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Feature Test Summary');

        return(
            <div>
                <FeatureTestSummary
                    testSummaryData={featureSummaryData}
                />
            </div>
        )
    }

}

FeatureTestSummaryOverlay.propTypes = {
    featureSummaryData:  PropTypes.object
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userViewOptions: state.currentUserViewOptions,
        view: state.currentAppView
    }
}


export default FeatureTestSummaryContainer = createContainer(({params}) => {

    // Get the summary data for the Feature
    const featureSummaryData =  ClientDataServices.getFeatureTestSummaryData(
        params.userContext,
        params.featureRefId
    );

    return{
        featureSummaryData: featureSummaryData
    }


}, connect(mapStateToProps)(FeatureTestSummaryOverlay));