// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components

// Ultrawide Services
import {ViewType, ComponentType, ViewMode, ScenarioStepStatus, ScenarioStepType, StepContext, MashStatus, MashTestStatus, DevTestTag} from '../../../constants/constants.js';
import TextLookups from '../../../common/lookups.js';
import ClientFeatureFileServices from  '../../../apiClient/apiClientFeatureFiles.js';
import ClientMashDataServices from  '../../../apiClient/apiClientMashData.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';
import {InputGroup, Label} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// React DnD - Component is draggable


// Draft JS


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Scenario Design Mash Component - Graphically represents the Design version of one Scenario in the implementation picture
//
// ---------------------------------------------------------------------------------------------------------------------

class DesignDevMashItem extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };

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
        const { mashItem, view, userContext } = this.props;

        console.log("Render mash item: " + mashItem);

        let mashItemActions = '';
        let mashItemTest = '';

        const mashStyle = mashItem.mashStatus;
        const testStyle = mashItem.mashTestStatus;


        const watchTagStyle = mashItem.mashItemTag === DevTestTag.TEST_WATCH ? 'tag-active' : 'tag-inactive';
        const testTagStyle = mashItem.mashItemTag === DevTestTag.TEST_TEST ? 'tag-active' : 'tag-inactive';
        const ignoreTagStyle = mashItem.mashItemTag === DevTestTag.TEST_IGNORE ? 'tag-active' : 'tag-inactive';

        const mashItemName = <div className={"mash-item " + mashStyle}>
            {mashItem.mashItemName}
        </div>;

        const mashItemStatus = <div className={"mash-item " + mashStyle}>
            {TextLookups.mashStatus(mashItem.mashStatus)}
        </div>;

        // const mashItemTestStatus = <div className={"mash-item " + testStyle}>
        //     {TextLookups.mashTestStatus(mashItem.mashTestStatus)}
        // </div>;
        //
        let mashItemEntry = '';

        switch(userContext.designComponentType){
            case ComponentType.APPLICATION:
            case ComponentType.DESIGN_SECTION:
                // Displaying Features

                // Actions depend on status
                switch (mashItem.mashStatus){
                    case MashStatus.MASH_LINKED:
                        // The feature has a dev test file
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
                                                    {TextLookups.mashTestStatus(mashItem.mashTestStatus)}
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
                    default:
                        // Anything else - feature not implemented so option to export to dev
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
                                                    {TextLookups.mashTestStatus(mashItem.mashTestStatus)}
                                                </div>
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                </Grid>
                                <InputGroup.Addon onClick={() => this.onExportFeature(mashItem, userContext)}>
                                    <div><Glyphicon glyph="download"/></div>
                                </InputGroup.Addon>
                            </InputGroup>;
                }

                break;
            case ComponentType.FEATURE:
            case ComponentType.FEATURE_ASPECT:
                // Displaying Scenarios

                switch (mashItem.mashStatus){
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
                                                    {TextLookups.mashTestStatus(mashItem.mashTestStatus)}
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
                                                        {TextLookups.mashTestStatus(mashItem.mashTestStatus)}
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
                                                        {TextLookups.mashTestStatus(mashItem.mashTestStatus)}
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
                                                    {TextLookups.mashTestStatus(mashItem.mashTestStatus)}
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
                break;

            case ComponentType.SCENARIO:
                // TODO
                break;

        }


        return (
            <div>
                {mashItemEntry}
            </div>
        );
    }

}

DesignDevMashItem.propTypes = {
    mashItem: PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext:    state.currentUserItemContext,
        view:           state.currentAppView
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
DesignDevMashItem = connect(mapStateToProps)(DesignDevMashItem);

export default DesignDevMashItem;