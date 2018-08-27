// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components
import TestExpectationSelectedItemContainer         from '../../containers/mash/TestExpectationSelectedItemContainer.jsx';
import ScenarioTestExpectations                     from '../../components/mash/ScenarioTestExpectations.jsx';

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
// Test Expectation Design Item - placeholder for a further list of Design Items in the Test Expectations
//
// ---------------------------------------------------------------------------------------------------------------------

class TestExpectationDesignItem extends Component {

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

        log((msg) => console.log(msg), LogLevel.DEBUG, 'Render Test Expectation Design Item');

        // What is rendered depends on the item type.  Assume its a Scenario if not a Design Version component
        // with a specified type


        //console.log('Design Item for ID %s = %o', userContext.designComponentId, designItem.componentNameNew);

        if(designItem) {

            let componentType = ComponentType.SCENARIO;

            if (designItem.componentType) {
                componentType = designItem.componentType;
            }

            //console.log("Component Type: " + componentType);

            switch (componentType) {

                case ComponentType.DESIGN_SECTION:
                    // Expectations only supported at the Feature Level
                    return (
                        <div>
                        </div>
                    );

                case ComponentType.FEATURE:
                    // Header and then get more items
                    return (
                        <div className="mash-feature-group">

                            <div className={"mash-feature"}>
                                {designItem.componentNameNew}
                            </div>

                            <TestExpectationSelectedItemContainer params={{
                                childComponentType: ComponentType.FEATURE_ASPECT,
                                designItemId: designItem._id,
                                userContext: userContext,
                                view: view,
                                displayContext: displayContext
                            }}/>
                        </div>
                    );

                case ComponentType.FEATURE_ASPECT:
                    // Header and then get the actual Scenario Expectations data

                    // But only if there are actually scenarios to display

                    if (this.hasScenarios(designItem, userContext)) {

                        //console.log("Displaying scenarios for feature aspect " + designItem.componentNameNew);

                        return (
                            <div>

                                <div className={"mash-aspect"}>
                                    {designItem.componentNameNew}
                                </div>

                                <TestExpectationSelectedItemContainer params={{
                                    childComponentType: ComponentType.SCENARIO,
                                    designItemId: designItem._id,
                                    userContext: userContext,
                                    view: view,
                                    displayContext: displayContext
                                }}/>
                            </div>
                        );

                    } else {
                        return (<div></div>);
                    }

                case ComponentType.SCENARIO:

                    // Here the designItem contains the actual Scenario Mash data - should be for one scenario

                    return (
                        <div className={'scenario-test-expectations'}>

                            <div className={"mash-scenario"}>
                                {designItem.componentNameNew}
                            </div>

                            <ScenarioTestExpectations
                                scenario={designItem}
                            />
                        </div>
                    );

            }
        } else {

            return (<div>Select a Feature</div>);
        }

    }

}

TestExpectationDesignItem.propTypes = {
    designItem:     PropTypes.object.isRequired,
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
export default connect(mapStateToProps)(TestExpectationDesignItem);
