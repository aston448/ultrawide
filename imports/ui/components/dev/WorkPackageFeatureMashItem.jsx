// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import WorkPackageFeatureAspectMashContainer    from '../../containers/dev/WorkPackageFeatureAspectMashContainer.jsx';
import WorkPackageScenarioMashContainer         from '../../containers/dev/WorkPackageScenarioMashContainer.jsx'

// Ultrawide Services
import {ViewType, DisplayContext, ComponentType, ViewMode, ScenarioStepStatus, ScenarioStepType, StepContext, MashStatus, MashTestStatus} from '../../../constants/constants.js';
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
// Integration Test Mash Feature Component - One Feature containing its Aspects or Scenarios
//
// ---------------------------------------------------------------------------------------------------------------------

class WorkPackageFeatureMashItem extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };

    }

    shouldComponentUpdate(nextProps, nextState){
        return true;
    }



    render(){
        const { mashItem, displayContext, userContext } = this.props;

        if(mashItem.hasChildren) {

            return (
                <div className="mash-feature-group">
                    <InputGroup>
                        <div className={"mash-feature"}>
                            {mashItem.designComponentName}
                        </div>
                    </InputGroup>
                    <WorkPackageFeatureAspectMashContainer params={{
                        userContext: userContext,
                        featureMash: mashItem,
                        displayContext: displayContext
                    }}/>
                </div>
            )
        } else {
            return (<div></div>);
        }
    }

}

WorkPackageFeatureMashItem.propTypes = {
    mashItem: PropTypes.object.isRequired,
    displayContext: PropTypes.string.isRequired

};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
WorkPackageFeatureMashItem = connect(mapStateToProps)(WorkPackageFeatureMashItem);

export default WorkPackageFeatureMashItem;