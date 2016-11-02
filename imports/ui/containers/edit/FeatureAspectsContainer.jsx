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
// Feature Aspect Data Container - gets all feature Aspects in a Feature
//
// ---------------------------------------------------------------------------------------------------------------------

// Feature Aspects List for a Feature
class FeatureAspectsList extends Component {
    constructor(props) {
        super(props);

    }

    getDesignItem(featureAspect, displayContext){
        // Design Item needed only in WP context (otherwise we already have it as the current item)
        if(displayContext === DisplayContext.WP_SCOPE || displayContext === DisplayContext.WP_VIEW || displayContext === DisplayContext.DEV_DESIGN) {
            return ClientWorkPackageServices.getDesignItem(featureAspect.componentId, featureAspect.workPackageType);
        } else {
            return featureAspect;
        }
    }

    // A list of Feature Aspects in a Feature
    renderFeatureAspects() {
        const {components, displayContext, view, mode} = this.props;

        if (components) {
            return components.map((featureAspect) => {

                return (
                    <DesignComponentTarget
                        key={featureAspect._id}
                        currentItem={featureAspect}
                        designItem={this.getDesignItem(featureAspect, displayContext)}
                        displayContext={displayContext}
                        view={view}
                        mode={mode}
                    />
                );
            });
        } else {
            console.log("NULL COMPONENTS FOR FEATURE ASPECTS!")
        }
    }

    render() {
        return (
            <div>
                {this.renderFeatureAspects()}
            </div>
        );
    }
}

FeatureAspectsList.propTypes = {
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
FeatureAspectsList = connect(mapStateToProps)(FeatureAspectsList);

export default FeatureAspectsContainer = createContainer(({params}) => {

    return ClientContainerServices.getComponentDataForParentComponent(
        ComponentType.FEATURE_ASPECT,
        params.view,
        params.designVersionId,
        params.updateId,
        params.workPackageId,
        params.parentId,
        params.displayContext
    );

}, FeatureAspectsList);