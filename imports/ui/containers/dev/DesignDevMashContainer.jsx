// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';


// Ultrawide Collections


// Ultrawide GUI Components
import DesignDevMashItem from '../../components/dev/DesignDevMashItem.jsx';

// Ultrawide Services
import {RoleType, ComponentType}    from '../../../constants/constants.js';

import ClientContainerServices      from '../../../apiClient/apiClientContainerServices.js';
import UserContextServices          from '../../../apiClient/apiClientUserContext.js';
import ClientMashDataServices       from '../../../apiClient/apiClientMashData.js';

// Bootstrap
import {Panel} from 'react-bootstrap';
import {Grid, Row, Col} from 'react-bootstrap';

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


    renderDesignItemMash(mashData){

        console.log("Rendering mash list of length " + mashData.length)

        return mashData.map((mashItem) => {
            if(mashItem) {
                return (
                    <DesignDevMashItem
                        key={mashItem._id}
                        mashItem={mashItem}
                    />
                );
            }
        });
    }

    render() {

        const {designMashItemData, currentUserRole, userContext} = this.props;

        let panelHeader = '';
        let itemHeader = '';

        const nameData = UserContextServices.getContextNameData(userContext);

        switch(userContext.designComponentType){
            case ComponentType.APPLICATION:
                panelHeader = 'Features in ' + nameData.application;
                itemHeader = 'Feature';
                break;
            case ComponentType.DESIGN_SECTION:
                panelHeader = 'Features in ' + nameData.designSection;
                itemHeader = 'Feature';
                break;
            case ComponentType.FEATURE:
                panelHeader = 'Scenarios in ' + nameData.feature;
                itemHeader = 'Scenario';
                break;
            case ComponentType.FEATURE_ASPECT:
                panelHeader = 'Scenarios in aspect ' + nameData.featureAspect + ' of ' + nameData.feature;
                itemHeader = 'Scenario';
                break;
            case ComponentType.SCENARIO:
                panelHeader = 'Steps in ' + nameData.scenario;
                itemHeader = 'Step';
                break;
        }


        let mainPanel = 'Select a design item';

        if(designMashItemData) {
            switch(userContext.designComponentType){
                case ComponentType.APPLICATION:
                case ComponentType.DESIGN_SECTION:
                case ComponentType.FEATURE_ASPECT:
                case ComponentType.SCENARIO:
                    mainPanel =
                        <Panel className="panel-text panel-text-body" header={panelHeader}>
                            <Grid className="close-grid">
                                <Row>
                                    <Col md={6} className="close-col">
                                        {itemHeader}
                                    </Col>
                                    <Col md={2} className="close-col">
                                        Status
                                    </Col>
                                    <Col md={1} className="close-col">
                                        Actions
                                    </Col>
                                    <Col md={2} className="close-col">
                                        Test
                                    </Col>
                                    <Col md={1} className="close-col">
                                        Result
                                    </Col>
                                </Row>
                            </Grid>
                            {this.renderDesignItemMash(designMashItemData)}
                        </Panel>;
                    break;
                case ComponentType.FEATURE:
                    // Here we divide in to feature aspects (if any)
                    if(ClientMashDataServices.featureHasAspects()){
                        mainPanel =
                            <MashFeatureAspectContainer params={{
                                userContext: userContext
                            }}/>
                    } else {
                        // Just render the scenarios
                        mainPanel =
                            <Panel className="panel-text panel-text-body" header={panelHeader}>
                                <Grid className="close-grid">
                                    <Row>
                                        <Col md={6} className="close-col">
                                            {itemHeader}
                                        </Col>
                                        <Col md={2} className="close-col">
                                            Status
                                        </Col>
                                        <Col md={1} className="close-col">
                                            Actions
                                        </Col>
                                        <Col md={2} className="close-col">
                                            Test
                                        </Col>
                                        <Col md={1} className="close-col">
                                            Result
                                        </Col>
                                    </Row>
                                </Grid>
                                {this.renderDesignItemMash(designMashItemData)}
                            </Panel>;
                    }

            }
        }

        return(
            <div>
                {mainPanel}
            </div>
        );

    }
}

DesignItemMashList.propTypes = {
    designMashItemData: PropTypes.array
};


// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        currentUserRole: state.currentUserRole,
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
DesignItemMashList = connect(mapStateToProps)(DesignItemMashList);


export default DesignDevMashContainer = createContainer(({params}) => {


    let designMashItemData = ClientContainerServices.getDesignMashData(params.userContext);

    return{
        designMashItemData
    }


}, DesignItemMashList);