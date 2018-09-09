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
import {InputGroup, Tooltip, OverlayTrigger, Glyphicon} from 'react-bootstrap';

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

    render() {

        const {testType, statusClass, expectationClass, expectedTestCount, passingTestCount, failingTestCount, missingTestCount} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Test Type Summary {} ', testType);

        let item = <div className="test-summary-text">No data yet</div>;

        if(expectedTestCount) {
            item =
                <InputGroup className="scenario-test-summary">
                    <InputGroup.Addon className="scenario-test-requirement">
                        <div className={expectationClass}>
                            {testType}
                        </div>
                    </InputGroup.Addon>
                    <span>
                    <Glyphicon glyph='th'/>
                </span>
                    <span>
                    {expectedTestCount}
                </span>
                    <span>
                    <Glyphicon glyph='ok-circle'/>
                </span>
                    <span>
                    {passingTestCount}
                </span>
                    <span>
                    <Glyphicon glyph='remove-circle'/>
                </span>
                    <span>
                    {failingTestCount}
                </span>
                    <span>
                    <Glyphicon glyph='ban-circle'/>
                </span>
                    <span>
                    {missingTestCount}
                </span>
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

