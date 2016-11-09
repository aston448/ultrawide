// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';


// Ultrawide Collections


// Ultrawide GUI Components
import MashFeatureAspect from '../../components/dev/MashFeatureAspect.jsx';

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
// Mash Feature Aspect Container - Where a Feature has Aspects, breaks the Scenarios up into those Aspects
//
// ---------------------------------------------------------------------------------------------------------------------

class MashFeatureAspectList extends Component {
    constructor(props) {
        super(props);

    }


    renderFeatureAspects(featureAspects, displayContext){

        return featureAspects.map((aspect) => {

            return (
                <MashFeatureAspect
                    key={aspect._id}
                    aspect={aspect}
                    displayContext={displayContext}
                />
            );

        });
    }

    render() {

        const {featureAspects, displayContext} = this.props;

        return(
            <div>
                {this.renderFeatureAspects(featureAspects, displayContext)}
            </div>
        )

    }
}

MashFeatureAspectList.propTypes = {
    featureAspects: PropTypes.array.isRequired,
    displayContext: PropTypes.string.isRequired
};


// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        currentUserRole: state.currentUserRole,
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
MashFeatureAspectList = connect(mapStateToProps)(MashFeatureAspectList);


export default MashFeatureAspectContainer = createContainer(({params}) => {


    let featureAspects = ClientContainerServices.getMashFeatureAspects(params.userContext, params.view);

    console.log("Found " + featureAspects.length + " feature aspects for Container");

    return{
        featureAspects: featureAspects,
        displayContext: params.displayContext
    }


}, MashFeatureAspectList);