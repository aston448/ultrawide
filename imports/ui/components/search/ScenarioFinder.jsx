// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components
import FindResultsContainer         from '../../containers/search/FindResultsContainer.jsx';

// Ultrawide Services
import {log, getID} from "../../../common/utils";
import {LogLevel} from "../../../constants/constants";
import {UI} from "../../../constants/ui_context_ids";

// Bootstrap
import {InputGroup, FormControl} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Scenario Finder - Search for Matching Scenarios
//
// ---------------------------------------------------------------------------------------------------------------------

export class ScenarioFinder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchString: ''
        }
    }

    onSearchChange(e){

        e.preventDefault();

        this.setState({searchString: e.target.value});
    }

    render() {
        const {displayContext, userContext} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Scenario Finder');

        // Items -------------------------------------------------------------------------------------------------------

        const input =
            <InputGroup >
                <InputGroup.Addon>Find:</InputGroup.Addon>
                <FormControl id={getID(UI.INPUT_SCENARIO_SEARCH, '')} type="text"  onChange={(e) => this.onSearchChange(e)} />
            </InputGroup>;

        const results =
            <div id={getID(UI.OUTPUT_SCENARIO_SEARCH, '')}>
                <FindResultsContainer params={{
                    searchString:   this.state.searchString,
                    userContext:    userContext,
                    displayContext: displayContext
                }}/>
            </div>;

        // Layout ------------------------------------------------------------------------------------------------------

        return(
            <div>
                <div className="search-input">
                    {input}
                </div>
                <div>
                    {results}
                </div>
            </div>
        )

    }
}

ScenarioFinder.propTypes = {
    displayContext: PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(ScenarioFinder);