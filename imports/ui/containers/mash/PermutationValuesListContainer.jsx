
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
import {ScenarioTestExpectationData} from "../../../data/design/scenario_test_expectations_db";
import {UserDvScenarioTestExpectationStatusData} from "../../../data/mash/user_dv_scenario_test_expectation_status_db";




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

    getScenarioValueExpectation(dvId, scenarioRefId, testType, permId, permValueId){
        return ScenarioTestExpectationData.getScenarioTestExpectationForScenarioTestTypePermutationValue(dvId, scenarioRefId, testType, permId, permValueId);
    }

    renderPermutationValuesList(permutationValuesData, testType, scenarioRefId){
        return permutationValuesData.map((permutationValueData) => {

            return (
                <TestExpectationItem
                    key={permutationValueData.permutationValue._id}
                    testType={testType}
                    itemType={ItemType.PERMUTATION_VALUE}
                    itemId={permutationValueData.permutationValue._id}
                    itemParentId={permutationValueData.permutationValue.permutationId}
                    itemRef={scenarioRefId}
                    itemText={permutationValueData.permutationValue.permutationValueName}
                    itemStatus={permutationValueData.valueStatus}
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

    const permutationValuesData =  ClientDataServices.getPermutationValuesDataWithTestStatus(
        params.userContext,
        params.scenarioReferenceId,
        params.testType,
        params.permutationId
    );

    return {
        permutationValuesData:  permutationValuesData,
        testType:               params.testType,
        scenarioRefId:          params.scenarioReferenceId
    };

}, connect(mapStateToProps)(DesignPermutationValuesList));