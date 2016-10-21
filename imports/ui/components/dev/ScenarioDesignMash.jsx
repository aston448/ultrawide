// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import DesignItemHeader from '../select/DesignItemHeader.jsx';
import MoveTarget from './MoveTarget.jsx';
import SuggestedStepsContainer from '../../containers/edit/SuggestedStepsContainer.jsx';

// Ultrawide Services
import {ViewType, ComponentType, ViewMode, ScenarioStepStatus, ScenarioStepType, StepContext, MashStatus, MashTestStatus} from '../../../constants/constants.js';
import ClientScenarioStepServices from '../../../apiClient/apiClientScenarioStep.js';
import ClientDomainDictionaryServices from '../../../apiClient/apiClientDomainDictionary.js';


// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';
import {InputGroup, FormControl} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

// REDUX services

// React DnD - Component is draggable


// Draft JS


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Scenario Design Mash Component - Graphically represents the Design version of one Scenario in the implementation picture
//
// ---------------------------------------------------------------------------------------------------------------------

class ScenarioDesignMash extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };

    }

    render(){

        const { scenario, userContext } = this.props;

        let mashStyle = scenario.scenarioMashStatus;
        let testStyle = scenario.scenarioTestStatus;

        let scenarioItem =
            <InputGroup>
                <InputGroup.Addon>
                    <div className={testStyle}><Glyphicon glyph="list-alt"/></div>
                </InputGroup.Addon>
                <Label className={"mashItem " + mashStyle}>
                    {scenario.scenarioName}
                </Label>
            </InputGroup>


        return (scenarioItem);
    }

}

ScenarioDesignMash.propTypes = {
    scenario: PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
ScenarioDesignMash = connect(mapStateToProps)(ScenarioDesignMash);

export default ScenarioDesignMash;