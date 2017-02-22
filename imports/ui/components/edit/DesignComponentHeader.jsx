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

class DesignComponentHeader extends Component{

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
                    nextProps.currentItem.componentName === this.props.currentItem.componentName &&
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
                    nextProps.designItem.isRemovable === this.props.designItem.isRemovable &&
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
            case DisplayContext.UPDATE_EDIT:
                this.setState({inScope: this.props.currentItem.isInScope});
                this.setState({parentScope: this.props.currentItem.isParentScope});
                break;
        }

        // New untouched items are editable unless they are new default feature aspects in a Design Update...
        switch (this.props.view) {
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DEVELOP_BASE_WP:
                // A new component is automatically editable
                if (this.props.designItem.isNew) {
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
                if (newProps.currentItem.componentName != this.props.currentItem.componentName) {
                    this.updateTitleText(newProps, newProps.currentItem.componentNameRaw);
                }

                // if(newProps.currentProgressDataValue != this.props.currentProgressDataValue) {
                //     this.getProgressData(newProps.currentItem, newProps.userContext, newProps.view);
                // }

                break;

            case ViewType.DESIGN_UPDATE_EDIT:
                if(this.props.displayContext === DisplayContext.BASE_VIEW){
                    // Base view.  Should not be updating
                    if (newProps.currentItem.componentName != this.props.currentItem.componentName) {
                        this.updateTitleText(newProps, newProps.currentItem.componentNameRaw);
                    }
                } else {
                    // For updates we use the new name.  Also update if scope changes so decoration is redone.
                    if(
                        newProps.currentItem.componentNameNew != this.props.currentItem.componentNameNew ||
                        newProps.currentItem.isInScope != this.props.currentItem.isInScope
                    ){
                        this.updateTitleText(newProps, newProps.currentItem.componentNameRawNew);
                    }

                    // Reflect any changes in scope
                    this.setState({inScope: newProps.currentItem.isInScope});
                    this.setState({parentScope: newProps.currentItem.isParentScope});

                }
                break;

            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
                if(this.props.displayContext === DisplayContext.WP_SCOPE){
                    this.setState({inScope: newProps.currentItem.componentParent || newProps.currentItem.componentActive});
                }
                this.updateTitleText(newProps, newProps.designItem.componentNameRaw);
                break;

            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                if(newProps.displayContext === DisplayContext.WP_SCOPE){
                    this.setState({inScope: newProps.currentItem.componentParent || newProps.currentItem.componentActive});
                }
                this.updateTitleText(newProps, newProps.designItem.componentNameRawNew);
                break;
            case ViewType.DEVELOP_BASE_WP:
                this.updateTitleText(newProps, newProps.designItem.componentNameRaw);
                break;
            case ViewType.DEVELOP_UPDATE_WP:
                this.updateTitleText(newProps, newProps.designItem.componentNameRawNew);
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

        // For Work Package items the item needed for decoration is the Design Item
        if(
            props.displayContext === DisplayContext.WP_SCOPE ||
            props.displayContext === DisplayContext.WP_VIEW ||
            props.displayContext === DisplayContext.DEV_DESIGN
        ){
            item = props.designItem;
        }

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

                    existingRawText = props.currentItem.componentNameRaw;
                    break;
                case ViewType.DESIGN_UPDATABLE_VIEW:
                    // If there is an item whose name has changed then create a new editor entry showing both
                    console.log("Component name: " + item.componentName + " Update Item: " + props.updateItem);
                    if(props.updateItem){
                        if(props.updateItem.componentNameOld != item.componentName) {
                            existingRawText = this.getNewAndOldRawText(item.componentName, props.updateItem.componentNameOld);
                        } else {
                            existingRawText = props.currentItem.componentNameRaw;
                        }
                    } else {
                        existingRawText = props.currentItem.componentNameRaw;
                    }
                    break;
                case ViewType.DESIGN_UPDATE_EDIT:
                case ViewType.DESIGN_UPDATE_VIEW:

                    if(props.displayContext === DisplayContext.BASE_VIEW){
                        // Base view
                        existingRawText = props.currentItem.componentNameRaw;
                    } else {
                        // For updates and work packages make sure we are always using the new name...
                        existingRawText = props.currentItem.componentNameRawNew
                    }
                    break;

                case ViewType.WORK_PACKAGE_BASE_EDIT:
                case ViewType.WORK_PACKAGE_BASE_VIEW:
                case ViewType.DEVELOP_BASE_WP:
                    // For Design WP name data comes from original Design Component
                    existingRawText = props.designItem.componentNameRaw;
                    break;

                case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                case ViewType.DEVELOP_UPDATE_WP:
                    // For Update WP name data comes from original Design Update Component
                    existingRawText = props.designItem.componentNameRawNew;
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

        let item = this.props.designItem;

        let result = {};

        // What is saved depends on the context
        switch (view){
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DEVELOP_BASE_WP:
                // Updates to the base design
                result = ClientDesignComponentServices.updateComponentName(view, mode, item._id, plainText, rawText);
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
                // Updates to a design update
                result = ClientDesignUpdateComponentServices.updateComponentName(view, mode, item._id, plainText, rawText);
                break;

            case ViewType.DEVELOP_UPDATE_WP:
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
    toggleScope(view, mode, context, userItemContext, currentItem){

        //TODO: warning box if descoping changed item - do you want to revert to base view?

        let newScope = !this.state.inScope;

        switch(view){
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                // Update the WP components
                if (ClientWorkPackageComponentServices.toggleInScope(view, context, currentItem._id, newScope)){
                    this.setState({inScope: newScope});
                }
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
                // Update the Design Update components
                if (ClientDesignUpdateComponentServices.toggleInScope(view, mode, context, currentItem, newScope)){
                    this.setState({inScope: newScope});
                }
        }

    };

    // getProgressData(currentItem, userContext, view){
    //     switch(view){
    //         case ViewType.DESIGN_NEW_EDIT:
    //         case ViewType.DESIGN_PUBLISHED_VIEW:
    //             this.setState({progressData: ClientDesignComponentServices.getProgressData(currentItem, userContext)});
    //             break;
    //         case ViewType.DESIGN_UPDATE_EDIT:
    //         case ViewType.DESIGN_UPDATE_VIEW:
    //             // TODO
    //     }
    // }

    // Render the header of the design component - has tools in it depending on context
    render(){
        const {currentItem, designItem, updateItem, displayContext, connectDragSource, connectDragPreview, isDragging, view, mode, userContext, testSummary, testSummaryData, isOpen} = this.props;

        // TODO - add all the tooltips required
        const tooltipEdit = (
            <Tooltip id="modal-tooltip">
                Edit...
            </Tooltip>
        );


        // Determine the look of the item ------------------------------------------------------------------------------

        // Delete item greyed out if not removable but not if logically deleted in update  || (currentItem.isRemoved && view === ViewType.EDIT_UPDATE)
        let deleteStyle = designItem.isRemovable ? 'red' : 'lgrey';


        // For Work Packages only stuff added in WP is removable
        if(view === ViewType.DEVELOP_BASE_WP || view === ViewType.DEVELOP_UPDATE_WP){
            deleteStyle = designItem.isRemovable && (designItem.isDevAdded || designItem.isDevUpdated) ? 'red' : 'lgrey';
        }

        // All items are in scope...
        let inScope = true;
        let isDeleted = false;
        let deleteGlyph = 'remove'; // Normal glyph for delete button

        // Unless editing an update where scope is set
        if(view === ViewType.DESIGN_UPDATE_EDIT){
            // The update scope is anything that is not scopable or anything that is and is in scope....
            inScope = (currentItem.isInScope || !currentItem.isScopable);
            isDeleted = currentItem.isRemoved;

            // For logically deleted items, show the undo icon...
            if(isDeleted){
                deleteGlyph = 'arrow-left';
            }
        }

        let itemStyle = getComponentClass(currentItem, view, displayContext, false);

        // Grey out original item when it is being dragged
        if(isDragging){
            itemStyle = itemStyle + ' dragging-item';
        }

        let openGlyph = isOpen ? 'minus' :'plus';

        let openStatus = isOpen ? 'open-status-open' : 'open-status-closed';
        if(currentItem.componentType === ComponentType.SCENARIO){
            openStatus = 'invisible';
        }

        let scopeStatus = this.state.inScope ? 'in-scope' : 'out-scope';

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
            <div>
                <InputGroup>
                    <InputGroup.Addon onClick={ () => this.toggleOpen()}>
                        <div className={openStatus}><Glyphicon glyph={openGlyph}/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon className={itemIndent}></InputGroup.Addon>
                    <InputGroup.Addon onClick={ () => this.toggleScope(view, mode, displayContext, userContext, currentItem)}>
                        <div className={scopeStatus}><Glyphicon glyph="ok"/></div>
                    </InputGroup.Addon>
                    <div className={"readOnlyItem " + itemStyle} onClick={ () => this.setCurrentComponent()}>
                        <Editor
                            editorState={this.state.editorState}
                            spellCheck={true}
                            ref="editorReadOnly"
                            readOnly={true}
                        />
                    </div>
                </InputGroup>
            </div>;

        let viewOnlyScopeHeader =
            <div>
                <InputGroup>
                    <InputGroup.Addon onClick={ () => this.toggleOpen()}>
                        <div className={openStatus}><Glyphicon glyph={openGlyph}/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon>
                        <div className="invisible"><Glyphicon glyph="star"/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon className={itemIndent}></InputGroup.Addon>
                    <div className={"readOnlyItem " + itemStyle} onClick={ () => this.setCurrentComponent()}>
                        <Editor
                            editorState={this.state.editorState}
                            spellCheck={false}
                            ref="editorReadOnly"
                            readOnly={true}
                        />
                    </div>
                </InputGroup>
            </div>;

        let viewOnlyHeader =
            <div>
                <InputGroup onClick={ () => this.setCurrentComponent()}>
                    <InputGroup.Addon onClick={ () => this.toggleOpen()}>
                        <div className={openStatus}><Glyphicon glyph={openGlyph}/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon className={itemIndent}></InputGroup.Addon>
                    <div className={"readOnlyItem " + itemStyle} >
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
            <div>
                <InputGroup onClick={ () => this.setCurrentComponent()}>
                    <InputGroup.Addon>
                        <div className="invisible"><Glyphicon glyph="star"/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon className={itemIndent}></InputGroup.Addon>
                    <div className="editableItem">
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
                    <InputGroup.Addon onClick={ () => this.saveComponentName(view, mode)}>
                        <div className="green"><Glyphicon glyph="ok"/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon onClick={ () => this.undoComponentNameChange()}>
                        <div className="red"><Glyphicon glyph="arrow-left"/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon>
                        <div className="invisible"><Glyphicon glyph="star"/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon>
                        <div className="invisible"><Glyphicon glyph="star"/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon>
                        <div className="invisible"><Glyphicon glyph="star"/></div>
                    </InputGroup.Addon>
                </InputGroup>
            </div>;

        let draggableHeader =
            connectDragPreview(
                <div>
                    <InputGroup>
                        <InputGroup.Addon onClick={ () => this.toggleOpen()}>
                            <div className={openStatus}><Glyphicon glyph={openGlyph}/></div>
                        </InputGroup.Addon>
                        <InputGroup.Addon className={itemIndent}></InputGroup.Addon>
                        <div className={"readOnlyItem " + itemStyle}  onClick={ () => this.setCurrentComponent()}>
                            <Editor
                                editorState={this.state.editorState}
                                handleKeyCommand={this.handleTitleKeyCommand}
                                keyBindingFn={this.keyBindings}
                                spellCheck={false}
                                ref="editorReadOnly"
                                readOnly={true}
                            />
                        </div>
                        <InputGroup.Addon onClick={ () => this.editComponentName()}>
                            <OverlayTrigger overlay={tooltipEdit}>
                                <div className="blue"><Glyphicon glyph="edit"/></div>
                            </OverlayTrigger>
                        </InputGroup.Addon>
                        <InputGroup.Addon onClick={ () => this.deleteRestoreComponent(view, mode, designItem, userContext)}>
                            <div className={deleteStyle}><Glyphicon glyph={deleteGlyph}/></div>
                        </InputGroup.Addon>
                        <InputGroup.Addon>
                            {connectDragSource(
                                <div className="lgrey">
                                    <Glyphicon glyph="move"/>
                                </div>)
                            }
                        </InputGroup.Addon>
                    </InputGroup>
                </div>
            );

        let nonDraggableHeader =
            <div>
                <InputGroup>
                    <InputGroup.Addon onClick={ () => this.toggleOpen()}>
                        <div className={openStatus}><Glyphicon glyph={openGlyph}/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon className={itemIndent}></InputGroup.Addon>
                    <div className={"readOnlyItem " + itemStyle}  onClick={ () => this.setCurrentComponent()}>
                        <Editor
                            editorState={this.state.editorState}
                            handleKeyCommand={this.handleTitleKeyCommand}
                            keyBindingFn={this.keyBindings}
                            spellCheck={false}
                            ref="editorReadOnly"
                            readOnly={true}
                        />
                    </div>
                    <InputGroup.Addon onClick={ () => this.editComponentName()}>
                        <OverlayTrigger overlay={tooltipEdit}>
                            <div className="blue"><Glyphicon glyph="edit"/></div>
                        </OverlayTrigger>
                    </InputGroup.Addon>
                    <InputGroup.Addon onClick={ () => this.deleteRestoreComponent(view, mode, designItem, userContext)}>
                        <div className={deleteStyle}><Glyphicon glyph={deleteGlyph}/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon>
                        <div className="invisible"><Glyphicon glyph="star"/></div>
                    </InputGroup.Addon>
                </InputGroup>
            </div>;

        let viewOnlyVersionProgressHeader =
            <div>
                <InputGroup onClick={ () => this.setCurrentComponent()}>
                    <InputGroup.Addon>
                        <OverlayTrigger placement="bottom" overlay={tooltipUpdateStatus}>
                            <div className={updateStatusClass}></div>
                        </OverlayTrigger>
                    </InputGroup.Addon>
                    <InputGroup.Addon onClick={ () => this.toggleOpen()}>
                        <div className={openStatus}><Glyphicon glyph={openGlyph}/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon className={itemIndent}></InputGroup.Addon>
                    <div className={"readOnlyItem " + itemStyle + updateTextClass} >
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
                if(currentItem.isScopable) {
                    // Scope selectable Item
                    designComponentElement = headerWithCheckbox;
                } else {
                    // Scope non selectable Item
                    designComponentElement = viewOnlyScopeHeader;
                }
                break;
            case DisplayContext.BASE_VIEW:
            case DisplayContext.UPDATE_VIEW:
            case DisplayContext.WP_VIEW:
                // View only
                designComponentElement = viewOnlyHeader;
                break;
            case DisplayContext.UPDATABLE_VIEW:
                // Progress view
                designComponentElement = viewOnlyVersionProgressHeader;
                break;
            case DisplayContext.UPDATE_EDIT:
            case DisplayContext.BASE_EDIT:
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
                            if (this.state.editable  && inScope) {
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
            case DisplayContext.DEV_DESIGN:
                // Scenarios are editable
                switch (mode){
                    case  ViewMode.MODE_VIEW:
                        // View only
                        designComponentElement = viewOnlyHeader;
                        break;

                    case ViewMode.MODE_EDIT:
                        // Scenarios and new Feature Aspects are editable.
                        if(designItem.componentType === ComponentType.SCENARIO || (designItem.componentType === ComponentType.FEATURE_ASPECT && designItem.isDevAdded)) {
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
                        <Grid>
                            <Row className={featureRowClass}>
                                <Col md={7} className="close-col">
                                    {designComponentElement}
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
                        <Grid>
                            <Row className={rowClass}>
                                <Col md={7} className="close-col">
                                    {designComponentElement}
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
                                    {designComponentElement}
                                </Col>
                                <Col md={5} className="close-col">
                                </Col>
                            </Row>
                        </Grid>
                    );
            }
        } else {
            return(designComponentElement);
        }

    }
}

// Additional properties are added by React DnD collectSource
DesignComponentHeader.propTypes = {
    currentItem: PropTypes.object.isRequired,
    designItem: PropTypes.object.isRequired,
    updateItem: PropTypes.object,
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
    //currentViewDataValue: PropTypes.bool.isRequired,
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
DesignComponentHeader = DragSource(ComponentType.DRAGGABLE_ITEM, componentSource, collectSource)(DesignComponentHeader);

// =====================================================================================================================


export default DesignComponentHeader;


