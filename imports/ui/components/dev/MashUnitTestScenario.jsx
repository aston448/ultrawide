// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import MashUnitTestContainer from '../../containers/dev/MashUnitTestContainer.jsx';

// Ultrawide Services
import {DisplayContext, ViewType, ComponentType, ViewMode, ScenarioStepStatus, ScenarioStepType, StepContext, MashStatus, MashTestStatus} from '../../../constants/constants.js';
import TextLookups from '../../../common/lookups.js';
import ClientFeatureFileServices from  '../../../apiClient/apiClientFeatureFiles.js';
import ClientMashDataServices from  '../../../apiClient/apiClientMashData.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';
import {InputGroup, Label} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// React DnD - Component is draggable


// Draft JS


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Mash Unit Test Scenario Component - A Scenario in a Feature Aspect that may hold related unit test results
//
// ---------------------------------------------------------------------------------------------------------------------

class MashUnitTestScenario extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };

    }

    render(){
        const { scenario, displayContext, userContext } = this.props;

        let item = '';

        switch(displayContext){
            case DisplayContext.VIEW_UNIT_MASH:
                // All this is is the Scenario Name plus a list of its scenarios
                item = <div>
                    <InputGroup>
                        <div className={"mash-unit-test-scenario"}>
                            {scenario.mashItemName}
                        </div>
                    </InputGroup>
                    <MashUnitTestContainer params={{
                        scenario: scenario,
                        displayContext: displayContext,
                        userContext: userContext
                    }}/>
                </div>;
                break;
            case DisplayContext.VIEW_UNIT_UNLINKED:
                // Here there is no linked Scenario
                item = <div>
                    <MashUnitTestContainer params={{
                        scenario: scenario,
                        displayContext: displayContext,
                        userContext: userContext
                    }}/>
                </div>;
                break;
        }

        return(
            <div>
                {item}
            </div>
        )
    }

}

MashUnitTestScenario.propTypes = {
    scenario: PropTypes.object,
    displayContext: PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
MashUnitTestScenario = connect(mapStateToProps)(MashUnitTestScenario);

export default MashUnitTestScenario;