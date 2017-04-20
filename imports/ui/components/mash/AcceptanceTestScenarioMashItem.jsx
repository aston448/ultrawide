// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components

// Ultrawide Services
import { MashStatus, MashTestStatus, DevTestTag } from '../../../constants/constants.js';
import TextLookups  from '../../../common/lookups.js';

import ClientMashDataServices   from  '../../../apiClient/apiClientMashData.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';
import {InputGroup} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Acceptance Test Mash Scenario Component - One Scenario showing test results
//
// ---------------------------------------------------------------------------------------------------------------------

class AcceptanceTestScenarioMashItem extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };

    }

    shouldComponentUpdate(nextProps, nextState){
        return true;
    }

    // User has chosen to export a Design Feature to a Dev Feature File
    onExportFeature(mashItem, userContext){
        ClientMashDataServices.exportFeature(mashItem, userContext)
    }

    // Note that the Dev user cannot add Features or Scenarios to the Design as these are functional aspects.  Scenario Steps may be added if needed


    // User has chosen to export a Design scenario that is not in the Dev feature file
    onExportScenario(view, scenarioReferenceId, userContext){
        ClientMashDataServices.exportFeatureScenario(view, scenarioReferenceId, userContext)
    }

    // Tells us if the parent feature for this mash item exists as a Dev file.  If not the item is not exportable
    featureIsImplemented(mashItem){
        return ClientMashDataServices.featureIsImplemented(mashItem._id);
    }

    render(){
        const { mashItem, userContext } = this.props;

        const mashStyle = mashItem.accMashStatus;
        const testStyle = mashItem.accMashTestStatus;


        const watchTagStyle = mashItem.mashItemTag === DevTestTag.TEST_WATCH ? 'tag-active' : 'tag-inactive';
        const testTagStyle = mashItem.mashItemTag === DevTestTag.TEST_TEST ? 'tag-active' : 'tag-inactive';
        const ignoreTagStyle = mashItem.mashItemTag === DevTestTag.TEST_IGNORE ? 'tag-active' : 'tag-inactive';

        const mashItemName = <div className={"mash-item " + mashStyle}>
            {mashItem.mashItemName}
        </div>;

        const mashItemStatus = <div className={"mash-item " + mashStyle}>
            {TextLookups.mashStatus(mashItem.accMashStatus)}
        </div>;

        let mashItemEntry = '';

        switch (mashItem.accMashStatus){
            case MashStatus.MASH_LINKED:
                // The scenario is in a dev test file for the feature
                mashItemEntry =
                    <InputGroup>
                        <Grid className="close-grid">
                            <Row>
                                <Col md={8} className="close-col">
                                    {mashItemName}
                                </Col>
                                <Col md={2} className="close-col">
                                    {mashItemStatus}
                                </Col>
                                <Col md={2} className="close-col">
                                    <InputGroup>
                                        <div className={"mash-item " + testStyle}>
                                            {TextLookups.mashTestStatus(mashItem.accMashTestStatus)}
                                        </div>
                                        <InputGroup.Addon>
                                            <div className={watchTagStyle}><Glyphicon glyph="eye-open"/></div>
                                        </InputGroup.Addon>
                                        <InputGroup.Addon>
                                            <div className={testTagStyle}><Glyphicon glyph="ok-circle"/></div>
                                        </InputGroup.Addon>
                                        <InputGroup.Addon>
                                            <div className={ignoreTagStyle}><Glyphicon glyph="ban-circle"/></div>
                                        </InputGroup.Addon>
                                    </InputGroup>
                                </Col>
                            </Row>
                        </Grid>
                        <InputGroup.Addon className={testStyle}>
                            <div><Glyphicon glyph="star"/></div>
                        </InputGroup.Addon>
                    </InputGroup>;
                break;

            case MashStatus.MASH_NOT_IMPLEMENTED:
                // The scenario is in the design but not in the build.  Can export if Feature is implemented

                if(this.featureIsImplemented(mashItem)){
                    mashItemEntry =
                        <InputGroup>
                            <Grid className="close-grid">
                                <Row>
                                    <Col md={8} className="close-col">
                                        {mashItemName}
                                    </Col>
                                    <Col md={2} className="close-col">
                                        {mashItemStatus}
                                    </Col>
                                    <Col md={2} className="close-col">
                                        <InputGroup>
                                            <div className={"mash-item " + testStyle}>
                                                {TextLookups.mashTestStatus(mashItem.accMashTestStatus)}
                                            </div>
                                        </InputGroup>
                                    </Col>
                                </Row>
                            </Grid>
                            <InputGroup.Addon onClick={() => this.onExportScenario(view, mashItem.designScenarioReferenceId, userContext)}>
                                <div><Glyphicon glyph='download'/></div>
                            </InputGroup.Addon>
                        </InputGroup>;
                } else {
                    mashItemEntry =
                        <InputGroup>
                            <Grid className="close-grid">
                                <Row>
                                    <Col md={8} className="close-col">
                                        {mashItemName}
                                    </Col>
                                    <Col md={2} className="close-col">
                                        {mashItemStatus}
                                    </Col>
                                    <Col md={2} className="close-col">
                                        <InputGroup>
                                            <div className={"mash-item " + testStyle}>
                                                {TextLookups.mashTestStatus(mashItem.accMashTestStatus)}
                                            </div>
                                        </InputGroup>
                                    </Col>
                                </Row>
                            </Grid>
                            <InputGroup.Addon>
                                <div><Glyphicon glyph='star'/></div>
                            </InputGroup.Addon>
                        </InputGroup>;
                }


                break;

            case MashStatus.MASH_NOT_DESIGNED:
                // The scenario is in the build but not in the design
                mashItemEntry =
                    <InputGroup>
                        <Grid className="close-grid">
                            <Row>
                                <Col md={8} className="close-col">
                                    {mashItemName}
                                </Col>
                                <Col md={2} className="close-col">
                                    {mashItemStatus}
                                </Col>
                                <Col md={2} className="close-col">
                                    <InputGroup>
                                        <div className={"mash-item " + testStyle}>
                                            {TextLookups.mashTestStatus(mashItem.accMashTestStatus)}
                                        </div>
                                    </InputGroup>
                                </Col>
                            </Row>
                        </Grid>
                        <InputGroup.Addon>
                            <div><Glyphicon glyph="star"/></div>
                        </InputGroup.Addon>
                    </InputGroup>;
                break;
        }

        return (<div>{mashItemEntry}</div>);

    }

}

AcceptanceTestScenarioMashItem.propTypes = {
    mashItem: PropTypes.object.isRequired,
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
AcceptanceTestScenarioMashItem = connect(mapStateToProps)(AcceptanceTestScenarioMashItem);

export default AcceptanceTestScenarioMashItem;