// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';


// Ultrawide Collections


// Ultrawide GUI Components
import IntegrationTestFeatureAspectMashItem   from '../../components/dev/IntegrationTestFeatureAspectMashItem.jsx';

// Ultrawide Services
import {RoleType, DisplayContext, MashStatus, ComponentType}    from '../../../constants/constants.js';

import ClientContainerServices      from '../../../apiClient/apiClientContainerServices.js';

// Bootstrap
import {Panel} from 'react-bootstrap';
import {InputGroup} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design / Dev Integration Test Feature Aspect Mash Container - List of Feature Aspects in Integration Test Features
//
// ---------------------------------------------------------------------------------------------------------------------

class IntegrationTestFeatureAspectsMashList extends Component {
    constructor(props) {
        super(props);

    }

    shouldComponentUpdate(nextProps, nextState){
        return true;
    }

    renderFeatureAspects(mashData){

        console.log("Rendering mash list of length " + mashData.length);

        return mashData.map((mashItem) => {
            if(mashItem) {
                return (
                    <IntegrationTestFeatureAspectMashItem
                        key={mashItem._id}
                        mashItem={mashItem}
                    />
                );
            }
        });
    }

    render() {

        const {designMashItemData, userContext, view} = this.props;

        return(
            <div>
                {this.renderFeatureAspects(designMashItemData)}
            </div>
        );

    }
}

IntegrationTestFeatureAspectsMashList.propTypes = {
    designMashItemData: PropTypes.array
};


// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        currentUserRole:    state.currentUserRole,
        userContext:        state.currentUserItemContext,
        view:               state.currentAppView
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
IntegrationTestFeatureAspectsMashList = connect(mapStateToProps)(IntegrationTestFeatureAspectsMashList);


export default IntegrationTestFeatureAspectMashContainer = createContainer(({params}) => {


    let designMashItemData = ClientContainerServices.getDesignIntegrationTestMashData(params.userContext, params.featureMash);

    return{
        designMashItemData
    }


}, IntegrationTestFeatureAspectsMashList);