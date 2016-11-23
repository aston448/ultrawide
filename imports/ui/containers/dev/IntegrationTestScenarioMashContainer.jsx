// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import IntegrationTestScenarioMashItem   from '../../components/dev/IntegrationTestScenarioMashItem.jsx';

// Ultrawide Services
import {}    from '../../../constants/constants.js';

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

class IntegrationTestScenarioMashList extends Component {
    constructor(props) {
        super(props);

    }

    shouldComponentUpdate(nextProps, nextState){
        return (nextProps.userContext != this.props.userContext);
    }

    renderScenarios(mashData){

        //console.log("Rendering mash list of length " + mashData.length);

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
    }

    render() {

        const {designMashItemData, userContext, view} = this.props;

        return(
            <div>
                {this.renderScenarios(designMashItemData)}
            </div>
        );

    }
}

IntegrationTestScenarioMashList.propTypes = {
    designMashItemData: PropTypes.array
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
IntegrationTestScenarioMashList = connect(mapStateToProps)(IntegrationTestScenarioMashList);


export default IntegrationTestScenarioMashContainer = createContainer(({params}) => {


    let designMashItemData = ClientContainerServices.getDesignIntegrationTestMashData(params.userContext, params.parentMash);

    return{
        designMashItemData
    }


}, IntegrationTestScenarioMashList);