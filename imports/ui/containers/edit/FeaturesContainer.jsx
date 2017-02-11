// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import DesignComponentTarget from '../../components/edit/DesignComponentTarget.jsx';

// Ultrawide Services
import { ViewType, DisplayContext, ComponentType } from '../../../constants/constants.js';
import ClientContainerServices              from '../../../apiClient/apiClientContainerServices.js';
import ClientWorkPackageComponentServices   from '../../../apiClient/apiClientWorkPackageComponent.js';
import ClientDesignVersionServices          from '../../../apiClient/apiClientDesignVersion.js'

// Bootstrap


// REDUX services
import {connect} from 'react-redux';

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Feature Data Container - selects data for all Features in a Design Section
//
// ---------------------------------------------------------------------------------------------------------------------


// Features List for a Design Aspect
class FeaturesList extends Component {
    constructor(props) {
        super(props);
    };

    getDesignItem(feature, displayContext){
        // Design Item needed only in WP context (otherwise we already have it as the current item)
        if(displayContext === DisplayContext.WP_SCOPE || displayContext === DisplayContext.WP_VIEW || displayContext === DisplayContext.DEV_DESIGN) {
            return ClientWorkPackageComponentServices.getDesignItem(feature.componentId, feature.workPackageType);
        } else {
            return feature;
        }
    };

    getDesignUpdateItem(feature, displayContext){
        if(displayContext === DisplayContext.UPDATABLE_VIEW){
            return ClientDesignVersionServices.getDesignUpdateItem(feature);
        } else {
            return null;
        }
    };

    // A list of Features in a Design Section
    renderFeatures() {
        const {components, displayContext, view, mode, viewOptions} = this.props;

        if(components) {

            // Get the appropriate test summary flag for the view
            let testSummary = false;

            switch(view){
                case ViewType.DESIGN_NEW_EDIT:
                case ViewType.DESIGN_PUBLISHED_VIEW:
                case ViewType.DESIGN_UPDATABLE_VIEW:
                    testSummary = viewOptions.designTestSummaryVisible;
                    break;
                case ViewType.DESIGN_UPDATE_EDIT:
                case ViewType.DESIGN_UPDATE_VIEW:
                    testSummary = viewOptions.updateTestSummaryVisible;
                    break;
                case ViewType.DEVELOP_BASE_WP:
                case ViewType.DEVELOP_UPDATE_WP:
                    testSummary = viewOptions.devTestSummaryVisible;
                    break;
            }

            return components.map((feature) => {

                let testSummaryData = null;

                if(testSummary) {
                    testSummaryData = ClientContainerServices.getTestSummaryFeatureData(feature);
                }

                return (
                    <DesignComponentTarget
                        key={feature._id}
                        currentItem={feature}
                        designItem={this.getDesignItem(feature, displayContext)}
                        updateItem={this.getDesignUpdateItem(feature, displayContext)}
                        displayContext={displayContext}
                        view={view}
                        mode={mode}
                        testSummary={testSummary}
                        testSummaryData={testSummaryData}
                    />
                );
            });
        } else {
            //console.log("NULL COMPONENTS FOR FEATURES!")
        }
    }

    render() {
        return (
            <div>
                {this.renderFeatures()}
            </div>
        );
    }
}

FeaturesList.propTypes = {
    components: PropTypes.array.isRequired,
    displayContext: PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        view: state.currentAppView,
        mode: state.currentViewMode,
        viewOptions: state.currentUserViewOptions
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
FeaturesList = connect(mapStateToProps)(FeaturesList);

export default FeaturesContainer = createContainer(({params}) => {

    return ClientContainerServices.getComponentDataForParentComponent(
        ComponentType.FEATURE,
        params.view,
        params.designVersionId,
        params.updateId,
        params.workPackageId,
        params.parentId,
        params.displayContext
    );

}, FeaturesList);