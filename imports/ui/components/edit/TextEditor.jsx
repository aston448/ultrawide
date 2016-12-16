// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import {ViewMode, ViewType, DisplayContext, ComponentType} from '../../../constants/constants.js';
import ClientDomainDictionaryServices from '../../../apiClient/apiClientDomainDictionary.js';

// Bootstrap
import {Glyphicon} from 'react-bootstrap';
import {Button, ButtonGroup} from 'react-bootstrap';
import {Grid, Col, Row} from 'react-bootstrap';

// Draft JS
import {Editor, EditorState, ContentState, RichUtils, DefaultDraftBlockRenderMap, convertFromRaw, convertToRaw, CompositeDecorator} from 'draft-js';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Text Editor Component - For displaying / editing long text related to design components
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


export default class TextEditor extends React.Component {

    constructor(props) {
        super(props);
        //console.log("Cons tructing...");

        this.onChange = (editorState) => this.setState({editorState});
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this.toggleBlockType = (type) => this._toggleBlockType(type);

        this.focus = () => this.refs.editor.focus();

        this.state = {
            editable: false,
            editorState: EditorState.createEmpty()
        };
    }

    // Set the text editor content - this has to change when the design component item changes
    // Passing in props as they could be the current or the new props...
    updateComponentText(props){
        let compositeDecorator = null;

        if(props.userContext) {
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
        let actualText = '';

        // console.log("Design component raw text is: " + props.designComponent.componentRawText);
        // console.log("View is: " + props.view);
        // console.log("Context is: " + props.context);

        let rawText = null;
        switch(props.view){
            case ViewType.DESIGN_PUBLISHED_VIEW:
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.DEVELOP_BASE_WP:
                rawText = props.designComponent.componentTextRaw;
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
            case ViewType.DEVELOP_UPDATE_WP:
                if(props.context === DisplayContext.BASE_VIEW){
                    rawText = props.designComponent.componentTextRaw;
                } else {
                    // For update text always look at the new value
                    rawText = props.designComponent.componentTextRawNew;
                }
                break;

            default:
                console.log("Unknown View Type!");
        }

        if (rawText) {
            currentContent = convertFromRaw(rawText);
            if (currentContent.hasText()) {
                this.state = {editorState: EditorState.createWithContent(currentContent, compositeDecorator)};
            } else {
                //console.log("Using default content: " + defaultRawContent.toString());
                defaultContent = convertFromRaw(defaultRawContent);
                this.state = {editorState: EditorState.createWithContent(defaultContent, compositeDecorator)};
            }
        } else {
            //console.log("Using default content: " + defaultRawContent.toString());
            defaultContent = convertFromRaw(defaultRawContent);
            this.state = {editorState: EditorState.createWithContent(defaultContent, compositeDecorator)};
        }
    }

    // Set the editor text when it is first created...
    componentWillMount(){
        this.updateComponentText(this.props);
    }

    // When the design component related to the text editor changes we need to update the editor state to the new text
    componentWillReceiveProps(newProps){
        // Only if the design component changes...
        if (this.props.designComponent._id != newProps.designComponent._id){
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
        this.setState({editable: true});
    }

    // Bold button handler
    onBoldClick(){
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
        //this.focus();
    }

    // Saves editor text to design component as RAW
    onSave(andClose){
        //console.log("SAVE");
        let rawText = convertToRaw(this.state.editorState.getCurrentContent());
        Meteor.call('textEditor.saveText', this.props.designComponent._id, rawText);
        if (andClose) {
            this.setState({editable: false});
        }
    }

    onUndo(){
        event.preventDefault();
        //console.log("UNDO");
        this.updateComponentText(this.props);
        this.setState({editable: false});
    }

    toggleList(){

        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                'unordered-list-item'
            )
        );
    }

    render() {
        //console.log("Rendering...");

        const { designComponent, mode, view, context} = this.props;

        let editorHtml = '';
        let editorClass = 'editor-panel-large';

        // Smaller text editor for Scenarios because of Scenario Steps
        if(designComponent.componentType === ComponentType.SCENARIO){
            editorClass = 'editor-panel-small';
        }

        if (mode === ViewMode.MODE_VIEW || context === DisplayContext.BASE_VIEW){
            // VIEW MODE

            editorHtml =
                <div className={editorClass}>
                    <Editor
                        editorState={this.state.editorState}
                        spellCheck={false}
                        ref="editor-readonly"
                        readOnly={true}
                    />
                </div>

        } else {
            // EDIT MODE

            if(this.state.editable){
                // The text is being edited
                editorClass = editorClass + ' editor-panel-edit';

                editorHtml =
                    <div>
                        <div className={editorClass}  >
                            <Editor
                                editorState={this.state.editorState}
                                handleKeyCommand={this.handleKeyCommand}
                                onChange={this.onChange}
                                spellCheck={true}
                                blockStyleFn={getBlockStyle}
                                ref="editor"
                                readOnly={false}
                            />
                        </div>
                        <div className="editor-toolbar">
                            <Grid className="close-grid">
                                <Row>
                                    <Col md={10}>
                                        <ButtonGroup>
                                            <Button bsSize="xs" onClick={ () => this.onBoldClick()}>
                                                <div className="blue"><Glyphicon glyph="bold"/></div>
                                            </Button>
                                            <Button bsSize="xs" onClick={ () => this.onBoldClick()}>
                                                <div className="blue"><Glyphicon glyph="italic"/></div>
                                            </Button>
                                            <Button bsSize="xs" onClick={ () => this.onBoldClick()}>
                                                <div className="blue"><Glyphicon glyph="underscore"/></div>
                                            </Button>
                                            <Button bsSize="xs" onClick={ () => this.toggleList()}>
                                                <div className="blue">UL</div>
                                            </Button>
                                            <Button bsSize="xs" onClick={ () => this.onSave(false)}>
                                                <div className="green">Save</div>
                                            </Button>
                                        </ButtonGroup>
                                    </Col>
                                    <Col md={2}>
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
                        </div>
                    </div>

            } else {
                // The text is not being edited
                editorHtml =
                    <div>
                        <div className={editorClass}>
                            <Editor
                                editorState={this.state.editorState}
                                spellCheck={true}
                                ref="editor-readonly"
                                readOnly={true}
                            />
                        </div>
                        <div className="editor-toolbar">
                            <ButtonGroup>
                                <Button bsSize="xs" onClick={ () => this.onEdit()}>
                                    <div className="blue"><Glyphicon glyph="edit"/></div>
                                </Button>
                            </ButtonGroup>
                        </div>
                    </div>
            }
        }

        return (<div>{editorHtml}</div>);
    }
}

//  This is a redux updated property that changes when we change the focus on design components
TextEditor.propTypes = {
    designComponent: PropTypes.object.isRequired,
    mode: PropTypes.string.isRequired,
    view: PropTypes.string.isRequired,
    context: PropTypes.string.isRequired,
    userContext: PropTypes.object.isRequired
};


function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote': return 'RichEditor-blockquote';
        default: return null;
    }
}


const defaultRawContent = {
    "entityMap" : {  },
    "blocks" : [
        { "key" : "5efv7", "text" : "Set your specification text here",
            "type" : "unstyled",
            "depth" : 0,
            "inlineStyleRanges" : [ ],
            "entityRanges" : [ ],
            "data" : {  }
        }
    ]
};
