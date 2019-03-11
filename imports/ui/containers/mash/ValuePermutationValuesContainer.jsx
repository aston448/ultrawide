
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
import DesignComponentAdd from "../../components/common/DesignComponentAdd";
import {EditableTestExpectationValue} from "../../components/mash/EditableTestExpectationValue";
import {ClientScenarioTestExpectationServices} from "../../../apiClient/apiClientScenarioTestExpectation";


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Permutation Values Container - List of defined values for a Design Permutation
//
// ---------------------------------------------------------------------------------------------------------------------

export class ValuePermutationValuesList extends Component {
    constructor(props) {
        super(props);

    };

    addNewValuePermutationValue(userContext, scenarioReferenceId, testType) {
        //ClientDesignPermutationServices.addPermutationValue(this.props.userRole, 'VALUE', this.props.userContext.designVersionId);
        ClientScenarioTestExpectationServices.addNewSpecificValueTestExpectation(userContext, scenarioReferenceId, testType)
    };

    getScenarioValueExpectation(dvId, scenarioRefId, testType, permId, permValueId){
        return ScenarioTestExpectationData.getScenarioTestExpectationForScenarioTestTypePermutationValue(dvId, scenarioRefId, testType, permId, permValueId);
    }

    renderPermutationValuesList(permutationValuesData, testType, scenarioRefId){
        return permutationValuesData.map((permutationValueData) => {

            return (
                <EditableTestExpectationValue
                    key={permutationValueData.valueExpectation._id}
                    expectation={permutationValueData.valueExpectation}
                    testStatus={permutationValueData.valueStatus}
                />
            );
        });
    };


    render() {

        const {permutationValuesData, testType, scenarioRefId, userContext} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Design Permutation Values List');

        if(permutationValuesData && permutationValuesData.length > 0) {
            return (
                <div>
                    <div>
                        {this.renderPermutationValuesList(permutationValuesData, testType, scenarioRefId)}
                    </div>
                    <DesignComponentAdd
                        addText={'Add Test Value'}
                        uiContextId={'TEST_VALUE'}
                        onClick={() => this.addNewValuePermutationValue(userContext, scenarioRefId, testType)}
                    />
                </div>
            );
        } else {
            return(
                <div>
                    <DesignComponentAdd
                        addText={'Add Test Value'}
                        uiContextId={'TEST_VALUE'}
                        onClick={() => this.addNewValuePermutationValue(userContext, scenarioRefId, testType)}
                    />
                </div>
            );
        }
    };
}

ValuePermutationValuesList.propTypes = {
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
export default ValuePermutationValuesContainer = createContainer(({params}) => {

    const permutationValuesData =  ClientDataServices.getValuePermutationValuesDataWithTestStatus(
        params.userContext,
        params.scenarioReferenceId,
        params.testType
    );

    return {
        permutationValuesData:  permutationValuesData,
        testType:               params.testType,
        scenarioRefId:          params.scenarioReferenceId
    };

}, connect(mapStateToProps)(ValuePermutationValuesList));