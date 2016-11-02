// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';


// Ultrawide Collections


// Ultrawide GUI Components
import ScenarioStep from '../../components/edit/ScenarioStep.jsx';
import MoveTarget   from '../../components/edit/MoveTarget.jsx';

// Ultrawide Services
import {ViewMode, ViewType, DisplayContext, StepContext, ComponentType}    from '../../../constants/constants.js';

import ClientContainerServices      from '../../../apiClient/apiClientContainerServices.js';
import ClientMashDataServices       from '../../../apiClient/apiClientMashData.js';

// Bootstrap
import {Panel} from 'react-bootstrap';
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Mash Scenario Step Container - Contains lists for steps: Design Only, Design-Dev Linked, Dev Only
//
// ---------------------------------------------------------------------------------------------------------------------

class MashScenarioStepsList extends Component {
    constructor(props) {
        super(props);

    }


    renderSteps(steps, view, displayContext, userContext){
        return steps.map((step) => {
            return (
                <ScenarioStep
                    key={step._id}
                    scenarioStep={step}
                    parentInScope={true}
                    mode={ViewMode.MODE_EDIT}
                    view={view}
                    displayContext={displayContext}
                    stepContext={step.stepContext}
                    userContext={userContext}
                />
            );
        });
    };


    render() {

        const {designSteps, linkedSteps, devSteps, userContext, view} = this.props;

        let designPanel = <div></div>;
        if(designSteps.length > 0){
            designPanel =
                <Panel className="panel-text panel-text-body" header="Steps in DESIGN only">
                    {this.renderSteps(designSteps, view, DisplayContext.EDIT_STEP_DESIGN, userContext)}
                </Panel>
        }

        let linkedPanelData = <div>No Linked Steps.  You can Export the Feature or the Scenario to create the steps</div>;
        if(linkedSteps.length > 0){
            linkedPanelData = <div>{this.renderSteps(linkedSteps, view, DisplayContext.EDIT_STEP_LINKED, userContext)}</div>;
        }

        let linkedPanel =
            <Panel className="panel-text panel-text-body" header="Steps LINKED between DESIGN and BUILD">
                {linkedPanelData}
                <MoveTarget
                    currentItem={null}
                    displayContext={DisplayContext.EDIT_STEP_LINKED}
                    mode={ViewMode.MODE_EDIT}
                />
            </Panel>;

        let devPanel = <div></div>;
        if(devSteps.length > 0){
            devPanel =
                <Panel className="panel-text panel-text-body" header="Steps in BUILD only">
                    {this.renderSteps(devSteps, view, DisplayContext.EDIT_STEP_DEV, userContext)}
                </Panel>
        }

        return(
            <div>
                {designPanel}
                {linkedPanel}
                {devPanel}
            </div>
        )
    }
}

MashScenarioStepsList.propTypes = {
    designSteps: PropTypes.array,
    linkedSteps: PropTypes.array,
    devSteps: PropTypes.array
};


// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        currentUserRole: state.currentUserRole,
        userContext: state.currentUserItemContext,
        view: state.currentAppView,
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
MashScenarioStepsList = connect(mapStateToProps)(MashScenarioStepsList);


export default MashScenarioStepContainer = createContainer(({params}) => {

    return ClientContainerServices.getMashScenarioSteps(params.userContext);

}, MashScenarioStepsList);