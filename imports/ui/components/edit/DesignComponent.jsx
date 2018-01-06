// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components
import DesignSectionsContainer  from '../../containers/edit/DesignSectionsContainer.jsx';
import FeaturesContainer        from '../../containers/edit/FeaturesContainer.jsx';
import FeatureAspectsContainer  from '../../containers/edit/FeatureAspectsContainer.jsx';
import ScenariosContainer       from '../../containers/edit/ScenariosContainer.jsx';

import DesignComponentAdd       from '../common/DesignComponentAdd.jsx';
import Narrative                from './Narrative.jsx';
import MoveTarget               from './MoveTarget.jsx';
import DesignComponentHeader    from './DesignComponentHeader.jsx';

// Ultrawide Services
import {ComponentType, ViewMode, ViewType, DisplayContext, WorkPackageType, UpdateScopeType, LogLevel} from '../../../constants/constants.js';
import {AddActionIds}   from "../../../constants/ui_context_ids.js";

import ClientDesignComponentServices        from '../../../apiClient/apiClientDesignComponent.js';
import ClientDesignUpdateComponentServices  from '../../../apiClient/apiClientDesignUpdateComponent.js';
import ClientWorkPackageComponentServices   from '../../../apiClient/apiClientWorkPackageComponent.js';
import ComponentUiModules                   from '../../../ui_modules/design_component.js'

import { log }              from '../../../common/utils.js';

// Bootstrap
import {Panel} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';
import {UserSettingValue} from "../../../constants/constants";

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Component Component - One generic element of a design - could be Application, Section, Feature, Feature Aspect, Scenario
//
// ---------------------------------------------------------------------------------------------------------------------

export class DesignComponent extends Component{

    constructor(...args){
        super(...args);

        this.state = {
            open: false,
            highlighted: false,
        };
    }

    shouldComponentUpdate(nextProps, nextState){

        // Optimisation.  No need to re-render this component if stuff that changes its look not changed
        return ComponentUiModules.componentShouldUpdate(this.props, nextProps, this.state, nextState);


        // // Redraw if domain terms toggled on / off
        // //console.log('DTV New: ' + nextProps.domainTermsVisible + ' DTV old: ' + this.props.domainTermsVisible);
        // if(nextProps.domainTermsVisible !== this.props.domainTermsVisible){
        //     return true;
        // }
        //
        // // Do refresh if this specific component is gaining or losing focus
        // let currentItemId = this.props.currentItem._id;
        // let openItemId = this.props.currentItem._id;
        //
        // if(this.props.displayContext === DisplayContext.WP_VIEW || this.props.displayContext === DisplayContext.DEV_DESIGN){
        //     openItemId = this.props.wpItem._id;
        // }
        //
        // if((nextProps.userContext.designComponentId === currentItemId) && (this.props.userContext.designComponentId !== currentItemId)){
        //     return true;
        // }
        //
        // if((nextProps.userContext.designComponentId !== currentItemId) && (this.props.userContext.designComponentId === currentItemId)){
        //     return true;
        // }
        //
        // // If this specific item has been opened or closed...
        // if(nextProps.openItemsFlag.item === openItemId){
        //     return true;
        // }
        //
        // if(this.props.view === ViewType.DESIGN_UPDATE_EDIT) {
        //
        //     // Look for Design Update scoping trigger
        //
        //     if (nextProps.updateScopeFlag !== this.props.updateScopeFlag) {
        //
        //         // If its one of the descoped items
        //         if (nextProps.updateScopeItems.removed.includes(nextProps.currentItem.componentReferenceId)) {
        //             return true;
        //         }
        //
        //         // Or its in the update scope
        //         if (this.props.updateItem || nextProps.updateItem) {
        //             return true;
        //         }
        //     }
        // }
        //
        // // Check for scope updates in WP Editor
        // if(this.props.view === ViewType.WORK_PACKAGE_BASE_EDIT || this.props.view === ViewType.WORK_PACKAGE_UPDATE_EDIT) {
        //
        //     if (nextProps.workPackageScopeFlag !== this.props.workPackageScopeFlag) {
        //         // An update has been triggered.  Render if this item is in the WP
        //
        //         // If its one of the descoped items
        //         if (nextProps.workPackageScopeItems.removed.includes(this.props.currentItem.componentReferenceId)) {
        //             return true;
        //         }
        //
        //         // Or its in the scope
        //         if (nextProps.wpItem) {
        //             return true;
        //         }
        //     }
        // }
        //
        // let shouldComponentUpdate = false;
        //
        // switch (nextProps.view) {
        //     case ViewType.DESIGN_NEW:
        //     case ViewType.DESIGN_PUBLISHED:
        //     case ViewType.DESIGN_UPDATABLE:
        //     case ViewType.WORK_PACKAGE_BASE_EDIT:
        //     case ViewType.WORK_PACKAGE_BASE_VIEW:
        //         shouldComponentUpdate =!(
        //             nextState.open === this.state.open &&
        //             nextState.highlighted === this.state.highlighted &&
        //             nextState.editing === this.state.editing &&
        //             nextState.editorState === this.state.editorState &&
        //             nextProps.testSummary === this.props.testSummary &&
        //             nextProps.currentItem.componentNameNew === this.props.currentItem.componentNameNew &&
        //             nextProps.currentItem.isRemovable === this.props.currentItem.isRemovable &&
        //             nextProps.isDragDropHovering === this.props.isDragDropHovering &&
        //             nextProps.mode === this.props.mode &&
        //             nextProps.testDataFlag === this.props.testDataFlag
        //         );
        //         break;
        //     case ViewType.DESIGN_UPDATE_EDIT:
        //     case ViewType.DESIGN_UPDATE_VIEW:
        //     case ViewType.WORK_PACKAGE_UPDATE_EDIT:
        //     case ViewType.WORK_PACKAGE_UPDATE_VIEW:
        //         shouldComponentUpdate =!(
        //             nextState.open === this.state.open &&
        //             nextState.highlighted === this.state.highlighted &&
        //             nextState.editing === this.state.editing &&
        //             nextState.editorState === this.state.editorState &&
        //             nextProps.testSummary === this.props.testSummary &&
        //             nextProps.currentItem.componentNameNew === this.props.currentItem.componentNameNew &&
        //             nextProps.currentItem.isRemovable === this.props.currentItem.isRemovable &&
        //             nextProps.currentItem.updateMergeStatus === this.props.currentItem.updateMergeStatus &&
        //             nextProps.isDragDropHovering === this.props.isDragDropHovering &&
        //             nextProps.mode === this.props.mode &&
        //             nextProps.testDataFlag === this.props.testDataFlag
        //         );
        //         break;
        //     case ViewType.DEVELOP_BASE_WP:
        //     case ViewType.DEVELOP_UPDATE_WP:
        //         shouldComponentUpdate = !(
        //             nextState.open === this.state.open &&
        //             nextState.highlighted === this.state.highlighted &&
        //             nextProps.currentItem.isRemovable === this.props.currentItem.isRemovable &&
        //             nextProps.mode === this.props.mode &&
        //             nextProps.testDataFlag === this.props.testDataFlag &&
        //             nextProps.testSummary === this.props.testSummary
        //          );
        // }
        //
        // //console.log("Component " + nextProps.currentItem.componentNameNew + " old open = " + this.state.open + " new open = " + nextState.open);
        // //console.log("Component " + nextProps.currentItem.componentNameNew + " updating = " + shouldComponentUpdate);
        //
        // return shouldComponentUpdate;

    }

    componentDidMount(){

        // Generally open things that are open...
        this.setOpenState(this.props);

    }

    componentWillReceiveProps(newProps){

        // Change open state if REDUX state has changed for this item
        if(newProps.openItemsFlag.flag !== this.props.openItemsFlag.flag  || newProps.openItemsFlag.item === this.props.currentItem._id) {

            switch (newProps.view) {
                case ViewType.DESIGN_NEW:
                case ViewType.DESIGN_PUBLISHED:
                case ViewType.DESIGN_UPDATABLE:

                    this.setOpenStateIfDesignItemChanging(newProps);
                    break;

                case ViewType.DESIGN_UPDATE_EDIT:
                case ViewType.DESIGN_UPDATE_VIEW:
                    if(newProps.displayContext === DisplayContext.UPDATE_SCOPE || newProps.displayContext === DisplayContext.WORKING_VIEW){

                        this.setOpenStateIfDesignItemChanging(newProps)

                    } else {
                        if(newProps.updateItem) {

                            this.setOpenStateIfUpdateItemChanging(newProps)
                        }
                    }
                    break;
                case ViewType.WORK_PACKAGE_BASE_EDIT:
                    switch(this.props.displayContext) {
                        case DisplayContext.WP_SCOPE:
                            // Scope is Design Items
                            this.setOpenStateIfDesignItemChanging(newProps);
                            break;

                        case DisplayContext.WP_VIEW:

                            this.setOpenStateIfWorkPackageItemChanging(newProps);
                    }
                    break;
                case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                    switch(this.props.displayContext){
                        case DisplayContext.WP_SCOPE:
                            // Scope is Update Items
                            this.setOpenStateIfUpdateItemChanging(newProps);
                            break;
                        case DisplayContext.WP_VIEW:

                            this.setOpenStateIfWorkPackageItemChanging(newProps);
                    }
                    break;

                case ViewType.WORK_PACKAGE_BASE_VIEW:
                case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                case ViewType.DEVELOP_BASE_WP:
                case ViewType.DEVELOP_UPDATE_WP:

                    this.setOpenStateIfWorkPackageItemChanging(newProps);
                    break;
            }
        }
    }

    setOpenStateIfDesignItemChanging(newProps){
        if (
            (newProps.openDesignItems.includes(this.props.currentItem._id) && !(this.props.openDesignItems.includes(this.props.currentItem._id))) ||
            (!(newProps.openDesignItems.includes(this.props.currentItem._id)) && this.props.openDesignItems.includes(this.props.currentItem._id)) ||
            (newProps.openDesignItems.includes(this.props.currentItem._id) && !this.state.open) ||
            (!(newProps.openDesignItems.includes(this.props.currentItem._id)) && this.state.open)
        ) {
            this.setOpenState(newProps);
        }
    }

    setOpenStateIfUpdateItemChanging(newProps){
        //console.log("Updating open state...?");
        if (
            (newProps.openDesignUpdateItems.includes(this.props.updateItem._id) && !(this.props.openDesignUpdateItems.includes(this.props.updateItem._id))) ||
            (!(newProps.openDesignUpdateItems.includes(this.props.updateItem._id)) && this.props.openDesignUpdateItems.includes(this.props.updateItem._id)) ||
            (newProps.openDesignUpdateItems.includes(this.props.updateItem._id) && !this.state.open) ||
            (!(newProps.openDesignUpdateItems.includes(this.props.updateItem._id)) && this.state.open)
        ) {
            //console.log("YES. Updating open state...");
            this.setOpenState(newProps);
        }
    }

    setOpenStateIfWorkPackageItemChanging(newProps){
        if (
            (newProps.openWorkPackageItems.includes(this.props.wpItem._id) && !(this.props.openWorkPackageItems.includes(this.props.wpItem._id))) ||
            (!(newProps.openWorkPackageItems.includes(this.props.wpItem._id)) && this.props.openWorkPackageItems.includes(this.props.wpItem._id)) ||
            (newProps.openWorkPackageItems.includes(this.props.wpItem._id) && !this.state.open) ||
            (!(newProps.openWorkPackageItems.includes(this.props.wpItem._id)) && this.state.open)
        ) {
            this.setOpenState(newProps);
        }
    }

    setOpenState(props){

        // console.log("Open design update items length is " + openUpdateItems.length);
        // openUpdateItems.forEach((item) => {
        //     console.log("Item: " + item);
        // });

        switch(props.view){
            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
            case ViewType.DESIGN_UPDATABLE:
                this.setState({open: props.openDesignItems.includes(props.currentItem._id)});
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
                if(props.displayContext === DisplayContext.UPDATE_SCOPE || props.displayContext === DisplayContext.WORKING_VIEW) {
                    this.setState({open: props.openDesignItems.includes(props.currentItem._id)});
                } else {
                    if(props.updateItem) {
                        //console.log("Setting open state for " + props.updateItem.componentNameNew + " to " + props.openDesignUpdateItems.includes(props.updateItem._id));
                        this.setState({open: props.openDesignUpdateItems.includes(props.updateItem._id)});
                    }
                }
                break;
            case ViewType.WORK_PACKAGE_BASE_EDIT:
                switch(this.props.displayContext){
                    case DisplayContext.WP_SCOPE:
                        this.setState({open: props.openDesignItems.includes(props.currentItem._id)});
                        break;
                    case DisplayContext.WP_VIEW:

                        this.setState({open: props.openWorkPackageItems.includes(props.wpItem._id)});
                }
                break;
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                switch(this.props.displayContext){
                    case DisplayContext.WP_SCOPE:
                        this.setState({open: props.openDesignUpdateItems.includes(props.currentItem._id)});
                        break;
                    case DisplayContext.WP_VIEW:

                        this.setState({open: props.openWorkPackageItems.includes(props.wpItem._id)});
                }
                break;
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:
                this.setState({open: props.openWorkPackageItems.includes(props.wpItem._id)});
                break;
        }
    }

    toggleHighlight(value){
        this.setState({highlighted: value})
    }

    // Design component open or closed (i.e. is body of it visible)
    toggleOpen(){

        switch(this.props.view){
            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
            case ViewType.DESIGN_UPDATABLE:

                ClientDesignComponentServices.setOpenClosed(this.props.currentItem, this.props.openDesignItems, !this.state.open);
                break;

            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
                switch(this.props.displayContext){
                    case DisplayContext.UPDATE_SCOPE:
                    case DisplayContext.WORKING_VIEW:
                        ClientDesignComponentServices.setOpenClosed(this.props.currentItem, this.props.openDesignItems, !this.state.open);
                        break;
                    default:
                        if(this.props.updateItem.scopeType !== UpdateScopeType.SCOPE_PEER_SCOPE) {
                            ClientDesignUpdateComponentServices.setOpenClosed(this.props.updateItem, this.props.openDesignUpdateItems, !this.state.open);
                        }
                }
                break;

            case ViewType.WORK_PACKAGE_BASE_EDIT:
                switch(this.props.displayContext){
                    case DisplayContext.WP_SCOPE:
                        // Scope is Design Items
                        ClientDesignComponentServices.setOpenClosed(this.props.currentItem, this.props.openDesignItems, !this.state.open);
                        break;
                    case DisplayContext.WP_VIEW:
                        ClientWorkPackageComponentServices.setOpenClosed(this.props.wpItem, this.props.openWorkPackageItems, !this.state.open);

                }
                break;

            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                switch(this.props.displayContext){
                    case DisplayContext.WP_SCOPE:
                        // Scope is Design Update Items
                        if(this.props.updateItem.scopeType !== UpdateScopeType.SCOPE_PEER_SCOPE) {
                            ClientDesignUpdateComponentServices.setOpenClosed(this.props.currentItem, this.props.openDesignUpdateItems, !this.state.open);
                        }
                        break;
                    case DisplayContext.WP_VIEW:
                        ClientWorkPackageComponentServices.setOpenClosed(this.props.wpItem, this.props.openWorkPackageItems, !this.state.open);

                }
                break;

            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.DEVELOP_BASE_WP:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
            case ViewType.DEVELOP_UPDATE_WP:

                ClientWorkPackageComponentServices.setOpenClosed(this.props.wpItem, this.props.openWorkPackageItems, !this.state.open);
                break;
        }

        //this.setState({open: !this.state.open});
    }

    // User selected this component - make it the current one
    setNewDesignComponentActive(newItemId, userContext, displayContext){

        ClientDesignComponentServices.setDesignComponent(newItemId, userContext, displayContext)
    }

    // Add a new section to an application component
    addDesignSectionToApplication(view, mode, appItem){

        switch(view){
            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
                // Adding to the design itself
                ClientDesignComponentServices.addDesignSectionToApplication(view, mode, appItem);
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
                // Adding to a design update
                ClientDesignUpdateComponentServices.addDesignSectionToApplication(view, mode, appItem);
                break;
        }
    }

    // Add a new subsection to this section component
    addSectionToDesignSection(view, mode, sectionItem){

        switch(view){
            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
                // Adding to the design itself
                ClientDesignComponentServices.addSectionToDesignSection(view, mode, sectionItem);
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
                // Adding to a design update
                ClientDesignUpdateComponentServices.addSectionToDesignSection(view, mode, sectionItem);
                break;
        }
    }

    // Add a new feature to this section component
    addFeatureToDesignSection(view, mode, sectionItem){

        switch(view){
            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
                // Adding to the design itself
                ClientDesignComponentServices.addFeatureToDesignSection(view, mode, sectionItem);
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
                // Adding to a design update
                ClientDesignUpdateComponentServices.addFeatureToDesignSection(view, mode, sectionItem);
                break;
        }
    }

    // Add a new Feature Aspect to a Feature
    addFeatureAspectToFeature(view, mode, featureItem, userContext){

        switch(view){
            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
            case ViewType.DEVELOP_BASE_WP:
                ClientDesignComponentServices.addFeatureAspectToFeature(view, mode, featureItem, userContext.workPackageId);
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DEVELOP_UPDATE_WP:
                ClientDesignUpdateComponentServices.addFeatureAspectToFeature(view, mode, featureItem, userContext.workPackageId);
                break;
        }
    }

    // Add a new scenario to this component (Feature or Feature Aspect)
    addScenario(view, mode, parentItem, userContext){

        console.log('Add Scenario for view ' + view + ' with WP ' + userContext.workPackageId + ' for parent ' + parentItem);

        switch(view){
            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
            case ViewType.DEVELOP_BASE_WP:
                ClientDesignComponentServices.addScenario(view, mode, parentItem, userContext.workPackageId);
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DEVELOP_UPDATE_WP:
                ClientDesignUpdateComponentServices.addScenario(view, mode, parentItem, userContext.workPackageId);
                break;
        }
    }

    // Render generic design component
    render() {

        const {currentItem, updateItem, wpItem, uiItemId, uiParentId, displayContext, isDragDropHovering, mode, view, userContext,
            testSummary, testSummaryData, testDataFlag, currentViewDataValue, updateScopeItems, updateScopeFlag,
            workPackageScopeItems, workPackageScopeFlag, domainTermsVisible, includeNarratives} = this.props;

        let uiContextName = uiItemId;

         // To get a guaranteed unique context, design sections and feature aspects must say who their parent is
        switch(currentItem.componentType){

            case ComponentType.DESIGN_SECTION:
            case ComponentType.FEATURE_ASPECT:
                uiContextName = uiParentId + '_' + uiItemId;
                break;
        }

        //console.log("Render " + currentItem.componentType + "  Design Component in context " + displayContext + " with current item " + currentItem.componentNameNew +  " and updateItem " + updateItem + " and wpItem " + wpItem + " and test Summary " + testSummary);

        let highlightStyle = (this.state.highlighted || isDragDropHovering) ? 'highlight' : '';

        // Active component?  For Design Versions and Design Updates it is if the current user component is the Current Item
        let itemStyle = (currentItem._id === userContext.designComponentId ? 'design-component dc-active' : 'design-component');

        // Define the Index Item HEADER: Editable and possibly draggable component -------------------------------------
        let headerHtml =
            <div id="componentHeader" className={highlightStyle}>
                <DesignComponentHeader
                    currentItem={currentItem}
                    updateItem={updateItem}
                    wpItem={wpItem}
                    uiContextName={uiContextName}
                    onToggleOpen={ () => this.toggleOpen()}
                    onSelectItem={ () => this.setNewDesignComponentActive(currentItem._id, userContext, displayContext)}
                    mode={mode}
                    view={view}
                    displayContext={displayContext}
                    userContext={userContext}
                    testSummary={testSummary}
                    testSummaryData={testSummaryData}
                    isOpen={this.state.open}
                    testDataFlag={testDataFlag}
                    updateScopeItems={updateScopeItems}
                    updateScopeFlag={updateScopeFlag}
                    workPackageScopeItems={workPackageScopeItems}
                    workPackageScopeFlag={workPackageScopeFlag}
                    domainTermsVisible={domainTermsVisible}

                    //currentViewDataValue={currentViewDataValue}
                />
            </div>;


        // Define the Index Item BODY: What is rendered depends on the component type ----------------------------------

        let bodyHtml = <div></div>;

        // Only render the body if the item is open
        if(this.state.open) {

            // Everything is in scope for editing unless its a design update item not in scope...
            let inScope = true;

            if ((displayContext === DisplayContext.UPDATE_EDIT && view === ViewType.DESIGN_UPDATE_EDIT) || (displayContext === DisplayContext.UPDATE_VIEW && view === ViewType.DESIGN_UPDATE_VIEW)) {
                // For a design update we can check if in scope
                inScope = (currentItem.scopeType === UpdateScopeType.SCOPE_IN_SCOPE);
            }

            // Determine the correct parent reference
            let parentRefId = currentItem.componentReferenceId;

            // Common components used:
            let designSectionsContainer =
                <DesignSectionsContainer params={{
                    designVersionId: userContext.designVersionId,
                    parentRefId: parentRefId,
                    displayContext: displayContext,
                    view: view,
                    updateId: userContext.designUpdateId,
                    workPackageId: userContext.workPackageId,
                    testSummary: this.props.testSummary
                }}/>;

            let featuresContainer =
                <FeaturesContainer params={{
                    designVersionId: userContext.designVersionId,
                    parentRefId: parentRefId,
                    displayContext: displayContext,
                    view: view,
                    updateId: userContext.designUpdateId,
                    workPackageId: userContext.workPackageId,
                    testSummary: testSummary
                }}/>;


            let currentItemText = currentItem.componentNameNew;

            // Narrative is an optional item...
            let narrative = <div></div>;

            if(includeNarratives === UserSettingValue.SETTING_INCLUDE){
                narrative =  <Narrative
                    designComponent={currentItem}
                    updateComponent={updateItem}
                    wpComponent={wpItem}
                    mode={mode}
                    displayContext={displayContext}
                    view={view}
                    testSummary={testSummary}
                    domainTermsVisible={domainTermsVisible}
                />;
            }


            let scenariosContainer =
                <ScenariosContainer params={{
                    designVersionId: userContext.designVersionId,
                    parentRefId: parentRefId,
                    displayContext: displayContext,
                    view: view,
                    updateId: userContext.designUpdateId,
                    workPackageId: userContext.workPackageId,
                    testSummary: testSummary
                }}/>;

            let featureAspectsContainer =
                <FeatureAspectsContainer params={{
                    designVersionId: userContext.designVersionId,
                    parentRefId: parentRefId,
                    displayContext: displayContext,
                    view: view,
                    updateId: userContext.designUpdateId,
                    workPackageId: userContext.workPackageId,
                    testSummary: testSummary
                }}/>;

            // Adding stuff is not allowed in these contexts


            let notEditable = (
                mode === ViewMode.MODE_VIEW ||
                displayContext === DisplayContext.UPDATE_SCOPE ||
                displayContext === DisplayContext.WORKING_VIEW ||
                displayContext === DisplayContext.BASE_VIEW ||
                displayContext === DisplayContext.WP_SCOPE ||
                displayContext === DisplayContext.WP_VIEW ||
                (displayContext === DisplayContext.DEV_DESIGN && currentItem.componentType === ComponentType.APPLICATION) ||
                (displayContext === DisplayContext.DEV_DESIGN && currentItem.componentType === ComponentType.DESIGN_SECTION) ||
                (updateItem && updateItem.scopeType === UpdateScopeType.SCOPE_PARENT_SCOPE) ||
                (updateItem && updateItem.scopeType === UpdateScopeType.SCOPE_PEER_SCOPE) ||
                (updateItem && updateItem.isRemoved)
            );

            let uiContextId1 = '';
            let uiContextId2 = '';

            switch (currentItem.componentType) {
                case ComponentType.APPLICATION:
                    // An application is the entire application and can contain design sections
                    if (notEditable) {
                        // VIEW or SCOPE
                        bodyHtml =
                            <div className="activeStyle">
                                <Panel className="panel-design" collapsible expanded={this.state.open}>
                                    {designSectionsContainer}
                                </Panel>
                            </div>
                    } else {
                        // EDIT mode
                        uiContextId1 = AddActionIds.UI_CONTEXT_ADD_DESIGN_SECTION_TO + uiItemId;

                        bodyHtml =
                            <div className="activeStyle">
                                <Panel className="panel-design" collapsible expanded={this.state.open}>
                                    {designSectionsContainer}
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td className="add-item-context-section">
                                                {currentItemText + ':'}
                                            </td>
                                            <td className="control-table-data-section">
                                                <div id={uiContextId1 + '_SHALLOW'}>
                                                    <DesignComponentAdd
                                                        uiContextId={uiContextId1}
                                                        addText="Add Design Section"
                                                        onClick={ () => this.addDesignSectionToApplication(view, mode, currentItem)}
                                                        toggleHighlight={ (value) => this.toggleHighlight(value)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </Panel>
                            </div>

                    }
                    break;
                case ComponentType.DESIGN_SECTION:
                    // A design section can have its own features or contain further design sections
                    //console.log("Rendering Design Section for " + currentItem._id);

                    if (notEditable) {
                        // VIEW MODE
                        // What is shown when it is opened up:
                        // - List of features in this section
                        // - List of sub sections in this section
                        bodyHtml =
                            <div className="activeStyle">
                                <Panel className="panel-design" collapsible expanded={this.state.open}>
                                    {featuresContainer}
                                    {designSectionsContainer}
                                </Panel>
                            </div>
                    } else {
                        // EDIT MODE
                        // What is shown when it is opened up:
                        // - List of features in this section
                        // - List of sub sections in this section
                        // - Add new Feature option
                        // - Add new Section option

                        uiContextId1 = AddActionIds.UI_CONTEXT_ADD_FEATURE_TO + uiParentId + '_' + uiItemId;
                        uiContextId2 = AddActionIds.UI_CONTEXT_ADD_DESIGN_SECTION_TO + uiParentId + '_' + uiItemId

                        bodyHtml =
                            <div className="activeStyle">
                                <Panel className="panel-design" collapsible expanded={this.state.open}>
                                    {featuresContainer}
                                    {designSectionsContainer}
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td className="add-item-context-section">
                                                {currentItemText + ':'}
                                            </td>
                                            <td className="control-table-data-feature">
                                                <div id={uiContextId1 + '_SHALLOW'}>
                                                    <DesignComponentAdd
                                                        uiContextId={uiContextId1}
                                                        addText='Add Feature'
                                                        onClick={ () => this.addFeatureToDesignSection(view, mode, currentItem)}
                                                        toggleHighlight={ (value) => this.toggleHighlight(value)}
                                                    />
                                                </div>
                                            </td>
                                            <td >
                                                <div id={uiContextId2 + '_SHALLOW'}>
                                                    <DesignComponentAdd
                                                        uiContextId={uiContextId2}
                                                        addText="Add Sub Section"
                                                        onClick={ () => this.addSectionToDesignSection(view, mode, currentItem)}
                                                        toggleHighlight={ (value) => this.toggleHighlight(value)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </Panel>
                            </div>
                    }
                    break;
                case ComponentType.FEATURE:
                    // A Feature has a narrative, can have Scenarios or be divided into Feature Aspects
                    // In a design update, only features in scope can have new scenarios added
                    if (notEditable || !inScope) {
                        // VIEW MODE
                        // What is shown when it is opened up
                        // - The narrative
                        // - List of Scenarios for this Feature
                        // - List of Feature Aspect headings for this Feature
                        bodyHtml =
                            <div className="activeStyle">
                                <Panel className="panel-design" collapsible expanded={this.state.open}>
                                    {narrative}
                                    {scenariosContainer}
                                    {featureAspectsContainer}
                                </Panel>
                            </div>
                    } else {
                        // EDIT MODE
                        // What is shown when it is opened up
                        // - The narrative
                        // - List of Scenarios for this Feature
                        // - List of Feature Aspect headings for this Feature
                        // - Add new Scenario option
                        // - Add new Feature Aspect option

                        uiContextId1 = AddActionIds.UI_CONTEXT_ADD_FEATURE_ASPECT_TO + uiItemId;

                        bodyHtml =
                            <div className="activeStyle">
                                <Panel className="panel-design" collapsible expanded={this.state.open}>
                                    {narrative}
                                    {scenariosContainer}
                                    {featureAspectsContainer}
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td className="add-item-context-section">
                                                {currentItemText + ':'}
                                            </td>
                                            <td className="control-table-data-feature-aspect">
                                                <div id={uiContextId1 + '_SHALLOW'}>
                                                    <DesignComponentAdd
                                                        uiContextId={uiContextId1}
                                                        addText="Add Feature Aspect"
                                                        onClick={ () => this.addFeatureAspectToFeature(view, mode, currentItem, userContext)}
                                                        toggleHighlight={ (value) => this.toggleHighlight(value)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </Panel>
                            </div>
                    }
                    break;
                case ComponentType.FEATURE_ASPECT:
                    // A feature aspect is a sub heading in a feature.  It contains Scenarios only
                    // In a design update, only features in scope can have new scenarios added
                    if (notEditable || !inScope) {
                        // VIEW MODE
                        // What is shown when it is opened up
                        // - A list of Scenarios
                        bodyHtml =
                            <div className="activeStyle">
                                <Panel className="panel-design" collapsible expanded={this.state.open}>
                                    {scenariosContainer}
                                </Panel>
                            </div>

                    } else {
                        // EDIT MODE
                        // What is shown when it is opened up
                        // - A list of Scenarios
                        // - Add new Scenario option

                        uiContextId1 = AddActionIds.UI_CONTEXT_ADD_SCENARIO_TO + uiParentId + '_' + uiItemId;

                        bodyHtml =
                            <div className="activeStyle">
                                <Panel className="panel-design" collapsible expanded={this.state.open}>
                                    {scenariosContainer}
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td className="control-table-data-scenario">
                                                <div id={uiContextId1 + '_SHALLOW'}>
                                                    <DesignComponentAdd
                                                        uiContextId={uiContextId1}
                                                        addText="Add Scenario"
                                                        onClick={ () => this.addScenario(view, mode, currentItem, userContext)}
                                                        toggleHighlight={ (value) => this.toggleHighlight(value)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </Panel>
                            </div>
                    }
                    break;
                case ComponentType.SCENARIO:
                    // No body for Scenarios.  Steps shown on right.
                    bodyHtml = <div></div>;
                    break;
                default:
                    //console.log("Unknown design component: " + currentItem.componentType);
            }
        }

        // Each component has a move target above it so we can reorder stuff...
        if(mode === ViewMode.MODE_VIEW){
            return (
                <div id="designComponent" className={itemStyle}>
                    {headerHtml}
                    {bodyHtml}
                </div>
            )
        } else {
            return (
                <div>
                    <MoveTarget
                        currentItem={currentItem}
                        displayContext={displayContext}
                        mode={mode}
                    />
                    <div id="designComponent" className={itemStyle}>
                        {headerHtml}
                        {bodyHtml}
                    </div>
                </div>
            )
        }
    }

}

DesignComponent.propTypes = {
    currentItem: PropTypes.object.isRequired,
    updateItem: PropTypes.object,
    wpItem: PropTypes.object,
    uiItemId: PropTypes.string,
    uiParentId: PropTypes.string,
    isDragDropHovering: PropTypes.bool.isRequired,
    displayContext: PropTypes.string.isRequired,
    testSummary: PropTypes.bool.isRequired,
    testSummaryData: PropTypes.object
};


// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        mode:                       state.currentViewMode,
        view:                       state.currentAppView,
        userContext:                state.currentUserItemContext,
        openDesignItems:            state.currentUserOpenDesignItems,
        openDesignUpdateItems:      state.currentUserOpenDesignUpdateItems,
        openWorkPackageItems:       state.currentUserOpenWorkPackageItems,
        testDataFlag:               state.testDataFlag,
        openItemsFlag:              state.openItemsFlag,
        updateScopeItems:           state.currentUpdateScopeItems,
        updateScopeFlag:            state.currentUpdateScopeFlag,
        workPackageScopeItems:      state.currentWorkPackageScopeItems,
        workPackageScopeFlag:       state.currentWorkPackageScopeFlag,
        domainTermsVisible:         state.domainTermsVisible,
        includeNarratives:          state.includeNarratives
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(DesignComponent);



