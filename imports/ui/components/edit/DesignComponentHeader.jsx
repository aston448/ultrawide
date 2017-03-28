// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes} from 'react';

// Ultrawide Collections


// Ultrawide GUI Components
import TestSummary          from '../dev/TestSummary.jsx';
import FeatureTestSummary   from '../dev/FeatureTestSummary.jsx';

// Ultrawide Services

import ClientDesignComponentServices        from '../../../apiClient/apiClientDesignComponent.js';
import ClientDesignUpdateComponentServices  from '../../../apiClient/apiClientDesignUpdateComponent.js';
import ClientWorkPackageComponentServices   from '../../../apiClient/apiClientWorkPackageComponent.js';
import ClientDomainDictionaryServices       from '../../../apiClient/apiClientDomainDictionary.js';
import ClientTextEditorServices             from '../../../apiClient/apiClientTextEditor.js';

import {ViewType, ComponentType, ViewMode, DisplayContext, WorkPackageType, LogLevel, MashTestStatus, FeatureTestSummaryStatus, UpdateMergeStatus} from '../../../constants/constants.js';
import {getComponentClass, log} from '../../../common/utils.js';
import TextLookups from '../../../common/lookups.js'

// Bootstrap
import {Checkbox}   from 'react-bootstrap';
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
        color: 'rgba(0, 0, 255, 1.0)',
        //backgroundColor: 'rgba(240, 255, 240, 1.0)',
        fontWeight: 'normal',
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
            editable: false,
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

        this.updateTitleText(this.props);

    }

    shouldComponentUpdate(nextProps, nextState){

        // Item is going into update scope
        if(nextProps.updateComponent !== null && this.props.updateComponent === null){
            return true;
        }

        // Item is going out of update scope
        if(nextProps.updateComponent === null && this.props.updateComponent !== null){
            return true;
        }

        // Optimisation.  No need to re-render this component if no change to what is seen
        switch (this.props.view) {
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
            case ViewType.DESIGN_UPDATABLE_VIEW:
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
                return !(
                    nextState.highlighted === this.state.highlighted &&
                    nextState.editable === this.state.editable &&
                    nextState.editorState === this.state.editorState &&
                    nextState.inScope === this.state.inScope &&
                    nextProps.testSummary === this.props.testSummary &&
                    nextProps.isOpen === this.props.isOpen &&
                    nextProps.currentItem.componentNameNew === this.props.currentItem.componentNameNew &&
                    nextProps.currentItem.isRemovable === this.props.currentItem.isRemovable &&
                    nextProps.currentItem.componentParent === this.props.currentItem.componentParent &&
                    nextProps.currentItem.componentActive === this.props.currentItem.componentActive &&
                    nextProps.isDragDropHovering === this.props.isDragDropHovering &&
                    nextProps.mode === this.props.mode &&
                    nextProps.isDragging === this.props.isDragging &&
                    nextProps.testDataFlag === this.props.testDataFlag //&&
                    //nextProps.currentViewDataValue === this.props.currentViewDataValue
                );
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                return !(
                    nextState.highlighted === this.state.highlighted &&
                    nextState.editable === this.state.editable &&
                    nextState.inScope === this.state.inScope &&
                    nextState.parentScope === this.state.parentScope &&
                    nextState.editorState === this.state.editorState &&
                    nextProps.testSummary === this.props.testSummary &&
                    nextProps.isOpen === this.props.isOpen &&
                    nextProps.currentItem.componentNameNew === this.props.currentItem.componentNameNew &&
                    nextProps.currentItem.isRemovable === this.props.currentItem.isRemovable &&
                    nextProps.currentItem.isRemoved === this.props.currentItem.isRemoved &&
                    nextProps.currentItem.isInScope === this.props.currentItem.isInScope &&
                    nextProps.currentItem.isParentScope === this.props.currentItem.isParentScope &&
                    nextProps.currentItem.componentParent === this.props.currentItem.componentParent &&
                    nextProps.currentItem.componentActive === this.props.currentItem.componentActive &&
                    nextProps.isDragDropHovering === this.props.isDragDropHovering &&
                    nextProps.mode === this.props.mode &&
                    nextProps.testDataFlag === this.props.testDataFlag &&
                    nextProps.isDragging === this.props.isDragging
                );
                break;
            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:
                return !(
                    nextState.highlighted === this.state.highlighted &&
                    nextState.editable === this.state.editable &&
                    nextState.editorState === this.state.editorState &&
                    nextProps.mode === this.props.mode &&
                    nextProps.currentItem.isRemovable === this.props.currentItem.isRemovable &&
                    nextProps.testSummary === this.props.testSummary &&
                    nextProps.testDataFlag === this.props.testDataFlag &&
                    nextProps.isOpen === this.props.isOpen
                );
        }

    }

    // Set up the view from persisted settings
    componentDidMount(){

        switch(this.props.displayContext){
            case DisplayContext.WP_SCOPE:
                // Need to get from WP scope for current item
                this.setState({inScope: this.props.currentItem.componentActive || this.props.currentItem.componentParent});
                this.setState({parentScope: this.props.currentItem.componentParent});
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

        // New untouched items are editable unless they are new default feature aspects in a Design Update...
        switch (this.props.view) {
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DEVELOP_BASE_WP:
                // A new component is automatically editable
                if (this.props.currentItem.isNew) {
                    this.editComponentName();
                }
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DEVELOP_UPDATE_WP:
                // A new component not yet changed is automatically editable
                if (this.props.currentItem.isNew && ! this.props.currentItem.isChanged) {
                    this.editComponentName();
                }
                break;
        }
    }

    // If the name of an item has been updated it could be in another view of it so we need to update the local editor
    componentWillReceiveProps(newProps){

        switch (newProps.view) {
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
            case ViewType.DESIGN_UPDATABLE_VIEW:
                if (newProps.currentItem.componentNameNew !== this.props.currentItem.componentNameNew) {
                    this.updateTitleText(newProps, newProps.currentItem.componentNameRawNew);
                }

                // if(newProps.currentProgressDataValue != this.props.currentProgressDataValue) {
                //     this.getProgressData(newProps.currentItem, newProps.userContext, newProps.view);
                // }

                break;

            case ViewType.DESIGN_UPDATE_EDIT:
                if(this.props.displayContext === DisplayContext.UPDATE_SCOPE){
                    // Base view.  Should not be updating
                    if (newProps.currentItem.componentNameNew !== this.props.currentItem.componentNameNew) {
                        this.updateTitleText(newProps, newProps.currentItem.componentNameRawNew);
                    }

                    // // Reflect any changes in scope
                    // this.setState({inScope: (newProps.updateItem !== null)});

                } else {
                    // For updates we use the new name.  Also update if scope changes so decoration is redone.
                    if(
                        newProps.currentItem.componentNameNew !== this.props.currentItem.componentNameNew ||
                        newProps.currentItem.isInScope !== this.props.currentItem.isInScope
                    ){
                        this.updateTitleText(newProps, newProps.currentItem.componentNameRawNew);
                    }


                    //this.setState({parentScope: newProps.currentItem.isParentScope});

                }
                break;

            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
                if(this.props.displayContext === DisplayContext.WP_SCOPE){
                    this.setState({inScope: newProps.currentItem.componentParent || newProps.currentItem.componentActive});
                }
                this.updateTitleText(newProps, newProps.currentItem.componentNameRawNew);
                break;

            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                if(newProps.displayContext === DisplayContext.WP_SCOPE){
                    this.setState({inScope: newProps.currentItem.componentParent || newProps.currentItem.componentActive});
                }
                this.updateTitleText(newProps, newProps.currentItem.componentNameRawNew);
                break;
            case ViewType.DEVELOP_BASE_WP:
                this.updateTitleText(newProps, newProps.currentItem.componentNameRawNew);
                break;
            case ViewType.DEVELOP_UPDATE_WP:
                this.updateTitleText(newProps, newProps.currentItem.componentNameRawNew);
                break;

        }
    }

    getNewAndOldRawText(newText, oldText){
        return ClientDesignComponentServices.getNewAndOldRawText(newText, oldText);
    }

    // Refresh the component name text
    updateTitleText(props, newRawText){

        let currentContent = {};
        let compositeDecorator = null;
        let item = props.currentItem;

        // Decoration for Scenarios only - and not if greyed out in WP scope
        if(props.currentItem.componentType === ComponentType.SCENARIO) {

            log((msg) => console.log(msg), LogLevel.TRACE, "Decorator check: Component: {} Context: {}", props.currentItem.componentType, props.displayContext);

            // Item is a Scenario
            if(props.displayContext === DisplayContext.WP_SCOPE || props.displayContext === DisplayContext.UPDATE_SCOPE){
                // We are in a WP or Update Scope context
                if((props.displayContext === DisplayContext.WP_SCOPE) && props.currentItem.componentActive){
                    // The WP Scenario is active
                    compositeDecorator = new CompositeDecorator([
                        {
                            strategy: ClientDomainDictionaryServices.getDomainTermDecoratorFunction(item.designVersionId),
                            component: DomainSpan,
                        }
                    ]);
                }

                if((props.displayContext === DisplayContext.UPDATE_SCOPE) && props.currentItem.isInScope){
                    // The Update Scenario is active
                    compositeDecorator = new CompositeDecorator([
                        {
                            strategy: ClientDomainDictionaryServices.getDomainTermDecoratorFunction(item.designVersionId),
                            component: DomainSpan,
                        }
                    ]);
                }

            } else {
                // We are not in WP scope context so OK for all Scenarios
                compositeDecorator = new CompositeDecorator([
                    {
                        strategy: ClientDomainDictionaryServices.getDomainTermDecoratorFunction(item.designVersionId),
                        component: DomainSpan,
                    }
                ]);
            }

            EditorState.set(this.state.editorState, {decorator: compositeDecorator});
        }

        if(newRawText){
            // Immediate update of latest text
            log((msg) => console.log(msg), LogLevel.TRACE, "Updating title editor with {}", newRawText);
            currentContent = convertFromRaw(newRawText);
        } else {
            // Getting stored text
            let existingRawText = null;

            switch (props.view) {
                case ViewType.DESIGN_NEW_EDIT:
                case ViewType.DESIGN_PUBLISHED_VIEW:

                    existingRawText = props.currentItem.componentNameRawNew;
                    break;
                case ViewType.DESIGN_UPDATABLE_VIEW:
                    // If there is an item whose name has changed then create a new editor entry showing both
                    if((item.componentNameOld !== item.componentNameNew)  && item.updateMergeStatus === UpdateMergeStatus.COMPONENT_MODIFIED) {
                        existingRawText = this.getNewAndOldRawText(item.componentNameNew, item.componentNameOld);
                    } else {
                        existingRawText = item.componentNameRawNew;
                    }

                    break;
                case ViewType.DESIGN_UPDATE_EDIT:

                    switch(props.displayContext){
                        case  DisplayContext.UPDATE_SCOPE:
                            // The editor shows the Old DV Values
                            existingRawText = item.componentNameRawOld;
                            break;
                        case DisplayContext.UPDATE_VIEW:
                        case DisplayContext.UPDATE_EDIT:
                            // The editor shows what's in the actual DU
                            if(props.updateItem) {
                                existingRawText = props.updateItem.componentNameRawNew;
                            }
                            break;
                        case DisplayContext.WORKING_VIEW:
                            // The editor shows the New DV Values
                            if((item.componentNameOld !== item.componentNameNew)  && item.updateMergeStatus === UpdateMergeStatus.COMPONENT_MODIFIED) {
                                existingRawText = this.getNewAndOldRawText(item.componentNameNew, item.componentNameOld);
                            } else {
                                existingRawText = item.componentNameRawNew;
                            }
                    }
                    break;

                case ViewType.DESIGN_UPDATE_VIEW:

                    switch(props.displayContext){
                        case  DisplayContext.UPDATE_SCOPE:
                            // Scope uses the base DV components
                            existingRawText = item.componentNameRawNew;
                            break;
                        case DisplayContext.UPDATE_VIEW:
                        case DisplayContext.UPDATE_EDIT:
                            // The editor shows what's in the actual DU
                            if(props.updateItem) {
                                existingRawText = props.updateItem.componentNameRawNew;
                            }
                            break;
                    }
                    break;

                case ViewType.WORK_PACKAGE_BASE_EDIT:
                case ViewType.WORK_PACKAGE_BASE_VIEW:
                case ViewType.DEVELOP_BASE_WP:
                case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                case ViewType.DEVELOP_UPDATE_WP:

                    existingRawText = props.currentItem.componentNameRawNew;
                    break;
            }

            if (existingRawText) {
                currentContent = convertFromRaw(existingRawText, compositeDecorator);
            } else {
                this.state = {editorState: EditorState.createEmpty(compositeDecorator)};
                return;
            }

        }

        // Got some content...
        log((msg) => console.log(msg), LogLevel.TRACE, "Updating title editor with {}", currentContent.getPlainText());

        if (currentContent.hasText()) {
            this.state.name = currentContent.getPlainText();
            this.state.editorState = EditorState.createWithContent(currentContent, compositeDecorator);
        } else {
            this.state = {editorState: EditorState.createEmpty(compositeDecorator)};
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
            if(this.state.editable === false) {
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
        this.setState({editable: true});
    }

    // Cancel editing the component name
    undoComponentNameChange(){

        // Reset the text in case changed on screen
        this.updateTitleText(this.props);
        this.setState({editable: false});
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
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DEVELOP_BASE_WP:
                // Updates to the base design
                result = ClientDesignComponentServices.updateComponentName(view, mode, item._id, plainText, rawText);
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DEVELOP_UPDATE_WP:
                // Updates to a design update
                console.log("Updating component name to " + plainText);
                result = ClientDesignUpdateComponentServices.updateComponentName(view, mode, item, plainText, rawText);
                break;
        }

        if(result.success){
            // Finished editing
            this.setState({editable: false});
            this.setCurrentComponent();
        }

    }

    // Remove this component from the design.  Only possible if has no children...
    deleteRestoreComponent(view, mode, item, userContext){

        switch(view){
            case ViewType.DESIGN_NEW_EDIT:
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
        }

    };

    // Render the header of the design component - has tools in it depending on context
    render(){
        const {currentItem, updateItem, wpItem, displayContext, connectDragSource, connectDragPreview, isDragging, view, mode, userContext, testSummary, testSummaryData, isOpen} = this.props;

        // TODO - add all the tooltips required
        const tooltipEdit = (
            <Tooltip id="modal-tooltip">
                Edit...
            </Tooltip>
        );


        // Determine the look of the item ------------------------------------------------------------------------------

        // Delete item greyed out if not removable but not if logically deleted in update  || (currentItem.isRemoved && view === ViewType.EDIT_UPDATE)
        let deleteStyle = currentItem.isRemovable ? 'red' : 'lgrey';


        // For Work Packages only stuff added in WP is removable
        if(view === ViewType.DEVELOP_BASE_WP || view === ViewType.DEVELOP_UPDATE_WP){
            deleteStyle = currentItem.isRemovable && (currentItem.isDevAdded || currentItem.isDevUpdated) ? 'red' : 'lgrey';
        }

        let inScope = false;
        let inParentScope = false;
        let inScopeElsewhere = false;
        let nextScope = false;
        let isDeleted = false;
        let deleteGlyph = 'remove'; // Normal glyph for delete button

        // Deleted Items for DU Edit ----------------------------------

        if(view === ViewType.DESIGN_UPDATE_EDIT){

            switch(displayContext){
                case DisplayContext.UPDATE_SCOPE:

                    // Show as deleted if possible due to updates of the current version
                    if(updateItem){
                        isDeleted = updateItem.isRemoved;
                    } else {
                        isDeleted = currentItem.updateMergeStatus === UpdateMergeStatus.COMPONENT_REMOVED;
                    }
                    break;

                case DisplayContext.UPDATE_EDIT:

                    isDeleted = currentItem.isRemoved;

                    // For logically deleted items in the same update, show the undo icon...
                    if(isDeleted){
                        deleteGlyph = 'arrow-left';
                    } else {
                        deleteStyle = (currentItem.isRemovable && !currentItem.isRemovedElsewhere) ? 'red' : 'lgrey';
                    }
            }
        }

        // Scope status ------------------------------------------

        switch(displayContext){
            case DisplayContext.UPDATE_SCOPE:
                if(updateItem){
                    inScope = updateItem.isInScope;
                    inParentScope = updateItem.isParentScope;
                } else {
                    // If not in this update indicate if another update is known to have modified it
                    if(currentItem.updateMergeStatus !== UpdateMergeStatus.COMPONENT_BASE){
                        inScopeElsewhere = true;
                    }
                }

                nextScope = !inScope;

                break;
            case DisplayContext.UPDATE_EDIT:
                inScope = updateItem.isInScope;
                inParentScope = updateItem.isParentScope;
                break;
            case DisplayContext.WP_SCOPE:
                if(wpItem) {
                    inScope = wpItem.componentActive;
                    inParentScope = wpItem.componentParent;
                } else {
                    if((currentItem.workPackageId !== 'NONE') && (currentItem.workPackageId !== userContext.workPackageId)){
                        // Item is in sc0pe in another WP
                        inScopeElsewhere = true;
                    }
                }

                nextScope = !inScope;
                break;
            case DisplayContext.WP_VIEW:
                inScope = wpItem.componentActive;
                inParentScope = wpItem.componentParent;
                break;
        }

        // Determine how the check box is shown
        let scopeStatus = 'out-scope';
        if(inScope){
            scopeStatus = 'in-scope';
        }
        if(inParentScope){
            scopeStatus = 'in-parent-scope';
        }
        if(inScopeElsewhere){
            scopeStatus = 'in-scope-elsewhere';
        }

        // Item main style ------------------------------------------
        let itemStyle = getComponentClass(currentItem, updateItem, wpItem, view, displayContext, false);


        // Grey out original item when it is being dragged ----------
        if(isDragging){
            itemStyle = itemStyle + ' dragging-item';
        }

        // Open / Closed --------------------------------------------
        let openGlyph = isOpen ? 'minus' :'plus';

        let openStatus = isOpen ? 'open-status-open' : 'open-status-closed';
        if(currentItem.componentType === ComponentType.SCENARIO){
            openStatus = 'invisible';
        }

        // Indent ---------------------------------------------------
        let itemIndent = 'item-indent-none';

        switch(currentItem.componentType){
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

        // Get status for updatable views - display as a tooltip over the status icon
        let updateStatusClass = 'update-merge-status ' + currentItem.updateMergeStatus;
        let updateStatusText = TextLookups.updateMergeStatus(currentItem.updateMergeStatus);

        let updateTextClass = '';
        if(currentItem.updateMergeStatus === UpdateMergeStatus.COMPONENT_REMOVED){
            updateTextClass = ' removed-item';
        }

        const tooltipUpdateStatus = (
            <Tooltip id="modal-tooltip">
                {updateStatusText}
            </Tooltip>
        );

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

        let headerWithCheckbox =
            <div id="scopeHeaderItem">
                <InputGroup>
                    <InputGroup.Addon id="openClose" onClick={ () => this.toggleOpen()}>
                        <div id="openCloseIcon" className={openStatus}><Glyphicon glyph={openGlyph}/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon className={itemIndent}></InputGroup.Addon>
                    <InputGroup.Addon id="scope" onClick={ () => this.toggleScope(view, mode, displayContext, userContext, currentItem, updateItem, !inScope)}>
                        <div id="scopeCheckBox" className={scopeStatus}><Glyphicon glyph="ok"/></div>
                    </InputGroup.Addon>
                    <div id="editorReadOnly" className={"readOnlyItem " + itemStyle} onClick={ () => this.setCurrentComponent()}>
                        <Editor
                            editorState={this.state.editorState}
                            spellCheck={true}
                            ref="editorReadOnly"
                            readOnly={true}
                        />
                    </div>
                </InputGroup>
            </div>;

        let viewOnlyHeader =
            <div id="editorHeaderItem">
                <InputGroup onClick={ () => this.setCurrentComponent()}>
                    <InputGroup.Addon id="openClose" onClick={ () => this.toggleOpen()}>
                        <div id="openCloseIcon" className={openStatus}><Glyphicon glyph={openGlyph}/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon className={itemIndent}></InputGroup.Addon>
                    <div id="editorReadOnly" className={"readOnlyItem " + itemStyle} >
                        <Editor
                            editorState={this.state.editorState}
                            spellCheck={false}
                            ref="editorViewMode"
                            readOnly={true}
                        />
                    </div>
                </InputGroup>
            </div>;

        let editingHeader =
            <div id="editorHeaderItem">
                <InputGroup onClick={ () => this.setCurrentComponent()}>
                    <InputGroup.Addon>
                        <div className="invisible"><Glyphicon glyph="star"/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon className={itemIndent}></InputGroup.Addon>
                    <div id="editorEdit" className="editableItem">
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
                    <InputGroup.Addon id="actionSave" onClick={ () => this.saveComponentName(view, mode)}>
                        <div className="green"><Glyphicon glyph="ok"/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon id="actionUndo" onClick={ () => this.undoComponentNameChange()}>
                        <div className="red"><Glyphicon glyph="arrow-left"/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon>
                        <div className="invisible"><Glyphicon glyph="star"/></div>
                    </InputGroup.Addon>
                </InputGroup>
            </div>;

        // Need to remove this part from the design when unit testing as can't unit test DnD component
        let draggableHeader = '';
        if(Meteor.isTest){
            draggableHeader =
                <div id="editorHeaderItem">
                    <InputGroup>
                        <InputGroup.Addon id="openClose" onClick={ () => this.toggleOpen()}>
                            <div id="openCloseIcon" className={openStatus}><Glyphicon glyph={openGlyph}/></div>
                        </InputGroup.Addon>
                        <InputGroup.Addon className={itemIndent}></InputGroup.Addon>
                        <div id="editorReadOnly" className={"readOnlyItem " + itemStyle}  onClick={ () => this.setCurrentComponent()}>
                            <Editor
                                editorState={this.state.editorState}
                                handleKeyCommand={this.handleTitleKeyCommand}
                                keyBindingFn={this.keyBindings}
                                spellCheck={false}
                                ref="editorReadOnly"
                                readOnly={true}
                            />
                        </div>
                        <InputGroup.Addon id="actionEdit" onClick={ () => this.editComponentName()}>
                            <OverlayTrigger overlay={tooltipEdit}>
                                <div className="blue"><Glyphicon glyph="edit"/></div>
                            </OverlayTrigger>
                        </InputGroup.Addon>
                        <InputGroup.Addon id="actionDelete" onClick={ () => this.deleteRestoreComponent(view, mode, currentItem, userContext)}>
                            <div className={deleteStyle}><Glyphicon id="deleteIcon" glyph={deleteGlyph}/></div>
                        </InputGroup.Addon>
                        <InputGroup.Addon>
                            <div id="actionMove" className="lgrey">
                                <Glyphicon glyph="move"/>
                            </div>
                        </InputGroup.Addon>
                    </InputGroup>
                </div>
        } else {
            draggableHeader =
            connectDragPreview(
                <div id="editorHeaderItem">
                    <InputGroup>
                        <InputGroup.Addon id="openClose" onClick={ () => this.toggleOpen()}>
                            <div id="openCloseIcon" className={openStatus}><Glyphicon glyph={openGlyph}/></div>
                        </InputGroup.Addon>
                        <InputGroup.Addon className={itemIndent}></InputGroup.Addon>
                        <div id="editorReadOnly" className={"readOnlyItem " + itemStyle}  onClick={ () => this.setCurrentComponent()}>
                            <Editor
                                editorState={this.state.editorState}
                                handleKeyCommand={this.handleTitleKeyCommand}
                                keyBindingFn={this.keyBindings}
                                spellCheck={false}
                                ref="editorReadOnly"
                                readOnly={true}
                            />
                        </div>
                        <InputGroup.Addon id="actionEdit" onClick={ () => this.editComponentName()}>
                            <OverlayTrigger overlay={tooltipEdit}>
                                <div className="blue"><Glyphicon glyph="edit"/></div>
                            </OverlayTrigger>
                        </InputGroup.Addon>
                        <InputGroup.Addon id="actionDelete" onClick={ () => this.deleteRestoreComponent(view, mode, currentItem, userContext)}>
                            <div className={deleteStyle}><Glyphicon id="deleteIcon" glyph={deleteGlyph}/></div>
                        </InputGroup.Addon>
                        <InputGroup.Addon>
                            {connectDragSource(
                                <div id="actionMove" className="lgrey">
                                    <Glyphicon glyph="move"/>
                                </div>)
                            }
                        </InputGroup.Addon>
                    </InputGroup>
                </div>
            );
        }

        let nonDraggableHeader =
            <div id="editorHeaderItem">
                <InputGroup>
                    <InputGroup.Addon id="openClose" onClick={ () => this.toggleOpen()}>
                        <div id="openCloseIcon" className={openStatus}><Glyphicon glyph={openGlyph}/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon className={itemIndent}></InputGroup.Addon>
                    <div id="editorReadOnly" className={"readOnlyItem " + itemStyle}  onClick={ () => this.setCurrentComponent()}>
                        <Editor
                            editorState={this.state.editorState}
                            handleKeyCommand={this.handleTitleKeyCommand}
                            keyBindingFn={this.keyBindings}
                            spellCheck={false}
                            ref="editorReadOnly"
                            readOnly={true}
                        />
                    </div>
                    <InputGroup.Addon id="actionEdit" onClick={ () => this.editComponentName()}>
                        <OverlayTrigger overlay={tooltipEdit}>
                            <div className="blue"><Glyphicon glyph="edit"/></div>
                        </OverlayTrigger>
                    </InputGroup.Addon>
                    <InputGroup.Addon id="actionDelete" onClick={ () => this.deleteRestoreComponent(view, mode, currentItem, userContext)}>
                        <div className={deleteStyle}><Glyphicon id="deleteIcon" glyph={deleteGlyph}/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon>
                        <div className="invisible"><Glyphicon glyph="star"/></div>
                    </InputGroup.Addon>
                </InputGroup>
            </div>;

        let viewOnlyVersionProgressHeader =
            <div id="editorHeaderItem">
                <InputGroup onClick={ () => this.setCurrentComponent()}>
                    <InputGroup.Addon>
                        <OverlayTrigger placement="bottom" overlay={tooltipUpdateStatus}>
                            <div id="updateStatusIcon" className={updateStatusClass}></div>
                        </OverlayTrigger>
                    </InputGroup.Addon>
                    <InputGroup.Addon id="openClose"  onClick={ () => this.toggleOpen()}>
                        <div className={openStatus}><Glyphicon glyph={openGlyph}/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon className={itemIndent}></InputGroup.Addon>
                    <div id="editorReadOnly" className={"readOnlyItem " + itemStyle + updateTextClass} >
                        <Editor
                            editorState={this.state.editorState}
                            customStyleMap={ClientTextEditorServices.getColourMap()}
                            spellCheck={false}
                            ref="editorViewMode"
                            readOnly={true}
                        />
                    </div>
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
            case DisplayContext.UPDATE_VIEW:
            case DisplayContext.WP_VIEW:
                // View only
                designComponentElement = viewOnlyHeader;
                break;
            case DisplayContext.WORKING_VIEW:
                // Progress view
                designComponentElement = viewOnlyVersionProgressHeader;
                break;
            case DisplayContext.UPDATE_EDIT:
                // Component displayed as part of Editor
                switch (mode){
                    case  ViewMode.MODE_VIEW:
                        // View only
                        designComponentElement = viewOnlyHeader;
                        break;

                    case ViewMode.MODE_EDIT:
                        // Only editable if in scope for an update.  For new design all is in scope.
                        if(inScope) {
                            // Editable component
                            if (this.state.editable) {
                                // Being edited now...
                                designComponentElement = editingHeader;

                            } else {
                                // Not being edited now
                                designComponentElement = draggableHeader;
                            }
                        } else {
                            // Item is out of scope so cannot be edited or dragged
                            designComponentElement = viewOnlyHeader;
                        }
                        break;
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
                        if (this.state.editable) {
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
                        designComponentElement = viewOnlyHeader;
                        break;

                    case ViewMode.MODE_EDIT:
                        // Scenarios and new Feature Aspects are editable.
                        if(currentItem.componentType === ComponentType.SCENARIO || (currentItem.componentType === ComponentType.FEATURE_ASPECT && currentItem.isDevAdded)) {
                            // Editable component
                            if (this.state.editable) {
                                // Being edited now...
                                designComponentElement = editingHeader;

                            } else {
                                // Not being edited now
                                designComponentElement = nonDraggableHeader;
                            }
                        } else {
                            // Item is out of scope so cannot be edited or dragged
                            designComponentElement = viewOnlyHeader;
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
                        // Any failures at all it's a fail
                        if (testSummaryData.featureSummaryStatus === FeatureTestSummaryStatus.FEATURE_FAILING_TESTS) {
                            featureRowClass = 'scenario-test-row-fail'
                        } else {
                            // No failures so any passes its a pass for now
                            if (testSummaryData.featureSummaryStatus === FeatureTestSummaryStatus.FEATURE_PASSING_TESTS) {
                                featureRowClass = 'scenario-test-row-pass'
                            }
                        }
                    }

                    return(
                        <Grid id="featureTestSummary">
                            <Row className={featureRowClass}>
                                <Col md={7} className="close-col">
                                    <div id="headerItem">
                                        {designComponentElement}
                                    </div>
                                </Col>
                                <Col md={5} className="close-col">
                                    <FeatureTestSummary
                                        testSummaryData={testSummaryData}
                                    />
                                </Col>
                            </Row>
                        </Grid>
                    );
                    break;

                case ComponentType.SCENARIO:
                    // Scenario level test summary

                    let rowClass = 'scenario-test-row-untested';

                    if(testSummaryData) {
                        // Any failures at all it's a fail
                        if (testSummaryData.accTestStatus === MashTestStatus.MASH_FAIL || testSummaryData.intTestStatus === MashTestStatus.MASH_FAIL || testSummaryData.unitTestFailCount > 0) {
                            rowClass = 'scenario-test-row-fail'
                        } else {
                            // No failures so any passes its a pass for now
                            if (testSummaryData.accTestStatus === MashTestStatus.MASH_PASS || testSummaryData.intTestStatus === MashTestStatus.MASH_PASS || testSummaryData.unitTestPassCount > 0) {
                                rowClass = 'scenario-test-row-pass'
                            }
                        }
                    }

                    return(
                        <Grid id="scenarioTestSummary">
                            <Row className={rowClass}>
                                <Col md={7} className="close-col">
                                    <div id="headerItem">
                                        {designComponentElement}
                                    </div>
                                </Col>
                                <Col md={5} className="close-col">
                                    <TestSummary
                                        testSummaryData={testSummaryData}
                                    />
                                </Col>
                            </Row>
                        </Grid>
                    );
                    break;
                default:
                    return(
                        <Grid>
                            <Row className="non-summary-row">
                                <Col md={7} className="close-col">
                                    <div id="headerItem">
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
                <div id="headerItem">
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
    testDataFlag: PropTypes.bool.isRequired
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
                    case ViewType.DESIGN_NEW_EDIT:
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
                    case ViewType.DESIGN_NEW_EDIT:
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



