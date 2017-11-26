// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components
import TestSummary          from '../summary/TestSummary.jsx';
import FeatureTestSummary   from '../summary/FeatureTestSummary.jsx';

// Ultrawide Services
import ClientDesignServices                 from '../../../apiClient/apiClientDesign.js';
import ClientDesignUpdateComponentServices  from '../../../apiClient/apiClientDesignUpdateComponent.js';
import ClientWorkPackageComponentServices   from '../../../apiClient/apiClientWorkPackageComponent.js';
import ClientDomainDictionaryServices       from '../../../apiClient/apiClientDomainDictionary.js';
import ClientTextEditorServices             from '../../../apiClient/apiClientTextEditor.js';

import {ViewType, ComponentType, ViewMode, DisplayContext, WorkPackageType, WorkPackageScopeType, LogLevel,
    MashTestStatus, FeatureTestSummaryStatus, UpdateMergeStatus, UpdateScopeType} from '../../../constants/constants.js';
import {DefaultComponentNames}          from '../../../constants/default_names.js';
import {getComponentClass, log}         from '../../../common/utils.js';
import TextLookups                      from '../../../common/lookups.js'

// Bootstrap
import {Grid, Row, Col, InputGroup} from 'react-bootstrap';
import {Glyphicon}  from 'react-bootstrap';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';
import {Checkbox} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// React DnD - Component is draggable
import { DragSource } from 'react-dnd';

// Draft JS - Name is text editable
import {Editor, EditorState, ContentState, RichUtils, DefaultDraftBlockRenderMap, convertFromRaw, convertToRaw, getDefaultKeyBinding, KeyBindingUtil, CompositeDecorator} from 'draft-js';
import {RoleType} from "../../../constants/constants";
const {hasCommandModifier} = KeyBindingUtil;

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Default Feature Aspect Component - Represents an editable feature aspect in the defaults list
//
// ---------------------------------------------------------------------------------------------------------------------

export class DefaultFeatureAspect extends Component{

    constructor(...args){
        super(...args);

        this.state = {
            editing: false,
            highlighted: false,
            name: '',
            editorState: EditorState.createEmpty(),
        };

        this.onTitleChange = (editorState) => this.setState({editorState});
        this.handleTitleKeyCommand = this.handleTitleKeyCommand.bind(this);
        this.focus = () => {if(this.refs.editor){this.refs.editor.focus()}};

        this.updateTitleText(this.props);

    }

    shouldComponentUpdate(nextProps, nextState){

        return true;
    }

    // Set up the view from persisted settings
    componentDidMount(){

    }

    // If the name of an item has been updated it could be in another view of it so we need to update the local editor
    componentWillReceiveProps(newProps){

    }



    // Refresh the component name text
    updateTitleText(props, newRawText){

        let currentContent = null;
        let item = props.currentItem;


        if(newRawText){
            // Immediate update of latest text
            log((msg) => console.log(msg), LogLevel.TRACE, "Updating title editor with {}", newRawText);

            currentContent = convertFromRaw(newRawText);

        } else {
            // Getting stored text
            let existingRawText = item.defaultAspectNameRaw;

            if (existingRawText) {
                currentContent = convertFromRaw(existingRawText);
            } else {
                this.state = {editorState: EditorState.createEmpty()};
                return;
            }

        }

        // Got some content...
        if (currentContent && currentContent.hasText()) {
            log((msg) => console.log(msg), LogLevel.TRACE, "Updating title editor with {}", currentContent.getPlainText());
            this.state.name = currentContent.getPlainText();
            this.state.editorState = EditorState.createWithContent(currentContent);
        } else {
            this.state = {editorState: EditorState.createEmpty()};
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
            this.saveComponentName(this.props.currentItem, this.props.userContext, this.props.userRole);
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


    // Start editing the component name
    editComponentName(){

        log((msg) => console.log(msg), LogLevel.TRACE, "EDIT COMPONENT NAME");
        this.setState({editing: true});
    }

    // Cancel editing the component name
    undoComponentNameChange(){

        // Reset the text in case changed on screen
        this.updateTitleText(this.props);
        this.setState({editing: false});
    }


    // Save changes to the design component name
    saveComponentName(currentItem, userContext, userRole){

        let plainText = this.state.editorState.getCurrentContent().getPlainText();
        let rawText = convertToRaw(this.state.editorState.getCurrentContent());

        let result = {};

        result = ClientDesignServices.updateDefaultFeatureAspectName(currentItem, userContext, userRole, plainText, rawText);

        if(result.success){
            // Finished editing
            this.setState({editing: false});
        }

    }

    onIncludeAspectChange(currentItem, userRole){

        // Update current item to new state
        result = ClientDesignServices.updateDefaultFeatureAspectIncluded(currentItem, userRole, !currentItem.defaultAspectIncluded)
    }


    // Render the header of the design component - has tools in it depending on context
    render() {
        const {currentItem, userContext, userRole} = this.props;

        // Items -------------------------------------------------------------------------------------------------------

        const tooltipDelay = 1000;

        const tooltipEdit = (
            <Tooltip id="modal-tooltip">
                Edit...
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

        const hiddenIcon =
            <InputGroup.Addon>
                <div className="invisible"><Glyphicon glyph="star"/></div>
            </InputGroup.Addon>;

        const readOnlyCheckbox =
            <div id="readOnlyCheckbox" className={"feature-aspect readOnlyItem "}>
                <Checkbox id="optionIncludeAspect" checked={currentItem.defaultAspectIncluded} readOnly={true}>
                </Checkbox>
            </div>;

        const editableCheckbox =
            <div id="activeCheckbox" className={"feature-aspect readOnlyItem "}>
                <Checkbox id="optionIncludeAspect" checked={currentItem.defaultAspectIncluded}
                          onChange={() => this.onIncludeAspectChange(currentItem, userRole)}>
                </Checkbox>
            </div>;

        const editableEditor =
            <div id="editorEdit" className={'feature-aspect editableItem editBackground'}>
                <Editor
                    editorState={this.state.editorState}
                    handleKeyCommand={this.handleTitleKeyCommand}
                    keyBindingFn={this.keyBindings}
                    onChange={this.onTitleChange}
                    spellCheck={true}
                    ref="editor"
                    readOnly={false}
                />
            </div>;

        const readOnlyEditor =
            <div id="editorReadOnly" className={"feature-aspect readOnlyItem "}>
                <Editor
                    editorState={this.state.editorState}
                    spellCheck={true}
                    ref="editorReadOnly"
                    readOnly={true}
                />
            </div>;

        const editAction =
            <InputGroup.Addon id="actionEdit" onClick={ () => this.editComponentName()}>
                <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipEdit}>
                    <div className="blue"><Glyphicon glyph="edit"/></div>
                </OverlayTrigger>
            </InputGroup.Addon>;

        const saveAction =
            <InputGroup.Addon id="actionSave" onClick={ () => this.saveComponentName(currentItem, userContext, userRole)}>
                <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipSave}>
                    <div className="green"><Glyphicon glyph="ok"/></div>
                </OverlayTrigger>
            </InputGroup.Addon>;

        const undoAction =
            <InputGroup.Addon id="actionUndo" onClick={ () => this.undoComponentNameChange()}>
                <OverlayTrigger delayShow={tooltipDelay} placement="left" overlay={tooltipCancel}>
                    <div className="red"><Glyphicon glyph="arrow-left"/></div>
                </OverlayTrigger>
            </InputGroup.Addon>;

        const readOnlyItem =
            <div id="readOnlyItem">
                <Grid>
                    <Row>
                        <Col md={1} className="close-col">
                            {readOnlyCheckbox}
                        </Col>
                        <Col md={11} className="close-col">
                            <InputGroup>
                                {readOnlyEditor}
                                {hiddenIcon}
                                {hiddenIcon}
                            </InputGroup>
                        </Col>
                    </Row>
                </Grid>
            </div>;

        const editableItem =
            <div id="editableItem">
                <Grid>
                    <Row>
                        <Col md={1}>
                            {editableCheckbox}
                        </Col>
                        <Col md={11}>
                            <InputGroup>
                                {readOnlyEditor}
                                {editAction}
                                {hiddenIcon}
                            </InputGroup>
                        </Col>
                    </Row>
                </Grid>
            </div>;

        const editingItem =
            <div id="editableItem">
                <Grid>
                    <Row>
                        <Col md={1}>
                            {editableCheckbox}
                        </Col>
                        <Col md={11}>
                            <InputGroup>
                                {editableEditor}
                                {saveAction}
                                {undoAction}
                            </InputGroup>
                        </Col>
                    </Row>
                </Grid>
            </div>;


        // Layout ------------------------------------------------------------------------------------------------------

        if(userRole === RoleType.DESIGNER){
            if (this.state.editing){
                return(
                    <div>
                        {editingItem}
                    </div>
                )
            } else {
                return (
                    <div>
                        {editableItem}
                    </div>
                )
            }
        } else {
            return (
                <div>
                    {readOnlyItem}
                </div>
            )
        }

    }
}

// Additional properties are added by React DnD collectSource
DefaultFeatureAspect.propTypes = {
    currentItem: PropTypes.object.isRequired,

};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext:        state.currentUserItemContext,
        userRole:           state.currentUserRole
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(DefaultFeatureAspect);