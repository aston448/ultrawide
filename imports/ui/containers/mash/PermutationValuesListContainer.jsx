
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import TestExpectationItem from "../../components/mash/TestExpectationItem";

// Ultrawide Services
import {log} from "../../../common/utils";
import {ItemType, LogLevel} from "../../../constants/constants";
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
// Design Permutation Values Container - List of defined values for a Design Permutation
//
// ---------------------------------------------------------------------------------------------------------------------

export class DesignPermutationValuesList extends Component {
    constructor(props) {
        super(props);

    };

    addNewPermutationValue() {
        ClientDesignPermutationServices.addPermutationValue(this.props.userRole, this.props.permutationId, this.props.userContext.designVersionId);
    };

    renderPermutationValuesList(permutationValues, testType, scenarioRefId){
        return permutationValues.map((permutationValue) => {
            return (
                <TestExpectationItem
                    key={permutationValue._id}
                    testType={testType}
                    itemType={ItemType.PERMUTATION_VALUE}
                    itemId={permutationValue._id}
                    itemParentId={permutationValue.permutationId}
                    itemRef={scenarioRefId}
                    itemText={permutationValue.permutationValueName}
                    expandable={false}
                />
            );
        });
    };



    render() {

        const {permutationValuesData, testType, scenarioRefId} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Design Permutation Values List');

        if(permutationValuesData && permutationValuesData.length > 0) {
            return (
                <div>
                    {this.renderPermutationValuesList(permutationValuesData, testType, scenarioRefId)}
                </div>
            );
        } else {
            return(
                <div></div>
            );
        }
    };
}

DesignPermutationValuesList.propTypes = {
    permutationValuesData:      PropTypes.array.isRequired,
    testType:                   PropTypes.string.isRequired,
    scenarioRefId:              PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:       state.currentUserRole,
        userContext:    state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default PermutationValuesListContainer = createContainer(({params}) => {

    const permutationValuesData =  ClientDataServices.getPermutationValuesData(
        params.permutationId,
        params.designVersionId
    );

    return {
        permutationValuesData:  permutationValuesData.data,
        testType:               params.testType,
        scenarioRefId:          params.scenarioReferenceId
    };

}, connect(mapStateToProps)(DesignPermutationValuesList));