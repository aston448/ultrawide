// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import DesignComponentTarget from '../../components/edit/DesignComponentTarget.jsx';

// Ultrawide Services
import ClientContainerServices from '../../../apiClient/apiClientContainerServices.js';
import ClientWorkPackageComponentServices from '../../../apiClient/apiClientWorkPackageComponent.js';
import ClientDesignVersionServices from '../../../apiClient/apiClientDesignVersion.js'
import { ViewType, ComponentType, DisplayContext } from '../../../constants/constants.js';

// Bootstrap


// REDUX services
import {connect} from 'react-redux';

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Sections Data Container - gets all design sections inside the current component (Application or Design Section)
//
// ---------------------------------------------------------------------------------------------------------------------

// Design Aspects List Container
class DesignSectionsList extends Component {
    constructor(props) {
        super(props);
    }

    getDesignItem(designSection, displayContext){
        // Design Item needed only in WP context (otherwise we already have it as the current item)
        if(displayContext === DisplayContext.WP_SCOPE || displayContext === DisplayContext.WP_VIEW || displayContext === DisplayContext.DEV_DESIGN) {
            return ClientWorkPackageComponentServices.getDesignItem(designSection.componentId, designSection.workPackageType);
        } else {
            return designSection;
        }
    }

    getDesignUpdateItem(designSection, displayContext, designUpdateId){
        switch(displayContext){
            case  DisplayContext.UPDATABLE_VIEW:
                return ClientDesignVersionServices.getDesignUpdateItemForUpdatableVersion(designSection);
            case DisplayContext.UPDATE_SCOPE:
                // See if this item is in scope - i.e. in the DU
                return ClientDesignVersionServices.getDesignUpdateItemForUpdate(designSection, designUpdateId);
            default:
                return designSection;
        }
    }

    // A list of top level headings in the design
    renderDesignSections() {
        const {components, displayContext, view, mode, viewOptions, userContext} = this.props;

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
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                testSummary = viewOptions.devTestSummaryVisible;
                break;
        }

        return components.map((designSection) => {

            return (
                <DesignComponentTarget
                    key={designSection._id}
                    currentItem={designSection}
                    designItem={this.getDesignItem(designSection, displayContext)}
                    updateItem={this.getDesignUpdateItem(designSection, displayContext, userContext.designUpdateId)}
                    displayContext={displayContext}
                    view={view}
                    mode={mode}
                    testSummary={testSummary}
                />
            );
        });
    }

    render() {
        return (
            <div>
                {this.renderDesignSections()}
            </div>
        );
    }
}

DesignSectionsList.propTypes = {
    components: PropTypes.array.isRequired,
    displayContext: PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        view:           state.currentAppView,
        mode:           state.currentViewMode,
        viewOptions:    state.currentUserViewOptions,
        userContext:    state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
DesignSectionsList = connect(mapStateToProps)(DesignSectionsList);

export default DesignSectionsContainer = createContainer(({params}) => {

    // Get all the Design Sections under this Application or Design Section
    return ClientContainerServices.getComponentDataForParentComponent(
        ComponentType.DESIGN_SECTION,
        params.view,
        params.designVersionId,
        params.updateId,
        params.workPackageId,
        params.parentId,
        params.displayContext
    );


}, DesignSectionsList);