// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import AcceptanceTestScenarioMashItem       from '../../components/dev/AcceptanceTestScenarioMashItem.jsx';
import IntegrationTestScenarioMashItem      from '../../components/dev/IntegrationTestScenarioMashItem.jsx';
import ModuleTestScenarioMashItem           from '../../components/dev/ModuleTestScenarioMashItem.jsx';

// Ultrawide Services
import { DisplayContext }    from '../../../constants/constants.js';

import ClientContainerServices      from '../../../apiClient/apiClientContainerServices.js';

// Bootstrap

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design / Dev Integration Test Scenario Mash Container - List of Scenarios in Integration Test Features or Feature Aspects
//
// ---------------------------------------------------------------------------------------------------------------------

class WorkPackageScenarioMashList extends Component {
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

    renderModuleScenarios(mashData){

        return mashData.map((mashItem) => {
            if(mashItem) {
                return (
                    <ModuleTestScenarioMashItem
                        key={mashItem._id}
                        mashItem={mashItem}
                    />
                );
            }
        });
    };

    render() {

        const {designMashItemData, displayContext, userContext, view} = this.props;

        switch(displayContext){
            case DisplayContext.MASH_ACC_TESTS:
                return(
                    <div>
                        {this.renderAcceptanceScenarios(designMashItemData)}
                    </div>
                );
                break;

            case DisplayContext.MASH_INT_TESTS:
                return(
                    <div>
                        {this.renderIntegrationScenarios(designMashItemData)}
                    </div>
                );
                break;

            case DisplayContext.MASH_MOD_TESTS:
                return(
                    <div>
                        {this.renderModuleScenarios(designMashItemData)}
                    </div>
                );
                break;
        }


    }
}

WorkPackageScenarioMashList.propTypes = {
    designMashItemData: PropTypes.array.isRequired,
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
WorkPackageScenarioMashList = connect(mapStateToProps)(WorkPackageScenarioMashList);


export default WorkPackageScenarioMashContainer = createContainer(({params}) => {


    let designMashItemData = ClientContainerServices.getWorkPackageMashData(params.userContext, params.parentMash);

    return{
        designMashItemData: designMashItemData,
        displayContext: params.displayContext
    }


}, WorkPackageScenarioMashList);