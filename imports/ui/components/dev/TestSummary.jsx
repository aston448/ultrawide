// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';


// Ultrawide Collections


// Ultrawide GUI Components
import IntegrationTestFeatureMashItem               from './WorkPackageFeatureMashItem.jsx';
import IntegrationTestFeatureAspectMashContainer    from '../../containers/dev/WorkPackageFeatureAspectMashContainer.jsx';
import IntegrationTestScenarioMashContainer         from '../../containers/dev/WorkPackageScenarioMashContainer.jsx';

// Ultrawide Services
import {RoleType, DisplayContext, MashStatus, ComponentType, LogLevel}    from '../../../constants/constants.js';
import {log} from '../../../common/utils.js';

import TextLookups                  from '../../../common/lookups.js';
import ClientContainerServices      from '../../../apiClient/apiClientContainerServices.js';
import UserContextServices          from '../../../apiClient/apiClientUserContext.js';
import ClientMashDataServices       from '../../../apiClient/apiClientMashData.js';



// Bootstrap
import {Panel} from 'react-bootstrap';
import {InputGroup} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Test Summary Container - Contains Test Results Summary for a Scenario
//
// ---------------------------------------------------------------------------------------------------------------------

class TestSummary extends Component {
    constructor(props) {
        super(props);

    }

    shouldComponentUpdate(nextProps, nextState){
        return true;
    }


    render() {

        const {testSummaryData, userContext} = this.props;

        if(testSummaryData){

            let accResultClass = 'test-summary-result ' + testSummaryData.accTestStatus;
            let intResultClass = 'test-summary-result ' + testSummaryData.intTestStatus;

            return(
                <Grid className="close-grid">
                    <Row>
                        <Col md={3} className="close-col">
                            <span className="test-summary-text">Accept:</span>
                            <span className={accResultClass}>{TextLookups.mashTestStatus(testSummaryData.accTestStatus)}</span>
                        </Col>
                        <Col md={3} className="close-col">
                            <span className="test-summary-text">Integ:</span>
                            <span className={intResultClass}>{TextLookups.mashTestStatus(testSummaryData.intTestStatus)}</span>
                        </Col>
                        <Col md={3} className="close-col">
                            <span className="test-summary-text">Mod Pass:</span>
                            <span className="test-summary-text">{testSummaryData.modTestPassCount}</span>
                        </Col>
                        <Col md={3} className="close-col">
                            <span className="test-summary-text">Mod Fail:</span>
                            <span className="test-summary-text">{testSummaryData.modTestFailCount}</span>
                        </Col>
                    </Row>
                </Grid>
            )
        } else {
            return(
                <Grid className="close-grid">
                    <Row>
                        <Col md={12} className="close-col">
                            <span className="test-summary-text feature-no-highlight">No data yet - refresh test summary</span>
                        </Col>
                    </Row>
                </Grid>
            )
        }

    }
}

TestSummary.propTypes = {
    testSummaryData: PropTypes.object
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext:        state.currentUserItemContext
    }
}

export default TestSummary;
