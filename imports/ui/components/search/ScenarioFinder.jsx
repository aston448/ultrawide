// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components
import FindResultsContainer         from '../../containers/search/FindResultsContainer.jsx';


// Ultrawide Services
import { DetailsType, ViewMode, DisplayContext, ComponentType }      from  '../../../constants/constants.js';

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

        // Items -------------------------------------------------------------------------------------------------------

        const input =
            <InputGroup>
                <InputGroup.Addon>Find:</InputGroup.Addon>
                <FormControl type="text"  onChange={(e) => this.onSearchChange(e)} />
            </InputGroup>;

        const results =
            <FindResultsContainer params={{
                searchString:   this.state.searchString,
                userContext:    userContext,
                displayContext: displayContext
            }}/>;

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