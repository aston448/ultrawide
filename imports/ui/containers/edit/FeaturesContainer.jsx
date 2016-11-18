// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import DesignComponentTarget from '../../components/edit/DesignComponentTarget.jsx';

// Ultrawide Services
import { DisplayContext, ComponentType } from '../../../constants/constants.js';
import ClientContainerServices from '../../../apiClient/apiClientContainerServices.js';
import ClientWorkPackageServices from '../../../apiClient/apiClientWorkPackage.js';

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
    }

    getDesignItem(feature, displayContext){
        // Design Item needed only in WP context (otherwise we already have it as the current item)
        if(displayContext === DisplayContext.WP_SCOPE || displayContext === DisplayContext.WP_VIEW || displayContext === DisplayContext.DEV_DESIGN) {
            return ClientWorkPackageServices.getDesignItem(feature.componentId, feature.workPackageType);
        } else {
            return feature;
        }
    }

    // A list of Features in a Design Section
    renderFeatures() {
        const {components, displayContext, view, mode} = this.props;

        if(components) {
            return components.map((feature) => {

                return (
                    <DesignComponentTarget
                        key={feature._id}
                        currentItem={feature}
                        designItem={this.getDesignItem(feature, displayContext)}
                        displayContext={displayContext}
                        view={view}
                        mode={mode}
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
        mode: state.currentViewMode
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