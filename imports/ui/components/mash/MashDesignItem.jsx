// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components
import MashSelectedItemContainer        from '../../containers/mash/MashSelectedItemContainer.jsx';
import ScenarioTestResultsContainer     from '../../containers/mash/ScenarioTestResultsContainer.jsx';

// Ultrawide Services
import {log} from "../../../common/utils";
import { ComponentType, LogLevel } from '../../../constants/constants.js';

import { ClientTestIntegrationServices }        from '../../../apiClient/apiClientTestIntegration.js';

// Bootstrap

// REDUX services
import {connect} from 'react-redux';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Mash Design Ietm - placeholder for a further list of Design Items in the Test Mash
//
// ---------------------------------------------------------------------------------------------------------------------

class MashDesignItem extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };

    }

    shouldComponentUpdate(nextProps, nextState){

        // Not sure if this component ever needs to update
        return false;
    }

    hasScenarios(designItem, userContext){
        return ClientTestIntegrationServices.hasScenarios(designItem, userContext)
    }

    render(){
        const { designItem, displayContext, view, userContext } = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Mash Design Item {}', designItem.componentNameNew);

        // What is rendered depends on the item type.  Assume its a Scenario if not a Design Version component
        // with a specified type

        let componentType = ComponentType.SCENARIO;

        if(designItem.componentType){
            componentType = designItem.componentType;
        }

        //console.log("Component Type: " + componentType);

        switch(componentType){

            case ComponentType.DESIGN_SECTION:
                // Just get more items.  Could be Features or more Sections
                return(
                    <div>
                        <MashSelectedItemContainer params={{
                            childComponentType: ComponentType.FEATURE,
                            designItemId: designItem._id,
                            userContext: userContext,
                            view: view,
                            displayContext: displayContext
                        }}/>
                        <MashSelectedItemContainer params={{
                            childComponentType: ComponentType.DESIGN_SECTION,
                            designItemId: designItem._id,
                            userContext: userContext,
                            view: view,
                            displayContext: displayContext
                        }}/>
                    </div>
                );

            case ComponentType.FEATURE:
                // Header and then get more items
                return(
                    <div className="mash-feature-group">

                        <div className={"mash-feature"}>
                            {designItem.componentNameNew}
                        </div>

                        <MashSelectedItemContainer params={{
                            childComponentType: ComponentType.FEATURE_ASPECT,
                            designItemId: designItem._id,
                            userContext: userContext,
                            view: view,
                            displayContext: displayContext
                        }}/>
                    </div>
                );

            case ComponentType.FEATURE_ASPECT:
                // Header and then get the actual Scenario Results data which will depend on the test type

                // But only if there are actually scenarios to display

                if(this.hasScenarios(designItem, userContext)) {

                    //console.log("Displaying scenarios for feature aspect " + designItem.componentNameNew);

                    return (
                        <div>

                            <div className={"mash-aspect"}>
                                {designItem.componentNameNew}
                            </div>

                            <ScenarioTestResultsContainer params={{
                                userContext: userContext,
                                featureAspectReferenceId: designItem.componentReferenceId,
                                displayContext: displayContext,
                                mashData: null
                            }}/>
                        </div>
                    );

                } else {
                    return(<div></div>);
                }

            case ComponentType.SCENARIO:

                // Here the designItem contains the actual Scenario Mash data - should be for one scenario

                return (
                    <div>

                        <ScenarioTestResultsContainer params={{
                            userContext: userContext,
                            featureAspectReferenceId: 'NONE',
                            displayContext: displayContext,
                            mashData: designItem
                        }}/>
                    </div>
                );

        }

    }

}

MashDesignItem.propTypes = {
    designItem: PropTypes.object.isRequired,
    displayContext: PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext,
        view:        state.currentAppView,
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(MashDesignItem);
