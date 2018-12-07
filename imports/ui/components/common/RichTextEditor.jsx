// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import {ViewMode, ViewType, UpdateScopeType, DetailsType, LogLevel} from '../../../constants/constants.js';
import {DefaultRawContent} from "../../../constants/default_names";

import { ClientDomainDictionaryServices }   from '../../../apiClient/apiClientDomainDictionary.js';
import { ClientTextEditorServices }         from '../../../apiClient/apiClientTextEditor.js';
import { log }                          from '../../../common/utils.js'

// Bootstrap
import {Glyphicon} from 'react-bootstrap';
import {Button, ButtonGroup} from 'react-bootstrap';
import {Grid, Col, Row} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// Draft JS
import {Editor, EditorState, ContentState, RichUtils, DefaultDraftBlockRenderMap, convertFromRaw, convertToRaw, CompositeDecorator} from 'draft-js';
import {DisplayContext} from "../../../constants/constants";

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Text Editor Component - For displaying / editing long text related to design components
//
// ---------------------------------------------------------------------------------------------------------------------


// -- DECORATOR CODE ---------------------------------------------------------------------------------------------------


const styles = {
    domainTerm: {
        color: 'rgba(96, 96, 255, 1.0)',
        fontWeight: 'normal'
    }
};

const DomainSpan = (props) => {
    const {properties} = props;
    return <span {...properties} style={styles.domainTerm}>{props.children}</span>;  //
};


// -- DECORATOR CODE ---------------------------------------------------------------------------------------------------


export class RichTextEditor extends Component {

    constructor(props) {
        super(props);
        //console.log("Cons tructing...");

        this.onChange = (editorState) => this.setState({editorState});
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this.toggleBlockType = (type) => this._toggleBlockType(type);

        this.focus = () => this.refs.editor.focus();

        this.state = {
            editing: false,
            editorState: EditorState.createEmpty()
        };
    }

    shouldComponentUpdate(){
        return true;
    }

    // Set the text editor content
    updateComponentText(props){
        let compositeDecorator = null;

        if(props.userContext && props.domainTermsVisible) {
            compositeDecorator = new CompositeDecorator([
                {
                    strategy: ClientDomainDictionaryServices.getDomainTermDecoratorFunction(props.userContext.designVersionId),
                    component: DomainSpan,
                }
            ]);

            EditorState.set(this.state.editorState, {decorator: compositeDecorator});
        } else {
            //console.log("User context NULL");
        }

        let currentContent = {};
        let defaultContent = {};

        // console.log("Design component raw text is: " + props.designComponent.componentRawText);
        // console.log("View is: " + props.view);
        // console.log("Context is: " + props.context);

        if (props.rawText) {
            currentContent = convertFromRaw(props.rawText);
            if (currentContent.hasText()) {
                this.state = {editorState: EditorState.createWithContent(currentContent, compositeDecorator)};
            } else {
                defaultContent = convertFromRaw(DefaultRawContent);
                this.state = {editorState: EditorState.createWithContent(defaultContent, compositeDecorator)};
            }
        } else {
            defaultContent = convertFromRaw(DefaultRawContent);
            this.state = {editorState: EditorState.createWithContent(defaultContent, compositeDecorator)};
        }
    }

    // Set the editor text when it is first created...
    componentWillMount(){
        this.updateComponentText(this.props);
    }

    // When the design component related to the text editor changes we need to update the editor state to the new text
    componentWillReceiveProps(newProps){

        if (
            (this.props.domainTermsVisible !== newProps.domainTermsVisible) ||
            (this.props.userContext.designComponentId !== newProps.userContext.designComponentId)
        ){
            this.updateComponentText(newProps);
        }
    }

    // Handles keyboard formatting
    handleKeyCommand(command) {
        //console.log("Handle key command...");
        //const {editorState} = this.state;
        const newState = RichUtils.handleKeyCommand(this.state.editorState, command);

        if (newState) {
            //console.log("New state...");
            this.onChange(newState);
            return true;
        }
        return false;
    }

    onEdit(){
        event.preventDefault();
        this.setState({editing: true});
    }

    onBoldClick(){
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
    }

    onItalicClick(){
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
    }

    onUnderlineClick(){
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
    }

    onCodeClick(){
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'CODE'));
    }

    // Saves editor text to the appropriate place
    onSave(andClose){

        let rawText = convertToRaw(this.state.editorState.getCurrentContent());

        this.props.saveFunction(rawText);

        // Close editor
        if (andClose) {
            this.setState({editing: false});
        }
    }

    onUndo(){
        event.preventDefault();
        //console.log("UNDO");
        this.updateComponentText(this.props);
        this.setState({editing: false});
    }

    toggleList(){
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                'unordered-list-item'
            )
        );
    }

    toggleRed(){
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                'RED'
            )
        );
    }

    toggleGreen(){
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                'GREEN'
            )
        );
    }

    render() {

        const {displayContext} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Rich Text Editor for context {}', displayContext);

        let editorHtml = '';
        let editorClass = 'editor-panel-large';

        if(displayContext === DisplayContext.DETAILS_NAME_EDITABLE || displayContext === DisplayContext.DETAILS_NAME_READ_ONLY){
            editorClass = 'editor-panel-small'
        }

        switch(displayContext){

            case DisplayContext.DETAILS_TEXT_READ_ONLY:
            case DisplayContext.DETAILS_NAME_READ_ONLY:
            case DisplayContext.ANOMALY_TEXT_READ_ONLY:

                // VIEW MODE

                editorHtml =
                    <Grid>
                        <Row>
                            <Col md={12} className={editorClass}>
                                <Editor
                                    editorState={this.state.editorState}
                                    customStyleMap={ClientTextEditorServices.getColourMap()}
                                    spellCheck={true}
                                    ref="editor-readonly"
                                    readOnly={true}
                                />
                            </Col>
                        </Row>
                    </Grid>;

                break;

            case DisplayContext.DETAILS_TEXT_EDITABLE:
            case DisplayContext.DETAILS_NAME_EDITABLE:
            case DisplayContext.ANOMALY_TEXT_EDITABLE:

                // EDIT MODE

                if(this.state.editing){
                    // The text is being edited
                    editorClass = editorClass + ' editor-panel-edit';

                    editorHtml =

                        <Grid className="close-grid">
                            <Row>
                                <Col md={12} className={editorClass}>
                                    <Editor
                                        editorState={this.state.editorState}
                                        customStyleMap={ClientTextEditorServices.getColourMap()}
                                        handleKeyCommand={this.handleKeyCommand}
                                        onChange={this.onChange}
                                        spellCheck={true}
                                        blockStyleFn={getBlockStyle}
                                        ref="editor"
                                        readOnly={false}
                                    />
                                </Col>
                            </Row>
                            <Row className="editor-toolbar">
                                <Col md={10}>
                                    <ButtonGroup>
                                        <Button bsSize="xs" onClick={ () => this.onBoldClick()}>
                                            <div className="blue"><Glyphicon glyph="bold"/></div>
                                        </Button>
                                        <Button bsSize="xs" onClick={ () => this.onItalicClick()}>
                                            <div className="blue"><Glyphicon glyph="italic"/></div>
                                        </Button>
                                        <Button bsSize="xs" onClick={ () => this.onUnderlineClick()}>
                                            <div className="blue">U</div>
                                        </Button>
                                        <Button bsSize="xs" onClick={ () => this.onCodeClick()}>
                                            <div className="blue"><Glyphicon glyph="th"/></div>
                                        </Button>
                                        <Button bsSize="xs" onClick={ () => this.toggleList()}>
                                            <div className="blue"><Glyphicon glyph="list"/></div>
                                        </Button>
                                    </ButtonGroup>
                                    <ButtonGroup>
                                        <Button bsSize="xs" onClick={ () => this.toggleRed()}>
                                            <div className="red"><Glyphicon glyph="tint"/></div>
                                        </Button>
                                        <Button bsSize="xs" onClick={ () => this.toggleGreen()}>
                                            <div className="green"><Glyphicon glyph="tint"/></div>
                                        </Button>
                                    </ButtonGroup>
                                    <ButtonGroup>
                                        <Button bsSize="xs" onClick={ () => this.onSave(false)}>
                                            <div className="green">Save</div>
                                        </Button>
                                    </ButtonGroup>
                                </Col>
                                <Col md={2}  className="toolbar-right">
                                    <ButtonGroup>
                                        <Button bsSize="xs" onClick={ () => this.onSave(true)}>
                                            <div className="green"><Glyphicon glyph="ok"/></div>
                                        </Button>
                                        <Button bsSize="xs" onClick={ () => this.onUndo()}>
                                            <div className="red"><Glyphicon glyph="remove"/></div>
                                        </Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                        </Grid>


                } else {
                    // The text is not being edited
                    editorHtml =
                        <Grid>
                            <Row>
                                <Col md={12} className={editorClass}>
                                    <Editor
                                        editorState={this.state.editorState}
                                        customStyleMap={ClientTextEditorServices.getColourMap()}
                                        spellCheck={true}
                                        ref="editor-readonly"
                                        readOnly={true}
                                    />
                                </Col>
                            </Row>
                            <Row className="editor-toolbar">
                                <Col md={10}>
                                </Col>
                                <Col md={2} className="toolbar-right">
                                    <ButtonGroup>
                                        <Button bsSize="xs" onClick={ () => this.onEdit()}>
                                            <div className="blue"><Glyphicon glyph="edit"/></div>
                                        </Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                        </Grid>
                }

                break;

            default:

                editorHtml =
                    <div>Unsupported display context</div>;

        }

        return (
            <div>
                {editorHtml}
            </div>
        );
    }
}

//  This is a redux updated property that changes when we change the focus on design components
RichTextEditor.propTypes = {
    rawText: PropTypes.object,
    saveFunction: PropTypes.func,
    displayContext: PropTypes.string.isRequired,
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        domainTermsVisible:     state.domainTermsVisible,
        userContext:            state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default RichTextEditor = connect(mapStateToProps)(RichTextEditor);


function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote': return 'RichEditor-blockquote';
        default: return null;
    }
}

