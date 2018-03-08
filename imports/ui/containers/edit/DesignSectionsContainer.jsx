// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import DesignComponentTarget                from '../../components/edit/DesignComponentTarget.jsx';
import DesignComponent                      from '../../components/edit/DesignComponent.jsx';

// Ultrawide Services
import {log, replaceAll} from "../../../common/utils";
import { LogLevel, ComponentType, DisplayContext, UpdateScopeType, ViewMode } from '../../../constants/constants.js';

import ClientDataServices                   from '../../../apiClient/apiClientDataServices.js';
import ClientWorkPackageComponentServices   from '../../../apiClient/apiClientWorkPackageComponent.js';
import ClientDesignVersionServices          from '../../../apiClient/apiClientDesignVersion.js'
import ClientDesignComponentServices        from "../../../apiClient/apiClientDesignComponent";
// Bootstrap

// REDUX services
import {connect} from 'react-redux';
import ComponentUiModules from "../../../ui_modules/design_component";



// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Sections Data Container - gets all design sections inside the current component (Application or Design Section)
//
// ---------------------------------------------------------------------------------------------------------------------

class DesignSectionsList extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps){

        let shouldComponentUpdate = ComponentUiModules.shouldComponentListUpdate('Design Section', nextProps, this.props);

        if(!shouldComponentUpdate){

            shouldComponentUpdate = (
                nextProps.testSummary !== this.props.testSummary
            );

            if(shouldComponentUpdate){
                log((msg) => console.log(msg), LogLevel.PERF, 'Design section list updating due to TEST SUMMARY');
            }
        }

        return shouldComponentUpdate;
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

    getParentName(currentItem){

        if(currentItem && currentItem.componentParentReferenceIdNew !== 'NONE') {
            const parent = ClientDesignComponentServices.getCurrentItemParent(currentItem);
            if(parent){
                return parent.componentNameNew;
            } else {
                return 'NONE';
            }
        } else {
            return 'NONE';
        }

    }

    // A list of top level headings in the design
    renderDesignSections(components, displayContext, view, mode, viewOptions, userContext, testSummary) {

        if(components.length > 0) {

            let updateItem = {};
            let wpItem = {};

            // In a view or scope scenario we don't need a Target
            if(mode === ViewMode.MODE_VIEW || displayContext === DisplayContext.WP_SCOPE || displayContext === DisplayContext.UPDATE_SCOPE){

                return components.map((designSection) => {

                    updateItem = this.getDesignUpdateItem(designSection, displayContext, userContext.designUpdateId);
                    wpItem = this.getWpItem(designSection, userContext.workPackageId);

                    let updateItemScope = UpdateScopeType.SCOPE_OUT_SCOPE;
                    if(updateItem && updateItem.scopeType){
                        updateItemScope = updateItem.scopeType;
                    }

                    const uiItemId = replaceAll(designSection.componentNameNew, ' ', '_');
                    const uiParentId = replaceAll(this.getParentName(designSection), ' ', '_');

                    return (
                        <DesignComponent
                            key={designSection._id}
                            currentItem={designSection}
                            updateItem={updateItem}
                            updateItemScope={updateItemScope}
                            wpItem={wpItem}
                            uiItemId={uiItemId}
                            uiParentId={uiParentId}
                            isDragDropHovering={false}
                            displayContext={displayContext}
                            testSummary={testSummary}
                            testSummaryData={null}
                        />
                    );
                });

            } else {

                return components.map((designSection) => {

                    updateItem = this.getDesignUpdateItem(designSection, displayContext, userContext.designUpdateId);
                    wpItem = this.getWpItem(designSection, userContext.workPackageId);

                    return (
                        <DesignComponentTarget
                            key={designSection._id}
                            currentItem={designSection}
                            updateItem={updateItem}
                            wpItem={wpItem}
                            displayContext={displayContext}
                            view={view}
                            mode={mode}
                            testSummary={testSummary}
                        />
                    );
                });
            }


        } else {
            return(
                <div></div>
            )
        }
    }

    render() {

        const {components, displayContext, view, mode, viewOptions, userContext, testSummary} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Design Sections');

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
        userContext:    state.currentUserItemContext,
        updateScopeFlag: state.currentUpdateScopeFlag,
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
DesignSectionsList = connect(mapStateToProps)(DesignSectionsList);

export default DesignSectionsContainer = createContainer(({params}) => {

    // Get all the Design Sections under this Application or Design Section
    const components =  ClientDataServices.getComponentDataForParentComponent(
        ComponentType.DESIGN_SECTION,
        params.view,
        params.designVersionId,
        params.updateId,
        params.workPackageId,
        params.parentRefId,
        params.displayContext
    );

    return{
        components: components,
        displayContext: params.displayContext,
        testSummary: params.testSummary
    }


}, DesignSectionsList);