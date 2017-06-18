// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components
import MashScenarioTestContainer        from '../../containers/mash/MashScenarioTestContainer.jsx';

// Ultrawide Services
import { DisplayContext, MashTestStatus } from '../../../constants/constants.js';

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

        const testStyle = mashItem.unitMashTestStatus;

        let resultStyle = 'scenario-test-row-untested';
        if(mashItem.unitMashTestStatus === MashTestStatus.MASH_PASS){
            resultStyle = 'scenario-test-row-pass';
        }
        if(mashItem.unitMashTestStatus === MashTestStatus.MASH_FAIL){
            resultStyle = 'scenario-test-row-fail';
        }

        return(
            <div className="mash-unit-scenario">
                <Grid>
                    <Row>
                        <Col md={12} className="close-col">
                            <InputGroup>
                                <InputGroup.Addon>
                                    <div className={'mash-unit-scenario-glyph ' + testStyle}><Glyphicon glyph='th'/></div>
                                </InputGroup.Addon>
                                <div className="mash-scenario">
                                    {mashItem.scenarioName}
                                </div>
                            </InputGroup>
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
