// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components
import TestSummary          from '../summary/TestSummary.jsx';
import FeatureTestSummary   from '../summary/FeatureTestSummary.jsx';

// Ultrawide Services
import ClientDesignComponentServices        from '../../../apiClient/apiClientDesignComponent.js';
import ClientDesignUpdateComponentServices  from '../../../apiClient/apiClientDesignUpdateComponent.js';
import ClientWorkPackageComponentServices   from '../../../apiClient/apiClientWorkPackageComponent.js';
import ClientDomainDictionaryServices       from '../../../apiClient/apiClientDomainDictionary.js';
import ClientTextEditorServices             from '../../../apiClient/apiClientTextEditor.js';
import ComponentUiModules                   from '../../../ui_modules/design_component.js'

import {ViewType, ComponentType, ViewMode, DisplayContext, WorkPackageType, WorkPackageScopeType, LogLevel,
    MashTestStatus, FeatureTestSummaryStatus, UpdateMergeStatus, UpdateScopeType} from '../../../constants/constants.js';
import {DefaultComponentNames}          from '../../../constants/default_names.js';
import {getComponentClass, replaceAll, log}         from '../../../common/utils.js';
import TextLookups                      from '../../../common/lookups.js'

// Bootstrap
import {InputGroup} from 'react-bootstrap';
import {Glyphicon}  from 'react-bootstrap';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services

// React DnD - Component is draggable
import { DragSource } from 'react-dnd';

// Draft JS - Name is text editable
import {Editor, EditorState, ContentState, RichUtils, DefaultDraftBlockRenderMap, convertFromRaw, convertToRaw, getDefaultKeyBinding, KeyBindingUtil, CompositeDecorator} from 'draft-js';
const {hasCommandModifier} = KeyBindingUtil;

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Component Header Component - Represents the editable header of a design component that is its name
//
// ---------------------------------------------------------------------------------------------------------------------

// -- DECORATOR CODE ---------------------------------------------------------------------------------------------------

const styles = {
    domainTerm: {
        color: 'rgba(96, 96, 255, 1.0)',
        //backgroundColor: 'rgba(240, 255, 240, 1.0)',
        fontWeight: 300,
        //textDecoration: 'underline'
    }
};

const DomainSpan = (props) => {
    const {properties} = props;
    return <span {...properties} style={styles.domainTerm}>{props.children}</span>;  //
};

// -- DECORATOR CODE ---------------------------------------------------------------------------------------------------

export class DesignComponentHeader extends Component{

    constructor(...args){
        super(...args);

        this.state = {
            inScope: false,
            parentScope: false,
            scopeChange: false,
            editing: false,
            highlighted: false,
            name: '',
            editorState: EditorState.createEmpty(),
            progressData: {
                featureCount:       0,
                scenarioCount:      0,
                passingTestsCount:  0,
                failingTestsCount:  0
            }
        };

        this.onTitleChange = (editorState) => this.setState({editorState});
        this.handleTitleKeyCommand = this.handleTitleKeyCommand.bind(this);
        this.focus = () => {if(this.refs.editor){this.refs.editor.focus()}};

        this.updateComponentEditorText(this.props);

    }

    shouldComponentUpdate(nextProps, nextState){

        // Optimisation.  No need to re-render this component if no change to what is seen
        return ComponentUiModules.componentHeaderShouldUpdate(this.props, nextProps, this.state, nextState);

    }

    // Set up the view from persisted settings
    componentDidMount(){

        switch(this.props.displayContext){
            case DisplayContext.WP_SCOPE:
                // Need to get from WP scope for current item
                this.setState({inScope: this.props.currentItem.scopeType !== WorkPackageScopeType.SCOPE_NONE});
                this.setState({parentScope: this.props.currentItem.scopeType === WorkPackageScopeType.SCOPE_PARENT});
                break;
            case DisplayContext.UPDATE_SCOPE:
                // if(this.props.updateItem){
                //     if(this.props.updateItem.isScopable) {
                //         this.setState({inScope: true});
                //     } else {
                //         this.setState({parentScope: true});
                //     }
                // }
                break;
            case DisplayContext.UPDATE_EDIT:
                break;
        }

        // New untouched items are editable by default as they need to be changed
        switch (this.props.view) {
            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DEVELOP_UPDATE_WP:

                // A new component not yet changed is automatically editable
                if(this.props.mode === ViewMode.MODE_EDIT) {
                    const item = this.props.currentItem;
                    if (item.componentType === ComponentType.APPLICATION && item.componentNameNew === DefaultComponentNames.NEW_APPLICATION_NAME) {
                        this.editComponentName();
                    }
                    if (item.componentType === ComponentType.DESIGN_SECTION && item.componentNameNew === DefaultComponentNames.NEW_DESIGN_SECTION_NAME) {
                        this.editComponentName();
                    }
                    if (item.componentType === ComponentType.FEATURE && item.componentNameNew === DefaultComponentNames.NEW_FEATURE_NAME) {
                        this.editComponentName();
                    }
                    if (item.componentType === ComponentType.SCENARIO && item.componentNameNew === DefaultComponentNames.NEW_SCENARIO_NAME) {
                        this.editComponentName();
                    }
                }

                break;
        }
    }

    // If the name of an item has been updated it could be in another view of it so we need to update the local editor
    componentWillReceiveProps(newProps){

        // If Domain Text highlighting has changed redraw the text for non-scope items
        if(
            (this.props.displayContext !== DisplayContext.UPDATE_SCOPE) &&
            (this.props.displayContext !== DisplayContext.WP_SCOPE) &&
            (newProps.domainTermsVisible !== this.props.domainTermsVisible)
        ){
            this.updateComponentEditorText(newProps, newProps.currentItem.componentNameRawNew)
        }

        switch (newProps.view) {
            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
            case ViewType.DESIGN_UPDATABLE:
                if (newProps.currentItem.componentNameNew !== this.props.currentItem.componentNameNew) {
                    this.updateComponentEditorText(newProps, newProps.currentItem.componentNameRawNew);
                }

                // if(newProps.currentProgressDataValue != this.props.currentProgressDataValue) {
                //     this.getProgressData(newProps.currentItem, newProps.userContext, newProps.view);
                // }

                break;

            case ViewType.DESIGN_UPDATE_EDIT:
                if(this.props.displayContext === DisplayContext.UPDATE_SCOPE){
                    // Base view.  Should not be updating
                    // if (newProps.currentItem.componentNameNew !== this.props.currentItem.componentNameNew) {
                    //     this.updateComponentEditorText(newProps, newProps.currentItem.componentNameRawNew);
                    // }

                    // // Reflect any changes in scope
                    // this.setState({inScope: (newProps.updateItem !== null)});

                } else {
                    // For updates we use the new name.  Also update if scope changes so decoration is redone.
                    if(
                        newProps.currentItem.componentNameNew !== this.props.currentItem.componentNameNew ||
                        newProps.currentItem.scopeType !== this.props.currentItem.scopeType
                    ){
                        this.updateComponentEditorText(newProps, newProps.currentItem.componentNameRawNew);
                    }


                    //this.setState({parentScope: newProps.currentItem.isParentScope});

                }
                break;

            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
                if(this.props.displayContext === DisplayContext.WP_SCOPE){
                    this.setState({inScope: newProps.currentItem.scopeType !== WorkPackageScopeType.SCOPE_NONE});
                }
                this.updateComponentEditorText(newProps, newProps.currentItem.componentNameRawNew);
                break;

            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                if(newProps.displayContext === DisplayContext.WP_SCOPE){
                    this.setState({inScope: newProps.currentItem.scopeType !== WorkPackageScopeType.SCOPE_NONE});
                }
                this.updateComponentEditorText(newProps, newProps.currentItem.componentNameRawNew);
                break;
            case ViewType.DEVELOP_BASE_WP:
                this.updateComponentEditorText(newProps, newProps.currentItem.componentNameRawNew);
                break;
            case ViewType.DEVELOP_UPDATE_WP:
                this.updateComponentEditorText(newProps, newProps.currentItem.componentNameRawNew);
                break;

        }
    }



    getNewAndOldRawText(newText, oldText){
        return ClientDesignComponentServices.getNewAndOldRawText(newText, oldText);
    }

    // Refresh the component name text
    updateComponentEditorText(props, newRawText){

        // Don't call this if unit testing this component as it will set the state to NULL
        if(!Meteor.isTest) {
            this.state = ComponentUiModules.setComponentNameEditorText(this.state, props, newRawText);
        }

    }

    // Handles keyboard actions when component name editable
    keyBindings(e){

        // ENTER = SAVE
        if (e.keyCode === 13 /* `Enter` key */) {
            return 'editor-save';
        }

        // Also Allow Ctrl + S as Save
        if (e.keyCode === 83 /* `S` key */ && hasCommandModifier(e)) {
            return 'editor-save';
        }

        // Also Allow Ctrl + E as Edit
        if (e.keyCode === 69 /* `E` key */ && hasCommandModifier(e)) {
            return 'editor-edit';
        }

        return getDefaultKeyBinding(e);
    }

    handleTitleKeyCommand(command) {

        // Handle custom commands
        if(command === 'editor-save'){
            // Save the title on ENTER
            this.saveComponentName(this.props.view, this.props.mode);
            return true;
        }

        if(command === 'editor-edit'){
            // Go into Edit mode on cmd-E
            if(this.state.editing === false) {
                this.editComponentName();
            }
            return true;
        }

        // Default key commands
        const newState = RichUtils.handleKeyCommand(this.state.editorState, command);

        if (newState) {
            this.onTitleChange(newState);
            return true;
        }
        return false;
    }

    // Pass back an instruction to open up the design component
    toggleOpen(){
        if (typeof this.props.onToggleOpen === 'function') {
            this.props.onToggleOpen();
        }
        //this.setCurrentComponent();
    }

    // Start editing the component name
    editComponentName(){
        this.setCurrentComponent();

        log((msg) => console.log(msg), LogLevel.TRACE, "EDIT COMPONENT NAME");
        this.setState({editing: true});
    }

    // Cancel editing the component name
    undoComponentNameChange(){

        // Reset the text in case changed on screen
        this.updateComponentEditorText(this.props);
        this.setState({editing: false});
    }

    // Set and persist the currently selected design component
    setCurrentComponent(){
        // Pass back to the main component for action...
        if (typeof this.props.onSelectItem === 'function') {
            this.props.onSelectItem();
        }
    }

    // Save changes to the design component name
    saveComponentName(view, mode){

        let plainText = this.state.editorState.getCurrentContent().getPlainText();
        let rawText = convertToRaw(this.state.editorState.getCurrentContent());

        let item = this.props.currentItem;

        let result = {};

        // What is saved depends on the context
        switch (view){
            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
            case ViewType.DEVELOP_BASE_WP:
                // Updates to the base design
                result = ClientDesignComponentServices.updateComponentName(view, mode, item._id, plainText, rawText);
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DEVELOP_UPDATE_WP:
                // Updates to a design update
                //console.log("Updating component name to " + plainText);
                result = ClientDesignUpdateComponentServices.updateComponentName(view, mode, item, plainText, rawText);
                break;
        }

        if(result.success){
            // Finished editing
            this.setState({editing: false});
            this.setCurrentComponent();
        }

    }

    // Remove this component from the design.  Only possible if has no children...
    deleteRestoreComponent(view, mode, item, userContext){

        switch(view){
            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
            case ViewType.DEVELOP_BASE_WP:
                ClientDesignComponentServices.removeDesignComponent(view, mode, item, userContext);
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
                if(item.isRemoved){
                    // Restore!
                    ClientDesignUpdateComponentServices.restoreComponent(view, mode, item);
                } else {
                    // Logicaly delete
                    ClientDesignUpdateComponentServices.removeComponent(view, mode, item);
                }
                break;
            case ViewType.DEVELOP_UPDATE_WP:
                ClientDesignUpdateComponentServices.removeComponent(view, mode, item);
                break;
        }

    };

    // In scope view only, sets an item as in or out of scope for a Design Update or Work Package
    toggleScope(view, mode, displayContext, userContext, currentItem, updateItem, newScope){

        //TODO: warning box if descoping changed item - do you want to revert to base view?

        let oldScope = this.state.inScope;
        //let newScope = !this.state.inScope;

        switch(view){
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:

                // Update the WP component(s)
                const wpResult = ClientWorkPackageComponentServices.toggleInScope(view, displayContext, userContext, currentItem._id, newScope);

                break;
            case ViewType.DESIGN_UPDATE_EDIT:

                // Update the Design Update component
                const duResult = ClientDesignUpdateComponentServices.toggleInScope(view, mode, displayContext, currentItem, userContext.designUpdateId, updateItem, newScope);

                if(duResult.success){
                    this.setState({scopeChange: !this.state.scopeChange});
                }
        }

    };

    onGotoWorkPackage(workPackageId) {

        if(workPackageId !== 'NONE'){

            ClientDesignComponentServices.gotoWorkPackage(workPackageId);
        }
    };




    // Render the header of the design component - has tools in it depending on context
    render() {
        const {currentItem, updateItem, wpItem, uiContextName, displayContext, connectDragSource, connectDragPreview, isDragging, view, mode, userContext, testSummary, testSummaryData, isOpen} = this.props;

        //console.log("Render Design Component Header for " + currentItem.componentNameNew + " in context " + displayContext + " with test summary " + testSummary + " and test summary data " + testSummaryData);

        // Determine the look of the item ------------------------------------------------------------------------------

        // Delete item greyed out if not removable but not if logically deleted in update  || (currentItem.isRemoved && view === ViewType.EDIT_UPDATE)
        let deleteStyle = currentItem.isRemovable ? 'red' : 'lgrey';


        // For Work Packages only stuff added in WP is removable
        if (view === ViewType.DEVELOP_BASE_WP || view === ViewType.DEVELOP_UPDATE_WP) {
            deleteStyle = currentItem.isRemovable && (currentItem.isDevAdded || currentItem.isDevUpdated) ? 'red' : 'lgrey';
        }

        let inScope = false;
        let inParentScope = false;
        let inScopeElsewhere = false;
        let updateParentOnly = false;
        let nextScope = false;
        let isDeleted = false;
        let deleteGlyph = 'remove'; // Normal glyph for delete button

        // Deleted Items for DU Edit ----------------------------------

        if (view === ViewType.DESIGN_UPDATE_EDIT) {

            switch (displayContext) {
                case DisplayContext.UPDATE_SCOPE:

                    // Show as deleted if possible due to updates of the current version
                    if (updateItem) {
                        isDeleted = updateItem.isRemoved;
                    } else {
                        isDeleted = currentItem.updateMergeStatus === UpdateMergeStatus.COMPONENT_REMOVED;
                    }
                    break;

                case DisplayContext.UPDATE_EDIT:

                    if (updateItem) {
                        isDeleted = updateItem.isRemoved;
                    }

                    // For logically deleted items in the same update, show the undo icon...
                    if (isDeleted) {
                        deleteGlyph = 'arrow-left';
                    } else {
                        deleteStyle = (currentItem.isRemovable && !currentItem.isRemovedElsewhere) ? 'red' : 'lgrey';
                    }
            }
        }

        // Scope status ------------------------------------------

        switch (displayContext) {
            case DisplayContext.UPDATE_SCOPE:
                if (updateItem) {
                    inScope = (updateItem.scopeType === UpdateScopeType.SCOPE_IN_SCOPE);
                    inParentScope = (updateItem.scopeType === UpdateScopeType.SCOPE_PARENT_SCOPE);
                } else {
                    // If not in this update indicate if another update is known to have modified it
                    if (!(currentItem.updateMergeStatus === UpdateMergeStatus.COMPONENT_BASE || currentItem.updateMergeStatus === UpdateMergeStatus.COMPONENT_BASE_PARENT)) {
                        inScopeElsewhere = true;
                    }
                }

                nextScope = !inScope;

                break;

            case DisplayContext.UPDATE_EDIT:
            case DisplayContext.UPDATE_VIEW:
                if (updateItem) {
                    inScope = (updateItem.scopeType === UpdateScopeType.SCOPE_IN_SCOPE);
                    inParentScope = (updateItem.scopeType === UpdateScopeType.SCOPE_PARENT_SCOPE);
                }
                break;

            case DisplayContext.WP_SCOPE:
                if (wpItem) {
                    inScope = (wpItem.scopeType === WorkPackageScopeType.SCOPE_ACTIVE);
                    inParentScope = (wpItem.scopeType === WorkPackageScopeType.SCOPE_PARENT);
                }

                if ((currentItem.workPackageId !== 'NONE') && (currentItem.workPackageId !== userContext.workPackageId)) {
                    // Scenario is in scope in another WP
                    inScopeElsewhere = true;
                }

                // if(view === ViewType.WORK_PACKAGE_UPDATE_EDIT) {
                //     if (updateItem && updateItem.scopeType !== UpdateScopeType.SCOPE_IN_SCOPE) {
                //         // We don't want to allow scoping of items that are not actually in scope in the update (i.e. parent items)
                //         updateParentOnly = true;
                //     }
                // }

                nextScope = !inScope;
                break;

            case DisplayContext.WP_VIEW:
                if (wpItem) {
                    inScope = (wpItem.scopeType === WorkPackageScopeType.SCOPE_ACTIVE);
                    inParentScope = (wpItem.scopeType === WorkPackageScopeType.SCOPE_PARENT);
                }
                break;

            case DisplayContext.DEV_DESIGN:
                // Work package implementation
                if (updateItem) {
                    // Must be an update WP
                    inScope = (updateItem.scopeType === UpdateScopeType.SCOPE_IN_SCOPE);
                    inParentScope = (updateItem.scopeType === UpdateScopeType.SCOPE_PARENT_SCOPE);
                } else {
                    // Go with the WP scoping
                    if (wpItem) {
                        inScope = (wpItem.scopeType === WorkPackageScopeType.SCOPE_ACTIVE);
                        inParentScope = (wpItem.scopeType === WorkPackageScopeType.SCOPE_PARENT);
                    }
                }
        }

        // Determine how the check box is shown
        let scopeStatus = 'out-scope';

        if (inScope) {
            scopeStatus = 'in-scope';
        }
        if (inParentScope) {
            scopeStatus = 'in-parent-scope';
        }
        if (inScopeElsewhere || updateParentOnly) {
            scopeStatus = 'not-scopable';
        }

        // Item main style ------------------------------------------
        let itemStyle = getComponentClass(currentItem, updateItem, wpItem, view, displayContext, false);


        // Grey out original item when it is being dragged ----------
        if (isDragging) {
            itemStyle = itemStyle + ' dragging-item';
        }

        if (!this.state.editing && currentItem.componentType === ComponentType.SCENARIO){
            itemStyle = itemStyle + ' scenario-background';
        }

        // Open / Closed --------------------------------------------
        let openGlyph = isOpen ? 'minus' : 'plus';

        let openStatus = isOpen ? 'open-status-open' : 'open-status-closed';
        if (currentItem.componentType === ComponentType.SCENARIO) {
            openStatus = 'invisible';
        }
        if (updateItem && updateItem.scopeType === UpdateScopeType.SCOPE_PEER_SCOPE && displayContext === DisplayContext.UPDATE_EDIT) {
            openStatus = 'invisible';
        }

        // Indent ---------------------------------------------------
        let itemIndent = 'item-indent-none';

        switch (currentItem.componentType) {
            case ComponentType.DESIGN_SECTION:
                itemIndent = 'item-indent-section';
                break;
            case ComponentType.FEATURE:
                itemIndent = 'item-indent-feature';
                break;
            case ComponentType.FEATURE_ASPECT:
                itemIndent = 'item-indent-feature-aspect';
                break;
            case ComponentType.SCENARIO:
                itemIndent = 'item-indent-scenario';
                break;
        }

        let updateStatusClass = '';
        let updateStatusText = '';
        let updateStatusGlyph = '';
        let updateTextClass = '';
        let wpStatusClass = 'update-merge-status invisible';
        let wpStatusGlyph = 'tasks';

        if (currentItem.updateMergeStatus) {
            updateStatusClass = 'update-merge-status ' + currentItem.updateMergeStatus;
            updateStatusText = TextLookups.updateMergeStatus(currentItem.updateMergeStatus);
        }
        updateStatusGlyph = 'th-large';

        switch (displayContext) {
            case DisplayContext.WORKING_VIEW:
                // Get status for working views - display as a tooltip over the status icon

                switch (currentItem.updateMergeStatus) {
                    case UpdateMergeStatus.COMPONENT_REMOVED:
                        updateStatusGlyph = 'trash';
                        break;
                    case UpdateMergeStatus.COMPONENT_ADDED:
                        updateStatusGlyph = 'plus-sign';
                        break;
                    case UpdateMergeStatus.COMPONENT_MODIFIED:
                        updateStatusGlyph = 'adjust';
                        break;
                    case UpdateMergeStatus.COMPONENT_BASE_PARENT:
                        // Set a flag if changed items below
                        updateStatusGlyph = 'flag';
                        break;
                    case UpdateMergeStatus.COMPONENT_SCENARIO_QUERIED:
                        updateStatusGlyph = 'question-sign';
                        break;
                }

                if (currentItem.updateMergeStatus === UpdateMergeStatus.COMPONENT_REMOVED) {
                    updateTextClass = ' removed-item';
                }

                // Mark Scenarios that are in a Work Package
                if (currentItem.workPackageId !== 'NONE') {
                    wpStatusClass = 'update-merge-status item-in-wp';
                }

                break;

            case DisplayContext.UPDATE_VIEW:
            case DisplayContext.UPDATE_EDIT:
            case DisplayContext.WP_VIEW:
            case DisplayContext.DEV_DESIGN:

                // Set status tags in Design Update itself
                updateStatusClass = 'update-merge-status component-hidden';

                if (updateItem) {

                    // Mark Scenarios that are in a Work Package - show on an update view
                    if (updateItem.workPackageId !== 'NONE') {
                        wpStatusClass = 'update-merge-status item-in-wp';
                    }

                    if (updateItem.componentType === ComponentType.SCENARIO && updateItem.scopeType === UpdateScopeType.SCOPE_IN_SCOPE) {
                        // Just in scope its a query
                        updateStatusGlyph = 'question-sign';
                        updateStatusClass = 'update-merge-status component-scenario-queried';
                        updateStatusText = "Check Tests";
                    }
                    // Override for other statuses
                    if (updateItem.isChanged) {
                        updateStatusGlyph = 'adjust';
                        updateStatusClass = 'update-merge-status component-modified';
                        updateStatusText = "Modified Item";
                    }
                    if (updateItem.isNew) {
                        updateStatusGlyph = 'plus-sign';
                        updateStatusClass = 'update-merge-status component-added';
                        updateStatusText = "New Item";
                    }
                    if (updateItem.isRemoved) {
                        updateStatusGlyph = 'trash';
                        updateStatusClass = 'update-merge-status component-removed';
                        updateStatusText = "Removed Item";
                    }
                }
                break;

        }




        // Header options: ---------------------------------------------------------------------------------------------

        //  DESIGN MODE: SCOPE
        //      COMPONENT TYPE: FEATURE, SCENARIO
        //          Header with checkbox
        //      COMPONENT TYPE: OTHER
        //          View Only header
        //  DESIGN MODE: EDIT
        //      VIEW MODE: VIEW
        //          View Only Header
        //      VIEW MODE: EDIT
        //          BEING EDITED
        //              Editing Header
        //          NOT BEING EDITED
        //              DRAGGABLE
        //                  Draggable Header
        //              NON-DRAGGABLE
        //                  Non-Draggable Header
        //  DESIGN MODE: VIEW UPDATE PROGRESS
        //      View Only Version Progress Header

        // Header components -------------------------------------------------------------------------------------------

        // Minor --------------------------

        // MS to wait before tooltips are shown
        const tooltipDelay = 1000;

        const tooltipUpdateStatus = (
            <Tooltip id="modal-tooltip">
                {'Update Status: ' + updateStatusText}
            </Tooltip>
        );

        const tooltipGotoWp = (
            <Tooltip id="modal-tooltip">
                Go to Work Package
            </Tooltip>
        );

        const tooltipEdit = (
            <Tooltip id="modal-tooltip">
                Edit...
            </Tooltip>
        );

        let tooltipDelete = '';

        if(isDeleted){

            tooltipDelete = (
                <Tooltip id="modal-tooltip">
                    Undo Delete
                </Tooltip>
            );
        } else {

            tooltipDelete = (
                <Tooltip id="modal-tooltip">
                    Delete
                </Tooltip>
            );
        }

        const tooltipMove = (
            <Tooltip id="modal-tooltip">
                Move
            </Tooltip>
        );

        const tooltipSave = (
            <Tooltip id="modal-tooltip">
                Save Edit
            </Tooltip>
        );

        const tooltipCancel = (
            <Tooltip id="modal-tooltip">
                Cancel Edit
            </Tooltip>
        );

        let hiddenIcon =
            <InputGroup.Addon>
                <div className="invisible"><Glyphicon glyph="star"/></div>
            </InputGroup.Addon>;

        let openClose =
            <InputGroup.Addon id={'openClose_' + uiContextName + '_' + openStatus} onClick={ () => this.toggleOpen()}>
                <div id={'openCloseIcon_' + uiContextName} className={openStatus}><Glyphicon glyph={openGlyph}/></div>
            </InputGroup.Addon>;

        let indent =
            <InputGroup.Addon className={itemIndent}></InputGroup.Addon>;

        let scopeToggle =
            <InputGroup.Addon id="scope"
                              onClick={ () => this.toggleScope(view, mode, displayContext, userContext, currentItem, updateItem, !inScope)}>
                <div id="scopeCheckBox" className={scopeStatus}><Glyphicon glyph="ok"/></div>
            </InputGroup.Addon>;

        let editableEditor =
            <div id={'ActiveEditor_' + uiContextName} onClick={ () => this.setCurrentComponent()}>
                <div id="editorEdit" className={itemStyle + ' editableItem' + ' editBackground'} >
                    <Editor
                        editorState={this.state.editorState}
                        handleKeyCommand={this.handleTitleKeyCommand}
                        keyBindingFn={this.keyBindings}
                        onChange={this.onTitleChange}
                        spellCheck={true}
                        ref="editor"
                        readOnly={false}
                    />
                </div>
            </div>;

        let readOnlyEditor =
            <div id={'PassiveEditor_' + uiContextName} onClick={ () => this.setCurrentComponent()}>
                <div id="editorReadOnly" className={"readOnlyItem " + itemStyle}>
                    <Editor
                        editorState={this.state.editorState}
                        spellCheck={true}
                        ref="editorReadOnly"
                        readOnly={true}
                    />
                </div>
            </div>;

        let wpStatus =
            <InputGroup.Addon>
                <OverlayTrigger delayShow={tooltipDelay} placement="top" overlay={tooltipGotoWp}>
                    <div id="wpStatusIcon" className={wpStatusClass}
                         onClick={() => this.onGotoWorkPackage(currentItem.workPackageId)}><Glyphicon
                        glyph={wpStatusGlyph}/></div>
                </OverlayTrigger>
            </InputGroup.Addon>;

        let updateStatus = hiddenIcon;

        if (updateStatusClass === 'update-merge-status component-hidden') {

            updateStatus = hiddenIcon;

        } else {
            if (updateStatusText === '') {
                updateStatus =
                    <InputGroup.Addon>
                        <div id="updateStatusIcon" className={updateStatusClass}><Glyphicon glyph={updateStatusGlyph}/></div>
                    </InputGroup.Addon>;
            } else {
                updateStatus =
                    <InputGroup.Addon>
                        <OverlayTrigger delayShow={tooltipDelay} placement="top" overlay={tooltipUpdateStatus}>
                            <div id="updateStatusIcon" className={updateStatusClass}><Glyphicon glyph={updateStatusGlyph}/></div>
                        </OverlayTrigger>
                    </InputGroup.Addon>;
            }
        }


        let editAction =
            <InputGroup.Addon >
                <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipEdit}>
                    <div id={'Edit_' + uiContextName} onClick={ () => this.editComponentName()}>
                        <div className="blue"><Glyphicon glyph="edit"/></div>
                    </div>
                </OverlayTrigger>
            </InputGroup.Addon>;


        let deleteAction =
            <InputGroup.Addon>
                <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipDelete}>
                    <div id={'Remove_' + uiContextName} onClick={ () => this.deleteRestoreComponent(view, mode, currentItem, userContext)}>
                        <div className={deleteStyle}><Glyphicon id="deleteIcon" glyph={deleteGlyph}/></div>
                    </div>
                </OverlayTrigger>
            </InputGroup.Addon>;

        let moveAction =
            <InputGroup.Addon>
                <div className="lgrey">
                    <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipMove}>
                        <div id={'Move_' + uiContextName}>
                            <Glyphicon glyph="move"/>
                        </div>
                    </OverlayTrigger>
                </div>
            </InputGroup.Addon>;


        let draggableMoveAction = '';
        if (!(Meteor.isTest)) {
            draggableMoveAction =
                <InputGroup.Addon>
                    {connectDragSource(
                        <div className="lgrey">
                            <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipMove}>
                                <div id={'Move_' + uiContextName}>
                                    <Glyphicon glyph="move"/>
                                </div>
                            </OverlayTrigger>
                        </div>)
                    }
                </InputGroup.Addon>
        }

        let saveAction =
            <InputGroup.Addon>
                <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipSave}>
                    <div id={'Save_' + uiContextName} onClick={ () => this.saveComponentName(view, mode)}>
                        <div className="green"><Glyphicon glyph="ok"/></div>
                    </div>
                </OverlayTrigger>
            </InputGroup.Addon>;

        let undoAction =
            <InputGroup.Addon id="actionUndo">
                <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipCancel}>
                    <div id={'Undo_' + uiContextName} onClick={ () => this.undoComponentNameChange()}>
                        <div className="red"><Glyphicon glyph="arrow-left"/></div>
                    </div>
                </OverlayTrigger>
            </InputGroup.Addon>;

        // Major --------------------------

        let headerWithCheckbox =
            <div id="scopeHeaderItem">
                <InputGroup>
                    {openClose}
                    {indent}
                    {scopeToggle}
                    {readOnlyEditor}
                </InputGroup>
            </div>;

        let viewOnlyHeader =
            <div id="editorHeaderItem">
                <InputGroup>
                    {openClose}
                    {indent}
                    {readOnlyEditor}
                </InputGroup>
            </div>;

        let updateViewOnlyHeader =
            <div id="editorHeaderItem">
                <InputGroup>
                    {openClose}
                    {indent}
                    {readOnlyEditor}
                    {hiddenIcon}
                    {hiddenIcon}
                    {hiddenIcon}
                    {hiddenIcon}
                    {updateStatus}
                    {wpStatus}
                </InputGroup>
            </div>;

        let wpViewOnlyHeader =
            <div id="editorHeaderItem">
                <InputGroup>
                    {openClose}
                    {indent}
                    {readOnlyEditor}
                    {hiddenIcon}
                    {hiddenIcon}
                    {hiddenIcon}
                    {hiddenIcon}
                    {updateStatus}
                </InputGroup>
            </div>;

        let editingHeader =
            <div id="editorHeaderItem">
                <InputGroup>
                    {/*{hiddenIcon}*/}
                    {indent}
                    {editableEditor}
                    {saveAction}
                    {undoAction}
                    {hiddenIcon}
                </InputGroup>
            </div>;

        let updateEditingHeader =
            <div id="editorHeaderItem">
                <InputGroup>
                    {/*{hiddenIcon}*/}
                    {hiddenIcon}
                    {indent}
                    {editableEditor}
                    {saveAction}
                    {undoAction}
                    {hiddenIcon}
                </InputGroup>
            </div>;

        // Need to remove this part from the design when unit testing as can't unit test DnD component
        let draggableHeader = '';
        if(Meteor.isTest){
            draggableHeader =
                <div id="editorHeaderItem">
                    <InputGroup>
                        {openClose}
                        {indent}
                        {readOnlyEditor}
                        {editAction}
                        {deleteAction}
                        {moveAction}
                    </InputGroup>
                </div>
        } else {
            draggableHeader =
                connectDragPreview(
                    <div id="editorHeaderItem">
                        <InputGroup>
                            {openClose}
                            {indent}
                            {readOnlyEditor}
                            {editAction}
                            {deleteAction}
                            {draggableMoveAction}
                        </InputGroup>
                    </div>
                );
        }

        let updateDraggableHeader = '';
        if(Meteor.isTest){
            updateDraggableHeader =
                <div id="editorHeaderItem">
                    <InputGroup>
                        {openClose}
                        {indent}
                        {readOnlyEditor}
                        {editAction}
                        {deleteAction}
                        {moveAction}
                        {hiddenIcon}
                        {updateStatus}
                        {wpStatus}
                    </InputGroup>
                </div>
        } else {
            updateDraggableHeader =
                connectDragPreview(
                    <div id="editorHeaderItem">
                        <InputGroup>
                            {openClose}
                            {indent}
                            {readOnlyEditor}
                            {editAction}
                            {deleteAction}
                            {draggableMoveAction}
                            {hiddenIcon}
                            {updateStatus}
                            {wpStatus}
                        </InputGroup>
                    </div>
                );
        }

        let nonDraggableHeader =
            <div id="editorHeaderItem">
                <InputGroup>
                    {openClose}
                    {indent}
                    {readOnlyEditor}
                    {editAction}
                    {deleteAction}
                    {hiddenIcon}
                </InputGroup>
            </div>;

        let updateNonDraggableHeader =
            <div id="editorHeaderItem">
                <InputGroup>
                    {openClose}
                    {indent}
                    {readOnlyEditor}
                    {editAction}
                    {deleteAction}
                    {hiddenIcon}
                    {hiddenIcon}
                    {updateStatus}
                    {wpStatus}
                </InputGroup>
            </div>;

        let viewOnlyVersionProgressHeader =
            <div id="workingHeaderItem">
                <InputGroup>
                    {updateStatus}
                    {openClose}
                    {indent}
                    {readOnlyEditor}
                    {wpStatus}
                </InputGroup>
            </div>;

        // Compose Header Components -----------------------------------------------------------------------------------

        // All components are draggable, either to move them or reorder them.
        log((msg) => console.log(msg), LogLevel.TRACE, "Rendering header component {} {} in context {} and mode {} with in scope {}",
            currentItem.componentType,
            this.state.name,
            displayContext,
            mode,
            inScope
        );

        let designComponentElement = '';

        switch (displayContext){
            case DisplayContext.WP_SCOPE:
                // All WP scope items are checkable
                designComponentElement = headerWithCheckbox;
                break;
            case DisplayContext.UPDATE_SCOPE:
                // Component displayed as part of Scope Selection
                designComponentElement = headerWithCheckbox;
                break;
            case DisplayContext.BASE_VIEW:
                // View only
                designComponentElement = viewOnlyHeader;
                break;
            case DisplayContext.WP_VIEW:
                // View only
                if(updateItem){
                    designComponentElement = wpViewOnlyHeader;
                } else {
                    designComponentElement = viewOnlyHeader;
                }
                break;
            case DisplayContext.WORKING_VIEW:
                // Progress view
                designComponentElement = viewOnlyVersionProgressHeader;
                break;
            case DisplayContext.UPDATE_VIEW:
                designComponentElement = updateViewOnlyHeader;
                break;
            case DisplayContext.UPDATE_EDIT:
                // Component displayed as part of Editor
                if(updateItem) {
                    switch (mode) {
                        case  ViewMode.MODE_VIEW:
                            // View only
                            designComponentElement = updateViewOnlyHeader;
                            break;

                        case ViewMode.MODE_EDIT:
                            // Only editable if in scope for an update.  For new design all is in scope.
                            if (inScope) {
                                // Editable component
                                if (this.state.editing) {
                                    // Being edited now...
                                    designComponentElement = updateEditingHeader;

                                } else {
                                    // Not being edited now.  Only new items can be moved.
                                    if(updateItem.isNew) {
                                        designComponentElement = updateDraggableHeader;
                                    } else {
                                        designComponentElement = updateNonDraggableHeader;
                                    }
                                }
                            } else {
                                // Item is out of scope so cannot be edited or dragged
                                designComponentElement = updateViewOnlyHeader;
                            }
                            break;
                    }

                } else {
                    // Nothing in editor if no design update item
                    designComponentElement = <div></div>;
                }
                break;

            case DisplayContext.BASE_EDIT:
                // Component displayed as part of Editor
                switch (mode){
                    case  ViewMode.MODE_VIEW:
                        // View only
                        designComponentElement = viewOnlyHeader;
                        break;

                    case ViewMode.MODE_EDIT:

                        // Editable component
                        if (this.state.editing) {
                            // Being edited now...
                            designComponentElement = editingHeader;

                        } else {
                            // Not being edited now
                            designComponentElement = draggableHeader;
                        }
                        break;
                }
                break;
            case DisplayContext.DEV_DESIGN:
                // Scenarios are editable
                switch (mode){
                    case  ViewMode.MODE_VIEW:
                        // View only
                        if(updateItem){
                            designComponentElement = wpViewOnlyHeader;
                        } else {
                            designComponentElement = viewOnlyHeader;
                        }

                        break;

                    case ViewMode.MODE_EDIT:
                        // Scenarios and new Feature Aspects are editable.
                        if(currentItem.componentType === ComponentType.SCENARIO || (currentItem.componentType === ComponentType.FEATURE_ASPECT && currentItem.isDevAdded)) {
                            // Editable component
                            if (this.state.editing) {
                                // Being edited now...
                                designComponentElement = editingHeader;

                            } else {
                                // Not being edited now
                                if(updateItem){
                                    designComponentElement = updateNonDraggableHeader;
                                } else {
                                    designComponentElement = nonDraggableHeader;
                                }
                            }
                        } else {
                            // Item is out of scope so cannot be edited or dragged
                            if(updateItem){
                                designComponentElement = wpViewOnlyHeader;
                            } else {
                                designComponentElement = viewOnlyHeader;
                            }
                        }
                        break;
                }
                break;
        }

        // Finally, are we displaying the test summary as well as the design component?
        if(testSummary){

            switch(currentItem.componentType){

                case ComponentType.FEATURE:
                    // Feature level test summary

                    let featureRowClass = 'scenario-test-row-untested';

                    if(testSummaryData) {
                        switch(view){
                            case ViewType.DESIGN_PUBLISHED:
                            case ViewType.DESIGN_UPDATABLE:
                            case ViewType.DESIGN_UPDATE_EDIT:           // Scope pane
                            case ViewType.WORK_PACKAGE_BASE_EDIT:       // Scope pane
                                // Whole DV
                                // Any failures at all it's a fail
                                if (testSummaryData.featureSummaryStatus === FeatureTestSummaryStatus.FEATURE_FAILING_TESTS) {
                                    featureRowClass = 'scenario-test-row-fail'
                                } else {
                                    // No failures so any passes its a pass for now
                                    if (testSummaryData.featureSummaryStatus === FeatureTestSummaryStatus.FEATURE_PASSING_TESTS) {
                                        featureRowClass = 'scenario-test-row-pass'
                                    }
                                }
                                break;
                            case ViewType.DESIGN_UPDATE_VIEW:
                            case ViewType.WORK_PACKAGE_UPDATE_EDIT:     // Scope pane
                                // DU Only
                                // Any failures at all it's a fail
                                if (testSummaryData.duFeatureSummaryStatus === FeatureTestSummaryStatus.FEATURE_FAILING_TESTS) {
                                    featureRowClass = 'scenario-test-row-fail'
                                } else {
                                    // No failures so any passes its a pass for now
                                    if (testSummaryData.duFeatureSummaryStatus === FeatureTestSummaryStatus.FEATURE_PASSING_TESTS) {
                                        featureRowClass = 'scenario-test-row-pass'
                                    }
                                }
                                break;
                            case ViewType.WORK_PACKAGE_BASE_VIEW:
                            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                            case ViewType.DEVELOP_BASE_WP:
                            case ViewType.DEVELOP_UPDATE_WP:
                                // WP Only
                                // Any failures at all it's a fail
                                if (testSummaryData.wpFeatureSummaryStatus === FeatureTestSummaryStatus.FEATURE_FAILING_TESTS) {
                                    featureRowClass = 'scenario-test-row-fail'
                                } else {
                                    // No failures so any passes its a pass for now
                                    if (testSummaryData.wpFeatureSummaryStatus === FeatureTestSummaryStatus.FEATURE_PASSING_TESTS) {
                                        featureRowClass = 'scenario-test-row-pass'
                                    }
                                }
                                break;

                        }

                    }

                    return(
                        <Grid id="featureTestSummary">
                            <Row id={uiContextName} className={featureRowClass}>
                                <Col md={7} className="close-col">
                                    <div id={uiContextName}>
                                        {designComponentElement}
                                    </div>
                                </Col>
                                <Col md={5} className="close-col" onClick={ () => this.setCurrentComponent()}>
                                    <FeatureTestSummary
                                        testSummaryData={testSummaryData}
                                    />
                                </Col>
                            </Row>
                        </Grid>
                    );

                case ComponentType.SCENARIO:
                    // Scenario level test summary

                    let rowClass = 'scenario-test-row-untested';

                    if(testSummaryData) {
                        // Any failures at all it's a fail
                        if (testSummaryData.accMashTestStatus === MashTestStatus.MASH_FAIL || testSummaryData.intMashTestStatus === MashTestStatus.MASH_FAIL || testSummaryData.unitFailCount > 0) {
                            rowClass = 'scenario-test-row-fail'
                        } else {
                            // No failures so any passes its a pass for now
                            if (testSummaryData.accMashTestStatus === MashTestStatus.MASH_PASS || testSummaryData.intMashTestStatus === MashTestStatus.MASH_PASS || testSummaryData.unitPassCount > 0) {
                                rowClass = 'scenario-test-row-pass'
                            }
                        }
                    }

                    // Pass the scenario into summary for test expectations
                    let scenario = currentItem;
                    // But if an update, use the update scenario
                    if(updateItem){
                        scenario = updateItem;
                    }

                    // onClick={ () => this.setCurrentComponent()}

                    return(
                        <Grid id="scenarioTestSummary">
                            <Row id={uiContextName} className={rowClass}>
                                <Col md={7} className="close-col">
                                    <div>
                                        {designComponentElement}
                                    </div>
                                </Col>
                                <Col md={5} className="close-col">
                                    <TestSummary
                                        testSummaryData={testSummaryData}
                                        scenario={scenario}
                                        displayContext={displayContext}
                                    />
                                </Col>
                            </Row>
                        </Grid>
                    );

                default:
                    return(
                        <Grid>
                            <Row id={uiContextName} className="non-summary-row">
                                <Col md={7} className="close-col">
                                    <div >
                                        {designComponentElement}
                                    </div>
                                </Col>
                                <Col md={5} className="close-col">
                                </Col>
                            </Row>
                        </Grid>
                    );
            }
        } else {
            return(
                <div id={uiContextName}>
                    {designComponentElement}
                </div>
            );
        }

    }
}

// Additional properties are added by React DnD collectSource
DesignComponentHeader.propTypes = {
    currentItem: PropTypes.object.isRequired,
    updateItem: PropTypes.object,
    wpItem: PropTypes.object,
    uiContextName: PropTypes.string.isRequired,
    isDragDropHovering: PropTypes.bool,
    onToggleOpen: PropTypes.func,
    onSelectItem: PropTypes.func,
    mode: PropTypes.string.isRequired,
    view: PropTypes.string.isRequired,
    displayContext: PropTypes.string.isRequired,
    userContext: PropTypes.object.isRequired,
    testSummary: PropTypes.bool.isRequired,
    testSummaryData: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    testDataFlag: PropTypes.number.isRequired,
    updateScopeItems: PropTypes.object.isRequired,
    updateScopeFlag: PropTypes.number.isRequired,
    workPackageScopeItems: PropTypes.object.isRequired,
    workPackageScopeFlag: PropTypes.number.isRequired,
    domainTermsVisible: PropTypes.bool.isRequired
};

// React DnD ===========================================================================================================

// Properties required to control the drag
const componentSource = {

    // Start of drag gets the item being dragged
    beginDrag(props) {
        return {
            component: props.currentItem,
            displayContext: props.displayContext
        }
    },

    // End of drag sees if it is allowed to be dropped and if so calls functions to update the data accordingly
    endDrag(props, monitor, component){

        log((msg) => console.log(msg), LogLevel.TRACE, "END DRAG!");

        if (!monitor.didDrop) {
            log((msg) => console.log(msg), LogLevel.TRACE, "NO DROP");
            return;
        }

        const item = monitor.getItem();
        const dropResult = monitor.getDropResult();

        if (dropResult) {
            if(dropResult.dragType === 'MOVE_LOCATION') {
                // Drop action when moving an item to a new parent location
                log((msg) => console.log(msg), LogLevel.TRACE, "DROP - MOVE");

                switch (props.view) {
                    case ViewType.DESIGN_NEW:
                    case ViewType.DESIGN_PUBLISHED:
                        // Validates drop allowed and then moves component
                        ClientDesignComponentServices.moveDesignComponent(props.view, props.mode, props.displayContext, item.component._id, dropResult.targetItem._id);
                        break;
                    case ViewType.DESIGN_UPDATE_EDIT:
                        ClientDesignUpdateComponentServices.moveComponent(props.view, props.mode, props.displayContext, item.component, dropResult.targetItem);
                        break;
                }
            } else {
                // Drop action when moving an item in the list to reorder it
                log((msg) => console.log(msg), LogLevel.TRACE, "DROP - REORDER");

                switch (props.view) {
                    case ViewType.DESIGN_NEW:
                    case ViewType.DESIGN_PUBLISHED:
                        ClientDesignComponentServices.reorderDesignComponent(props.view, props.mode, props.displayContext, item.component._id, dropResult.targetItem._id);
                        break;
                    case ViewType.DESIGN_UPDATE_EDIT:
                        ClientDesignUpdateComponentServices.reorderComponent(props.view, props.mode, props.displayContext, item.component, dropResult.targetItem);
                        break;
                }

            }
        } else {
            log((msg) => console.log(msg), LogLevel.TRACE, "NO DROP RESULT");
        }
    }
};


// React DnD function to get and monitor drags
function collectSource(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
    }
}

// Before exporting, wrap this component to make it draggable
export default DragSource(ComponentType.DRAGGABLE_ITEM, componentSource, collectSource)(DesignComponentHeader);

// =====================================================================================================================



