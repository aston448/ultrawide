// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components

// Ultrawide Services
import {ViewType, ComponentType, ViewMode, ScenarioStepStatus, ScenarioStepType, StepContext, MashStatus, MashTestStatus} from '../../../constants/constants.js';
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

    onExportFeature(featureReferenceId, context){

      if(ClientFeatureFileServices.writeFeatureFile(featureReferenceId, context)){
          // If adding a feature file, refresh the view...
          ClientMashDataServices.createFeatureMashData(context);
      }
    }

    onExportScenario(scenarioReferenceId, context){
        //TODO - are we going to support this?
    }

    render(){
        const { mashItem, userContext } = this.props;

        console.log("Render mash item: " + mashItem);

        let mashStyle = '';
        let testStyle = '';

        let mashItemName = '';
        let mashItemStatus = '';
        let mashItemActions = '';
        let mashItemTestStatus = '';


        switch(userContext.designComponentType){
            case ComponentType.APPLICATION:
            case ComponentType.DESIGN_SECTION:
                // Displaying Features
                mashStyle = mashItem.featureMashStatus;
                testStyle = mashItem.featureTestStatus;

                mashItemName = <div className={"mash-item " + mashStyle}>
                    {mashItem.featureName}
                </div>;

                mashItemStatus = <div className={"mash-item " + mashStyle}>
                    {TextLookups.mashStatus(mashItem.featureMashStatus)}
                </div>;

                mashItemTestStatus = <div className={"mash-item " + mashStyle}>
                    {TextLookups.mashTestStatus(mashItem.featureTestStatus)}
                </div>;

                // Actions depend on status
                switch (mashItem.featureMashStatus){
                    case MashStatus.MASH_LINKED:
                        // The feature has a dev test file
                        break;
                    default:
                        // Anything else - feature not implemented so option to export to dev
                        mashItemActions=
                            <InputGroup>
                                <InputGroup.Addon onClick={() => this.onExportFeature(mashItem.designFeatureReferenceId, userContext)}>
                                    <div><Glyphicon glyph="download"/></div>
                                </InputGroup.Addon>
                            </InputGroup>;

                }

                break;
            case ComponentType.FEATURE:
            case ComponentType.FEATURE_ASPECT:
                // Displaying Scenarios
                mashStyle = mashItem.scenarioMashStatus;
                testStyle = mashItem.scenarioTestStatus;

                mashItemName = <div className={"mash-item " + mashStyle}>
                    {mashItem.scenarioName}
                </div>;

                mashItemStatus = <div className={"mash-item " + mashStyle}>
                    {TextLookups.mashStatus(mashItem.scenarioMashStatus)}
                </div>;

                mashItemTestStatus = <div className={"mash-item " + mashStyle}>
                    {TextLookups.mashTestStatus(mashItem.scenarioTestStatus)}
                </div>;


                switch (mashItem.scenarioMashStatus){
                    case MashStatus.MASH_LINKED:
                        // The scenario is in a dev test file for the feature
                        break;

                    case MashStatus.MASH_NOT_IMPLEMENTED:
                        // The scenario is in the design but not in the build
                        mashItemActions =
                            <InputGroup>
                                <InputGroup.Addon onClick={() => this.onExportScenario(mashItem.designScenarioReferenceId, userContext)}>
                                    <div><Glyphicon glyph="download"/></div>
                                </InputGroup.Addon>
                            </InputGroup>;

                        break;

                    case MashStatus.MASH_NOT_DESIGNED:
                        // The scenario is in the build but not in the design


                        mashItemActions =
                            <InputGroup>
                                <InputGroup.Addon onClick={() => this.onImportScenario(mashItem.designScenarioReferenceId, userContext)}>
                                    <div><Glyphicon glyph="upload"/></div>
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
                <Grid className="close-grid">
                    <Row>
                        <Col md={6} className="close-col">
                            {mashItemName}
                        </Col>
                        <Col md={2} className="close-col">
                            {mashItemStatus}
                        </Col>
                        <Col md={2} className="close-col">
                            {mashItemActions}
                        </Col>
                        <Col md={2} className="close-col">
                            {mashItemTestStatus}
                        </Col>
                    </Row>
                </Grid>
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
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
DesignDevMashItem = connect(mapStateToProps)(DesignDevMashItem);

export default DesignDevMashItem;