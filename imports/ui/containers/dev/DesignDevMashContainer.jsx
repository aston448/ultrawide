// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';


// Ultrawide Collections


// Ultrawide GUI Components
import Design from '../../components/select/Design.jsx';
import DesignComponentAdd from '../../components/common/DesignComponentAdd.jsx';

// Ultrawide Services
import {RoleType} from '../../../constants/constants.js';
import ClientContainerServices from '../../../apiClient/apiClientContainerServices.js';
import ClientFeatureFileServices from  '../../../apiClient/apiClientFeatureFiles.js';

// Bootstrap
import {Grid, Col, Row} from 'react-bootstrap';
import {Panel} from 'react-bootstrap';
import {Button} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design / Dev Mash Container - Contains picture of the currently selected design Feature / Feature Aspect / Scenario as related to dev testing files
//
// ---------------------------------------------------------------------------------------------------------------------

class DesignItemMashList extends Component {
    constructor(props) {
        super(props);

    }

    onExportFeature(context){
        ClientFeatureFileServices.writeFeatureFile(context);
    }

    renderDesignFeatures(features){
        return features.map((feature) => {
            return (
                <FeatureDesignMash
                    key={feature._id}
                    feature={feature}
                />
            );
        });
    }

    renderFeatureDesignScenarios(scenarios){
        return scenarios.map((scenario) => {
            return (
                <ScenarioDesignMash
                    key={scenario._id}
                    scenario={scenario}
                />
            );
        });
    }

    renderFeatureDevScenarios(scenarios){
        return scenarios.map((scenario) => {
            return (
                <ScenarioDevMash
                    key={scenario._id}
                    scenario={scenario}
                />
            );
        });
    }

    render() {

        const {designFeatureName, designScenarios, devScenarios, currentUserRole, currentUserItemContext} = this.props;

        let designPanelHeader = 'Feature: ' + designFeatureName;


        let mainPanel = '';

        if(currentUserItemContext.featureReferenceId != 'NONE') {
            mainPanel =
            <Panel className="panel-text panel-text-body" header={designPanelHeader}>
                <Grid>
                    <Row>
                        <Col md={6} className="close-col">
                            {/*{this.renderFeatureDesignScenarios(designScenarios)}*/}
                            <Button onClick={() => this.onExportFeature(currentUserItemContext)}>Export Feature</Button>
                        </Col>
                        <Col md={6} className="close-col">

                        </Col>
                    </Row>
                </Grid>
            </Panel>;
        }

        return(
            <div>
                {mainPanel}
            </div>
        );

    }
}

DesignItemMashList.propTypes = {
    designFeatureName: PropTypes.string.isRequired,
    designScenarios: PropTypes.array.isRequired,
    devScenarios: PropTypes.array.isRequired
};


// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        currentUserRole: state.currentUserRole,
        currentUserItemContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
DesignItemMashList = connect(mapStateToProps)(DesignItemMashList);


export default DesignDevMashContainer = createContainer(({params}) => {

    //
    //let designScenarios = ClientContainerServices.getDesignMashScenarioData();

    return{
        designFeatureName: 'Feature 1',
        designScenarios: [],
        devScenarios: []
    }


}, DesignItemMashList);