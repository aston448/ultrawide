// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import DesignComponentAdd from '../../components/common/DesignComponentAdd.jsx';
import ScenarioStep from '../../components/edit/ScenarioStep.jsx';

// Ultrawide Services
import { DisplayContext, ViewType, ViewMode, StepContext } from '../../../constants/constants.js';
import ClientContainerServices from '../../../apiClient/apiClientContainerServices.js';
import ClientScenarioStepServices from '../../../apiClient/apiClientScenarioStep.js';

// Bootstrap


// REDUX services
import {connect} from 'react-redux';

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Scenario Steps Data Container - selects data for Steps in a Scenario
//
// ---------------------------------------------------------------------------------------------------------------------

// Scenarios List for a Feature or Feature Aspect
class ScenarioStepsList extends Component {
    constructor(props) {
        super(props);

    }

    addStep(view, mode, displayContext, stepContext, parentReferenceId, userItemContext, parentInScope){
        switch (stepContext){
            case StepContext.STEP_FEATURE:
                ClientScenarioStepServices.addNewBackgroundStep(view, mode, parentReferenceId, userItemContext, parentInScope);
                break;
            case StepContext.STEP_SCENARIO:
                ClientScenarioStepServices.addNewScenarioStep(view, mode, parentReferenceId, userItemContext, parentInScope);
                break;
        }

    }

    // A list of Scenarios in a Feature or Feature Aspect
    renderSteps(steps, parentInScope, view, mode, displayContext, stepContext, userContext) {

        return steps.map((step) => {
            return(
                <ScenarioStep
                    key={step._id}
                    scenarioStep={step}
                    parentInScope={parentInScope}
                    view={view}
                    mode={mode}
                    displayContext={displayContext}
                    stepContext={stepContext}
                    userContext={userContext}
                />
            )
        });
    }

    render() {
        const {steps, displayContext, stepContext, parentReferenceId, parentInScope, view, mode, userContext} = this.props;

        let addScenarioStep = <div></div>;

        console.log("Rendering scenario steps with Context " + displayContext + " and mode " + mode + " and inScope " + parentInScope );

        // Adding new steps is allowed if in an editing context and not looking at background steps in a scenario
        if((view === ViewType.DESIGN_NEW_EDIT || view === ViewType.DESIGN_UPDATE_EDIT) && mode === ViewMode.MODE_EDIT && parentInScope && stepContext != StepContext.STEP_FEATURE_SCENARIO){

            addScenarioStep =
                <table>
                    <tbody>
                    <tr>
                        <td className="control-table-data">
                            <DesignComponentAdd
                                addText="Add scenario step"
                                onClick={ () => this.addStep(view, mode, displayContext, stepContext, parentReferenceId, userContext, parentInScope)}
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
        }

        return (
            <div>
                {this.renderSteps(steps, parentInScope, view, mode, displayContext, stepContext, userContext)}
                {addScenarioStep}
            </div>
        );
    }
}

ScenarioStepsList.propTypes = {
    steps: PropTypes.array.isRequired,
    displayContext: PropTypes.string.isRequired,
    stepContext: PropTypes.string.isRequired,
    parentReferenceId: PropTypes.string.isRequired,
    parentInScope: PropTypes.bool.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        view: state.currentAppView,
        mode: state.currentViewMode,
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
ScenarioStepsList = connect(mapStateToProps)(ScenarioStepsList);

export default ScenarioStepsContainer = createContainer(({params}) => {

    switch(params.stepContext){
        case StepContext.STEP_FEATURE:
        case StepContext.STEP_FEATURE_SCENARIO:
            return ClientContainerServices.getBackgroundStepsInFeature(
                params.view,
                params.displayContext,
                params.stepContext,
                params.designId,
                params.designVersionId,
                params.updateId,
                params.parentReferenceId
            );
            break;

        case StepContext.STEP_SCENARIO:
            return ClientContainerServices.getScenarioStepsInScenario(
                params.view,
                params.displayContext,
                params.stepContext,
                params.designId,
                params.designVersionId,
                params.updateId,
                params.parentReferenceId
            );
        break
    }



}, ScenarioStepsList);