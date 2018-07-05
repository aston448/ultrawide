// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import {ViewMode, ViewType, DisplayContext, UpdateScopeType, WorkPackageScopeType, LogLevel} from '../../../constants/constants.js';

import { ClientDesignComponentServices }            from '../../../apiClient/apiClientDesignComponent.js';
import { ClientDesignUpdateComponentServices }      from '../../../apiClient/apiClientDesignUpdateComponent.js';
import { ClientDomainDictionaryServices }                from '../../../apiClient/apiClientDomainDictionary.js';
import {getComponentClass, log}                 from '../../../common/utils.js';

// Bootstrap
import {InputGroup} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services

// Draft JS - Narrative is text editable
import {Editor, EditorState, ContentState, RichUtils, DefaultDraftBlockRenderMap, convertFromRaw, convertToRaw, getDefaultKeyBinding, KeyBindingUtil, CompositeDecorator} from 'draft-js';
import {ComponentUiModules} from "../../../ui_modules/design_component";
const {hasCommandModifier} = KeyBindingUtil;

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Narrative Component - Represents the narrative part of a Feature
//
// ---------------------------------------------------------------------------------------------------------------------

// -- DECORATOR CODE ---------------------------------------------------------------------------------------------------


// const styles = {
//     domainTerm: {
//         color: 'rgba(96, 96, 255, 1.0)',
//         fontWeight: 'normal'
//     },
//
//     narrativePart:
//     {
//         color: 'rgba(192, 0, 0, 1.0)',
//         fontWeight: 'normal'
//     },
//
//     narrativePartGrey:
//     {
//         color: 'rgba(192, 192, 192, 1.0)',
//         fontWeight: 'normal'
//     },
// };

// const DomainSpan = (props) => {
//     const {properties} = props;
//     return <span {...properties} style={styles.domainTerm}>{props.children}</span>;
// };
//
// const NarrativeSpan = (props) => {
//     const {properties} = props;
//     return <span {...properties} style={styles.narrativePart}>{props.children}</span>;
//
// };
//
// const NarrativeGreySpan= (props) => {
//     const {properties} = props;
//     return <span {...properties} style={styles.narrativePartGrey}>{props.children}</span>;
//
// };


// -- DECORATOR CODE ---------------------------------------------------------------------------------------------------

export default class Narrative extends React.Component {

    constructor(props) {
        super(props);

        this.onChange = (editorState) => this.setState({editorState});
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this.focus = () => {if(this.refs.editor){this.refs.editor.focus()}};

        this.state = {
            editing: false,
            editorState: EditorState.createEmpty()
        };

        //console.log(" NARRATIVE: " + props.designComponent.componentNameNew + " : " + props.designComponent.componentNarrativeNew);

        this.updateNarrativeText(props);

    }

    componentWillReceiveProps(newProps){

        // Update if toggling Domain Highlighting
        if(
            (newProps.domainTermsVisible !== this.props.domainTermsVisible) &&
            (!ComponentUiModules.narrativeIsGreyedOut(newProps.displayContext, newProps.wpComponent, newProps.updateComponent))
        ){
            this.updateNarrativeText(newProps);
        }

        if(newProps.designComponent.componentNarrativeNew !== this.props.designComponent.componentNarrativeNew){
            this.updateNarrativeText(newProps);
        }
    }

    // Set the text editor content - this has to change when the design component item changes
    // Passing in props as they could be the current or the new props...
    updateNarrativeText(props){

        const compositeDecorator = ComponentUiModules.getDecoratorForNarrative(props.displayContext, props.domainTermsVisible, props.designComponent, props.wpComponent, props.updateComponent);

        if(props.designComponent) {

            EditorState.set(this.state.editorState, {decorator: compositeDecorator});

        }

        let currentContent = {};
        let rawNarrative = null;

        if(props.displayOldValue){
            rawNarrative = props.designComponent.componentNarrativeRawOld;
        } else {
            rawNarrative = props.designComponent.componentNarrativeRawNew;
        }

        if (rawNarrative) {

            currentContent = convertFromRaw(rawNarrative);
            //console.log("Setting current narrative content as " + currentContent.getPlainText());
            if (currentContent.hasText()) {
                this.state = {editorState: EditorState.createWithContent(currentContent, compositeDecorator)};
            } else {
                this.state = {editorState: EditorState.createEmpty(compositeDecorator)}
            }
        } else {
            //console.log("NO RAW NARRATIVE");
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

        return getDefaultKeyBinding(e);
    }


    // Handles keyboard formatting
    handleKeyCommand(command) {
        //console.log("Handle key command...");
        //const {editorState} = this.state;

        // Handle custom commands
        if(command === 'editor-save'){
            // Save the title on ENTER
            //console.log("Saving...");

            this.saveNarrative(this.props.view, this.props.mode);
            return true;
        }

        const newState = RichUtils.handleKeyCommand(this.state.editorState, command);

        if (newState) {
            //console.log("New state...");
            this.onChange(newState);
            return true;
        }
        return false;
    }

    undoNarrativeChange(){
        event.preventDefault();
        //console.log("UNDO");
        this.updateNarrativeText(this.props);
        this.setState({editing: false});
    }

    editNarrative(){
        event.preventDefault();
        this.setState({editing: true});
    }

    saveNarrative(view, mode){
        event.preventDefault();
        //console.log("SAVE");
        let rawText = convertToRaw(this.state.editorState.getCurrentContent());
        let plainText = this.state.editorState.getCurrentContent().getPlainText();

        switch(view){
            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
                ClientDesignComponentServices.updateFeatureNarrative(view, mode, this.props.designComponent._id, plainText, rawText);
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
                ClientDesignUpdateComponentServices.updateFeatureNarrative(view, mode, this.props.updateComponent._id, plainText, rawText);
                break;

        }

        this.setState({editing: false});
    }

    blockStyles(contentBlock){
        //console.log("BLOCK STYLES with " + contentBlock.getType());
        // switch(contentBlock.getType()){
        //     case 'unstyled':
        //         return 'red';
        //     default:
        //         return contentBlock.getType();
        // }

    }

    render() {
        const {designComponent, updateComponent, wpComponent, mode, displayContext, view, testSummary} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Narrative {}', designComponent.componentNameNew);

        let itemStyle = getComponentClass(designComponent, updateComponent, wpComponent, view, displayContext, true);

        let narrativeHtml = '';

        if(
            mode === ViewMode.MODE_VIEW ||
            displayContext === DisplayContext.UPDATE_SCOPE ||
            displayContext === DisplayContext.BASE_VIEW ||
            displayContext === DisplayContext.WP_SCOPE ||
            displayContext === DisplayContext.WP_VIEW ||
            displayContext === DisplayContext.DEV_DESIGN ||
            (updateComponent && (updateComponent.scopeType === UpdateScopeType.SCOPE_PARENT_SCOPE)) ||
            (updateComponent && updateComponent.isRemoved)
        ){
            // VIEW MODE
            narrativeHtml =
                <InputGroup>
                    <div className={"readOnlyItem " + itemStyle}>
                        <Editor
                            editorState={this.state.editorState}
                            spellCheck={false}
                            ref="editorReadOnly"
                            blockStyleFn={this.blockStyles}
                            readOnly={true}
                        />
                    </div>
                </InputGroup>;

        } else {
            // EDIT MODE
            if (this.state.editing) {
                narrativeHtml =
                    <div className="narrative-edit">
                        <InputGroup>
                            <Editor
                                editorState={this.state.editorState}
                                handleKeyCommand={this.handleKeyCommand}
                                keyBindingFn={this.keyBindings}
                                onChange={this.onChange}
                                spellCheck={true}
                                ref="editor"
                                blockStyleFn={this.blockStyles}
                                readOnly={false}
                            />
                            <InputGroup.Addon id="actionSaveNarrative" onClick={ () => this.saveNarrative(view, mode)}>
                                <div className="green"><Glyphicon glyph="ok"/></div>
                            </InputGroup.Addon>
                            <InputGroup.Addon id="actionUndoEditNarrative" onClick={ () => this.undoNarrativeChange()}>
                                <div className="red"><Glyphicon glyph="arrow-left"/></div>
                            </InputGroup.Addon>
                            <InputGroup.Addon>
                                <div className="invisible"><Glyphicon glyph="star"/></div>
                            </InputGroup.Addon>
                        </InputGroup>
                    </div>;
            } else {
                narrativeHtml =
                    <InputGroup>
                        <div className={itemStyle}>
                            <Editor
                                editorState={this.state.editorState}
                                spellCheck={true}
                                ref="editorReadOnly"
                                blockStyleFn={this.blockStyles}
                                readOnly={true}
                            />
                        </div>
                        <InputGroup.Addon id="actionEditNarrative" onClick={ () => this.editNarrative()}>
                            <div className="blue"><Glyphicon glyph="edit"/></div>
                        </InputGroup.Addon>
                        <InputGroup.Addon>
                            <div className="invisible"><Glyphicon glyph="star"/></div>
                        </InputGroup.Addon>
                        <InputGroup.Addon>
                            <div className="invisible"><Glyphicon glyph="star"/></div>
                        </InputGroup.Addon>
                    </InputGroup>;

            }
        }

        // Finally, are we displaying the test summary as well as the design component?
        if(testSummary){
            return(
                <Grid>
                    <Row>
                        <Col md={7} className="close-col">
                            {narrativeHtml}
                        </Col>
                        <Col md={5} className="close-col">
                        </Col>
                    </Row>
                </Grid>
            );
        } else {
            return(narrativeHtml);
        }

    }
}

Narrative.propTypes = {
    designComponent: PropTypes.object.isRequired,
    updateComponent: PropTypes.object,
    wpComponent: PropTypes.object,
    mode: PropTypes.string.isRequired,
    displayContext: PropTypes.string.isRequired,
    view: PropTypes.string.isRequired,
    testSummary: PropTypes.bool.isRequired,
    displayOldValue: PropTypes.bool,
    domainTermsVisible: PropTypes.bool.isRequired
};