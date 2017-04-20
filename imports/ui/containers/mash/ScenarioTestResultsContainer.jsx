// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import AcceptanceTestScenarioMashItem       from '../../components/mash/AcceptanceTestScenarioMashItem.jsx';
import IntegrationTestScenarioMashItem      from '../../components/mash/IntegrationTestScenarioMashItem.jsx';
import UnitTestScenarioMashItem             from '../../components/mash/UnitTestScenarioMashItem.jsx';

// Ultrawide Services
import { DisplayContext }    from '../../../constants/constants.js';

import ClientContainerServices      from '../../../apiClient/apiClientContainerServices.js';

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
        return true;
    };

    renderAcceptanceScenarios(mashData){

        return mashData.map((mashItem) => {
            if(mashItem) {
                return (
                    <AcceptanceTestScenarioMashItem
                        key={mashItem._id}
                        mashItem={mashItem}
                    />
                );
            }
        });
    };

    renderIntegrationScenarios(mashData){

        return mashData.map((mashItem) => {
            if(mashItem) {
                return (
                    <IntegrationTestScenarioMashItem
                        key={mashItem._id}
                        mashItem={mashItem}
                    />
                );
            }
        });
    };

    renderUnitScenarios(mashData){

        return mashData.map((mashItem) => {
            if(mashItem) {
                return (
                    <UnitTestScenarioMashItem
                        key={mashItem._id}
                        mashItem={mashItem}
                    />
                );
            }
        });
    };

    render() {

        const {scenarioMashData, displayContext, userContext, view} = this.props;

        switch(displayContext){
            case DisplayContext.MASH_ACC_TESTS:
                return(
                    <div>
                        {this.renderAcceptanceScenarios(scenarioMashData)}
                    </div>
                );
                break;

            case DisplayContext.MASH_INT_TESTS:
                return(
                    <div>
                        {this.renderIntegrationScenarios(scenarioMashData)}
                    </div>
                );
                break;

            case DisplayContext.MASH_UNIT_TESTS:
                return(
                    <div>
                        {this.renderUnitScenarios(scenarioMashData)}
                    </div>
                );
                break;
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
        view:               state.currentAppView
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
ScenarioTestResultsList = connect(mapStateToProps)(ScenarioTestResultsList);


export default ScenarioTestResultsContainer = createContainer(({params}) => {


    let scenarioMashData = ClientContainerServices.getScenarioMashData(params.userContext, params.featureAspectReferenceId);

    return{
        scenarioMashData: scenarioMashData,
        displayContext: params.displayContext
    }


}, ScenarioTestResultsList);