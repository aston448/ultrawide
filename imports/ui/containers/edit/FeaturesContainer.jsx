// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

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

    getDesignUpdateItem(feature, displayContext, designUpdateId){
        switch(displayContext){
            case  DisplayContext.WORKING_VIEW:
                return ClientDesignVersionServices.getDesignUpdateItemForUpdatableVersion(feature);
            case DisplayContext.UPDATE_SCOPE:
                // See if this item is in scope - i.e. in the DU
                return ClientDesignVersionServices.getDesignUpdateItemForUpdate(feature, designUpdateId);
            case DisplayContext.WP_SCOPE:
            case DisplayContext.DEV_DESIGN:
                // For WP scoping or Development get the update item if WP is based on an update
                if(designUpdateId !== 'NONE'){
                    return ClientDesignVersionServices.getDesignUpdateItemForUpdate(feature, designUpdateId);
                } else {
                    return feature
                }
            default:
                return feature;
        }
    };

    getWpItem(feature, workPackageId){
        return ClientWorkPackageComponentServices.getWorkPackageComponent(feature.componentReferenceId, workPackageId);
    }

    // A list of Features in a Design Section
    renderFeatures() {
        const {components, displayContext, view, mode, userContext, viewOptions, testSummary} = this.props;

        if(components) {

            return components.map((feature) => {

                let testSummaryData = null;

                if(testSummary) {
                    testSummaryData = ClientContainerServices.getTestSummaryFeatureData(feature);
                }

                return (
                    <DesignComponentTarget
                        key={feature._id}
                        currentItem={feature}
                        updateItem={this.getDesignUpdateItem(feature, displayContext, userContext.designUpdateId)}
                        wpItem={this.getWpItem(feature, userContext.workPackageId)}
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
    displayContext: PropTypes.string.isRequired,
    testSummary: PropTypes.bool.isRequired,
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        view:           state.currentAppView,
        mode:           state.currentViewMode,
        userContext:    state.currentUserItemContext,
        viewOptions:    state.currentUserViewOptions
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
FeaturesList = connect(mapStateToProps)(FeaturesList);

export default FeaturesContainer = createContainer(({params}) => {

    const components = ClientContainerServices.getComponentDataForParentComponent(
        ComponentType.FEATURE,
        params.view,
        params.designVersionId,
        params.updateId,
        params.workPackageId,
        params.parentId,
        params.displayContext
    );

    return{
        components: components,
        displayContext: params.displayContext,
        testSummary: params.testSummary
    }

}, FeaturesList);