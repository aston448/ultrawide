// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';

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
import {ComponentType, ViewMode, ViewType, DisplayContext, LogLevel} from '../../../constants/constants.js';
import ClientDesignComponentServices from '../../../apiClient/apiClientDesignComponent.js';
import ClientDesignUpdateComponentServices from '../../../apiClient/apiClientDesignUpdateComponent.js';
import ClientWorkPackageComponentServices from '../../../apiClient/apiClientWorkPackageComponent.js';

import { log }              from '../../../common/utils.js';

// Bootstrap
import {Panel} from 'react-bootstrap';

// REDUX services
import store from '../../../redux/store'
import {setCurrentUserItemContext} from '../../../redux/actions';
import {connect} from 'react-redux';

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

        // Do refresh if this specific component is gaining or losing focus
        let currentItemId = this.props.currentItem._id;

        // But for WP need the Design Item Id
        if(this.props.displayContext === DisplayContext.WP_VIEW || this.props.displayContext === DisplayContext.WP_SCOPE || this.props.displayContext === DisplayContext.DEV_DESIGN){
            currentItemId = this.props.designItem._id;
        }

        if((nextProps.userContext.designComponentId === currentItemId) && (this.props.userContext.designComponentId != currentItemId)){
            return true;
        }

        if((nextProps.userContext.designComponentId != currentItemId) && (this.props.userContext.designComponentId === currentItemId)){
            return true;
        }

        // If this item has been opened or closed...
        if(nextProps.openItemsFlag.item === currentItemId){
            return true;
        }


        switch (nextProps.view) {
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
            case ViewType.DESIGN_UPDATABLE_VIEW:
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
                return !(
                    nextState.open === this.state.open &&
                    nextState.highlighted === this.state.highlighted &&
                    nextState.editable === this.state.editable &&
                    nextState.editorState === this.state.editorState &&
                    nextProps.testSummary === this.props.testSummary &&
                    nextProps.currentItem.componentName === this.props.currentItem.componentName &&
                    nextProps.currentItem.isRemovable === this.props.currentItem.isRemovable &&
                    nextProps.currentItem.componentParent === this.props.currentItem.componentParent &&
                    nextProps.currentItem.componentActive === this.props.currentItem.componentActive &&
                    nextProps.isDragDropHovering === this.props.isDragDropHovering &&
                    nextProps.mode === this.props.mode &&
                    nextProps.testDataFlag === this.props.testDataFlag //&&
                    //nextProps.openItemsFlag === this.props.openItemsFlag
                );
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                return !(
                    nextState.open === this.state.open &&
                    nextState.highlighted === this.state.highlighted &&
                    nextState.editable === this.state.editable &&
                    nextState.inScope === this.state.inScope &&
                    nextState.parentScope === this.state.parentScope &&
                    nextState.editorState === this.state.editorState &&
                    nextProps.testSummary === this.props.testSummary &&
                    nextProps.currentItem.componentNameNew === this.props.currentItem.componentNameNew &&
                    nextProps.currentItem.isRemovable === this.props.currentItem.isRemovable &&
                    nextProps.currentItem.isRemoved === this.props.currentItem.isRemoved &&
                    nextProps.currentItem.isInScope === this.props.currentItem.isInScope &&
                    nextProps.currentItem.isParentScope === this.props.currentItem.isParentScope &&
                    nextProps.currentItem.componentParent === this.props.currentItem.componentParent &&
                    nextProps.currentItem.componentActive === this.props.currentItem.componentActive &&
                    nextProps.isDragDropHovering === this.props.isDragDropHovering &&
                    nextProps.testDataFlag === this.props.testDataFlag &&
                    nextProps.mode === this.props.mode //&&
                    //nextProps.openItemsFlag === this.props.openItemsFlag
                );
                break;
            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:
                return !(
                    nextState.open === this.state.open &&
                    nextState.highlighted === this.state.highlighted &&
                    nextProps.designItem.isRemovable === this.props.designItem.isRemovable &&
                    nextProps.mode === this.props.mode &&
                    nextProps.testDataFlag === this.props.testDataFlag &&
                    nextProps.testSummary === this.props.testSummary //&&
                    //nextProps.openItemsFlag === this.props.openItemsFlag
                 );
        }

    }

    componentDidMount(){

        // If this is a new component just added, set it as open
        switch(this.props.displayContext){
            case DisplayContext.BASE_EDIT:
                if(this.props.currentItem.isNew){
                    console.log("Opening DV item on mount" + this.props.currentItem.componentName);
                    ClientDesignComponentServices.setOpenClosed(this.props.currentItem, this.props.openDesignItems, true);
                }
                break;
            case DisplayContext.UPDATE_EDIT:
                if(this.props.currentItem.isNew && !this.props.currentItem.isChanged){
                    console.log("Opening DU item on mount" + this.props.currentItem.componentNameNew);
                    ClientDesignUpdateComponentServices.setOpenClosed(this.props.currentItem, this.props.openDesignUpdateItems, true);
                }
                break;
        }

        // Set as open if open in REDUX state
        //console.log("Opening item on mount" + this.props.currentItem.componentNameNew);
        this.setOpenState(this.props);
    }

    componentWillReceiveProps(newProps){

        // Change open state if REDUX state has changed for this item
        if(newProps.openItemsFlag.flag != this.props.openItemsFlag.flag  || newProps.openItemsFlag.item === this.props.currentItem._id) {

            switch (newProps.view) {
                case ViewType.DESIGN_NEW_EDIT:
                case ViewType.DESIGN_PUBLISHED_VIEW:
                case ViewType.DESIGN_UPDATABLE_VIEW:

                    if (
                        (newProps.openDesignItems.includes(this.props.currentItem._id) && !(this.props.openDesignItems.includes(this.props.currentItem._id))) ||
                        (!(newProps.openDesignItems.includes(this.props.currentItem._id)) && this.props.openDesignItems.includes(this.props.currentItem._id)) ||
                        (newProps.openDesignItems.includes(this.props.currentItem._id) && !this.state.open) ||
                        (!(newProps.openDesignItems.includes(this.props.currentItem._id)) && this.state.open)
                    ) {
                        this.setOpenState(newProps);
                    }
                    break;
                case ViewType.DESIGN_UPDATE_EDIT:
                case ViewType.DESIGN_UPDATE_VIEW:
                    if (
                        (newProps.openDesignUpdateItems.includes(this.props.currentItem._id) && !(this.props.openDesignUpdateItems.includes(this.props.currentItem._id))) ||
                        (!(newProps.openDesignUpdateItems.includes(this.props.currentItem._id)) && this.props.openDesignUpdateItems.includes(this.props.currentItem._id)) ||
                        (newProps.openDesignUpdateItems.includes(this.props.currentItem._id) && !this.state.open) ||
                        (!(newProps.openDesignUpdateItems.includes(this.props.currentItem._id)) && this.state.open)
                    ) {
                        this.setOpenState(newProps);
                    }
                    break;
                case ViewType.WORK_PACKAGE_BASE_EDIT:
                case ViewType.WORK_PACKAGE_BASE_VIEW:
                case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                case ViewType.DEVELOP_BASE_WP:
                case ViewType.DEVELOP_UPDATE_WP:
                    if (
                        (newProps.openWorkPackageItems.includes(this.props.currentItem._id) && !(this.props.openWorkPackageItems.includes(this.props.currentItem._id))) ||
                        (!(newProps.openWorkPackageItems.includes(this.props.currentItem._id)) && this.props.openWorkPackageItems.includes(this.props.currentItem._id)) ||
                        (newProps.openWorkPackageItems.includes(this.props.currentItem._id) && !this.state.open) ||
                        (!(newProps.openWorkPackageItems.includes(this.props.currentItem._id)) && this.state.open)
                    ) {
                        this.setOpenState(newProps);
                    }
                    break;
            }
        }
    }

    setOpenState(props){
        const openUpdateItems = store.getState().currentUserOpenDesignUpdateItems;
        switch(props.view){
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
            case ViewType.DESIGN_UPDATABLE_VIEW:
                this.setState({open: props.openDesignItems.includes(props.currentItem._id)});
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
                this.setState({open: openUpdateItems.includes(props.currentItem._id)});
                break;
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:
                this.setState({open: props.openWorkPackageItems.includes(props.currentItem._id)});
                break;
        }
    }

    toggleHighlight(value){
        this.setState({highlighted: value})
    }

    // Design component open or closed (i.e. is body of it visible)
    toggleOpen(){



        // Store for persistence
        switch(this.props.view){
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
            case ViewType.DESIGN_UPDATABLE_VIEW:

                ClientDesignComponentServices.setOpenClosed(this.props.currentItem, this.props.openDesignItems, !this.state.open);
                break;

            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:

                ClientDesignUpdateComponentServices.setOpenClosed(this.props.currentItem, this.props.openDesignUpdateItems, !this.state.open);
                break;

            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:

                ClientWorkPackageComponentServices.setOpenClosed(this.props.currentItem, this.props.openWorkPackageItems, !this.state.open);
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
            case ViewType.DESIGN_NEW_EDIT:
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
            case ViewType.DESIGN_NEW_EDIT:
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
            case ViewType.DESIGN_NEW_EDIT:
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
    addFeatureAspectToFeature(view, mode, featureItem){

        switch(view){
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DEVELOP_BASE_WP:
                ClientDesignComponentServices.addFeatureAspectToFeature(view, mode, featureItem);
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
                ClientDesignUpdateComponentServices.addFeatureAspectToFeature(view, mode, featureItem);
                break;
        }
    }

    // Add a new scenario to this component (Feature or Feature Aspect)
    addScenario(view, mode, parentItem){

        switch(this.props.view){
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DEVELOP_BASE_WP:
                ClientDesignComponentServices.addScenario(view, mode, parentItem);
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
                ClientDesignUpdateComponentServices.addScenario(view, mode, parentItem);
                break;
            case ViewType.DEVELOP_UPDATE_WP:
                // TODO
                break;
        }
    }

    // Render generic design component
    render() {

        const {currentItem, designItem, updateItem, displayContext, isDragDropHovering, mode, view, userContext, testSummary, testSummaryData, testDataFlag, currentViewDataValue} = this.props;

        let highlightStyle = (this.state.highlighted || isDragDropHovering) ? 'highlight' : '';

        // Active component?  For Design Versions and Design Updates it is if the current user component is the Current Item
        // For Work Packages it is if the current user component is the Design Item
        // Don't highlight if Test Summary being shown to avoid clutter
        let itemStyle = '';

        let workPackageItem = (displayContext === DisplayContext.WP_VIEW || displayContext === DisplayContext.WP_SCOPE || displayContext === DisplayContext.DEV_DESIGN);

        if(workPackageItem){
            itemStyle = (designItem._id === userContext.designComponentId ? 'design-component dc-active' : 'design-component');
        } else {
            itemStyle = (currentItem._id === userContext.designComponentId ? 'design-component dc-active' : 'design-component');
        }

        // For work packages make sure the active component refers to the actual design component
        let activeComponentId = workPackageItem ? designItem._id : currentItem._id;

        // Define the Index Item HEADER: Editable and possibly draggable component -------------------------------------
        let headerHtml =
            <div id="componentHeader" className={highlightStyle}>
                <DesignComponentHeader
                    currentItem={currentItem}
                    designItem={designItem}
                    updateItem={updateItem}
                    onToggleOpen={ () => this.toggleOpen()}
                    onSelectItem={ () => this.setNewDesignComponentActive(activeComponentId, userContext, displayContext)}
                    mode={mode}
                    view={view}
                    displayContext={displayContext}
                    userContext={userContext}
                    testSummary={testSummary}
                    testSummaryData={testSummaryData}
                    isOpen={this.state.open}
                    testDataFlag={testDataFlag}
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
                inScope = currentItem.isInScope;
            }

            // Determine the correct parent id
            let parentId = null;

            switch (view) {
                case ViewType.WORK_PACKAGE_BASE_EDIT:
                case ViewType.WORK_PACKAGE_BASE_VIEW:
                case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                case ViewType.DEVELOP_BASE_WP:
                case ViewType.DEVELOP_UPDATE_WP:
                    // Parent Id is the Ref Id for a WP editor item
                    parentId = currentItem.componentReferenceId;
                    break;
                default:
                    // In all other cases it is the actual ID
                    parentId = currentItem._id;
            }

            // Common components used:
            let designSectionsContainer =
                <DesignSectionsContainer params={{
                    designVersionId: userContext.designVersionId,
                    parentId: parentId,
                    displayContext: displayContext,
                    view: view,
                    updateId: userContext.designUpdateId,
                    workPackageId: userContext.workPackageId
                }}/>;

            let featuresContainer =
                <FeaturesContainer params={{
                    designVersionId: userContext.designVersionId,
                    parentId: parentId,
                    displayContext: displayContext,
                    view: view,
                    updateId: userContext.designUpdateId,
                    workPackageId: userContext.workPackageId
                }}/>;


            // Use the original design item for narrative data in Work Package editing
            let narrativeItem = workPackageItem ? designItem : currentItem;

            let currentItemText = '';
            if(userContext.designUpdateId === 'NONE'){
                currentItemText = currentItem.componentName;
            } else {
                currentItemText = currentItem.componentNameNew;
            }

            let narrative =
                <Narrative
                    designComponent={narrativeItem}
                    wpComponent={currentItem}
                    mode={mode}
                    displayContext={displayContext}
                    view={view}
                    testSummary={testSummary}
                />;

            let scenariosContainer =
                <ScenariosContainer params={{
                    designVersionId: userContext.designVersionId,
                    parentId: parentId,
                    displayContext: displayContext,
                    view: view,
                    updateId: userContext.designUpdateId,
                    workPackageId: userContext.workPackageId
                }}/>;

            let featureAspectsContainer =
                <FeatureAspectsContainer params={{
                    designVersionId: userContext.designVersionId,
                    parentId: parentId,
                    displayContext: displayContext,
                    view: view,
                    updateId: userContext.designUpdateId,
                    workPackageId: userContext.workPackageId
                }}/>;

            // Adding stuff is not allowed in these contexts
            let notEditable = (
                mode === ViewMode.MODE_VIEW ||
                displayContext === DisplayContext.UPDATE_SCOPE ||
                displayContext === DisplayContext.BASE_VIEW ||
                displayContext === DisplayContext.WP_SCOPE ||
                displayContext === DisplayContext.WP_VIEW ||
                (displayContext === DisplayContext.DEV_DESIGN && designItem.componentType === ComponentType.APPLICATION) ||
                (displayContext === DisplayContext.DEV_DESIGN && designItem.componentType === ComponentType.DESIGN_SECTION)
            );

            switch (currentItem.componentType) {
                case ComponentType.APPLICATION:
                    // An application is the entire application and can contain design sections
                    if (notEditable) {
                        // VIEW or SCOPE
                        bodyHtml =
                            <div className="activeStyle">
                                <Panel collapsible expanded={this.state.open}>
                                    {designSectionsContainer}
                                </Panel>
                            </div>
                    } else {
                        // EDIT mode
                        bodyHtml =
                            <div className="activeStyle">
                                <Panel collapsible expanded={this.state.open}>
                                    {designSectionsContainer}
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td className="add-item-context-section">
                                                {currentItemText + ':'}
                                            </td>
                                            <td id="addDesignSectionToApp" className="control-table-data-section">
                                                <DesignComponentAdd
                                                    addText="Add Design Section"
                                                    onClick={ () => this.addDesignSectionToApplication(view, mode, designItem)}
                                                    toggleHighlight={ (value) => this.toggleHighlight(value)}
                                                />
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
                                <Panel collapsible expanded={this.state.open}>
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
                        bodyHtml =
                            <div className="activeStyle">
                                <Panel collapsible expanded={this.state.open}>
                                    {featuresContainer}
                                    {designSectionsContainer}
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td className="add-item-context-section">
                                                {currentItemText + ':'}
                                            </td>
                                            <td id="addFeature" className="control-table-data-feature">
                                                <DesignComponentAdd
                                                    addText='Add Feature'
                                                    onClick={ () => this.addFeatureToDesignSection(view, mode, designItem)}
                                                    toggleHighlight={ (value) => this.toggleHighlight(value)}
                                                />
                                            </td>
                                            <td id="addDesignSectionToDesignSection">
                                                <DesignComponentAdd
                                                    addText="Add sub section"
                                                    onClick={ () => this.addSectionToDesignSection(view, mode, designItem)}
                                                    toggleHighlight={ (value) => this.toggleHighlight(value)}
                                                />
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
                                <Panel collapsible expanded={this.state.open}>
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
                        bodyHtml =
                            <div className="activeStyle">
                                <Panel collapsible expanded={this.state.open}>
                                    {narrative}
                                    {scenariosContainer}
                                    {featureAspectsContainer}
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td className="add-item-context-section">
                                                {currentItemText + ':'}
                                            </td>
                                            <td id="addFeatureAspect" className="control-table-data-feature-aspect">
                                                <DesignComponentAdd
                                                    addText="Add feature aspect"
                                                    onClick={ () => this.addFeatureAspectToFeature(view, mode, designItem)}
                                                    toggleHighlight={ (value) => this.toggleHighlight(value)}
                                                />
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
                                <Panel collapsible expanded={this.state.open}>
                                    {scenariosContainer}
                                </Panel>
                            </div>

                    } else {
                        // EDIT MODE
                        // What is shown when it is opened up
                        // - A list of Scenarios
                        // - Add new Scenario option
                        bodyHtml =
                            <div className="activeStyle">
                                <Panel collapsible expanded={this.state.open}>
                                    {scenariosContainer}
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td id="addScenario" className="control-table-data-scenario">
                                                <DesignComponentAdd
                                                    addText="Add scenario"
                                                    onClick={ () => this.addScenario(view, mode, designItem)}
                                                    toggleHighlight={ (value) => this.toggleHighlight(value)}
                                                />
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
        return(
            <div id="designComponent" className={itemStyle}>
                <MoveTarget
                    currentItem={currentItem}
                    displayContext={displayContext}
                    mode={mode}
                />
                {headerHtml}
                {bodyHtml}
            </div>
        )
    }

}

DesignComponent.propTypes = {
    currentItem: PropTypes.object.isRequired,
    designItem: PropTypes.object.isRequired,
    updateItem: PropTypes.object,
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
        openItemsFlag:              state.openItemsFlag
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(DesignComponent);



