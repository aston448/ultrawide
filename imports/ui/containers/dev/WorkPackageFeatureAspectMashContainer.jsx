// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';


// Ultrawide Collections


// Ultrawide GUI Components
import WorkPackageFeatureAspectMashItem   from '../../components/dev/WorkPackageFeatureAspectMashItem.jsx';

// Ultrawide Services
import {RoleType, DisplayContext, MashStatus, ComponentType, LogLevel}    from '../../../constants/constants.js';

import ClientContainerServices      from '../../../apiClient/apiClientContainerServices.js';
import { log } from '../../../common/utils.js'

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
// Design / Dev Feature Aspect Mash Container - List of Feature Aspects in WP Mash Features
//
// ---------------------------------------------------------------------------------------------------------------------

class WorkPackageFeatureAspectsMashList extends Component {
    constructor(props) {
        super(props);

    }

    shouldComponentUpdate(nextProps, nextState){
        return true;
    }

    renderFeatureAspects(mashData, displayContext){

        return mashData.map((mashItem) => {
            if(mashItem) {
                return (
                    <WorkPackageFeatureAspectMashItem
                        key={mashItem._id}
                        mashItem={mashItem}
                        displayContext={displayContext}
                    />
                );
            }
        });
    }

    render() {

        const {designMashItemData, displayContext, userContext, view} = this.props;

        return(
            <div>
                {this.renderFeatureAspects(designMashItemData, displayContext)}
            </div>
        );

    }
}

WorkPackageFeatureAspectsMashList.propTypes = {
    designMashItemData: PropTypes.array.isRequired,
    displayContext: PropTypes.string.isRequired
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
WorkPackageFeatureAspectsMashList = connect(mapStateToProps)(WorkPackageFeatureAspectsMashList);


export default WorkPackageFeatureAspectMashContainer = createContainer(({params}) => {


    let designMashItemData = ClientContainerServices.getDesignDevMashData(params.userContext, params.featureMash);

    return{
        designMashItemData: designMashItemData,
        displayContext: params.displayContext
    }


}, WorkPackageFeatureAspectsMashList);