// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components
import MashSelectedItemContainer        from '../../containers/mash/MashSelectedItemContainer.jsx';
import ScenarioTestResultsContainer     from '../../containers/mash/ScenarioTestResultsContainer.jsx';
import AcceptanceTestScenarioMashItem   from './AcceptanceTestScenarioMashItem.jsx';
import IntegrationTestScenarioMashItem  from './IntegrationTestScenarioMashItem.jsx';
import UnitTestScenarioMashItem         from './UnitTestScenarioMashItem.jsx';

// Ultrawide Services
import { ViewType, DisplayContext, ComponentType } from '../../../constants/constants.js';

import ClientTestIntegrationServices        from '../../../apiClient/apiClientTestIntegration.js';

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

    hasScenarios(designItem, userContext){
        return ClientTestIntegrationServices.hasScenarios(designItem, userContext)
    }

    render(){
        const { designItem, displayContext, view, userContext } = this.props;

        // What is rendered depends on the item type.  Assume its a Scenario if not a Design Version component
        // with a specified type

        let componentType = ComponentType.SCENARIO;

        if(designItem.componentType){
            componentType = designItem.componentType;
        }

        switch(componentType){
            // case ComponentType.APPLICATION:
            //     return(
            //         <MashSelectedItemContainer params={{
            //             componentType: ComponentType.DESIGN_SECTION,
            //             designItemId: designItem._id,
            //             userContext: userContext,
            //             view: view,
            //             displayContext: displayContext
            //         }}/>
            //     );

            case ComponentType.DESIGN_SECTION:
                // Just get more items.  Could be Features or more Sections
                return(
                    <div>
                        <MashSelectedItemContainer params={{
                            componentType: ComponentType.FEATURE,
                            designItemId: designItem._id,
                            userContext: userContext,
                            view: view,
                            displayContext: displayContext
                        }}/>
                        <MashSelectedItemContainer params={{
                            componentType: ComponentType.DESIGN_SECTION,
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
                            componentType: ComponentType.FEATURE_ASPECT,
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

                    return (
                        <div>

                            <div className={"mash-aspect"}>
                                {designItem.componentNameNew}
                            </div>

                            <ScenarioTestResultsContainer params={{
                                userContext: userContext,
                                featureAspectReferenceId: designItem.componentReferenceId,
                                displayContext: displayContext
                            }}/>
                        </div>
                    );

                } else {
                    return(<div></div>);
                }

            case ComponentType.SCENARIO:

                // For a scenario there is no further list of Design items and we have the mash data in designItem
                // so display the test results...

                switch(displayContext){
                    case DisplayContext.MASH_ACC_TESTS:
                        return(
                            <AcceptanceTestScenarioMashItem
                                mashItem={designItem}
                            />
                        );

                    case DisplayContext.MASH_INT_TESTS:
                        return (
                            <IntegrationTestScenarioMashItem
                                mashItem={designItem}
                            />
                        );

                    case DisplayContext.MASH_UNIT_TESTS:
                        return (
                            <UnitTestScenarioMashItem
                                mashItem={designItem}
                            />
                        );
                }

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
