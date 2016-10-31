// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components

// Ultrawide Services
import {ViewType, ComponentType, ViewMode} from '../../../constants/constants.js';
import ClientDomainDictionaryServices from '../../../apiClient/apiClientDomainDictionary.js';


// Bootstrap
import {InputGroup, FormControl, ControlLabel} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// Draft JS - definition is text editable
import {Editor, EditorState, ContentState, RichUtils, DefaultDraftBlockRenderMap, convertFromRaw, convertToRaw, getDefaultKeyBinding, KeyBindingUtil, CompositeDecorator} from 'draft-js';
const {hasCommandModifier} = KeyBindingUtil;

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Domain Dictionary Term Component - Graphically represents one Term in the Domain Dictionary
//
// ---------------------------------------------------------------------------------------------------------------------


// -- DECORATOR CODE ---------------------------------------------------------------------------------------------------

const styles = {
    domainTerm: {
        color: 'rgba(0, 0, 255, 1.0)',
        fontWeight: 'normal'
    }
};

const DomainSpan = (props) => {
    const {properties} = props;
    return <span {...properties} style={styles.domainTerm}>{props.children}</span>;  //
};

// -- DECORATOR CODE ---------------------------------------------------------------------------------------------------

class DomainDictionaryTerm extends Component {
    constructor(props) {
        super(props);


        this.state = {
            termEditable: false,
            definitionEditable: false,
            termNameValue: this.props.dictionaryTerm.domainTermNew,
            highlighted: false,
            editorState: EditorState.createEmpty()
        };

        this.onTextChange = (editorState) => this.setState({editorState});
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this.focus = () => {if(this.refs.editor){this.refs.editor.focus()}};

        this.updateText();
    }

    // Set up the view from persisted settings
    componentDidMount(){

        // New untouched items are editable...
        switch (this.props.view) {
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_UPDATE_EDIT:
                // A new component not yet changed is automatically editable
                if (this.props.dictionaryTerm.isNew && ! this.props.dictionaryTerm.isChanged) {
                    this.editTermName();
                }
                break;
        }
    }

    // Refresh the definition text
    updateText(newRawText){

        let compositeDecorator = new CompositeDecorator([
            {
                strategy:  ClientDomainDictionaryServices.getDomainTermDecoratorFunction(this.props.userContext.designVersionId),
                component: DomainSpan,
            }
        ]);

        EditorState.set(this.state.editorState, {decorator: compositeDecorator});

        let currentContent = {};

        if(newRawText){
            // Immediate update of latest text
            console.log("Updating definition with " + newRawText);
            currentContent = convertFromRaw(newRawText);


        } else {
            // Getting stored text
            let existingRawText = this.props.dictionaryTerm.domainTextRaw;

            if (existingRawText) {
                currentContent = convertFromRaw(existingRawText);
            } else {
                this.state = {editorState: EditorState.createEmpty(compositeDecorator)};
                return;
            }

        }

        // Got some content...
        console.log("Updating definition editor with " + currentContent.getPlainText());

        if (currentContent.hasText()) {
            console.log("recreating txt");
            this.state.editorState = EditorState.createWithContent(currentContent, compositeDecorator);
        } else {
            this.state = {editorState: EditorState.createEmpty(compositeDecorator)};
        }
    }

    // Handles keyboard actions when definition is editable
    keyBindings(e){

        // Allow Ctrl + S as Save
        if (e.keyCode === 83 /* `S` key */ && hasCommandModifier(e)) {
            return 'editor-save';
        }

        return getDefaultKeyBinding(e);
    }

    handleKeyCommand(command) {

        // Handle custom commands
        if(command === 'editor-save'){
            // Save the title on ENTER
            console.log("Saving...");

            this.onSaveTermDefinition(this.props.dictionaryTerm, this.props.view, this.props.mode);
            return true;
        }

        // Default key commands
        const newState = RichUtils.handleKeyCommand(this.state.editorState, command);

        if (newState) {
            console.log("New state...");
            this.onTextChange(newState);
            return true;
        }
        return false;
    }

    handleNameChange(event) {
        this.setState({termNameValue: event.target.value});
    }

    handleNameKeyEvents(event) {
        if(event.charCode === 13){
            // Enter Key
            this.onSaveTermName(this.props.dictionaryTerm, this.props.view, this.props.mode, this.state.termNameValue);
        }
    }

    // Start editing the term
    editTermName(){
        event.preventDefault();
        console.log("EDIT TERM");

        // Cancels any definition editing going on...
        //this.undoTermDefinitionEdit();

        this.setState({termEditable: true});
    }

    // Start editing the definition
    editTermDefinition(){
        event.preventDefault();
        console.log("EDIT DEFINITION");

        // Cancels any term editing going on
        //this.undoTermEdit();

        this.setState({definitionEditable: true});
    }

    // Cancel editing the term
    undoTermEdit(){
        event.preventDefault();
        console.log("UNDO");
        this.setState({termNameValue: this.props.dictionaryTerm.domainTermNew});
        this.setState({termEditable: false});
    }

    // Cancel editing the definition
    undoTermDefinitionEdit(){
        event.preventDefault();
        console.log("UNDO");

        // Reset the text in case changed on screen
        this.updateText();
        this.setState({definitionEditable: false});
    }

    // Set term as selected
    setCurrentTerm(){
        // TODO - will have to store current term
    }

    onSaveTermName(term, view, mode, newName){

        let success = ClientDomainDictionaryServices.updateDictionaryTerm(view, mode, term._id, newName);

        if(success){
            // Finished editing
            this.setState({termEditable: false});

            // On saving a new term name open the def editor
            if(term.isNew){
                this.editTermDefinition()
            }
        } else {
            console.log("Failed to update term name");
        }

    }

    // Save changes to the term definition
    onSaveTermDefinition(term, view, mode){
        event.preventDefault();
        console.log("UPDATE TERM DEFINITION");

        let plainText = this.state.editorState.getCurrentContent().getPlainText();
        let rawText = convertToRaw(this.state.editorState.getCurrentContent());

        let success = ClientDomainDictionaryServices.updateDictionaryTermDefinition(view, mode, term._id, rawText);

        if(success){
            // Finished editing
            this.setState({definitionEditable: false});
        } else {
            console.log("Failed to update definition");
        }

    }

    onDeleteTerm(term, view, mode){
        event.preventDefault();
        console.log("REMOVE TERM");

        let success = ClientDomainDictionaryServices.removeDictionaryTerm(view, mode, term._id);
    };


    render() {
        const {dictionaryTerm, view, mode, context} = this.props;

        // TODO - add all the tooltips required
        const tooltipEdit = (
            <Tooltip id="modal-tooltip">
                Edit...
            </Tooltip>
        );

        let nameEditorEditing =
            <div>
                <InputGroup>
                    <div className="editableItem">
                        <FormControl
                            type="text"
                            value={this.state.termNameValue}
                            placeholder={this.state.termNameValue}
                            onChange={(event) => this.handleNameChange(event)}
                            onKeyPress={(event) => this.handleNameKeyEvents(event)}
                        />
                    </div>
                    <InputGroup.Addon onClick={ () => this.onSaveTermName(dictionaryTerm, view, mode, this.state.termNameValue)}>
                        <div className="green"><Glyphicon glyph="ok"/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon onClick={ () => this.undoTermEdit()}>
                        <div className="red"><Glyphicon glyph="arrow-left"/></div>
                    </InputGroup.Addon>
                </InputGroup>
            </div>;

        let nameEditorNotEditing =
            <div onClick={ () => this.setCurrentTerm()}>
                <InputGroup>
                    <div className={"readOnlyItem"}>
                        <ControlLabel>{this.state.termNameValue}</ControlLabel>
                    </div>
                    <InputGroup.Addon onClick={ () => this.editTermName()}>
                        <div className="blue"><Glyphicon glyph="edit"/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon onClick={ () => this.onDeleteTerm(dictionaryTerm, view, mode)}>
                        <div className="red"><Glyphicon glyph="remove"/></div>
                    </InputGroup.Addon>
                </InputGroup>
            </div>;


        let definitionEditorEditing =
            <div>
                <InputGroup>
                    <div className="editableItem">
                        <Editor
                            editorState={this.state.editorState}
                            handleKeyCommand={this.handleKeyCommand}
                            keyBindingFn={this.keyBindings}
                            onChange={this.onTextChange}
                            spellCheck={true}
                            ref="editor"
                            readOnly={false}
                        />
                    </div>

                    <InputGroup.Addon onClick={ () => this.onSaveTermDefinition(dictionaryTerm, view, mode)}>
                        <div className="green"><Glyphicon glyph="ok"/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon onClick={ () => this.undoTermDefinitionEdit()}>
                        <div className="red"><Glyphicon glyph="arrow-left"/></div>
                    </InputGroup.Addon>
                </InputGroup>
            </div>;

        let definitionEditorNotEditing =

                <div className={"readOnlyItem"}>
                    <InputGroup>

                        <div  onClick={ () => this.setCurrentTerm()}>
                            <Editor
                                editorState={this.state.editorState}
                                spellCheck={false}
                                ref="editorReadOnly"
                                readOnly={true}
                            />
                        </div>

                        <InputGroup.Addon onClick={ () => this.editTermDefinition()}>
                            <OverlayTrigger overlay={tooltipEdit}>
                                <a href="#">
                                    <div className="blue"><Glyphicon glyph="edit"/></div>
                                </a>
                            </OverlayTrigger>
                        </InputGroup.Addon>
                    </InputGroup>
                </div>;

        let viewOnlyTerm =
            <div onClick={ () => this.setCurrentTerm()}>
                <InputGroup>
                    <div className={"readOnlyItem"}>
                        <ControlLabel>{this.state.termNameValue}</ControlLabel>
                    </div>
                </InputGroup>
            </div>;

        let viewOnlyDefinition =
            <div className={"readOnlyItem"}>
                <InputGroup>
                    <div  onClick={ () => this.setCurrentStep()}>

                        <div>
                            <Editor
                                editorState={this.state.editorState}
                                spellCheck={false}
                                ref="editorReadOnly"
                                readOnly={true}
                            />
                        </div>

                    </div>
                </InputGroup>
            </div>;


        if(mode === ViewMode.MODE_VIEW){
            // View mode on
            return (
                <div className="domain-item">
                    {viewOnlyTerm}
                    {viewOnlyDefinition}
                </div>
            )
        } else {
            // Editing allowed - only one of the items can be edited at a time...
            if (this.state.termEditable) {
                return (
                    <div className="domain-item">
                        {nameEditorEditing}
                        {definitionEditorNotEditing}
                    </div>
                )
            } else {
                if (this.state.definitionEditable) {
                    return (
                        <div className="domain-item">
                            {nameEditorNotEditing}
                            {definitionEditorEditing}
                        </div>
                    )
                } else {
                    return (
                        <div className="domain-item">
                            {nameEditorNotEditing}
                            {definitionEditorNotEditing}
                        </div>
                    )
                }
            }
        }
    }
}

DomainDictionaryTerm.propTypes = {
    dictionaryTerm: PropTypes.object.isRequired,
    domainTermDecorator: PropTypes.func
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        view: state.currentAppView,
        mode: state.currentViewMode,
        context: state.displayContext,
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
DomainDictionaryTerm = connect(mapStateToProps)(DomainDictionaryTerm);

export default DomainDictionaryTerm;