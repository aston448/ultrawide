// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import MashUnitTestContainer from '../../containers/dev/MashUnitTestContainer.jsx';

// Ultrawide Services
import TextLookups from '../../../common/lookups.js';
import { DisplayContext } from '../../../constants/constants.js';

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
// Unit Test Mash Scenario Component - One Scenario showing a list of Mod Test Results
//
// ---------------------------------------------------------------------------------------------------------------------

export class UnitTestScenarioMashItem extends Component {

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

        const testStyle = mashItem.unitMashTestStatus;

        return(
            <div>
                <Grid>
                    <Row>
                        <Col md={10}>
                            <div className={'mash-scenario '  + testStyle}>
                                {mashItem.designComponentName}
                            </div>
                        </Col>
                        <Col md={2}>
                            <div className={'mash-scenario-result ' + testStyle}>
                                {TextLookups.mashTestStatus(mashItem.unitMashTestStatus)}
                            </div>
                        </Col>
                    </Row>
                </Grid>

                <MashUnitTestContainer params={{
                    scenario: mashItem,
                    userContext: userContext,
                    displayContext: DisplayContext.VIEW_UNIT_MASH
                }}/>
            </div>
        );
    }

}

UnitTestScenarioMashItem.propTypes = {
    mashItem: PropTypes.object.isRequired,
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(UnitTestScenarioMashItem);
