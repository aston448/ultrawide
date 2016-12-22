// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import DesignItemHeader from '../select/DesignItemHeader.jsx';
import MoveTarget from '../../components/edit/MoveTarget.jsx';
import SuggestedStepsContainer from '../../containers/edit/SuggestedStepsContainer.jsx';

// Ultrawide Services
import {ViewType, ComponentType, ViewMode, DisplayContext, ScenarioStepStatus, ScenarioStepType, StepContext, MashTestStatus } from '../../../constants/constants.js';
import ClientScenarioStepServices from '../../../apiClient/apiClientScenarioStep.js';
import ClientDomainDictionaryServices from '../../../apiClient/apiClientDomainDictionary.js';
import ClientMashDataServices from '../../../apiClient/apiClientMashData.js';


// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';
import {InputGroup, FormControl} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

// REDUX services

// React DnD - Component is draggable
import { DragSource } from 'react-dnd';

// Draft JS
import {Editor, EditorState, ContentState, RichUtils, DefaultDraftBlockRenderMap, convertFromRaw, convertToRaw, getDefaultKeyBinding, KeyBindingUtil, CompositeDecorator} from 'draft-js';
const {hasCommandModifier} = KeyBindingUtil;

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Scenario Component - Graphically represents one Scenario Step in one Scenario
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

class ScenarioStep extends Component {
    // Need to ensure that properties of scenarioStep are satisfied by both Design Scenario Step AND Dev Mash data

    constructor(props) {
        super(props);

        this.state = {
            editable: false,
            highlighted: false,
            stepType: this.props.scenarioStep.stepType,
            stepText: '',
            editorState: EditorState.createEmpty()
        };

        this.onTextChange = (editorState) => {
            this.setState({editorState});
            this.setState({stepText: editorState.getCurrentContent().getPlainText()});
        };
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this.focus = () => {if(this.refs.editor){this.refs.editor.focus()}};



    }

    // Set up the view from persisted settings
    componentDidMount(){

        this.updateText();

        // New untouched items are editable...
        switch (this.props.view) {
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_UPDATE_EDIT:
                // A new component not yet changed is automatically editable
                if (this.props.scenarioStep.isNew && ! this.props.scenarioStep.isChanged) {
                    this.editStepText();
                }
                break;
        }
    }

    // Refresh the component name text
    updateText(newRawText){

        let currentContent = {};

        let compositeDecorator = new CompositeDecorator([
            {
                strategy:  ClientDomainDictionaryServices.getDomainTermDecoratorFunction(this.props.scenarioStep.designVersionId),
                component: DomainSpan,
            }
        ]);

        EditorState.set(this.state.editorState, {decorator: compositeDecorator});

        if(newRawText){
            // Immediate update of latest text
            console.log("Updating step editor with " + newRawText);
            currentContent = convertFromRaw(newRawText);
        } else {
            // Getting stored text
            let existingRawText = this.props.scenarioStep.stepTextRaw;

            if (existingRawText) {
                currentContent = convertFromRaw(existingRawText);
            } else {
                this.state = {editorState: EditorState.createEmpty(compositeDecorator)};
                return;
            }

        }

        // Got some content...
        //console.log("Updating step editor with " + currentContent.getPlainText());
        this.setState({stepText: currentContent.getPlainText()});

        // If editing update step suggestion

        if (currentContent.hasText()) {
            console.log("recreating txt");
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

        return getDefaultKeyBinding(e);
    }

    handleKeyCommand(command) {

        // Handle custom commands
        if(command === 'editor-save'){
            // Save the title on ENTER
            //console.log("Saving...");

            this.onSaveStepText(this.props.scenarioStep, this.state.stepType, this.props.view, this.props.mode, this.props.parentInScope, this.props.stepContext);
            return true;
        }

        // Default key commands
        const newState = RichUtils.handleKeyCommand(this.state.editorState, command);

        if (newState) {
            //console.log("New state...");
            this.onTextChange(newState);
            return true;
        }
        return false;
    }

    // Start editing the step
    editStepText(){
        event.preventDefault();
        //console.log("EDIT");
        this.setState({editable: true});
    }

    // Cancel editing the step
    undoStepTextEdit(){
        event.preventDefault();
        //console.log("UNDO");

        // Reset the text in case changed on screen
        this.updateText();
        this.setState({editable: false});
    }

    // Set step as selected
    setCurrentStep(){
        // TODO - will have to store current component
    }

    onSetStepType(e){
        //console.log("Setting step type to " + e.target.value);
        this.setState({stepType: e.target.value})
    }

    // Save changes to the step text
    onSaveStepText(step, stepType, view, mode, parentInScope, stepContext, newRawText){
        event.preventDefault();


        let plainText = this.state.editorState.getCurrentContent().getPlainText();
        let rawText = null;

        if(newRawText){
            rawText = newRawText;
        } else {
            rawText = convertToRaw(this.state.editorState.getCurrentContent());
        }

        console.log("UPDATE STEP TEXT with " + plainText);
        let success = ClientScenarioStepServices.updateScenarioStepText(view, mode, parentInScope, step._id, stepType, plainText, rawText, stepContext);

        if(success){
            // Finished editing
            this.setState({editable: false});
        } else {
            //console.log("Failed to update text");
        }

    }

    onAcceptStepText(newText){

         let newRawText = {
             "entityMap" : {  },
             "blocks" : [
                 { "key" : "5efv7", "text" : newText,
                     "type" : "unstyled",
                     "depth" : 0,
                     "inlineStyleRanges" : [ ],
                     "entityRanges" : [ ],
                     "data" : {  }
                 }
             ]
         };

        this.updateText(newRawText);

        this.onSaveStepText(this.props.scenarioStep, this.props.scenarioStep.stepType, this.props.view, this.props.mode, this.props.parentInScope, this.props.stepContext, newRawText);

    }

    // Called when deleting a step - could be an actual delete by the Designer or a logical delete in Development view
    onDeleteScenarioStep(step, view, mode, parentInScope, stepContext, displayContext, userContext){

        switch(displayContext) {
            case DisplayContext.EDIT_STEP_LINKED:
            case DisplayContext.EDIT_STEP_DEV:
            case DisplayContext.EDIT_STEP_DESIGN:
                // In these cases its a logical delete with cleanup of Mash data
                //console.log("LOGICAL DELETE STEP");
                ClientScenarioStepServices.logicalDeleteMashScenarioStep(view, mode, step, userContext);
                break;
            default:
                // Any other case actual delete of a Design item
                //console.log("REMOVE STEP");
                ClientScenarioStepServices.removeScenarioStep(view, mode, parentInScope, step._id, stepContext);
        }
    };


    render() {
        const {scenarioStep, parentInScope, view, mode, displayContext, stepContext, userContext, connectDragPreview, connectDragSource} = this.props;

        // TODO - add all the tooltips required
        const tooltipEdit = (
            <Tooltip id="modal-tooltip">
                Edit...
            </Tooltip>
        );

        let devStyle = '';
        let glyph = 'star';
        let index = '';

        switch(displayContext){
            case DisplayContext.EDIT_STEP_LINKED:
                //index = scenarioStep.mashItemIndex;
                switch(scenarioStep.mashTestStatus){
                    case MashTestStatus.MASH_PASS:
                        devStyle = 'green';
                        glyph = 'ok-circle';
                        break;
                    case MashTestStatus.MASH_FAIL:
                        devStyle = 'red';
                        glyph = 'remove-circle';
                        break;
                    default:
                        //devStyle = 'invisible';
                        break;
                }
                break;
            default:
                //index = scenarioStep.stepIndex
                //devStyle = 'invisible';
                break;
        }


        let stepClass = '';
        if(stepContext === StepContext.STEP_FEATURE_SCENARIO){
            stepClass = 'step-background'
        }

        // A step in the Design Dev Mash that is either in the Design ony or in Code only and can be dragged into the Linked steps
        let draggableUnlinkedStep =
            connectDragPreview(
                <div className={"readOnlyItem"}>
                    <InputGroup>
                        <InputGroup.Addon>
                            <div className={devStyle}>{index}<Glyphicon glyph={glyph}/></div>
                        </InputGroup.Addon>
                        <div>
                            <table className="scenario-step-editor">
                                <tbody>
                                <tr>
                                    <td className="scenario-step-type">
                                        <div>{this.state.stepType}</div>
                                    </td>
                                    <td>
                                        <div className="scenario-step-text">
                                            <Editor
                                                editorState={this.state.editorState}
                                                spellCheck={false}
                                                ref="editorReadOnly"
                                                readOnly={true}
                                            />
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <InputGroup.Addon onClick={ () => this.onDeleteScenarioStep(scenarioStep, view, mode, parentInScope, stepContext, displayContext, userContext)}>
                            <div className="red"><Glyphicon glyph="remove"/></div>
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

        // A step that is having its details edited
        let editingStep =
            <div>
                <table className="step-editor">
                    <tbody>
                    <tr>
                        <td>
                            <InputGroup>
                                <InputGroup.Addon>
                                    <div className={devStyle}><Glyphicon glyph={glyph}/></div>
                                </InputGroup.Addon>
                                <table className="scenario-step-editor">
                                    <tbody>
                                    <tr>
                                        <td className="scenario-step-type">
                                            <FormControl className="scenario-step-type-chooser" componentClass="select" value={this.state.stepType} placeholder={this.state.stepType} onChange={ (event) => this.onSetStepType(event)}>
                                                <option value={ScenarioStepType.STEP_NEW}>{ScenarioStepType.STEP_NEW}</option>
                                                <option value={ScenarioStepType.STEP_GIVEN}>{ScenarioStepType.STEP_GIVEN}</option>
                                                <option value={ScenarioStepType.STEP_WHEN}>{ScenarioStepType.STEP_WHEN}</option>
                                                <option value={ScenarioStepType.STEP_THEN}>{ScenarioStepType.STEP_THEN}</option>
                                                <option value={ScenarioStepType.STEP_AND}>{ScenarioStepType.STEP_AND}</option>
                                            </FormControl>
                                        </td>
                                        <td className="scenario-step-text">
                                            <div className="editableItem">
                                                <Editor
                                                    editorState={this.state.editorState}
                                                    handleKeyCommand={this.handleKeyCommand}
                                                    keyBindingFn={this.keyBindings}
                                                    onChange={this.onTextChange}
                                                    spellCheck={true}
                                                    ref="editor"
                                                    readOnly={!this.state.editable}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                <InputGroup.Addon onClick={ () => this.onSaveStepText(scenarioStep, this.state.stepType, view, mode, parentInScope, stepContext)}>
                                    <div className="green"><Glyphicon glyph="ok"/></div>
                                </InputGroup.Addon>
                                <InputGroup.Addon onClick={ () => this.undoStepTextEdit()}>
                                    <div className="red"><Glyphicon glyph="arrow-left"/></div>
                                </InputGroup.Addon>
                            </InputGroup>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <SuggestedStepsContainer params={{
                                designId: scenarioStep.designId,
                                currentStepId: scenarioStep._id,
                                currentInputText: this.state.stepText,
                                stepContext: stepContext,
                                callback: (newText) => this.onAcceptStepText(newText)
                            }}/>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>;

        // A step in Design view or in Design Dev Mash Linked steps that can be dragged to reorder it
        let draggableStep =
            connectDragPreview(
                <div className={"readOnlyItem"}>
                    <InputGroup>
                        <InputGroup.Addon>
                            <div className={devStyle}>{index}<Glyphicon glyph={glyph}/></div>
                        </InputGroup.Addon>
                        <div  onClick={ () => this.setCurrentStep()}>
                            <table className="scenario-step-editor">
                                <tbody>
                                <tr>
                                    <td className="scenario-step-type">
                                        <div>{this.state.stepType}</div>
                                    </td>
                                    <td>
                                        <div className="scenario-step-text">
                                            <Editor
                                                editorState={this.state.editorState}
                                                spellCheck={false}
                                                ref="editorReadOnly"
                                                readOnly={true}
                                            />
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <InputGroup.Addon onClick={ () => this.editStepText()}>
                            <OverlayTrigger overlay={tooltipEdit}>
                                <a href="#">
                                    <div className="blue"><Glyphicon glyph="edit"/></div>
                                </a>
                            </OverlayTrigger>
                        </InputGroup.Addon>
                        <InputGroup.Addon onClick={ () => this.onDeleteScenarioStep(scenarioStep, view, mode, parentInScope, stepContext, displayContext, userContext)}>
                            <div className="red"><Glyphicon glyph="remove"/></div>
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

        // Read-only view of a Step
        let viewOnlyStep =
            <div className={"readOnlyItem"}>
                <InputGroup>
                    <InputGroup.Addon>
                        <div className={devStyle}>{index}<Glyphicon glyph={glyph}/></div>
                    </InputGroup.Addon>
                    <div  onClick={ () => this.setCurrentStep()}>
                        <table>
                            <tbody>
                            <tr className={stepClass}>
                                <td>
                                    <div className="scenario-step-type">{this.state.stepType}</div>
                                </td>
                                <td>
                                    <div className="scenario-step-text">
                                        <Editor
                                            editorState={this.state.editorState}
                                            spellCheck={false}
                                            ref="editorReadOnly"
                                            readOnly={true}
                                        />
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </InputGroup>
            </div>


        // Read only if in View mode or if step is background step in a Scenario context
        if(mode === ViewMode.MODE_VIEW || stepContext === StepContext.STEP_FEATURE_SCENARIO){
            // View mode on
            return (
                <div>
                    {viewOnlyStep}
                </div>
            )
        } else {
            switch(displayContext){
                case DisplayContext.EDIT_STEP_DESIGN:
                case DisplayContext.EDIT_STEP_DEV:
                    // For unlinked steps outside the core design - you can drag them in to the design or delete them
                    return (
                        <div>
                            {draggableUnlinkedStep}
                        </div>
                    );
                    break;
                default:
                    // Anything else is in the main step editor and has a move target if not currently editing
                    if (this.state.editable) {
                        // Editing allowed
                        return (
                            <div>
                                {editingStep}
                            </div>
                        )
                    } else {
                        return (
                            <div>
                                <MoveTarget
                                    currentItem={scenarioStep}
                                    displayContext={displayContext}
                                    mode={mode}
                                />
                                {draggableStep}
                            </div>
                        )
                    }
            }

        }
    }
}

ScenarioStep.propTypes = {
    scenarioStep: PropTypes.object.isRequired,
    parentInScope: PropTypes.bool.isRequired,
    mode: PropTypes.string.isRequired,
    view: PropTypes.string.isRequired,
    displayContext: PropTypes.string.isRequired,
    stepContext: PropTypes.string.isRequired,
    userContext: PropTypes.object.isRequired
};

// NOTE: Redux and ReactDnD don't seem to interact - can't get Redux props in React DnD

// React DnD ===========================================================================================================

// Properties required to control the drag
const componentSource = {

    // Start of drag gets the item being dragged
    beginDrag(props) {
        //console.log("DRAG!");
        return {
            component: props.scenarioStep,
            displayContext: props.displayContext
        }
    },

    // End of drag sees if it is allowed to be dropped and if so calls functions to update the data accordingly
    endDrag(props, monitor, component){

        //console.log("END DRAG!");

        if (!monitor.didDrop) {
            //console.log("NO DROP");
            return;
        }

        const item = monitor.getItem();
        const dropResult = monitor.getDropResult();

        if (dropResult) {
            if(dropResult.dragType === 'MOVE_REORDER') {
                // Drop action when moving an item in the list to reorder it
                //console.log("DROP - REORDER");

                switch(props.displayContext){
                    case DisplayContext.EDIT_STEP_DESIGN:   // Adding design Step to Dev
                    case DisplayContext.EDIT_STEP_DEV:      // Adding Dev Step to Design
                        //console.log("RELOCATE MASH STEP");
                        ClientMashDataServices.relocateMashStep(props.view, props.mode, dropResult.displayContext, item.component, dropResult.targetItem, props.userContext);
                        break;
                    case DisplayContext.EDIT_STEP_LINKED:   // Reordering shared Design / Dev steps
                        // Reorder linked mas steps
                        //console.log("REORDER MASH");

                        break;
                    default:
                        // Just reordering the steps in this current list
                        //console.log("REORDER STEPS");
                        ClientScenarioStepServices.reorderComponent(props.view, props.mode, props.displayContext, item.component, dropResult.targetItem);
                }
            }
        } else {
            //console.log("NO DROP RESULT");
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
ScenarioStep = DragSource(ComponentType.DRAGGABLE_ITEM, componentSource, collectSource)(ScenarioStep);

// =====================================================================================================================

export default ScenarioStep;