// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import FinderResult         from '../../components/search/FinderResult.jsx';

// Ultrawide Services
import {} from '../../../constants/constants.js';

import ClientContainerServices      from '../../../apiClient/apiClientDataServices.js';
import ClientUserSettingsServices   from '../../../apiClient/apiClientUserSettings.js';

// Bootstrap
import {} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Find Results Container - List of matching Scenarios for a search string
//
// ---------------------------------------------------------------------------------------------------------------------

export class FindResultsList extends Component {
    constructor(props) {
        super(props);

    }

    renderResultsList(results, displayContext){
        return results.map((result) => {
            return (
                <FinderResult
                    key={result.id}
                    result={result}
                    displayContext={displayContext}
                />
            );
        });
    }

    noResults(){
        return (
            <div className="design-item-note">No matching scenarios...</div>
        );
    }

    getWindowSizeClass(){
        return ClientUserSettingsServices.getWindowSizeClassForDesignItemList();
    }

    render() {

        const {results, displayContext} = this.props;

        let resultsList = this.noResults();

        let listColClass = this.getWindowSizeClass();

        if(results.length > 0){
            resultsList = this.renderResultsList(results, displayContext);
        }

        return (
           <div className={'results-list ' + listColClass}>
               {resultsList}
           </div>
        );

    }
}

FindResultsList.propTypes = {
    results:        PropTypes.array.isRequired,
    displayContext: PropTypes.string.isRequired
};


// Connect the Redux store to this component ensuring that its required state is mapped to props

export default FindResultsContainer = createContainer(({params}) => {

    let results = [];

    if(params.searchString && params.searchString.length > 0) {

        results = ClientContainerServices.getMatchingScenarios(params.searchString, params.userContext);
    }

    return (
        {
            results:        results,
            displayContext: params.displayContext
        }
    )


}, (FindResultsList));