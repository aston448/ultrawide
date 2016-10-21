// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import DesignComponentAdd from '../../components/common/DesignComponentAdd.jsx';
import SuggestedStep from '../../components/edit/SuggestedStep.jsx';

// Ultrawide Services
import { DisplayContext, ViewMode} from '../../../constants/constants.js';
import ClientContainerServices from '../../../apiClient/apiClientContainerServices.js';
import ClientScenarioStepServices from '../../../apiClient/apiClientScenarioStep.js';

// Bootstrap


// REDUX services
import {connect} from 'react-redux';

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Suggested Steps Data Container - selects suggested steps that match a step being edited
//
// ---------------------------------------------------------------------------------------------------------------------

// Scenarios List for a Feature or Feature Aspect
class SuggestedStepsList extends Component {
    constructor(props) {
        super(props);

    }

    // A list of Scenario Steps matching a current input
    renderSuggestedSteps(suggestedSteps, callback) {

        return suggestedSteps.map((step) => {
            return(
                <SuggestedStep
                    key={step._id}
                    stepText={step.stepText}
                    callback={callback}
                />
            )
        });
    }

    render() {
        const {suggestedSteps, callback} = this.props;

        if(suggestedSteps && suggestedSteps.length > 0) {
            return (
                <div className="suggested-steps">
                    {this.renderSuggestedSteps(suggestedSteps, callback)}
                </div>
            );
        } else {
            return <div></div>
        }
    }
}

SuggestedStepsList.propTypes = {
    suggestedSteps: PropTypes.array.isRequired,
    callback: PropTypes.func.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        view: state.currentAppView,
        mode: state.currentViewMode,
        userItemContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
SuggestedStepsList = connect(mapStateToProps)(SuggestedStepsList);

export default SuggestedStepsContainer = createContainer(({params}) => {

    return ClientScenarioStepServices.getSuggestedScenarioSteps(
        params.designId,
        params.currentStepId,
        params.currentInputText,
        params.stepContext,
        params.callback
    );

}, SuggestedStepsList);