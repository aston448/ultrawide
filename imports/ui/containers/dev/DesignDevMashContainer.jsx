// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';


// Ultrawide Collections


// Ultrawide GUI Components
import DesignDevMashItem from '../../components/dev/DesignDevMashItem.jsx';

// Ultrawide Services
import {RoleType, ComponentType} from '../../../constants/constants.js';
import ClientContainerServices from '../../../apiClient/apiClientContainerServices.js';

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

        switch(userContext.designComponentType){
            case ComponentType.APPLICATION:
            case ComponentType.DESIGN_SECTION:
                panelHeader = 'Features in this ' + userContext.designComponentType;
                itemHeader = 'Feature';
                break;
            case ComponentType.FEATURE:
            case ComponentType.FEATURE_ASPECT:
                panelHeader = 'Scenarios in this ' + userContext.designComponentType;
                itemHeader = 'Scenario';
                break;
            case ComponentType.SCENARIO:
                panelHeader = 'Steps in this ' + userContext.designComponentType;
                itemHeader = 'Step';
                break;
        }


        let mainPanel = 'Select a design item';

        if(designMashItemData) {
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
                            <Col md={2} className="close-col">
                                Actions
                            </Col>
                            <Col md={2} className="close-col">
                                Test
                            </Col>
                        </Row>
                    </Grid>
                    {this.renderDesignItemMash(designMashItemData)}
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