
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import TestExpectationItem from "../../components/mash/TestExpectationItem";


// Ultrawide Services
import {log} from "../../../common/utils";
import {ItemType, LogLevel, MashTestStatus} from "../../../constants/constants";
import {AddActionIds}                       from "../../../constants/ui_context_ids.js";

import { ClientDataServices }                   from '../../../apiClient/apiClientDataServices.js';
import { ClientDesignPermutationServices }     from '../../../apiClient/apiClientDesignPermutation.js'

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';





// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Permutations List - List of permutations available for test expectations
//
// ---------------------------------------------------------------------------------------------------------------------

export class DesignPermutationsList extends Component {
    constructor(props) {
        super(props);

    };

    addNewPermutation(role, userContext) {
        ClientDesignPermutationServices.addDesignPermutation(role, userContext);
    };

    renderPermutationsList(permutationData, testType, scenarioRefId){
        return permutationData.map((permutationDatum) => {
            return (
                <TestExpectationItem
                    key={permutationDatum.permutation._id}
                    testType={testType}
                    itemType={ItemType.DESIGN_PERMUTATION}
                    itemId={permutationDatum.permutation._id}
                    itemParentId={'NONE'}
                    itemRef={scenarioRefId}
                    itemText={permutationDatum.permutation.permutationName}
                    itemStatus={permutationDatum.permutationStatus}
                    expandable={true}
                />
            );
        });
    };


    render() {

        const {permutationData, testType, scenarioRefId} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Design Permutations List');

        if(permutationData && permutationData.length > 0) {
            return (
                <div className={'permutation-test-expectations'}>
                    {this.renderPermutationsList(permutationData, testType, scenarioRefId)}
                </div>
            );
        } else {
            return(
                <div></div>
            );
        }

    };
}

DesignPermutationsList.propTypes = {
    permutationData:        PropTypes.array.isRequired,
    testType:               PropTypes.string.isRequired,
    scenarioRefId:          PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:       state.currentUserRole,
        userContext:    state.currentUserItemContext,
        permutationId:  state.currentUserDesignPermutationId
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default DesignPermutationsListContainer = createContainer(({params}) => {

    const permutationData =  ClientDataServices.getDesignPermutationsWithExpectationStatus(
        params.userContext,
        params.scenarioReferenceId,
        params.testType
    );

    return {
        permutationData:    permutationData,
        testType:           params.testType,
        scenarioRefId:      params.scenarioReferenceId
    };


}, connect(mapStateToProps)(DesignPermutationsList));