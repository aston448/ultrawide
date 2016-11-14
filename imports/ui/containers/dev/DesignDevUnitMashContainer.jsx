// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';


// Ultrawide Collections


// Ultrawide GUI Components
import DesignDevMashItem            from '../../components/dev/DesignDevMashItem.jsx';
import MashFeatureAspectContainer   from '../../containers/dev/MashFeatureAspectContainer.jsx';
import MashScenarioStepContainer    from '../../containers/dev/MashScenarioStepContainer.jsx';

// Ultrawide Services
import {RoleType, DisplayContext, MashStatus, ComponentType}    from '../../../constants/constants.js';

import ClientContainerServices      from '../../../apiClient/apiClientContainerServices.js';
import UserContextServices          from '../../../apiClient/apiClientUserContext.js';
import ClientMashDataServices       from '../../../apiClient/apiClientMashData.js';

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
// Design / Dev Unit Mash Container - Contains picture of the currently selected design Feature / Feature Aspect / Scenario as related to dev module tests
//
// ---------------------------------------------------------------------------------------------------------------------

class DesignItemUnitMashList extends Component {
    constructor(props) {
        super(props);

    }

    render() {

        const {designMashItemData, userContext, view} = this.props;

        let unitTestsHeader = '';
        let unlinkedUnitTestsHeader = '';

        let unitTestsPanel = <div></div>;
        let unlinkedUnitTestsPanel = <div></div>;

        const nameData = UserContextServices.getContextNameData(userContext);

        switch(userContext.designComponentType){
            case ComponentType.APPLICATION:
            case ComponentType.DESIGN_SECTION:
                // Nothing
                break;
            case ComponentType.FEATURE:
                //Show unit tests panels
                unitTestsHeader = 'UNIT TEST results for Scenarios in ' + nameData.feature;
                unlinkedUnitTestsHeader = 'UNIT TESTs not linked to Scenarios - consider changing Suite name?';

                unitTestsPanel =
                    <Panel className="panel-text panel-text-body" header={unitTestsHeader}>
                        <MashFeatureAspectContainer params={{
                            userContext:    userContext,
                            displayContext: DisplayContext.VIEW_UNIT_MASH,
                            view:           view
                        }}/>
                    </Panel>;

                unlinkedUnitTestsPanel =
                    <Panel className="panel-text panel-text-body" header={unlinkedUnitTestsHeader}>
                        <MashUnitTestContainer params={{
                            userContext:    userContext,
                            displayContext: DisplayContext.VIEW_UNIT_UNLINKED,
                            view:           view
                        }}/>
                    </Panel>;

                break;
            case ComponentType.FEATURE_ASPECT:
                // panelHeader = nameData.featureAspect + ' scenarios for ' + nameData.feature;
                // itemHeader = 'Scenario';
                break;
            case ComponentType.SCENARIO:
                // panelHeader = 'Steps in ' + nameData.scenario;
                // itemHeader = 'Step';
                break;
        }


        let mainPanel = 'Select a Design Feature';

        if(designMashItemData || userContext.designComponentType === ComponentType.SCENARIO) {
            switch(userContext.designComponentType){
                case ComponentType.APPLICATION:
                case ComponentType.DESIGN_SECTION:
                    // Nothing currently shown
                    break;
                case ComponentType.FEATURE:
                    // Here we divide in to feature aspects (if any)
                    if(ClientMashDataServices.featureHasAspects(userContext)){
                        mainPanel =
                            <div>
                                {unitTestsPanel}
                                {unlinkedUnitTestsPanel}
                            </div>
                    } else {
                        // Just render the scenarios
                        // TODO - Scenario only unit tests
                    }
                    break;
                case ComponentType.FEATURE_ASPECT:
                    // TODO Feature Aspect View
                    break;
                case ComponentType.SCENARIO:
                    // TODO Scenario only view
            }
        }

        return(
            <div>
                {mainPanel}
            </div>
        );

    }
}

DesignItemUnitMashList.propTypes = {
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
DesignItemUnitMashList = connect(mapStateToProps)(DesignItemUnitMashList);


export default DesignDevUnitMashContainer = createContainer(({params}) => {


    let designMashItemData = ClientContainerServices.getDesignMashData(params.userContext);

    return{
        designMashItemData
    }


}, DesignItemUnitMashList);