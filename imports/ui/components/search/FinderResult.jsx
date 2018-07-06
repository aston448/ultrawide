// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import {log} from "../../../common/utils";
import {LogLevel} from "../../../constants/constants";

import { ClientDesignComponentServices }    from '../../../apiClient/apiClientDesignComponent.js';


// Bootstrap
import {} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Finder Result - One matching Scenario and the Feature it is in
//
// ---------------------------------------------------------------------------------------------------------------------

export class FinderResult extends Component {
    constructor(props) {
        super(props);

    }

    openResultScenario(scenarioId, userContext, displayContext){
        if(scenarioId !== 'NONE') {
            ClientDesignComponentServices.openSearchResultScenario(scenarioId, userContext, displayContext);
        }
    }

    render() {
        const {result, displayContext, userContext} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Finder Result {} - {}', result.featureName, result.scenarioName);

        // Items -------------------------------------------------------------------------------------------------------

        let scenarioHighlight = '';

        if(userContext.designComponentId === result.id && result.id !== 'NONE'){
            scenarioHighlight = 'selected-result';
        }

        const resultItem =
            <div>
                <div id="find-result-feature" className="feature">
                    {result.featureName}
                </div>
                <div id="find-result-scenario" className={'scenario ' + scenarioHighlight}>
                    {result.scenarioName}
                </div>
            </div>;

        // Layout ------------------------------------------------------------------------------------------------------

        return(
            <div className="result-item" onClick={() => this.openResultScenario(result.id, userContext, displayContext)}>
                {resultItem}
            </div>
        )

    }
}

FinderResult.propTypes = {
    result:         PropTypes.object.isRequired,
    displayContext: PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(FinderResult);