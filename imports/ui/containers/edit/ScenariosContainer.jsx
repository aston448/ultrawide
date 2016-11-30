// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import DesignComponentTarget from '../../components/edit/DesignComponentTarget.jsx';

// Ultrawide Services
import { DisplayContext, ComponentType } from '../../../constants/constants.js';
import ClientContainerServices from '../../../apiClient/apiClientContainerServices.js';
import ClientWorkPackageComponentServices from '../../../apiClient/apiClientWorkPackageComponent.js';

// Bootstrap

// REDUX services
import {connect} from 'react-redux';

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Scenarios Data Container - selects data for Scenarios in a Feature or Feature Aspect
//
// ---------------------------------------------------------------------------------------------------------------------

// Scenarios List for a Feature or Feature Aspect
class ScenariosList extends Component {
    constructor(props) {
        super(props);

    }

    getDesignItem(scenario, displayContext){
        // Design Item needed only in WP context (otherwise we already have it as the current item)
        if(displayContext === DisplayContext.WP_SCOPE || displayContext === DisplayContext.WP_VIEW || displayContext === DisplayContext.DEV_DESIGN) {
            return ClientWorkPackageComponentServices.getDesignItem(scenario.componentId, scenario.workPackageType);
        } else {
            return scenario;
        }
    }

    // A list of Scenarios in a Feature or Feature Aspect
    renderScenarios() {
        const {components, displayContext, view, mode} = this.props;

        if(components)
        {
            return components.map((scenario) => {

                return (
                    <DesignComponentTarget
                        key={scenario._id}
                        currentItem={scenario}
                        designItem={this.getDesignItem(scenario, displayContext)}
                        displayContext={displayContext}
                        view={view}
                        mode={mode}
                    />
                );
            });
        } else {
            //console.log("NULL COMPONENTS FOR SCENARIOS!")
        }
    }

    render() {
        return (
            <div>
                {this.renderScenarios()}
            </div>
        );
    }
}

ScenariosList.propTypes = {
    components: PropTypes.array.isRequired,
    displayContext: PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        view: state.currentAppView,
        mode: state.currentViewMode
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
ScenariosList = connect(mapStateToProps)(ScenariosList);

export default ScenariosContainer = createContainer(({params}) => {

    let returnData =  ClientContainerServices.getComponentDataForParentComponent(
        ComponentType.SCENARIO,
        params.view,
        params.designVersionId,
        params.updateId,
        params.workPackageId,
        params.parentId,
        params.displayContext,
    );

    //console.log("Return data: " + returnData.components);

    return returnData;


}, ScenariosList);