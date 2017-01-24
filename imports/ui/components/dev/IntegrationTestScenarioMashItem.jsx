// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components

// Ultrawide Services
import TextLookups from '../../../common/lookups.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';
import {InputGroup} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Integration Test Mash Scenario Component - One Scenario showing test results
//
// ---------------------------------------------------------------------------------------------------------------------

export class IntegrationTestScenarioMashItem extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };

    }

    shouldComponentUpdate(nextProps, nextState){
        return true;
    }

    render(){
        const { mashItem, userContext } = this.props;

        const testStyle = mashItem.intMashTestStatus;
        const testResult = TextLookups.mashTestStatus(mashItem.intMashTestStatus);

        // Start by assuming no test
        let errorDetails = <Tooltip id="errorDeets">{'No Test'}</Tooltip>;

        // If an error, then there was a test so show the error...
        if(mashItem.intErrorMessage){
            errorDetails = <Tooltip id="errorDeets">{mashItem.intErrorMessage}</Tooltip>;
        } else {
            // Overlay the duration if there was a test
            if(mashItem.intDuration) {
                errorDetails = <Tooltip id="errorDeets">{'Pass in ' + mashItem.intDuration + 'ms'}</Tooltip>;
            }
        }

        return(

            <Grid>
                <Row>
                    <Col md={10} className="close-col">
                        <OverlayTrigger placement="left" overlay={errorDetails}>
                            <div className={'mash-scenario '  + testStyle}>
                                {mashItem.designComponentName}
                            </div>
                        </OverlayTrigger>
                    </Col>
                    <Col md={2} className="close-col">
                        <OverlayTrigger placement="left" overlay={errorDetails}>
                            <div className={'mash-scenario-result ' + testStyle}>
                                {testResult}
                            </div>
                        </OverlayTrigger>
                    </Col>
                </Row>
            </Grid>

        )
    }

}

IntegrationTestScenarioMashItem.propTypes = {
    mashItem: PropTypes.object.isRequired,
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(IntegrationTestScenarioMashItem);
