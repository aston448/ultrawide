// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import {LogLevel}    from '../../../constants/constants.js';
import { TextLookups }                  from '../../../common/lookups.js';
import {log}                            from "../../../common/utils";

// Bootstrap
import {InputGroup} from 'react-bootstrap';

// REDUX services


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Test Summary Container - Contains Test Results Summary for a Scenario
//
// ---------------------------------------------------------------------------------------------------------------------

export default class TestTypeSummary extends Component {
    constructor(props) {
        super(props);

    }

    shouldComponentUpdate(nextProps, nextState) {

        return true;
    }

    getItemText(expectedTestCount, passingTestCount, failingTestCount, missingTestCount){

        if(failingTestCount > 0){
            if(failingTestCount === 1){
                return failingTestCount + ' test failing';
            } else {
                return failingTestCount + ' tests failing';
            }
        }

        if(passingTestCount > 0 && passingTestCount === expectedTestCount){
            return 'All tests passing';
        }

        if(passingTestCount === 0){
            if(missingTestCount === 1){
                return missingTestCount + ' test expected...';
            } else {
                return missingTestCount + ' tests expected...';
            }
        }

        return passingTestCount + ' of ' +  expectedTestCount + ' passing';
    }

    render() {

        const {testType, statusClass, expectationClass, expectedTestCount, passingTestCount, failingTestCount, missingTestCount} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Test Type Summary {} ', testType);

        let item = '';

        if(expectedTestCount) {
            item =
                <InputGroup className="scenario-test-summary">
                    <InputGroup.Addon className="scenario-test-requirement">
                        <div className={expectationClass}>
                            {testType}
                        </div>
                    </InputGroup.Addon>
                    <div className={statusClass}>
                        {this.getItemText(expectedTestCount, passingTestCount, failingTestCount, missingTestCount)}
                    </div>
                </InputGroup>;
        } else {
            item =
                <InputGroup className="scenario-test-summary">
                    <InputGroup.Addon className="scenario-test-requirement">
                        <div className={'test-not-expected'}>
                            {testType}
                        </div>
                    </InputGroup.Addon>
                    <div className={'test-summary-no-result'}>
                        No test required
                    </div>
                </InputGroup>;
        }

        return (
            <div>
                {item}
            </div>
        );
    }
}

TestTypeSummary.propTypes = {
    testType:           PropTypes.string.isRequired,
    statusClass:        PropTypes.string.isRequired,
    expectationClass:   PropTypes.string.isRequired,
    expectedTestCount:  PropTypes.number,
    passingTestCount:   PropTypes.number,
    failingTestCount:   PropTypes.number,
    missingTestCount:   PropTypes.number

};

