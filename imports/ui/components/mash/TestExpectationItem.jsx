
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components
import DesignPermutationsListContainer      from '../../containers/mash/DesignPermutationsListContainer.jsx';
import PermutationValuesListContainer       from '../../containers/mash/PermutationValuesListContainer.jsx';

// Ultrawide Services
import {ClientScenarioTestExpectationServices} from "../../../apiClient/apiClientScenarioTestExpectation.js";

import {ItemType, LogLevel} from '../../../constants/constants.js';
import {log, getContextID} from "../../../common/utils";
import {UI} from "../../../constants/ui_context_ids";

// Bootstrap
import {InputGroup, Glyphicon} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Test Expectation Item - Graphically represents a selectable / expandable item in the test expectation screen
//
// ---------------------------------------------------------------------------------------------------------------------

export class TestExpectationItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected:   this.hasExpectation(
                this.props.itemType,
                this.props.testType,
                this.props.itemId,
                this.props.itemParentId,
                this.props.userContext
            ),
            expanded:   false
        };

    }

    hasExpectation(itemType, testType, itemId, itemParentId, userContext){

        return ClientScenarioTestExpectationServices.hasTestExpectation(itemType, userContext.designVersionId, userContext.scenarioReferenceId, testType, itemParentId, itemId)
    }

    addExpectation(itemType, testType, itemId, itemParentId, userContext){

        switch(itemType){
            case ItemType.TEST_TYPE:
                ClientScenarioTestExpectationServices.selectTestTypeExpectation(userContext.designVersionId, userContext.scenarioReferenceId, testType);
                break;
            case ItemType.PERMUTATION_VALUE:
                ClientScenarioTestExpectationServices.selectTestTypePermutationValueExpectation(userContext.designVersionId, userContext.scenarioReferenceId, testType, itemParentId, itemId);
                break;
        }

        this.setState({selected: true});
    }

    removeExpectation(itemType, testType, itemId, itemParentId, userContext){

        switch(itemType){
            case ItemType.TEST_TYPE:
                ClientScenarioTestExpectationServices.unselectTestTypeExpectation(userContext.designVersionId, userContext.scenarioReferenceId, testType);
                break;
            case ItemType.DESIGN_PERMUTATION:
                ClientScenarioTestExpectationServices.unselectTestTypePermutationExpectation(userContext.designVersionId, userContext.scenarioReferenceId, testType, itemId);
                break;
            case ItemType.PERMUTATION_VALUE:
                ClientScenarioTestExpectationServices.unselectTestTypePermutationValueExpectation(userContext.designVersionId, userContext.scenarioReferenceId, testType, itemParentId, itemId);
                break;
        }

        this.setState({selected: false});
        this.setState({expanded: false});
    }

    setExpanded(){

        this.setState({expanded: true});
    }

    setUnexpanded(){

        this.setState({expanded: false});
    }

    render() {
        const {testType, itemType, itemId, itemParentId, itemText, expandable, userContext} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Scenario Test Expectations');

        let body = <div></div>;

        switch(itemType){
            case ItemType.TEST_TYPE:
                if(this.state.expanded){
                    body =
                        <div className='test-expectation-active'>
                            <InputGroup>
                                <InputGroup.Addon onClick={() => this.removeExpectation(itemType, testType, itemId, 'NONE', userContext)}>
                                    <div className='in-scope'><Glyphicon glyph="ok"/></div>
                                </InputGroup.Addon>
                                <div>{itemText + ' test required'}</div>
                                <InputGroup.Addon onClick={() => this.setUnexpanded()}>
                                    <div><Glyphicon glyph="minus"/></div>
                                </InputGroup.Addon>
                            </InputGroup>
                            <DesignPermutationsListContainer
                                params={{
                                    userContext: userContext,
                                    testType: testType
                                }}
                            />

                        </div>;
                } else {
                    if(this.state.selected){
                        body =
                            <div className='test-expectation-active'>
                                <InputGroup>
                                    <InputGroup.Addon onClick={() => this.removeExpectation(itemType, testType, itemId, 'NONE', userContext)}>
                                        <div className='in-scope'><Glyphicon glyph="ok"/></div>
                                    </InputGroup.Addon>
                                    <div>{itemText + ' test required'}</div>
                                    <InputGroup.Addon onClick={() => this.setExpanded()}>
                                        <div><Glyphicon glyph="plus"/></div>
                                    </InputGroup.Addon>
                                </InputGroup>
                            </div>
                    } else {
                        body =
                            <div className='test-expectation'>
                                <InputGroup>
                                    <InputGroup.Addon onClick={() => this.addExpectation(itemType, testType, itemId, 'NONE', userContext)}>
                                        <div className='out-scope'><Glyphicon glyph="ok"/></div>
                                    </InputGroup.Addon>
                                    <div>{'No ' + itemText + ' test'}</div>
                                </InputGroup>

                            </div>
                    }

                }
                break;
            case ItemType.DESIGN_PERMUTATION:
                if(this.state.selected){
                    body =
                        <div className='permutation-expectation-active'>
                            <InputGroup>
                                <InputGroup.Addon>
                                    <div><Glyphicon glyph="asterisk"/></div>
                                </InputGroup.Addon>
                                <div>{itemText}</div>
                                <InputGroup.Addon onClick={() => this.removeExpectation(itemType, testType, itemId, 'NONE', userContext)}>
                                    <div><Glyphicon glyph="minus"/></div>
                                </InputGroup.Addon>
                            </InputGroup>
                            <PermutationValuesListContainer
                                params={{
                                    permutationId: itemId,
                                    designVersionId: userContext.designVersionId,
                                    testType: testType
                                }}
                            />
                        </div>;
                } else {
                    body =
                        <div className='permutation-expectation'>
                            <InputGroup>
                                <InputGroup.Addon>
                                    <div><Glyphicon glyph="asterisk"/></div>
                                </InputGroup.Addon>
                                <div>{itemText}</div>
                                <InputGroup.Addon onClick={() => this.addExpectation(itemType, testType, itemId, 'NONE', userContext)}>
                                    <div><Glyphicon glyph="plus"/></div>
                                </InputGroup.Addon>
                            </InputGroup>
                        </div>
                }
                break;
            case ItemType.PERMUTATION_VALUE:
                if(this.state.selected){
                    body =

                        <div className='value-expectation-active'>
                            <InputGroup>
                                <InputGroup.Addon onClick={() => this.removeExpectation(itemType, testType, itemId, itemParentId, userContext)}>
                                    <div className='in-scope'><Glyphicon glyph="ok"/></div>
                                </InputGroup.Addon>
                                <div>{itemText}</div>
                            </InputGroup>
                        </div>;
                } else {
                    body =
                        <div className='value-expectation'>
                            <InputGroup>
                                <InputGroup.Addon onClick={() => this.addExpectation(itemType, testType, itemId, itemParentId, userContext)}>
                                    <div className='out-scope'><Glyphicon glyph="ok"/></div>
                                </InputGroup.Addon>
                                <div>{itemText}</div>
                            </InputGroup>
                        </div>
                }
                break;
        }

        return(
            <div>
                {body}
            </div>
        );
    }
}

TestExpectationItem.propTypes = {
    testType:       PropTypes.string.isRequired,
    itemType:       PropTypes.string.isRequired,
    itemId:         PropTypes.string.isRequired,
    itemParentId:   PropTypes.string.isRequired,
    itemText:       PropTypes.string.isRequired,
    expandable:     PropTypes.bool.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:               state.currentUserRole,
        userContext:            state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(TestExpectationItem);

