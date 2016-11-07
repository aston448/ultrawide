// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';


// Ultrawide Collections


// Ultrawide GUI Components
import DesignDevMashItem            from '../../components/dev/DesignDevMashItem.jsx';
import MashUnitTestScenario         from '../../components/dev/MashUnitTestScenario.jsx';

// Ultrawide Services
import {RoleType, ComponentType, DisplayContext}    from '../../../constants/constants.js';

import ClientContainerServices      from '../../../apiClient/apiClientContainerServices.js';
import UserContextServices          from '../../../apiClient/apiClientUserContext.js';
import ClientMashDataServices       from '../../../apiClient/apiClientMashData.js';

// Bootstrap
import {Panel} from 'react-bootstrap';
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Mash Feature Aspect Scenario Container - List of Scenarios inside a Feature aspect in the Dev Design Mash
//
// ---------------------------------------------------------------------------------------------------------------------

class MashFeatureAspectScenarioList extends Component {
    constructor(props) {
        super(props);

    }


    renderScenarios(scenarios){

        return scenarios.map((scenario) => {

            return (
                <DesignDevMashItem
                    key={scenario._id}
                    mashItem={scenario}
                />
            );

        });
    }

    renderUnitScenarios(scenarios){

        return scenarios.map((scenario) => {

            return (
                <MashUnitTestScenario
                    key={scenario._id}
                    scenario={scenario}
                />
            );

        });
    }

    render() {

        const {scenarios, displayContext} = this.props;

        switch(displayContext){
            case DisplayContext.VIEW_ACCEPTANCE_MASH:
                return(
                    <div>
                        {this.renderScenarios(scenarios)}
                    </div>
                );
                break;
            case DisplayContext.VIEW_UNIT_MASH:
                return(
                    <div>
                        {this.renderUnitScenarios(scenarios)}
                    </div>
                );
                break;
        }

    }
}

MashFeatureAspectScenarioList.propTypes = {
    scenarios: PropTypes.array.isRequired,
    displayContext: PropTypes.string.isRequired
};


// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        currentUserRole: state.currentUserRole,
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
MashFeatureAspectScenarioList = connect(mapStateToProps)(MashFeatureAspectScenarioList);


export default MashFeatureAspectScenarioContainer = createContainer(({params}) => {

    let scenarios = ClientContainerServices.getMashFeatureAspectScenarios(params.aspect);

    return{
        scenarios: scenarios,
        displayContext: params.displayContext
    }


}, MashFeatureAspectScenarioList);