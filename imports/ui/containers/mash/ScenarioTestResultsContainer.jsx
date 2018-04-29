// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import SingleTestScenarioMashItem           from '../../components/mash/SingleTestScenarioMashItem.jsx';
import MultiTestScenarioMashItem            from '../../components/mash/MultiTestScenarioMashItem.jsx';

// Ultrawide Services
import {log} from "../../../common/utils";
import { DisplayContext, LogLevel }    from '../../../constants/constants.js';

import { ClientDataServices }                   from '../../../apiClient/apiClientDataServices.js';
import { TestResultsUiServices }                from "../../../ui_modules/test_results";

// Bootstrap

// REDUX services
import {connect} from 'react-redux';



// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design / Dev Integration Test Scenario Mash Container - List of Scenarios known in the Design
//
// ---------------------------------------------------------------------------------------------------------------------

class ScenarioTestResultsList extends Component {
    constructor(props) {
        super(props);

    }

    shouldComponentUpdate(nextProps, nextState){

        return TestResultsUiServices.shouldContainerUpdate(this.props, nextProps, 'UPDATE');
    };


    renderAcceptanceScenarios(mashData){

        return mashData.map((mashItem) => {
            if(mashItem) {

                // For acceptance tests show as a list if more than one test is defined for a scenario
                if(mashItem.accTestCount > 1){
                    return (
                        <MultiTestScenarioMashItem
                            key={mashItem._id}
                            mashItem={mashItem}
                            displayContext={DisplayContext.MASH_ACC_TESTS}
                        />
                    );
                } else {
                    return (
                        <SingleTestScenarioMashItem
                            key={mashItem._id}
                            mashItem={mashItem}
                            displayContext={DisplayContext.MASH_ACC_TESTS}
                        />
                    );
                }
            }
        });
    };

    renderIntegrationScenarios(mashData){

        return mashData.map((mashItem) => {
            if(mashItem) {

                // For integration tests show as a list if more than one test is defined for a scenario
                if(mashItem.intTestCount > 1){
                    return (
                        <MultiTestScenarioMashItem
                            key={mashItem._id}
                            mashItem={mashItem}
                            displayContext={DisplayContext.MASH_INT_TESTS}
                        />
                    );
                } else {
                    return (
                        <SingleTestScenarioMashItem
                            key={mashItem._id}
                            mashItem={mashItem}
                            displayContext={DisplayContext.MASH_INT_TESTS}
                        />
                    );
                }
            }
        });
    };

    renderUnitScenarios(mashData){

        return mashData.map((mashItem) => {
            if(mashItem) {

                // For unit tests we always show as a list even if just one test
                return (
                    <MultiTestScenarioMashItem
                        key={mashItem._id}
                        mashItem={mashItem}
                        displayContext={DisplayContext.MASH_UNIT_TESTS}
                    />
                );

            }
        });
    };

    render() {

        const {scenarioMashData, displayContext, userContext, view} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Scenario Test Results');

        switch(displayContext){
            case DisplayContext.MASH_ACC_TESTS:
                return(
                    <div>
                        {this.renderAcceptanceScenarios(scenarioMashData)}
                    </div>
                );

            case DisplayContext.MASH_INT_TESTS:
                return(
                    <div>
                        {this.renderIntegrationScenarios(scenarioMashData)}
                    </div>
                );

            case DisplayContext.MASH_UNIT_TESTS:
                return(
                    <div>
                        {this.renderUnitScenarios(scenarioMashData)}
                    </div>
                );

        }


    }
}

ScenarioTestResultsList.propTypes = {
    scenarioMashData: PropTypes.array.isRequired,
    displayContext: PropTypes.string.isRequired
};


// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        currentUserRole:    state.currentUserRole,
        userContext:        state.currentUserItemContext,
        view:               state.currentAppView,
        userViewOptions:    state.currentUserViewOptions
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
ScenarioTestResultsList = connect(mapStateToProps)(ScenarioTestResultsList);


export default ScenarioTestResultsContainer = createContainer(({params}) => {

    let scenarioMashData = [];

    // If we already have the mash data for one scenario so just pass it on
    if(params.mashData !== null){

        //console.log("Using scenario mash data");
        scenarioMashData = [params.mashData];

    } else {

        // Otherwise we are gathering scenarios for a feature aspect so get the mash data
        //console.log("Getting scenario mash data");
        scenarioMashData = ClientDataServices.getScenarioMashData(params.userContext, params.featureAspectReferenceId);
    }


    //console.log("Got " + scenarioMashData.length + " scenario records");

    return{
        scenarioMashData: scenarioMashData,
        displayContext: params.displayContext
    }


}, ScenarioTestResultsList);