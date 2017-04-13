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
// Feature Aspect Data Container - gets all feature Aspects in a Feature
//
// ---------------------------------------------------------------------------------------------------------------------

// Feature Aspects List for a Feature
class FeatureAspectsList extends Component {
    constructor(props) {
        super(props);

    };

    getDesignUpdateItem(featureAspect, displayContext, designUpdateId){
        switch(displayContext){
            case  DisplayContext.WORKING_VIEW:
                return ClientDesignVersionServices.getDesignUpdateItemForUpdatableVersion(featureAspect);
            case DisplayContext.UPDATE_SCOPE:
                // See if this item is in scope - i.e. in the DU
                return ClientDesignVersionServices.getDesignUpdateItemForUpdate(featureAspect, designUpdateId);
            case DisplayContext.WP_SCOPE:
            case DisplayContext.DEV_DESIGN:
                // For WP scoping or Development get the update item if WP is based on an update
                if(designUpdateId !== 'NONE'){
                    return ClientDesignVersionServices.getDesignUpdateItemForUpdate(featureAspect, designUpdateId);
                } else {
                    return featureAspect
                }
            default:
                return featureAspect;
        }
    };

    getWpItem(featureAspect, workPackageId){
        return ClientWorkPackageComponentServices.getWorkPackageComponent(featureAspect._id, workPackageId);
    }

    // A list of Feature Aspects in a Feature
    renderFeatureAspects() {
        const {components, displayContext, view, mode, userContext, viewOptions, testSummary} = this.props;

        if (components) {

            // Get the appropriate test summary flag for the view
            let actualTestSummary = false;

            if(testSummary) {

                switch (view) {
                    case ViewType.DESIGN_NEW_EDIT:
                    case ViewType.DESIGN_PUBLISHED_VIEW:
                    case ViewType.DESIGN_UPDATABLE_VIEW:
                        actualTestSummary = viewOptions.designTestSummaryVisible;
                        break;
                    case ViewType.DESIGN_UPDATE_EDIT:
                    case ViewType.DESIGN_UPDATE_VIEW:
                        actualTestSummary = viewOptions.updateTestSummaryVisible;
                        break;
                    case ViewType.DEVELOP_BASE_WP:
                    case ViewType.DEVELOP_UPDATE_WP:
                    case ViewType.WORK_PACKAGE_BASE_VIEW:
                    case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                        actualTestSummary = viewOptions.devTestSummaryVisible;
                        break;
                }
            }

            return components.map((featureAspect) => {

                return (
                    <DesignComponentTarget
                        key={featureAspect._id}
                        currentItem={featureAspect}
                        updateItem={this.getDesignUpdateItem(featureAspect, displayContext, userContext.designUpdateId)}
                        wpItem={this.getWpItem(featureAspect, userContext.workPackageId)}
                        displayContext={displayContext}
                        view={view}
                        mode={mode}
                        testSummary={actualTestSummary}
                    />
                );
            });
        } else {
            //console.log("NULL COMPONENTS FOR FEATURE ASPECTS!")
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
    displayContext: PropTypes.string.isRequired,
    testSummary: PropTypes.bool.isRequired
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
FeatureAspectsList = connect(mapStateToProps)(FeatureAspectsList);

export default FeatureAspectsContainer = createContainer(({params}) => {

    const components =  ClientContainerServices.getComponentDataForParentComponent(
        ComponentType.FEATURE_ASPECT,
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

}, FeatureAspectsList);