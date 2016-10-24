// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components

// Ultrawide Services
import {ViewType, ComponentType, ViewMode, ScenarioStepStatus, ScenarioStepType, StepContext, MashStatus, MashTestStatus} from '../../../constants/constants.js';
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

    render(){

        const { mashItem, userContext } = this.props;

        let mashStyle = '';
        let testStyle = '';

        let mashItemDesign = '';
        let mashItemDev = '';


        switch(userContext.designComponentType){
            case ComponentType.APPLICATION:
            case ComponentType.DESIGN_SECTION:
                // Displaying Features
                mashStyle = mashItem.featureMashStatus;
                testStyle = mashItem.featureTestStatus;

                // Display depends on whether Feature is in Dev or not

                switch (mashItem.featureMashStatus){
                    case MashStatus.MASH_LINKED:
                        // The feature has a dev test file
                        mashItemDesign =
                            <InputGroup>
                                <InputGroup.Addon>
                                    <div className={testStyle}><Glyphicon glyph="list-alt"/></div>
                                </InputGroup.Addon>
                                <div className={"mash-item " + mashStyle}>
                                    {mashItem.featureName}
                                </div>
                            </InputGroup>;

                        mashItemDev =
                            <InputGroup>
                                <InputGroup.Addon>
                                    <div className={testStyle}><Glyphicon glyph="list-alt"/></div>
                                </InputGroup.Addon>
                                <div className={"mash-item " + mashStyle}>
                                    {mashItem.featureName}
                                </div>
                            </InputGroup>;

                        break;

                    default:
                        // Anything else - feature not implemented so option to export to dev
                        mashItemDesign =
                            <InputGroup>
                                <InputGroup.Addon>
                                    <div className={testStyle}><Glyphicon glyph="list-alt"/></div>
                                </InputGroup.Addon>
                                <div className={"mash-item " + mashStyle}>
                                    {mashItem.featureName}
                                </div>
                                <InputGroup.Addon onClick={() => this.onExportFeature(mashItem.designFeatureReferenceId, userContext)}>
                                    <div><Glyphicon glyph="download-alt"/></div>
                                </InputGroup.Addon>
                            </InputGroup>;

                        mashItemDev =
                            <div>Feature not implemented</div>

                }

                break;
            case ComponentType.FEATURE:
            case ComponentType.FEATURE_ASPECT:
                // TODO
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
                            {mashItemDesign}
                        </Col>
                        <Col md={6} className="close-col">
                            {mashItemDev}
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