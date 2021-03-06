// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import DesignComponentTarget                from '../../components/edit/DesignComponentTarget.jsx';

// Ultrawide Services
import ClientContainerServices              from '../../../apiClient/apiClientContainerServices.js';
import ClientWorkPackageComponentServices   from '../../../apiClient/apiClientWorkPackageComponent.js';
import ClientDesignVersionServices          from '../../../apiClient/apiClientDesignVersion.js'

import { ViewType, ComponentType, DisplayContext } from '../../../constants/constants.js';

// Bootstrap

// REDUX services
import {connect} from 'react-redux';

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

    getDesignUpdateItem(designSection, displayContext, designUpdateId){
        switch(displayContext){
            case  DisplayContext.WORKING_VIEW:
                return ClientDesignVersionServices.getDesignUpdateItemForUpdatableVersion(designSection);
            case DisplayContext.UPDATE_SCOPE:
                // See if this item is in scope - i.e. in the DU
                return ClientDesignVersionServices.getDesignUpdateItemForUpdate(designSection, designUpdateId);
            case DisplayContext.WP_SCOPE:
            case DisplayContext.DEV_DESIGN:
                // For WP scoping or Development get the update item if WP is based on an update
                if(designUpdateId !== 'NONE'){
                    return ClientDesignVersionServices.getDesignUpdateItemForUpdate(designSection, designUpdateId);
                } else {
                    return designSection
                }
            default:
                return designSection;
        }
    }

    getWpItem(designSection, workPackageId){
        return ClientWorkPackageComponentServices.getWorkPackageComponent(designSection.componentReferenceId, workPackageId);
    }

    // A list of top level headings in the design
    renderDesignSections(components, displayContext, view, mode, viewOptions, userContext, testSummary) {

        if(components.length > 0) {

            return components.map((designSection) => {

                //console.log("Design section: " + designSection._id);
                return (
                    <DesignComponentTarget
                        key={designSection._id}
                        currentItem={designSection}
                        updateItem={this.getDesignUpdateItem(designSection, displayContext, userContext.designUpdateId)}
                        wpItem={this.getWpItem(designSection, userContext.workPackageId)}
                        displayContext={displayContext}
                        view={view}
                        mode={mode}
                        testSummary={testSummary}
                    />
                );
            });
        } else {
            return(
                <div></div>
            )
        }
    }

    render() {

        const {components, displayContext, view, mode, viewOptions, userContext, testSummary} = this.props;

        //console.log("rendering " + displayContext +  " design sections with list length " + components.length + " and component 0 is " + components[0]);
        return (
            <div>
                {this.renderDesignSections(components, displayContext, view, mode, viewOptions, userContext, testSummary)}
            </div>
        );
    }
}

DesignSectionsList.propTypes = {
    components: PropTypes.array.isRequired,
    displayContext: PropTypes.string.isRequired,
    testSummary: PropTypes.bool.isRequired,
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
    const components =  ClientContainerServices.getComponentDataForParentComponent(
        ComponentType.DESIGN_SECTION,
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


}, DesignSectionsList);