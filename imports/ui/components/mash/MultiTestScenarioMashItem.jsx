// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components
import MashScenarioTestContainer        from '../../containers/mash/MashScenarioTestContainer.jsx';

// Ultrawide Services
import { DisplayContext, MashTestStatus } from '../../../constants/constants.js';
import TextLookups  from '../../../common/lookups.js';

// Bootstrap
import {Grid, Row, Col}     from 'react-bootstrap';
import {InputGroup}         from 'react-bootstrap';
import {Glyphicon}          from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Unit Test Mash Scenario Component - One Scenario showing a list of Mod Test Results
//
// ---------------------------------------------------------------------------------------------------------------------

export class MultiTestScenarioMashItem extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };

    }

    shouldComponentUpdate(nextProps, nextState){
        return true;
    }

    render(){
        const { mashItem, userContext, displayContext } = this.props;

        let testStyle = '';
        let testOutcome = '';

        switch(displayContext){

            case DisplayContext.MASH_ACC_TESTS:
                testStyle = mashItem.accMashTestStatus;
                testOutcome = TextLookups.mashTestStatus(mashItem.accMashTestStatus);
                break;

            case DisplayContext.MASH_INT_TESTS:
                testStyle = mashItem.intMashTestStatus;
                testOutcome = TextLookups.mashTestStatus(mashItem.intMashTestStatus);
                break;

            case DisplayContext.MASH_UNIT_TESTS:
                testStyle = mashItem.unitMashTestStatus;
                testOutcome = TextLookups.mashTestStatus(mashItem.unitMashTestStatus);
                break;
        }

        return(
            <div className="mash-unit-scenario">
                <Grid>
                    <Row className="mash-unit-scenario-header-multi">
                        <Col md={11} className="close-col">
                            <InputGroup>
                                <InputGroup.Addon>
                                    <div className={'mash-unit-scenario-glyph ' + testStyle}><Glyphicon glyph='th'/></div>
                                </InputGroup.Addon>
                                <div className={'mash-scenario ' + testStyle}>
                                    {mashItem.scenarioName}
                                </div>
                            </InputGroup>
                        </Col>
                        <Col md={1} className="close-col">
                            <div className={'mash-scenario-result ' + testStyle}>
                                {testOutcome}
                            </div>
                        </Col>
                    </Row>
                </Grid>

                <MashScenarioTestContainer params={{
                    scenario: mashItem,
                    userContext: userContext,
                    displayContext: displayContext
                }}/>
            </div>
        );
    }

}

MultiTestScenarioMashItem.propTypes = {
    mashItem:       PropTypes.object.isRequired,
    displayContext: PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(MultiTestScenarioMashItem);
