// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import MashFeatureAspectScenarioContainer from '../../containers/dev/MashFeatureAspectScenarioContainer.jsx';

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
// Mash Feature Aspect Component - One Feature Aspect and its scenarios - aspect can be exported as a file
//
// ---------------------------------------------------------------------------------------------------------------------

class MashFeatureAspect extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };

    }

    onExportFeatureAspect(aspect, context){

        // if(ClientFeatureFileServices.writeFeatureAspectFile(context)){
        //     // If adding a feature aspect file, refresh the view...
        //     ClientMashDataServices.createDevMashData(context);
        // }
    }


    render(){
        const { aspect, userContext } = this.props;

        // All this is is the Aspect (exportable) plus a list of its scenarios
        return(
            <div>
                <InputGroup>
                    <div className={"mash-aspect"}>
                        {aspect.mashItemName}
                    </div>
                    <InputGroup.Addon onClick={() => this.onExportFeatureAspect(aspect, userContext)}>
                        <div><Glyphicon glyph="download"/></div>
                    </InputGroup.Addon>
                </InputGroup>
                <MashFeatureAspectScenarioContainer params={{
                    aspect: aspect
                }}/>
            </div>
        )

    }

}

MashFeatureAspect.propTypes = {
    aspect: PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
MashFeatureAspect = connect(mapStateToProps)(MashFeatureAspect);

export default MashFeatureAspect;